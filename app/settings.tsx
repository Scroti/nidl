import { Colors } from '@/constants/theme';
import { useTheme } from '@/providers/theme-provider';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Bell,
    ChevronRight,
    Globe,
    Lock,
    Moon,
    Shield,
    Smartphone,
} from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SettingItem = {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  type: 'navigation' | 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  isDestructive?: boolean;
};

type SettingSection = {
  title: string;
  items: SettingItem[];
};

export default function SettingsScreen() {
  const { colorScheme, toggleTheme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const palette = Colors[colorScheme ?? 'light'];
  const styles = createStyles(palette, insets);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [bookingReminders, setBookingReminders] = useState(true);
  const [promotionalOffers, setPromotionalOffers] = useState(false);
  const [locationServices, setLocationServices] = useState(true);

  const settingsSections: SettingSection[] = [
    {
      title: 'Appearance',
      items: [
        {
          id: 'theme',
          label: 'Theme',
          description: colorScheme === 'dark' ? 'Dark Mode' : 'Light Mode',
          icon: Moon,
          type: 'navigation',
          onPress: () => {
            toggleTheme();
          },
        },
        {
          id: 'language',
          label: 'Language',
          description: 'English',
          icon: Globe,
          type: 'navigation',
          onPress: () => {
            // TODO: Navigate to language selection
            console.log('Language');
          },
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'notifications',
          label: 'Push Notifications',
          description: 'Receive push notifications',
          icon: Bell,
          type: 'toggle',
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          id: 'booking-reminders',
          label: 'Booking Reminders',
          description: 'Get reminded about upcoming bookings',
          icon: Bell,
          type: 'toggle',
          value: bookingReminders,
          onToggle: setBookingReminders,
        },
        {
          id: 'promotional',
          label: 'Promotional Offers',
          description: 'Receive special offers and discounts',
          icon: Bell,
          type: 'toggle',
          value: promotionalOffers,
          onToggle: setPromotionalOffers,
        },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          id: 'privacy',
          label: 'Privacy Policy',
          icon: Shield,
          type: 'navigation',
          onPress: () => {
            // TODO: Navigate to privacy policy
            console.log('Privacy Policy');
          },
        },
        {
          id: 'security',
          label: 'Security Settings',
          icon: Lock,
          type: 'navigation',
          onPress: () => {
            // TODO: Navigate to security settings
            console.log('Security Settings');
          },
        },
        {
          id: 'location',
          label: 'Location Services',
          description: 'Use your location for better recommendations',
          icon: Smartphone,
          type: 'toggle',
          value: locationServices,
          onToggle: setLocationServices,
        },
      ],
    },
  ];

  const CustomToggle = ({ value, onValueChange }: { value: boolean; onValueChange: (value: boolean) => void }) => {
    const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
      Animated.spring(animatedValue, {
        toValue: value ? 1 : 0,
        useNativeDriver: false,
        tension: 300,
        friction: 30,
      }).start();
    }, [value, animatedValue]);

    const handleToggle = () => {
      const newValue = !value;
      onValueChange(newValue);
    };

    const translateX = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [2, 22],
    });

    const backgroundColor = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [palette.muted, palette.primary],
    });

    return (
      <Pressable onPress={handleToggle} style={styles.toggleContainer}>
        <Animated.View style={[styles.toggleTrack, { backgroundColor }]}>
          <Animated.View
            style={[
              styles.toggleThumb,
              {
                transform: [{ translateX }],
                backgroundColor: palette.card,
              },
            ]}
          />
        </Animated.View>
      </Pressable>
    );
  };

  const renderSettingItem = (item: SettingItem, index: number, total: number) => {
    const IconComponent = item.icon;
    const iconColor = item.isDestructive ? palette.destructive : palette.primary;
    const textColor = item.isDestructive ? palette.destructive : palette.foreground;
    const isLast = index === total - 1;

    return (
      <Pressable
        key={item.id}
        style={[styles.settingItem, isLast && styles.settingItemLast]}
        onPress={() => {
          if (item.type === 'toggle' && item.onToggle) {
            item.onToggle(!item.value);
          } else if (item.onPress) {
            item.onPress();
          }
        }}
        disabled={item.type === 'toggle'}
        android_ripple={{ color: palette.muted }}
      >
        <View style={styles.settingItemLeft}>
          <View style={[styles.iconWrapper, item.isDestructive && styles.iconWrapperDestructive]}>
            <IconComponent size={18} color={iconColor} />
          </View>
          <View style={styles.settingItemTextContainer}>
            <Text style={[styles.settingItemLabel, { color: textColor }]}>{item.label}</Text>
            {item.description && (
              <Text style={styles.settingItemDescription}>{item.description}</Text>
            )}
          </View>
        </View>
        {item.type === 'toggle' ? (
          <CustomToggle value={item.value || false} onValueChange={item.onToggle || (() => {})} />
        ) : (
          <ChevronRight size={20} color={palette.mutedForeground} />
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={palette.foreground} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {settingsSections.map((section, sectionIndex) => (
          <View key={section.title} style={[styles.section, sectionIndex === 0 && styles.firstSection]}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, index) =>
                renderSettingItem(item, index, section.items.length),
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function createStyles(palette: typeof Colors.light, insets: ReturnType<typeof useSafeAreaInsets>) {
  const isDark = palette.background === Colors.dark.background;
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: insets.top/1.2,
      paddingBottom: 12,
      paddingHorizontal: 16,
      backgroundColor: palette.background,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: palette.foreground,
      letterSpacing: -0.5,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: 8,
    },
    section: {
      marginBottom: 24,
      paddingHorizontal: 16,
    },
    firstSection: {
      marginTop: 0,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: palette.mutedForeground,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    sectionContent: {
      backgroundColor: palette.card,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: isDark ? '#000' : 'rgba(0, 0, 0, 0.05)',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 18,
      paddingHorizontal: 16,
      minHeight: 64,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    },
    settingItemLast: {
      borderBottomWidth: 0,
    },
    settingItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 14,
    },
    iconWrapper: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: palette.muted,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconWrapperDestructive: {
      backgroundColor: isDark ? 'rgba(255, 100, 103, 0.15)' : 'rgba(231, 0, 11, 0.15)',
    },
    settingItemTextContainer: {
      flex: 1,
    },
    settingItemLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: palette.foreground,
      marginBottom: 4,
      letterSpacing: -0.2,
    },
    settingItemDescription: {
      fontSize: 13,
      color: palette.mutedForeground,
      lineHeight: 18,
    },
    toggleContainer: {
      padding: 2,
    },
    toggleTrack: {
      width: 44,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
    },
    toggleThumb: {
      width: 20,
      height: 20,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,
    },
  });
}

