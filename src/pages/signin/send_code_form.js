import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Validator from '../../validator';
import { sendOTP } from '../../services/api';


const useStyles = makeStyles((theme) => ({
    submit: {
        margin: theme.spacing(3, 0, 2),
        color: "#fff"
    }
}))

export default function SendCodeForm({ onCodeSent, showMessage, changeLoadingState }) {
    const classes = useStyles();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);

    const handleSubmit = async (evt) => {
        evt.preventDefault();

        const formatedEmail = email.trim();
        if (formatedEmail !== "") {
            if (Validator.validateEmail(formatedEmail)) {
                changeLoadingState(true);
                const respone = await sendOTP(formatedEmail);
                changeLoadingState(false);

                if (respone != null && respone.status === 200) {
                    setEmailError("");
                    showMessage(
                        "Codigo enviado com sucesso", 
                        "success", 
                        4000
                    );
                    onCodeSent(formatedEmail);
                } else {
                    showMessage(
                        "Ocorreu um erro no envio do token. Tente novamente.", 
                        "error", 
                        6000
                    );
                }
            } else {
                setEmailError("Email invalido.");
            }
        } else {
            setEmailError("Email e obrigatorio.");
        }
    }

    return (
        <div>
            <form className={classes.form} onSubmit={handleSubmit} noValidate>
                <TextField
                    error={emailError !== ""}
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
        </div>
    )
}