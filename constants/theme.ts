/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    background: '#ffffff',
    foreground: '#09090b',
    card: '#ffffff',
    cardForeground: '#09090b',
    popover: '#ffffff',
    popoverForeground: '#09090b',
    primary: '#5ea500',
    primaryForeground: '#f7fee7',
    secondary: '#f4f4f5',
    secondaryForeground: '#18181b',
    muted: '#f4f4f5',
    mutedForeground: '#71717b',
    accent: '#f4f4f5',
    accentForeground: '#18181b',
    destructive: '#e7000b',
    border: '#e4e4e7',
    input: '#e4e4e7',
    ring: '#9ae600',
    chart1: '#7bf1a8',
    chart2: '#00c950',
    chart3: '#00a63e',
    chart4: '#008236',
    chart5: '#016630',
    sidebar: '#fafafa',
    sidebarForeground: '#09090b',
    sidebarPrimary: '#5ea500',
    sidebarPrimaryForeground: '#f7fee7',
    sidebarAccent: '#f4f4f5',
    sidebarAccentForeground: '#18181b',
    sidebarBorder: '#e4e4e7',
    sidebarRing: '#9ae600',
    // Legacy aliases
    text: '#09090b',
    tint: '#5ea500',
    icon: '#71717b',
    tabIconDefault: '#71717b',
    tabIconSelected: '#5ea500',
  },
  dark: {
    background: '#09090b',
    foreground: '#fafafa',
    card: '#18181b',
    cardForeground: '#fafafa',
    popover: '#18181b',
    popoverForeground: '#fafafa',
    primary: '#5ea500',
    primaryForeground: '#f7fee7',
    secondary: '#27272a',
    secondaryForeground: '#fafafa',
    muted: '#27272a',
    mutedForeground: '#9f9fa9',
    accent: '#27272a',
    accentForeground: '#fafafa',
    destructive: '#ff6467',
    border: '#ffffff',
    input: '#ffffff',
    ring: '#35530e',
    chart1: '#7bf1a8',
    chart2: '#00c950',
    chart3: '#00a63e',
    chart4: '#008236',
    chart5: '#016630',
    sidebar: '#18181b',
    sidebarForeground: '#fafafa',
    sidebarPrimary: '#7ccf00',
    sidebarPrimaryForeground: '#f7fee7',
    sidebarAccent: '#27272a',
    sidebarAccentForeground: '#fafafa',
    sidebarBorder: '#ffffff',
    sidebarRing: '#35530e',
    // Legacy aliases
    text: '#fafafa',
    tint: '#5ea500',
    icon: '#9f9fa9',
    tabIconDefault: '#9f9fa9',
    tabIconSelected: '#5ea500',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
