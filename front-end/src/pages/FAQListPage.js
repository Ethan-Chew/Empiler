
import NavigationBar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import FaqCatItem from '../components/FAQ/FaqCatItem';
import LiveChatPopup from '../components/Chat/LiveChatPopup';
import { FaChevronLeft } from 'react-icons/fa6';

const FAQListPage = () => {
    const navigate = useNavigate();
    const [faqItems, setFaqItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const title = searchParams.get('title');

    useEffect(() => {
        if (!title) {
            navigate('/');
        }
    }, [])

    useEffect(() => {
        const fetchFaqItems = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/faq/section/${title}`);
                const data = await response.json();
                setFaqItems(data.faqs);
            } catch (error) {
                console.error('Error fetching faq items:', error);
            }
        };

        if (title) {
            fetchFaqItems();
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
        <div className="font-inter">
            {/* Navbar */}
            <NavigationBar />

            {/* Gray Line */}
            <hr className="border-t-[2px] border-[#DCD6D6]" />

            {/* Title Section */}
            <div className="px-8 mt-6 flex items-center justify-center">
                <div className="flex w-full justify-between items-center">
                    <Link to="/" className="text-[#000000] text-[20px] hover:text-[#D00E35]">
                        <FaChevronLeft />
                    </Link>
                    <div className="text-center flex-grow">
                        <h1 className="text-[30px] text-[#343434]">{ title }</h1>
                    </div>
                </div>
            </div>

            <hr className="border-t-[2px] border-[#DCD6D6] mt-4" />

            {/* FAQ List */}
            <div className="overflow-y-scroll max-h-[calc(100vh-250px)] mt-6 px-8 pb-8">
                <div className="space-y-6">
                    {faqItems && faqItems.length > 0 ? (
                        faqItems.map(item => (
                            <FaqCatItem key={item.id} title={item.title} description={item.description} href={`/individualfaqpage?title=${item.title}&section=${title}`} />
                        ))
                    ) : (
                        <p>No FAQ items found.</p>
                    )}
                </div>
            </div>

            {/* Gray Line at the Bottom */}
            <hr className="border-t-[2px] border-[#DCD6D6] mt-4" />

            {/* Margin below the gray line */}
            <div className="mb-8" />

            <div className="w-full h-[3px] bg-[#DCD6D6]" />

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default FAQListPage;