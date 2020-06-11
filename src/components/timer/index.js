import React, { useState } from 'react';
import useInterval from '../../hooks/use_interval';
import { Button } from '@material-ui/core';


export default function Timer({ seconds }) {
    const [isRunning, setIsRunning] = useState(false);
    const [currentTime, setCurrentTime] = useState(seconds * 1000);

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
        milliseconds = milliseconds < 10 ? `00${milliseconds}` : milliseconds < 100 ? `0${milliseconds}` : milliseconds;

        return (
            <h1>{minutes}:{seconds}.{milliseconds}</h1>
        )
    }

    useInterval(() => {
        if (currentTime <= 0 || currentTime - 10 <= 0) {
            onEnd()
        } else {
            setCurrentTime(currentTime - 10)
        }
    }, isRunning ? 10 : null);

    return (
        <div>
            {renderTimer()}

            {isRunning ?
                <Button onClick={() => stop()}>Parar</Button> :
                <Button onClick={() => start()}>Iniciar</Button>
            }

            <Button onClick={() => reset()}>Resetar</Button>
        </div>
    )
}