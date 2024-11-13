import React from 'react';
import { Link } from 'react-router-dom';

const FAQListPage = () => {
    return (
        <div className="font-inter">
            {/* Navbar */}
            <nav className="flex items-center justify-between h-[90px] px-4 lg:px-12 bg-white shadow-md">
                <div className="flex items-center mx-auto justify-between w-full">
                    <div className="flex items-center">
                        <img src="/ocbc-logo.png" alt="OCBC Logo" className="h-6 mr-6" />
                    </div>
                    <div className="flex space-x-16 justify-center w-full text-[18px]">
                        <a href="/" className="text-[#010101] hover:text-[#C30C31]">HOME</a>
                        <a href="/" className="text-[#D00E35] hover:text-[#C30C31]">FAQ</a>
                        <a href="/" className="text-[#010101] hover:text-[#C30C31]">APPOINTMENTS</a>
                        <a href="/" className="text-[#010101] hover:text-[#C30C31]">LIVE CHAT</a>
                        <a href="/" className="text-[#010101] hover:text-[#C30C31]">ABOUT US</a>
                    </div>
                </div>
                <button className="bg-[#D00E35] text-white px-7 py-2 rounded hover:bg-[#C30C31] text-[14px]">LOGIN</button>
            </nav>

            {/* Gray Line */}
            <hr className="border-t-[2px] border-[#DCD6D6]" />

            {/* Title Section */}
            <div className="px-8 mt-6 flex items-center justify-center">
                <div className="flex w-full justify-between items-center">
                    <Link to="/landingpage" className="text-[#000000] text-[20px] hover:text-[#D00E35]">
                        &lt;
                    </Link>
                    <div className="text-center flex-grow">
                        <h1 className="text-[30px] text-[#343434]">General Information</h1>
                        <p className="text-[16px] text-[#999999]">Payments and Transactions</p>
                    </div>
                </div>
            </div>

            <hr className="border-t-[2px] border-[#DCD6D6] mt-4" />

            {/* FAQ List */}
            <div className="overflow-y-scroll max-h-[calc(100vh-250px)] mt-6 px-8 pb-8">
                <div className="space-y-6">
                    {[...Array(10)].map((_, index) => (
                        <a key={index} href="/" className="flex bg-white shadow rounded-lg w-full hover:shadow-lg transition-shadow duration-200">
                            {/* Left Colored Tab */}
                            <div className="w-2 bg-[#D00E35] rounded-l-lg"></div>
                            {/* Content of the Rectangle */}
                            <div className="flex items-center w-full p-4">
                                {/* Title */}
                                <h3 className="font-semibold text-lg pr-32 text-black">Title Text</h3>
                                {/* Divider */}
                                <div className="h-12 border-l border-gray-300 mx-6"></div>
                                {/* Description */}
                                <p className="text-gray-600 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget quam enim.</p>
                            </div>
                        </a>
                    ))}
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