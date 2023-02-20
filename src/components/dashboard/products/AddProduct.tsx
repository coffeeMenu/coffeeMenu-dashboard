import { Add } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Typography, useMediaQuery } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useReducer, useState } from 'react';
import { useCategories } from '../../../contexts/CategoriesProvider';
import { useProducts } from '../../../contexts/ProductsProvider';
import { log_addProductStateChange } from '../../../logConfig';
import { handleError } from '../../../modules/errorHandler';
import { pb } from '../../../modules/pocketbase';
import { findCategoryObject } from '../../../modules/utils';
import FullScreenLoading from '../../shared/FullScreenLoading';
import AvailableToggle from './shared/AvailableToggle';
import CategoryPicker from './shared/CategoryPicker';
import { createFormData } from './shared/createFormData';
import { createUrlFromObject } from '../../../modules/imageParser';
import DescriptionInput from './shared/DescriptionInput';
// import DiscountInput from './shared/DiscountInput';
import NameInput from './shared/NameInput';
import PictureInput from './shared/PictureInput';
import PriceInput from './shared/PriceInput';
import { initialState, reducer } from './shared/reducer';
import { validateForm } from './shared/validateForm';

const AddProduct = ({ open, setOpen }: { open: boolean; setOpen: Function }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [category, setCategory] = useState<any>(null);
    const [pictures, setPictures] = useState<any>();
    const [sending, setSending] = useState(false);
    const { addProduct } = useProducts();
    const { enqueueSnackbar } = useSnackbar();
    const [errors, setErrors] = useState<any>(null);
    const { categories } = useCategories();

    useEffect(() => {
        log_addProductStateChange && console.log('🚨 state changed: ', state);

        if (pictures?.length !== state.pictures?.length) {
            createUrlFromObject(state.pictures, setPictures);
        }

        if (errors) {
            validateForm(state, setErrors);
        }
    }, [state]);

    useEffect(() => {
        createUrlFromObject(state.pictures, setPictures);
    }, [state.pictures]);

    const clearForm = () => {
        dispatch({ type: 'clearAll' });
        setCategory(null);
        setPictures(undefined);
        setErrors(null);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCancel = () => {
        clearForm();
        handleClose();
    };

    const handleSubmitAndClear = () => {
        submitProduct(() => {
            clearForm();
        });
    };
    const handleSubmitAndClose = () => {
        submitProduct(() => {
            clearForm();
            handleClose();
        });
    };

    const submitProduct = async (callback: Function) => {
        const tmpErrors = validateForm(state, setErrors);
        if (tmpErrors.length === undefined) {
            console.log('will not sending the data to backend');
            return;
        }

        const formData = await createFormData(state);
        console.log(state.pictures);
        console.log('sending data to backend: ');
        for (var pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        pb.collection('products')
            .create(formData)
            .then((res) => {
                callback();
                enqueueSnackbar('محصول اضافه شد!', { variant: 'success' });
                addProduct(res);
            })
            .catch((err) => {
                handleError(err, 'AddProduct, postProduct()', enqueueSnackbar);
            })
            .finally(() => {
                setSending(false);
            });
    };

    const smallScreenView = useMediaQuery('(min-width:700px)');
    const width = smallScreenView ? 400 : 250;

    if (open) {
        return (
            <>
                <FullScreenLoading open={sending}>
                    <Typography sx={{ marginTop: 2 }}>درحال اضافه کردن محصول...</Typography>
                </FullScreenLoading>
                <Dialog
                    onKeyPress={(e: any) => {
                        e.ctrlKey && e.key === 'Enter' && handleSubmitAndClear();
                    }}
                    open={open}
                    onClose={handleClose}>
                    <DialogTitle>اضافه کردن محصول</DialogTitle>

                    <Divider />

                    <DialogContent>
                        <Grid container direction={'column'} gap={2}>
                            <CategoryPicker
                                sx={{ width: width }}
                                value={category}
                                errors={errors}
                                onChange={(event: any, newValue: any | null) => {
                                    setCategory(newValue);
                                    const tmpCat = newValue?.id === undefined ? null : newValue?.id;
                                    dispatch({ key: 'category', value: tmpCat });
                                    const tmpCategory = findCategoryObject(tmpCat, categories);
                                    setCategory(tmpCategory);
                                }}
                            />

                            <PictureInput
                                pictures={pictures}
                                onChange={(e: any) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        dispatch({
                                            type: 'addPicture',
                                            key: 'pictures',
                                            value: e.target.files,
                                        });
                                    }
                                }}
                                errors={errors}
                                onSetAsMainPicture={(index: string) => {
                                    dispatch({
                                        type: 'setAsMainPicture',
                                        key: index,
                                    });
                                }}
                                onDeletePicture={(index: string) => {
                                    dispatch({
                                        type: 'deletePicture',
                                        key: index,
                                    });
                                }}
                            />

                            <NameInput
                                sx={{ width: width }}
                                value={state.name}
                                errors={errors}
                                onChange={(e: any) => {
                                    dispatch({ key: 'name', value: e.target.value });
                                }}
                            />

                            <DescriptionInput
                                sx={{ width: width }}
                                value={state.description}
                                onChange={(e: any) => {
                                    dispatch({ key: 'description', value: e.target.value });
                                }}
                            />

                            <PriceInput
                                sx={{ width: width }}
                                value={state.price}
                                onChange={(e: any) => {
                                    dispatch({ key: 'price', value: e.target.value });
                                }}
                            />
                            {/* 
                            <DiscountInput
                                sx={{ width: width }}
                                value={state.discount}
                                onChange={(e: any) => {
                                    dispatch({ key: 'discount', value: e.target.value });
                                }}
                                onKeyPress={(e: any) => e.key === 'Enter' && handleSubmitAndClear()}
                            /> */}

                            <AvailableToggle
                                value={state.available}
                                onChange={() => {
                                    dispatch({ key: 'available', value: !state.available });
                                }}
                            />
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'right' }}>
                        <Button color="secondary" onClick={handleCancel}>
                            انصراف
                        </Button>
                        <Button onClick={handleSubmitAndClear}>اضافه کن و بمون</Button>
                        <Button type="submit" variant="contained" onClick={handleSubmitAndClose}>
                            <Add />
                            اضافه
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }

    return <></>;
};

export default AddProduct;
