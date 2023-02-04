import { log_validateForm } from '../../../../logConfig';

export const validateForm = (state: any, setErrors: Function) => {
    let tmpErrors: any = [];

    if (state.name.length === 0) {
        tmpErrors = { ...tmpErrors, name: "name can't be blank" };
    } else if (state.name.length < 2 || state.name.length > 64) {
        tmpErrors = {
            ...tmpErrors,
            name: 'name should be between 2 and 64 character',
        };
    }

    if (!state.category) {
        tmpErrors = { ...tmpErrors, category: 'please select a category' };
    }

    if (state.pictures !== undefined && state.pictures.length > 5) {
        tmpErrors = {
            ...tmpErrors,
            pictures: 'you can only set 5 picture',
        };
    }

    log_validateForm && console.log('🚀 - validateForm - tmpErrors', tmpErrors);
    setErrors(tmpErrors);
    return tmpErrors;
};
