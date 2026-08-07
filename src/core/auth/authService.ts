// src/services/auth/authService.ts
import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider } from '@react-native-firebase/auth';
import { nativeAuth } from './firebase';

const ALLOWED_EMAIL_DOMAIN = 'iitgn.ac.in';

// Must be referenced as a static `process.env.X` property so Expo can inline it at bundle time.
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

if (!WEB_CLIENT_ID) {
  throw new Error(
    'Missing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID. Add it to your .env file and restart the dev server (env vars are inlined at bundle time).'
  );
}

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  hostedDomain: ALLOWED_EMAIL_DOMAIN,
  offlineAccess: false,
});

export const authService = {
  login: async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      await GoogleSignin.signIn();

      const { idToken, accessToken } = await GoogleSignin.getTokens();

      if (!idToken) {
        throw new Error(
          'Google Sign-In completed, but no ID token was received. Check your Web Client ID configuration.'
        );
      }

      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      const userCredential = await nativeAuth.signInWithCredential(credential);

      const email = userCredential.user.email ?? '';
      const isAllowedDomain = email.toLowerCase().endsWith(`@${ALLOWED_EMAIL_DOMAIN.toLowerCase()}`);

      if (!isAllowedDomain) {
        await nativeAuth.signOut();
        await GoogleSignin.signOut();
        throw new Error(`Only @${ALLOWED_EMAIL_DOMAIN} accounts are allowed to sign in.`);
      }

      return userCredential.user;
    } catch (error) {
      if (isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_CANCELLED) {
        return null;
      }
      console.error('Error during authService.login step:', error);
      throw error;
    }
  },

  /**
   * Guest browsing. Creates a real (anonymous) Firebase session, so requests still
   * carry an ID token — one without an email claim, which every write route on the
   * backend rejects with 403. Firebase persists the session across launches.
   */
  loginAnonymously: async () => {
    const userCredential = await nativeAuth.signInAnonymously();
    return userCredential.user;
  },

  logout: async () => {
    // Best effort: a guest never signed in through Google, so this has nothing to
    // clear and must not be allowed to block the Firebase sign-out below.
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.warn('Google sign-out skipped:', error);
    }

    try {
      await nativeAuth.signOut();
    } catch (error) {
      console.error('Error during authService.logout step:', error);
      throw error;
    }
  },

  getCurrentUser: () => {
    return nativeAuth.currentUser;
  },

  getIdToken: async () => {
    const user = nativeAuth.currentUser;
    if (!user) return null;
    return await user.getIdToken(true);
  },
};
