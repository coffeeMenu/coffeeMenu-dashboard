import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { r } from '../modules/routes';
import TheLink from '../components/shared/TheLink';
import { pb } from '../modules/pocketbase';
import { handleError } from '../modules/errorHandler';
import { useSnackbar } from 'notistack';
import FullScreenLoading from '../components/shared/FullScreenLoading';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/shared/Logo';

export default function Register() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [showLoading, setShowLoading] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setShowLoading(true);

      const data = new FormData(event.currentTarget);
      pb.collection('users')
          .create(data)
          .then((res) => {
              console.log(res);
              setTimeout(() => {
                  setShowLoading(false);
                  enqueueSnackbar('لطفا برای ادامه ورود کنید', {
                      variant: 'info',
                  });
                  enqueueSnackbar('حساب با موفقیت ایجاد شد', {
                      variant: 'success',
                  });

                  setTimeout(() => {
                      navigate(r.login);
                  }, 4000);
              }, 4000);
          })
          .catch((err) => {
              setShowLoading(false);
              handleError(err, 'register - handleSubmit', enqueueSnackbar);
          });
  };

  return (
      <>
          <FullScreenLoading open={showLoading} />
          <Container component="main" maxWidth="xs">
              <Box
                  sx={{
                      marginTop: 8,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                  }}>
                  <Typography variant="h3">
                      <Logo />
                  </Typography>
                  <Typography component="h1" variant="h5">
                      ثبت نام
                  </Typography>
                  <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                      <Grid container spacing={2}>
                          <Grid item xs={12}>
                              <TextField fullWidth id="username" label="نام کاربری" name="username" autoComplete="username" />
                          </Grid>
                          <Grid item xs={12}>
                              <TextField required fullWidth id="email" label="ایمیل" name="email" autoComplete="email" />
                          </Grid>
                          <Grid item xs={12}>
                              <TextField required fullWidth name="password" label="رمز عبور" type="password" id="password" />
                          </Grid>
                          <Grid item xs={12}>
                              <TextField required fullWidth name="passwordConfirm" label="تکرار رمز عبور" type="password" id="passwordConfirm" />
                          </Grid>
                      </Grid>
                      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                          ثبت نام
                      </Button>
                      <Grid container justifyContent="flex-center">
                          <Grid item>
                              <TheLink to={r.login}>حساب داری؟ ورود کن</TheLink>
                          </Grid>
                      </Grid>
                  </Box>
              </Box>
          </Container>
      </>
  );
}
