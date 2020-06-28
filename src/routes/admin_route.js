import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { authContext } from '../contexts/AuthContext';
import Loading from '../components/loading';
import AdminTemplate from '../components/admin_template';


const AdminRoute = ({ component: Component, title, ...rest }) => {
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
                return auth.data && auth.data.admin ? (
                    <AdminTemplate 
                        title={title} 
                        routeProps={routeProps} 
                        Component={Component} 
                    />
                ) : auth.data ? 
                    (<Redirect to="/" />) : 
                    (<Redirect to="/entrar" />
                );
            }}
        />
    );
};

export default AdminRoute;