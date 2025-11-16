# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter project name: `nidl`
   - Enable Google Analytics (optional)
   - Choose or create Analytics account

## Step 2: Add Your App

1. In Firebase Console, click the **Web** icon (`</>`) or **Add app**
2. Register your app:
   - App nickname: `nidl`
   - Firebase Hosting: Not needed for React Native
3. Copy your Firebase configuration

## Step 3: Get Firebase Config

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click on your web app
4. Copy the config values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

## Step 4: Add Environment Variables

Create or update your `.env` file in the project root:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Important**: Restart your Expo dev server after adding these!

## Step 5: Enable Authentication Methods

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable the following providers:
   - **Email/Password**: Click, toggle "Enable", Save
   - **Phone**: Click, toggle "Enable", configure (requires setup)
   - **Google**: Click, toggle "Enable", add OAuth credentials

## Step 6: Test Connection

After setting up, restart your Expo dev server and the app should connect to Firebase!

## Next Steps

- Test email/password authentication
- Set up phone authentication (if needed)
- Set up Google OAuth (if needed)
- Configure Firestore for data storage (if needed)

