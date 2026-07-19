import { Alert, Linking } from "react-native";

export const openLink = async (url: string) => {
    try {
        await Linking.openURL(url);
    } catch {
        Alert.alert("Unable to open link");
    }
};

export const makecall = async (number:string) => {
    await Linking.openURL(`tel:${number}`);
};