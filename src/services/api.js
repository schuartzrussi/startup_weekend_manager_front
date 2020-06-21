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
		console.log(error);
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
		console.log(error);
		return null;
	}
}

export async function getUsers() {
	try {
		const response = await api.get("/PRD/v1/user");
		return response;
	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function createPitch(name, oid_user) {
	try {
		const body = {name, oid_user}
		const response = await api.post('/PRD/v1/pitch', body);
		return response;
	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function getPitchs() {
	try {
		const response = await api.get('/PRD/v1/pitch')
		return response;
	} catch (error) {
		console.log(error)
		return null
	}
}
