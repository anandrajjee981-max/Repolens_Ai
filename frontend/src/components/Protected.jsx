import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom'; // 💡 Added Navigate here

const Protected = ({ children }) => { // 💡 Added curly braces here
    const loading = useSelector(state => state.auth.loading)
    const authenticated = useSelector(state => state.auth.isAuthenticated)
    const navigate = useNavigate()

    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    return children
}

export default Protected