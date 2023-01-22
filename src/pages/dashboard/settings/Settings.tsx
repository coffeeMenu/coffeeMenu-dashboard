import { Divider, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import EditableTextInput from '../../../components/dashboard/settings/EditableTextInput';
import { handleError } from '../../../modules/errorHandler';
import { pb } from '../../../modules/pocketbase';

const Settings = () => {
  const [store, setStore] = useState<any>();
  const [nameEditMode, setNameEditMode] = useState(false);
  const [userNameEditMode, setUserNameEditMode] = useState(false);
  const prevStore = useRef<any>();
  const textInput = useRef<any>(null);
  const textInput2 = useRef<any>(null);

  const storeId = localStorage.getItem('store');

  const getStore = () => {
    pb.collection('stores')
      .getFirstListItem(`id="${storeId}"`)
      .then((res) => {
        console.log(res);
        setStore(res);
        prevStore.current = res;
      })
      .catch((err) => {
        handleError(err, 'Settings, getStore');
      });
  };

  useEffect(() => {
    getStore();
  }, []);

  useEffect(() => {
    if (nameEditMode) textInput.current.focus();
    if (userNameEditMode) textInput2.current.focus();
  }, [nameEditMode, userNameEditMode]);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = () => {
    pb.collection('stores')
      .update(storeId as string, store)
      .then(() => {
        enqueueSnackbar(`Settings Change Successfully`, {
          variant: 'success',
        });
        setNameEditMode(false);
        setUserNameEditMode(false);
        prevStore.current = store;
      })
      .catch((err) => {
        handleError(err, 'Settings, handleSubmit', enqueueSnackbar);
      });
  };
  const handleCancel = () => {
    setNameEditMode(false);
    setUserNameEditMode(false);
    setStore(prevStore.current);
  };

  return (
    <>
      <Typography fontSize={'large'} sx={{ fontSize: 30 }}>
        Store Settings
      </Typography>
      <Divider />
      <br />
      <br />
      <EditableTextInput
        disabled={!nameEditMode}
        inputRef={textInput}
        label="Store Name:"
        value={store?.name || ''}
        editMode={nameEditMode}
        setEditMode={setNameEditMode}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        onChange={(e) => {
          setStore({ ...store, name: e.target.value });
        }}
      />
      <br />

      <EditableTextInput
        disabled={!userNameEditMode}
        inputRef={textInput2}
        label="Store Username:"
        value={store?.username || ''}
        editMode={userNameEditMode}
        setEditMode={setUserNameEditMode}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        onChange={(e) => {
          setStore({ ...store, username: e.target.value });
        }}
      />
    </>
  );
};

export default Settings;
