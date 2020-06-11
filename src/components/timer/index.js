import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useInterval from '../../hooks/use_interval';
import { Button } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    container: {
        textAlign: "center"
    },

    text: {
        fontSize: "60px"
    }
}));

export default function Timer({ seconds }) {
    const [isRunning, setIsRunning] = useState(false);
    const [currentTime, setCurrentTime] = useState(seconds * 1000);
    const classes = useStyles();

    const start = function() {
        setIsRunning(true);
    }

    const stop = function() {
        setIsRunning(false);
    }

    const reset = function() {
        setCurrentTime(seconds * 1000);
    }

    const onEnd = function() {
        setCurrentTime(0);
        setIsRunning(false);
    }

    const renderTimer = function() {
        let milliseconds = parseInt((currentTime%1000));
        let seconds = parseInt((currentTime/1000)%60);
        let minutes = parseInt((currentTime/(1000*60))%60);

        seconds = seconds < 10 ? `0${seconds}` : seconds
        minutes = minutes < 10 ? `0${minutes}` : minutes
        milliseconds = milliseconds < 10 ? `0${milliseconds}` : milliseconds
        milliseconds = milliseconds.toString().substring(0, 2);

        return (
            <div className={classes.text}>{minutes}:{seconds}:{milliseconds}</div>
        )
    }

    useInterval(() => {
        if (currentTime <= 0 || currentTime - 20 <= 0) {
            onEnd()
        } else {
            setCurrentTime(currentTime - 20)
        }
    }, isRunning ? 20 : null);

    return (
        <div className={classes.container}>
            {renderTimer()}

            {isRunning ?
                <Button onClick={() => stop()}>Parar</Button> :
                <Button onClick={() => start()}>Iniciar</Button>
            }

            <Button onClick={() => reset()}>Resetar</Button>
        </div>
    )
}