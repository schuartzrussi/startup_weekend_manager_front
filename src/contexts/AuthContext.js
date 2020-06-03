import React, { createContext, useState, useEffect } from 'react';
import { decodeJWT } from '../utils/jwt';


export const authContext = createContext({});

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ loading: true, data: null });

  const setAuthData = (jwt) => {
    const decoded = decodeJWT(jwt);

    setAuth({data: {
      id: decoded["user"]["oid"],
      name: decoded["user"]["name"],
      email: decoded["user"]["email"]
    }});
  };

  useEffect(() => {
    setAuth({ loading: false, data: JSON.parse(window.localStorage.getItem('authData'))});
  }, []);

  useEffect(() => {
    window.localStorage.setItem('authData', JSON.stringify(auth.data));
  }, [auth.data]);

  return (
    <authContext.Provider value={{ auth, setAuthData }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
