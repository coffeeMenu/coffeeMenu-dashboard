import { createContext, FC, useContext, useEffect, useState } from 'react';
import { handleError } from '../modules/errorHandler';
import { pb } from '../modules/pocketbase';
import { ReactChildren } from '../types';

const productsContext = createContext<any>(null);

type Props = {
  children: ReactChildren;
};

const ProductsProvider: FC<Props> = ({ children }) => {
  const [products, setProducts] = useState<any>();

  const storeId = localStorage.getItem('store');

  useEffect(() => {
    console.log('products has been changed', products);
  }, [products]);

  const fetchAllProducts = () => {
    // you can also fetch all records at once via getFullList
    pb.collection('products')
      .getFullList(200 /* batch size */, {
        sort: '-created',
        filter: `store="${storeId}"`,
      })
      .then((res) => {
        setProducts(res);
      })
      .catch((err) => {
        handleError(err, 'ProductProvider, fetchAllProducts');
      });
  };
  const addProduct = (product: any) => {
    // add product if success add to state
  };
  const updateProduct = (productId: number, product: any) => {
    // update product if success update state
  };
  const deleteProduct = (productId: number) => {
    // delete product if success update state
  };

  return (
    <productsContext.Provider
      value={{
        products,
        fetchAllProducts,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </productsContext.Provider>
  );
};

export const useProducts = () => {
  return useContext(productsContext);
};

export default ProductsProvider;
