import { useState, useEffect } from "react";
import NavigationBar from "../../components/Navbar";
import { FaRegGrinBeam, FaRegStar, FaStar } from "react-icons/fa";
import { FaRegFaceFrownOpen, FaRegFaceMeh } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";

export default function ChatRating() {
    const navigate = useNavigate();
    const location = useLocation();
    const [rating, setRating] = useState(0);
    const [caseID, setCaseID] = useState(null);
    const [staffName, setStaffName] = useState(null);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isUpdateSuccess, setIsUpdateSuccess] = useState(null);
    const [redirectCountdown, setRedirectCountdown] = useState(5);
    const [blockSending, setBlockSending] = useState(false);

    useEffect(() => {
        const verifyAuthentication = async () => {
            const verifyRequest = await fetch('http://localhost:8080/api/auth/verify', {
                method: 'GET',
                credentials: 'include',
            });
            if (verifyRequest.status === 200) {
                setIsAuthenticated(true);
            }
        };        

        if (location.state && "caseID" in location.state && "staffName" in location.state) {
            setCaseID(location.state.caseID);
            setStaffName(location.state.staffName);
        } else {
            navigate("/");
        }

        verifyAuthentication();
    }, []);

    // Handle Redirect Countdown
    useEffect(() => {
        if (isUpdateSuccess) {
            const interval = setInterval(() => {
                setRedirectCountdown((prevCountdown) => {
                    if (prevCountdown === 0) {
                        clearInterval(interval);
                        if (isAuthenticated) {
                            navigate("/customer/home");
                        } else {
                            navigate("/");
                        }
                    }
                    return prevCountdown - 1;
                });
            }, 1000);
            
            return () => clearInterval(interval);
        }
    }, [isUpdateSuccess])

    const handleSubmitRating = async () => {
        if (isUpdateSuccess) {
            navigate("/");
            return;
        }

        setBlockSending(true);
        const updateRatingRequest = await fetch(`http://localhost:8080/api/chatHistory/${caseID}/rating`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                rating: rating
            })
        })
    
        if (updateRatingRequest.status === 200) {
            setIsUpdateSuccess(true);
        } else {
            setIsUpdateSuccess(false);
        }

        setBlockSending(false);
    }

    return (
        <div className="h-screen w-screen bg-neutral-100 flex flex-col">
            <NavigationBar />

            <div className="flex-grow flex flex-col items-center justify-center">
                <div className="bg-white w-2/3 py-10 flex flex-col gap-8 items-center justify-center rounded-lg drop-shadow-[0_0px_4px_rgba(0,0,0,.2)]">
                    <div className="flex flex-col gap-5 items-center">
                        <h2 className="text-2xl font-semibold">Thank you for chatting with us!</h2>
                        {rating === 0 || rating === 3 ? <FaRegFaceMeh className="text-8xl" /> : (rating < 3 ? <FaRegFaceFrownOpen className="text-8xl" /> : <FaRegGrinBeam className="text-8xl" />)}
                        <p className="text-center text-lg">Rate your Conversation with:<br/>{ staffName }</p>
                    </div>
                    <div className="flex flex-row gap-3">
                        {Array(5).fill(0).map((_, index) => {
                            if (index < rating) {
                                return <FaStar key={index} className="text-5xl text-ocbcred cursor-pointer" onMouseEnter={() => setRating(index + 1)} onClick={() => setRating(index + 1)} />
                            } else {
                                return <FaRegStar key={index} className="text-5xl text-ocbcred cursor-pointer" onMouseEnter={() => setRating(index + 1)} onClick={() => setRating(index + 1)} />
                            }
                        })}
                    </div>
                    <div className="flex flex-col gap-2">
                        <button className={`px-6 py-3 bg-ocbcred hover:bg-ocbcdarkred rounded-xl text-white ${blockSending ? "cursor-not-allowed" : "cursor-pointer"}`} onClick={handleSubmitRating} disabled={blockSending}>
                            {isUpdateSuccess === true ? "Continue" : "Submit Review"}
                        </button>
                        {isUpdateSuccess === true ? <p>Thank you! Redirecting you in {redirectCountdown} second{redirectCountdown === 1 ? "" : "s"}...</p> : (isUpdateSuccess === false ? <p>Failed to update your rating. Try again!</p> : <></>)}
                        <button className="text-ocbcred hover:text-ocbcdarkred font-lg">
                            I&apos;ll skip
                        </button>
                    </div>
                    <p className="text-neutral-400">Case ID: { caseID }</p>
                </div>
            </div>
        </div>
    )
}