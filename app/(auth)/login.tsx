import { AuthInput } from '@/components/auth/auth-input';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { signIn } from '@/lib/firebase-auth';
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

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const styles = createStyles(palette);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);

    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Failed to log in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password flow
    router.push('/(auth)/forgot-password');
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
          <Text style={styles.title}>Log in</Text>
        </View>

        <View style={styles.form}>
          <AuthInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <AuthInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={error}
          />
          <Pressable onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>
              Forget password? <Text style={styles.resetLink}>Reset it</Text>
            </Text>
          </Pressable>

          <Pressable
            onPress={handleLogin}
            disabled={isLoading || !email || !password}
            style={[
              styles.loginButton,
              (isLoading || !email || !password) && styles.loginButtonDisabled,
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Log in</Text>
            )}
          </Pressable>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <Pressable onPress={() => router.push('/(auth)/signup')}>
              <Text style={styles.signupLink}>Sign up</Text>
            </Pressable>
          </View>
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
    forgotPasswordContainer: {
      marginTop: -8,
      marginBottom: 24,
      alignSelf: 'flex-start',
    },
    forgotPasswordText: {
      fontSize: 14,
      color: palette.mutedForeground,
    },
    resetLink: {
      color: palette.primary,
      fontWeight: '600',
    },
    errorText: {
      fontSize: 14,
      color: '#EF4444',
      marginTop: -8,
      marginBottom: 16,
      marginLeft: 4,
    },
    loginButton: {
      backgroundColor: palette.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
      minHeight: 56,
    },
    loginButtonDisabled: {
      opacity: 0.5,
    },
    loginButtonText: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '600',
    },
    signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 24,
    },
    signupText: {
      fontSize: 14,
      color: palette.mutedForeground,
    },
    signupLink: {
      fontSize: 14,
      color: palette.primary,
      fontWeight: '600',
    },
  });
}

