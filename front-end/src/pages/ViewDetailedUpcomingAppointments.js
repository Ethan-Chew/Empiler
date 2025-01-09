export default function ViewDetailedUpcomingAppointments() {
    return (
        <div className="h-screen overflow-hidden font-sans">
            <div className="bg-custom-blue-gray w-full h-24 flex items-center px-6">
                <button className="text-white text-3xl mr-4">&lt;</button>
            </div>

            <div className="bg-gray-300 w-full py-4">
                <p className="text-3xl font-semibold text-left pl-6">Appointment Details</p>
            </div>

            <div className="mx-6 my-8 bg-white border border-gray-400 rounded-lg shadow-md p-8 h-[65vh] flex flex-col justify-between">
                <div>
                    <p className="text-2xl font-semibold text-gray-900">Sixth Avenue Branch</p>
                    <p className="text-lg text-gray-500 mt-2">1.1 km | 827 Bukit Timah Road, Singapore 279886</p>
                    <p className="text-lg text-green-700 mt-4">
                        13 December 2024, 4.00pm - 4.30pm
                        <br />
                        Booked by: Person Name
                    </p>
                </div>
                
                <div className="flex gap-4">
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-6 rounded-lg shadow transition flex flex-col items-center min-h-[200px]">
                        <img src="/cancelappointment.svg" alt="Cancel Icon" className="w-16 h-16 mb-4 mx-auto" />
                        <span className="text-2xl mt-2">Cancel Appointment</span>
                    </button>
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-6 rounded-lg shadow transition flex flex-col items-center min-h-[200px]">
                        <img src="/rescheduleappointment.svg" alt="Reschedule Icon" className="w-16 h-16 mb-4 mx-auto" />
                        <span className="text-2xl mt-2">Reschedule Appointment</span>
                    </button>
                </div>
            </div>

            <div className="bg-custom-blue-gray w-full h-24"></div>
        </div>
    );
}