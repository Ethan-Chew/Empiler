import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NavigationBar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkLoggedIn = async () => {
            const verifyRequest = await fetch('http://localhost:8080/api/auth/verify', {
                method: 'GET',
                credentials: 'include',
            });

            if (verifyRequest.status === 200) {
                setIsLoggedIn(true);
            }
        }

        checkLoggedIn();
    }, []);

    const handleLogout = async () => {
        const logoutRequest = await fetch('http://localhost:8080/api/auth/logout', {
            method: 'GET',
            credentials: 'include',
        });

        if (logoutRequest.status === 200) {
            setIsLoggedIn(false);
            navigate('/');
        }
    }

    return (
        <div className="z-10 px-10 py-4 flex flex-row items-center shadow">
            <a className="text-lg font-semibold" href="/">OCBC Support Centre</a>
            <div className="ml-auto duration-200">
                { !isLoggedIn ? (
                    <button 
                        className="px-3 py-2 bg-ocbcred hover:bg-ocbcdarkred text-white rounded-lg ml-4"
                        onClick={() => navigate('/login', {
                            state: { callback: location.pathname }
                        })}
                    >
                        Login
                    </button>
                ) : <button className="px-3 py-2 bg-ocbcred hover:bg-ocbcdarkred text-white rounded-lg ml-4" onClick={() => handleLogout()}>Logout</button>}
            </div>
        </div>
    );
}