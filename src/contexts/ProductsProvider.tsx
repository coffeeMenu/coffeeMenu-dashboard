import { createContext, FC, useContext, useEffect, useState } from 'react';
import { handleError } from '../modules/errorHandler';
import { pb } from '../modules/pocketbase';
import { ReactChildren } from '../types';

const productsContext = createContext<any>(null);

type Props = {
  children: ReactChildren;
};

const sort = (products: any) => {
  products = products.sort((a: any, b: any) => b.available - a.available);
  return products;
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
        setProducts(sort(res));
      })
      .catch((err) => {
        handleError(err, 'ProductProvider, fetchAllProducts');
      });
  };
  const addProduct = (product: any) => {
    let tmpArray = [...products];
    tmpArray.unshift(product);
    setProducts(sort(tmpArray));
  };
  const updateProduct = (productId: string, product: any) => {
    // update product if success update state
  };
  const deleteProduct = (productId: string) => {
    console.log('here is the id');
    console.log(productId);
    const tmpArray = products.filter((p: any) => p.id !== productId);
    setProducts(sort(tmpArray));
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
