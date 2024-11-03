import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const verifyAuthentication = async (role) => {
    const verifyRequest = await fetch('http://localhost:8080/api/auth/verify', {
        method: 'GET',
        credentials: 'include',
    });
    if (verifyRequest.status === 200) {
        // If there is a valid token, check whether the user is a Staff or Customer
        const verifyResponse = await verifyRequest.json();
        if (verifyResponse.role === role) {
            return true;
        }
    }

    return false;
};

// role: customer, staff
export default function ProtectedRoute({ Component, role }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthenticationStatus = async () => {
            const authStatus = await verifyAuthentication(role);
            setIsAuthenticated(authStatus);
            setIsLoading(false);
        }

        checkAuthenticationStatus();
    }, []);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/login");
        }
    }, [isLoading]);

    if (isLoading) return <div>Loading...</div>; // TODO: Improve

    return isAuthenticated && <Component />;
}