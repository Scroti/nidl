import { OnboardingSlide } from '@/features/onboarding/onboarding-slide';
import { useAppState } from '@/providers/app-state-provider';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Slide = {
  key: string;
  subtitle: string;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel?: string;
  animation?: any;
};

const AUTO_SCROLL_INTERVAL = 4000; // 4 seconds

export default function OnboardingScreen() {
  const router = useRouter();
  const { markOnboardingSeen } = useAppState();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const autoScrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slides = useMemo<Slide[]>(
    () => [
      {
        key: 'explore',
        subtitle: 'Discover Artists',
        title: 'Memorable Experiences',
        description:
          'Browse carefully selected body art artists, filter by style or location, and find the perfect inspiration for your next session.',
        primaryLabel: 'Continue',
        animation: require('@/assets/animations/onboarding-01.json'),
      },
      {
        key: 'connect',
        subtitle: 'Connect',
        title: 'Talk Directly with Professionals',
        description:
          'Discuss directly with professionals, send references, and clarify each step of the project so your visit goes exactly as you want.',
        primaryLabel: 'Continue',
        animation: require('@/assets/animations/onboarding-02.json'),
      },
      {
        key: 'book',
        subtitle: 'Schedule & Pay',
        title: 'Secure and Fast Bookings',
        description:
          'Book with advance payment through Stripe, track automatic confirmations, and receive notifications at the right time to arrive prepared for your scheduled session.',
        primaryLabel: 'Get Started',
        animation: require('@/assets/animations/onboarding-03.json'),
      },
    ],
    [],
  );

  const stopAutoScroll = useCallback(() => {
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }
  }, []);

  const startAutoScroll = useCallback(() => {
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current);
    }

    autoScrollTimerRef.current = setInterval(() => {
      if (!isUserScrollingRef.current) {
        setActiveIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % slides.length;
          scrollRef.current?.scrollTo({ x: nextIndex * SCREEN_WIDTH, animated: true });
          return nextIndex;
        });
      }
    }, AUTO_SCROLL_INTERVAL);
  }, [slides.length]);

  const handleSkip = useCallback(async () => {
    stopAutoScroll();
    await markOnboardingSeen();
    router.replace('/(tabs)');
  }, [markOnboardingSeen, router, stopAutoScroll]);

  const handlePrimaryPress = useCallback(
    async (index: number) => {
      stopAutoScroll();
      const isLast = index === slides.length - 1;
      if (isLast) {
        await markOnboardingSeen();
        router.replace('/(tabs)');
      } else {
        const nextIndex = index + 1;
        setActiveIndex(nextIndex);
        scrollRef.current?.scrollTo({ x: nextIndex * SCREEN_WIDTH, animated: true });
        // Resume auto-scroll after navigation
        setTimeout(() => {
          startAutoScroll();
        }, AUTO_SCROLL_INTERVAL);
      }
    },
    [markOnboardingSeen, router, slides.length, stopAutoScroll, startAutoScroll],
  );

  const handleSecondaryPress = useCallback(
    (index: number) => {
      stopAutoScroll();
      if (index > 0) {
        const nextIndex = index - 1;
        setActiveIndex(nextIndex);
        scrollRef.current?.scrollTo({ x: nextIndex * SCREEN_WIDTH, animated: true });
        // Resume auto-scroll after navigation
        setTimeout(() => {
          startAutoScroll();
        }, AUTO_SCROLL_INTERVAL);
      }
    },
    [stopAutoScroll, startAutoScroll],
  );

  const handleUserScroll = useCallback(() => {
    isUserScrollingRef.current = true;
    stopAutoScroll();

    // Resume auto-scroll after user stops scrolling for 2 seconds
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;
      startAutoScroll();
    }, 2000);
  }, [startAutoScroll, stopAutoScroll]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      scrollX.setValue(offsetX);
      handleUserScroll();
    },
    [scrollX, handleUserScroll],
  );

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const newIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      setActiveIndex(newIndex);
    },
    [],
  );

  // Set up auto-scroll on mount and when activeIndex changes
  useEffect(() => {
    startAutoScroll();
    return () => {
      stopAutoScroll();
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [startAutoScroll, stopAutoScroll]);

  return (
    <Animated.ScrollView
      ref={scrollRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
        useNativeDriver: false,
        listener: handleScroll,
      })}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      scrollEventThrottle={16}
      decelerationRate="fast"
      snapToInterval={SCREEN_WIDTH}
      snapToAlignment="center"
      scrollEnabled={true}
      nestedScrollEnabled={false}
    >
      {slides.map((slide, index) => (
        <OnboardingSlide
          key={slide.key}
          index={index}
          total={slides.length}
          title={slide.title}
          subtitle={slide.subtitle}
          description={slide.description}
          primaryLabel={slide.primaryLabel}
          secondaryLabel={slide.secondaryLabel}
          onPrimaryPress={() => handlePrimaryPress(index)}
          onSecondaryPress={
            slide.secondaryLabel ? () => handleSecondaryPress(index) : undefined
          }
          onSkip={handleSkip}
          onBack={index > 0 ? () => handleSecondaryPress(index) : undefined}
          animation={slide.animation}
          scrollX={scrollX}
        />
      ))}
    </Animated.ScrollView>
  );
}


