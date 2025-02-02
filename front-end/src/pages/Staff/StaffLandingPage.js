import React from 'react';
import Navbar from '../../components/Navbar';
import { PiChats } from "react-icons/pi";
import { BsCalendarCheck } from "react-icons/bs";
import { RiSettings4Line } from "react-icons/ri";
import { MdOutlinePersonOutline } from "react-icons/md";
import { LuTicket } from "react-icons/lu";
import { useState, useEffect } from 'react';

const StaffLandingPage = () => {
    const [user, setUser] = useState();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/user/user`);
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    } , []
    );
    return (
        <div className="bg-white font-inter">
            <Navbar />

            <div className="text-left mt-6 px-4 lg:px-8">
                <h1 className="text-[48px] text-[#343434]">Good Afternoon, John Admin!</h1>
                <p className="text-[20px] text-[#999999] mt-2">What would you like to do today?</p>
                <hr className="border-t-[2px] border-[#DCD6D6] mt-12" />
            </div>

            {/* Buttons */}
            <div className="text-center mt-10">
                <div className="flex justify-center items-center space-x-6 mt-4">
                    <div className="w-[200px] h-[8px] bg-[#D00E35]" />
                    <h2 className="text-[40px]">Staff Menu</h2>
                    <div className="w-[200px] h-[8px] bg-[#D00E35]" />
                </div>

                <div className="flex space-x-8 mt-8 mx-12">

                    <a className="border border-gray-200 bg-white shadow-md rounded-xl p-6 w-[400px] h-[250px] hover:shadow-xl transition-shadow duration-300" href='chats'>
                        <PiChats className="w-12 h-12 object-contain fill-ocbcred mb-4" />
                        <h3 className="text-[24px] font-semibold text-left">Staff Support Chat</h3>
                        <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                            Manage your chat activity
                        </p>
                    </a>

                    <a className="border border-gray-200 bg-white shadow-md rounded-xl p-6 w-[400px] h-[250px] hover:shadow-lg transition-shadow duration-300" href="stafftickets">
                        <LuTicket className="w-12 h-12 object-contain fill-ocbcred mb-4" />
                        <h3 className="text-[24px] font-semibold text-left">View Tickets</h3>
                        <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                            View tickets submitted by customers
                        </p>
                    </a>

                    <a
                        className="border border-gray-200 bg-white shadow-md rounded-xl p-6 w-[400px] h-[250px] hover:shadow-lg transition-shadow duration-300"
                        href="/staff/customer-support-statistics"
                    >
                        <RiSettings4Line className="w-12 h-12 object-contain fill-ocbcred mb-4" />
                        <h3 className="text-[24px] font-semibold text-left">View Statistics</h3>
                        <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                            View customer support statistics and insights
                        </p>
                    </a>

                </div>
                <hr className="border-t-[2px] border-[#DCD6D6] mt-16" />
            </div>

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

export default StaffLandingPage;