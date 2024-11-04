import NavigationBar from "../components/Navbar";

export default function AppointmentBooking() {
    return (
        <>
            <NavigationBar />
            <div className="flex flex-col items-center font-inter overflow-x-hidden w-full">
                {/* Header and Title */}
                <div className="w-full bg-gray-200 text-left py-5">
                    <h1 className="text-4xl font-semibold text-black mb-2 px-5">Schedule an Appointment</h1>
                    <p className="text-2xl font-light text-gray-900 px-5">Schedule an appointment at an OCBC Branch near you.</p>
                </div>

                {/* Main Content */}
                <div className="flex w-full mt-5 px-5">
                    <div className="w-1/2 pr-5">
                        <p className="text-xl font-semibold text-black mb-2">Select a Branch</p>
                        <p className="text-base font-light text-black mb-2">
                            Showing OCBC Branches near <span className="text-[#DA291C]">Ngee Ann Polytechnic, Singapore.</span>
                        </p>

                        <div className="mt-3 h-[40vh] overflow-y-scroll pr-2">
                            {[...Array(7)].map((_, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-lg p-4 mb-3 transition-transform duration-300 ease-in-out cursor-pointer hover:scale-[1.02] hover:shadow-xl"
                                >
                                    <p className="font-semibold text-black">OCBC Branch {index + 1}</p>
                                    <p className="text-gray-500">1.1 km | 827 Bukit Timah Road, Singapore 279886</p>
                                    <p className="text-green-700">Available today, 3:00 PM</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-1/2 flex justify-center items-center">
                        <div className="w-full h-full max-w-[400px] max-h-[40vh] bg-gray-300 rounded-xl flex items-center justify-center text-gray-500 text-xl text-center">
                            Location Image
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}