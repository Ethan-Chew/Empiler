import React from 'react';
import NavBar from '../../components/Navbar';
import LiveChatPopup from '../../components/Chat/LiveChatPopup';
import { useState } from 'react';
import { PiChats } from "react-icons/pi";
import { BsCalendarCheck } from "react-icons/bs";

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
            <div className="text-center mt-10">
                <div className="flex justify-center items-center space-x-6 mt-4">
                    <div className="w-[200px] h-[8px] bg-[#D00E35]" />
                    <h2 className="text-[40px]">Quick Actions</h2>
                    <div className="w-[200px] h-[8px] bg-[#D00E35]" />
                </div>

                <div className="flex justify-between space-x-8 mt-8 mx-12">
                    <a className="bg-white shadow-lg rounded-xl p-6 w-[400px] h-[250px] hover:shadow-2xl transition-shadow duration-300" href="/appointments/branches">
                        <BsCalendarCheck className="w-12 h-12 object-contain fill-ocbcred mb-4" />
                        <h3 className="text-[24px] font-semibold text-left">Book an Appointment</h3>
                        <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                            Schedule an appointment for any queries you might have
                        </p>
                    </a>
                </div>

                <div className="flex justify-between space-x-8 mt-8 mx-12">
                    <button onClick={() => setIsOpen(true)} className="bg-white shadow-lg rounded-xl p-6 w-[400px] h-[250px] hover:shadow-2xl transition-shadow duration-300">
                        <PiChats className="w-12 h-12 object-contain fill-ocbcred mb-4" />
                        <h3 className="text-[24px] font-semibold text-left">Start a Live Chat</h3>
                        <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                            Start a live chat session for any queries you might have
                        </p>
                    </button>
                </div>
                <hr className="border-t-[2px] border-[#DCD6D6] mt-16" />
            </div>

            {isOpen && <LiveChatPopup isOpen={isOpen} setIsOpen={setIsOpen} />}

            {/* Footer */}
            <footer className="py-12 bg-gray-50"> 
                <div className="flex justify-between items-start px-8 lg:px-16">
                    <div>
                        <img src="/ocbc-logo.png" alt="OCBC Logo" className="w-[280px] h-[76px]" />
                        <h3 className="text-[50px] mt-4">Group</h3>
                    </div>
                    <div className="flex space-x-12 ml-96"> 
                        <div className="space-y-4">
                            <h4 className="text-[20px]">Useful Links</h4>
                            <p className="text-[16px]">Investor Information</p>
                            <p className="text-[16px]">International Network</p>
                            <p className="text-[16px]">Careers</p>
                            <p className="text-[16px]">Research</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[20px]">Contact Us</h4>
                            <p className="text-[16px]">Personal Banking</p>
                            <p className="text-[16px]">Premier Banking</p>
                            <p className="text-[16px]">FRANK by OCBC</p>
                            <p className="text-[16px]">Business Banking</p>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-6">
                        <div className="w-[50px] h-[50px] bg-[#2D3D45] rounded-full flex justify-center items-center hover:scale-105 transition-transform">
                            <img src="/facebook.svg" alt="Facebook" className="w-2/5 h-2/5 object-contain" />
                        </div>
                        <div className="w-[50px] h-[50px] bg-[#2D3D45] rounded-full flex justify-center items-center hover:scale-105 transition-transform">
                            <img src="/youtube.svg" alt="Youtube" className="w-2/5 h-2/5 object-contain" />
                        </div>
                        <div className="w-[50px] h-[50px] bg-[#2D3D45] rounded-full flex justify-center items-center hover:scale-105 transition-transform">
                            <img src="/twitter.svg" alt="Twitter" className="w-2/5 h-2/5 object-contain" />
                        </div>
                        <div className="w-[50px] h-[50px] bg-[#2D3D45] rounded-full flex justify-center items-center hover:scale-105 transition-transform">
                            <img src="/linkedin.svg" alt="Linkedin" className="w-2/5 h-2/5 object-contain" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default CustomerLandingPage;