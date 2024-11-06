export default function ViewUpcomingAppointments() {
    return (
        <div className="font-sans h-screen overflow-hidden">
            <div className="bg-[#677A84] w-full h-24"></div>

            <div className="bg-gray-300 w-full p-6">
                <div className="text-xl font-semibold text-black">View Upcoming Appointments</div>
                <div className="text-sm text-black">View all your booked appointments</div>

                {/* Search Bar */}
                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Search by Time or Location"
                        className="w-full p-3 rounded-lg border border-gray-300"
                    />
                </div>
            </div>

            <div className="p-6 text-black">
                <p className="text-lg">
                    Showing all appointments for:{" "}
                    <span className="text-[#DA291C]">Sixth Avenue Branch, Singapore</span>
                </p>
            </div>

            <div className="h-80 overflow-y-auto p-4">
                <div className="space-y-6">
                    {/* Appointment 1 */}
                    <div className="flex items-center bg-white p-6 rounded-lg border border-gray-300 hover:shadow-lg">
                        <div className="w-3/4">
                            <p className="font-semibold">Sixth Avenue Branch</p>
                            <p className="text-sm text-[#707070]">1.1 km  |  827 Bukit Timah Road, Singapore 279886</p>
                        </div>
                        <div className="flex-1 border-l border-[#707070] pl-4">
                            <p className="text-sm text-[#007B00]">13 December 2024, 4.00pm - 4.30pm</p>
                            <p className="text-sm text-[#007B00]">Booked by: Person Name</p>
                        </div>
                        <div className="ml-4 text-[#C7C7C7] text-xl">&gt;</div>
                    </div>

                    {/* Appointment 2 */}
                    <div className="flex items-center bg-white p-6 rounded-lg border border-gray-300 hover:shadow-lg">
                        <div className="w-3/4">
                            <p className="font-semibold">Sixth Avenue Branch</p>
                            <p className="text-sm text-[#707070]">1.1 km  |  827 Bukit Timah Road, Singapore 279886</p>
                        </div>
                        <div className="flex-1 border-l border-[#707070] pl-4">
                            <p className="text-sm text-[#007B00]">13 December 2024, 4.00pm - 4.30pm</p>
                            <p className="text-sm text-[#007B00]">Booked by: Person Name</p>
                        </div>
                        <div className="ml-4 text-[#C7C7C7] text-xl">&gt;</div>
                    </div>

                    {/* Appointment 3 */}
                    <div className="flex items-center bg-white p-6 rounded-lg border border-gray-300 hover:shadow-lg">
                        <div className="w-3/4">
                            <p className="font-semibold">Sixth Avenue Branch</p>
                            <p className="text-sm text-[#707070]">1.1 km  |  827 Bukit Timah Road, Singapore 279886</p>
                        </div>
                        <div className="flex-1 border-l border-[#707070] pl-4">
                            <p className="text-sm text-[#007B00]">13 December 2024, 4.00pm - 4.30pm</p>
                            <p className="text-sm text-[#007B00]">Booked by: Person Name</p>
                        </div>
                        <div className="ml-4 text-[#C7C7C7] text-xl">&gt;</div>
                    </div>

                    {/* Appointment 4 */}
                    <div className="flex items-center bg-white p-6 rounded-lg border border-gray-300 hover:shadow-lg">
                        <div className="w-3/4">
                            <p className="font-semibold">Sixth Avenue Branch</p>
                            <p className="text-sm text-[#707070]">1.1 km  |  827 Bukit Timah Road, Singapore 279886</p>
                        </div>
                        <div className="flex-1 border-l border-[#707070] pl-4">
                            <p className="text-sm text-[#007B00]">13 December 2024, 4.00pm - 4.30pm</p>
                            <p className="text-sm text-[#007B00]">Booked by: Person Name</p>
                        </div>
                        <div className="ml-4 text-[#C7C7C7] text-xl">&gt;</div>
                    </div>

                    {/* Appointment 5 */}
                    <div className="flex items-center bg-white p-6 rounded-lg border border-gray-300 hover:shadow-lg">
                        <div className="w-3/4">
                            <p className="font-semibold">Sixth Avenue Branch</p>
                            <p className="text-sm text-[#707070]">1.1 km  |  827 Bukit Timah Road, Singapore 279886</p>
                        </div>
                        <div className="flex-1 border-l border-[#707070] pl-4">
                            <p className="text-sm text-[#007B00]">13 December 2024, 4.00pm - 4.30pm</p>
                            <p className="text-sm text-[#007B00]">Booked by: Person Name</p>
                        </div>
                        <div className="ml-4 text-[#C7C7C7] text-xl">&gt;</div>
                    </div>

                    {/* Appointment 6 */}
                    <div className="flex items-center bg-white p-6 rounded-lg border border-gray-300 hover:shadow-lg">
                        <div className="w-3/4">
                            <p className="font-semibold">Sixth Avenue Branch</p>
                            <p className="text-sm text-[#707070]">1.1 km  |  827 Bukit Timah Road, Singapore 279886</p>
                        </div>
                        <div className="flex-1 border-l border-[#707070] pl-4">
                            <p className="text-sm text-[#007B00]">13 December 2024, 4.00pm - 4.30pm</p>
                            <p className="text-sm text-[#007B00]">Booked by: Person Name</p>
                        </div>
                        <div className="ml-4 text-[#C7C7C7] text-xl">&gt;</div>
                    </div>

                    {/* Appointment 7 */}
                    <div className="flex items-center bg-white p-6 rounded-lg border border-gray-300 hover:shadow-lg">
                        <div className="w-3/4">
                            <p className="font-semibold">Sixth Avenue Branch</p>
                            <p className="text-sm text-[#707070]">1.1 km  |  827 Bukit Timah Road, Singapore 279886</p>
                        </div>
                        <div className="flex-1 border-l border-[#707070] pl-4">
                            <p className="text-sm text-[#007B00]">13 December 2024, 4.00pm - 4.30pm</p>
                            <p className="text-sm text-[#007B00]">Booked by: Person Name</p>
                        </div>
                        <div className="ml-4 text-[#C7C7C7] text-xl">&gt;</div>
                    </div>

                    {/* "No More Scheduled Appointments" */}
                    <div className="flex items-center bg-white p-6 rounded-lg border border-gray-300 text-center text-[#757575]">
                        No More Scheduled Appointments
                    </div>
                </div>
            </div>
        </div>
    );
}