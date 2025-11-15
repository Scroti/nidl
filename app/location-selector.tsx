import { Colors } from '@/constants/theme';
import { useTheme } from '@/providers/theme-provider';
import { useLocation } from '@/providers/location-provider';
import * as Location from 'expo-location';
import { ArrowLeft, MapPin, Search, X } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type LocationResult = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
};

export default function LocationSelectorScreen() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const { setSelectedLocation } = useLocation();
  const insets = useSafeAreaInsets();
  const palette = Colors[colorScheme ?? 'light'];
  const styles = createStyles(palette, insets);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [recentLocations, setRecentLocations] = useState<LocationResult[]>([]);

  // Get current location on mount
  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          setCurrentLocation(location);
        }
      } catch (error) {
        console.warn('Failed to get current location:', error);
      }
    };

    getCurrentLocation();
  }, []);

  // Search for locations
  const searchLocations = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Use forward geocoding to search for places
      const results = await Location.geocodeAsync(query);

      const formattedResults: LocationResult[] = results.map((result, index) => {
        // Reverse geocode to get address details
        return {
          id: `result-${index}`,
          name: query, // Use search query as name
          address: `${result.street || ''}, ${result.city || ''}, ${result.region || ''}`.trim().replace(/^,\s*|,\s*$/g, ''),
          latitude: result.latitude,
          longitude: result.longitude,
          city: result.city,
          state: result.region,
        };
      });

      setSearchResults(formattedResults);
    } catch (error) {
      console.warn('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchLocations(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, searchLocations]);

  const handleSelectLocation = useCallback(
    async (location: LocationResult) => {
      // Save to recent locations
      const updated = [location, ...recentLocations.filter((l) => l.id !== location.id)].slice(0, 5);
      setRecentLocations(updated);

      // Update selected location in context
      const city = location.city || '';
      const state = location.state || '';
      const displayAddress = city && state ? `${city}, ${state}` : location.address || location.name;
      
      setSelectedLocation({
        city,
        state,
        formattedAddress: displayAddress,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      // Navigate back
      router.back();
    },
    [recentLocations, router, setSelectedLocation],
  );

  const handleUseCurrentLocation = useCallback(async () => {
    if (!currentLocation) return;

    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (reverseGeocode && reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const city = address.city || address.subAdministrativeArea || '';
        const state = address.region || address.administrativeArea || '';
        const displayAddress = city && state ? `${city}, ${state}` : city || state || 'Current location';
        
        setSelectedLocation({
          city,
          state,
          formattedAddress: displayAddress,
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        router.back();
      }
    } catch (error) {
      console.warn('Failed to get current location address:', error);
    }
  }, [currentLocation, router, setSelectedLocation]);

  const renderLocationItem = ({ item }: { item: LocationResult }) => (
    <Pressable
      style={styles.locationItem}
      onPress={() => handleSelectLocation(item)}
    >
      <View style={styles.locationIconContainer}>
        <MapPin size={20} color={palette.primary} />
      </View>
      <View style={styles.locationTextContainer}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationAddress} numberOfLines={1}>
          {item.address || `${item.city || ''}, ${item.state || ''}`.trim()}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={palette.foreground} />
        </Pressable>
        <Text style={styles.headerTitle}>Select Location</Text>
        <View style={styles.backButton} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color={palette.mutedForeground} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a place"
          placeholderTextColor={palette.mutedForeground}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <X size={20} color={palette.mutedForeground} />
          </Pressable>
        )}
      </View>

      {/* Current Location Option */}
      {currentLocation && (
        <Pressable style={styles.currentLocationButton} onPress={handleUseCurrentLocation}>
          <MapPin size={20} color={palette.primary} />
          <Text style={styles.currentLocationText}>Use Current Location</Text>
        </Pressable>
      )}

      {/* Results */}
      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      ) : searchQuery.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={renderLocationItem}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No results found</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.suggestionsContainer}>
          {recentLocations.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Recent Locations</Text>
              <FlatList
                data={recentLocations}
                keyExtractor={(item) => item.id}
                renderItem={renderLocationItem}
                scrollEnabled={false}
              />
            </>
          )}
        </View>
      )}
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
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: insets.top + 8,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: palette.border,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: palette.foreground,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.card,
      marginHorizontal: 16,
      marginTop: 12,
      marginBottom: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: palette.border,
      gap: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: palette.foreground,
    },
    clearButton: {
      padding: 4,
    },
    currentLocationButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: palette.border,
    },
    currentLocationText: {
      fontSize: 16,
      fontWeight: '500',
      color: palette.foreground,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    locationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: palette.border,
      gap: 12,
    },
    locationIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: palette.muted,
      justifyContent: 'center',
      alignItems: 'center',
    },
    locationTextContainer: {
      flex: 1,
    },
    locationName: {
      fontSize: 16,
      fontWeight: '600',
      color: palette.foreground,
      marginBottom: 4,
    },
    locationAddress: {
      fontSize: 14,
      color: palette.mutedForeground,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 16,
      color: palette.mutedForeground,
    },
    suggestionsContainer: {
      flex: 1,
      paddingTop: 8,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: palette.mutedForeground,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
  });
}

