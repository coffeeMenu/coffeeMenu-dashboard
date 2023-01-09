import { handleError } from '../../../modules/errorHandler';
import { pb } from '../../../modules/pocketbase';

export const getCategories = (setCategories: any) => {
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
      handleError(err, 'AddProduct- getCategories');
    });
};
