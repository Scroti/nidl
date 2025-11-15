import { Colors } from '@/constants/theme';
import { useTheme } from '@/providers/theme-provider';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Bookmark,
  Compass,
  Globe,
  MessageCircle,
  Phone,
  Star,
} from 'lucide-react-native';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock artist data
const mockArtistData = {
  '1': {
    id: '1',
    name: 'Alex Martinez',
    specialty: 'Realism Tattoos',
    image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400',
    rating: 5.0,
    reviewCount: 234,
    location: 'New York, NY',
    address: '5 Albert road, Barnoldswick',
    phone: '+1 (555) 123-4567',
    website: 'www.razorink.com',
    about:
      'A hair specialist is a trained expert in hair care, styling, and treatment, dedicated to enhancing the health, appearance, and manageability of hair. With in-depth knowledge of hair types, textures, and conditions, they provide personalized services tailored to each client\'s unique needs.',
    services: [
      { id: '1', name: 'Realism Tattoo', price: '$200', duration: '3-4 hours' },
      { id: '2', name: 'Portrait Tattoo', price: '$350', duration: '5-6 hours' },
      { id: '3', name: 'Cover Up', price: '$300', duration: '4-5 hours' },
    ],
    recentWork: [
      'https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?w=200',
      'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=200',
      'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=200',
      'https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?w=200',
    ],
  },
  '2': {
    id: '2',
    name: 'Sarah Chen',
    specialty: 'Geometric & Minimalist',
    image: 'https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?w=400',
    rating: 4.8,
    reviewCount: 189,
    location: 'Los Angeles, CA',
    address: '123 Main Street, Downtown',
    phone: '+1 (555) 234-5678',
    website: 'www.sarahink.com',
    about:
      'Specializing in geometric and minimalist tattoo designs. With years of experience, I create clean, precise work that stands the test of time.',
    services: [
      { id: '1', name: 'Geometric Design', price: '$150', duration: '2-3 hours' },
      { id: '2', name: 'Minimalist Tattoo', price: '$120', duration: '1-2 hours' },
    ],
    recentWork: [
      'https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?w=200',
      'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=200',
    ],
  },
};

type TabType = 'About' | 'Services' | 'Review';

export default function ArtistDetailScreen() {
  const { colorScheme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ artistId?: string }>();
  const palette = Colors[colorScheme ?? 'light'];
  const styles = createStyles(palette, insets, colorScheme);

  const artistId = params.artistId || '1';
  const artist = mockArtistData[artistId as keyof typeof mockArtistData] || mockArtistData['1'];
  const [activeTab, setActiveTab] = useState<TabType>('About');

  const handleChat = () => {
    router.push({
      pathname: '/chat',
      params: { recipientId: artist.id, recipientName: artist.name },
    });
  };

  const handleCall = () => {
    // TODO: Implement phone call
    console.log('Call:', artist.phone);
  };

  const handleDirection = () => {
    // TODO: Implement directions
    console.log('Directions to:', artist.address);
  };

  const handleWebsite = () => {
    // TODO: Implement website opening
    console.log('Open website:', artist.website);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={palette.foreground} />
        </Pressable>
        <Pressable style={styles.bookmarkButton}>
          <Bookmark size={24} color={palette.foreground} fill="none" />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Main Image */}
        <Image source={{ uri: artist.image }} style={styles.mainImage} />

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable style={styles.actionButton} onPress={handleCall}>
            <Phone size={20} color={palette.foreground} />
            <Text style={styles.actionLabel}>Call</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={handleChat}>
            <MessageCircle size={20} color={palette.foreground} />
            <Text style={styles.actionLabel}>Message</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={handleDirection}>
            <Compass size={20} color={palette.foreground} />
            <Text style={styles.actionLabel}>Direction</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={handleWebsite}>
            <Globe size={20} color={palette.foreground} />
            <Text style={styles.actionLabel}>Website</Text>
          </Pressable>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {(['About', 'Services', 'Review'] as TabType[]).map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'About' && (
            <View>
              <Text style={styles.aboutText}>{artist.about}</Text>
              <View style={styles.recentWorkSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Work</Text>
                  <Pressable>
                    <Text style={styles.seeAllText}>See All</Text>
                  </Pressable>
                </View>
                <View style={styles.recentWorkGrid}>
                  {artist.recentWork.map((imageUrl, index) => (
                    <Image
                      key={index}
                      source={{ uri: imageUrl }}
                      style={styles.recentWorkImage}
                    />
                  ))}
                </View>
              </View>
            </View>
          )}

          {activeTab === 'Services' && (
            <View>
              {artist.services.map((service) => (
                <View key={service.id} style={styles.serviceItem}>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.serviceDetails}>
                      {service.price} • {service.duration}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'Review' && (
            <View>
              <Text style={styles.comingSoonText}>Reviews coming soon</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Book Appointment Button */}
      <View style={styles.bookButtonContainer}>
        <Pressable style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </Pressable>
      </View>
    </View>
  );
}

function createStyles(
  palette: typeof Colors.light,
  insets: ReturnType<typeof useSafeAreaInsets>,
  colorScheme?: 'light' | 'dark' | null,
) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    header: {
      position: 'absolute',
      top: insets.top + 8,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      zIndex: 10,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    bookmarkButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollView: {
      flex: 1,
    },
    mainImage: {
      width: '100%',
      height: 300,
      backgroundColor: palette.muted,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 24,
      paddingHorizontal: 16,
      backgroundColor: palette.background,
    },
    actionButton: {
      alignItems: 'center',
      gap: 8,
    },
    actionLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: palette.foreground,
    },
    tabsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      backgroundColor: palette.background,
      borderBottomWidth: 1,
      borderBottomColor: palette.border,
    },
    tab: {
      flex: 1,
      paddingVertical: 16,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    tabActive: {
      borderBottomColor: palette.primary,
    },
    tabText: {
      fontSize: 16,
      fontWeight: '600',
      color: palette.mutedForeground,
    },
    tabTextActive: {
      color: palette.foreground,
    },
    tabContent: {
      padding: 16,
      paddingBottom: 100,
    },
    aboutText: {
      fontSize: 15,
      lineHeight: 24,
      color: palette.foreground,
      marginBottom: 32,
    },
    recentWorkSection: {
      marginTop: 8,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: palette.foreground,
    },
    seeAllText: {
      fontSize: 14,
      fontWeight: '600',
      color: palette.primary,
    },
    recentWorkGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    recentWorkImage: {
      width: '47%',
      height: 120,
      borderRadius: 12,
      backgroundColor: palette.muted,
    },
    serviceItem: {
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: palette.border,
    },
    serviceInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    serviceName: {
      fontSize: 16,
      fontWeight: '600',
      color: palette.foreground,
    },
    serviceDetails: {
      fontSize: 14,
      color: palette.mutedForeground,
    },
    comingSoonText: {
      fontSize: 16,
      color: palette.mutedForeground,
      textAlign: 'center',
      paddingVertical: 40,
    },
    bookButtonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingBottom: insets.bottom + 16,
      paddingTop: 16,
      paddingHorizontal: 16,
      backgroundColor: palette.background,
      ...(colorScheme === 'light' && {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
      }),
    },
    bookButton: {
      backgroundColor: palette.primary,
      borderRadius: 16,
      paddingVertical: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bookButtonText: {
      fontSize: 17,
      fontWeight: '700',
      color: palette.primaryForeground,
    },
  });
}

