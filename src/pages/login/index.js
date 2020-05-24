import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Logo from '../../images/logo.png';
import Copyright from '../../components/copyright';
import AppStyles from '../../AppStyles';


const useStyles = makeStyles((theme) => ({

    loginContainer: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: "0.1rem solid",
        borderRadius: "20px",
        borderColor: "#ececec",
        backgroundColor: '#f7faf8',
        padding: '20px'
    },

    logo: {
        height: "80px",
    },
    form: {
        width: '100%',
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        color: "#fff"
    },
}));

export default function SignIn() {
  const classes = useStyles();

  return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.loginContainer}>
                <img src={Logo} className={classes.logo} />
                <Typography component="h1" variant="h5">
                    Admin
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
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

            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}