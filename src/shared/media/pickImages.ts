// src/shared/media/pickImages.ts
import * as ImagePicker from 'expo-image-picker';

export const pickImagesAsBase64 = async (limit = 4): Promise<string[]> => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: limit,
        quality: 0.6,
        base64: true,
    });

    if (result.canceled || !result.assets) return [];

    return result.assets
        .filter((asset) => !!asset.base64)
        .slice(0, limit)
        .map((asset) => `data:image/jpeg;base64,${asset.base64}`);
};


export const fetchImageAsBase64 = (url: string): Promise<string> =>
    
    new Promise<string>((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.responseType = 'blob';

        request.onerror = () => reject(new Error(`Could not download image: ${url}`));

        request.onload = () => {
            if (request.status < 200 || request.status >= 300) {
                reject(new Error(`Could not download image (${request.status}): ${url}`));
                return;
            }

            const reader = new FileReader();
            reader.onerror = () => reject(new Error(`Could not read image data: ${url}`));
            reader.onload = () => {
                typeof reader.result === 'string'
                    ? resolve(reader.result)
                    : reject(new Error(`Unexpected image data: ${url}`));
            };
            reader.readAsDataURL(request.response);
        };

        request.open('GET', url);
        request.send();
    });
