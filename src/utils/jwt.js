import jwt_decode from 'jwt-decode';


export function decodeJWT(token) {
    return jwt_decode(token)
}