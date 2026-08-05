// src/services/auth/authService.ts
import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider } from '@react-native-firebase/auth';
import { nativeAuth } from './firebase';

const ALLOWED_EMAIL_DOMAIN = 'iitgn.ac.in';

GoogleSignin.configure({
  webClientId: '799004821779-mpv0sue4pjuhg3e2jld70htmbk3nfc2i.apps.googleusercontent.com',
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

  logout: async () => {
    try {
      await GoogleSignin.signOut();
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
