import { Favorite, Send } from '@mui/icons-material';
import { Button, Grid, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../../modules/errorHandler';
import { pb } from '../../modules/pocketbase';

const BugReport = () => {
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const data = {
            title: title,
            user: pb.authStore.model?.id,
            store: localStorage.getItem('store'),
            description: description,
            userAgent: navigator.userAgent,
        };

        pb.collection('bug_reports')
            .create(data)
            .then((res: any) => {
                console.log(res);
                enqueueSnackbar('report has been sent to the developer.', {
                    variant: 'success',
                });
                navigate('/');
            })
            .catch((err) => {
                handleError(err, 'bug_reports', enqueueSnackbar);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <br />
            <Typography sx={{ paddingX: 4, fontSize: '.9em', opacity: 0.8 }}>
                please try to explain your problem as much detailed as possible and thank you for your contribution to making CoffeeMenu better <Favorite />
            </Typography>
            <br />
            <Grid container spacing={2} textAlign={'center'} justifyContent="center">
                <Grid item xs={12}>
                    <TextField required label="Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                    <TextField required label="Description" fullWidth multiline minRows={5} maxRows={6} value={description} onChange={(e) => setDescription(e.target.value)} />
                </Grid>
                <Button sx={{ marginTop: 2 }} type="submit" variant="contained" onClick={handleSubmit}>
                    Send Report <Send sx={{ marginLeft: 1 }} />
                </Button>
            </Grid>
            <br />
            <Typography sx={{ paddingX: 10, fontSize: '.9em', opacity: 0.5 }}>
                also be aware that by submitting this form we will save your{' '}
                <a href="https://en.wikipedia.org/wiki/User_agent" target={'_blank'}>
                    User-Agent
                </a>{' '}
                and your coffeeMenu user id in background.
            </Typography>
        </form>
    );
};

export default BugReport;
