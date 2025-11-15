import { Colors } from '@/constants/theme';
import { useTheme } from '@/providers/theme-provider';
import { Tabs } from 'expo-router';
import { Calendar1, CircleUserRound, House, ScanSearch } from 'lucide-react-native';
import React from 'react';

export default function TabLayout() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? colors.card : colors.sidebar,
          borderTopWidth: 0,
          paddingTop: 4,
          paddingBottom: 12,
          height: 76,
          shadowColor: colorScheme === 'dark' ? '#000' : 'rgba(0, 0, 0, 0.05)',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: colorScheme === 'dark' ? 0.5 : 0.1,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarItemStyle: {
          paddingTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <House size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <ScanSearch size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          title: 'Booking',
          tabBarIcon: ({ color, size }) => <Calendar1 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => <CircleUserRound size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
