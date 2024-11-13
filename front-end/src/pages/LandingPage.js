import React from 'react';
import SectionContainer from "../components/FAQ/SectionContainer";
import LiveChatFooter from '../components/FAQ/LiveChatFooter';
import Searchbar from "../components/FAQ/Searchbar";
import {motion, useAnimation, useScroll, useMotionValueEvent} from 'framer-motion';
import Footer from "../components/Footer";
import NavigationBar from "../components/Navbar";
import LiveChatPopup from '../components/Chat/LiveChatPopup';
import { searchClient } from '@algolia/client-search';
import { useState, useEffect, useRef } from 'react';

export default function LandingPage() {

    const [Generalfaqs, setGeneralFaqs] = useState([]);
    const [Paymentfaqs, setPaymentFaqs] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const algoilaAdminKey = process.env.REACT_APP_ALGOILA_ADMIN_KEY;
    const controls = useAnimation();
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();
    const lastYRef = useRef(0);

    useMotionValueEvent(scrollY, "change", (y) => {
        const difference = y - lastYRef.current;
        if (Math.abs(difference) > 50) {
            setHidden(difference > 0);
            lastYRef.current = y;
        }
    });

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
            <motion.nav
                className="sticky top-0 z-50 flex items-center justify-between h-[90px] px-4 lg:px-12 bg-white shadow-md"
                initial="visible"
                animate={hidden ? "hidden" : "visible"}
                variants={{
                    visible: { y: "0%" },
                    hidden: { y: "-100%" },
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <div className="flex items-center mx-auto justify-between w-full">
                    <div className="flex items-center">
                        <img src="/ocbc-logo.png" alt="OCBC Logo" className="h-6 mr-6" />
                    </div>
                    <div className="flex space-x-16 justify-center w-full text-[18px]">
                        <a href="/" className="text-[#D00E35] hover:text-[#C30C31]">HOME</a>
                        <a href="/" className="text-[#010101] hover:text-[#C30C31]">FAQ</a>
                        <a href="/" className="text-[#010101] hover:text-[#C30C31]">APPOINTMENTS</a>
                        <a href="/" className="text-[#010101] hover:text-[#C30C31]">LIVE CHAT</a>
                        <a href="/" className="text-[#010101] hover:text-[#C30C31]">ABOUT US</a>
                    </div>
                </div>
                <button className="bg-[#D00E35] text-white px-7 py-2 rounded hover:bg-[#C30C31] text-[14px]">LOGIN</button>
            </motion.nav>

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
                        <a key={faq.id} href={`/faq?title=${faq.title}`}>
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
                        <a key={faq.id} href={`/faq?title=${faq.title}`}>
                            <SectionContainer icon={faq.icon} title={faq.title} description={faq.description} />
                        </a>
                    ))}
                </div>
            </div>
            {isOpen && <LiveChatPopup isOpen={isOpen} setIsOpen={setIsOpen} />}
            <LiveChatFooter setIsOpen={setIsOpen}/>

            <div className="w-full h-[3px] bg-[#DCD6D6]" />

            {/* Footer */}
            <footer className="py-12 bg-gray-50"> {/* Footer with padding */}
                <div className="flex justify-between items-start px-8 lg:px-16">
                    <div>
                        <img src="/ocbc-logo.png" alt="OCBC Logo" className="w-[280px] h-[76px]" />
                        <h3 className="text-[50px] mt-4">Group</h3>
                    </div>
                    {/* Container for the 2 columns */}
                    <div className="flex space-x-12 ml-96"> {/* Added left margin here to push the columns to the right */}
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
                    {/* Circle Section with SVGs and hover effect */}
                    <div className="flex flex-col space-y-6">
                        {/* Circle 1 */}
                        <div className="w-[50px] h-[50px] bg-[#2D3D45] rounded-full flex justify-center items-center hover:scale-105 transition-transform">
                            <img src="/facebook.svg" alt="Facebook" className="w-2/5 h-2/5 object-contain" />
                        </div>
                        {/* Circle 2 */}
                        <div className="w-[50px] h-[50px] bg-[#2D3D45] rounded-full flex justify-center items-center hover:scale-105 transition-transform">
                            <img src="/youtube.svg" alt="Youtube" className="w-2/5 h-2/5 object-contain" />
                        </div>
                        {/* Circle 3 */}
                        <div className="w-[50px] h-[50px] bg-[#2D3D45] rounded-full flex justify-center items-center hover:scale-105 transition-transform">
                            <img src="/twitter.svg" alt="Twitter" className="w-2/5 h-2/5 object-contain" />
                        </div>
                        {/* Circle 4 */}
                        <div className="w-[50px] h-[50px] bg-[#2D3D45] rounded-full flex justify-center items-center hover:scale-105 transition-transform">
                            <img src="/linkedin.svg" alt="Linkedin" className="w-2/5 h-2/5 object-contain" />
                        </div>
                    </div>
                </div>
            </footer>
            </div>
        </div>
    );
};