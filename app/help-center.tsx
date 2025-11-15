import { Colors } from '@/constants/theme';
import { useTheme } from '@/providers/theme-provider';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ChevronRight,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  BookOpen,
  FileText,
  Shield,
  AlertCircle,
} from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type HelpItem = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  onPress: () => void;
};

type HelpSection = {
  title: string;
  items: HelpItem[];
};

export default function HelpCenterScreen() {
  const { colorScheme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const palette = Colors[colorScheme ?? 'light'];
  const styles = createStyles(palette, insets);

  const helpSections: HelpSection[] = [
    {
      title: 'Get Help',
      items: [
        {
          id: 'faq',
          title: 'Frequently Asked Questions',
          description: 'Find answers to common questions',
          icon: HelpCircle,
          onPress: () => {
            // TODO: Navigate to FAQ
            console.log('FAQ');
          },
        },
        {
          id: 'contact',
          title: 'Contact Support',
          description: 'Get in touch with our support team',
          icon: MessageCircle,
          onPress: () => {
            // TODO: Navigate to contact support
            console.log('Contact Support');
          },
        },
        {
          id: 'email',
          title: 'Email Us',
          description: 'support@nidl.com',
          icon: Mail,
          onPress: () => {
            // TODO: Open email client
            console.log('Email Us');
          },
        },
        {
          id: 'phone',
          title: 'Call Us',
          description: '+1 (555) 123-4567',
          icon: Phone,
          onPress: () => {
            // TODO: Open phone dialer
            console.log('Call Us');
          },
        },
      ],
    },
    {
      title: 'Resources',
      items: [
        {
          id: 'guides',
          title: 'User Guides',
          description: 'Step-by-step guides for using the app',
          icon: BookOpen,
          onPress: () => {
            // TODO: Navigate to user guides
            console.log('User Guides');
          },
        },
        {
          id: 'terms',
          title: 'Terms of Service',
          description: 'Read our terms and conditions',
          icon: FileText,
          onPress: () => {
            // TODO: Navigate to terms
            console.log('Terms of Service');
          },
        },
        {
          id: 'privacy',
          title: 'Privacy Policy',
          description: 'Learn how we protect your data',
          icon: Shield,
          onPress: () => {
            // TODO: Navigate to privacy policy
            console.log('Privacy Policy');
          },
        },
      ],
    },
    {
      title: 'Report an Issue',
      items: [
        {
          id: 'bug',
          title: 'Report a Bug',
          description: 'Found something that needs fixing?',
          icon: AlertCircle,
          onPress: () => {
            // TODO: Navigate to bug report
            console.log('Report a Bug');
          },
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          android_ripple={{ color: palette.muted }}
        >
          <ArrowLeft size={24} color={palette.foreground} />
        </Pressable>
        <Text style={styles.headerTitle}>Help Center</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.iconContainer}>
            <HelpCircle size={48} color={palette.primary} />
          </View>
          <Text style={styles.welcomeTitle}>How can we help you?</Text>
          <Text style={styles.welcomeDescription}>
            Browse our help topics or contact our support team for assistance.
          </Text>
        </View>

        {/* Help Sections */}
        {helpSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.itemsContainer}>
              {section.items.map((item, itemIndex) => {
                const IconComponent = item.icon;
                return (
                  <Pressable
                    key={item.id}
                    style={[
                      styles.helpItem,
                      itemIndex === section.items.length - 1 && styles.lastItem,
                    ]}
                    onPress={item.onPress}
                    android_ripple={{ color: palette.muted }}
                  >
                    <View style={styles.iconWrapper}>
                      <IconComponent size={24} color={palette.primary} />
                    </View>
                    <View style={styles.itemContent}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemDescription}>{item.description}</Text>
                    </View>
                    <ChevronRight size={20} color={palette.mutedForeground} />
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function createStyles(palette: typeof Colors.light, insets: ReturnType<typeof useSafeAreaInsets>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: insets.top + 8,
      paddingBottom: 16,
      paddingHorizontal: 16,
      backgroundColor: palette.background,
      gap: 12,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: palette.card,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: palette.foreground,
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    welcomeSection: {
      alignItems: 'center',
      paddingVertical: 32,
      paddingHorizontal: 16,
      marginBottom: 8,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: palette.muted,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    welcomeTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: palette.foreground,
      marginBottom: 8,
      textAlign: 'center',
    },
    welcomeDescription: {
      fontSize: 16,
      color: palette.mutedForeground,
      textAlign: 'center',
      lineHeight: 22,
    },
    section: {
      marginBottom: 24,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: palette.foreground,
      marginBottom: 12,
    },
    itemsContainer: {
      backgroundColor: palette.card,
      borderRadius: 12,
      overflow: 'hidden',
    },
    helpItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: palette.border,
      gap: 12,
    },
    lastItem: {
      borderBottomWidth: 0,
    },
    iconWrapper: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: palette.muted,
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemContent: {
      flex: 1,
    },
    itemTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: palette.foreground,
      marginBottom: 4,
    },
    itemDescription: {
      fontSize: 14,
      color: palette.mutedForeground,
    },
  });
}

