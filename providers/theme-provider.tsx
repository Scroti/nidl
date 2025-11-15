import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, ColorSchemeName, Platform } from 'react-native';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';

const STORAGE_KEY_THEME = 'nidl:color-scheme';

type ThemeContextType = {
  colorScheme: ColorSchemeName;
  toggleTheme: () => void;
  setTheme: (theme: ColorSchemeName) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  colorScheme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: PropsWithChildren) {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  useEffect(() => {
    // Load saved theme preference
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEY_THEME);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setColorScheme(savedTheme);
          Appearance.setColorScheme(savedTheme);
        }
      } catch (error) {
        console.warn('ThemeProvider: failed to load theme preference', error);
      }
    };

    loadTheme();

    // Listen to system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Only update if user hasn't set a manual preference
      AsyncStorage.getItem(STORAGE_KEY_THEME).then((saved) => {
        if (!saved) {
          setColorScheme(colorScheme);
        }
      });
    });

    return () => subscription.remove();
  }, []);

  const setTheme = useCallback(async (theme: ColorSchemeName) => {
    try {
      if (theme && theme !== colorScheme) {
        // Change theme instantly
        setColorScheme(theme);
        Appearance.setColorScheme(theme);
        
        // Save to storage (non-blocking)
        AsyncStorage.setItem(STORAGE_KEY_THEME, theme).catch((error) => {
          console.warn('ThemeProvider: failed to save theme preference', error);
        });
      }
    } catch (error) {
      console.warn('ThemeProvider: failed to set theme', error);
    }
  }, [colorScheme]);

  const toggleTheme = useCallback(() => {
    const newTheme = colorScheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [colorScheme, setTheme]);

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

