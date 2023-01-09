// TODO: client side form validation
// TODO: improve performance
import { Add, PhotoLibrary } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { memo, useEffect, useReducer, useRef, useState } from 'react';
import { handleError } from '../../../modules/errorHandler';
import { pb } from '../../../modules/pocketbase';
import DescriptionDrawer from './DescriptionDrawer';
import PicturesList from './PicturesList';

type Props = {
  open: boolean;
  setOpen: Function;
};

const storeId = localStorage.getItem('store');

type ProductState = {
  store: string | null;
  name: string;
  category: any;
  description: string;
  pictures: any;
  price: string;
  discount: string;
  available: boolean;
};

const initialState: ProductState = {
  store: storeId,
  name: '',
  description: '',
  category: null,
  pictures: undefined,
  price: '',
  discount: '',
  available: true,
};

function reducer(
  state: ProductState,
  action: {
    type?: string;
    key?: string | undefined;
    value?: string | FileList | undefined | boolean;
  }
) {
  console.log('action.type', action.type);
  console.log('action.key', action.key);
  console.log('action.value', action.value);

  switch (action.type) {
    case 'addPicture':
      if (state.pictures) {
        return {
          ...state,
          [action.key as string]: [
            ...state.pictures,
            ...(action.value as FileList),
          ],
        };
      }
      return {
        ...state,
        [action.key as string]: [...(action.value as FileList)],
      };

    case 'setAsMainPicture': {
      const index = parseInt(action.key as string);
      const tmpPicture = state.pictures.splice(index, 1);
      return { ...state, pictures: [...tmpPicture, ...state.pictures] };
    }

    case 'replacePicture': {
      // const index = parseInt(action.key);
      // const tmpPicture = state.pictures.splice(index, 1);
      // return { ...state, pictures: [...tmpPicture, ...state.pictures] };
    }

    // TODO clean code(as string...)

    case 'deletePicture': {
      const index = parseInt(action.key as string);
      const tmpState = state;
      tmpState.pictures.splice(index, 1);
      return { ...tmpState };
    }

    case 'clearAll':
      return { ...initialState };

    default:
      return { ...state, [action.key as string]: action.value };
  }
}

