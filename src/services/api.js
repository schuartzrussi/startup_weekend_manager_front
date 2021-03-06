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

export async function getTeams() {
	try {
		const response = await api.get('/PRD/v1/team')
		return response;
	} catch (error) {
		console.log(error)
		return null
	}
}

export async function getPhases() {
	try {
		const response = await api.get('/PRD/v1/phase')
		return response;
	} catch (error) {
		console.log(error)
		return null
	}
}

export async function getCurrentPhase() {
	try {
		const response = await api.get('/PRD/v1/phase/current')
		return response;
	} catch (error) {
		console.log(error)
		return null
	}
}

export async function logout() {
	try {
		const response = await api.post('/PRD/v1/logout');
		return response;
	} catch (error) {
		console.log(error)
		return null
	}
}

export async function setPhase(phase) {
	try {
		const body = {
			"phase": phase
		}

		const response = await api.post('/PRD/v1/phase', body);
		return response;
	} catch (error) {
		console.log(error)
		return null
	}
}

export async function votePitch(pitch) {
	try {
		const response = await api.post(`/PRD/v1/pitch/${pitch.oid}/vote`);
		return response;
	} catch (error) {
		console.log(error)
		return null
	} 
}

export async function getCurrentUser() {
	try {
		const response = await api.get("/PRD/v1/user/current");
		return response;
	} catch (error) {
		console.log(error)
		return null
	}
}

export async function createTeamRequest(oid_team) {
	try {
		const body = {
			oid_team
		}

		const response = await api.post('/PRD/v1/team/request', body);
		return response;
	} catch (error) {
		console.log(error)
		return null
	}
}

export async function getTeamRequests() {
	try {
		const response = await api.get('/PRD/v1/team/request')
		return response;
	} catch (error) {
		console.log(error)
		return null
	}
}

export async function confirmRequest(request_oid) {
	try {
		const response = await api.post(`/PRD/v1/team/request/${request_oid}/confirm`);
		return response;
	} catch (error) {
		console.log(error)
		return null
	}
}