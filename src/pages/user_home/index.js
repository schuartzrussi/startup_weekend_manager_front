import React, { useState, useContext } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Logo from '../../images/logo.png';
import { logout } from '../../services/api';
import { authContext } from '../../contexts/AuthContext';
import Timer from '../../components/timer';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },

    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },

    toolbar: theme.mixins.toolbar,

    title: {
        flexGrow: 1,
    },

    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },

    homeContainer: {
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

    timerContainer: {
        textAlign: "center",
    }
}));

export default function UserHomePage() {
    const classes = useStyles();
    const { setAuthData } = useContext(authContext);
    const [currentPhase, setCurrentPhase] = useState("NOT_STARTED");

    const getPageContent = function() {
        const getEventStartDate = function() {
            let eventDate = new Date(2020, 5, 30, 10, 10, 10, 0);
            let now = new Date();

            if (eventDate > now) {
                return (eventDate.getTime() - now.getTime()) / 1000;
            }
            return 0;
        }
        switch (currentPhase) {
            case "NOT_STARTED":
                return (
                    <div className={classes.timerContainer}>
                        <Typography variant="h6">
                            Inicio em:
                        </Typography>

                        <Timer
                            seconds={getEventStartDate()}
                            show_actions={false}
                            auto_start={true}
                            show_legends={true}
                        />
                    </div>
                )
        }
    }

    const logoVisible = function() {
        return currentPhase === "NOT_STARTED";
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Startup Weekend
                    </Typography>
                    <Button 
                        color="inherit"
                        onClick={() => {
                            const asyncLogout = async function() {
                                const response = await logout();
                                if (response.status == 200) {
                                    setAuthData(null);
                                } else {
                                    // TODO tratar erro
                                }
                            }
                            asyncLogout();
                        }}>Sair</Button>
                </Toolbar>
            </AppBar>
            
            <div className={classes.content}>
                <div className={classes.toolbar} />
                <Container component="main" maxWidth="xs">

                    <div className={classes.homeContainer}>
                        {logoVisible() &&
                            <img src={Logo} alt="logo" className={classes.logo} />}      

                        {getPageContent()}
                    </div>
                </Container>
            </div>
        </div>
    )
}