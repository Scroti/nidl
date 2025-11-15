import { Pressable, StyleSheet, Text, View, Image } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type SocialAuthButtonProps = {
  provider: 'apple' | 'google' | 'facebook';
  onPress: () => void;
};

export function SocialAuthButton({ provider, onPress }: SocialAuthButtonProps) {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const styles = createStyles(palette, colorScheme);

  const providerConfig = {
    apple: {
      label: 'Continue with Apple',
      icon: '🍎',
      backgroundColor: '#000000',
      textColor: '#FFFFFF',
      borderColor: '#000000',
    },
    google: {
      label: 'Continue with Google',
      icon: null, // We'll use SVG/Text instead
      backgroundColor: colorScheme === 'dark' ? '#1F1F1F' : '#FFFFFF',
      textColor: colorScheme === 'dark' ? '#E8EAED' : '#3C4043',
      borderColor: colorScheme === 'dark' ? '#5F6368' : '#DADCE0',
    },
    facebook: {
      label: 'Continue with Facebook',
      icon: 'f',
      backgroundColor: '#1877F2',
      textColor: '#FFFFFF',
      borderColor: '#1877F2',
    },
  };

  const config = providerConfig[provider];

  // Google icon SVG as text/emoji fallback
  const GoogleIcon = () => (
    <View style={styles.googleIconContainer}>
      <Text style={styles.googleIconText}>G</Text>
    </View>
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { 
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
        },
        pressed && styles.buttonPressed,
      ]}
    >
      <View style={styles.content}>
        {provider === 'google' ? (
          <GoogleIcon />
        ) : (
          <Text style={[styles.icon, { color: config.textColor }]}>{config.icon}</Text>
        )}
        <Text style={[styles.label, { color: config.textColor }]}>{config.label}</Text>
      </View>
    </Pressable>
  );
}

function createStyles(palette: typeof Colors.light, colorScheme?: 'light' | 'dark' | null) {
  return StyleSheet.create({
    button: {
      borderRadius: 12,
      paddingVertical: 16,
      marginBottom: 12,
      borderWidth: 1,
      minHeight: 56,
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
    buttonPressed: {
      opacity: 0.8,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      fontSize: 20,
      fontWeight: '600',
      marginRight: 12,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
    },
    googleIconContainer: {
      width: 20,
      height: 20,
      marginRight: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    googleIconText: {
      fontSize: 18,
      fontWeight: '700',
      color: '#4285F4',
    },
  });
}

