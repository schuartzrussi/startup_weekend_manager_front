import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Message({ severity, visible, duration, message, handleClose }) {
    return (
        <Snackbar open={visible} autoHideDuration={duration} onClose={handleClose}>
            <Alert severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    )
}