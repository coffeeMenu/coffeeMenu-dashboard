import { log_productDrawerReducer } from '../../../../logConfig';

export type ProductState = {
    store: string | null;
    name: string;
    category: any;
    description: string;
    pictures: any;
    price: string;
    discount: string;
    available: boolean;
};

export type ProductAction = {
    type?: 'addPicture' | 'setPictures' | 'setAsMainPicture' | 'deletePicture' | 'setState' | 'clearAll';
    key?: string | undefined;
    value?: string | boolean | FileList | undefined | null;
    state?: any;
};

const storeId = localStorage.getItem('store');
export const initialState: ProductState = {
    store: storeId,
    name: '',
    description: '',
    category: null,
    pictures: undefined,
    price: '',
    discount: '',
    available: true,
};

export function reducer(state: ProductState, action: ProductAction) {
    log_productDrawerReducer && console.log('💽 prevState: ', state);
    log_productDrawerReducer && console.log('🔥 action: ', action);

    switch (action.type) {
        case 'addPicture':
            if (state.pictures) {
                return {
                    ...state,
                    [action.key as string]: [...state.pictures, ...(action.value as FileList)],
                };
            }
            return {
                ...state,
                [action.key as string]: [...(action.value as FileList)],
            };

        case 'setPictures':
            return { ...state, pictures: action.value };

        case 'setAsMainPicture': {
            const index = parseInt(action.key as string);
            const tmpPicture = state.pictures.splice(index, 1);
            return { ...state, pictures: [...tmpPicture, ...state.pictures] };
        }

        case 'deletePicture': {
            const index = parseInt(action.key as string);
            const tmpState = state;
            tmpState.pictures.splice(index, 1);
            return { ...tmpState };
        }

        case 'setState':
            return action.state;

        case 'clearAll':
            const storeId = localStorage.getItem('store');
            return { ...initialState, store: storeId };

        default:
            return { ...state, [action.key as string]: action.value };
    }
}
