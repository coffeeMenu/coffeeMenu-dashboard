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
                enqueueSnackbar('گزارش برای توسعه دهنده ارسال شد.', {
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
                لطفا تا جایی که میتونی سعی کن به دقیق ترین شکل مشکلی که هنگام کار با coffeeMenu بهش برخوردی رو توضیح بدی. ازت ممنونیم که به بهتر شدنمون کمک میکنی <Favorite />
            </Typography>
            <br />
            <Grid container spacing={2} textAlign={'center'} justifyContent="center">
                <Grid item xs={12}>
                    <TextField required label="عنوان" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                    <TextField required label="توضیحات" fullWidth multiline minRows={5} maxRows={6} value={description} onChange={(e) => setDescription(e.target.value)} />
                </Grid>
                <Button sx={{ marginTop: 2 }} type="submit" variant="contained" onClick={handleSubmit}>
                    <Send sx={{ marginLeft: 1 }} /> ارسال مشکل
                </Button>
            </Grid>
            <br />
            <Typography sx={{ paddingX: 10, fontSize: '.9em', opacity: 0.5 }}>
                لطفا این رو هم بدون که با پرکردن این فرم ما برای حل مشکل{' '}
                <a href="https://fa.wikipedia.org/wiki/%D8%B9%D8%A7%D9%85%D9%84_%DA%A9%D8%A7%D8%B1%D8%A8%D8%B1" target={'_blank'}>
                    User-Agentات
                </a>{' '}
                رو ذخیره میکنیم.
            </Typography>
        </form>
    );
};

export default BugReport;
