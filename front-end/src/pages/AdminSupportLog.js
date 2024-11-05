export default function AdminSupportLog() {
    return (
        <div className="font-sans h-screen overflow-hidden">
            <div className="bg-[#677A84] w-full h-24"></div> 

            <div className="p-6">

                <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4 text-center">
                    <p className="text-lg text-black font-semibold">Now Viewing: Case ID 1234567890</p>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-6">
                    <div className="text-gray-900 text-lg font-semibold">Chat started with: John Doe</div>
                    <div className="text-gray-500 text-sm mb-4">20 December 2024</div>

                    <div className="space-y-4">
                        {/* Customer Message */}
                        <div>
                            <p className="text-black text-base">Customer: How do I use my mobile app to login to my account?</p>
                            <p className="text-gray-400 text-sm">Sent at 10:00pm</p>
                        </div>

                        {/* Reply Messages */}
                        <div>
                            <p className="text-black text-base">Reply: Lol idk too hahahahah</p>
                            <p className="text-black text-base">Reply: Lol idk too hahahahah</p>
                            <p className="text-gray-400 text-sm">Sent at 10:00pm</p>
                        </div>

                        {/* End Chat */}
                        <div>
                            <p className="text-gray-500 text-sm">End Chat</p>
                        </div>
                    </div>

                    <div className="mt-6 mb-4 border-t border-gray-300"></div>

                    <div className="flex justify-center">
                        <button className="bg-gray-400 text-white font-semibold rounded-lg py-2 px-6 hover:bg-gray-500 transition-colors">
                            Return to Menu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}