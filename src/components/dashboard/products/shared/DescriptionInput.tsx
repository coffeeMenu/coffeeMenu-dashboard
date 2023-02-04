import { TextField } from '@mui/material';
import { ChangeEventHandler, FC, useEffect, useRef, useState } from 'react';

type Props = {
  sx: any;
  value: string;
  onChange:
    | ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
};

const DescriptionInput: FC<Props> = ({ sx, value, onChange }) => {
  const [descriptionMultiline, setDescriptionMultiline] = useState(false);

  const descriptionInput = useRef<any>(null);

  useEffect(() => {
    if (descriptionMultiline) {
      descriptionInput.current.focus();
    }
  }, [descriptionMultiline]);

  return (
    <TextField
      sx={sx}
      label="Description (opt)"
      variant="outlined"
      value={value}
      onChange={onChange}
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
  );
};

export default DescriptionInput;
