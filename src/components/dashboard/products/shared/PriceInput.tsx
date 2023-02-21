import { InputAdornment, TextField } from '@mui/material';
import { ChangeEventHandler, FC } from 'react';


// TODO convert to en number
type Props = {
  sx: any;
  value: string;
  onChange:
    | ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
};

const PriceInput: FC<Props> = ({ sx, value, onChange }) => {
  return (
      <TextField
          sx={sx}
          label="قیمت"
          variant="outlined"
          value={value}
          onChange={onChange}
          dir={'rtl'}
          InputProps={{
              endAdornment: <InputAdornment position="end">هزار تومان</InputAdornment>,
          }}
      />
  );
};

export default PriceInput;
