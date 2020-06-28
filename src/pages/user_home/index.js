import React, { useState, useContext } from 'react';
import { useHistory } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { logout } from '../../services/api';
import { authContext } from '../../contexts/AuthContext';


const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },

    title: {
        flexGrow: 1,
    }
}));

export default function UserHomePage() {
    const classes = useStyles();
    const { setAuthData } = useContext(authContext);

    return (
        <div>
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
        </div>
    )
}