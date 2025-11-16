import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Phone } from 'lucide-react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type PhoneOTPInputProps = {
  phone: string;
  otp: string;
  onPhoneChange: (phone: string) => void;
  onOtpChange: (otp: string) => void;
  error?: string;
  showOtp?: boolean;
};

export function PhoneOTPInput({
  phone,
  otp,
  onPhoneChange,
  onOtpChange,
  error,
  showOtp = false,
}: PhoneOTPInputProps) {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const styles = createStyles(palette);

  return (
    <View>
      <View style={styles.inputContainer}>
        <Phone size={20} color={palette.mutedForeground} />
        <TextInput
          style={styles.input}
          placeholder="Phone number (e.g., +1234567890)"
          placeholderTextColor={palette.mutedForeground}
          value={phone}
          onChangeText={onPhoneChange}
          keyboardType="phone-pad"
          autoComplete="tel"
          maxLength={20}
        />
      </View>
      {showOtp && (
        <View style={styles.inputContainer}>
          <Text style={styles.otpLabel}>OTP</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 6-digit code"
            placeholderTextColor={palette.mutedForeground}
            value={otp}
            onChangeText={onOtpChange}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function createStyles(palette: typeof Colors.light) {
  return StyleSheet.create({
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginBottom: 12,
      gap: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: palette.foreground,
      fontWeight: '500',
    },
    otpLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: palette.foreground,
      minWidth: 40,
    },
    errorText: {
      fontSize: 14,
      color: '#EF4444',
      marginTop: -8,
      marginBottom: 8,
      marginLeft: 4,
    },
  });
}

