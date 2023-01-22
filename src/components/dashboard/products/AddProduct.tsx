import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useProducts } from '../../../contexts/ProductsProvider';
import { compressImage } from '../../../modules/compressImage';
import { handleError } from '../../../modules/errorHandler';
import { pb } from '../../../modules/pocketbase';
import ProductDrawer from './productDrawer/ProductDrawer';
import { initialState } from './productDrawer/reducer';
type Props = {
  open: boolean;
  setOpen: Function;
};
const AddProduct: React.FC<Props> = ({ open = false, setOpen }) => {
  const [sending, setSending] = useState(false);
  const { addProduct } = useProducts();
  const { enqueueSnackbar } = useSnackbar();
  return (
    <ProductDrawer
      open={open}
      setOpen={setOpen}
      sending={sending}
      setSending={setSending}
      initialState={initialState}
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
    />
  );
};

export default AddProduct;
