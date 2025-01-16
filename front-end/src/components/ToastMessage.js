import { useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import { FiInfo, FiCheck  } from "react-icons/fi";
import { BsXCircle } from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

// type : info, error, success, warn
export default function ToastMessage({ title = null, description = null, index=0, isShown, hideToast, type }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            hideToast(index);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);
    
    if (type === null) {
        return <p>TOAST MESSAGE TYPE IS NULL</p>
    }

    let typeStyles;
    switch (type) {
        case 'info':
            typeStyles = 'bg-blue-500 text-blue-600';
            break;
        case 'error':
            typeStyles = 'bg-red-500 text-red-600';
            break;
        case 'success':
            typeStyles = 'bg-green-500 text-green-600';
            break;
        case 'warn':
            typeStyles = 'bg-yellow-500 text-yellow-600';
            break;
        default:
            typeStyles = 'bg-blue-500 text-blue-600';
    }
    let iconType;
    switch (type) {
        case 'info':
            iconType = <FiInfo className="text-3xl" />;
            break;
        case 'error':
            iconType = <BsXCircle className="text-3xl" />;
            break;
        case 'success':
            iconType = <FiCheck className="text-3xl" />;
            break;
        case 'warn':
            iconType = <IoWarningOutline className="text-3xl" />;
            break;
        default:
            iconType = <FiInfo className="text-3xl" />;
    }

    return (
        <>
            <AnimatePresence>
                { isShown && (
                    <motion.div
                        initial={{ x: 200 }}
                        animate={{ x: 0 }}
                        exit={{ x: 200 }}
                        transition={{ duration: 0.8, type: 'spring' }}
                        className="fixed bottom-10 right-10"
                    >
                        <div className={`ml-10 ${typeStyles} bg-opacity-20 backdrop-blur-lg flex flex-row rounded-lg md:min-w-[22vw] md:max-w-[60vw]`}>
                            <div className={`${typeStyles} w-2 rounded-l-lg mr-4`}></div>
                            <div className="py-4 pr-4 flex flex-row gap-3 items-start flex-grow">
                                { iconType }
                                <div>
                                    <p className="font-bold">{ title }</p>
                                    <p>{ description && description }</p>
                                </div>
                            </div>
                            <div className="pt-4 pr-4">
                                <button onClick={() => hideToast(index)}>
                                    <FaXmark className="text-lg" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}