import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';


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

function getSteps() {
    return [
        'Evento nao iniciado', 
        'Abertura', 
        'Apresentacao pits',
        'Votacao pits',
        'Desenvolvimento',
        'Apresentacao final',
        'Votacao',
        'Encerramento'
    ];
}

export default function AdminHomePage() {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const getPitPresentationStep = function() {
        return (
            <Link href="/admin/pits/cadastrar" target="_blank">
                Abrir Cadastro de Pits
            </Link>
        )
    }

    const getStepContent = function(step) {
        switch (step) {
            case 0:
                return (
                    <h4>Tururu</h4>
                )
            case 1:
                return (
                    <h4>Tururu</h4>
                )
            case 2:
                return getPitPresentationStep()
            default:
                return (
                    <h4>Step nao implementado</h4>
                )
        }
    }

    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                            {getStepContent(index)}
                            <div className={classes.actionsContainer}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    className={classes.button}>
                                    {activeStep === steps.length - 1 ?
                                        'Finalizar Evento' : 'Avancar'
                                    }
                                </Button>
                            </div>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>

            {activeStep === steps.length && (
                <Paper square elevation={0} className={classes.endContainer}>
                    <Typography>Evento Finalizado</Typography>
                </Paper>
            )}
        </div>
    );
}