import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppState } from '@/providers/app-state-provider';
import { useRouter } from 'expo-router';
import { LogIn, MessageCircle, Calendar, MapPin, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

// Mock booking data
const mockBookings = [
  {
    id: '1',
    artistName: 'Alex Martinez',
    service: 'Realism Tattoo',
    date: '2024-01-15',
    time: '10:00 AM',
    location: 'Razor Ink Studio',
    address: '5 Albert road, Barnoldswick',
    status: 'confirmed',
  },
  {
    id: '2',
    artistName: 'Sarah Chen',
    service: 'Geometric Design',
    date: '2024-01-20',
    time: '2:00 PM',
    location: 'Ink Masters',
    address: '456 Oak Avenue, City Center',
    status: 'pending',
  },
];

// Mock chat conversations
const mockChats = [
  {
    id: '1',
    recipientId: '1',
    recipientName: 'Alex Martinez',
    lastMessage: 'Looking forward to our session!',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    unreadCount: 2,
  },
  {
    id: '2',
    recipientId: '2',
    recipientName: 'Sarah Chen',
    lastMessage: 'Thanks for the reference images!',
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    unreadCount: 0,
  },
  {
    id: '3',
    recipientId: '3',
    recipientName: 'Mike Johnson',
    lastMessage: 'See you tomorrow at 2 PM',
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    unreadCount: 1,
  },
];

export default function BookingScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAppState();
  const palette = Colors[colorScheme ?? 'light'];
  const styles = createStyles(palette, insets, colorScheme);
  const [activeTab, setActiveTab] = useState<'bookings' | 'chats'>('bookings');

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleChat = (artistId: string, artistName: string) => {
    router.push({
      pathname: '/chat',
      params: { recipientId: artistId, recipientName: artistName },
    });
  };

  const formatChatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Pressable
            style={styles.titleButton}
            onPress={() => setActiveTab('bookings')}
          >
            <Text
              style={[
                styles.title,
                activeTab === 'bookings' && styles.titleActive,
              ]}
            >
              Bookings
            </Text>
          </Pressable>
          <Pressable
            style={styles.titleButton}
            onPress={() => setActiveTab('chats')}
          >
            <Text
              style={[styles.title, activeTab === 'chats' && styles.titleActive]}
            >
              Chats
            </Text>
          </Pressable>
        </View>
        <Text style={styles.subtitle}>
          {activeTab === 'bookings'
            ? 'Your upcoming appointments'
            : 'Your conversations'}
        </Text>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {!isAuthenticated ? (
          <View style={styles.emptyState}>
            <Calendar size={64} color={palette.mutedForeground} />
            <Text style={styles.emptyTitle}>Sign in to view bookings</Text>
            <Text style={styles.emptySubtitle}>
              Please sign in to see your bookings and chats
            </Text>
            <Pressable style={styles.loginButton} onPress={handleLogin}>
              <LogIn size={20} color={palette.primaryForeground} />
              <Text style={styles.loginButtonText}>Sign In</Text>
            </Pressable>
          </View>
        ) : activeTab === 'bookings' ? (
          mockBookings.length === 0 ? (
            <View style={styles.emptyState}>
              <Calendar size={64} color={palette.mutedForeground} />
              <Text style={styles.emptyTitle}>No bookings yet</Text>
              <Text style={styles.emptySubtitle}>
                Your upcoming appointments will appear here
              </Text>
            </View>
          ) : (
            mockBookings.map((booking) => (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <View style={styles.bookingInfo}>
                    <Text style={styles.bookingArtist}>{booking.artistName}</Text>
                    <Text style={styles.bookingService}>{booking.service}</Text>
                  </View>
                  <Pressable
                    style={styles.chatButton}
                    onPress={() => handleChat(booking.id, booking.artistName)}
                  >
                    <MessageCircle size={20} color={palette.primary} />
                  </Pressable>
                </View>
                <View style={styles.bookingDetails}>
                  <View style={styles.bookingDetailRow}>
                    <Calendar size={16} color={palette.mutedForeground} />
                    <Text style={styles.bookingDetailText}>
                      {new Date(booking.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      at {booking.time}
                    </Text>
                  </View>
                  <View style={styles.bookingDetailRow}>
                    <MapPin size={16} color={palette.mutedForeground} />
                    <Text style={styles.bookingDetailText}>{booking.location}</Text>
                  </View>
                </View>
                <View style={styles.bookingFooter}>
                  <View
                    style={[
                      styles.statusBadge,
                      booking.status === 'confirmed' && styles.statusBadgeConfirmed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        booking.status === 'confirmed' && styles.statusTextConfirmed,
                      ]}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )
        ) : mockChats.length === 0 ? (
          <View style={styles.emptyState}>
            <MessageCircle size={64} color={palette.mutedForeground} />
            <Text style={styles.emptyTitle}>No chats yet</Text>
            <Text style={styles.emptySubtitle}>
              Start a conversation with an artist
            </Text>
          </View>
        ) : (
          mockChats.map((chat) => (
            <Pressable
              key={chat.id}
              style={styles.chatCard}
              onPress={() => handleChat(chat.recipientId, chat.recipientName)}
            >
              <View style={styles.chatAvatar}>
                <User size={24} color={palette.foreground} />
              </View>
              <View style={styles.chatContent}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName}>{chat.recipientName}</Text>
                  <Text style={styles.chatTime}>{formatChatTime(chat.timestamp)}</Text>
                </View>
                <View style={styles.chatMessageRow}>
                  <Text style={styles.chatMessage} numberOfLines={1}>
                    {chat.lastMessage}
                  </Text>
                  {chat.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{chat.unreadCount}</Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
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
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 24,
      marginBottom: 4,
    },
    titleButton: {
      paddingVertical: 4,
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      color: palette.mutedForeground,
    },
    titleActive: {
      color: palette.foreground,
    },
    subtitle: {
      fontSize: 16,
      color: palette.mutedForeground,
    },
    scrollView: {
      flex: 1,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 80,
      paddingHorizontal: 24,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: palette.foreground,
      marginTop: 24,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 14,
      color: palette.mutedForeground,
      textAlign: 'center',
    },
    bookingCard: {
      backgroundColor: palette.card,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 12,
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
    bookingHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    bookingInfo: {
      flex: 1,
      marginRight: 12,
    },
    bookingArtist: {
      fontSize: 18,
      fontWeight: '700',
      color: palette.foreground,
      marginBottom: 4,
    },
    bookingService: {
      fontSize: 14,
      color: palette.mutedForeground,
    },
    chatButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: palette.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
    },
    bookingDetails: {
      gap: 8,
      marginBottom: 12,
    },
    bookingDetailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    bookingDetailText: {
      fontSize: 14,
      color: palette.foreground,
    },
    bookingFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: palette.muted,
    },
    statusBadgeConfirmed: {
      backgroundColor: palette.primary + '20',
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
      color: palette.mutedForeground,
    },
    statusTextConfirmed: {
      color: palette.primary,
    },
    chatCard: {
      flexDirection: 'row',
      backgroundColor: palette.card,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 12,
      gap: 12,
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
    chatAvatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: palette.muted,
      justifyContent: 'center',
      alignItems: 'center',
    },
    chatContent: {
      flex: 1,
      justifyContent: 'center',
    },
    chatHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    chatName: {
      fontSize: 16,
      fontWeight: '700',
      color: palette.foreground,
    },
    chatTime: {
      fontSize: 12,
      color: palette.mutedForeground,
    },
    chatMessageRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
    },
    chatMessage: {
      flex: 1,
      fontSize: 14,
      color: palette.mutedForeground,
    },
    unreadBadge: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: palette.primary,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6,
    },
    unreadText: {
      fontSize: 12,
      fontWeight: '700',
      color: palette.primaryForeground,
    },
    loginButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.primary,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 24,
      marginTop: 24,
      gap: 8,
    },
    loginButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: palette.primaryForeground,
    },
  });
}

