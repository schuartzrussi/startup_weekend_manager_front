import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    buttonLink: {
        background: "none !important",
        border: "none",
        padding: "0 !important",
        color: "#069",
        cursor: "pointer",
        fontSize: "10px"
    }
}))

export default function ButtonLink({ label, onClick }) {
    const classes = useStyles();

    return (
        <Button
            type="button"
            onClick={onClick}
            className={classes.buttonLink}>
            {label}
        </Button>
    )
}