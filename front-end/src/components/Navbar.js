import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export default function NavigationBar({ selectedPage }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null); // State to store the user's role
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
                const data = await verifyRequest.json();
                setIsLoggedIn(true);
                setUserRole(data.role); // Set the user's role
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
            setUserRole(null); // Reset the user's role
            navigate('/');
        }
    }

    const getHomeLink = () => {
        if (!isLoggedIn) return "/";
        if (userRole === "staff") return "/staff/home";
        if (userRole === "customer") return "/customer/home";
        return "/";
    }

    const isCurrentPage = (keyword) => {
        if (keyword === "home") {
            return location.pathname === "/" || location.pathname === "/staff/home" || location.pathname === "/customer/home";
        }
        return location.pathname.includes(keyword);
    };

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
                <a href={getHomeLink()} className="flex items-center">
                    <img src="/ocbc-logo.png" alt="OCBC Logo" className="h-6 mr-6" />
                </a>
                <div className="flex space-x-16 justify-center w-full text-lg">
                    <a
                        href={getHomeLink()}
                        className={`${isCurrentPage("home") ? "text-ocbcred hover:text-ocbcdarkred cursor-default font-bold" : "text-black hover:text-ocbcdarkred"}`}
                        onClick={(e) => isCurrentPage("home") && e.preventDefault()}
                    >
                        HOME
                    </a>
                    <a
                        href="/appointments/branches"
                        className={`${isCurrentPage("appointments") ? "text-ocbcred hover:text-ocbcdarkred cursor-default font-bold" : "text-black hover:text-ocbcdarkred"}`}
                        onClick={(e) => isCurrentPage("appointments") && e.preventDefault()}
                    >
                        APPOINTMENTS
                    </a>
                    <a
                        href="https://www.ocbc.com/group/about-us/group-business.page"
                        className={`${isCurrentPage("about-us") ? "text-ocbc-red cursor-default font-bold" : "text-black hover:text-ocbcdarkred"}`}
                        onClick={(e) => isCurrentPage("about-us") && e.preventDefault()}
                    >
                        ABOUT US
                    </a>
                </div>
            </div>
            {isLoggedIn ? 
                <button
                    className="bg-[#D00E35] text-white px-7 py-2 rounded hover:bg-[#C30C31] text-sm"
                    onClick={handleLogout}
                >
                    LOGOUT
                </button>
            : 
                <button
                    className="bg-[#D00E35] text-white px-7 py-2 rounded hover:bg-[#C30C31] text-sm"
                    onClick={() => navigate("/login", {
                        state: {
                            callback: location.pathname
                        }
                    })}
                >
                    LOGIN
                </button>
            }
        </motion.nav>
    );
}