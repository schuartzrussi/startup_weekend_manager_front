import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { authContext } from '../contexts/AuthContext';


const PublicRoute = ({ component: Component, ...rest }) => {
    const { auth } = useContext(authContext);

    return (
        <Route
            {...rest}
            render={routeProps => {
                return auth.data ? (
                    <Redirect to="/admin" />
                ) : (
                    <Component {...routeProps} />
                );
            }}
        />
    );
};

export default PublicRoute;