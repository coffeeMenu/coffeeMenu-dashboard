import { compressImage } from '../../../../modules/compressImage';
import { createObjectFromUrl } from '../../../../modules/imageParser';
import { apiUrl } from '../../../../modules/pocketbase';

// https://pocketbase.io/docs/files-handling
export const createFormData = async (state: any, collectionId?: string, productId?: string) => {
    const formData = new FormData();
    formData.append('store', state.store as string);
    formData.append('name', state.name);
    formData.append('category', state.category);
    formData.append('description', state.description);
    if (state.pictures) {
        for (let picture of state.pictures) {
            if (typeof picture === 'object') {
                // compressing new images
                const compressedPicture = await compressImage(picture);
                formData.append('pictures', compressedPicture as Blob);
            } else {
                // sending old images again
                const tmpPic = `${apiUrl}/api/files/${collectionId}/${productId}/${picture}`;
                formData.append('pictures', await createObjectFromUrl(tmpPic));
            }
        }
    }
    formData.append('price', state.price);
    formData.append('discount', state.discount);
    formData.append('available', state.available === true ? 'true' : 'false');

    return formData;
};
