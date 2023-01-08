import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from '@mui/material';
import { memo } from 'react';

type Props = {
  open: boolean;
  setOpen: Function;
  description: any;
  dispatch: any;
};

const DescriptionDrawer: React.FC<Props> = ({
  open = false,
  setOpen,
  description,
  dispatch,
}) => {
  const handleClose = () => {
    setOpen(false);
  };
  if (open) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <TextField
            // TODO more width on big screen
            onKeyPress={(e) => e.key === 'Enter' && e.ctrlKey && handleClose()}
            autoFocus
            id="outlined-multiline-static"
            label="Description"
            multiline
            minRows={4}
            maxRows={8}
            value={description}
            onChange={(e) => {
              dispatch({ key: 'description', value: e.target.value });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  return <></>;
};

export default memo(DescriptionDrawer);
