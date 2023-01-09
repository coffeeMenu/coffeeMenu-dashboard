type ProductState = {
  store: string | null;
  name: string;
  category: any;
  description: string;
  pictures: any;
  price: string;
  discount: string;
  available: boolean;
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

export function reducer(
  state: ProductState,
  action: {
    type?: string;
    key?: string | undefined;
    value?: string | FileList | undefined | boolean;
  }
) {
  console.log('action.type', action.type);
  console.log('action.key', action.key);
  console.log('action.value', action.value);

  switch (action.type) {
    case 'addPicture':
      if (state.pictures) {
        return {
          ...state,
          [action.key as string]: [
            ...state.pictures,
            ...(action.value as FileList),
          ],
        };
      }
      return {
        ...state,
        [action.key as string]: [...(action.value as FileList)],
      };

    case 'setAsMainPicture': {
      const index = parseInt(action.key as string);
      const tmpPicture = state.pictures.splice(index, 1);
      return { ...state, pictures: [...tmpPicture, ...state.pictures] };
    }

    case 'replacePicture': {
      // const index = parseInt(action.key);
      // const tmpPicture = state.pictures.splice(index, 1);
      // return { ...state, pictures: [...tmpPicture, ...state.pictures] };
    }

    // TODO clean code(as string...)

    case 'deletePicture': {
      //   console.clear();
      const index = parseInt(action.key as string);
      console.log('🚀 - index', index);

      const tmpState = state;
      console.log('🚀 - tmpState', tmpState);
      tmpState.pictures.splice(index, 1);
      console.log('🚀 - { ...tmpState }', { ...tmpState });
      return { ...tmpState };
    }

    case 'clearAll':
      return { ...initialState };

    default:
      return { ...state, [action.key as string]: action.value };
  }
}
