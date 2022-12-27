import { useEffect, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Logo from '../shared/Logo';
import { Box, Typography } from '@mui/material';
import './IntroAnimation.css';

const IntroAnimation = () => {
  const [show, setShow] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 2900);
  });

  if (show)
    return (
      <>
        <Backdrop
          sx={{
            bgcolor: 'background.default',
            position: 'fixed',
            zIndex: '1500',
          }}
          className="intro-animation"
          open={show}
          timeout={0}
        >
          <Box textAlign={'center'}>
            <Typography variant="h3">
              <Logo />
            </Typography>
            <Typography marginTop={2}>
              make your menu "awesome online!"
            </Typography>
          </Box>
        </Backdrop>
      </>
    );

  return <></>;
};

export default IntroAnimation;
