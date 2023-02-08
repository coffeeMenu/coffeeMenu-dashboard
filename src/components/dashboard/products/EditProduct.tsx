import { Done } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Typography, useMediaQuery } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useReducer, useState } from 'react';
import { useCategories } from '../../../contexts/CategoriesProvider';
import { useProducts } from '../../../contexts/ProductsProvider';
import { log_editProductStateChange } from '../../../logConfig';
import { handleError } from '../../../modules/errorHandler';
import { apiUrl, pb } from '../../../modules/pocketbase';
import { compactTitle, findCategoryObject } from '../../../modules/utils';
import FullScreenLoading from '../../shared/FullScreenLoading';
import AvailableToggle from './shared/AvailableToggle';
import CategoryPicker from './shared/CategoryPicker';
import { createFormData } from './shared/createFormData';
import DescriptionInput from './shared/DescriptionInput';
import DiscountInput from './shared/DiscountInput';
import NameInput from './shared/NameInput';
import PictureInput from './shared/PictureInput';
import PriceInput from './shared/PriceInput';
import { reducer } from './shared/reducer';
import { validateForm } from './shared/validateForm';
import { getPictureUrl } from 'coffeemenu-shard-logic';

// TODO define product type
const EditProduct = ({ open, setOpen, product }: { open: boolean; setOpen: Function; product: any }) => {
    const initialState = {
        store: product.store,
        name: product.name,
        description: product.description,
        category: product.category,
        pictures: product.pictures,
        price: product.price,
        discount: product.discount,
        available: product.available,
    };

    let initPics = product.pictures.map((pic: string) => {
        return getPictureUrl(apiUrl, product.collectionId, product.id, pic);
    });

    const { categories } = useCategories();
    const initCategory = findCategoryObject(product.category, categories);

    const [state, dispatch] = useReducer(reducer, initialState);
    const [category, setCategory] = useState<any>(initCategory);
    const [pictures, setPictures] = useState<any>(initPics);
    const [sending, setSending] = useState(false);
    const { updateProduct } = useProducts();
    const { enqueueSnackbar } = useSnackbar();
    const [errors, setErrors] = useState<any>(null);

    const updatePicturesFromStatePictures = () => {
        let tmp: any = [];
        for (let pic of state.pictures) {
            if (typeof pic === 'object') {
                tmp.push(URL.createObjectURL(pic));
            } else {
                tmp.push(getPictureUrl(apiUrl, product.collectionId, product.id, pic));
            }
        }

        setPictures(tmp);
    };

    useEffect(() => {
        dispatch({ type: 'setState', state: initialState });
        setCategory(initCategory);
        // TODO set pictures
        setErrors(false);
    }, [product]);

    useEffect(() => {
        log_editProductStateChange && console.log('🚨 state changed: ', state);

        if (pictures?.length !== state.pictures?.length) {
            updatePicturesFromStatePictures();
        }

        if (errors) {
            validateForm(state, setErrors);
        }
    }, [state]);

    useEffect(() => {
        state.pictures && updatePicturesFromStatePictures();
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

        const formData = await createFormData(state, product.collectionId, product.id);

        console.log('sending data to backend: ');
        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        const data = {
            store: product.store,
            name: product.name,
            category: product.category,
            // in order to upload the new pictures we need to delete old pictures
            pictures: null,
        };

        // deleting old pictures
        await pb
            .collection('products')
            .update(product.id, data)
            .then(() => {
                callback();
                setSending(false);
            });

        pb.collection('products')
            .update(product.id, formData)
            .then((res) => {
                console.log(res);
                callback();
                enqueueSnackbar('Product Edited!', { variant: 'success' });
                updateProduct(res);
            })
            .catch((err) => {
                handleError(err, 'EditProduct, updateProduct()', enqueueSnackbar);
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
                    <Typography sx={{ marginTop: 2 }}>Updating Product...</Typography>
                </FullScreenLoading>
                <Dialog
                    onKeyPress={(e: any) => {
                        e.ctrlKey && e.key === 'Enter' && handleSubmitAndClose();
                    }}
                    open={open}
                    onClose={handleClose}>
                    <DialogTitle>{compactTitle(`Editing ${product.name}`)}</DialogTitle>

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

                            <DiscountInput
                                sx={{ width: width }}
                                value={state.discount}
                                onChange={(e: any) => {
                                    dispatch({ key: 'discount', value: e.target.value });
                                }}
                                onKeyPress={(e: any) => e.key === 'Enter' && handleSubmitAndClose()}
                            />

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
                            cancel
                        </Button>
                        <Button type="submit" variant="contained" onClick={handleSubmitAndClose}>
                            <Done />
                            Save Changes
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }

    return <></>;
};

export default EditProduct;
