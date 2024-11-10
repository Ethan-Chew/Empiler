import { useEffect } from "react";
import { FaXmark } from "react-icons/fa6";

export default function ToastMessage({ index, message, isShown, hideToast }) {

    useEffect(() => {
        const timer = setTimeout(() => {
            hideToast(index);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`px-4 py-2 flex flex-row gap-3 bg-ocbcred text-white rounded-lg ${isShown ? "block" : "hidden"}`}>
            <p>{ message }</p>
            <button onClick={() => hideToast(index)}>
                <FaXmark />
            </button>
        </div>
    )
}