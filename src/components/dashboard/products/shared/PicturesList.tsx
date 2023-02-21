// TODO later: darg/drop
// TODO crop by user
import { Close, MoreVert } from '@mui/icons-material';
import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Grid, Menu, MenuItem, Typography, useMediaQuery } from '@mui/material';
import React, { memo, useEffect, useState } from 'react';

type Props = {
    open: boolean;
    setOpen: Function;
    pictures: any;
    onSetAsMainPicture: any;
    onDeletePicture: any;
};

const PicturesList: React.FC<Props> = ({ open = false, setOpen, pictures, onSetAsMainPicture, onDeletePicture }) => {
    const handleClose = () => {
        setOpen(false);
    };

    const [menusOpen, setMenusOpen] = useState<any>(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    useEffect(() => {
        if (pictures?.length === 0) {
            setOpen(false);
        }
    }, [pictures]);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
        let tmp = [];
        tmp[index] = true;
        setMenusOpen(tmp);
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenusOpen(false);
        setAnchorEl(null);
    };

    const smallScreenView = useMediaQuery('(min-width:700px)');
    const imageWidth = smallScreenView ? 400 : 230;

    if (open)
        return (
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    <Grid container justifyContent={'space-between'}>
                        <Grid item>
                            عکس‌ها({pictures.length})<Typography>برای خروجی بهتر,</Typography>
                            <Typography>از عکس های مربعی استفاده کن.</Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                onClick={() => {
                                    setOpen(false);
                                }}>
                                <Close />
                            </Button>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    {/* draggable action(swipe left to delete/swipe right to edit) */}
                    <Grid textAlign={'center'}>
                        {pictures &&
                            pictures.map((pic: any, index: number) => {
                                return (
                                    <Box key={index} sx={{ padding: 1, position: 'relative' }}>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                right: 15,
                                                top: 18,
                                                padding: 0.5,
                                                background: '#18181b52',
                                                borderRadius: 10,
                                            }}>
                                            <Button
                                                sx={{ minWidth: 0, padding: 0, color: 'white' }}
                                                onClick={(e) => {
                                                    handleMenuClick(e, index);
                                                }}>
                                                <MoreVert fontSize="large" />
                                            </Button>
                                            <Menu id="basic-menu" anchorEl={anchorEl} open={menusOpen[index] || false} onClose={handleMenuClose} onClick={handleMenuClose}>
                                                <MenuItem
                                                    onClick={() => {
                                                        onSetAsMainPicture(index);
                                                    }}>
                                                    استفاده به عنوان پیشفرض
                                                </MenuItem>
                                                {/* TODO later */}
                                                {/* <MenuItem>Replace</MenuItem> */}
                                                <MenuItem
                                                    onClick={() => {
                                                        onDeletePicture(index);
                                                    }}
                                                    sx={{ color: '#ff4949' }}>
                                                    حذف
                                                </MenuItem>
                                            </Menu>
                                        </Box>
                                        <Box
                                            component="img"
                                            sx={{
                                                objectFit: 'cover',
                                                height: imageWidth,
                                                width: imageWidth,
                                            }}
                                            // TODO alt:(name/desc)
                                            src={pic}
                                        />
                                    </Box>
                                );
                            })}
                    </Grid>
                </DialogContent>
            </Dialog>
        );
    return <></>;
};

export default memo(PicturesList);
