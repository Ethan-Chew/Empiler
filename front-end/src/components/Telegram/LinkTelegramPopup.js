import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import convertUnixToDate from "../../utils/unixMsToDate";

export default function LinkTelegramPopup({ closePopup, userId }) {
    const [ telegramLinked, setTelegramLinked ] = useState(false);
    const [ telegramInfo, setTelegramInfo ] = useState(null);
    const [ error, setError ] = useState(null);

    const verifyTelegramLinked = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/telegram/verify/user/${userId}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.status === 404 || response.status === 500) {
                setTelegramLinked(false);
                return;
            }

            const json = await response.json();
            setTelegramLinked(true);
            setTelegramInfo(json.data);
        } catch (error) {
            console.error(error.message);
            setError(error.message);
        }
    }

    const handleLinkTelegram = async () => {

    }

    const handleUnlinkTelegram = async () => {
        const response = await fetch(`http://localhost:8080/api/telegram/unlink/${userId}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (response.status === 200) {
            alert("Account Unlinked!");
            setTelegramLinked(false);
            setTelegramInfo(null);
        }
    }

    useEffect(() => {
        verifyTelegramLinked();
    }, []);
    
    return (
        <div
            className='fixed top-0 inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'
            onClick={() => closePopup()}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                exit={{ opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className='p-5 rounded-lg bg-white md:min-w-[60vw]'
            >
                <h2 className='text-3xl font-bold mb-3'>User Settings</h2>
                <hr />
                <div className="py-3">
                    <p className='mt-2 text-2xl font-semibold'>OCBC Support Telegram Bot</p>
                    <p className='max-w-[70%] text-neutral-600'>Link your Telegram Account with our Bot for easier management of Appointments. You can also receive appointments through the bot.</p>
                    { telegramLinked ? (
                        <div className="mt-2">
                            <p className="text-xl font-semibold mb-2">Account Linked!</p>
                            <p><span className="font-bold">Telegram Username: </span>{telegramInfo.telegramUsername}</p>
                            <p><span className="font-bold">Date Verified: </span>{convertUnixToDate(telegramInfo.verifiedDate)}</p>
                            <button
                                className="mt-2 p-3 px-5 bg-neutral-400 text-neutral-900 rounded-lg"
                                onClick={() => handleUnlinkTelegram()}
                            >
                                Unlink Account
                            </button>
                        </div>
                    ) : (
                        <button
                            className='mt-2 p-3 px-5 bg-ocbcred hover:bg-ocbcdarkred rounded-lg text-white font-semibold'
                            onClick={handleLinkTelegram}
                        >
                            Link my Account
                        </button>
                    ) }
                </div>
            </motion.div>
        </div>
    )
}