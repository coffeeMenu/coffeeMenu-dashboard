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
import React, { useEffect, useState } from 'react';
import { useCategories } from '../../../../contexts/CategoriesProvider';
import { log_productDrawerChange } from '../../../../logConfig';
import { findCategoryObject } from '../../../../modules/utils';
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
  state: ProductState;
  dispatch: any;
  category: any;
  setCategory: any;
  pictures: any;
  setPictures: any;
  open: boolean;
  setOpen: Function;
  sending: boolean;
  setSending: Function;
  editMode?: boolean;
  onSubmit: Function;
  texts: {
    title: string;
    sending: string;
  };
  primaryButton: any;
};

// TODO performance test

const ProductDrawer: React.FC<Props> = ({
  state,
  dispatch,
  category,
  setCategory,
  pictures,
  setPictures,
  open = false,
  setOpen,
  sending = false,
  setSending,
  editMode = false,
  onSubmit,
  texts,
  primaryButton,
}) => {
  const [errors, setErrors] = useState<any>(null);
  const { categories } = useCategories();

  useEffect(() => {
    console.log('newState');
    console.log(state);
  });

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

  const createObjectFromURL = (pics: any) => {
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

  useEffect(() => {
    log_productDrawerChange && console.log('🚨 state changed: ', state);

    if (pictures?.length !== state.pictures?.length) {
      createObjectFromURL(state.pictures);
    }

    if (errors) {
      validateForm();
    }
  }, [state]);

  const submitProduct = async (callback?: Function) => {
    const tmpErrors = validateForm();
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
    console.log('clearForm');

    dispatch({ type: 'clearAll' });
    setCategory(null);
    setErrors(null);
    setPictures([]);
  };

  const handleClose = () => {
    setOpen(false);
    if (editMode) {
      clearForm();
    }
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
              {primaryButton}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return <></>;
};

export default ProductDrawer;
