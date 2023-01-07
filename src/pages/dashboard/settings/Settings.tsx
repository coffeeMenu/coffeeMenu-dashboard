import { Cancel, Check, Edit } from '@mui/icons-material';
import { Button, Grid, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import { handleError } from '../../../modules/errorHandler';
import { pb } from '../../../modules/pocketbase';

const Settings = () => {
  const [store, setStore] = useState<any>();
  const [editMode, setEditMode] = useState(false);
  const prevStore = useRef<any>();
  const textInput = useRef<any>(null);

  const storeId = localStorage.getItem('store');

  const getStoreName = () => {
    pb.collection('stores')
      .getFirstListItem(`id="${storeId}"`)
      .then((res) => {
        console.log(res);

        setStore(res);
        prevStore.current = res;
      })
      .catch((err) => {
        handleError(err, 'Settings, getStoreName');
      });
  };

  useEffect(() => {
    getStoreName();
  }, []);

  useEffect(() => {
    if (editMode) textInput.current.focus();
  }, [editMode]);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = () => {
    pb.collection('stores')
      .update(storeId as string, store)
      .then(() => {
        enqueueSnackbar(`Name changed to ${store.name} successfully`, {
          variant: 'success',
        });
        setEditMode(false);
        prevStore.current = store;
      })
      .catch((err) => {
        handleError(err, 'Settings, handleSubmit', enqueueSnackbar);
      });
  };
  const handleCancel = () => {
    setEditMode(false);
    setStore(prevStore.current);
  };

  return (
    <Grid container alignItems="center">
      <TextField
        disabled={!editMode}
        inputRef={textInput}
        label="Store Name:"
        variant="outlined"
        value={store?.name || ''}
        onClick={() => {
          setEditMode(true);
          // change focus to it
        }}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        onChange={(e) => {
          setStore({ ...store, name: e.target.value });
        }}
      />
      {editMode ? (
        <>
          <Button
            onClick={() => {
              handleSubmit();
            }}
            sx={{ marginLeft: 2 }}
            variant="contained"
          >
            <Check />
          </Button>
          <Button
            onClick={() => {
              handleCancel();
            }}
            sx={{ marginLeft: 1, background: 'gray' }}
            variant="contained"
            color="error"
          >
            <Cancel sx={{ opacity: 0.7 }} />
          </Button>
        </>
      ) : (
        <Button
          onClick={() => {
            setEditMode(true);
            // change focus to it
          }}
          sx={{ marginLeft: 2 }}
          variant="contained"
        >
          <Edit />
        </Button>
      )}
    </Grid>
  );
};

export default Settings;
