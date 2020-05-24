import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Validator from '../../validator';


const useStyles = makeStyles((theme) => ({
    submit: {
        margin: theme.spacing(3, 0, 2),
        color: "#fff"
    }
}))

export default function SendCodeForm({ onCodeSent }) {
    const classes = useStyles();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);

    const handleSubmit = async (evt) => {
        evt.preventDefault();

        const formatedEmail = email.trim();
        if (formatedEmail != "") {
            if (Validator.validateEmail(formatedEmail)) {
                // TODO send code
                setEmailError("");
                onCodeSent(formatedEmail);
            } else {
                setEmailError("O email informado e invalido.");
            }
        } else {
            setEmailError("Email e obrigatorio.");
        }
    }

    return (
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
            <TextField
                error={emailError != ""}
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
                helperText={emailError}
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