import React, { createContext, useState, useEffect } from 'react';
import { decodeJWT } from '../utils/jwt';


export const authContext = createContext({});

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ loading: true, data: null });

  const setAuthData = (jwt) => {
    if (jwt) {
      const decoded = decodeJWT(jwt);
      setAuth({data: {
        id: decoded["user"]["oid"],
        name: decoded["user"]["name"],
        email: decoded["user"]["email"],
        admin: decoded["user"]["type"] === "ADMIN"
      }});
    } else {
      setAuth({loading: false, data: null});
    }
  };

  useEffect(() => {
    setAuth({ loading: false, data: JSON.parse(window.localStorage.getItem('authData'))});
  }, []);

  useEffect(() => {
    if (auth.data != null) {
      window.localStorage.setItem('authData', JSON.stringify(auth.data));
    } else {
      window.localStorage.removeItem('authData');
    }
  }, [auth.data]);

  return (
    <authContext.Provider value={{ auth, setAuthData }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
