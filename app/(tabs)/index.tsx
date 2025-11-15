import { HomeHeader } from '@/components/home-header';
import { Colors } from '@/constants/theme';
import { useAppState } from '@/providers/app-state-provider';
import { useTheme } from '@/providers/theme-provider';
import { useRouter } from 'expo-router';
import {
  Bookmark,
  ExternalLink,
  Filter,
  MapPin,
  MessageCircle,
  Search,
  Star
} from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const categories = [
  { id: 'tattoo', label: 'Tattoo' },
  { id: 'piercing', label: 'Piercing' },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.85;
const CARD_SPACING = 12;

// Mock featured artists and salons data
const featuredItems = [
  {
    id: '1',
    name: 'Razor Ink Studio',
    address: '5 Albert road, Barnoldswick',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400',
    type: 'salon',
  },
  {
    id: '2',
    name: 'Tony Tattoos',
    address: '123 Main Street, Downtown',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?w=400',
    type: 'artist',
  },
  {
    id: '3',
    name: 'Ink Masters',
    address: '456 Oak Avenue, City Center',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=400',
    type: 'salon',
  },
  {
    id: '4',
    name: 'Artistic Piercings',
    address: '789 Elm Street, Westside',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?w=400',
    type: 'salon',
  },
  {
    id: '5',
    name: 'Sarah Ink',
    address: '321 Park Boulevard, Uptown',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?w=400',
    type: 'artist',
  },
];

// All artists and salons data
const allItems = [
  ...featuredItems,
  {
    id: '6',
    name: 'Black Ink Tattoo',
    address: '111 Broadway, Downtown',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?w=400',
    type: 'salon',
  },
  {
    id: '7',
    name: 'Mike the Artist',
    address: '222 River Road, Riverside',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400',
    type: 'artist',
  },
  {
    id: '8',
    name: 'Piercing Paradise',
    address: '333 Sunset Avenue, Beachside',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=400',
    type: 'salon',
  },
  {
    id: '9',
    name: 'Emma Designs',
    address: '444 Mountain View, Hillside',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?w=400',
    type: 'artist',
  },
  {
    id: '10',
    name: 'Ink & Needle',
    address: '555 Central Plaza, Midtown',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400',
    type: 'salon',
  },
];

export default function HomeScreen() {
  const { colorScheme } = useTheme();
  const { user } = useAppState();
  const router = useRouter();
  const palette = Colors[colorScheme ?? 'light'];
  const styles = createStyles(palette, colorScheme);
  const [selectedCategory, setSelectedCategory] = useState('tattoo');
  const [currentArtistIndex, setCurrentArtistIndex] = useState(0);
  const carouselRef = useRef<ScrollView>(null);
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleChat = (artistId: string, artistName: string) => {
    router.push({
      pathname: '/chat',
      params: { recipientId: artistId, recipientName: artistName },
    });
  };

  const handleArtistPress = (artistId: string) => {
    router.push({
      pathname: '/artist-detail',
      params: { artistId },
    });
  };

  const username = user?.displayName || user?.email?.split('@')[0] || 'User';

  // Auto-scroll carousel
  useEffect(() => {
    const startAutoScroll = () => {
      autoScrollTimer.current = setInterval(() => {
        setCurrentArtistIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % featuredItems.length;
          carouselRef.current?.scrollTo({
            x: nextIndex * (CARD_WIDTH + CARD_SPACING),
            animated: true,
          });
          return nextIndex;
        });
      }, 4000); // Change every 4 seconds
    };

    startAutoScroll();

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, []);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + CARD_SPACING));
    setCurrentArtistIndex(index);
  };

  return (
    <View style={styles.container}>
      <HomeHeader />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.greeting}>Hi, {username}</Text>
          <Text style={styles.tagline}>Time for your next transformation?</Text>
          <View style={styles.searchRow}>
            <View style={styles.searchContainer}>
              <Search size={20} color={palette.mutedForeground} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search.."
                placeholderTextColor={palette.mutedForeground}
              />
            </View>
            <Pressable style={styles.filterButton}>
              <Filter size={20} color={palette.foreground} />
            </Pressable>
          </View>

          {/* Top Categories Section */}
          <View style={styles.categoriesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Categories</Text>
              <Pressable>
                <Text style={styles.seeAllText}>See All</Text>
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {categories.map((category) => {
                const isSelected = selectedCategory === category.id;
                return (
                  <Pressable
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      isSelected && styles.categoryButtonSelected,
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Text
                      style={[
                        styles.categoryLabel,
                        isSelected && styles.categoryLabelSelected,
                      ]}
                    >
                      {category.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Best Salon Section */}
          <View style={styles.featuredSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Best Salon</Text>
              <Pressable>
                <Text style={styles.seeAllText}>See All</Text>
              </Pressable>
            </View>
            <ScrollView
              ref={carouselRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              contentContainerStyle={styles.carouselContainer}
              snapToInterval={CARD_WIDTH + CARD_SPACING}
              decelerationRate="fast"
            >
              {featuredItems.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.artistCard}
                  onPress={() => handleArtistPress(item.id)}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.artistImage}
                    resizeMode="cover"
                  />
                  {/* Rating Badge */}
                  <View style={styles.ratingBadge}>
                    <Star size={14} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                  {/* Bookmark Button */}
                  <Pressable style={styles.bookmarkButton}>
                    <Bookmark size={18} color={palette.foreground} fill="none" />
                  </Pressable>
                  {/* Info Overlay */}
                  <View style={styles.artistInfoOverlay}>
                    <View style={styles.artistInfo}>
                      <Text style={styles.artistName}>{item.name}</Text>
                      <View style={styles.artistLocation}>
                        <MapPin size={14} color="#FFFFFF" />
                        <Text style={styles.artistAddress}>{item.address}</Text>
                      </View>
                    </View>
                    <Pressable style={styles.navigateButton}>
                      <ExternalLink size={18} color={palette.foreground} />
                    </Pressable>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
            {/* Dots Indicator */}
            <View style={styles.dotsContainer}>
              {featuredItems.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentArtistIndex && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Near You Section */}
          <View style={styles.nearYouSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Near You</Text>
                <Text style={styles.sectionSubtitle}>Based on your location</Text>
              </View>
              <Pressable>
                <Text style={styles.seeAllText}>See All</Text>
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.nearYouContainer}
            >
              {allItems.slice(0, 5).map((item) => (
                <Pressable key={item.id} style={styles.nearYouCard}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.nearYouImage}
                    resizeMode="cover"
                  />
                  {/* Rating Badge */}
                  <View style={styles.nearYouRatingBadge}>
                    <Star size={12} color="#000000" fill="#000000" />
                    <Text style={styles.nearYouRatingText}>
                      {item.rating} ({Math.floor(Math.random() * 500) + 50}+)
                    </Text>
                  </View>
                  {/* Bookmark Button */}
                  <Pressable style={styles.nearYouBookmark}>
                    <Bookmark size={16} color="#FFFFFF" fill="none" strokeWidth={2} />
                  </Pressable>
                  {/* Info */}
                  <View style={styles.nearYouInfo}>
                    <View style={styles.nearYouNameRow}>
                      <Text style={styles.nearYouName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Pressable
                        style={styles.nearYouChatButton}
                        onPress={() => handleChat(item.id, item.name)}
                      >
                        <MessageCircle size={16} color={palette.foreground} />
                      </Pressable>
                    </View>
                    <View style={styles.nearYouDetails}>
                      <View style={styles.nearYouDetailItem}>
                        <MapPin size={12} color={palette.mutedForeground} />
                        <Text style={styles.nearYouDetailText} numberOfLines={1}>
                          {item.address.split(',')[0]}
                        </Text>
                      </View>
                      <View style={styles.nearYouDetailItem}>
                        <Text style={styles.nearYouDistance}>
                          {Math.floor(Math.random() * 5) + 1}.{Math.floor(Math.random() * 9)} km
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* All Artists & Salons Section */}
          <View style={styles.allItemsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>All Artists & Salons</Text>
            </View>
            <FlatList
              data={allItems}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <Pressable style={styles.itemCard}>
                  <View style={styles.itemImageContainer}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.itemImage}
                      resizeMode="cover"
                    />
                    {/* Rating Badge on Image */}
                    <View style={styles.itemRatingBadge}>
                      <Star size={12} color="#000000" fill="#000000" />
                      <Text style={styles.itemRatingBadgeText}>
                        {item.rating} ({Math.floor(Math.random() * 500) + 50}+)
                      </Text>
                    </View>
                    {/* Bookmark on Image */}
                    <Pressable style={styles.itemBookmark}>
                      <Bookmark size={16} color="#FFFFFF" fill="none" strokeWidth={2} />
                    </Pressable>
                  </View>
                  <View style={styles.itemInfo}>
                    <View style={styles.itemNameRow}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>
                    <View style={styles.itemDetailsRow}>
                      <View style={styles.itemDetailItem}>
                        <MapPin size={14} color={palette.mutedForeground} />
                        <Text style={styles.itemDetailText} numberOfLines={1}>
                          {item.address.split(',')[0]}
                        </Text>
                      </View>
                      <View style={styles.itemDetailItem}>
                        <Text style={styles.itemDistance}>
                          {Math.floor(Math.random() * 5) + 1}.{Math.floor(Math.random() * 9)} km
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              )}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function createStyles(palette: typeof Colors.light, colorScheme?: 'light' | 'dark' | null) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 20,
    },
    greeting: {
      fontSize: 24,
      fontWeight: '700',
      color: palette.foreground,
      marginBottom: 8,
    },
    tagline: {
      fontSize: 16,
      fontWeight: '600',
      color: palette.foreground,
      marginBottom: 20,
      lineHeight: 24,
      letterSpacing: 0.2,
    },
    searchRow: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
      marginBottom: 24,
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.card,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 16,
      gap: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: palette.foreground,
      fontWeight: '500',
    },
    filterButton: {
      width: 52,
      height: 52,
      backgroundColor: palette.card,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    categoriesSection: {
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
    categoriesContainer: {
      gap: 12,
      paddingRight: 16,
    },
    categoryButton: {
      minWidth: 100,
      paddingHorizontal: 24,
      paddingVertical: 14,
      backgroundColor: palette.card,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
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
    categoryButtonSelected: {
      backgroundColor: colorScheme === 'dark' ? palette.foreground : '#FFFFFF',
    },
    categoryLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: palette.foreground,
      textAlign: 'center',
    },
    categoryLabelSelected: {
      color: colorScheme === 'dark' ? palette.background : '#000000',
    },
    featuredSection: {
      marginTop: 32,
    },
    carouselContainer: {
      paddingRight: 16,
    },
    artistCard: {
      width: CARD_WIDTH,
      height: 280,
      borderRadius: 24,
      overflow: 'hidden',
      marginRight: CARD_SPACING,
      backgroundColor: palette.card,
      ...(colorScheme === 'light' && {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }),
    },
    artistImage: {
      width: '100%',
      height: '100%',
    },
    ratingBadge: {
      position: 'absolute',
      top: 12,
      left: 12,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 16,
      gap: 4,
      ...(colorScheme === 'light' && {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }),
    },
    ratingText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#000000',
    },
    bookmarkButton: {
      position: 'absolute',
      top: 12,
      right: 12,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      justifyContent: 'center',
      alignItems: 'center',
      ...(colorScheme === 'light' && {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }),
    },
    artistInfoOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      paddingHorizontal: 16,
      paddingVertical: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    artistInfo: {
      flex: 1,
    },
    artistName: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    artistLocation: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    artistAddress: {
      fontSize: 12,
      color: '#FFFFFF',
      opacity: 0.9,
    },
    artistActions: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
    },
    chatButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    navigateButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      justifyContent: 'center',
      alignItems: 'center',
      ...(colorScheme === 'light' && {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }),
    },
    dotsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
      marginTop: 16,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: palette.mutedForeground,
      opacity: 0.4,
    },
    dotActive: {
      width: 24,
      backgroundColor: palette.primary,
      opacity: 1,
    },
    nearYouSection: {
      marginTop: 32,
    },
    sectionSubtitle: {
      fontSize: 13,
      color: palette.mutedForeground,
      marginTop: 2,
    },
    nearYouContainer: {
      gap: 12,
      paddingRight: 16,
    },
    nearYouCard: {
      width: 280,
      height: 200,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: palette.card,
    },
    nearYouImage: {
      width: '100%',
      height: '100%',
    },
    nearYouRatingBadge: {
      position: 'absolute',
      bottom: 50,
      right: 12,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      gap: 4,
    },
    nearYouRatingText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#000000',
    },
    nearYouBookmark: {
      position: 'absolute',
      top: 12,
      right: 12,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    nearYouInfo: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: palette.card,
      padding: 12,
    },
    nearYouNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    nearYouName: {
      fontSize: 15,
      fontWeight: '700',
      color: palette.foreground,
      flex: 1,
    },
    nearYouChatButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: palette.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
    },
    nearYouDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    nearYouDetailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      flex: 1,
    },
    nearYouDetailText: {
      fontSize: 12,
      color: palette.mutedForeground,
      flex: 1,
    },
    nearYouDistance: {
      fontSize: 12,
      fontWeight: '600',
      color: palette.primary,
    },
    allItemsSection: {
      marginTop: 32,
    },
    itemCard: {
      marginBottom: 16,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: palette.card,
    },
    itemImageContainer: {
      width: '100%',
      height: 180,
      position: 'relative',
    },
    itemImage: {
      width: '100%',
      height: '100%',
    },
    itemRatingBadge: {
      position: 'absolute',
      bottom: 12,
      right: 12,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      gap: 4,
    },
    itemRatingBadgeText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#000000',
    },
    itemBookmark: {
      position: 'absolute',
      top: 12,
      right: 12,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemInfo: {
      padding: 12,
    },
    itemNameRow: {
      marginBottom: 8,
    },
    itemName: {
      fontSize: 16,
      fontWeight: '700',
      color: palette.foreground,
    },
    itemDetailsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    itemDetailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      flex: 1,
    },
    itemDetailText: {
      fontSize: 13,
      color: palette.mutedForeground,
      flex: 1,
    },
    itemDistance: {
      fontSize: 13,
      fontWeight: '600',
      color: palette.primary,
    },
  });
}
