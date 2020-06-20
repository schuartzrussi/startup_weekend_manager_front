import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.modal + 1,
        color: '#fff',
    },
}));


export default function Loading({ visible }) {
    const classes = useStyles();

    return (
        <Backdrop className={classes.backdrop} open={visible}>
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}