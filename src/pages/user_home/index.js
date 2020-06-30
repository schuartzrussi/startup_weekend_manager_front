import React, { useState, useContext, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Logo from '../../images/logo.png';
import { logout } from '../../services/api';
import { authContext } from '../../contexts/AuthContext';
import Timer from '../../components/timer';
import Loading from '../../components/loading';
import ConfirmationDialog from '../../components/confirmation_dialog';
import useInterval from '../../hooks/use_interval';
import { 
    getCurrentPhase, 
    getPitchs,
    votePitch } 
from '../../services/api';


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
    },

    voteList: {
        width: '100%',
    },
}));

export default function UserHomePage() {
    const classes = useStyles();
    const { setAuthData } = useContext(authContext);
    const [currentPhase, setCurrentPhase] = useState(null);
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [timerRunning, setTimerRunning] = useState(false);
    const [pitchs, setPitchs] = useState(null);
    const [teams, setTeams] = useState(null);
    const [pitchsSelected, setPitchsSelected] = useState([]);
    const [title, setTitle] = useState("Startup Weekend");
    const [availableVotes, setAvailableVotes] = useState(5);
    const [votesSent, setVotesSent] = useState(false);

    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [confirmationDialogText, setConfirmationDialogText] = useState(null);


    const loadPitchsSelecteds = function() {
        const selecteds = window.localStorage.getItem('pitchSelecteds');
        if (selecteds != null) {
            const parsed = JSON.parse(selecteds)
            setPitchsSelected(parsed);
            return parsed.length;
        }
        return 0;
    }

    useEffect(() => {
        const getPhase = async function() {
            setLoadingVisible(true);
            let response = await getCurrentPhase();
            if (response != null && response.status === 200) {
                const phase = response.data.name;

                if (phase === "VOTE_PITCH") {
                    response = await getPitchs();
                    const qtdVotes = loadPitchsSelecteds();
                    setAvailableVotes(5 - qtdVotes);
                    setTitle("Votos disponiveis: " + (5 - qtdVotes))
                    if (response != null && response.status === 200) {
                        setPitchs(response.data.items)
                    } else {
                        // TODO tratar erro
                    }

                    const alreadyVote = window.localStorage.getItem('votesSent');
                    if (alreadyVote != null && alreadyVote === 'true') {
                        setVotesSent(true);
                    }
                }

                setCurrentPhase(phase);
                setTimerRunning(true);
            } else {
                // TODO tratar error
            }
            
            setLoadingVisible(false);
        }
        getPhase();
    }, [])

    useInterval(() => {
        const getPhase = async function() {
            let response = await getCurrentPhase();
            if (response != null && response.status === 200) {
                const phase = response.data.name;
                if (phase != currentPhase) {
                    if (phase === "VOTE_PITCH" && pitchs == null) {
                        setLoadingVisible(true);
                        response = await getPitchs();
                        if (response != null && response.status === 200) {
                            setPitchs(response.data.items)
                        } else {
                            // TODO tratar error
                        }

                        const qtdVotes = loadPitchsSelecteds();
                        setAvailableVotes(5 - qtdVotes);
                        setTitle("Votos disponiveis: " + (5 - qtdVotes))
                        setLoadingVisible(false);

                        const alreadyVote = window.localStorage.getItem('votesSent');
                        console.log(alreadyVote)
                        if (alreadyVote != null && alreadyVote === 'true') {
                            setVotesSent(true);
                        }
                    } else {
                        if (title != "Startup Weekend") {
                            setTitle("Startup Weekend")
                        }
                    }
                    
                    setCurrentPhase(phase);
                }
            } else {
                // TODO tratar error
            }
        }
        getPhase();
    }, timerRunning ? 5000 : null);

    const isPitchSelected = function(oid) {
        for (let i = 0; i < pitchsSelected.length; i++) {
            if (pitchsSelected[i].oid === oid) {
                return true;
            }
        }
        return false;
    }

    const handleVoteToggle = (value) => () => {
        if (enabledVoteItem(value)) {
            let selecteds = [];
            let isSelected = false;

            for (let i = 0; i < pitchsSelected.length; i++) {
                if (pitchsSelected[i].oid != value.oid) {
                    selecteds.push(pitchsSelected[i]);
                } else {
                    isSelected = true;
                }
            }

            if (!isSelected) {
                setTitle("Votos disponiveis: " + (availableVotes - 1))
                setAvailableVotes(availableVotes - 1);
                selecteds.push(value);
            } else {
                setTitle("Votos disponiveis: " + (availableVotes + 1))
                setAvailableVotes(availableVotes + 1);
            }
            
            setPitchsSelected(selecteds);
            window.localStorage.setItem('pitchSelecteds', JSON.stringify(selecteds));
        }
    };

    const onConfirm = async function() {
        if (currentPhase === "VOTE_PITCH") {
            setLoadingVisible(true);
            for (let i = 0; i < pitchsSelected.length; i++) {
                const response = await votePitch(pitchsSelected[i]);
                console.log(response)
                if (response == null || response.status != 200) {
                    // TODO tratar error
                }
            }
            window.localStorage.setItem('votesSent', true);
            setVotesSent(true);
            setConfirmationDialogOpen(false);
            setLoadingVisible(false);
        }
    }

    const enabledVoteItem = function(item) {
        if (votesSent) {
            return false;
        }

        if (availableVotes === 0) {
            return isPitchSelected(item.oid)
        }
        return true;
    }

    const getPageContent = function() {
        const getEventStartDate = function() {
            let eventDate = new Date(2020, 5, 30, 10, 10, 10, 0);
            let now = new Date();

            if (eventDate > now) {
                return (eventDate.getTime() - now.getTime()) / 1000;
            }
            return 0;
        }
        
        if (currentPhase != null) {
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
                
                case "OPENING":
                    return (
                        <div className={classes.timerContainer}>
                            <Typography variant="h6">
                                O evento iniciou.
                                Va para o palco.
                            </Typography>
                        </div>
                    )

                case "PITCH_TIME":
                    return (
                        <div className={classes.timerContainer}>
                            <Typography variant="h6">
                                Os pits serao apresentados.
                                Va para o palco.
                            </Typography>
                        </div>
                    )

                case "VOTE_PITCH":
                    return (
                        <List className={classes.voteList}>
                            {pitchs.map((value) => {
                                return (
                                    <div>
                                        <ListItem disabled={!enabledVoteItem(value)} 
                                                  key={value.oid} 
                                                  role={undefined} 
                                                  dense 
                                                  onClick={handleVoteToggle(value)}>

                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={isPitchSelected(value.oid)}
                                                />
                                            </ListItemIcon>
                                            
                                            <ListItemText id={value.oid} primary={value.name} />
                                        </ListItem>
                                    <   Divider />
                                    </div>
                                )
                            })}
                        </List>
                    )

                case "ASSEMBLING_TEAMS":
                    return <h1>Ta indo</h1>
            }
        }
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        {title}
                    </Typography>

                    {currentPhase === "VOTE_PITCH" && availableVotes === 0 && !votesSent && (
                        <Button 
                            onClick={() => {
                                setConfirmationDialogOpen(true);
                                setConfirmationDialogText("Deseja enviar os votos? Essa operacao nao podera ser desfeita.")
                        }}>Confirmar</Button>
                    )}

                    <Button 
                        color="inherit"
                        onClick={() => {
                            const asyncLogout = async function() {
                                const response = await logout();
                                setAuthData(null);
                                window.localStorage.removeItem('pitchSelecteds');
                                window.localStorage.removeItem('votesSent');
                            }
                            asyncLogout();
                        }}>Sair</Button>
                </Toolbar>
            </AppBar>

            <ConfirmationDialog
                open={confirmationDialogOpen}
                message={confirmationDialogText}
                on_accept={onConfirm}
                on_decline={() => setConfirmationDialogOpen(false)}
            />

            <Loading
                visible={loadingVisible}
            />
            
            <div className={classes.content}>
                <div className={classes.toolbar} />
                <Container component="main" maxWidth="xs">
                    {(currentPhase != "VOTE_PITCH") &&
                        <div className={classes.homeContainer}>
                            <img src={Logo} alt="logo" className={classes.logo} />     
                            {getPageContent()}
                        </div>
                    }

                    {currentPhase === "VOTE_PITCH" && getPageContent()}
                </Container>
            </div>
        </div>
    )
}