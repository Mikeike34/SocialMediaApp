import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');

    //if there is no token, redirect to the login page so nobody can type in a route in the url and get to these pages without being logged in.
    if(!token){
        return <Navigate to ='/' replace />;
    }
    //if the token does exist, allow access to the protected route
    return <Outlet />;
};

export default ProtectedRoute;