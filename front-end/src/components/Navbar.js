import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {motion, useScroll, useMotionValueEvent} from 'framer-motion';

export default function NavigationBar({ selectedPage }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();
    const lastYRef = useRef(0);
    const navigate = useNavigate();
    const location = useLocation();

    useMotionValueEvent(scrollY, "change", (y) => {
        const difference = y - lastYRef.current;
        if (Math.abs(difference) > 50) {
            setHidden(difference > 0);
            lastYRef.current = y;
        }
    });

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
        <motion.nav
            className="sticky top-0 z-50 flex items-center justify-between h-[90px] px-4 lg:px-12 bg-white shadow-md"
            initial="visible"
            animate={hidden ? "hidden" : "visible"}
            variants={{
                visible: { y: "0%" },
                hidden: { y: "-100%" },
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            <div className="flex items-center mx-auto justify-between w-full">
                <div className="flex items-center">
                    <img src="/ocbc-logo.png" alt="OCBC Logo" className="h-6 mr-6" />
                </div>
                <div className="flex space-x-16 justify-center w-full text-lg">
                    <a href="/" className={`${selectedPage == "HOME" ? "text-ocbc-red" : "text-black"} hover:text-ocbcdarkred`}>HOME</a>
                    <a href="/" className={`${selectedPage == "FAQ" ? "text-ocbc-red" : "text-black"} hover:text-ocbcdarkred`}>FAQ</a>
                    <a href="/" className={`${selectedPage == "APPOINTMENTS" ? "text-ocbc-red" : "text-black"} hover:text-ocbcdarkred`}>APPOINTMENTS</a>
                    <a href="/" className={`${selectedPage == "LIVECHAT" ? "text-ocbc-red" : "text-black"} hover:text-ocbcdarkred`}>LIVE CHAT</a>
                    <a href="/" className={`${selectedPage == "" ? "text-ocbc-red" : "text-black"} hover:text-ocbcdarkred`}>ABOUT US</a>
                </div>
            </div>
            { isLoggedIn ? 
                <button
                    className="bg-[#D00E35] text-white px-7 py-2 rounded hover:bg-[#C30C31] text-[14px]"
                    onClick={() => navigate("/login", {
                        state: {
                            callback: location.pathname
                        }
                    })}
                >
                    LOGIN
                </button>
            
            : 
                <button
                    className="px-3 py-2 bg-ocbcred hover:bg-ocbcdarkred text-white rounded-lg ml-4"
                    onClick={() => handleLogout()}
                >
                    LOGOUT
                </button>
            }
        </motion.nav>
    )
}