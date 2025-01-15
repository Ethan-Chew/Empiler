import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FaChevronUp } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CustomerSupportStatistics = () => {
    const [ratings, setRatings] = useState({
        excellent: 0,
        good: 0,
        mediocre: 0,
        poor: 0,
    });

    useEffect(() => {
        const fetchRatings = () => {
            try {
                // Sample data for testing
                const sampleChats = [
                    { rating: 5 },
                    { rating: 5 },
                    { rating: 4 },
                    { rating: 4 },
                    { rating: 3 },
                    { rating: 2 },
                    { rating: 2 },
                    { rating: 1 },
                    { rating: 1 },
                    { rating: 1 },
                ];

                const counts = {
                    excellent: 0,
                    good: 0,
                    mediocre: 0,
                    poor: 0,
                };

                //determine what rating
                sampleChats.forEach((item) => {
                    const rating = item.rating;
                    if (rating === 5) counts.excellent++;
                    else if (rating === 4) counts.good++;
                    else if (rating === 3) counts.mediocre++;
                    else if (rating === 1 || rating === 2) counts.poor++;
                });

                setRatings(counts);
            } catch (error) {
                console.error('Error processing ratings:', error);
            }
        };

        fetchRatings();
    }, []);

    const totalRatings = ratings.excellent + ratings.good + ratings.mediocre + ratings.poor;

    // percentage calculator
    const excellentPercentage = totalRatings > 0 ? ((ratings.excellent / totalRatings) * 100).toFixed(2) : 0;
    const goodPercentage = totalRatings > 0 ? ((ratings.good / totalRatings) * 100).toFixed(2) : 0;
    const mediocrePercentage = totalRatings > 0 ? ((ratings.mediocre / totalRatings) * 100).toFixed(2) : 0;
    const poorPercentage = totalRatings > 0 ? ((ratings.poor / totalRatings) * 100).toFixed(2) : 0;

    //chart data
    const pieChartData = {
        labels: ['Excellent', 'Good', 'Mediocre', 'Poor'],
        datasets: [
            {
                data: [
                    ratings.excellent,
                    ratings.good,
                    ratings.mediocre,
                    ratings.poor,
                ],
                backgroundColor: ['#2F84CF', '#38C1C1', '#EF6461', '#D9D9D9'],
            },
        ],
    };

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
                                {/* Pie Chart */}
                                <div className="w-[300px] h-[300px] flex items-center justify-center">
                                    <Pie data={pieChartData} />
                                </div>

                                <div className="space-y-4 text-left text-[18px] font-medium">
                                    <div className="flex justify-between items-center text-[#2F84CF]">
                                        <div className="mr-4">Excellent</div>
                                        <div className="text-[24px] font-bold">{excellentPercentage}%</div>
                                    </div>
                                    <div className="flex justify-between items-center text-[#38C1C1]">
                                        <div className="mr-4">Good</div>
                                        <div className="text-[24px] font-bold">{goodPercentage}%</div>
                                    </div>
                                    <div className="flex justify-between items-center text-[#EF6461]">
                                        <div className="mr-4">Mediocre</div>
                                        <div className="text-[24px] font-bold">{mediocrePercentage}%</div>
                                    </div>
                                    <div className="flex justify-between items-center text-[#D9D9D9]">
                                        <div className="mr-4">Poor</div>
                                        <div className="text-[24px] font-bold">{poorPercentage}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="mt-4 bg-[#D00E35] text-white font-medium py-2 px-4 rounded-lg w-full">
                        View More Feedback
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CustomerSupportStatistics;