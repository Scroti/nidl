import { Colors } from '@/constants/theme';
import { useTheme } from '@/providers/theme-provider';
import { ArrowLeft, Image as ImageIcon, Send, User } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Message = {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isOwn: boolean;
};

export default function ChatScreen() {
  const { colorScheme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ recipientId?: string; recipientName?: string }>();
  const palette = Colors[colorScheme ?? 'light'];
  const styles = createStyles(palette, insets, colorScheme);

  const recipientName = params.recipientName || 'Artist';
  const recipientId = params.recipientId || 'unknown';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m interested in booking a session.',
      senderId: 'user',
      senderName: 'You',
      timestamp: new Date(Date.now() - 3600000),
      isOwn: true,
    },
    {
      id: '2',
      text: 'Hi! Thanks for reaching out. What style are you interested in?',
      senderId: recipientId,
      senderName: recipientName,
      timestamp: new Date(Date.now() - 3300000),
      isOwn: false,
    },
  ]);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText.trim(),
      senderId: 'user',
      senderName: 'You',
      timestamp: new Date(),
      isOwn: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageText('');
    setIsSending(true);

    // Simulate sending message
    setTimeout(() => {
      setIsSending(false);
    }, 500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={palette.foreground} />
        </Pressable>
        <View style={styles.headerInfo}>
          <View style={styles.avatarContainer}>
            <User size={20} color={palette.foreground} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerName}>{recipientName}</Text>
            <Text style={styles.headerStatus}>Online</Text>
          </View>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Messages */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[styles.messageWrapper, message.isOwn ? styles.messageWrapperOwn : styles.messageWrapperOther]}
          >
            <View
              style={[
                styles.messageBubble,
                message.isOwn ? styles.messageBubbleOwn : styles.messageBubbleOther,
              ]}
            >
              {!message.isOwn && (
                <Text style={styles.messageSender}>{message.senderName}</Text>
              )}
              <Text style={[styles.messageText, message.isOwn && styles.messageTextOwn]}>
                {message.text}
              </Text>
              <Text style={[styles.messageTime, message.isOwn && styles.messageTimeOwn]}>
                {formatTime(message.timestamp)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <Pressable style={styles.attachButton}>
          <ImageIcon size={20} color={palette.mutedForeground} />
        </Pressable>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          placeholderTextColor={palette.mutedForeground}
          multiline
          maxLength={500}
          onSubmitEditing={handleSend}
        />
        <Pressable
          style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!messageText.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color={palette.primaryForeground} />
          ) : (
            <Send size={20} color={palette.primaryForeground} />
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: insets.top + 8,
      paddingBottom: 16,
      paddingHorizontal: 16,
      backgroundColor: palette.background,
    },
    backButton: {
      padding: 8,
      marginRight: 8,
    },
    headerInfo: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: palette.muted,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    headerText: {
      flex: 1,
    },
    headerName: {
      fontSize: 18,
      fontWeight: '700',
      color: palette.foreground,
    },
    headerStatus: {
      fontSize: 12,
      color: palette.mutedForeground,
      marginTop: 2,
    },
    headerRight: {
      width: 40,
    },
    messagesContainer: {
      flex: 1,
    },
    messagesContent: {
      padding: 16,
      paddingBottom: 8,
    },
    messageWrapper: {
      marginBottom: 12,
      flexDirection: 'row',
    },
    messageWrapperOwn: {
      justifyContent: 'flex-end',
    },
    messageWrapperOther: {
      justifyContent: 'flex-start',
    },
    messageBubble: {
      maxWidth: '75%',
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 18,
    },
    messageBubbleOwn: {
      backgroundColor: palette.primary,
      borderBottomRightRadius: 4,
    },
    messageBubbleOther: {
      backgroundColor: palette.card,
      borderBottomLeftRadius: 4,
    },
    messageSender: {
      fontSize: 12,
      fontWeight: '600',
      color: palette.mutedForeground,
      marginBottom: 4,
    },
    messageText: {
      fontSize: 15,
      color: palette.foreground,
      lineHeight: 20,
    },
    messageTextOwn: {
      color: palette.primaryForeground,
    },
    messageTime: {
      fontSize: 11,
      color: palette.mutedForeground,
      marginTop: 4,
      alignSelf: 'flex-end',
    },
    messageTimeOwn: {
      color: palette.primaryForeground + 'CC',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 16,
      paddingBottom: insets.bottom + 8,
      paddingTop: 12,
      backgroundColor: palette.background,
      gap: 8,
    },
    attachButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: palette.card,
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      minHeight: 44,
      maxHeight: 100,
      backgroundColor: palette.card,
      borderRadius: 22,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 15,
      color: palette.foreground,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: palette.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
  });
}

