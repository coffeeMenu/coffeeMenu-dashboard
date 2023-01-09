import { Box, TextField } from '@mui/material';
import { FC } from 'react';

type Props = {
  sx: any;
  value: string;
  onChange: any;
  errors: any;
};

const NameInput: FC<Props> = ({ sx, value, onChange, errors }) => {
  return (
    <>
      <TextField
        error={errors && errors.name ? true : false}
        sx={sx}
        label="Name*"
        variant="outlined"
        value={value}
        onChange={onChange}
      />
      {errors ? <Box sx={{ color: '#ff4949' }}>{errors.name}</Box> : <></>}
    </>
  );
};

export default NameInput;
