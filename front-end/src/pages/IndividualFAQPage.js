import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Markdown from 'react-markdown'
import { useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { FaChevronLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';


const IndividualFAQPage = () => {
    const navigate = useNavigate();
    const [faqDetail, setFaqDetail] = useState();
    const [searchParams, setSearchParams] = useSearchParams();
    const title = searchParams.get('title');
    const section = searchParams.get('section');

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
    useEffect(() => {
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
        
            return () => {
              document.head.removeChild(script);
            };
          }, []);

    return (
        <><div className="font-inter">
            <Navbar />

            {/* Gray Line */}
            <hr className="border-t-[2px] border-[#DCD6D6]" />

            {/* Title Section */}
            <div className="px-8 mt-6 flex items-center justify-center">
                <div className="flex w-full justify-between items-center">
                    {/* Back Button (on the far left) */}
                    <Link
                        to="#"
                        onClick={() => navigate(-1)}
                        className="text-[#000000] text-[20px] hover:text-[#D00E35]"
                    >
                        <FaChevronLeft />
                    </Link>
                    {/* Title Text (Centered) */}
                    <div className="text-center flex-grow">
                        <h1 className="text-[30px] text-[#343434]">{section}</h1>
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