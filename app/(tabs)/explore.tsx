import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/providers/theme-provider';
import { useRouter } from 'expo-router';
import { Bookmark, Filter, MessageCircle, Search, Star } from 'lucide-react-native';
import { useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PortfolioItem = {
  id: string;
  artistName: string;
  specialty: string;
  imageUrl: string;
  rating: number;
  location: string;
};

const mockPortfolio: PortfolioItem[] = [
  {
    id: '1',
    artistName: 'Alex Martinez',
    specialty: 'Realism Tattoos',
    imageUrl: 'https://via.placeholder.com/300x400/5ea500/ffffff?text=Tattoo+1',
    rating: 4.9,
    location: 'New York, NY',
  },
  {
    id: '2',
    artistName: 'Sarah Chen',
    specialty: 'Geometric & Minimalist',
    imageUrl: 'https://via.placeholder.com/300x400/5ea500/ffffff?text=Tattoo+2',
    rating: 4.8,
    location: 'Los Angeles, CA',
  },
  {
    id: '3',
    artistName: 'Mike Johnson',
    specialty: 'Traditional & Neo-Traditional',
    imageUrl: 'https://via.placeholder.com/300x400/5ea500/ffffff?text=Tattoo+3',
    rating: 4.7,
    location: 'Chicago, IL',
  },
  {
    id: '4',
    artistName: 'Emma Wilson',
    specialty: 'Watercolor Tattoos',
    imageUrl: 'https://via.placeholder.com/300x400/5ea500/ffffff?text=Tattoo+4',
    rating: 5.0,
    location: 'Miami, FL',
  },
];

const categories = ['All', 'Tattoo', 'Piercing'];

export default function ExploreScreen() {
  const { colorScheme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const palette = Colors[colorScheme ?? 'light'];
  const styles = createStyles(palette, insets, colorScheme);
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  const renderPortfolioItem = ({ item }: { item: PortfolioItem }) => (
    <TouchableOpacity
      style={styles.portfolioCard}
      onPress={() => handleArtistPress(item.id)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.portfolioImage} />
      <View style={styles.ratingBadge}>
        <Star size={12} color="#000000" fill="#000000" />
        <Text style={styles.ratingText}>
          {item.rating} ({Math.floor(Math.random() * 500) + 50}+)
        </Text>
      </View>
      <Pressable style={styles.bookmarkButton}>
        <Bookmark size={16} color="#FFFFFF" fill="none" strokeWidth={2} />
      </Pressable>
      <View style={styles.portfolioInfo}>
        <View style={styles.artistHeader}>
          <View style={styles.artistTextInfo}>
            <Text style={styles.artistName} numberOfLines={1}>
              {item.artistName}
            </Text>
            <View style={styles.locationRow}>
              <Text style={styles.location}>{item.location}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
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
              const isSelected = selectedCategory === category;
              return (
                <Pressable
                  key={category}
                  style={[
                    styles.categoryButton,
                    isSelected && styles.categoryButtonSelected,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryLabel,
                      isSelected && styles.categoryLabelSelected,
                    ]}
                  >
                    {category}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Best Salon Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Best Salon</Text>
          <Pressable>
            <Text style={styles.seeAllText}>See All</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={mockPortfolio}
        renderItem={renderPortfolioItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
      paddingTop: insets.top + 16,
      paddingBottom: 16,
      paddingHorizontal: 16,
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
      ...(colorScheme === 'light' && {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }),
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
      ...(colorScheme === 'light' && {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }),
    },
    categoriesSection: {
      marginBottom: 24,
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
    listContent: {
      padding: 16,
    },
    row: {
      justifyContent: 'space-between',
    },
    portfolioCard: {
      width: '48%',
      height: 200,
      backgroundColor: palette.card,
      borderRadius: 16,
      marginBottom: 16,
      overflow: 'hidden',
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
    portfolioImage: {
      width: '100%',
      height: '100%',
    },
    ratingBadge: {
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
    ratingText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#000000',
    },
    bookmarkButton: {
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
    portfolioInfo: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: palette.card,
      padding: 12,
    },
    artistHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    artistTextInfo: {
      flex: 1,
    },
    artistName: {
      fontSize: 15,
      fontWeight: '700',
      color: palette.foreground,
      marginBottom: 4,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    location: {
      fontSize: 12,
      color: palette.mutedForeground,
    },
  });
}

