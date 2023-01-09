import { InputAdornment, TextField } from '@mui/material';
import { ChangeEventHandler, FC } from 'react';

type Props = {
  sx: any;
  value: string;
  onChange:
    | ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  onKeyPress: any;
};

const DiscountInput: FC<Props> = ({ sx, value, onChange, onKeyPress }) => {
  return (
    <TextField
      onKeyPress={onKeyPress}
      sx={sx}
      label="Discount (opt)"
      variant="outlined"
      value={value}
      onChange={onChange}
      InputProps={{
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
      }}
    />
  );
};

export default DiscountInput;
