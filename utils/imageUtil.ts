import { ImagePickerAsset } from "expo-image-picker";

function getFormDataImages(key: string, images:ImagePickerAsset[]) {
    const formData = new FormData();

    images.forEach(({uri, mimeType = "image/jpeg"}) => {
        const file = {
            uri,
            type: mimeType,
            name: uri.split("/").pop(),
        };

        formData.append(key, file as unknown as File);
    });

    return formData;
}

export { getFormDataImages };