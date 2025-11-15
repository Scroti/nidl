# Firebase Google Authentication Setup

This guide will help you set up Google authentication using Firebase (no Google Cloud Console needed!).

## Step 1: Enable Google Sign-In in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** > **Sign-in method**
4. Click on **Google** provider
5. Toggle **Enable** to ON
6. Add your **Project support email** (required)
7. Click **Save**

That's it! Firebase automatically handles the OAuth configuration for you.

## Step 2: Get Your Web Client ID

Firebase automatically creates an OAuth client when you enable Google sign-in. You need to get the Web client ID:

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click on **Google** (should show as "Enabled")
3. You'll see **Web client ID** - copy this value
4. Add it to your `.env` file:

```env
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-web-client-id-here.apps.googleusercontent.com
```

**Important:** You need this client ID for the OAuth flow to work. Firebase creates it automatically, but you need to add it to your environment variables.

## Step 3: Configure Authorized Redirect URIs

**CRITICAL:** You must add the redirect URI to your Google OAuth client. The redirect URI will be printed in the console when you try to sign in.

### Find Your Redirect URI

1. Start your Expo app: `npm start`
2. Navigate to the login screen and try to sign in with Google
3. Check your console/terminal - you'll see output like:
   ```
   🔐 Google OAuth Configuration:
      Redirect URI: https://auth.expo.io/@anonymous/nidl
      Project Slug: nidl
      Expo Username: anonymous
   ```
4. **Copy the exact Redirect URI** shown in the console

### Add to Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **APIs & Services** > **Credentials**
4. Find your **OAuth 2.0 Client ID** (this is the Web client ID from Firebase)
5. Click **Edit**
6. Under **Authorized redirect URIs**, click **ADD URI**
7. **Paste the exact redirect URI** from your console (e.g., `https://auth.expo.io/@anonymous/nidl`)
8. Click **Save**

### Important Notes

- The redirect URI **must be HTTPS** (not `exp://`)
- The redirect URI format is: `https://auth.expo.io/@username/slug`
- If you're not logged into Expo CLI, the username will be `anonymous`
- If you see "Access blocked" or "Invalid Origin" errors, it means:
  - The redirect URI doesn't match exactly what's in Google Cloud Console
  - You need to add the exact URI shown in your console logs

## Step 4: Test the Implementation

1. Make sure Google sign-in is enabled in Firebase Console
2. Start your Expo app: `npm start`
3. Navigate to the login or signup screen
4. Click the "Continue with Google" button
5. You should be redirected to Google's sign-in page
6. After signing in, you'll be redirected back and signed into Firebase

## How It Works

1. User clicks "Continue with Google"
2. App opens Google OAuth flow (using Firebase's OAuth client)
3. User signs in with Google
4. Google returns an ID token
5. App uses the ID token with Firebase's `GoogleAuthProvider.credential()`
6. Firebase authenticates the user and creates/updates their account
7. User is signed into your app

## Troubleshooting

### Error: "Google sign-in is not enabled"
- Make sure Google sign-in is enabled in Firebase Console
- Go to **Authentication** > **Sign-in method** > **Google** and verify it's enabled

### Error: "Failed to receive ID token"
- Check your internet connection
- Verify the redirect URI is correct
- Make sure you're using the correct OAuth client ID

### OAuth flow doesn't open
- Make sure `expo-web-browser` is installed (already included)
- Check that your app scheme is correctly configured in `app.json`
- Try clearing the app cache and restarting

### User not created in Firebase
- Check Firebase Console > Authentication > Users
- Verify Google sign-in is enabled
- Check the browser console for any errors

## Important Notes

- **No Google Cloud Console setup needed!** Firebase handles everything
- Firebase automatically creates the OAuth client when you enable Google sign-in
- The implementation uses Firebase's `GoogleAuthProvider` which is the official way to authenticate with Google
- Users are automatically created in Firebase Authentication when they sign in
- The user's Google profile (name, email, photo) is automatically synced to Firebase

## Security

- The OAuth flow uses PKCE (Proof Key for Code Exchange) for security
- ID tokens are validated by Firebase
- No sensitive credentials are stored in the app
- All authentication is handled securely through Firebase

