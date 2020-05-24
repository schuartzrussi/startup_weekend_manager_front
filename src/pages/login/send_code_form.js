import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    submit: {
        margin: theme.spacing(3, 0, 2),
        color: "#fff"
    }
}))

export default function SendCodeForm({ onCodeSent }) {
    const classes = useStyles();
    const [email, setEmail] = useState("");

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        // TODO send code
        onCodeSent(email);
    }

    return (
        <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoFocus
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}>
                Enviar Código
            </Button>
        </form>
    )
}