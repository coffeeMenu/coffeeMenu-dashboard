import { useEffect, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Logo from '../shared/Logo';
import { Box, Typography } from '@mui/material';
import './IntroAnimation.css';

const IntroAnimation = () => {
  const [show, setShow] = useState(false);
  // show Intro Animation by at least 1 hour break

  if (show === true) {
    setTimeout(() => {
      setShow(false);
    }, 2900);
  }

  const oneHour = 3600000;
  const lastTimeShow = localStorage.getItem('last-intro-animation-show');
  if (lastTimeShow === null || Date.now() > parseInt(lastTimeShow) + oneHour) {
    localStorage.setItem('last-intro-animation-show', Date.now().toString());
    setShow(true);
  }

  if (show) {
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
  }

  return <></>;
};

export default IntroAnimation;
