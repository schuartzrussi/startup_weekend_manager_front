import React, { useState, useContext, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
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
    votePitch,
    getCurrentUser,
    getTeams,
    createTeamRequest,
    getTeamRequests,
    confirmRequest
} from '../../services/api';


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

    teamDiv: {
        textAlign: 'center',
    }
}));

export default function UserHomePage() {
    const classes = useStyles();
    const { setAuthData } = useContext(authContext);
    const [currentPhase, setCurrentPhase] = useState(null);
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [timerRunning, setTimerRunning] = useState(false);
    const [pitchs, setPitchs] = useState(null);
    const [teams, setTeams] = useState([]);
    const [teamsRequest, setTeamsRequests] = useState([]);
    const [pitchsSelected, setPitchsSelected] = useState([]);
    const [availableVotes, setAvailableVotes] = useState(5);
    const [requestsSelected, setRequestsSelected] = useState([]);
    const [votesSent, setVotesSent] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [confirmationDialogText, setConfirmationDialogText] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);


    const loadPitchsSelecteds = function () {
        const selecteds = window.localStorage.getItem('pitchSelecteds');
        if (selecteds != null) {
            const parsed = JSON.parse(selecteds)
            setPitchsSelected(parsed);
            return parsed.length;
        }
        return 0;
    }

    const isTeamLeader = function (user) {
        if (user == null || user["team"] == null) {
            return false;
        }

        return user["team"]["oid_leader"] === user["oid"];
    }

    const hasTeam = function (user) {
        if (user == null || user["team"] == null) {
            return false;
        }

        return user["team"] != null && user["team"]["oid"] != null;
    }

    const getTitle = function () {
        switch (currentPhase) {
            case "VOTE_PITCH":
                return "Votos disponiveis: " + availableVotes
            case "ASSEMBLING_TEAMS":
                if (isTeamLeader(currentUser)) {
                    return "Montar Time"
                }
                return "Escolha seu time"
            default:
                return "Startup Weekend"
        }
    }

    const loadTeams = async function () {
        const response = await getTeams();
        setLoadingVisible(false);
        if (response.status === 200) {
            let selecteds = window.localStorage.getItem('teamsSelected')
            if (selecteds != null) {
                selecteds = JSON.parse(selecteds);
            }

            let teams = [];
            for (let i = 0; i < response.data.items.length; i++) {
                const team = response.data.items[i];
                let valid = true;

                if (selecteds != null) {
                    for (let j = 0; j < selecteds.length; j++) {
                        if (selecteds[j].oid === team.oid) {
                            valid = false;
                            break;
                        }
                    }
                }

                if (valid) {
                    teams.push(team);
                }
            }

            setTeams(teams);
        } else {
            // TODO tratar erro
        }
    }

    const loadTeamsRequests = async function () {
        const response = await getTeamRequests();
        if (response.status === 200) {
            let requests = []
            for (let i = 0; i < response.data.length; i++) {
                let request = response.data[i];
                if (request.status == "PENDING") {
                    requests.push(request);
                }
            }
            setTeamsRequests(requests)
        }
    }

    useEffect(() => {
        const getPhase = async function () {
            setLoadingVisible(true);
            let response = await getCurrentPhase();
            if (response != null && response.status === 200) {
                const phase = response.data.name;

                response = await getCurrentUser();
                const user = response.data;
                setCurrentUser(user)

                if (phase === "VOTE_PITCH") {
                    response = await getPitchs();
                    const qtdVotes = loadPitchsSelecteds();
                    setAvailableVotes(5 - qtdVotes);

                    if (response != null && response.status === 200) {
                        setPitchs(response.data.items)
                    } else {
                        // TODO tratar erro
                    }

                    const alreadyVote = window.localStorage.getItem('votesSent');
                    if (alreadyVote != null && alreadyVote === 'true') {
                        setVotesSent(true);
                    }
                } else if (phase === "ASSEMBLING_TEAMS") {
                    if (isTeamLeader(user)) {
                        await loadTeamsRequests();
                    } else {
                        await loadTeams();
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
        const getPhase = async function () {
            let response = await getCurrentPhase();
            if (response != null && response.status === 200) {
                const phase = response.data.name;

                response = await getCurrentUser();
                const user = response.data;
                setCurrentUser(user)

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
                        setLoadingVisible(false);

                        const alreadyVote = window.localStorage.getItem('votesSent');
                        if (alreadyVote != null && alreadyVote === 'true') {
                            setVotesSent(true);
                        }
                    } else if (phase === "ASSEMBLING_TEAMS") {
                        if (user != null) {
                            if (isTeamLeader(user)) {
                                await loadTeamsRequests();
                            } else {
                                await loadTeams();
                            }
                        } else {
                            // TODO tratar erro
                        }
                    }

                    setCurrentPhase(phase);
                } else {
                    if (phase === "ASSEMBLING_TEAMS") {
                        if (isTeamLeader(currentUser)) {
                            await loadTeamsRequests();
                        }
                    }
                }
            } else {
                // TODO tratar error
            }
        }
        getPhase();
    }, timerRunning ? 5000 : null);

    const isPitchSelected = function (oid) {
        for (let i = 0; i < pitchsSelected.length; i++) {
            if (pitchsSelected[i].oid === oid) {
                return true;
            }
        }
        return false;
    }

    const isRequestSelected = function (oid) {
        for (let i = 0; i < requestsSelected.length; i++) {
            if (requestsSelected[i].oid === oid) {
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
                setAvailableVotes(availableVotes - 1);
                selecteds.push(value);
            } else {
                setAvailableVotes(availableVotes + 1);
            }

            setPitchsSelected(selecteds);
            window.localStorage.setItem('pitchSelecteds', JSON.stringify(selecteds));
        }
    };

    const handleRequestToggle = (value) => () => {
        let selecteds = []
        let add = true;
        for (let i = 0; i < requestsSelected.length; i++) {
            let selected = requestsSelected[i];
            if (selected.oid != value.oid) {
                selecteds.push(selected);
            } else {
                add = false;
            }
        }

        if (add) {
            selecteds.push(value)
        }

        setRequestsSelected(selecteds)
    }

    const onConfirm = async function () {
        if (currentPhase === "VOTE_PITCH") {
            setLoadingVisible(true);
            for (let i = 0; i < pitchsSelected.length; i++) {
                const response = await votePitch(pitchsSelected[i]);
                if (response == null || response.status != 200) {
                    // TODO tratar error
                }
            }
            window.localStorage.setItem('votesSent', true);
            setVotesSent(true);
            setLoadingVisible(false);
        } else if (currentPhase === "ASSEMBLING_TEAMS") {
            setLoadingVisible(true);

            for (let i = 0; i < requestsSelected.length; i++) {
                const response = await confirmRequest(requestsSelected[i].oid);
                if (response == null || response.status != 200) {
                    // TODO tratar error
                }
            }

            await loadTeamsRequests();
            setRequestsSelected([]);

            setLoadingVisible(false);
        }

        setConfirmationDialogOpen(false);
    }

    const enabledVoteItem = function (item) {
        if (votesSent) {
            return false;
        }

        if (availableVotes === 0) {
            return isPitchSelected(item.oid)
        }
        return true;
    }

    const onSelectTeam = async function (team) {
        setLoadingVisible(true);
        let selecteds = window.localStorage.getItem('teamsSelected')

        const response = await createTeamRequest(team.oid);
        if (response.status != 200) {
            // TODO tratar error
        }

        if (selecteds != null) {
            selecteds = JSON.parse(selecteds);
            selecteds.push(team);
            window.localStorage.setItem('teamsSelected', JSON.stringify(selecteds));
        } else {
            window.localStorage.setItem('teamsSelected', JSON.stringify([team]));
        }

        let newTeams = [];
        for (let i = 0; i < teams.length; i++) {
            if (teams[i].oid != team.oid) {
                newTeams.push(teams[i]);
            }
        }

        setTeams(newTeams);
        setLoadingVisible(false);
    }

    const getPageContent = function () {
        const getEventStartDate = function () {
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
                    if (isTeamLeader(currentUser)) {
                        if (teamsRequest.length === 0) {
                            return (
                                <div className={classes.timerContainer}>
                                    <Typography variant="h6">
                                        Aguarde as pessoas pedirem para entrar no seu time.
                                    </Typography>
                                </div>
                            )
                        }

                        return (
                            <List className={classes.voteList}>
                                {teamsRequest.map((value) => {
                                    return (
                                        <div>
                                            <ListItem
                                                key={value.oid}
                                                role={undefined}
                                                dense
                                                onClick={handleRequestToggle(value)}>

                                                <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={isRequestSelected(value.oid)}
                                                    />
                                                </ListItemIcon>

                                                <ListItemText id={value.oid} primary={value.oid_user} />
                                            </ListItem>
                                            <Divider />
                                        </div>
                                    )
                                })}
                            </List>
                        )
                    }

                    if (hasTeam(currentUser)) {
                        return (
                            <div className={classes.timerContainer}>
                                <Typography variant="h6">
                                    Voce foi selecionado pelo time {currentUser["team"]["name"]}.
                                </Typography>
                            </div>
                        )
                    }

                    if (teams.length === 0) {
                        return (
                            <div className={classes.timerContainer}>
                                <Typography variant="h6">
                                    Aguarde ser selecionado por um time.
                                </Typography>
                            </div>
                        )
                    }

                    return (
                        <List className={classes.voteList}>
                            {teams.map((value) => {
                                return (
                                    <div>
                                        <ListItem
                                            key={value.oid}
                                            role={undefined}
                                            dense>
                                            <ListItemText id={value.oid} primary={value.name} />

                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="comments"
                                                    onClick={() => {
                                                        onSelectTeam(value)
                                                    }}>
                                                    <Add />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider />
                                    </div>
                                )
                            })}
                        </List>
                    )

                case "WORK_HARD":
                    return (
                        <div className={classes.teamDiv}>
                            <Typography variant="h6">
                                {currentUser.team.name}
                            </Typography>

                            <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableBody>
                                        {currentUser.team.members.map((row) => (
                                            <TableRow key={row}>
                                                <TableCell component="th" scope="row">
                                                    {row}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    )

            }
        }
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        {getTitle()}
                    </Typography>

                    {(currentPhase === "VOTE_PITCH" && availableVotes === 0 && !votesSent) && (
                        <Button
                            onClick={() => {
                                setConfirmationDialogOpen(true);
                                setConfirmationDialogText("Deseja enviar os votos? Essa operacao nao podera ser desfeita.")
                            }}>Confirmar</Button>
                    )}

                    {(currentPhase === "ASSEMBLING_TEAMS" && requestsSelected.length > 0) && (
                        <Button
                            onClick={() => {
                                setConfirmationDialogOpen(true);
                                setConfirmationDialogText("Deseja aceitar os usuarios? Essa operacao nao podera ser desfeita.")
                            }}>Confirmar</Button>
                    )}

                    <Button
                        color="inherit"
                        onClick={() => {
                            const asyncLogout = async function () {
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
                    {(currentPhase != "VOTE_PITCH" &&
                        (currentPhase != "ASSEMBLING_TEAMS" ||
                            (!isTeamLeader(currentUser) && (hasTeam(currentUser) || teams.length === 0)) ||
                            (isTeamLeader(currentUser) && teamsRequest.length === 0)))
                        &&
                        <div className={classes.homeContainer}>
                            <img src={Logo} alt="logo" className={classes.logo} />
                            {getPageContent()}
                        </div>
                    }

                    {(currentPhase === "VOTE_PITCH" ||
                        (currentPhase === "ASSEMBLING_TEAMS" &&
                            (!isTeamLeader(currentUser) && !hasTeam(currentUser) && teams.length > 0) ||
                            (isTeamLeader(currentUser) && teamsRequest.length > 0)))
                        && getPageContent()}
                </Container>
            </div>
        </div>
    )
}