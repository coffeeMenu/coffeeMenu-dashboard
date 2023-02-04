import { Grid, Switch } from '@mui/material';
import React, { FC } from 'react';

type Props = {
    value: boolean;
    onChange: any;
};

const AvailableToggle: FC<Props> = ({ value, onChange }) => {
    return (
        <Grid>
            Available:
            <Switch checked={value} onChange={onChange} value={value} />
        </Grid>
    );
};

export default AvailableToggle;
