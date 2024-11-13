import React from 'react';

const CustomerLandingPage = () => {
    return (
        <div className="bg-white font-inter">
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
                <button className="bg-[#D00E35] text-white px-7 py-2 rounded hover:bg-[#C30C31] text-[14px]">LOGOUT</button>
            </nav>

            <div className="text-left mt-6 px-4 lg:px-8">
                <h1 className="text-[48px] text-[#343434]">Good Afternoon, UserName!</h1>
                <p className="text-[20px] text-[#999999] mt-2">What would you like to do today?</p>
                <hr className="border-t-[2px] border-[#DCD6D6] mt-12" />
            </div>

            {/* Buttons */}
            <div className="text-center mt-10">
                <div className="flex justify-center items-center space-x-6 mt-4">
                    <div className="w-[200px] h-[8px] bg-[#D00E35]" />
                    <h2 className="text-[40px]">Quick Actions</h2>
                    <div className="w-[200px] h-[8px] bg-[#D00E35]" />
                </div>

                <div className="flex justify-between space-x-8 mt-8 mx-12">
                    <div className="bg-white shadow-lg rounded-xl p-6 w-[400px] h-[250px] hover:shadow-2xl transition-shadow duration-300">
                        <div className="w-[46px] h-[46px] bg-gray-300 mb-4" />
                        <h3 className="text-[24px] font-semibold text-left">View and Edit Profile</h3>
                        <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                            Change your profile picture and description
                        </p>
                    </div>

                    <div className="bg-white shadow-lg rounded-xl p-6 w-[400px] h-[250px] hover:shadow-2xl transition-shadow duration-300">
                        <div className="w-[46px] h-[46px] bg-gray-300 mb-4" />
                        <h3 className="text-[24px] font-semibold text-left">Book an Appointment</h3>
                        <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                            Schedule an appointment for any queries you might have
                        </p>
                    </div>

                    <div className="bg-white shadow-lg rounded-xl p-6 w-[400px] h-[250px] hover:shadow-2xl transition-shadow duration-300">
                        <div className="w-[46px] h-[46px] bg-gray-300 mb-4" />
                        <h3 className="text-[24px] font-semibold text-left">View and Edit Appointments</h3>
                        <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                            Re-schedule an appointment to an alternative timeslot
                        </p>
                    </div>
                </div>

                <div className="flex justify-between space-x-8 mt-8 mx-12">
                    <div className="bg-white shadow-lg rounded-xl p-6 w-[400px] h-[250px] hover:shadow-2xl transition-shadow duration-300">
                        <div className="w-[46px] h-[46px] bg-gray-300 mb-4" />
                        <h3 className="text-[24px] font-semibold text-left">Account Settings</h3>
                        <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                            Change personal details such as emails and passwords
                        </p>
                    </div>

                    <div className="bg-white shadow-lg rounded-xl p-6 w-[400px] h-[250px] hover:shadow-2xl transition-shadow duration-300">
                        <div className="w-[46px] h-[46px] bg-gray-300 mb-4" />
                        <h3 className="text-[24px] font-semibold text-left">Start a Live Chat</h3>
                        <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                            Start a live chat session for any queries you might have
                        </p>
                    </div>

                    <div className="bg-white shadow-lg rounded-xl p-6 w-[400px] h-[250px] hover:shadow-2xl transition-shadow duration-300">
                        <div className="w-[46px] h-[46px] bg-gray-300 mb-4" />
                        <h3 className="text-[24px] font-semibold text-left">View Live Chat Logs</h3>
                        <p className="text-[18px] font-light text-left text-gray-500 mt-2">
                            View the logs of all your past chats and conversations
                        </p>
                    </div>
                </div>
                <hr className="border-t-[2px] border-[#DCD6D6] mt-16" />
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
}

export default CustomerLandingPage;