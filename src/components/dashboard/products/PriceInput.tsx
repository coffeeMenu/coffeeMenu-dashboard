import { InputAdornment, TextField } from '@mui/material';
import { ChangeEventHandler, FC } from 'react';

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
      label="Price (opt)"
      variant="outlined"
      value={value}
      onChange={onChange}
      InputProps={{
        // TODO $/euro/﷼/تومن
        endAdornment: <InputAdornment position="end">$</InputAdornment>,
      }}
    />
  );
};

export default PriceInput;
