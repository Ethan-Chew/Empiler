export default function CustomerMenuPage() {
    return (
        <div className="h-screen overflow-hidden font-sans">
            <div className="w-full h-16 bg-[#677A84]"></div>

            {/* Hero Image */}
            <img
                src="/FAQHeader.png"
                alt="Hero"
                className="w-full h-24 sm:h-32 md:h-40 lg:h-48 object-cover object-center rounded-lg"
            />

            <div className="px-6 py-4">
                <p className="text-2xl">
                    <span className="font-semibold">Good Morning,</span> CustomerName!
                </p>
            </div>

            {/* Buttons Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-6">

                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform">
                    <img src="/scheduleAppointment.svg" alt="Schedule Appointment" className="w-12 h-12 mb-4" />
                    <p className="text-center text-lg font-semibold">Schedule an Appointment</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform">
                    <img src="/rescheduleappointment.svg" alt="View Appointments" className="w-12 h-12 mb-4" />
                    <p className="text-center text-lg font-semibold">View Upcoming Appointments</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform">
                    <img src="/editProfile.svg" alt="Edit Profile" className="w-12 h-12 mb-4" />
                    <p className="text-center text-lg font-semibold">View and Edit Profile</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform">
                    <img src="/startLiveChat.svg" alt="Live Chat" className="w-12 h-12 mb-4" />
                    <p className="text-center text-lg font-semibold">Start a Live Chat</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform">
                    <img src="/chatHistory.svg" alt="Chat History" className="w-12 h-12 mb-4" />
                    <p className="text-center text-lg font-semibold">View Latest Chat History</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform">
                    <img src="/settings.svg" alt="Settings" className="w-12 h-12 mb-4" />
                    <p className="text-center text-lg font-semibold">Settings</p>
                </div>
            </div>

            <div className="w-full h-16 bg-[#677A84] mt-6"></div>
        </div>
    );
}