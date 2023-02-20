import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { SettingsTwoTone, ShoppingBagTwoTone } from '@mui/icons-material';
import { Grid } from '@mui/material';
import TheLink from '../../components/shared/TheLink';
import { r } from '../../modules/routes';
import Logo from '../../components/shared/Logo';

const DashboardIndex = () => {
  return (
      // TODO: some hover effects
      <>
          <Box
              sx={{
                  display: {
                      xs: 'block',
                      sm: 'block',
                      md: 'none',
                  },
              }}>
              <Typography variant="h3">
                  <Logo />
              </Typography>
          </Box>
          <Grid
              container
              spacing={2}
              sx={{
                  display: {
                      xs: 'flex',
                      md: 'block',
                  },
                  justifyContent: {
                      xs: 'center',
                  },
                  padding: {
                      xs: '20px',
                      md: '10px',
                  },
              }}>
              <Grid item sx={{ fontSize: '1.5em' }} textAlign="center">
                  {/* if the screen is small show a neon coffee menu logo */}

                  <TheLink to={r.products} underline="none">
                      <Card
                          sx={{
                              background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);',
                              backgroundSize: '270% 370%;',
                          }}>
                          <CardContent>
                              <ShoppingBagTwoTone sx={{ fontSize: '1.5em' }} />
                              <br />
                              محصولات
                          </CardContent>
                      </Card>
                  </TheLink>
              </Grid>
              <Grid item sx={{ fontSize: '1.5em' }} textAlign="center">
                  <TheLink to={r.settings} underline="none">
                      <Card
                          sx={{
                              background: 'linear-gradient(-160deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);',
                              backgroundSize: '270% 370%;',
                          }}>
                          <CardContent sx={{ paddingX: 3 }}>
                              <SettingsTwoTone sx={{ fontSize: '1.5em' }} />
                              <br />
                              تنظیمات
                          </CardContent>
                      </Card>
                  </TheLink>
              </Grid>
          </Grid>
      </>
  );
};

export default DashboardIndex;
