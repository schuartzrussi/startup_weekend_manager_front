import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Loading from '../../../components/loading';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import ConfirmationDialog from '../../../components/confirmation_dialog';

import { getPhases, setPhase } from '../../../services/api';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    endContainer: {
        padding: theme.spacing(3),
    },
}));

export default function AdminHomePage() {
    const classes = useStyles();
    const [activePhase, setActivePhase] = useState(null);
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [phases, setPhases] = useState([]);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

    const onClickAdvancePhase = async () => {
        setLoadingVisible(true);
        const nextPhase = phases[activePhase.index + 1];
        const response = await setPhase(nextPhase.name);
        
        if (response.status !== 200) {
            // TODO tratar erro
        }

        setConfirmationDialogOpen(false);
        setActivePhase(nextPhase);
        setLoadingVisible(false);
    };

    const getPitPresentationStep = function() {
        return (
            <Link href="/admin/pits/cadastrar" target="_blank">
                Abrir Cadastro de Pits
            </Link>
        )
    }

    const getPitVotingStep = () => {
        return (
            <Typography h3>10 votos restantes.</Typography>
        )
    }

    const getStepContent = function(name) {
        switch (name) {
            case "NOT_STARTED":
            case "OPENING":
               return
            case "PITCH_TIME":
                return getPitPresentationStep();
            case "VOTE_PITCH":
                return getPitVotingStep();
            case "FINISHED":
                return (
                    <Paper square elevation={0} className={classes.endContainer}>
                        <Typography>Evento Finalizado</Typography>
                    </Paper>
                )
            default:
                return (
                    <h4>Step nao implementado</h4>
                )
        }
    }

    useEffect(() => {
        setLoadingVisible(true);
        const loadPhases = async function() {
            const response = await getPhases();

            if (response != null && response.status == 200) {
                let phasesArr = [];
                response.data.phases.forEach((value, index) => {
                    const phase = {
                        index,
                        ...value
                    }

                    phasesArr.push(phase)

                    if (response.data.current.name == value.name) {
                        setActivePhase(phase);
                    }
                })

                setPhases(phasesArr)
            } else {
                // TODO tratar error
            }
            setLoadingVisible(false);
        }

        loadPhases();
    }, []);

    return (
        <div className={classes.root}>
            <Loading
                visible={loadingVisible}
            />
            
            { phases.length > 0 &&
                <div>
                    <ConfirmationDialog
                        open={confirmationDialogOpen}
                        message={activePhase.name === "JUDGES_VOTE" ?
                            'Deseja realmente finalizar o evento? Esta operacao nao podera ser desfeita.' 
                            : 
                            'Deseja realmente avancar a fase? Esta operacao nao podera ser desfeita.'
                        }
                        on_accept={onClickAdvancePhase}
                        on_decline={() => setConfirmationDialogOpen(false)}
                    />

                    <Stepper activeStep={activePhase.index} orientation="vertical">
                        {phases.map((phase) => (
                            <Step key={phase.index}>
                                <StepLabel>{phase.description}</StepLabel>
                                
                                <StepContent>
                                    {getStepContent(phase.name)}
                                    {activePhase.name !== "FINISHED" &&
                                        <div className={classes.actionsContainer}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => setConfirmationDialogOpen(true)}
                                                className={classes.button}>
                                                {activePhase.name === "JUDGES_VOTE" ?
                                                    'Finalizar Evento' : 'Avancar'
                                                }
                                            </Button>
                                        </div>
                                    }       
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                </div>
            }
        </div>
    );
}