import { ThemeOptions } from '@mui/material';

export const themeConfigs: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#dbae84',
        },
        secondary: {
            main: '#f3f4f6',
        },
        background: {
            default: '#18181b',
            paper: '#202020',
        },
        text: {
            primary: '#f3f4f6',
        },
    },
    shape: {
        borderRadius: 20,
    },
    direction: 'rtl',
    typography: {
        fontFamily: [' Vazirmatn', 'roboto', 'sans-serif', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"'].join(','),
    },
};
