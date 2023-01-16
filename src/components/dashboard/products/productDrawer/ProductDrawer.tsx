import { Add, Edit } from '@mui/icons-material';
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
import React, { useEffect, useReducer, useState } from 'react';
import { useCategories } from '../../../../contexts/CategoriesProvider';
import { apiUrl } from '../../../../modules/pocketbase';
import FullScreenLoading from '../../../shared/FullScreenLoading';
import AvailableToggle from './AvailableToggle';
import CategoryPicker from './CategoryPicker';
import DescriptionInput from './DescriptionInput';
import DiscountInput from './DiscountInput';
import NameInput from './NameInput';
import PictureInput from './PictureInput';
import PriceInput from './PriceInput';
import { ProductState, reducer } from './reducer';

type Props = {
  open: boolean;
  setOpen: Function;
  sending: boolean;
  setSending: Function;
  editMode?: boolean;
  initialState: ProductState & { collectionId?: string; id?: string };
  onSubmit: Function;
  texts: {
    title: string;
    sending: string;
  };
};

// TODO performance test

const ProductDrawer: React.FC<Props> = ({
  open = false,
  setOpen,
  sending = false,
  setSending,
  editMode = false,
  initialState,
  onSubmit,
  texts,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [category, setCategory] = useState<any>(null);
  const [errors, setErrors] = useState<any>(null);
  const [pictures, setPictures] = useState<any>();
  const { categories } = useCategories();

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

  const updatePictures = (pics: any) => {
    if (!pics || typeof pics[0] === 'string') {
      setPictures(undefined);
      return;
    }

    let tmp = [];
    for (let i = 0; i < pics.length; i++) {
      tmp.push(URL.createObjectURL(pics[i]));
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

  const urlToObject = async (imageUrl: string) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'image.png', { type: blob.type });
    console.log(file);
    return file;
  };

  const getPictures = () => {
    const tmpPictures =
      initialState.pictures && initialState.pictures.length > 0
        ? initialState.pictures.map((p: string) => {
            return urlToObject(p);
          })
        : undefined;
    return tmpPictures;
  };

  useEffect(() => {
    if (initialState.pictures) {
      Promise.all(getPictures()).then((pics: any) => {
        console.log('🚀 - Promise.all - pics', pics);
        dispatch({
          type: 'setPictures',
          value: pics,
        });
        // updatePictures(pics);
      });
    }
    if (categories) {
      const tmpInitialCategory = categories.filter((cat: any) => {
        return cat.id === initialState.category;
      })[0];
      setCategory(tmpInitialCategory);
    }
    if (JSON.stringify(initialState) !== JSON.stringify(state)) {
      dispatch({ type: 'setState', state: initialState });
    }
  }, [initialState]);

  useEffect(() => {
    console.log('state changed: ', state);

    if (pictures?.length !== state.pictures?.length) {
      updatePictures(state.pictures);
    }

    if (errors) {
      validateForm();
    }
  }, [state]);

  useEffect(() => {
    if (!editMode) {
      const storeId = localStorage.getItem('store');
      dispatch({ key: 'store', value: storeId });
    }
  }, []);

  useEffect(() => {
    updatePictures(state.pictures);
  }, [state.pictures]);

  const submitProduct = async (callback?: Function) => {
    const tmpErrors = validateForm();
    console.log('🚀 - ProductDrawer - tmpErrors', tmpErrors);
    if (tmpErrors.length === undefined) {
      console.log('will not sending the data to backend');
      return;
    }
    setSending(true);
    console.log('sending data to the backend');
    console.log(state);

    onSubmit && callback && onSubmit(state, callback);
  };

  const clearForm = () => {
    dispatch({ type: 'clearAll' });
    const storeId = localStorage.getItem('store');
    dispatch({ key: 'store', value: storeId });
    setCategory(null);
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
    if (editMode) {
      handleSubmitAndClose();
    } else {
      submitProduct(() => {
        clearForm();
      });
    }
  };

  const handleSubmitAndClose = () => {
    submitProduct(() => {
      clearForm();
      handleClose();
    });
  };

  const smallScreenView = useMediaQuery('(min-width:700px)');
  const width = smallScreenView ? 400 : 250;

  if (open) {
    return (
      <>
        <FullScreenLoading open={sending}>
          <Typography sx={{ marginTop: 2 }}>{texts.sending}</Typography>
        </FullScreenLoading>
        <Dialog
          onKeyPress={(e: any) => {
            e.ctrlKey && e.key === 'Enter' && handleSubmitAndClear();
          }}
          open={open}
          onClose={handleClose}
        >
          <DialogTitle>{texts.title}</DialogTitle>

          <Divider />

          <DialogContent>
            <Grid container direction={'column'} gap={2}>
              <CategoryPicker
                sx={{ width: width }}
                value={category}
                errors={errors}
                onChange={(event: any, newValue: any | null) => {
                  setCategory(newValue);
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
          <DialogActions sx={{ justifyContent: 'right' }}>
            <Button color="secondary" onClick={handleCancel}>
              cancel
            </Button>
            {!editMode ? (
              <Button onClick={handleSubmitAndClear}>add another</Button>
            ) : null}

            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmitAndClose}
            >
              {!editMode ? (
                <>
                  <Add />
                  Add
                </>
              ) : (
                <>
                  <Edit />
                  Apply
                </>
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return <></>;
};

export default ProductDrawer;
