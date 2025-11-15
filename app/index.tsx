import { useAppState } from '@/providers/app-state-provider';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function RootIndex() {
  const { hasSeenOnboarding, isAuthenticated, isHydrating } = useAppState();

  // Show loading while checking AsyncStorage and auth state
  if (isHydrating) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If user hasn't seen onboarding, show it
  if (!hasSeenOnboarding) {
    return <Redirect href="/(onboarding)" />;
  }

  // If user has seen onboarding, go directly to home (tabs)
  return <Redirect href="/(tabs)" />;
}

