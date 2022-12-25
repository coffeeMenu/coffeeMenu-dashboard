import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { r } from '../modules/routes';
import TheLink from '../components/shared/TheLink';
import { pb } from '../modules/pocketbase';
import { handleError } from '../modules/errorHandler';
import { useSnackbar } from 'notistack';
import FullScreenLoading from '../components/shared/FullScreenLoading';
import { useNavigate } from 'react-router-dom';

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
          enqueueSnackbar('please login to continue', {
            variant: 'info',
          });
          enqueueSnackbar('account created successfully', {
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
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* TODO: change with coffeeMenu logo */}
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="passwordConfirm"
                  label="Confirm Password"
                  type="password"
                  id="passwordConfirm"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Grid container justifyContent="flex-center">
              <Grid item>
                <TheLink to={r.login}>Already have an account? Login</TheLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}
