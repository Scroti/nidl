import { auth } from '@/config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, User } from 'firebase/auth';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type AppState = {
  hasSeenOnboarding: boolean;
  isAuthenticated: boolean;
  isHydrating: boolean;
  user: User | null;
  markOnboardingSeen: () => Promise<void>;
};

const STORAGE_KEY_ONBOARDING = 'nidl:onboarding-seen';

const initialState: AppState = {
  hasSeenOnboarding: false,
  isAuthenticated: false,
  isHydrating: true,
  user: null,
  markOnboardingSeen: async () => {
    // no-op placeholder
  },
};

const AppStateContext = createContext<AppState>(initialState);

export function AppStateProvider({ children }: PropsWithChildren) {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isHydrating, setHydrating] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Hydrate onboarding state from AsyncStorage
  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(STORAGE_KEY_ONBOARDING);
        if (storedValue && isMounted) {
          setHasSeenOnboarding(storedValue === 'true');
        }
      } catch (error) {
        console.warn('AppStateProvider: failed to hydrate onboarding flag', error);
      } finally {
        if (isMounted) {
          setHydrating(false);
        }
      }
    };

    hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthenticated(!!firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  const markOnboardingSeen = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_ONBOARDING, 'true');
      setHasSeenOnboarding(true);
    } catch (error) {
      console.warn('AppStateProvider: failed to persist onboarding flag', error);
    }
  }, []);

  const value = useMemo<AppState>(
    () => ({
      hasSeenOnboarding,
      isAuthenticated,
      isHydrating,
      user,
      markOnboardingSeen,
    }),
    [hasSeenOnboarding, isAuthenticated, isHydrating, user, markOnboardingSeen],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }

  return context;
}


