export default function StaffLandingPage() {
    return (
        <div className="font-sans h-screen overflow-hidden">
            <div className="bg-custom-blue-gray w-full h-12"></div>

            {/* Header Image */}
            <img 
                src="/FAQHeader.png" 
                alt="Hero" 
                className="w-full h-24 sm:h-32 md:h-40 lg:h-48 object-cover object-center rounded-lg" 
            />

            <div className="flex justify-between items-center p-6">
                <p className="text-2xl">
                    <span className="font-semibold">Good Morning,</span> Admin!
                </p>
                <div className="flex gap-4">
                    
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white cursor-pointer hover:scale-110 transition-transform">
                        <img src="/startLiveChat.svg" alt="Chat" className="w-8 h-8" />
                    </div>
                    
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white cursor-pointer hover:scale-110 transition-transform">
                        <img src="/notifications.svg" alt="Notifications" className="w-8 h-8" />
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex p-6 space-x-6">
                <div className="w-3/4 flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-6">
                        
                        <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:scale-105 transition-transform">
                            <p className="text-lg font-semibold text-gray-800">Manage Accounts</p>
                            <p className="text-sm text-gray-600">Manage your associated accounts</p>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:scale-105 transition-transform">
                            <p className="text-lg font-semibold text-gray-800">Manage Schedules</p>
                            <p className="text-sm text-gray-600">View and adjust schedules</p>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:scale-105 transition-transform">
                            <p className="text-lg font-semibold text-gray-800">Manage Tasks</p>
                            <p className="text-sm text-gray-600">View and assign tasks</p>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:scale-105 transition-transform">
                            <p className="text-lg font-semibold text-gray-800">View Reports</p>
                            <p className="text-sm text-gray-600">Analyze recent data</p>
                        </div>
                    </div>

                    {/* Taskbar */}
                    <div className="bg-white rounded-lg shadow-md p-4 mt-4 flex justify-between items-center">
                        {[...Array(5)].map((_, idx) => (
                            <div
                                key={idx}
                                className="w-12 h-12 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                            ></div>
                        ))}
                    </div>
                </div>

                {/* To-Do List */}
                <div className="w-1/4 bg-white rounded-lg shadow-md p-4">
                    <p className="text-lg font-semibold text-gray-800 mb-4">Your To-Do List:</p>
                    <div className="flex flex-col gap-3">
                        {[...Array(4)].map((_, idx) => (
                            <div
                                key={idx}
                                className="bg-red-500 text-white p-4 rounded-lg cursor-pointer hover:scale-105 transition-transform"
                            >
                                TaskName
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}