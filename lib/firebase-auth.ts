import { auth } from '@/config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  RecaptchaVerifier,
  User,
} from 'firebase/auth';

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
 * Update user profile (display name, photo URL)
 */
export async function updateUserProfile(updates: {
  displayName?: string;
  photoURL?: string;
}): Promise<void> {
  try {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in');
    }
    await updateProfile(auth.currentUser, updates);
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code) || error.message);
  }
}

/**
 * Update user email (requires re-authentication)
 */
export async function updateUserEmail(newEmail: string, password: string): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error('No user is currently signed in');
    }

    // Re-authenticate user
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);

    // Update email
    await updateEmail(user, newEmail);
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code) || error.message);
  }
}

/**
 * Send OTP to phone number
 * Note: This requires RecaptchaVerifier setup for web
 * For React Native, you may need to use a different approach
 */
export async function sendPhoneOTP(phone: string): Promise<void> {
  try {
    // For React Native, phone auth works differently
    // You may need to use Firebase Phone Auth with reCAPTCHA
    // This is a simplified version - you may need to adjust based on your setup
    throw new Error('Phone authentication setup required. Please configure reCAPTCHA.');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send OTP');
  }
}

/**
 * Verify phone OTP
 */
export async function verifyPhoneOTP(phone: string, verificationCode: string): Promise<User> {
  try {
    // Implementation depends on your phone auth setup
    throw new Error('Phone authentication setup required.');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to verify OTP');
  }
}

/**
 * Sign in with Google OAuth
 * Note: Requires additional setup for React Native
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    // Google OAuth implementation depends on your setup
    // You may need expo-auth-session or similar
    throw new Error('Google OAuth setup required.');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in with Google');
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
    case 'auth/requires-recent-login':
      return 'Please sign out and sign in again to perform this action.';
    default:
      return 'An error occurred. Please try again.';
  }
}

