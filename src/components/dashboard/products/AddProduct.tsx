import { Add } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect, useReducer, useState } from 'react';
import AvailableToggle from './AvailableToggle';
import CategoryPicker from './CategoryPicker';
import DescriptionInput from './DescriptionInput';
import DiscountInput from './DiscountInput';
import NameInput from './NameInput';
import PictureInput from './PictureInput';
import PriceInput from './PriceInput';
import { initialState, reducer } from './reducer';

type Props = {
  open: boolean;
  setOpen: Function;
};

// TODO performance test

const AddProduct: React.FC<Props> = ({ open = false, setOpen }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [categoryLabel, setCategoryLabel] = useState<any>(null);
  const [errors, setErrors] = useState<any>(null);
  const [pictures, setPictures] = useState<any>([]);
  const { enqueueSnackbar } = useSnackbar();

  const validateForm = () => {
    let tmpErrors: any = [];

    if (state.name.length === 0) {
      tmpErrors = { ...tmpErrors, name: "name can't be blank" };
    } else if (state.name.length < 2 || state.name.length > 64) {
      tmpErrors = {
        ...tmpErrors,
        name: (
          <>
            <Typography>name should be between</Typography>
            <Typography> 2 and 64 character</Typography>
          </>
        ),
      };
    }

    if (!state.category) {
      tmpErrors = { ...tmpErrors, category: 'please select a category' };
    }

    if (state.pictures !== undefined && state.pictures.length > 5) {
      tmpErrors = {
        ...tmpErrors,
        pictures: 'you can only choose 5 picture',
      };
    }

    console.log('🚀 - validateForm - tmpErrors', tmpErrors);
    setErrors(tmpErrors);
    return tmpErrors;
  };

  const updatePictures = () => {
    if (!state.pictures) {
      setPictures(undefined);
      return;
    }

    let tmp = [];
    for (let i = 0; i < state.pictures.length; i++) {
      tmp.push(URL.createObjectURL(state.pictures[i]));
    }
    const objectUrls = tmp;
    setPictures(objectUrls);

    // TODO check if it frees memory or not
    for (let i = 0; i < objectUrls.length; i++) {
      return () => {
        URL.revokeObjectURL(objectUrls[i]);
      };
    }
  };

  useEffect(() => {
    console.log('state changed: ', state);

    if (pictures?.length !== state.pictures?.length) {
      updatePictures();
    }

    if (errors) {
      validateForm();
    }
  }, [state]);

  useEffect(() => {
    updatePictures();
  }, [state.pictures]);

  const postProduct = (callback?: Function) => {
    // get submit product to user store

    const tmpErrors = validateForm();
    console.log('🚀 - addProduct - tmpErrors', tmpErrors);
    if (tmpErrors.length === undefined) {
      console.log('will not sending the data to backend');
      return;
    }
    console.log('sending data to the backend');
    console.log(state);

    // comrpess images

    // normalization?
    // how to upload images?
    // send
    // adding the product to the store...
    // show success/error toast

    callback && callback();
  };

  const clearForm = () => {
    dispatch({ type: 'clearAll' });
    setCategoryLabel(null);
    setErrors(null);
    setPictures([]);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    clearForm();
    handleClose();
  };

  const handleSubmitAndClear = () => {
    postProduct(() => {
      clearForm();
    });
  };

  const handleSubmitAndClose = () => {
    postProduct(() => {
      // clearForm();
      // handleClose();
    });
  };

  {
    /* TODO:  add product(add, add another one) */
  }

  const smallScreenView = useMediaQuery('(min-width:700px)');
  const width = smallScreenView ? 400 : 250;

  if (open) {
    return (
      <>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Product</DialogTitle>

          <Divider />

          <DialogContent>
            <Grid container direction={'column'} gap={2}>
              <CategoryPicker
                sx={{ width: width }}
                value={categoryLabel}
                errors={errors}
                onChange={(event: any, newValue: any | null) => {
                  setCategoryLabel(newValue);
                  const tmpCat =
                    newValue?.id === undefined ? null : newValue?.id;
                  dispatch({ key: 'category', value: tmpCat });
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
                onKeyPress={(e: any) =>
                  e.key === 'Enter' && handleSubmitAndClear()
                }
              />

              <AvailableToggle
                value={state.available}
                onChange={() => {
                  dispatch({ key: 'available', value: !state.available });
                }}
              />
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button color="secondary" onClick={handleCancel}>
              cancel
            </Button>
            <Button onClick={handleSubmitAndClear}>add another</Button>
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmitAndClose}
              sx={{ flex: 1 }}
            >
              <Add />
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return <></>;
};

export default AddProduct;
