import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavigationBar from "../components/Navbar";
import Login2faPopup from '../components/2FA/Login2faPopup';

export default function Login() {
    const [is2faOpen, setIs2faOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const { callback } = useLocation();

    const handleSuccessfulLogin = (data) => {
        // Store user details in sessionStorage
        sessionStorage.setItem('userDetails', JSON.stringify({
            id: data.accountId,
            email: data.email,
            role: data.role,
        }));

        // Check the role of the logged-in user
        if (data.role === "staff") {
            navigate(callback ? callback : "/staff/home");
        } else if (data.role === "customer") {
            navigate(callback ? callback : "/customer/home");
        } else {
            console.error("Unknown user role:", data.role);
            // Optionally, redirect to a default page or show an error
            navigate("/login");
        }
    };
    
    const handleLogin = async (e) => {
        e.preventDefault();

        // Reset error message on each login attempt
        setErrorMessage("");

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                const has2fa = await fetch(`http://localhost:8080/api/otp/get`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: data.email }),
                });
                const twofaData = await has2fa.json();
                if (twofaData.status === "Success" && twofaData.otpEnabled === true) {
                    setCurrentUser(data);
                    setIs2faOpen(true);
                } else {
                    handleSuccessfulLogin(data);
                }
            } else {
                // Display error message if login fails
                setErrorMessage(data.message || "Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            setErrorMessage("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div className="min-h-screen min-w-screen flex flex-col bg-neutral-100">
            <NavigationBar />

            <div className="flex flex-col flex-grow justify-center items-center md:h-auto">
                <form onSubmit={handleLogin} className="m-0 md:m-10 bg-white drop-shadow-md md:rounded-xl sm:w-3/4 flex-grow md:flex-grow-0 flex flex-col">
                    <div className="p-5 flex-grow md:flex-grow-0">
                        <div className="my-2 mb-6">
                            <img src="/ocbc.png" className="w-1/5 lg:w-1/12" />
                            <h1 className="mt-1 text-3xl font-bold">Support Portal</h1>
                        </div>

                        <div className="my-3 flex flex-col text-neutral-400">
                            <label>Username</label>
                            <input
                                className="border-3 rounded-lg border-neutral-400 px-3 py-2 outline-none"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="my-3 flex flex-col text-neutral-400">
                            <label>Password</label>
                            <input
                                type="password"
                                className="border-3 rounded-lg border-neutral-400 px-3 py-2 outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="relative h-4">
                                {errorMessage && (
                                    <span className="absolute text-red-500 text-sm">
                                        {errorMessage}
                                    </span>
                                )}
                            </div>
                        </div>


                        <div className="py-7 flex flex-col items-center">
                            <button type="submit" className="bg-ocbcred hover:bg-ocbcdarkred py-2 w-full text-white text-lg font-semibold rounded-xl">
                                Login
                            </button>
                            <button className="mt-3 text-neutral-400 hover:text-neutral-500">
                                Forget Password
                            </button>
                        </div>
                    </div>

                    <div className="w-full bg-neutral-200 md:rounded-b-xl p-5 text-center">
                        <a>Don't have a support account? <span className="text-ocbcred">Sign up now</span></a>
                    </div>
                </form>
                {is2faOpen && (
                <Login2faPopup
                    isOpen={is2faOpen}
                    setIsOpen={setIs2faOpen}
                    currentUser={currentUser}
                    handleSuccessfulLogin={handleSuccessfulLogin}
                />
            )}
            </div>
        </div>
    );
}