import { auth } from '@/config/firebase';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithCredential,
    signInWithEmailAndPassword,
    signOut,
    User,
} from 'firebase/auth';

// Complete the auth session for better UX
WebBrowser.maybeCompleteAuthSession();

/**
 * Sign up a new user with email and password
 */
export async function signUp(email: string, password: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Sign out the current user
 */
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Send a password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Sign in with Google using OAuth
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      throw new Error(
        'Google OAuth client ID is not configured. ' +
        'Please set EXPO_PUBLIC_GOOGLE_CLIENT_ID in your .env file. ' +
        'You can find it in Firebase Console > Authentication > Sign-in method > Google > Web client ID'
      );
    }

    // Generate state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15) + 
                  Date.now().toString(36);

    // Google OAuth REQUIRES HTTPS redirect URIs with valid TLDs
    // We MUST use the Expo proxy HTTPS format, not exp://
    const projectSlug = Constants.expoConfig?.slug || Constants.manifest?.slug || 'nidl';
    
    // Try to get the actual Expo username (not "anonymous")
    // Priority: env variable > Constants > fallback to anonymous
    const expoUsername = 
      process.env.EXPO_PUBLIC_EXPO_USERNAME ||
      Constants.expoConfig?.owner || 
      Constants.manifest?.owner ||
      Constants.manifest2?.extra?.expoGo?.developer?.username ||
      'anonymous';
    
    // Always use HTTPS proxy format for Google OAuth
    // Format: https://auth.expo.io/@username/slug
    const redirectUri = `https://auth.expo.io/@${expoUsername}/${projectSlug}`;
    
    // Log detailed information for debugging
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('🔍 DEBUG INFO');
    console.log('═══════════════════════════════════════════════════════');
    console.log('Expo Username:', expoUsername);
    console.log('Project Slug:', projectSlug);
    console.log('Redirect URI:', redirectUri);
    console.log('═══════════════════════════════════════════════════════\n');
    
    if (expoUsername === 'anonymous') {
      console.warn('⚠️  Using "anonymous" username. For better results:');
      console.warn('   1. Run: npx expo login');
      console.warn('   2. Or set EXPO_PUBLIC_EXPO_USERNAME in .env');
      console.warn('   3. Restart your Expo server after setting the env variable');
    }
    
    // Log the exact redirect URI that needs to be added to Google Cloud Console
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('🔐 GOOGLE OAUTH SETUP REQUIRED');
    console.log('═══════════════════════════════════════════════════════');
    console.log('📋 COPY THIS EXACT REDIRECT URI:');
    console.log('');
    console.log(`   ${redirectUri}`);
    console.log('');
    console.log('⚠️  CRITICAL: Add this EXACT URI to Google Cloud Console');
    console.log('');
    console.log('Steps:');
    console.log('   1. Go to: https://console.cloud.google.com/');
    console.log('   2. Select your Firebase project: sunlit-apricot-321318');
    console.log('   3. Navigate to: APIs & Services > Credentials');
    console.log('   4. Find your OAuth 2.0 Client ID (Web client ID)');
    console.log('   5. Click the pencil icon (Edit)');
    console.log('   6. Scroll to "Authorized redirect URIs"');
    console.log('   7. Click "+ ADD URI"');
    console.log(`   8. Paste EXACTLY: ${redirectUri}`);
    console.log('   9. Click "ADD"');
    console.log('  10. Click "SAVE" at the bottom');
    console.log('');
    console.log('⚠️  Make sure there are NO extra spaces or characters!');
    console.log('═══════════════════════════════════════════════════════\n');

    // Create OAuth request with PKCE
    const request = new AuthSession.AuthRequest({
      clientId,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.Code,
      redirectUri,
      state,
      codeChallenge: AuthSession.CodeChallengeMethod.S256,
      usePKCE: true,
    });

    // Google OAuth endpoints
    const discovery = {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
    };

    // Start OAuth flow
    console.log('🔄 Starting Google OAuth flow...');
    const result = await request.promptAsync(discovery, {
      showInRecents: true,
    });

    console.log('📥 OAuth result type:', result.type);
    
    if (result.type !== 'success') {
      if (result.type === 'cancel') {
        throw new Error('Google sign-in was cancelled.');
      }
      if (result.type === 'error') {
        const errorMsg = result.error?.message || 'Google sign-in failed.';
        console.error('❌ OAuth Error Details:', {
          error: result.error,
          errorCode: result.error?.code,
          errorMessage: result.error?.message,
          params: result.params,
        });
        
        // Provide helpful error messages
        if (errorMsg.includes('redirect_uri_mismatch') || 
            errorMsg.includes('invalid_request') ||
            errorMsg.includes('redirect_uri')) {
          throw new Error(
            `Redirect URI mismatch!\n\n` +
            `The redirect URI in your code (${redirectUri}) doesn't match what's configured in Google Cloud Console.\n\n` +
            `Please:\n` +
            `1. Copy the redirect URI shown above\n` +
            `2. Go to Google Cloud Console > Credentials\n` +
            `3. Edit your OAuth 2.0 Client ID\n` +
            `4. Add the EXACT redirect URI to "Authorized redirect URIs"\n` +
            `5. Save and try again`
          );
        }
        throw new Error(`Google sign-in failed: ${errorMsg}`);
      }
      throw new Error('Google sign-in failed. Please try again.');
    }
    
    console.log('✅ OAuth authorization successful');

    if (!result.params.code) {
      throw new Error('Failed to receive authorization code from Google.');
    }

    // Exchange code for ID token
    // When using PKCE, we need to include the codeVerifier
    const exchangeParams: any = {
      clientId,
      code: result.params.code,
      redirectUri,
      extraParams: {},
    };
    
    // Add codeVerifier if PKCE is used (required for security)
    if (request.codeVerifier) {
      exchangeParams.codeVerifier = request.codeVerifier;
    }
    
    let tokenResponse;
    try {
      tokenResponse = await AuthSession.exchangeCodeAsync(
        exchangeParams,
        discovery
      );
    } catch (exchangeError: any) {
      console.error('Token exchange error:', exchangeError);
      throw new Error(
        `Failed to exchange authorization code for token: ${exchangeError.message || 'Unknown error'}`
      );
    }

    if (!tokenResponse.idToken) {
      console.error('Token response:', tokenResponse);
      throw new Error('Failed to receive ID token from Google. The token response did not contain an idToken.');
    }

    // Create Firebase credential and sign in
    const googleCredential = GoogleAuthProvider.credential(tokenResponse.idToken);
    const userCredential = await signInWithCredential(auth, googleCredential);
    
    return userCredential.user;
  } catch (error: any) {
    if (error.message) {
      throw error;
    }
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Get user-friendly error messages from Firebase error codes
 */
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use a stronger password.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many requests. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email address but different sign-in credentials.';
    case 'auth/invalid-credential':
      return 'The credential is invalid or has expired.';
    default:
      return 'An error occurred. Please try again.';
  }
}

