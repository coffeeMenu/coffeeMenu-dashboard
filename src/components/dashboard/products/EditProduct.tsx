import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useCategories } from '../../../contexts/CategoriesProvider';
import { useProducts } from '../../../contexts/ProductsProvider';
import { compressImage } from '../../../modules/compressImage';
import { handleError } from '../../../modules/errorHandler';
import { apiUrl, pb } from '../../../modules/pocketbase';
import { compactTitle } from '../../../modules/utils';
import ProductDrawer from './productDrawer/ProductDrawer';
import { ProductState } from './productDrawer/reducer';

type Props = {
  open: boolean;
  setOpen: Function;
  product: ProductState & { collectionId: string; id: string };
};

const EditProduct: React.FC<Props> = ({ open = false, setOpen, product }) => {
  if (product === undefined) return <></>;
  const [sending, setSending] = useState(false);
  const { updateProduct } = useProducts();
  const { enqueueSnackbar } = useSnackbar();

  const pictures =
    product.pictures && product.pictures.length > 0
      ? product.pictures.map((p: string) => {
          return `${apiUrl}/api/files/${product.collectionId}/${product.id}/${p}`;
        })
      : undefined;

  const title = compactTitle(`Editing ${product.name}`);

  return (
    <ProductDrawer
      open={open}
      setOpen={setOpen}
      sending={sending}
      setSending={setSending}
      initialState={{
        store: product.store,
        name: product.name,
        description: product.description,
        category: product.category,
        pictures: pictures,
        price: product.price,
        discount: product.discount,
        available: product.available,
      }}
      editMode={true}
      texts={{
        title: title,
        sending: 'Updating Product...',
      }}
      // initialPictures={}
      onSubmit={async (state: any, callback: Function) => {
        // TODO: if edit mode append hidden data like product id and etc...
        const formData = new FormData();
        for (let pair of formData.entries()) {
          formData.delete(pair[0]);
        }
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
        console.log('editing product:', product);
        for (let pair of formData.entries()) {
          console.log(pair[0] + ', ' + pair[1]);
        }

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
    />
  );
};

export default EditProduct;
