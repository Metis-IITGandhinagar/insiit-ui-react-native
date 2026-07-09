import AsyncStorage from "@react-native-async-storage/async-storage";
import { QRSession } from "./qrTypes";

const LOGIN_URL = "https://mess.iitgn.ac.in/phpscripts/authenticate.php";
const HOME_URL = "https://mess.iitgn.ac.in/";

const CACHE_KEY = "@insiit:qr_session";

export const qrService = {
    async getSession(): Promise<QRSession | null> {
        const session = await AsyncStorage.getItem(CACHE_KEY);
        return session ? JSON.parse(session) : null;
    },

    async clearSession(): Promise<void> {
        await AsyncStorage.removeItem(CACHE_KEY);
    },

    async refreshQR(email: string, password: string): Promise<QRSession> {
        console.log("=== QR Refresh Started ===");
        console.log("Email:", email);
        const body = new URLSearchParams();
        body.append("useremail", email);
        body.append("userpassword", password);

        const loginResponse = await fetch(LOGIN_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: body.toString(),
        });
        const loginBody = await loginResponse.text();
        console.log(loginBody.substring(0, 300));
        if (!loginResponse.ok) {
            throw new Error("Login failed");
        }
        console.log("Login Status:", loginResponse.status);
        console.log(await loginResponse.text());   
        const homeResponse = await fetch(HOME_URL, {
            method: "GET",
        });
        console.log("Home Status:", homeResponse.status);
        if (!homeResponse.ok) {
            throw new Error("Unable to load mess homepage");
        }

        const html = await homeResponse.text();
        console.log(html.substring(0, 500));

        const matches = [...html.matchAll(
            /<span[^>]*class="[^"]*text-purple[^"]*"[^>]*>(.*?)<\/span>/gs
        )];

        if (matches.length < 2) {
            throw new Error("Unable to find QR");
        }
        const qrData = matches[1][1].trim();

        const session: QRSession = {
            email,
            qrData,
            fetchedAt: Date.now(),
        };

        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(session));

        return session;
    },
};