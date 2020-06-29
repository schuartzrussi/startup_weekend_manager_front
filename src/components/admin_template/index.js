import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import HomeTwoToneIcon from '@material-ui/icons/HomeTwoTone';
import PersonOutlineTwoToneIcon from '@material-ui/icons/PersonOutlineTwoTone';
import EmojiObjectsTwoToneIcon from '@material-ui/icons/EmojiObjectsTwoTone';
import GroupTwoToneIcon from '@material-ui/icons/GroupTwoTone';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Logo from '../../images/logo.png';
import { logout } from '../../services/api';
import { authContext } from '../../contexts/AuthContext';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },

    appBar: {
        [theme.breakpoints.up('sm')]: {
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: drawerWidth,
        },
    },

    drawer: {
        [theme.breakpoints.up('sm')]: {
          width: drawerWidth,
          flexShrink: 0,
        },
    },

    drawerPaper: {
        width: drawerWidth,
    },

    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },

    toolbar: theme.mixins.toolbar,

    logo_container: {
        textAlign: "center"
    },

    title: {
        flexGrow: 1,
    },

    logo: {
        height: "60px",
        cursor: "pointer"
    },

    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));


export default function AdminTemplate({ title, window, routeProps, Component }) {
    const theme = useTheme();
    const history = useHistory();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const classes = useStyles();
    const { setAuthData } = useContext(authContext);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const navigate = (page) => {
        history.push(page);

        if (mobileOpen) {
            handleDrawerToggle()
        }
    }

    const drawer = (
        <div>
            <div className={classes.toolbar, classes.logo_container}>
                <img 
                    src={Logo} 
                    alt="logo" 
                    className={classes.logo} 
                    onClick={() => navigate("/admin")}
                />
            </div>

            <Divider />
            <List>
                <ListItem button key="home" onClick={() => navigate("/admin")}>
                    <ListItemIcon><HomeTwoToneIcon /></ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>

                <ListItem button key="pits" onClick={() => navigate("/admin/pits")}>
                    <ListItemIcon><EmojiObjectsTwoToneIcon /></ListItemIcon>
                    <ListItemText primary="Pits" />
                </ListItem>

                <ListItem button key="users" onClick={() => navigate("/admin/usuarios")}>
                    <ListItemIcon><PersonOutlineTwoToneIcon /></ListItemIcon>
                    <ListItemText primary="Usuarios" />
                </ListItem>

                <ListItem button key="teams" onClick={() => navigate("/admin/times")}>
                    <ListItemIcon><GroupTwoToneIcon /></ListItemIcon>
                    <ListItemText primary="Times" />
                </ListItem>
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton 
                        edge="start" 
                        className={classes.menuButton} 
                        color="inherit" 
                        aria-label="menu"
                        onClick={handleDrawerToggle}>

                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {title}
                    </Typography>
                    <Button 
                        color="inherit"
                        onClick={() => {
                            const asyncLogout = async function() {
                                const response = await logout();
                                setAuthData(null);
                            }

                            asyncLogout();
                        }}>Sair</Button>
                </Toolbar>
            </AppBar>

            <nav className={classes.drawer}>
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true,
                        }}>
                        {drawer}
                    </Drawer>
                </Hidden>
                
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open>
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Component {...routeProps} />
            </main>
        </div>
    )
}