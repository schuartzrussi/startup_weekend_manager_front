import React, { useState } from 'react';
import SendCodeForm from './send_code_form';
import VerifyCodeForm from './verify_code_form';


export default function LoginForm() {
    const [email, setEmail] = useState(undefined);

    const onCodeSent = (email) => {
        setEmail(email);
    }

    return (
        <div>
            {email != undefined ?
                <VerifyCodeForm 
                    email={email}
                    onCodeSent={onCodeSent}
                    onChangeEmail={() => {
                        setEmail(undefined);
                    }}
                /> 
                :
                <SendCodeForm 
                    onCodeSent={onCodeSent}
                />
            }
        </div>
    )
}