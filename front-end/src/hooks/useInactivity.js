import { useState, useEffect } from "react";

export function useInactivity(inactivityLimit, disconnectLimit, socket, caseID) {
    const [inactivityTimer, setInactivityTimer] = useState(0);
    const [userInactive, setUserInactive] = useState(false);
    const [userDisconnected, setUserDisconnected] = useState(false);

    useEffect(() => {
        const handleUserActivity = () => {
            setInactivityTimer(0);
            setUserInactive(false);
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                setInactivityTimer(0);
                setUserInactive(false);
            }
        };

        // Increment inactivity time every minute
        const interval = setInterval(() => {
            setInactivityTimer(prev => prev + 1);

            if (inactivityTimer >= inactivityLimit) {
                setUserInactive(true);
            }

            if (inactivityTimer >= disconnectLimit) {
                setUserDisconnected(true);
                socket.emit("utils:end-chat", caseID, true);
            }
        }, 60000);

        // Set up event listeners
        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('keypress', handleUserActivity);
        window.addEventListener('click', handleUserActivity);
        window.addEventListener('touchstart', handleUserActivity);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('keypress', handleUserActivity);
            window.removeEventListener('click', handleUserActivity);
            window.removeEventListener('touchstart', handleUserActivity);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearInterval(interval);
        };
    }, [inactivityTimer, inactivityLimit, disconnectLimit, socket, caseID]);

    return { inactivityTimer, userInactive, userDisconnected };
}