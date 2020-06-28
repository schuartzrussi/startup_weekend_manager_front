import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { authContext } from '../contexts/AuthContext';
import Loading from '../components/loading';


const UserRoute = ({ component: Component, step, ...rest }) => {
    const { auth } = useContext(authContext);
    const { loading } = auth;

    if (loading) {
        return (
            <Route
                {...rest}
                render={() => {
                    return <Loading visible={true} />
                }}
            />
        );
    }

    return (
        <Route
            {...rest}
            render={routeProps => {
                return auth.data && !auth.data.admin ? (
                    <Component {...routeProps} />
                ) : auth.data ? 
                    (<Redirect to="/admin" />) : 
                    (<Redirect to="/entrar" />
                );
            }}
        />
    );
};

export default AdminPresentationRoute;