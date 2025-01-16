import React, { useState } from "react";
import NavigationBar from "../../components/Navbar";

export default function Ticket() {
    const [showPopup, setShowPopup] = useState(false);
    const [ticketDetail, setTicketDetail] = useState(""); // State to track ticket detail
    const maxCharacters = 200; // Maximum character limit

    const handleOpenPopup = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setTicketDetail("");
    };

    const handleTicketDetailChange = (e) => {
        setTicketDetail(e.target.value);
    };

    return (
        <div className="min-h-screen relative">
            <NavigationBar />

            {/* Main Content */}
            <div className="flex justify-center items-center mt-8">
                <div className="w-11/12 bg-white rounded-lg shadow-md p-6">
                    <p className="text-2xl font-semibold">Tickets</p>

                    {/* Ticket Cards */}
                    <div className="mt-4">
                        {/* Ticket Card 1 */}
                        <div className="flex flex-row justify-between items-center border-b border-gray-300 py-4">
                            <div className="pr-4">
                                <p className="font-semibold text-xl">Ticket ID: 1</p>
                                <p className="text-gray-400">Date Created: 2021-09-01</p>
                            </div>

                            <div className="w-2/5 flex flex-col items-center pr-4 border-r border-l border-black">
                                <p className="ml-4 text-sm text-gray-500">Ticket Detail:</p>
                                <p className="ml-4 text-base">Ticket Details bla bla bla bla bla bla bla bla bla
                                    bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla
                                    bla bla bla bla bla bla bla bla
                                </p>
                            </div>

                            <div className="pr-4">
                                <p className="text-sm text-gray-500">Status:</p>
                                <p className="text-base text-[#007B00]">Open</p>
                            </div>

                            <div className="flex items-center">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View</button>
                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Create Ticket Button */}
            <button
                className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg"
                onClick={handleOpenPopup}
            >
                + Create Ticket
            </button>

            {/* Popup for Creating a New Ticket */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-1/3 p-6 rounded-lg shadow-lg relative">
                        <h2 className="text-xl font-semibold mb-4">Create New Ticket</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                                <select className="border rounded w-full py-2 px-3 text-gray-700" required>
                                    <option value="Technical Support">Technical Support</option>
                                    <option value="Billing">Billing</option>
                                    <option value="General Inquiry">General Inquiry</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Detail</label>
                                <textarea
                                    className="border rounded w-full py-2 px-3 text-gray-700"
                                    rows="4"
                                    placeholder="Describe your issue..."
                                    required
                                    value={ticketDetail}
                                    onChange={handleTicketDetailChange}
                                    maxLength={maxCharacters}
                                />
                                <p className="text-right text-sm text-gray-500">
                                    {maxCharacters - ticketDetail.length} characters remaining
                                </p>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
                                    onClick={handleClosePopup}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
