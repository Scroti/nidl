# Firebase Setup Guide

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

## Step 2: Register Your App

### For Web App (Expo managed workflow)

1. In Firebase Console, go to **Project Settings** > **General** tab
2. Scroll down to **Your apps** section
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "Nidl Web")
5. Copy the Firebase configuration object

## Step 3: Configure Environment Variables

1. Create a `.env` file in the root of your project (copy from `.env.example` if it exists)
2. Add your Firebase configuration values:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key-here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

3. Replace the placeholder values with your actual Firebase config values

## Step 4: Enable Firebase Services

### Enable Authentication

1. Go to **Authentication** > **Get started**
2. Enable **Email/Password** sign-in method (or other methods you need)
3. Configure any additional settings

### Enable Firestore (if needed)

1. Go to **Firestore Database** > **Create database**
2. Start in **test mode** (or production mode with rules)
3. Choose a location for your database

## Step 5: Usage in Your App

Import Firebase services in your components:

```typescript
import { auth, db } from '@/config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
```

## Alternative: Using React Native Firebase

If you need native Firebase features (like push notifications, analytics, etc.), you'll need to:

1. Install development build dependencies:
   ```bash
   npx expo install expo-dev-client
   ```

2. Install React Native Firebase:
   ```bash
   npm install @react-native-firebase/app @react-native-firebase/auth
   ```

3. Create a development build:
   ```bash
   npx expo prebuild
   npx expo run:ios  # or npx expo run:android
   ```

4. Add `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) to your native folders

**Note:** React Native Firebase requires a development build and cannot be used in Expo Go.

