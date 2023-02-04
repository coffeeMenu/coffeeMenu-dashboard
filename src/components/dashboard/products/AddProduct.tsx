import { Add } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useEffect, useReducer, useState } from 'react';
import { useProducts } from '../../../contexts/ProductsProvider';
import { compressImage } from '../../../modules/compressImage';
import { handleError } from '../../../modules/errorHandler';
import { pb } from '../../../modules/pocketbase';
import ProductDrawer from './productDrawer/ProductDrawer';
import { initialState, reducer } from './productDrawer/reducer';
type Props = {
  open: boolean;
  setOpen: Function;
};
const AddProduct: React.FC<Props> = ({ open = false, setOpen }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [category, setCategory] = useState<any>(null);
  const [pictures, setPictures] = useState<any>();
  const [sending, setSending] = useState(false);
  const { addProduct } = useProducts();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const storeId = localStorage.getItem('store');
    dispatch({ key: 'store', value: storeId });
  }, []);

  return (
    <ProductDrawer
      open={open}
      state={state}
      dispatch={dispatch}
      category={category}
      setCategory={setCategory}
      pictures={pictures}
      setPictures={setPictures}
      setOpen={setOpen}
      sending={sending}
      setSending={setSending}
      texts={{
        title: 'Add Product',
        sending: 'Adding Product To The Store...',
      }}
      onSubmit={async (state: any, callback: Function) => {
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
        formData.append(
          'available',
          state.available === true ? 'true' : 'false'
        );

        pb.collection('products')
          .create(formData)
          .then((res) => {
            callback && callback();
            enqueueSnackbar('Product Added!', { variant: 'success' });
            addProduct(res);
          })
          .catch((err) => {
            handleError(err, 'AddProduct, postProduct()', enqueueSnackbar);
          })
          .finally(() => {
            setSending(false);
          });
      }}
      primaryButton={
        <>
          <Add />
          Add
        </>
      }
    />
  );
};

export default AddProduct;
