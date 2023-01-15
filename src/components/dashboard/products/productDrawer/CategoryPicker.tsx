import { Autocomplete, TextField, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { handleError } from '../../../../modules/errorHandler';
import { pb } from '../../../../modules/pocketbase';

type Props = {
  sx: any;
  value: string;
  onChange: any;
  errors: any;
};

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
      handleError(err, 'AddProduct- getCategories');
    });
};

const CategoryPicker: FC<Props> = ({ sx, value, onChange, errors }) => {
  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    // TODO use autocomplete feature instead
    getCategories(setCategories);
  }, []);

  return (
    <>
      {/* TODO: https://mui.com/material-ui/react-autocomplete/ */}
      {/* TODO: add icons next to category text */}
      {/* TODO user should be able to add a category if cat is not there */}
      <Autocomplete
        sx={sx}
        disablePortal
        options={categories}
        value={value}
        onChange={onChange}
        renderInput={(params) => (
          <TextField
            error={errors && errors.category ? true : false}
            {...params}
            label="Category*"
          />
        )}
      />
      {errors ? (
        <Typography sx={{ color: '#ff4949' }}>{errors.category}</Typography>
      ) : (
        <></>
      )}
    </>
  );
};

export default CategoryPicker;
