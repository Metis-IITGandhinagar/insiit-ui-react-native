// src/shared/media/pickImages.ts
import * as ImagePicker from 'expo-image-picker';

/**
 * Opens the photo library and returns data URIs for the chosen images.
 *
 * The backend's `save_image` (src/utils.rs) strips everything before the first
 * comma, so a `data:image/jpeg;base64,…` URI and a bare base64 string are both
 * accepted. We keep the data URI so the same string can be shown in a preview
 * <Image> before upload.
 *
 * Returns an empty array if the user cancels.
 */
export const pickImagesAsBase64 = async (limit = 4): Promise<string[]> => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: limit,
        // Uploads are base64 inside a JSON body, so keep them small.
        quality: 0.6,
        base64: true,
    });

    if (result.canceled || !result.assets) return [];

    return result.assets
        .filter((asset) => !!asset.base64)
        .slice(0, limit)
        .map((asset) => `data:image/jpeg;base64,${asset.base64}`);
};

/**
 * Downloads an already-uploaded image and re-encodes it as a data URI.
 *
 * The edit endpoints replace `img_urls` with whatever `base64_images` they receive, and
 * the client only holds URLs — so to keep an existing photo through an edit we have to
 * fetch it back and resend it as base64.
 */
export const fetchImageAsBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Could not fetch image (${response.status})`);

    const blob = await response.blob();

    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Could not read image data'));
        reader.onload = () => {
            typeof reader.result === 'string'
                ? resolve(reader.result)
                : reject(new Error('Unexpected image data'));
        };
        reader.readAsDataURL(blob);
    });
};
