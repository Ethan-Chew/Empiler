import React from 'react';

const LandingPage = () => {
    return (
        <div className="bg-white font-inter">

            {/* Navbar */}
            <nav className="flex items-center justify-between h-[90px] px-4 lg:px-12 bg-white shadow-md">
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
            </nav>

            {/* Header Image */}
            <div className="flex mt-6 h-[300px]">
                <img src="/headerimage.png" alt="Header Image" className="w-full h-full object-cover" />
            </div>

            <div className="text-center mt-6 px-4 lg:px-8">
                <hr className="border-t-[2px] border-[#DCD6D6]" />
                <h1 className="text-[36px] text-[#343434] mt-12">How can we help you today?</h1>
                <p className="text-[20px] text-[#999999]">We're here to answer your questions!</p>

                {/* Search Bar */}
                <div className="relative mt-12 mb-12 max-w-4xl mx-auto">
                    <input
                        type="text"
                        placeholder="Example: I'm having problems signing in to my account"
                        className="w-full rounded-full bg-[#F9F9F9] text-[#454040] text-[20px] px-6 py-4 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#D00E35]" /> {/* Increased padding on y-axis */}
                    <span className="absolute right-4 top-2/4 transform -translate-y-2/4 text-[#454040]">
                        <img src="/search.svg" alt="Search Icon" className="w-6 h-6" />
                    </span>
                </div>
                <hr className="border-t-[2px] border-[#DCD6D6] mt-6" />
            </div>

            <div className="text-center mt-10">
                <div className="flex justify-center items-center space-x-6 mt-4">
                    <div className="w-[200px] h-[8px] bg-[#D00E35]" />
                    <h2 className="text-[40px]">General Information</h2>
                    <div className="w-[200px] h-[8px] bg-[#D00E35]" />
                </div>

                {/* Buttons */}
                <div className="flex justify-between space-x-8 mt-8 mx-12">
                    {/* General Button */}
                    <div className="bg-white shadow-lg rounded-xl p-6 w-[400px] h-[250px] hover:shadow-2xl transition-shadow duration-300">
                        <div className="w-[46px] h-[46px] bg-gray-300 mb-4" />
                        <h3 className="text-[24px] font-semibold text-left">General</h3>
                        <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                            Change personal details, or settle fees and charges
                        </p>
                        <a href="/" className="text-[#D00E35] text-[18px] font-regular mt-4 block text-left">
                            Explore General &rarr;
                        </a>
                    </div>

                    {/* Banking Button */}
                    <div className="bg-white shadow-lg rounded-xl p-6 w-[400px] h-[250px] hover:shadow-2xl transition-shadow duration-300">
                        <div className="w-[46px] h-[46px] bg-gray-300 mb-4" />
                        <h3 className="text-[24px] font-semibold text-left">Banking</h3>
                        <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                            Change your Access Code, Password, PIN or other details
                        </p>
                        <a href="/" className="text-[#D00E35] text-[18px] font-regular mt-4 block text-left">
                            Explore Banking &rarr;
                        </a>
                    </div>

                    {/* Payments & Transactions Button */}
                    <div className="bg-white shadow-lg rounded-xl p-6 w-[400px] h-[250px] hover:shadow-2xl transition-shadow duration-300">
                        <div className="w-[46px] h-[46px] bg-gray-300 mb-4" />
                        <h3 className="text-[24px] font-semibold text-left">Payments & Transactions</h3>
                        <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                            View our Pricing Guide, or remit money overseas
                        </p>
                        <a href="/" className="text-[#D00E35] text-[18px] font-regular mt-4 block text-left">
                            Explore Payments & Transactions &rarr;
                        </a>
                    </div>
                </div>
            </div>

            {/* Safety and Security Section */}
            <div className="text-center mt-10">
                <div className="flex justify-center items-center space-x-6 mt-4">
                    <div className="w-[200px] h-[8px] bg-[#DCD6D6]" />
                    <h2 className="text-[40px]">Safety and Security</h2>
                    <div className="w-[200px] h-[8px] bg-[#DCD6D6]" />
                </div>

                <div className="flex justify-between space-x-8 mt-8 mx-12">
                    {/* Getting Started Button */}
                    <div className="bg-white shadow-lg rounded-xl p-6 w-[400px] h-[250px] hover:shadow-2xl transition-shadow duration-300">
                        <div className="w-[46px] h-[46px] bg-gray-300 mb-4" />
                        <h3 className="text-[24px] font-semibold text-left">Getting Started</h3>
                        <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                            Protect transactions with OCBC OneToken
                        </p>
                        <a href="/" className="text-[#D00E35] text-[18px] font-regular mt-4 block text-left">
                            Explore Getting Started &rarr;
                        </a>
                    </div>

                    {/* Accounts & Cards Security Button */}
                    <div className="bg-white shadow-lg rounded-xl p-6 w-[400px] h-[250px] hover:shadow-2xl transition-shadow duration-300">
                        <div className="w-[46px] h-[46px] bg-gray-300 mb-4" />
                        <h3 className="text-[24px] font-semibold text-left">Accounts & Cards Security</h3>
                        <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                            Learn about the security benefits of cooling-off periods
                        </p>
                        <a href="/" className="text-[#D00E35] text-[18px] font-regular mt-4 block text-left">
                            Explore Accounts & Cards Security &rarr;
                        </a>
                    </div>

                    {/* Scams Button */}
                    <div className="bg-white shadow-lg rounded-xl p-6 w-[400px] h-[250px] hover:shadow-2xl transition-shadow duration-300">
                        <div className="w-[46px] h-[46px] bg-gray-300 mb-4" />
                        <h3 className="text-[24px] font-semibold text-left">Scams</h3>
                        <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                            Prevent phishing scams and stay safe when shopping online
                        </p>
                        <a href="/" className="text-[#D00E35] text-[18px] font-regular mt-4 block text-left">
                            Explore Scams &rarr;
                        </a>
                    </div>
                </div>
            </div>

            <div className="flex mt-12 bg-gray-100 rounded-lg w-full mx-auto p-6 lg:p-8">
                {/* Image Section */}
                <div className="w-[33%] h-[400px] mr-6 rounded-lg">
                    <img src="/ocbcsteps.jpg" alt="OCBC Steps" className="w-full h-full object-contain" />
                </div>

                {/* Text and Button Section */}
                <div className="flex flex-col justify-between w-[calc(67%)]">
                    <h2 className="text-[36px]">Still can't find what you're looking for?</h2>
                    <div className="flex space-x-6 mt-4">
                        {/* Button 1: Live Chat */}
                        <button className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl text-left w-[calc(50%-1rem)] h-[300px]">
                            <div className="w-16 h-16 mb-6">
                                <img src="/chat.svg" alt="Chat Icon" className="w-full h-full object-contain" />
                            </div>
                            <p className="text-[24px] font-semibold mb-2">Start a Live Chat</p>
                            <p className="text-[18px] text-gray-500 mb-4">Estimated Waiting Time: 2 Minutes</p>
                            <p className="text-[#D00E35] text-[20px]">Explore Live Chat &rarr;</p>
                        </button>

                        {/* Button 2: Book an Appointment */}
                        <button className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl text-left w-[calc(50%-1rem)] h-[300px]">
                            <div className="w-16 h-16 mb-6">
                                <img src="/calendar.svg" alt="Calendar Icon" className="w-full h-full object-contain" />
                            </div>
                            <p className="text-[24px] font-semibold mb-2">Book an Appointment</p>
                            <p className="text-[18px] text-gray-500 mb-4">With one of our friendly staff members</p>
                            <p className="text-[#D00E35] text-[20px]">Explore Appointment &rarr;</p>
                        </button>
                    </div>
                </div>
            </div>

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
    );
};

export default LandingPage;