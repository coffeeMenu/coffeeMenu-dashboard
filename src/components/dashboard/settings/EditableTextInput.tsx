import { Cancel, Check, Edit } from '@mui/icons-material';
import { Button, Grid, TextField, Typography } from '@mui/material';
import { ChangeEventHandler } from 'react';

type Props = {
  disabled: boolean;
  inputRef: any;
  label: string;
  value: any;
  editMode: any;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: Function;
  handleCancel: Function;
  onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
};
const EditableTextInput = ({
  disabled,
  inputRef,
  label,
  value,
  editMode,
  setEditMode,
  handleSubmit,
  handleCancel,
  onChange,
}: Props) => {
  return (
    <Grid container alignItems="center">
      <Typography fontSize={'large'} sx={{ marginRight: 1 }}>
        {label}
      </Typography>
      <TextField
        disabled={disabled}
        inputRef={inputRef}
        variant="outlined"
        value={value}
        onClick={() => {
          setEditMode(true);
          // change focus to it
        }}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        onChange={onChange}
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

export default EditableTextInput;
