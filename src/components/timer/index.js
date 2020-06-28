import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useInterval from '../../hooks/use_interval';
import { Button } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    container: {
        textAlign: "center"
    },

    textBig: {
        display: "flex",
        fontSize: "60px"
    },

    textMedium: {
        display: "flex",
        fontSize: "40px"
    },

    textSmall: {
        display: "flex",
        fontSize: "30px"
    },

    legend: {
        fontSize: "10px"
    },

    timeWithLegendSeparator: {
        display: "inline-block"
    },

    legendContainer: {
        display: "inline-block",
    },
}));

export default function Timer({ 
        seconds, 
        show_actions=true, 
        auto_start=false,
        show_legends=false }) {

    const [isRunning, setIsRunning] = useState(auto_start);
    const [currentTime, setCurrentTime] = useState(0);
    const classes = useStyles();

    useEffect(() => {
        setCurrentTime(seconds * 1000)
    }, [])

    const start = function() {
        setIsRunning(true);
    }

    const stop = function() {
        setIsRunning(false);
    }

    const reset = function() {
        setCurrentTime(seconds * 1000)
    }

    const valueWithLegend = function(value, legend) {
        return (
            <div className={classes.legendContainer}>
                <div>{value}</div>
                <div className={classes.legend}>{legend}</div>
            </div>
        )
    }

    const onEnd = function() {
        setCurrentTime(0);
        setIsRunning(false);
    }

    const renderTimer = function() {
        let milliseconds = parseInt((currentTime%1000));
        
        let seconds = parseInt(Math.floor(currentTime / 1000));
        let minutes = parseInt(Math.floor(seconds / 60));
        let hours = parseInt(Math.floor(minutes / 60));
        let days = parseInt(Math.floor(hours / 24));

        seconds = parseInt(seconds % 60);
        minutes = parseInt(minutes % 60);
        hours = parseInt(hours % 24);

        seconds = seconds < 10 ? `0${seconds}` : seconds
        minutes = minutes < 10 ? `0${minutes}` : minutes
        milliseconds = milliseconds < 10 ? `0${milliseconds}` : milliseconds
        milliseconds = milliseconds.toString().substring(0, 2);

        if (days > 0) {
            days = days < 10 ? `0${days}` : days
            hours = hours < 10 ? `0${hours}` : hours

            if (show_legends) {
                return (
                    <div className={classes.textSmall}>
                        {valueWithLegend(days, "dias")}
                        <div className={classes.timeWithLegendSeparator}>:</div>
                        {valueWithLegend(hours, "hrs")}
                        <div className={classes.timeWithLegendSeparator}>:</div>
                        {valueWithLegend(minutes, "min")}
                        <div className={classes.timeWithLegendSeparator}>:</div>
                        {valueWithLegend(seconds, "seg")}
                        <div className={classes.timeWithLegendSeparator}>:</div>
                        {valueWithLegend(milliseconds, "ms")}
                    </div>
                )
            }

            return (
                <div className={classes.textSmall}>
                    {days}:{hours}:{minutes}:{seconds}:{milliseconds}
                </div>
            )
        } else if (hours > 0) {
            hours = hours < 10 ? `0${hours}` : hours
            
            if (show_legends) {
                return (
                    <div className={classes.textMedium}>
                        {valueWithLegend(hours, "hrs")}
                        <div className={classes.timeWithLegendSeparator}>:</div>
                        {valueWithLegend(minutes, "min")}
                        <div className={classes.timeWithLegendSeparator}>:</div>
                        {valueWithLegend(seconds, "seg")}
                        <div className={classes.timeWithLegendSeparator}>:</div>
                        {valueWithLegend(milliseconds, "ms")}
                    </div>
                )
            } 

            return (
                <div className={classes.textMedium}>
                    {hours}:{minutes}:{seconds}:{milliseconds}
                </div>
            )
        }

        if (show_legends) {
            return (
                <div className={classes.textBig}>
                    {valueWithLegend(minutes, "min")}
                    <div className={classes.timeWithLegendSeparator}>:</div>
                    {valueWithLegend(seconds, "seg")}
                    <div className={classes.timeWithLegendSeparator}>:</div>
                    {valueWithLegend(milliseconds, "ms")}
                </div>
            )
        }

        return (
            <div className={classes.textBig}>{minutes}:{seconds}:{milliseconds}</div>
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

            {show_actions && (<div>
                {isRunning ?
                    <Button onClick={() => stop()}>Parar</Button> :
                    <Button onClick={() => start()}>Iniciar</Button>
                }

                <Button onClick={() => reset()}>Resetar</Button>
            </div>)}
        </div>
    )
}