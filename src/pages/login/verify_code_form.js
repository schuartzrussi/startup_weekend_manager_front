import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import ButtonLink from '../../components/button_link';


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

export default function VerifyCodeForm({ email, onCodeSent, onChangeEmail }) {
    const classes = useStyles();
    const [code, setCode] = useState("");

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        // TODO login
        alert(`Logar ${code}`)
    }

    const resendCode = async () => {
        alert(`Resend code to ${email}`);
        onCodeSent(email);
    }
    
    return (
        <div>
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="code"
                    label="Codigo"
                    name="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
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