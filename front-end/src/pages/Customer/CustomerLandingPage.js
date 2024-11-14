import React from 'react';
import NavBar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LiveChatPopup from '../../components/Chat/LiveChatPopup';
import { useState } from 'react';
import { PiChats, PiCalendarBlank } from "react-icons/pi";
import { MdEditCalendar } from "react-icons/md";

const CustomerLandingPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-white font-inter">
            <NavBar />

            <div className="text-left mt-6 px-4 lg:px-8">
                <h1 className="text-[48px] text-[#343434]">Good Afternoon, John Customer!</h1>
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
                        <a className="bg-white shadow-lg rounded-xl p-6 w-[400px] h-[250px] hover:shadow-2xl transition-shadow duration-300 mb-8" href='/appointments/viewBooking'>
                            <MdEditCalendar className="w-12 h-12 object-contain fill-ocbcred mb-4" />
                            <h3 className="text-[24px] font-semibold text-left">View and Edit Appointments</h3>
                            <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                                Re-schedule an appointment to an alternative timeslot
                            </p>
                        </a>

                        <a className="bg-white shadow-lg rounded-xl p-6 w-[400px] h-[250px] hover:shadow-2xl transition-shadow duration-300 mb-8" href="/appointments/branches">
                            <PiCalendarBlank className="w-12 h-12 object-contain fill-ocbcred mb-4" />
                            <h3 className="text-[24px] font-semibold text-left">Book an Appointment</h3>
                            <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                                Schedule an appointment for any queries you might have
                            </p>
                        </a>

                        <div onClick={() => setIsOpen(true)} className="bg-white shadow-lg rounded-xl p-6 w-[400px] h-[250px] hover:shadow-2xl transition-shadow duration-300 mb-8 cursor-pointer">
                            <PiChats className="w-12 h-12 object-contain fill-ocbcred mb-4" />
                            <h3 className="text-[24px] font-semibold text-left">Start a Live Chat</h3>
                            <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                                Start a live chat session for any queries you might have
                            </p>
                        </div>
                    </div>

                    <hr className="border-t-[2px] border-[#DCD6D6] mt-16" />
                </div>
            </div>

            {isOpen && <LiveChatPopup isOpen={isOpen} setIsOpen={setIsOpen} />}

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default CustomerLandingPage;
