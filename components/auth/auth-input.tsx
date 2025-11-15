import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AuthInputProps = TextInputProps & {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
};

export function AuthInput({
  label,
  error,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  ...props
}: AuthInputProps) {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const styles = createStyles(palette);

  const showPasswordToggle = secureTextEntry && !rightIcon;
  const displaySecureTextEntry = secureTextEntry && !isPasswordVisible;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputContainerError]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={palette.mutedForeground}
          secureTextEntry={displaySecureTextEntry}
          {...props}
        />
        {showPasswordToggle && (
          <Pressable
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.iconButton}
          >
            <Text style={styles.iconText}>{isPasswordVisible ? '👁️' : '👁️‍🗨️'}</Text>
          </Pressable>
        )}
        {rightIcon && (
          <Pressable onPress={onRightIconPress} style={styles.iconButton}>
            {rightIcon}
          </Pressable>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

function createStyles(palette: typeof Colors.light) {
  return StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: palette.foreground,
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: palette.muted,
      borderRadius: 12,
      backgroundColor: palette.card,
      paddingHorizontal: 16,
      minHeight: 56,
    },
    inputContainerError: {
      borderColor: '#EF4444',
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: palette.foreground,
      paddingVertical: 16,
    },
    iconButton: {
      padding: 8,
      marginLeft: 8,
    },
    iconText: {
      fontSize: 20,
    },
    errorText: {
      fontSize: 12,
      color: '#EF4444',
      marginTop: 4,
      marginLeft: 4,
    },
  });
}

