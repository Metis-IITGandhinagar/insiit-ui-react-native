import AsyncStorage from '@react-native-async-storage/async-storage';
import { QRSession } from './qrTypes';

const QR_SESSION_KEY = '@mess_qr_session';
const MESS_PORTAL_URL = process.env.EXPO_PUBLIC_MESS_PORTAL_URL || 'https://mess.iitgn.ac.in';

export const qrService = {
    async getSession(): Promise<QRSession | null> {
        try {
            const data = await AsyncStorage.getItem(QR_SESSION_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error("Failed to fetch QR session:", e);
            return null;
        }
    },

    async clearSession(): Promise<void> {
        try {
            await AsyncStorage.removeItem(QR_SESSION_KEY);
        } catch (e) {
            console.error("Failed to clear QR session:", e);
        }
    },

    async refreshQR(email: string, password: string): Promise<QRSession> {
        try {
            // 1. Send application/x-www-form-urlencoded body matching standard PHP POST handling
            const formBody = new URLSearchParams({
                useremail: email,
                userpassword: password,
            }).toString();

            const authUrl = `${MESS_PORTAL_URL}/phpscripts/authenticate.php`;

            const loginResponse = await fetch(authUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36',
                },
                body: formBody,
            });

            if (!loginResponse.ok) {
                throw new Error(`Authentication server error (${loginResponse.status}).`);
            }

            // 2. Safely extract PHPSESSID from Set-Cookie headers
            const rawCookies = loginResponse.headers.get('set-cookie') || '';
            let cookieHeader = '';

            const sessionMatch = rawCookies.match(/PHPSESSID=([^;]+)/);
            if (sessionMatch) {
                cookieHeader = `PHPSESSID=${sessionMatch[1]}`;
            }

            // 3. Fetch index.php with explicit session cookie attached
            const indexHeaders: Record<string, string> = {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36',
                'Referer': `${MESS_PORTAL_URL}/`,
            };

            if (cookieHeader) {
                indexHeaders['Cookie'] = cookieHeader;
            }

            const indexResponse = await fetch(`${MESS_PORTAL_URL}/index.php`, {
                method: 'GET',
                headers: indexHeaders,
            });

            const html = await indexResponse.text();

            // Check if authentication was rejected by PHP session
            if (html.includes('userpassword') || html.includes('login.php')) {
                throw new Error("Invalid email or password. Please check your credentials.");
            }

            // 4. Extract target string matching ord[1] element
            const regex = /<span[^>]*class=["'][^"']*\btext-purple\b[^"']*["'][^>]*>(.*?)<\/span>/gi;
            let matches: string[] = [];
            let match;

            while ((match = regex.exec(html)) !== null) {
                const cleanText = match[1].replace(/(<([^>]+)>)/gi, "").trim();
                matches.push(cleanText);
            }

            if (matches.length > 1) {
                const qrData = matches[1];
                const session: QRSession = { email, qrData };
                await AsyncStorage.setItem(QR_SESSION_KEY, JSON.stringify(session));
                return session;
            } else {
                throw new Error("Could not find QR token in portal session.");
            }
        } catch (error) {
            console.error("Mess QR Scraper error:", error);
            throw error;
        }
    }
};