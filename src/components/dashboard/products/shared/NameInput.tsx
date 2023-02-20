import { Box, TextField, useMediaQuery } from '@mui/material';
import { FC } from 'react';

type Props = {
    sx: any;
    value: string;
    onChange: any;
    errors: any;
};

const NameInput: FC<Props> = ({ sx, value, onChange, errors }) => {
    const smallScreenView = useMediaQuery('(min-width:700px)');
    return (
        <>
            <TextField autoFocus error={errors && errors.name ? true : false} sx={sx} label="نام" required variant="outlined" value={value} onChange={onChange} />
            {errors ? <Box sx={{ color: '#ff4949', width: smallScreenView ? '330px' : '240px' }}>{errors.name}</Box> : <></>}
        </>
    );
};

export default NameInput;
