import StaffNavigationBar from "../../components/StaffNavbar"
import { useNavigate } from "react-router-dom"

export default function StaffHome() {
    const navigate = useNavigate();

    return (
        <div>
            <StaffNavigationBar />

            <button onClick={() => navigate("/staff/chats")}>
                view all chats
            </button>
        </div>
    )
}