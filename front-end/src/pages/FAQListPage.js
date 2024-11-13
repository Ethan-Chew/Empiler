
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

    return (
        <div className="font-inter">
            {/* Navbar */}
            <NavigationBar />

            {/* Gray Line */}
            <hr className="border-t-[2px] border-[#DCD6D6]" />

            {/* Title Section */}
            <div className="px-8 mt-6 flex items-center justify-center">
                <div className="flex w-full justify-between items-center">
                    <Link to="/landingpage" className="text-[#000000] text-[20px] hover:text-[#D00E35]">
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
                            <FaqCatItem key={item.id} title={item.title} description={item.description} href={`/faq-article?title=${item.title}&section=${title}`} />
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

            {/* Footer */}
            <footer className="py-12 bg-gray-50">
                <div className="flex justify-between items-start px-8 lg:px-16">
                    <div>
                        <img src="/ocbc-logo.png" alt="OCBC Logo" className="w-[280px] h-[76px]" />
                        <h3 className="text-[50px] mt-4">Group</h3>
                    </div>
                    {/* Container for the 2 columns */}
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
                    {/* Social Media Icons */}
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
};

export default FAQListPage;