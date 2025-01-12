import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaChevronUp } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa'; 

const CustomerSupportStatistics = () => {
    return (
        <div className="font-inter">
            <Navbar />

            <hr className="border-t-[2px] border-[#DCD6D6]" />

            <div className="px-8 mt-6 flex items-center space-x-4">

                <button className="text-[#7F7F7F] text-[18px] flex items-center hover:text-[#D00E35]">
                    <FaArrowLeft className="mr-2" />
                </button>

                <div>
                    <h1 className="text-[30px] text-[#343434] font-bold">Customer Support Statistics</h1>
                    <p className="text-[16px] text-[#7F7F7F]">For the month of: <span className="text-[#D00E35]">March 2025</span></p>
                </div>
            </div>

            <hr className="border-t-[2px] border-[#DCD6D6] mt-4" />

            <div className="px-8 mt-6 grid grid-cols-2 gap-4">

                <div className="bg-gray-100 rounded-lg p-4 flex justify-between items-center">
                    <div className="text-[#7F7F7F] text-[18px] font-medium">Personal Rating: 89%</div>
                    <div className="text-[#23C552] text-[16px] font-medium flex items-center">
                        +12% <FaChevronUp className="ml-1" />
                    </div>
                </div>

                <div className="bg-gray-100 rounded-lg p-4 flex justify-between items-center">
                    <div className="text-[#7F7F7F] text-[18px] font-medium">Chats Answered: 34</div>
                    <div className="text-[#23C552] text-[16px] font-medium flex items-center">
                        +12% <FaChevronUp className="ml-1" />
                    </div>
                </div>
            </div>

            <div className="px-8 mt-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-100 rounded-lg p-6 flex flex-col justify-center">
                    <div className="text-[#000000] text-[18px] font-bold">Average Customer Waiting Time</div>
                    <div className="text-[#7F7F7F] text-[14px]">Data from 1-31 Mar 2025</div>
                    <div className="text-[72px] text-[#D00E35] font-bold mt-4 flex-grow flex items-center justify-center">5 minutes</div>
                </div>

                <div className="bg-gray-100 rounded-lg p-6 flex flex-col">
                    <div className="text-[#000000] text-[18px] font-bold">Overall Feedback</div>
                    <div className="text-[#7F7F7F] text-[14px]">Data from 1-31 Mar 2025</div>

                    <div className="mt-4 flex flex-col flex-grow space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="mt-4 flex items-center justify-between flex-grow">
                                <div className="w-[150px] h-[150px] bg-gray-300 rounded-full flex items-center justify-center ml-4">
                                    Pie Chart
                                </div>

                                <div className="grid grid-cols-2 gap-8 text-left text-[18px] font-medium">
                                    <div className="flex justify-between items-center text-[#2F84CF]">
                                        <div className="mr-4">Excellent</div> 
                                        <div className="text-[24px] font-bold">45%</div>
                                    </div>
                                    <div className="flex justify-between items-center text-[#38C1C1]">
                                        <div className="mr-4">Good</div>
                                        <div className="text-[24px] font-bold">30%</div>
                                    </div>
                                    <div className="flex justify-between items-center text-[#EF6461]">
                                        <div className="mr-4">Mediocre</div>
                                        <div className="text-[24px] font-bold">15%</div>
                                    </div>
                                    <div className="flex justify-between items-center text-[#D9D9D9]">
                                        <div className="mr-4">Poor</div>
                                        <div className="text-[24px] font-bold">10%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="mt-4 bg-transparent text-[#7F7F7F] text-[16px] font-medium border border-[#7F7F7F] rounded-lg py-2 px-4 hover:bg-gray-200">
                        View Details
                    </button>
                </div>
            </div>

            <hr className="border-t-[2px] border-[#DCD6D6] mt-6" />

            <Footer />
        </div>
    );
};

export default CustomerSupportStatistics;