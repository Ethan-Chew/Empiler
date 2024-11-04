export default function ViewOutstandingChatCustomers() {
    return (
        <div className="font-sans h-screen overflow-hidden">
            <div className="bg-custom-blue-gray w-full h-24"></div>

            <div className="bg-gray-300 w-full p-6">
                <div className="flex items-center">
                    <div className="text-black">
                        <p className="text-2xl font-semibold">Customers in List:</p>
                    </div>
                    <div className="ml-4 w-48 h-10 bg-white rounded-lg shadow-md"></div>
                </div>
            </div>

            <div className="p-6">
                <p className="text-xl font-semibold text-black">
                    Showing all outstanding chat customers:
                </p>
            </div>

            <div className="overflow-y-auto h-[55vh] mx-6 space-y-4">
                {[...Array(7)].map((_, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow cursor-pointer flex justify-between items-center"
                    >
                        <div>
                            <p className="text-lg font-semibold text-black">Person Name</p>
                            <p className="text-sm text-gray-500">Customer ID: #12345</p>
                        </div>

                        <div className="w-px h-12 bg-[#707070] mx-6"></div>

                        <div className="text-right">
                            <p className="text-sm text-green-700">
                                13 December 2024, 4.00pm - 4.30pm
                            </p>
                            <p className="text-sm text-gray-500">Pending Chat</p>
                        </div>

                        <div className="text-gray-400 text-lg">&gt;</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
