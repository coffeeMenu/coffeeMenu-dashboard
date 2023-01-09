import { Autocomplete, TextField, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { getCategories } from './getCategories';

type Props = {
  sx: any;
  value: string;
  onChange: any;
  errors: any;
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
