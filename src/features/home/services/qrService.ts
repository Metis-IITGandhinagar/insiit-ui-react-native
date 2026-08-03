// services/qrService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QRSession } from './qrTypes';

const QR_SESSION_KEY = '@mess_qr_session';

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
            const formBody = `useremail=${encodeURIComponent(email)}&userpassword=${encodeURIComponent(password)}`;

            const loginResponse = await fetch('http://mess.iitgn.ac.in/phpscripts/authenticate.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0 (Mobile; React-Native)',
                },
                body: formBody,
            });

            const setCookieHeader = loginResponse.headers.get('set-cookie');
            let sessionCookie = '';

            if (setCookieHeader) {
                sessionCookie = setCookieHeader.split(';')[0];
            } else {
                throw new Error("Authentication failed. No session cookie received.");
            }

            const indexResponse = await fetch('http://mess.iitgn.ac.in/', {
                method: 'GET',
                headers: {
                    'Cookie': sessionCookie,
                    'User-Agent': 'Mozilla/5.0 (Mobile; React-Native)',
                    'Referer': 'http://mess.iitgn.ac.in/'
                },
            });

            const html = await indexResponse.text();

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
                console.log("5. HTML Snippet:", html.substring(0, 300).replace(/\n/g, ' '));

                throw new Error("Failed to find QR code on the index page.");
            }

        } catch (error) {
            console.error("Web scraping failed:", error);
            throw error;
        }
    }
};