import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Markdown from 'react-markdown'
import { useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';


const IndividualFAQPage = () => {
    const [faqDetail, setFaqDetail] = useState();
    const [searchParams, setSearchParams] = useSearchParams();
    const title = searchParams.get('title');

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/faq/detail/${title}`);
                const data = await response.json();
                setFaqDetail(data.detail[0]);
            } catch (error) {
                console.error('Error fetching faq detail:', error);
            }
        };

        if (title) {
            fetchDetail();
        }
    }, [title]);

    return (
        <><div className="font-inter">
            {/* Navbar */}
            <nav className="flex items-center justify-between h-[90px] px-4 lg:px-12 bg-white shadow-md">
                <div className="flex items-center mx-auto justify-between w-full">
                    <div className="flex items-center">
                        <img src="/ocbc-logo.png" alt="OCBC Logo" className="h-6 mr-6" />
                        <div className="flex space-x-16 justify-center w-full text-[18px]">
                            <a href="/" className="text-[#010101] hover:text-[#C30C31]">HOME</a>
                            <a href="/" className="text-[#D00E35] hover:text-[#C30C31]">FAQ</a>
                            <a href="/" className="text-[#010101] hover:text-[#C30C31]">APPOINTMENTS</a>
                            <a href="/" className="text-[#010101] hover:text-[#C30C31]">LIVE CHAT</a>
                            <a href="/" className="text-[#010101] hover:text-[#C30C31]">ABOUT US</a>
                        </div>
                    </div>
                    <button className="bg-[#D00E35] text-white px-7 py-2 rounded hover:bg-[#C30C31] text-[14px]">LOGIN</button>
                </div>
            </nav>

            {/* Gray Line */}
            <hr className="border-t-[2px] border-[#DCD6D6]" />

            {/* Title Section */}
            <div className="px-8 mt-6 flex items-center justify-center">
                <div className="flex w-full justify-between items-center">
                    {/* Back Button (on the far left) */}
                    <Link to="/landingpage" className="text-[#000000] text-[20px] hover:text-[#D00E35]">
                        &lt;
                    </Link>
                    {/* Title Text (Centered) */}
                    <div className="text-center flex-grow">
                        <h1 className="text-[30px] text-[#343434]">General Information</h1>
                        <p className="text-[16px] text-[#999999]">Payments and Transactions</p>
                    </div>
                </div>
            </div>

            {/* Gray Line */}
            <hr className="border-t-[2px] border-[#DCD6D6] mt-4" />

            {/* FAQ Content Rectangle */}
            <div className="overflow-y-auto max-h-[calc(100vh-250px)] mt-6 px-8 pb-8">
                <div className="bg-white shadow-lg rounded-xl p-6 space-y-4">
                    {/* Rectangle Title */}
                    {faqDetail ? (
                        <Markdown className={"text-2xl text-[#343434] text-bold"}>{faqDetail.title}</Markdown>
                    ) : (
                        <h3 className="text-2xl text-[#343434] text-bold">{'Loading...'}</h3>
                    )}
                

                    {/* Divider */}
                    <div className="w-full h-[2px] bg-[#DADADA]" />
                        {faqDetail ? (
                            <Markdown>{faqDetail.description}</Markdown>
                        ) : (
                            <p>{'Loading...'}</p>
                        )}
                

                    {/* Helpful Question and Buttons */}
                    <div className="border-gray-300 border-t pt-4 flex items-center space-x-4">
                        <p className="text-gray-700">Was this information useful?</p>
                        <button className="bg-white text-red-500 border border-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white w-20">
                            Yes
                        </button>
                        <button className="bg-white text-red-500 border border-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white w-20">
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div className="w-full h-[3px] bg-[#DCD6D6]" />

            {/* Footer */}
            <Footer />
        </>
    );
};

export default IndividualFAQPage;