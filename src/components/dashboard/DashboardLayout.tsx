import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import {
  AccountCircleTwoTone,
  LogoutTwoTone,
  SettingsTwoTone,
  ShoppingBagTwoTone,
} from '@mui/icons-material';
import { Grid, Menu, MenuItem, Typography } from '@mui/material';
import { pb } from '../../modules/pocketbase';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../shared/Logo';
import TheLink from '../shared/TheLink';
import { r } from '../../modules/routes';

// TODO!: responsive + bottom app bar(menu, home, user)
// https://mui.com/material-ui/react-app-bar/#bottom-app-bar

const drawerWidth = 240;

const DashboardLayout: React.FC<any> = ({ children, window }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const logout = () => {
    pb.authStore.clear();
    localStorage.clear();
    navigate(0);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* TODO nav,profile, hide on mobile */}
      <AppBar
        position="fixed"
        sx={{
          backgroundImage: 'none',
          boxShadow: 'none',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <Grid container justifyContent={'space-between'}>
            <Grid item alignSelf={'center'}>
              <Typography variant="h6">
                {/* TODO: dynamic title */}
                Dashboard
              </Typography>
            </Grid>
            <Grid item>
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircleTwoTone />
                  <Typography sx={{ marginLeft: 0.5 }}>
                    {pb.authStore?.model?.username}
                  </Typography>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  onClick={handleClose}
                >
                  {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
                  {/* TODO: add functionality */}
                  <MenuItem onClick={logout}>
                    <LogoutTwoTone sx={{ marginRight: 2 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            </Grid>
          </Grid>
        </Toolbar>
        <Divider />
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          <div>
            <TheLink to={'/'}>
              <Typography
                sx={{ margin: 'auto', paddingY: 1.4, color: '#dbae84' }}
                variant="h4"
              >
                <Logo />
              </Typography>
            </TheLink>
            <Divider />
            <List>
              {/* TODO: sub menu categories */}
              {[
                {
                  text: 'Products',
                  icon: <ShoppingBagTwoTone />,
                  link: r.products,
                },
                {
                  text: 'Settings',
                  icon: <SettingsTwoTone />,
                  link: r.settings,
                },
              ].map((item) => {
                return (
                  <TheLink
                    key={item.text}
                    underline="none"
                    color="inherit"
                    to={item.link}
                  >
                    <ListItem>
                      <ListItemButton>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                      </ListItemButton>
                    </ListItem>
                  </TheLink>
                );
              })}
            </List>
          </div>
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
