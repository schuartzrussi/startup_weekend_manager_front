import React, { useState } from 'react';
import SendCodeForm from './send_code_form';
import VerifyCodeForm from './verify_code_form';
import Message from '../../components/message';
import Loading from '../../components/loading';


export default function SignInForm({ history }) {
    const [email, setEmail] = useState(undefined);
    const [message, setMessage] = useState({text: null, severity: null, duration: null});
    const [messageVisible, setMessageVisible] = useState(false);
    const [loadingVisible, setLoadingVisible] = useState(false);

    const onCodeSent = (email) => {
        setEmail(email);
    }

    const showMessage = (text, severity, duration) => {
        setMessage({
            text: text,
            duration: duration, 
            severity: severity
        })
        setMessageVisible(true);
    }

    const changeLoadingState = (visible) => {
        setLoadingVisible(visible);
    }

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

            {email != undefined ?
                <VerifyCodeForm 
                    email={email}
                    onCodeSent={onCodeSent}
                    onChangeEmail={() => {
                        setEmail(undefined);
                    }}
                    history={history}
                    showMessage={showMessage}
                    changeLoadingState={changeLoadingState}
                /> 
                :
                <SendCodeForm 
                    onCodeSent={onCodeSent}
                    showMessage={showMessage}
                    changeLoadingState={changeLoadingState}
                />
            }
        </div>
    )
}