const AddProduct: React.FC<Props> = ({ open = false, setOpen }) => {
  // ------------------------------------------------------------------------------------
  // logic
  // ------------------------------------------------------------------------------------

  const [state, dispatch] = useReducer(reducer, initialState);
  const [categories, setCategories] = useState<any>([]);
  const [showPicturesList, setShowPicturesList] = useState(false);
  const [pictures, setPictures] = useState<any>([]);
  const [categoryLabel, setCategoryLabel] = useState<any>(null);
  const [errors, setErrors] = useState<any>(null);
  const [descriptionMultiline, setDescriptionMultiline] = useState(false);
  const descriptionInput = React.useRef<any>(null);

  const getCategories = () => {
    pb.collection('products_category')
      .getFullList(200 /* batch size */, {
        sort: '-name',
      })
      .then((res) => {
        const options = res.map((item) => {
          return {
            label: item.name,
            id: item.id,
          };
        });
        setCategories(options);
      })
      .catch((err) => {
        handleError(err, 'AddProduct- getCategories');
      });
  };

  const validateForm = () => {
    console.log('validating...');
    let tmpErrors: any = [];
    console.log('state.name', state.name.length);

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

    console.log('!state.category', !state.category);

    if (!state.category) {
      tmpErrors = { ...tmpErrors, category: 'please select a category' };
    }

    console.log('state.pictures', state.pictures);
    console.log(
      'state.pictures.length',
      state.pictures && state.pictures.length
    );

    if (state.pictures !== undefined && state.pictures.length > 5) {
      tmpErrors = {
        ...tmpErrors,
        pictures: 'you can only set 5 picture per product',
      };
    }

    setErrors(tmpErrors);
  };

  // TODO perf improve

  useEffect(() => {
    // TODO use autocomplete feature instead
    getCategories();
  }, []);

  useEffect(() => {
    console.log('errors', errors);
  }, [errors]);

  useEffect(() => {
    if (descriptionMultiline) {
      descriptionInput.current.focus();
    }
  }, [descriptionMultiline]);

  useEffect(() => {
    console.log('state changed: ', state);

    if (errors) {
      validateForm();
    }

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
  }, [state]);

  const { enqueueSnackbar } = useSnackbar();

  const addProduct = (callback?: Function) => {
    // get submit product to user store
    console.log('will sending the data to backend');
    validateForm();
    if (!errors) {
      console.log(state);
    }
    // form validation
    // normalization
    // how to upload images?
    // send
    // adding the product to the store...
    // TODO later: maybe some tips when user is waiting
    // show success/error toast

    callback && callback();
  };

  const clearForm = () => {
    dispatch({ type: 'clearAll' });
    setCategoryLabel(null);
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
    addProduct(() => {
      clearForm();
    });
  };

  const handleSubmitAndClose = () => {
    addProduct(() => {
      // clearForm();
      // handleClose();
    });
  };

  {
    /* TODO:  add product(add, add another one) */
  }

  // ------------------------------------------------------------------------------------
  // logic
  // ------------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------------
  // views
  // ------------------------------------------------------------------------------------

  const smallScreenView = useMediaQuery('(min-width:700px)');
  const width = smallScreenView ? 400 : 250;

  const categoryPicker = (
    <>
      {/* TODO: https://mui.com/material-ui/react-autocomplete/ */}
      <Autocomplete
        sx={{ width: width }}
        disablePortal
        options={categories}
        value={categoryLabel}
        // value={findCategory(state.category)}
        // TODO Value
        onChange={(event: any, newValue: any | null) => {
          setCategoryLabel(newValue);
          const tmpCat = newValue?.id === undefined ? null : newValue?.id;
          dispatch({ key: 'category', value: tmpCat });
        }}
        renderInput={(params) => (
          <TextField
            error={errors && errors.category ? true : false}
            {...params}
            label="Category*"
          />
        )}
      />
      {errors ? (
        <Typography sx={{ color: '#ff4949' }}>{errors.category}</Typography>
      ) : (
        <></>
      )}
    </>
  );

  const picturesInput = (
    <>
      <Grid container sx={{ display: 'flex' }}>
        <Grid item sx={{ flex: 20 }}>
          <Button sx={{ width: '100%' }} variant="contained" component="label">
            {state.pictures == undefined || state.pictures.length === 0
              ? 'Set Pictures'
              : 'Add More'}
            <PhotoLibrary sx={{ marginLeft: 1 }} />
            <input
              type="file"
              hidden
              accept="image/jpg, image/jpeg, image/png"
              multiple
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  dispatch({
                    type: 'addPicture',
                    key: 'pictures',
                    value: e.target.files,
                  });
                }
              }}
            />
            {/* TODO: when chosen show thumbnail + delete + add more+ draggable(rearrange) */}
          </Button>
        </Grid>
        {state.pictures && state.pictures.length > 0 ? (
          <Grid item sx={{ flex: 1 }}>
            <Button
              sx={{ padding: 0 }}
              onClick={() => {
                setShowPicturesList(true);
              }}
            >
              <Box
                component="img"
                sx={{
                  height: 36,
                  width: 36,
                  borderRadius: 10,
                }}
                alt="The house from the offer."
                src={pictures && pictures[0]}
              />
              {/* {state.pictures && <img src={thumbnails} />} */}
            </Button>
          </Grid>
        ) : (
          <></>
        )}
      </Grid>
      {errors ? (
        <Typography sx={{ color: '#ff4949' }}>{errors.pictures}</Typography>
      ) : (
        <></>
      )}
    </>
  );

  const nameInput = (
    <>
      <TextField
        error={errors && errors.name ? true : false}
        sx={{ width: width }}
        label="Name*"
        variant="outlined"
        value={state.name}
        onChange={(e) => {
          dispatch({ key: 'name', value: e.target.value });
        }}
      />
      {errors ? <Box sx={{ color: '#ff4949' }}>{errors.name}</Box> : <></>}
    </>
  );

  const priceInput = (
    <TextField
      sx={{ width: width }}
      label="Price (opt)"
      variant="outlined"
      value={state.price}
      onChange={(e) => {
        dispatch({ key: 'price', value: e.target.value });
      }}
      InputProps={{
        // TODO $/euro/﷼/تومن
        endAdornment: <InputAdornment position="end">$</InputAdornment>,
      }}
    />
  );

  const discountInput = (
    <TextField
      onKeyPress={(e) => e.key === 'Enter' && handleSubmitAndClear()}
      sx={{ width: width }}
      label="Discount (opt)"
      variant="outlined"
      value={state.discount}
      onChange={(e) => {
        dispatch({ key: 'discount', value: e.target.value });
      }}
      InputProps={{
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
      }}
    />
  );

  // ------------------------------------------------------------------------------------
  // views
  // ------------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------------
  // render
  // ------------------------------------------------------------------------------------

  if (open) {
    return (
      <>
        <PicturesList
          open={showPicturesList}
          setOpen={setShowPicturesList}
          pictures={pictures}
          dispatch={dispatch}
        />
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Product</DialogTitle>
          <Divider />
          <DialogContent>
            <Grid container direction={'column'} gap={2}>
              {/* TODO: add icons next to category text */}
              {/* TODO user should be able to add a category if cat is not there */}
              {categoryPicker}

              {picturesInput}

              {nameInput}

              <TextField
                sx={{ width: width }}
                label="Description (opt)"
                variant="outlined"
                value={state.description}
                onChange={(e) => {
                  dispatch({ key: 'description', value: e.target.value });
                }}
                multiline={descriptionMultiline}
                minRows={4}
                maxRows={5}
                inputRef={descriptionInput}
                onFocus={() => {
                  setDescriptionMultiline(true);
                }}
                onBlur={() => {
                  setDescriptionMultiline(false);
                }}
              />

              {priceInput}

              {discountInput}

              <Grid>
                Available:
                <Switch
                  defaultChecked
                  onChange={() => {
                    dispatch({ key: 'available', value: !state.available });
                  }}
                  value={state.available}
                />
              </Grid>
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

// ------------------------------------------------------------------------------------
// render
// ------------------------------------------------------------------------------------

export default memo(AddProduct);
