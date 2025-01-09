import React from 'react';
import SectionContainer from "./components/FAQ/SectionContainer";
import LiveChatFooter from './components/FAQ/LiveChatFooter';
import Searchbar from "./components/FAQ/Searchbar";
import Footer from "./components/Footer";
import NavigationBar from "./components/Navbar";
import LiveChatPopup from './components/Chat/LiveChatPopup';
import { searchClient } from '@algolia/client-search';
import { useState, useEffect } from 'react';


export default function App() {
  const [Generalfaqs, setGeneralFaqs] = useState([]);
    const [Paymentfaqs, setPaymentFaqs] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const algoilaAdminKey = process.env.REACT_APP_ALGOILA_ADMIN_KEY;
    
    useEffect(() => {
        const fetchFaqs = async () => {
          try {
            const response = await fetch('http://localhost:8080/api/faq/sectionCat/generalInfo');
            const data = await response.json();
            console.log(data.sections);
            setGeneralFaqs(data.sections);
          } catch (error) {
            console.error('Error fetching faq sections:', error);
          }
        };
    
        fetchFaqs();
      }, []);
    
      useEffect(() => {
        const fetchFaqs = async () => {
          try {
            const response = await fetch('http://localhost:8080/api/faq/sectionCat/payments');
            const data = await response.json();
            setPaymentFaqs(data.sections);
          } catch (error) {
            console.error('Error fetching faq sections:', error);
          }
        };
    
        fetchFaqs();
      }, []);
    
      const processRecords = async () => {
        const client = searchClient('AFO67MRW1I', algoilaAdminKey);
        const datasetRequest = await fetch('http://localhost:8080/api/faq/details');
        const details = await datasetRequest.json();
        return await client.replaceAllObjects({ indexName: 'title', objects: details.details });
      };

      useEffect(() => {
        processRecords()
        .catch((err) => console.error(err));
      }, );

    return (
        <div className="bg-white font-inter">

            {/* Navbar */}
            <NavigationBar />

            {/* Header Image */}
            <div className="flex mt-6 h-[300px]">
                <img src="/headerimage.png" alt="Header Image" className="w-full h-full object-cover" />
            </div>

            <div className="text-center mt-6 px-4 lg:px-8">
                <hr className="border-t-[2px] border-[#DCD6D6]" />
                <h1 className="text-[36px] text-[#343434] mt-12">How can we help you today?</h1>
                <p className="text-[20px] text-[#999999]">We're here to answer your questions!</p>

                {/* Search Bar */}
                <Searchbar />
                <hr className="border-t-[2px] border-[#DCD6D6] mt-6" />
            </div>

            <div className="text-center mt-10">
                <div className="flex justify-center items-center space-x-6 mt-4">
                    <div className="w-[200px] h-[8px] bg-[#D00E35]" />
                    <h2 className="text-[40px]">General Information</h2>
                    <div className="w-[200px] h-[8px] bg-[#D00E35]" />
                </div>

                {/* FAQ Sections */}
                <div className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                    {/* General Category */}
                    {Generalfaqs.map(faq => (
                        <a key={faq.id} href={`/faqlistpage?title=${faq.title}`}>
                            <SectionContainer icon={faq.icon} title={faq.title} description={faq.description} />
                        </a>
                    ))}
                </div>

            {/* Payments Section */}
            <div className="text-center mt-10">
                <div className="flex justify-center items-center space-x-6 mt-4">
                    <div className="w-[200px] h-[8px] bg-[#DCD6D6]" />
                    <h2 className="text-[40px]">Payments</h2>
                    <div className="w-[200px] h-[8px] bg-[#DCD6D6]" />
                </div>

                <div className='p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10'>
                    {Paymentfaqs.map(faq => (
                        <a key={faq.id} href={`/faqlistpage?title=${faq.title}`}>
                            <SectionContainer icon={faq.icon} title={faq.title} description={faq.description} />
                        </a>
                    ))}
                </div>
            </div>
            {isOpen && <LiveChatPopup isOpen={isOpen} setIsOpen={setIsOpen} />}
            <LiveChatFooter setIsOpen={setIsOpen}/>

            <div className="w-full h-[3px] bg-[#DCD6D6]" />

            {/* Footer */}
            <Footer />
            </div>
        </div>
    );
}
