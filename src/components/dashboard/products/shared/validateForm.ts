import { log_validateForm } from '../../../../logConfig';

export const validateForm = (state: any, setErrors: Function) => {
    let tmpErrors: any = [];

    if (state.name.length === 0) {
        tmpErrors = { ...tmpErrors, name: 'اسم نمیتواند خالی باشد' };
    } else if (state.name.length < 2 || state.name.length > 64) {
        tmpErrors = {
            ...tmpErrors,
            name: 'اسم باید بین ۲ تا ۶۴ کارکتر باشه',
        };
    }

    if (!state.category) {
        tmpErrors = { ...tmpErrors, category: 'لطفا یک دسته بندی انتخاب کن' };
    }

    if (state.pictures !== undefined && state.pictures.length > 5) {
        tmpErrors = {
            ...tmpErrors,
            pictures: 'حداکثر میشه ۵تا عکس انتخاب کرد',
        };
    }

    log_validateForm && console.log('🚀 - validateForm - tmpErrors', tmpErrors);
    setErrors(tmpErrors);
    return tmpErrors;
};
