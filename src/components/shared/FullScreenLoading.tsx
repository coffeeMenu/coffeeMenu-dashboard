import { Backdrop, CircularProgress } from '@mui/material';
import { FC } from 'react';

type Props = {
  open: boolean;
  children?: JSX.Element[] | JSX.Element | string;
};
const FullScreenLoading: FC<Props> = ({ open = false, children }) => {
  return (
    <Backdrop
      sx={{
        display: 'flex',
        flexDirection: 'column',
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 10000,
      }}
      open={open}
    >
      <CircularProgress color="inherit" />
      {children && children}
    </Backdrop>
  );
};

export default FullScreenLoading;
