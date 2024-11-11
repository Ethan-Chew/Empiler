import NavigationBar from "../components/Navbar";
import Footer from "../components/Footer";
import LiveChatPopup from "../components/Chat/LiveChatPopup";
import FaqCatItem from "../components/FAQ/FaqCatItem";
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Searchbar from "../components/FAQ/Searchbar";


export default function FAQ() {
    const [faqItems, setFaqItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const title = searchParams.get('title');

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
        <div className="bg-gray-100">
            <NavigationBar />

            {/* Header Section */}
            <div className="bg-red-100 px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-1">{title}</h1>
                    <p className="text-gray-500">Last Updated: 24th October 2024</p>
                </div>
                <Searchbar showTitle={false} />
            </div>

            

            {/* Items List */}
            <div className="space-y-4 w-full mx-auto flex flex-col items-center p-10">
                {faqItems && faqItems.length > 0 ? (
                    faqItems.map(item => (
                        <FaqCatItem key={item.id} title={item.title} description={item.description} href={`/faq-article?title=${item.title}&section=${title}`} />
                    ))
                ) : (
                    <p>No FAQ items found.</p>
                )}
            </div>             

            {isOpen && <LiveChatPopup section={title} question={null} isOpen={isOpen} setIsOpen={setIsOpen} />}

            <Footer setIsOpen={setIsOpen} />
        </div>
    );
}