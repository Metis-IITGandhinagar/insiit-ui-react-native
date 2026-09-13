import { Alert, Linking } from "react-native";

export const openLink = async (url: string) => {
    try {
        await Linking.openURL(url);
    } catch {
        Alert.alert("Unable to open link");
    }
};

export const makecall = async (number: string) => {
    // Stored numbers carry their dialling code and a space ("+91 9173606682"); a
    // tel: URI with whitespace in it is rejected by the dialler on both platforms.
    await Linking.openURL(`tel:${number.replace(/\s+/g, '')}`);
};