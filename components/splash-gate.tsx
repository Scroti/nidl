import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

const WORDMARK_HEIGHT = 120;
const PROGRESS_BAR_WIDTH = 200;

type SplashGateProps = PropsWithChildren<{
  /**
   * Minimum amount of time (in milliseconds) that the custom splash should remain visible.
   * This avoids a flash in fast-loading scenarios.
   */
  minimumSplashMs?: number;
}>;

type AnimatedSplashProps = {
  progress: number;
};

export function SplashGate({ children, minimumSplashMs = 900 }: SplashGateProps) {
  const [progress, setProgress] = useState(0);
  const [isReady, setReady] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const runBootstrap = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (error) {
        // Preventing auto hide can throw if it was already called; that's okay.
        console.warn('SplashGate: preventAutoHideAsync failed', error);
      }

      const startedAt = Date.now();

      try {
        await preloadAssets((value) => {
          if (isMountedRef.current) {
            setProgress(value);
          }
        });
      } catch (error) {
        console.warn('SplashGate: Failed to preload assets', error);
      } finally {
        const elapsed = Date.now() - startedAt;
        const remaining = minimumSplashMs - elapsed;

        if (remaining > 0) {
          await delay(remaining);
        }

        if (isMountedRef.current) {
          setProgress(1);
          setReady(true);
        }
      }
    };

    runBootstrap();

    return () => {
      isMountedRef.current = false;
    };
  }, [minimumSplashMs]);

  if (!isReady) {
    return <AnimatedSplash progress={progress} />;
  }

  return <View style={styles.appContainer} pointerEvents="box-none">{children}</View>;
}

function AnimatedSplash({ progress }: AnimatedSplashProps) {
  const animatedProgress = useRef(new Animated.Value(progress)).current;
  const [nativeSplashHidden, setNativeSplashHidden] = useState(false);

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 450,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [animatedProgress, progress]);

  const onLayout = useCallback(async () => {
    if (nativeSplashHidden) {
      return;
    }

    try {
      await SplashScreen.hideAsync();
    } catch (error) {
      console.warn('SplashGate: hideAsync failed', error);
    } finally {
      setNativeSplashHidden(true);
    }
  }, [nativeSplashHidden]);

  const wordmarkFillHeight = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, WORDMARK_HEIGHT],
  });

  const progressFillWidth = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [4, PROGRESS_BAR_WIDTH],
  });

  return (
    <View style={styles.splashContainer} onLayout={onLayout}>
      <View style={styles.logoWrapper}>
        <Text style={[styles.wordmark, styles.wordmarkBase]}>Nidl</Text>
        <Animated.View style={[styles.wordmarkOverlay, { height: wordmarkFillHeight }]}>
          <Text style={[styles.wordmark, styles.wordmarkColor]}>Nidl</Text>
        </Animated.View>
      </View>

      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressFill, { width: progressFillWidth }]} />
      </View>

      <Text style={styles.progressLabel}>{Math.round(progress * 100)}%</Text>
    </View>
  );
}

async function preloadAssets(onProgress: (value: number) => void) {
  const loaders: Array<() => Promise<unknown>> = [
    () => downloadAsset(require('@/assets/images/react-logo.png')),
    () => downloadAsset(require('@/assets/images/partial-react-logo.png')),
  ];

  if (loaders.length === 0) {
    onProgress(1);
    return;
  }

  for (let index = 0; index < loaders.length; index += 1) {
    const loader = loaders[index];
    try {
      await loader();
    } catch (error) {
      console.warn(`SplashGate: loader ${index + 1} failed`, error);
    } finally {
      onProgress((index + 1) / loaders.length);
    }
  }
}

async function downloadAsset(moduleId: number) {
  await Asset.fromModule(moduleId).downloadAsync();
}

async function delay(ms: number) {
  return new Promise<void>((resolve) => {
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      resolve();
    }, ms);
  });
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#070B16',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoWrapper: {
    height: WORDMARK_HEIGHT,
    minWidth: 200,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  wordmark: {
    fontSize: 72,
    fontWeight: '800',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  wordmarkBase: {
    color: '#1f2937',
    opacity: 0.55,
  },
  wordmarkColor: {
    color: '#61dafb',
  },
  wordmarkOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  progressContainer: {
    marginTop: 32,
    width: PROGRESS_BAR_WIDTH,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#61dafb',
    borderRadius: 4,
  },
  progressLabel: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#E2E8F0',
    letterSpacing: 0.5,
  },
});


