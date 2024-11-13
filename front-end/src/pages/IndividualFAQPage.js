import React from 'react';
import { Link } from 'react-router-dom';

const IndividualFAQPage = () => {
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
                    <h3 className="text-[24px] text-[#343434]">Title Text</h3>

                    {/* Divider */}
                    <div className="w-full h-[2px] bg-[#DADADA]" />

                    {/* Filler Text */}
                    <p className="text-[16px] text-[#060313]">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nullam venenatis mauris at est volutpat, at feugiat ex
                        vulputate. Duis non dui eget ipsum vulputate dignissim
                        vel a velit. Sed sollicitudin orci turpis, nec convallis
                        nisi fermentum ac. Morbi consequat, quam ut vestibulum
                        tempor, dui nisi dignissim erat, sed tristique elit risus
                        sed lorem. Donec sagittis ligula non lectus vehicula, a
                        malesuada mi laoreet.
                    </p>

                    <p className="text-[16px] text-[#060313]">
                        Proin pharetra nisl nec neque accumsan, id fringilla felis
                        pharetra. Vestibulum in sapien vel nulla aliquam egestas
                        vel ac arcu. Aenean id vestibulum lectus. Mauris malesuada
                        scelerisque eros, ac bibendum sapien congue non.
                    </p>

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

            {/* Footer */}
            <footer className="py-12 bg-gray-50">
                <div className="flex justify-between items-start px-8 lg:px-16">
                    <div>
                        <img src="/ocbc-logo.png" alt="OCBC Logo" className="w-[280px] h-[76px]" />
                        <h3 className="text-[50px] mt-4">Group</h3>
                    </div>
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
                    <div className="flex flex-col space-y-6">
                        <div className="w-[50px] h-[50px] bg-[#2D3D45] rounded-full flex justify-center items-center hover:scale-105 transition-transform">
                            <img src="/facebook.svg" alt="Facebook" className="w-2/5 h-2/5 object-contain" />
                        </div>
                        <div className="w-[50px] h-[50px] bg-[#2D3D45] rounded-full flex justify-center items-center hover:scale-105 transition-transform">
                            <img src="/youtube.svg" alt="YouTube" className="w-2/5 h-2/5 object-contain" />
                        </div>
                        <div className="w-[50px] h-[50px] bg-[#2D3D45] rounded-full flex justify-center items-center hover:scale-105 transition-transform">
                            <img src="/twitter.svg" alt="Twitter" className="w-2/5 h-2/5 object-contain" />
                        </div>
                        <div className="w-[50px] h-[50px] bg-[#2D3D45] rounded-full flex justify-center items-center hover:scale-105 transition-transform">
                            <img src="/linkedin.svg" alt="LinkedIn" className="w-2/5 h-2/5 object-contain" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default IndividualFAQPage;