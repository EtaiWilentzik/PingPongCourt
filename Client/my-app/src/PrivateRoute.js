import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ children }) => {
    const { isLoggedIn } = useContext(AuthContext);
    return isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
