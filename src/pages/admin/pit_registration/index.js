import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getUsers, createPitch } from '../../../services/api';
import Logo from '../../../images/logo.png';
import Copyright from '../../../components/copyright';
import Timer from '../../../components/timer';
import Loading from '../../../components/loading';
import Message from '../../../components/message'; 


const DialogTransition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});


const useStyles = makeStyles((theme) => ({
    timerContainer: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: "0.1rem solid",
        borderRadius: "20px",
        borderColor: "#ececec",
        backgroundColor: '#f7faf8',
        padding: '20px',
        paddingBottom: "60px"
    },

    logo: {
        height: "80px",
    },

    form: {
        width: '100%',
    },

    addButton: {
        position: "absolute",
        top: "318px"
    },

    userSelection: {
        marginTop: "20px"
    }
}));

export default function AdminPitRegistrationPage() {
    const classes = useStyles();
    const [users, setUsers] = useState([]);
    const [pitchDescription, setPitchDescription] = useState(undefined);
    const [selectedUser, setSelectedUser] = useState(undefined);
    const [openDialog, setOpenDialog] = useState(false);
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [message, setMessage] = useState({text: null, severity: null, duration: null});
    const [messageVisible, setMessageVisible] = useState(false);

    const showMessage = (text, severity, duration) => {
        setMessage({
            text: text,
            duration: duration, 
            severity: severity
        })
        setMessageVisible(true);
    }

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        
        if (validatePitchForm()) {
            setLoadingVisible(true);
            const response = await createPitch(pitchDescription, selectedUser.oid)

            setLoadingVisible(false);
            if (response != null && response.status == 201) {
                clearPitchData();
                setOpenDialog(false);
                showMessage(
                    "Pitch cadastrado com sucesso!", 
                    "success", 
                    4000
                )
            } else {
                showMessage(
                    "Ocorreu um erro. Tente novamente!", 
                    "error", 
                    4000
                )
            }
        }
    }

    const validatePitchForm = () => {
        if (pitchDescription === undefined ||
            pitchDescription === null ||
            pitchDescription.trim() === "") {
                return false;
        }

        if (selectedUser === undefined ||
            selectedUser === null) {
                return false;
        }
        return true;
    }

    const clearPitchData = () => {
        setPitchDescription(undefined);
        setSelectedUser(undefined);
    }

    useEffect(() => {
        async function loadUsers() {
            const response = await getUsers();
            if (response.status === 200) {
                setUsers(response.data.items)
            } else {
                // TODO tratar error
            }
        }

        loadUsers();
    }, [])

    return (
        <div>
            <Message 
                visible={messageVisible}
                severity={message.severity}
                duration={message.duration}
                message={message.text}
                handleClose={(event, reason) => {
                    if (reason === 'clickaway') {
                        return;
                    }
                    setMessageVisible(false);
                }}
            />

            <Loading
                visible={loadingVisible}
            />

            <Dialog
                open={openDialog}
                aria-labelledby="form-dialog-title"
                TransitionComponent={DialogTransition}
                maxWidth="md">

                <DialogTitle id="form-dialog-title">Cadastrar Pit</DialogTitle>
                
                <form noValidate onSubmit={handleSubmit}>
                    <DialogContent dividers>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="description"
                            label="Descrição"
                            type="text"
                            onChange={e => setPitchDescription(e.target.value)}
                            fullWidth
                        />

                        <Autocomplete
                            id="user"
                            options={users}
                            className={classes.userSelection}
                            getOptionLabel={(option) => option.name}
                            style={{ width: 300 }}
                            onChange={(event, value) => {
                                setSelectedUser(value)
                            }}
                            renderInput={(params) => 
                                <TextField {...params} label="Usuário" variant="outlined" />}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color="primary"
                            onClick={() => {
                                setOpenDialog(false);
                                clearPitchData();
                            }}>
                            Cancelar
                        </Button>
                        <Button 
                            color="primary"
                            disabled={!validatePitchForm()}
                            type="submit">
                            Salvar
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Container component="main" maxWidth="xs">
                <CssBaseline />

                <div className={classes.timerContainer}>
                    <img src={Logo} alt="logo" className={classes.logo} />

                    <Timer
                        seconds={60}
                    />

                    <Fab
                        color="primary"
                        aria-label="add"
                        className={classes.addButton}
                        onClick={() => {
                            setOpenDialog(true);
                        }}>

                        <AddIcon />
                    </Fab>
                </div>

                <Box mt={8}>
                    <Copyright />
                </Box>
            </Container>
        </div>
    );
}