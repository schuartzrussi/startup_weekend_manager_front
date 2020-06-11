import React, { useState } from 'react';
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
import Logo from '../../../images/logo.png';
import Copyright from '../../../components/copyright';
import Timer from '../../../components/timer';


const DialogTransition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});


const users = [
    { "name": "Ruan Schuartz Russi" },
    { "name": "Ariel Adonai" },
    { "name": "Jardel Angelo" },
    { "name": "Paula Socorro" },
    { "name": "Crislaine Recriski" },
    { "name": "Paola Rampelloti" },
    { "name": "Sarah Cadori" },
    { "name": "Viviane Camargo" },
]

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
    const [openDialog, setOpenDialog] = useState(false);

    return (
        <div>
            <Dialog
                open={openDialog}
                aria-labelledby="form-dialog-title"
                TransitionComponent={DialogTransition}
                maxWidth="md">

                <DialogTitle id="form-dialog-title">Cadastrar Pit</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="description"
                        label="Descrição"
                        type="text"
                        fullWidth
                    />

                    <Autocomplete
                        id="user"
                        options={users}
                        className={classes.userSelection}
                        getOptionLabel={(option) => option.name}
                        style={{ width: 300 }}
                        renderInput={(params) => 
                            <TextField {...params} label="Usuário" variant="outlined" />}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() => setOpenDialog(false)}>
                        Cancelar
                    </Button>
                    <Button color="primary">
                        Salvar
                    </Button>
                </DialogActions>
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