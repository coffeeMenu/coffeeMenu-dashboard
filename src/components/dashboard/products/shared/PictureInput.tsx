import { PhotoLibrary } from '@mui/icons-material';
import { Box, Button, Grid, Typography } from '@mui/material';
import { FC, useState } from 'react';
import PicturesList from './PicturesList';

type Props = {
    onChange: any;
    errors: any;
    pictures: any;
    onSetAsMainPicture: any;
    onDeletePicture: any;
};

const PictureInput: FC<Props> = ({ onChange, errors, pictures, onSetAsMainPicture, onDeletePicture }) => {
    const [showPicturesList, setShowPicturesList] = useState(false);

    return (
        <>
            <PicturesList
                open={showPicturesList}
                setOpen={setShowPicturesList}
                pictures={pictures}
                onSetAsMainPicture={(index: string) => {
                    onSetAsMainPicture(index);
                }}
                onDeletePicture={(index: string) => {
                    onDeletePicture(index);
                }}
            />
            <Grid container sx={{ display: 'flex' }}>
                <Grid item sx={{ flex: 20 }}>
                    <Button sx={{ width: '100%' }} variant="contained" component="label">
                        <PhotoLibrary sx={{ marginLeft: 1 }} />
                        {pictures == undefined || pictures.length === 0 ? 'انتخاب عکس(ها)' : 'اضافه کردن'}
                        <input type="file" hidden accept="image/jpg, image/jpeg, image/png" multiple onChange={onChange} />
                        {/* TODO later: when chosen show thumbnail + delete + add more+ draggable(rearrange) */}
                    </Button>
                </Grid>
                {pictures && pictures.length > 0 ? (
                    <Grid item sx={{ flex: 1 }}>
                        <Button
                            sx={{ padding: 0 }}
                            onClick={() => {
                                setShowPicturesList(true);
                            }}>
                            <Box
                                component="img"
                                sx={{
                                    height: 36,
                                    width: 36,
                                    borderRadius: 10,
                                }}
                                // alt="The house from the offer."
                                src={pictures && pictures[0]}
                            />
                        </Button>
                    </Grid>
                ) : (
                    <></>
                )}
            </Grid>
            {errors ? <Typography sx={{ color: '#ff4949' }}>{errors.pictures}</Typography> : <></>}
        </>
    );
};

export default PictureInput;
