import { Done, Edit } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useEffect, useReducer, useState } from 'react';
import { useCategories } from '../../../contexts/CategoriesProvider';
import { useProducts } from '../../../contexts/ProductsProvider';
import { compressImage } from '../../../modules/compressImage';
import { handleError } from '../../../modules/errorHandler';
import { apiUrl, pb } from '../../../modules/pocketbase';
import {
  compactTitle,
  findCategoryObject,
  urlToObject,
} from '../../../modules/utils';
import ProductDrawer from './productDrawer/ProductDrawer';
import { ProductState, reducer } from './productDrawer/reducer';

type Props = {
  open: boolean;
  setOpen: Function;
  product: ProductState & { collectionId: string; id: string };
};

const EditProduct: React.FC<Props> = ({ open = false, setOpen, product }) => {
  if (product === undefined) return <></>;
  // const parsedPictures =
  //   product.pictures && product.pictures.length > 0
  //     ? product.pictures.map((p: string) => {
  //         return `${apiUrl}/api/files/${product.collectionId}/${product.id}/${p}`;
  //       })
  //     : undefined;

  const parsedPictures = product.pictures;

  console.log(product);

  // const getPictures = () => {
  //   const tmpPictures =
  //     product.pictures && product.pictures.length > 0
  //       ? product.pictures.map((p: string) => {
  //           return urlToObject(
  //             `${apiUrl}/api/files/${product.collectionId}/${product.id}/${p}`,
  //             p
  //           );
  //         })
  //       : undefined;
  //   return tmpPictures;
  // };

  const { categories } = useCategories();
  const initCategory = findCategoryObject(product.category, categories);

  const title = compactTitle(`Editing ${product.name}`);

  const initialState = {
    store: product.store,
    name: product.name,
    description: product.description,
    category: product.category,
    pictures: parsedPictures,
    price: product.price,
    discount: product.discount,
    available: product.available,
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const [category, setCategory] = useState<any>(initCategory);
  const [pictures, setPictures] = useState<any>();
  const [sending, setSending] = useState(false);
  const { updateProduct } = useProducts();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <ProductDrawer
      state={state}
      dispatch={dispatch}
      category={category}
      setCategory={setCategory}
      pictures={pictures}
      setPictures={setPictures}
      open={open}
      setOpen={setOpen}
      sending={sending}
      setSending={setSending}
      editMode={true}
      texts={{
        title: title,
        sending: 'Updating Product...',
      }}
      onSubmit={async (state: any, callback: Function) => {
        const formData = new FormData();
        for (let pair of formData.entries()) {
          formData.delete(pair[0]);
        }
        formData.append('store', state.store as string);
        formData.append('name', state.name);
        formData.append('category', state.category);
        formData.append('description', state.description);
        // // compressing pictures
        // if (state.pictures) {
        //   for (let picture of state.pictures) {
        //     const compressedPicture = await compressImage(picture);
        //     formData.append('pictures', compressedPicture as Blob);
        //   }
        // }
        formData.append('price', state.price);
        formData.append('discount', state.discount);
        formData.append(
          'available',
          state.available === true ? 'true' : 'false'
        );

        pb.collection('products')
          .update(product.id, formData)
          .then((res) => {
            console.log(res);
            callback && callback();
            enqueueSnackbar('Product Edited!', { variant: 'success' });
            updateProduct(res);
          })
          .catch((err) => {
            handleError(err, 'EditProduct, updateProduct()', enqueueSnackbar);
          })
          .finally(() => {
            setSending(false);
          });
      }}
      primaryButton={
        <>
          <Done />
          Apply Changes
        </>
      }
    />
  );
};

export default EditProduct;
