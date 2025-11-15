import { Colors } from '@/constants/theme';
import { useAppState } from '@/providers/app-state-provider';
import { useTheme } from '@/providers/theme-provider';
import { useRouter } from 'expo-router';
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail, updateProfile } from 'firebase/auth';
import { ArrowLeft, Camera, Link as LinkIcon, Mail, Phone, User } from 'lucide-react-native';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EditProfileScreen() {
  const { colorScheme } = useTheme();
  const { user } = useAppState();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const palette = Colors[colorScheme ?? 'light'];
  const styles = createStyles(palette, insets, colorScheme);

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);

  const handleSave = async () => {
    if (!user) {
      setError('User not found');
      return;
    }

    if (!displayName.trim()) {
      setError('Display name is required');
      return;
    }

    // Validate email format if changed
    if (email !== user.email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError('Please enter a valid email address');
        return;
      }
    }

    setIsLoading(true);
    setError('');

    try {
      const updates: { displayName?: string; photoURL?: string } = {};
      
      // Update displayName if changed
      if (displayName.trim() !== (user.displayName || '')) {
        updates.displayName = displayName.trim();
      }
      
      // Update photoURL if changed
      if (photoURL.trim() !== (user.photoURL || '')) {
        updates.photoURL = photoURL.trim() || undefined;
      }
      
      // Update profile fields
      if (Object.keys(updates).length > 0) {
        await updateProfile(user, updates);
      }
      
      // Update email if changed (requires re-authentication)
      if (email.trim() !== user.email && email.trim()) {
        if (!currentPassword) {
          setError('Current password is required to change email');
          setIsLoading(false);
          setShowPasswordField(true);
          return;
        }
        
        // Re-authenticate user
        const credential = EmailAuthProvider.credential(user.email || '', currentPassword);
        await reauthenticateWithCredential(user, credential);
        
        // Update email
        await updateEmail(user, email.trim());
      }
      
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      console.error('Update profile error:', err);
      if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use by another account.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError(err.message || 'Failed to update profile. Please try again.');
      }
      setIsLoading(false);
    }
  };

  const handleChangePhoto = () => {
    // Focus on photo URL input or show hint
    // The photo URL input is already available in the form
    // This button can be used for future photo upload functionality
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={palette.foreground} />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <Pressable
          onPress={handleSave}
          disabled={
            isLoading ||
            !displayName.trim() ||
            !!(email !== user?.email && email.trim() && !currentPassword)
          }
          style={[
            styles.saveButton,
            (isLoading ||
              !displayName.trim() ||
              (email !== user?.email && email.trim() && !currentPassword)) &&
              styles.saveButtonDisabled,
          ]}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={palette.primaryForeground} />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Photo Section */}
        <View style={styles.photoSection}>
          <View style={styles.profileImageContainer}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
            ) : (
              <View style={styles.profilePlaceholder}>
                <User size={60} color={palette.mutedForeground} />
              </View>
            )}
            <Pressable style={styles.cameraButton} onPress={handleChangePhoto}>
              <Camera size={20} color={palette.foreground} />
            </Pressable>
          </View>
          <Text style={styles.photoHint}>Tap to change photo</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Display Name</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={(text) => {
                setDisplayName(text);
                setError('');
              }}
              placeholder="Enter your name"
              placeholderTextColor={palette.mutedForeground}
              autoCapitalize="words"
              maxLength={50}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Mail size={16} color={palette.mutedForeground} style={styles.labelIcon} />
              <Text style={styles.label}>Email</Text>
            </View>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
                if (text !== user?.email) {
                  setShowPasswordField(true);
                }
              }}
              placeholder="Enter your email"
              placeholderTextColor={palette.mutedForeground}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            {email !== user?.email && (
              <Text style={styles.hint}>Password required to change email</Text>
            )}
          </View>

          {showPasswordField && email !== user?.email && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Password</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={(text) => {
                  setCurrentPassword(text);
                  setError('');
                }}
                placeholder="Enter your current password"
                placeholderTextColor={palette.mutedForeground}
                secureTextEntry
                autoCapitalize="none"
              />
              <Text style={styles.hint}>Required to change email address</Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Phone size={16} color={palette.mutedForeground} style={styles.labelIcon} />
              <Text style={styles.label}>Phone Number</Text>
            </View>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter your phone number (e.g., +1234567890)"
              placeholderTextColor={palette.mutedForeground}
              keyboardType="phone-pad"
              autoComplete="tel"
            />
            <Text style={styles.hint}>Phone number verification coming soon</Text>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <LinkIcon size={16} color={palette.mutedForeground} style={styles.labelIcon} />
              <Text style={styles.label}>Photo URL</Text>
            </View>
            <View style={styles.photoUrlContainer}>
              <TextInput
                style={[styles.input, styles.photoUrlInput]}
                value={photoURL}
                onChangeText={(text) => {
                  setPhotoURL(text);
                  setError('');
                }}
                placeholder="Enter photo URL or tap camera icon"
                placeholderTextColor={palette.mutedForeground}
                keyboardType="url"
                autoCapitalize="none"
                autoComplete="off"
              />
              <Pressable style={styles.photoUrlButton} onPress={handleChangePhoto}>
                <Camera size={20} color={palette.foreground} />
              </Pressable>
            </View>
          </View>


          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(
  palette: typeof Colors.light,
  insets: ReturnType<typeof useSafeAreaInsets>,
  colorScheme?: 'light' | 'dark' | null,
) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: insets.top/1.3,
      paddingBottom: 16,
      paddingHorizontal: 16,
      backgroundColor: palette.background,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: palette.foreground,
      flex: 1,
      textAlign: 'center',
      marginHorizontal: 16,
    },
    saveButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: palette.primary,
      minWidth: 60,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveButtonDisabled: {
      opacity: 0.5,
    },
    saveButtonText: {
      color: palette.primaryForeground,
      fontSize: 16,
      fontWeight: '600',
    },
    scrollView: {
      flex: 1,
    },
    photoSection: {
      alignItems: 'center',
      paddingVertical: 32,
      paddingHorizontal: 16,
    },
    profileImageContainer: {
      position: 'relative',
      width: 120,
      height: 120,
      borderRadius: 60,
      overflow: 'hidden',
      marginBottom: 12,
      backgroundColor: palette.card,
    },
    profileImage: {
      width: '100%',
      height: '100%',
    },
    profilePlaceholder: {
      width: '100%',
      height: '100%',
      backgroundColor: palette.muted,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cameraButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: palette.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: palette.background,
    },
    photoHint: {
      fontSize: 14,
      color: palette.mutedForeground,
    },
    formSection: {
      paddingHorizontal: 16,
      paddingBottom: 32,
    },
    inputGroup: {
      marginBottom: 24,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: palette.foreground,
      marginBottom: 8,
    },
    input: {
      backgroundColor: palette.card,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 16,
      fontSize: 16,
      color: palette.foreground,
      ...(colorScheme === 'light' && {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }),
    },
    inputDisabled: {
      opacity: 0.6,
    },
    inputDisabledText: {
      color: palette.mutedForeground,
      fontSize: 16,
    },
    hint: {
      fontSize: 12,
      color: palette.mutedForeground,
      marginTop: 4,
    },
    errorContainer: {
      marginTop: 8,
      padding: 12,
      backgroundColor: palette.destructive + '20',
      borderRadius: 8,
    },
    errorText: {
      fontSize: 14,
      color: palette.destructive,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    labelIcon: {
      marginRight: 6,
    },
    photoUrlContainer: {
      flexDirection: 'row',
      gap: 8,
    },
    photoUrlInput: {
      flex: 1,
    },
    photoUrlButton: {
      width: 56,
      height: 56,
      borderRadius: 12,
      backgroundColor: palette.card,
      justifyContent: 'center',
      alignItems: 'center',
    },
    photoPreview: {
      marginTop: 12,
      alignItems: 'center',
    },
    photoPreviewImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 8,
    },
    readOnlySection: {
      marginTop: 32,
      paddingTop: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: palette.foreground,
      marginBottom: 16,
    },
    readOnlyItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
    },
    readOnlyLabel: {
      fontSize: 14,
      color: palette.mutedForeground,
      fontWeight: '500',
    },
    readOnlyValue: {
      fontSize: 14,
      color: palette.foreground,
      flex: 1,
      textAlign: 'right',
      marginLeft: 16,
    },
  });
}

