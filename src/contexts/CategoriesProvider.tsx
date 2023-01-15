import { createContext, FC, useContext, useEffect, useState } from 'react';
import { handleError } from '../modules/errorHandler';
import { pb } from '../modules/pocketbase';
import { ReactChildren } from '../types';

const categoriesContext = createContext<any>(null);

type Props = {
  children: ReactChildren;
};

// TODO sort by name
// const sort = (products: any) => {
//   console.log('products', products);
//   products = products.sort((a: any, b: any) => b.available - a.available);
//   return products;
// };

const getCategories = (setCategories: any) => {
  pb.collection('products_category')
    .getFullList(200 /* batch size */, {
      sort: '-name',
    })
    .then((res) => {
      const options = res.map((item) => {
        return {
          label: item.name,
          id: item.id,
        };
      });
      setCategories(options);
    })
    .catch((err) => {
      handleError(err, 'CategoriesProvider - getCategories');
    });
};

const CategoriesProvider: FC<Props> = ({ children }) => {
  const [categories, setCategories] = useState<any>();

  useEffect(() => {
    console.log('categories has been changed', categories);
  }, [categories]);

  useEffect(() => {
    getCategories(setCategories);
  }, []);

  return (
    <categoriesContext.Provider
      value={{
        categories,
      }}
    >
      {children}
    </categoriesContext.Provider>
  );
};

export const useCategories = () => {
  return useContext(categoriesContext);
};

export default CategoriesProvider;
