import React, { useEffect, useState } from 'react';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LiveChatPopup from '../../components/Chat/LiveChatPopup';
import TwofaPopup from '../../components/2FA/TwofaPopup';
import { PiChats, PiCalendarBlank } from "react-icons/pi";
import { LuTicket } from "react-icons/lu";
import { MdEditCalendar } from "react-icons/md";
import { FaGear } from "react-icons/fa6";
import UserSettingsPopup from '../../components/User/UserSettingsPopup';

const CustomerLandingPage = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [custSettingsPopup, setCustSettingsPopup] = useState(false);
    const [user, setUser] = useState();
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/user/${props.userId}`);
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        window.watsonAssistantChatOptions = {
            integrationID: "28a57c46-95a2-4cc5-8d50-5e71acea277c",
            region: "au-syd",
            serviceInstanceID: "1ed83c75-5245-4e65-8a4c-73196c629cd3",
            onLoad: async (instance) => {
                await instance.render();
            },
        };
        
        const script = document.createElement("script");
        script.src =
        "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" +
        (window.watsonAssistantChatOptions.clientVersion || "latest") +
        "/WatsonAssistantChatEntry.js";
        script.async = true;
        document.head.appendChild(script);
        
        fetchUser();
        return () => {
            document.head.removeChild(script);
        };
    } , []);
  
    if (!user) { return <p>Loading...</p> }

    return (
        <div className="bg-white font-inter">
            <NavBar />

            <div className="text-left mt-6 px-4 lg:px-8">
                <div className='flex flex-row'>
                    <h1 className="text-[48px] text-[#343434] mr-auto">Good Afternoon, {user.username}!</h1>
                    <button
                        onClick={() => setCustSettingsPopup(true)}
                    >
                        <FaGear className="w-8 h-8" />
                    </button>
                </div>
                <p className="text-[20px] text-[#999999] mt-2">What would you like to do today?</p>
                <hr className="border-t-[2px] border-[#DCD6D6] mt-12" />
            </div>

            {/* Buttons */}
            <div className="bg-white font-inter">
                <div className="text-center mt-10">
                    <div className="flex justify-center items-center space-x-6 mt-4">
                        <div className="w-[200px] h-[8px] bg-[#D00E35]" />
                        <h2 className="text-[40px]">Quick Actions</h2>
                        <div className="w-[200px] h-[8px] bg-[#D00E35]" />
                    </div>

                    <div className="flex flex-wrap justify-center space-x-8 mt-8 mx-12">
                        <a className="border border-gray-200 bg-white shadow-md rounded-xl p-6 w-[400px] h-[250px] hover:shadow-lg transition-shadow duration-300 mb-8" href='/appointments/viewBooking'>
                            <MdEditCalendar className="w-12 h-12 object-contain fill-ocbcred mb-4" />
                            <h3 className="text-[24px] font-semibold text-left">View and Edit Appointments</h3>
                            <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                                Re-schedule an appointment to an alternative timeslot
                            </p>
                        </a>

                        <a className="border border-gray-200 bg-white shadow-md rounded-xl p-6 w-[400px] h-[250px] hover:shadow-lg transition-shadow duration-300 mb-8" href="/appointments/branches">
                            <PiCalendarBlank className="w-12 h-12 object-contain fill-ocbcred mb-4" />
                            <h3 className="text-[24px] font-semibold text-left">Book an Appointment</h3>
                            <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                                Schedule an appointment for any queries you might have
                            </p>
                        </a>

                        <div onClick={() => setIsOpen(true)} className="border border-gray-200 bg-white shadow-md rounded-xl p-6 w-[400px] h-[250px] hover:shadow-lg transition-shadow duration-300 mb-8 cursor-pointer">
                            <PiChats className="w-12 h-12 object-contain fill-ocbcred mb-4" />
                            <h3 className="text-[24px] font-semibold text-left">Start a Live Chat</h3>
                            <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                                Start a live chat session for any queries you might have
                            </p>
                        </div>

                        <a className="border border-gray-200 bg-white shadow-md rounded-xl p-6 w-[400px] h-[250px] hover:shadow-lg transition-shadow duration-300 mb-8" href="/tickets">
                            <LuTicket className="w-12 h-12 object-contain fill-ocbcred mb-4" />
                            <h3 className="text-[24px] font-semibold text-left">View Tickets</h3>
                            <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                                View or create a ticket for any issues you might have
                            </p>
                        </a>
                    </div>
                    <hr className="border-t-[2px] border-[#DCD6D6] mt-16" />
                </div>
            </div>

            {isOpen && <LiveChatPopup isOpen={isOpen} setIsOpen={setIsOpen} />}

            {/* Footer */}
            <Footer />

            {custSettingsPopup && (
                <UserSettingsPopup closePopup={() => setCustSettingsPopup(false)} userId={props.userId} />
            )}
        </div>
    );
}

export default CustomerLandingPage;
