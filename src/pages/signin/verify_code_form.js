import React, { useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import ButtonLink from '../../components/button_link';
import { authContext } from '../../contexts/AuthContext';
import { sendOTP, verifyOTP } from '../../services/api';


const useStyles = makeStyles((theme) => ({
    submit: {
        margin: theme.spacing(3, 0, 2),
        color: "#fff"
    },

    linksContainer: {
        display: "flex",
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
}))

export default function VerifyCodeForm({ 
    email, 
    onCodeSent, 
    onChangeEmail, 
    history,
    showMessage, 
    changeLoadingState }) {

    const classes = useStyles();
    const [code, setCode] = useState("");
    const [codeError, setCodeError] = useState("");
    const { setAuthData } = useContext(authContext);

    const handleSubmit = async (evt) => {
        evt.preventDefault();

        const formatedCode = code.trim();
        if (formatedCode != "") {
            changeLoadingState(true);
            const response = await verifyOTP(formatedCode);
            changeLoadingState(false);
            let valid = false;

            if (response != null && response.status == 200) {
                valid = true;
                const headers = response.headers;
                setAuthData(headers['x-swm-authorization'])
            }

            if (valid) {
                setCodeError("");
                history.replace('/');
            } else {
                setCodeError("Codigo invalido.")
            }
        } else {
            setCodeError("Codigo e obrigatorio.")
        }
    }

    const resendCode = async () => {
        changeLoadingState(true);
        const respone = await sendOTP(email);
        changeLoadingState(false);

        if (respone != null && respone.status == 200) {
            onCodeSent(email);

            showMessage(
                "Codigo reenviado com sucesso!", 
                "success", 
                4000
            )
        } else {
            showMessage(
                "Ocorreu um erro no envio do token. Tente novamente.", 
                "error", 
                6000
            )
        }
    }
    
    return (
        <div>
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
                <TextField
                    error={codeError != ""}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="code"
                    label="Codigo"
                    name="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    helperText={codeError}
                    autoFocus
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}>
                    Entrar
                </Button>
            </form>

            <div className={classes.linksContainer}>
                <ButtonLink 
                    label="Reenviar Codigo"
                    onClick={resendCode}
                />
                
                <ButtonLink 
                    label="Alterar email"
                    onClick={() => {
                        setCode("");
                        onChangeEmail();
                    }}
                />
            </div>
        </div>
    )
}