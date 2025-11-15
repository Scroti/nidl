import { AuthInput } from '@/components/auth/auth-input';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { resetPassword } from '@/lib/firebase-auth';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function ForgotPasswordScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const styles = createStyles(palette);

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
          <Text style={styles.title}>Reset Password</Text>
        </View>

        <View style={styles.form}>
          {success ? (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>
                Password reset email sent! Check your inbox and follow the instructions to reset
                your password.
              </Text>
              <Pressable
                onPress={() => router.push('/(auth)/login')}
                style={styles.backToLoginButton}
              >
                <Text style={styles.backToLoginText}>Back to Log in</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <Text style={styles.description}>
                Enter your email address and we'll send you a link to reset your password.
              </Text>

              <AuthInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={error}
              />

              <Pressable
                onPress={handleResetPassword}
                disabled={isLoading || !email}
                style={[styles.resetButton, (isLoading || !email) && styles.resetButtonDisabled]}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.resetButtonText}>Send Reset Link</Text>
                )}
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(palette: typeof Colors.light) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    scrollContent: {
      flexGrow: 1,
      padding: 24,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 60,
      marginBottom: 32,
    },
    backButton: {
      padding: 8,
      marginRight: 16,
    },
    backIcon: {
      fontSize: 24,
      fontWeight: '600',
      color: palette.foreground,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: palette.foreground,
    },
    form: {
      flex: 1,
    },
    description: {
      fontSize: 16,
      color: palette.mutedForeground,
      marginBottom: 24,
      lineHeight: 24,
    },
    resetButton: {
      backgroundColor: palette.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
      minHeight: 56,
    },
    resetButtonDisabled: {
      opacity: 0.5,
    },
    resetButtonText: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '600',
    },
    successContainer: {
      marginTop: 24,
    },
    successText: {
      fontSize: 16,
      color: palette.foreground,
      lineHeight: 24,
      marginBottom: 24,
    },
    backToLoginButton: {
      backgroundColor: palette.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 56,
    },
    backToLoginText: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '600',
    },
  });
}

