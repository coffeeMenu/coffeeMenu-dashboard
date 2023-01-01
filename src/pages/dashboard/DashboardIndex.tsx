import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { SettingsTwoTone, ShoppingBagTwoTone } from '@mui/icons-material';
import { Grid } from '@mui/material';
import TheLink from '../../components/shared/TheLink';
import { r } from '../../modules/routes';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);
const DashboardIndex = () => {
  // {
  //   text: 'Products',
  //   icon: <ShoppingBagTwoTone />,
  //   link: r.products,
  // },
  // {
  //   text: 'Settings',
  //   icon: <SettingsTwoTone />,
  //   link: r.settings,
  // },

  return (
    // TODO: some hover effects
    <Grid container spacing={2}>
      <Grid item sx={{ fontSize: '1.5em' }} textAlign="center">
        <TheLink to={r.products} underline="none">
          <Card
            sx={{
              background:
                'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);',
              backgroundSize: '270% 370%;',
            }}
          >
            <CardContent>
              <ShoppingBagTwoTone sx={{ fontSize: '1.5em' }} />
              <br />
              Products
            </CardContent>
          </Card>
        </TheLink>
      </Grid>
      <Grid item sx={{ fontSize: '1.5em' }} textAlign="center">
        <TheLink to={r.settings} underline="none">
          <Card
            sx={{
              background:
                'linear-gradient(-160deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);',
              backgroundSize: '270% 370%;',
            }}
          >
            <CardContent sx={{ paddingX: 3 }}>
              <SettingsTwoTone sx={{ fontSize: '1.5em' }} />
              <br />
              Settings
            </CardContent>
          </Card>
        </TheLink>
      </Grid>
    </Grid>
  );
};

export default DashboardIndex;
