import { Colors } from '@/constants/theme';
import { useTheme } from '@/providers/theme-provider';
import { useAppState } from '@/providers/app-state-provider';
import { useLocation } from '@/providers/location-provider';
import * as Location from 'expo-location';
import { Bell, ChevronDown, MapPin, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export function HomeHeader() {
  const { colorScheme } = useTheme();
  const { user } = useAppState();
  const { selectedLocation } = useLocation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const palette = Colors[colorScheme ?? 'light'];
  const styles = createStyles(palette, insets.top);
  const [location, setLocation] = useState<{
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    formattedAddress?: string;
  } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  useEffect(() => {
    const getLocation = async () => {
      try {
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setIsLoadingLocation(false);
          setLocation({ formattedAddress: 'Enable location access' });
          return;
        }

        // Get current position with high accuracy
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        // Reverse geocode to get detailed address
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        if (reverseGeocode && reverseGeocode.length > 0) {
          const address = reverseGeocode[0];
          
          // Build concise address - prioritize city and state for display
          // Store full address for potential future use
          const city = address.city || address.subAdministrativeArea || '';
          const state = address.region || address.administrativeArea || '';
          const street = address.street || address.name || '';
          
          // Create a concise display format: "City, State" or "Street, City" if street is short
          let displayAddress: string;
          
          if (street && street.length <= 25 && city) {
            // If street is short, show "Street, City"
            displayAddress = `${street}, ${city}`;
          } else if (city && state) {
            // Default: "City, State"
            displayAddress = `${city}, ${state}`;
          } else if (city) {
            displayAddress = city;
          } else if (state) {
            displayAddress = state;
          } else if (street) {
            // Fallback to street if it's not too long
            displayAddress = street.length > 30 ? street.substring(0, 30) + '...' : street;
          } else {
            displayAddress = 'Current location';
          }
          
          setLocation({
            street,
            city,
            state,
            country: address.country,
            formattedAddress: displayAddress,
          });
        } else {
          setLocation({ formattedAddress: 'Location unavailable' });
        }
      } catch (error) {
        console.warn('Failed to get location:', error);
        setLocation({ formattedAddress: 'Location unavailable' });
      } finally {
        setIsLoadingLocation(false);
      }
    };

    // Only get location if no location is selected
    if (!selectedLocation) {
      getLocation();
    } else {
      setIsLoadingLocation(false);
      setLocation({
        city: selectedLocation.city,
        state: selectedLocation.state,
        formattedAddress: selectedLocation.formattedAddress,
      });
    }
  }, [selectedLocation]);

  const displayName = user?.displayName || 'User';
  const profileImageUrl = user?.photoURL;

  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <Pressable style={styles.profileContainer}>
        {profileImageUrl ? (
          <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
        ) : (
          <View style={styles.profilePlaceholder}>
            <User size={20} color={palette.foreground} />
          </View>
        )}
      </Pressable>

      {/* Location Selector */}
      <Pressable
        style={styles.locationContainer}
        onPress={() => router.push('/location-selector')}
      >
        <Text style={styles.locationLabel}>Location</Text>
        <View style={styles.locationRow}>
          <MapPin size={16} color={palette.foreground} />
          <Text 
            style={styles.locationText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {isLoadingLocation 
              ? 'Getting location...' 
              : location?.formattedAddress || 'Select location'}
          </Text>
          <ChevronDown size={16} color={palette.foreground} />
        </View>
      </Pressable>

      {/* Notifications */}
      <Pressable style={styles.notificationContainer}>
        <Bell size={24} color={palette.foreground} />
      </Pressable>
    </View>
  );
}

function createStyles(palette: typeof Colors.light, topInset: number) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: Math.max(topInset, 8),
      paddingBottom: 12,
    },
    profileContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      overflow: 'hidden',
      backgroundColor: palette.card,
    },
    profileImage: {
      width: '100%',
      height: '100%',
    },
    profilePlaceholder: {
      width: '100%',
      height: '100%',
      backgroundColor: palette.muted,
      justifyContent: 'center',
      alignItems: 'center',
    },
    locationContainer: {
      flex: 1,
      alignItems: 'center',
      marginHorizontal: 12,
      minWidth: 0, // Allow text to shrink
    },
    locationLabel: {
      fontSize: 12,
      color: palette.mutedForeground,
      marginBottom: 2,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      maxWidth: '100%',
    },
    locationText: {
      fontSize: 13,
      fontWeight: '600',
      color: palette.foreground,
      flex: 1,
      textAlign: 'center',
      maxWidth: 200, // Limit max width to prevent overflow
    },
    notificationContainer: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
}

