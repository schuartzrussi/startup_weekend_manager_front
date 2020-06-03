import axios from 'axios';


const api = axios.create({
    withCredentials: true,
    baseURL: 'https://e7782e2l83.execute-api.us-east-1.amazonaws.com',
});

export async function sendOTP(email) {
    try {
        return await api.post('/PRD/v1/otp/request', {
            email
        });
    } catch (error) {
        return null;
    }
}

export async function verifyOTP(code) {
    try {
        const body = {
            "otp": code
        }

        const response = await api.post('/PRD/v1/otp/confirm', body);
        return response;
    } catch (error) {
        return null;
    } 
}