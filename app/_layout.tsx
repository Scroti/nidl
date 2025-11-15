import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

import { SplashGate } from '@/components/splash-gate';
import { AppStateProvider } from '@/providers/app-state-provider';
import { LocationProvider } from '@/providers/location-provider';
import { ThemeProvider, useTheme } from '@/providers/theme-provider';


export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const { colorScheme } = useTheme();

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="(onboarding)"
          options={{ headerShown: false, animation: 'fade' }}
        />
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false, animation: 'fade' }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="location-selector"
          options={{ headerShown: false, presentation: 'modal' }}
        />
        <Stack.Screen
          name="settings"
          options={{ headerShown: false, presentation: 'modal' }}
        />
          <Stack.Screen
            name="help-center"
            options={{ headerShown: false, presentation: 'modal' }}
          />
          <Stack.Screen
            name="edit-profile"
            options={{ headerShown: false, presentation: 'modal' }}
          />
          <Stack.Screen
            name="chat"
            options={{ headerShown: false, presentation: 'modal' }}
          />
          <Stack.Screen
            name="artist-detail"
            options={{ headerShown: false, presentation: 'card' }}
          />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SplashGate>
        <AppStateProvider>
          <ThemeProvider>
            <LocationProvider>
              <RootLayoutContent />
            </LocationProvider>
          </ThemeProvider>
        </AppStateProvider>
      </SplashGate>
    </SafeAreaProvider>
  );
}
