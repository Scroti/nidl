import LottieView from 'lottie-react-native';
import { useMemo } from 'react';
import {
    Animated,
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type OnboardingSlideProps = {
  index: number;
  total: number;
  title: string;
  subtitle: string;
  description: string;
  primaryLabel: string;
  onPrimaryPress: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
  onSkip?: () => void;
  onBack?: () => void;
  animation?: any;
  scrollX?: Animated.Value;
};

export function OnboardingSlide({
  index,
  total,
  title,
  subtitle,
  description,
  primaryLabel,
  onPrimaryPress,
  secondaryLabel,
  onSecondaryPress,
  onSkip,
  onBack,
  animation,
  scrollX,
}: OnboardingSlideProps) {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const styles = useMemo(() => createStyles(palette), [palette]);

  const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];

  const heroOpacity = scrollX
    ? scrollX.interpolate({
        inputRange,
        outputRange: [0, 1, 0],
        extrapolate: 'clamp',
      })
    : 1;

  const heroTranslateX = scrollX
    ? scrollX.interpolate({
        inputRange,
        outputRange: [SCREEN_WIDTH * 0.3, 0, -SCREEN_WIDTH * 0.3],
        extrapolate: 'clamp',
      })
    : 0;

  const cardOpacity = scrollX
    ? scrollX.interpolate({
        inputRange,
        outputRange: [0, 1, 0],
        extrapolate: 'clamp',
      })
    : 1;

  const cardTranslateY = scrollX
    ? scrollX.interpolate({
        inputRange,
        outputRange: [50, 0, 50],
        extrapolate: 'clamp',
      })
    : 0;

  const cardScale = scrollX
    ? scrollX.interpolate({
        inputRange,
        outputRange: [0.9, 1, 0.9],
        extrapolate: 'clamp',
      })
    : 1;

  return (
    <View style={[styles.container, { width }]}>
      <View style={styles.headerRow}>
        <Pressable disabled={!onBack} onPress={onBack} style={styles.headerButton}>
          {({ pressed }) => (
            <Text
              style={[
                styles.headerButtonLabel,
                !onBack && styles.headerButtonLabelDisabled,
                pressed && styles.headerButtonLabelPressed,
              ]}
            >
              ‹
            </Text>
          )}
        </Pressable>
        <Pressable onPress={onSkip} style={styles.headerButton}>
          {({ pressed }) => (
            <Text style={[styles.skipLabel, pressed && styles.skipLabelPressed]}>Skip</Text>
          )}
        </Pressable>
      </View>

      {animation ? (
        <Animated.View
          style={[
            styles.heroImage,
            { width },
            {
              opacity: heroOpacity,
              transform: [{ translateX: heroTranslateX }],
            },
          ]}
        >
          <LottieView
            source={animation}
            autoPlay
            loop
            style={styles.heroImageContent}
            resizeMode="contain"
          />
        </Animated.View>
      ) : (
        <View style={[styles.heroImage, { width, backgroundColor: palette.secondary }]} />
      )}

      <Animated.View
        style={[
          styles.card,
          {
            opacity: cardOpacity,
            transform: [{ translateY: cardTranslateY }, { scale: cardScale }],
          },
        ]}
      >
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        <View style={styles.progressBar}>
          {Array.from({ length: total }).map((_, step) => (
            <View
              key={step}
              style={[styles.progressSegment, step === index && styles.progressSegmentActive]}
            />
          ))}
        </View>

        <Pressable
          onPress={() => {
            if (onPrimaryPress) {
              onPrimaryPress();
            }
          }}
          style={styles.primaryCta}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
        >
          {({ pressed }) => (
            <View style={[styles.primaryCtaSurface, pressed && styles.primaryCtaPressed]}>
              <Text style={styles.primaryCtaLabel}>{primaryLabel}</Text>
            </View>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
}

type Palette = typeof Colors.light;

function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) {
    return hex;
  }
  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
  return `#${normalized}${alphaHex}`;
}

function createStyles(palette: Palette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.secondary,
      paddingTop: 48,
      paddingBottom: 0,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    headerButton: {
      padding: 12,
    },
    headerButtonLabel: {
      fontSize: 30,
      fontWeight: '700',
      color: palette.foreground,
    },
    headerButtonLabelDisabled: {
      opacity: 0,
    },
    headerButtonLabelPressed: {
      opacity: 0.5,
    },
    skipLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: palette.foreground,
    },
    skipLabelPressed: {
      opacity: 0.6,
    },
    heroImage: {
      width: '100%',
      height: 380,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    heroImageContent: {
      width: '100%',
      height: '100%',
    },
    card: {
      backgroundColor: palette.card,
      borderTopLeftRadius: 36,
      borderTopRightRadius: 36,
      height: 410,
      paddingTop: 28,
      paddingBottom: 0,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: -16 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 14,
      marginHorizontal: 0,
      marginTop: 45,
      paddingHorizontal: 32,
      justifyContent: 'flex-start',
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '600',
      color: palette.primary,
      marginBottom: 12,
      lineHeight: 24,
      height: 48,
    },
    title: {
      fontSize: 26,
      fontWeight: '700',
      color: palette.foreground,
      marginBottom: 12,
      lineHeight: 32,
      height: 64,
    },
    description: {
      fontSize: 16,
      lineHeight: 22,
      color: palette.mutedForeground,
      height: 66,
    },
    progressBar: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 12,
      marginTop: 24,
    },
    progressSegment: {
      width: 28,
      height: 6,
      borderRadius: 4,
      backgroundColor: palette.muted,
    },
    progressSegmentActive: {
      width: 36,
      backgroundColor: palette.foreground,
    },
    primaryCta: {
      marginTop: 24,
    },
    primaryCtaSurface: {
      backgroundColor: palette.foreground,
      paddingVertical: 16,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 56,
    },
    primaryCtaPressed: {
      opacity: 0.85,
    },
    primaryCtaLabel: {
      color: palette.background,
      fontSize: 17,
      fontWeight: '600',
    },
    secondaryCta: {
      marginTop: 18,
    },
    secondaryCtaSurface: {
      borderWidth: 2,
      borderColor: palette.foreground,
      paddingVertical: 16,
      borderRadius: 999,
      alignItems: 'center',
    },
    secondaryCtaPressed: {
      opacity: 0.85,
    },
    secondaryCtaLabel: {
      color: palette.foreground,
      fontSize: 16,
      fontWeight: '600',
    },
    secondaryCtaPlaceholder: {
      height: 0,
    },
  });
}

