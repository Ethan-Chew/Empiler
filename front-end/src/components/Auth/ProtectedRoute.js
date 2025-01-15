import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const verifyAuthentication = async (role) => {
    const verifyRequest = await fetch('http://localhost:8080/api/auth/verify', {
        method: 'GET',
        credentials: 'include',
    });
    if (verifyRequest.status === 200) {
        // If there is a valid token, check whether the user is a Staff or Customer
        const verifyResponse = await verifyRequest.json();
        if (verifyResponse.role === role) {
            return verifyResponse.accountId;
        }
    }

    return null;
};

// role: customer, staff
export default function ProtectedRoute({ Component, role }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthenticationStatus = async () => {
            const authStatus = await verifyAuthentication(role);
            setIsAuthenticated(authStatus === null ? false : true);
            setUserId(authStatus);
            setIsLoading(false);
        }

        checkAuthenticationStatus();
    }, []);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/login", {
                state: {
                    callback: location.pathname
                }
            });
        }
    }, [isLoading]);

    if (isLoading) return <div>Loading...</div>; // TODO: Improve

    return isAuthenticated && <Component userId={userId} />;
}