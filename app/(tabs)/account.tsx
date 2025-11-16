import { Colors } from '@/constants/theme';
import { useAppState } from '@/providers/app-state-provider';
import { useTheme } from '@/providers/theme-provider';
import {
  ArrowUpDown,
  ChevronRight,
  CreditCard,
  Heart,
  HelpCircle,
  LogIn,
  LogOut,
  Pencil,
  Settings,
  User,
  UserPlus,
} from 'lucide-react-native';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { signOutUser } from '@/lib/firebase-auth';
import { useRouter } from 'expo-router';

type MenuItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  onPress: () => void;
  isDestructive?: boolean;
};

export default function AccountScreen() {
  const { colorScheme } = useTheme();
  const { user, isAuthenticated } = useAppState();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const palette = Colors[colorScheme ?? 'light'];
  const styles = createStyles(palette, insets, colorScheme);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const email = user?.email || 'user@example.com';
  const profileImageUrl = user?.photoURL;

  const handleLogout = async () => {
    try {
      await signOutUser();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleSignUp = () => {
    router.push('/(auth)/signup');
  };

  // Menu items for authenticated users
  const authenticatedMenuItems: MenuItem[] = [
    {
      id: 'edit-profile',
      label: 'Edit Profile',
      icon: ({ size, color }) => (
        <View style={styles.iconContainer}>
          <User size={size} color={color} />
          <Pencil size={size * 0.6} color={color} style={styles.editIcon} />
        </View>
      ),
      onPress: () => {
        router.push('/edit-profile');
      },
    },
    {
      id: 'payment',
      label: 'Payment Methods',
      icon: CreditCard,
      onPress: () => {
        // TODO: Navigate to payment methods
        console.log('Payment Methods');
      },
    },
    {
      id: 'saved',
      label: 'Saved',
      icon: Heart,
      onPress: () => {
        // TODO: Navigate to saved items
        console.log('Saved');
      },
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: ArrowUpDown,
      onPress: () => {
        // TODO: Navigate to transactions
        console.log('Transactions');
      },
    },
    {
      id: 'help',
      label: 'Help Center',
      icon: HelpCircle,
      onPress: () => {
        router.push('/help-center');
      },
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      onPress: () => {
        router.push('/settings');
      },
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: LogOut,
      onPress: handleLogout,
      isDestructive: true,
    },
  ];

  // Menu items for non-authenticated users (public)
  const publicMenuItems: MenuItem[] = [
    {
      id: 'help',
      label: 'Help Center',
      icon: HelpCircle,
      onPress: () => {
        router.push('/help-center');
      },
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      onPress: () => {
        router.push('/settings');
      },
    },
  ];

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Auth Section */}
          <View style={styles.authSection}>
            <View style={styles.authIconContainer}>
              <User size={48} color={palette.primary} />
            </View>
            <Text style={styles.authTitle}>Welcome to NIDL</Text>
            <Text style={styles.authDescription}>
              Sign in to access your profile, bookings, and saved items
            </Text>

            {/* Auth Buttons */}
            <View style={styles.authButtonsContainer}>
              <Pressable
                style={[styles.authButton, styles.primaryButton]}
                onPress={handleLogin}
                android_ripple={{ color: palette.primaryForeground }}
              >
                <LogIn size={20} color={palette.primaryForeground} />
                <Text style={styles.primaryButtonText}>Sign In</Text>
              </Pressable>

              <Pressable
                style={[styles.authButton, styles.secondaryButton]}
                onPress={handleSignUp}
                android_ripple={{ color: palette.muted }}
              >
                <UserPlus size={20} color={palette.foreground} />
                <Text style={styles.secondaryButtonText}>Create Account</Text>
              </Pressable>
            </View>
          </View>

          {/* Public Menu Items */}
          <View style={styles.menuSection}>
            {publicMenuItems.map((item) => {
              const IconComponent = item.icon;
              const iconColor = item.isDestructive ? palette.destructive : palette.foreground;
              const textColor = item.isDestructive ? palette.destructive : palette.foreground;

              return (
                <Pressable
                  key={item.id}
                  style={styles.menuItem}
                  onPress={item.onPress}
                  android_ripple={{ color: palette.muted }}
                >
                  <IconComponent size={20} color={iconColor} />
                  <Text style={[styles.menuItemText, { color: textColor }]}>{item.label}</Text>
                  <ChevronRight size={20} color={palette.mutedForeground} />
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {profileImageUrl ? (
              <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
            ) : (
              <View style={styles.profilePlaceholder}>
                <User size={40} color={palette.foreground} />
              </View>
            )}
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {authenticatedMenuItems.map((item) => {
            const IconComponent = item.icon;
            const iconColor = item.isDestructive ? palette.destructive : palette.foreground;
            const textColor = item.isDestructive ? palette.destructive : palette.foreground;

            return (
              <Pressable
                key={item.id}
                style={styles.menuItem}
                onPress={item.onPress}
                android_ripple={{ color: palette.muted }}
              >
                <IconComponent size={20} color={iconColor} />
                <Text style={[styles.menuItemText, { color: textColor }]}>{item.label}</Text>
                <ChevronRight size={20} color={palette.mutedForeground} />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
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
      paddingTop: insets.top + 8,
      paddingBottom: 16,
      paddingHorizontal: 16,
      backgroundColor: palette.background,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: '700',
      color: palette.foreground,
    },
    scrollView: {
      flex: 1,
    },
    profileSection: {
      alignItems: 'center',
      paddingVertical: 32,
      paddingHorizontal: 16,
      marginBottom: 8,
    },
    profileImageContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      overflow: 'hidden',
      marginBottom: 16,
      backgroundColor: palette.card,
      borderWidth: 2,
      borderColor: palette.border,
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
    userName: {
      fontSize: 24,
      fontWeight: '700',
      color: palette.foreground,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
      color: palette.mutedForeground,
    },
    menuSection: {
      paddingHorizontal: 16,
      paddingBottom: 32,
      paddingTop: 8,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.card,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 16,
      marginBottom: 12,
      gap: 12,
      ...(colorScheme === 'light' && {
        borderWidth: 1,
        borderColor: palette.border,
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
    iconContainer: {
      position: 'relative',
      width: 20,
      height: 20,
    },
    editIcon: {
      position: 'absolute',
      bottom: -2,
      right: -2,
    },
    menuItemText: {
      flex: 1,
      fontSize: 16,
      fontWeight: '500',
      color: palette.foreground,
    },
    authSection: {
      alignItems: 'center',
      paddingVertical: 48,
      paddingHorizontal: 16,
      marginBottom: 8,
    },
    authIconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: palette.muted,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    authTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: palette.foreground,
      marginBottom: 8,
      textAlign: 'center',
    },
    authDescription: {
      fontSize: 16,
      color: palette.mutedForeground,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 32,
      paddingHorizontal: 16,
    },
    authButtonsContainer: {
      width: '100%',
      gap: 12,
      paddingHorizontal: 16,
    },
    authButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 24,
      gap: 8,
    },
    primaryButton: {
      backgroundColor: palette.primary,
    },
    secondaryButton: {
      backgroundColor: palette.card,
      borderWidth: 1,
      borderColor: palette.border,
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
    primaryButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: palette.primaryForeground,
    },
    secondaryButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: palette.foreground,
    },
  });
}
