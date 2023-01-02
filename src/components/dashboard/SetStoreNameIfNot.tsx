import { useEffect, useMemo, useState } from 'react';
import { handleError } from '../../modules/errorHandler';
import { pb } from '../../modules/pocketbase';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useSnackbar } from 'notistack';
import { randomName } from '../../modules/randomName';

const SetStoreNameIfNot = () => {
  const [show, setShow] = useState(false);
  const [isSet, setIsSet] = useState(false);
  const [storeName, setStoreName] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('store')) {
      pb.collection('stores')
        .getList(1, 1, {
          filter: `owner = "${pb.authStore.model?.id}"`,
        })
        .then((res) => {
          console.log(res);
          if (res.items.length > 0) {
            localStorage.setItem('store', res.items[0].id);
            setIsSet(true);
          } else {
            setShow(true);
          }
        })
        .catch((err) => {
          handleError(err, 'setStoreNameIfNot');
        });
    }
  }, []);

  const { enqueueSnackbar } = useSnackbar();

  const createStore = (storeName: string, callback: Function) => {
    const data = {
      owner: pb.authStore?.model?.id,
      name: storeName,
      username: pb.authStore?.model?.username,
    };

    pb.collection('stores')
      .create(data)
      .then((res) => {
        console.log(res);
        localStorage.setItem('store', res.id);
        setIsSet(true);
        setShow(false);
        callback && callback();
      })
      .catch((err) => {
        handleError(err, 'SetStoreNameIfNot - handleSubmit', enqueueSnackbar);
      });
  };

  const handleSubmit = () => {
    createStore(storeName, () => {
      enqueueSnackbar('Store Name saved.', { variant: 'success' });
    });
  };

  const handleClose = () => {
    createStore(randomName(), () => {
      enqueueSnackbar('you can always changed it in settings', {
        variant: 'info',
      });
      enqueueSnackbar('OK, we picked a random name for you', {
        variant: 'success',
      });
    });
    setShow(false);
  };

  if (show)
    return (
      <Dialog open={show}>
        <DialogTitle>
          Welcome to coffeeMenu 👋
          <br /> Lest start by naming Your Store!
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            what should we call your store? (this will be displayed to end
            customers)
          </DialogContentText>
          <TextField
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            margin="dense"
            id="name"
            label="Store Name"
            type="name"
            fullWidth
            variant="standard"
            required
            autoFocus
            value={storeName}
            onChange={(e) => {
              setStoreName(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>i will choose later</Button>
          <Button type="submit" variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );

  // modal, input,toasts, place holder, lets start by choosing you store name
  // what we should call you store?

  return <></>;
};

export default SetStoreNameIfNot;
