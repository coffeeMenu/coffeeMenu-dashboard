import { compressImage } from '../../../../modules/compressImage';

export const createFormData = async (state: any) => {
    const formData = new FormData();
    formData.append('store', state.store as string);
    formData.append('name', state.name);
    formData.append('category', state.category);
    formData.append('description', state.description);
    // compressing pictures
    if (state.pictures) {
        for (let picture of state.pictures) {
            const compressedPicture = await compressImage(picture);
            formData.append('pictures', compressedPicture as Blob);
        }
    }
    formData.append('price', state.price);
    formData.append('discount', state.discount);
    formData.append('available', state.available === true ? 'true' : 'false');

    return formData;
};
