import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Logo from '../../images/logo.png';
import Copyright from '../../components/copyright';
import SignInForm from './signin_form';


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
    }
}));

export default function SignInPage({ history }) {
    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            
            <div className={classes.loginContainer}>
                <img src={Logo} alt="logo" className={classes.logo} />
                <Typography component="h1" variant="h5">
                    Admin
                </Typography>

                <SignInForm history={history} />
            </div>

            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}