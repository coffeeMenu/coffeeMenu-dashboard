import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { handleError } from '../../../modules/errorHandler';
import { pb } from '../../../modules/pocketbase';
import { useProducts } from '../../../contexts/ProductsProvider';
type Props = {
  id: string;
  name: string;
  open: boolean;
  setOpen: any;
};
const DeleteProduct: React.FC<Props> = ({ id, name, open, setOpen }) => {
  const { deleteProduct } = useProducts();
  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    pb.collection('products')
      .delete(id)
      .then(() => {
        setOpen(false);
        deleteProduct(id);
      })
      .catch((err) => {
        handleError(err, 'DeleteProduct, handleDelete()');
      });
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Are you sure you want to delete {name}?
        </DialogTitle>
        <DialogActions>
          <Button color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            autoFocus
          >
            YES
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteProduct;
