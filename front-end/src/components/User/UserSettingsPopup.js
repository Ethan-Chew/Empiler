import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { CiCirclePlus } from "react-icons/ci";
import convertUnixToDate from "../../utils/unixMsToDate";

export default function UserSettingsPopup({ closePopup, userId }) {
    // State
    const [telegramLinked, setTelegramLinked] = useState(false);
    const [telegramInfo, setTelegramInfo] = useState(null);
    const [inputtedTelegramUsername, setInputtedTelegramUsername] = useState("");
    const [verificationCode, setVerificationCode] = useState(null);
    const [linkingState, setLinkingState] = useState({
        startLinking: false,
        linkPending: false,
        linkLoading: false,
        linkError: null,
    });
    const [error, setError] = useState(null);

    const verifyTelegramLinked = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/telegram/verify/user/${userId}`, {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const json = await response.json();
                if (json.status === "pending") {
                    setTelegramLinked(false);
                    setLinkingState((prev) => ({
                        ...prev,
                        linkPending: true,
                    }));
                    setVerificationCode(json.data.verificationCode);
                } else {
                    setTelegramLinked(true);
                    setTelegramInfo(json.data);
                }
            } else {
                setTelegramLinked(false);
            }
        } catch (err) {
            console.error("Error verifying Telegram link:", err);
            setError(err.message);
        }
    };

    const handleLinkTelegram = async () => {
        setLinkingState((prev) => ({ ...prev, linkLoading: true }));
        try {
            const response = await fetch(`http://localhost:8080/api/telegram/create`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, telegramUsername: inputtedTelegramUsername }),
            });

            if (response.ok) {
                const json = await response.json();
                setVerificationCode(json.data.verificationCode);
                setLinkingState({
                    startLinking: false,
                    linkPending: true,
                    linkLoading: false,
                    linkError: null,
                });
            } else {
                const errorData = await response.json();
                setLinkingState((prev) => ({
                    ...prev,
                    linkError: `Error linking account: ${errorData.message}`,
                    linkLoading: false,
                }));
            }
        } catch (err) {
            console.error("Error linking Telegram:", err);
            setLinkingState((prev) => ({
                ...prev,
                linkError: "An unexpected error occurred. Please try again later.",
                linkLoading: false,
            }));
        }
    };

    const handleUnlinkTelegram = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/telegram/unlink/${userId}`, {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                alert("Account successfully unlinked!");
                setTelegramLinked(false);
                setTelegramInfo(null);
            } else {
                alert("Failed to unlink the account. Please try again later.");
            }
        } catch (err) {
            console.error("Error unlinking Telegram:", err);
            setError("Unable to unlink account.");
        }
    };

    useEffect(() => {
        verifyTelegramLinked();
    }, []);

    return (
        <div
            className="fixed top-0 inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={closePopup}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                className="p-5 m-10 rounded-lg bg-white md:min-w-[60vw]"
            >
                {/* Header */}
                <div className="flex flex-row justify-between mb-3">
                    <h2 className="text-3xl font-bold">User Settings</h2>
                    <button onClick={closePopup} aria-label="Close Popup">
                        <FaXmark className="text-2xl" />
                    </button>
                </div>
                <hr />
                <div className="py-3">
                    {/* Telegram Section */}
                    <p className="mt-2 text-2xl font-semibold">OCBC Support Telegram Bot</p>
                    <p className="max-w-[70%] text-neutral-600">
                        Link your Telegram Account with our Bot for easier management of Appointments. You can also
                        receive appointments through the bot.
                    </p>
                    {telegramLinked ? (
                        <div className="mt-2">
                            <p className="text-xl font-semibold mb-2">Account Linked!</p>
                            <p>
                                <span className="font-bold">Telegram Username: </span>
                                {telegramInfo.telegramUsername}
                            </p>
                            <p>
                                <span className="font-bold">Date Verified: </span>
                                {convertUnixToDate(telegramInfo.verifiedDate)}
                            </p>
                            <button
                                className="mt-2 p-3 px-5 bg-ocbcred hover:bg-ocbcdarkred text-white duration-150 rounded-lg"
                                onClick={handleUnlinkTelegram}
                            >
                                Unlink Account
                            </button>
                        </div>
                    ) : linkingState.startLinking ? (
                        <div className="my-2">
                            <p className="text-xl font-bold">Telegram Handle</p>
                            <p className="text-neutral-700">Input your Telegram Handle (in proper case-sensitivity!), excluding the '@'.</p>
                            <div className="flex items-center border border-neutral-400 rounded-lg w-full md:w-[30vw] my-2">
                                <input
                                    className="flex-grow focus:outline-none py-2 px-3 text-sm placeholder:text-neutral-400 border-r-0 rounded-l-lg"
                                    placeholder="JohnDoe"
                                    value={inputtedTelegramUsername}
                                    onChange={(e) => setInputtedTelegramUsername(e.target.value)}
                                />
                                <button
                                    className={`text-2xl text-white ${
                                        linkingState.linkLoading ? "bg-gray-400" : "bg-ocbcred hover:bg-ocbcdarkred"
                                    } rounded-r-lg py-2 px-4`}
                                    onClick={handleLinkTelegram}
                                    disabled={linkingState.linkLoading}
                                >
                                    <CiCirclePlus />
                                </button>
                            </div>
                            {linkingState.linkError && (
                                <p className="text-red-500 text-sm">{linkingState.linkError}</p>
                            )}
                        </div>
                    ) : !linkingState.linkPending && (
                        <button
                            className="mt-2 p-3 px-5 bg-ocbcred hover:bg-ocbcdarkred rounded-lg text-white font-semibold"
                            onClick={() =>
                                setLinkingState((prev) => ({ ...prev, startLinking: true, linkError: null }))
                            }
                        >
                            Link my Account
                        </button>
                    )}

                    {/* Pending Message */}
                    {linkingState.linkPending && (
                        <>
                            <p className="mt-3">
                                Link In-Progress! To complete the linking process, start talking to it{" "}
                                <a
                                    href={`https://t.me/ocbc_empiler_bot?start=${verificationCode}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                >
                                    here
                                </a>{" "}
                                or enter this Verification Code (<span className="text-ocbcdarkred">{verificationCode}</span>) into the Telegram Bot.
                            </p>
                            <p>After linking, do refresh this page to verify that your account has been linked!</p>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}