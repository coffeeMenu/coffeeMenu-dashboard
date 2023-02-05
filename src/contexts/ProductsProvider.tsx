import { createContext, FC, useContext, useEffect, useState } from 'react';
import { log_productProviderProductChange } from '../logConfig';
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
        log_productProviderProductChange && console.log('products has been changed', products);
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
    const updateProduct = (product: any) => {
        const tmp = [...products];
        const indexToUpdate = tmp.findIndex((p) => p.id === product.id);
        tmp[indexToUpdate] = product;
        setProducts(tmp);
    };
    const deleteProduct = (productId: string) => {
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
            }}>
            {children}
        </productsContext.Provider>
    );
};

export const useProducts = () => {
  return useContext(productsContext);
};

export default ProductsProvider;
