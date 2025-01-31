import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
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

    const [averageRating, setAverageRating] = useState(null);
    const [totalChats, setTotalChats] = useState(0);
    const [prevMonthlyChats, setPrevMonthlyChats] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    });
    const [monthlyChats, setMonthlyChats] = useState(0);
    const [staffId, setStaffId] = useState(null);
    const [personalRating, setPersonalRating] = useState(null);
    const [averageWaitingTime, setAverageWaitingTime] = useState(0);

    useEffect(() => {
        const fetchMonthlyFeedback = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/user/staff-feedback?month=${selectedMonth}`,
                    {
                        method: 'GET',
                        credentials: 'include',
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error fetching feedback:", errorData);
                    return;
                }

                const statsData = await response.json();
                const newRatings = {
                    excellent: statsData.excellentPercentage,
                    good: statsData.goodPercentage,
                    mediocre: statsData.mediocrePercentage,
                    poor: statsData.poorPercentage,
                };
                setRatings(newRatings);
                setTotalChats(statsData.totalRatings);
                setPersonalRating(determineMostCommonRating(newRatings));
            } catch (error) {
                console.error("Error fetching feedback data:", error);
            }
        };

        fetchMonthlyFeedback();
    }, [selectedMonth]);

    useEffect(() => {
        const fetchMonthlyChats = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/user/monthly-chat-counts?month=${selectedMonth}`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error fetching monthly chats:", errorData);
                    setMonthlyChats(0);
                    return;
                }

                const data = await response.json();
                setMonthlyChats(data.chatCount);

                const prevMonth = getPreviousMonth(selectedMonth); 
                const prevResponse = await fetch(
                    `http://localhost:8080/api/user/monthly-chat-counts?month=${prevMonth}`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (!prevResponse.ok) {
                    const errorData = await prevResponse.json();
                    console.error("Error fetching previous monthly chats:", errorData);
                    setPrevMonthlyChats(0);
                    return;
                }

                const prevData = await prevResponse.json();
                setPrevMonthlyChats(prevData.chatCount);
            } catch (error) {
                console.error("Error fetching monthly chats:", error);
            }
        };

        fetchMonthlyChats();
    }, [selectedMonth]);

    useEffect(() => {
        const fetchAverageWaitingTime = async () => {
            try {
                const response = await fetch('/api/user/staff/average-waiting-time', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    console.error('Error fetching average waiting time:', response.statusText);
                    return;
                }

                const data = await response.json();
                setAverageWaitingTime(data.averageWaitingTime);
            } catch (error) {
                console.error('Error fetching average waiting time:', error);
            }
        };

        fetchAverageWaitingTime();
    }, []);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const getPreviousMonth = (month) => {
        const [year, monthNum] = month.split("-").map(Number);
        const date = new Date(year, monthNum - 1, 1);
        date.setMonth(date.getMonth() - 1);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    };

    // Calculate percentage change
    const calculatePercentageChange = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return (((current - previous) / previous) * 100).toFixed(2);
    };

    const percentageChange = calculatePercentageChange(monthlyChats, prevMonthlyChats);

    const totalRatings = totalChats;

    const determineMostCommonRating = (ratings) => {
        const ratingLabels = ["Excellent", "Good", "Mediocre", "Poor"];
        const ratingValues = [
            ratings.excellent,
            ratings.good,
            ratings.mediocre,
            ratings.poor,
        ];

        const maxIndex = ratingValues.indexOf(Math.max(...ratingValues));
        return ratingLabels[maxIndex];
    };

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
                </div>
            </div>

            <hr className="border-t-[2px] border-[#DCD6D6] mt-4" />

            <div className="px-8 mt-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-100 rounded-lg p-4 flex justify-between items-center">
                    <div className="text-[#7F7F7F] text-[18px] font-medium">
                        Personal Rating: {personalRating || "No Data"}
                    </div>
                </div>

                <div className="bg-gray-100 rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-[#7F7F7F] text-[18px] font-medium">
                        <span>Chats Answered for the Month of</span>
                        <select
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            className="text-[#D00E35] bg-transparent border-none outline-none cursor-pointer"
                        >
                            {Array.from({ length: 24 }, (_, i) => {
                                const date = new Date();
                                date.setMonth(date.getMonth() - 12 + i);
                                const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
                                return (
                                    <option key={i} value={value}>
                                        {date.toLocaleString("default", { month: "long", year: "numeric" })}
                                    </option>
                                );
                            })}
                        </select>
                        <span>:</span>
                        <span className="text-[#343434] font-bold">{monthlyChats}</span>
                    </div>

                    <div
                        className={`text-[16px] font-medium flex items-center ${percentageChange >= 0 ? "text-[#23C552]" : "text-[#EF6461]"}`}
                    >
                        {percentageChange >= 0 ? (
                            <>
                                +{percentageChange}% <FaChevronUp className="ml-1" />
                            </>
                        ) : (
                            <>
                                {percentageChange}% <FaChevronDown className="ml-1" />
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-8 mt-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-100 rounded-lg p-6 flex flex-col justify-center">
                    <div className="text-[16px] text-[#767676]">Average Waiting Time (mins)</div>
                    <div className="text-[20px] text-[#0F172A]">{averageWaitingTime} minutes</div>
                </div>

                <div className="bg-gray-100 rounded-lg p-6 flex flex-col">
                    <div className="text-[#000000] text-[18px] font-bold">Overall Feedback</div>
                    

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

                   
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CustomerSupportStatistics;