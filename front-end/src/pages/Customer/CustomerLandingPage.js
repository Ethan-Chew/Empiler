import React, { useEffect } from 'react';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LiveChatPopup from '../../components/Chat/LiveChatPopup';
import TwofaPopup from '../../components/2FA/TwofaPopup';
import { useState } from 'react';
import { PiChats, PiCalendarBlank } from "react-icons/pi";
import { MdEditCalendar } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";

const CustomerLandingPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [twofaIsOpen, setTwofaIsOpen] = useState(false); 
    const [isTwofaDisabled, setIsTwofaDisabled] = useState(true);
    const [settingsIsOpen, setSettingsIsOpen] = useState(false);

    useEffect(() => {
        const checkExistingOtp = async () => {
            try {
                const userSession = JSON.parse(sessionStorage.getItem('userDetails'));
                const response = await fetch(`http://localhost:8080/api/otp/get/${userSession.email}`);
                const data = await response.json();
                if (data !== false) {
                    setIsTwofaDisabled(true);
                } else {
                    setIsTwofaDisabled(false);
                }
            } catch (error) {
                console.error('Error checking existing OTP:', error);
            }
        };

        checkExistingOtp();
    }, []);

    return (
        <div className="bg-white font-inter">
            <NavBar />

            <div className="text-left mt-6 px-4 lg:px-8">
                <div className='flex flex-row'>
                    <h1 className="text-[48px] text-[#343434]">Good Afternoon, John Customer!</h1>
                    <button
                        onClick={() => setSettingsIsOpen(true)}
                    >
                        <IoMdSettings className="ml-auto w-10 h-10 object-contain fill-ocbcred" />
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
                    </div>

                    <div className="flex justify-center items-center space-x-6 mt-4">
                        <div className="w-[200px] h-[8px] bg-[#D00E35]" />
                        <h2 className="text-[40px]">Account Settings</h2>
                        <div className="w-[200px] h-[8px] bg-[#D00E35]" />
                    </div>

                    <div className="flex flex-wrap justify-center space-x-8 mt-8 mx-12">
                        <div
                            onClick={!isTwofaDisabled ? () => setTwofaIsOpen(true) : null}
                            className={`border border-gray-200 shadow-md rounded-xl p-6 w-[400px] h-[250px] transition-shadow duration-300 mb-8 ${isTwofaDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-white hover:shadow-lg cursor-pointer'}`}
                        >
                            <PiCalendarBlank className="w-12 h-12 object-contain fill-ocbcred mb-4" />
                            <h3 className="text-[24px] font-semibold text-left">2FA Setup</h3>
                            <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                                Setup Two-Factor Authentication for your account
                            </p>
                        </div>
                    </div>
                    <hr className="border-t-[2px] border-[#DCD6D6] mt-16" />
                </div>
            </div>

            {isOpen && <LiveChatPopup isOpen={isOpen} setIsOpen={setIsOpen} />}
            {twofaIsOpen && <TwofaPopup isOpen={twofaIsOpen} setIsOpen={setTwofaIsOpen} />}

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default CustomerLandingPage;
