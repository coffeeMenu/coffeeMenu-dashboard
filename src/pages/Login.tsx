import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TheLink from '../components/shared/TheLink';
import { r } from '../modules/routes';
import { pb } from '../modules/pocketbase';
import { handleError } from '../modules/errorHandler';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/shared/Logo';

export default function Login() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const identifier = document.getElementById(
      'identifier'
    ) as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    pb.collection('users')
      .authWithPassword(identifier.value, password.value)
      .then((res) => {
        console.log(res);
        navigate('/');
      })
      .catch((err) =>
        handleError(err, 'login - handleSubmit', enqueueSnackbar)
      );
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h3">
          <Logo />
        </Typography>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="identifier"
            label="Email or Username"
            name="identifier"
            autoComplete="identifier"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Grid container>
            {/* TODO */}
            {/* <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid> */}
            <Grid item>
              <TheLink to={r.register}>
                {"Don't have an account? Register"}
              </TheLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
