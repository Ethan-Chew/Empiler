import React, { useState, useEffect } from "react";
import NavigationBar from "../../components/Navbar";

export default function Ticket() {
    const [showPopup, setShowPopup] = useState(false);
    const [ticketDetail, setTicketDetail] = useState(""); // State to track ticket detail
    const maxCharacters = 200; // Maximum character limit
    const [tickets, setTickets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTicket, setSelectedTicket] = useState("");
    const [showViewPopup, setShowViewPopup] = useState(false);
    const [filterStatus, setFilterStatus] = useState(""); // Filter status (Open, Closed, etc.)
    const [sortCriteria, setSortCriteria] = useState("createdAt"); // Sort criteria (createdAt, status, etc.)

    const getUserIdFromSession = () => {
        const user = JSON.parse(sessionStorage.getItem("userDetails"));
        return user ? user.id : null;
    }

    const fetchTickets = async () => {
        const custId = getUserIdFromSession();
        if (!custId) {
            console.error("User ID not found in session storage");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/tickets/customer/${custId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch tickets");
            }
            const data = await response.json();
            setTickets(data);
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/tickets/categories");
            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    const handleViewTicket = async (ticketId) => {
        console.log("View ticket with ID:", ticketId);
        try {
            const response = await fetch(`http://localhost:8080/api/tickets/${ticketId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch ticket");
            }
            const data = await response.json();
            setSelectedTicket(data);
            setShowViewPopup(true);
        } catch (error) {
            console.error("Error fetching ticket:", error);
        }
    }

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        const custId = getUserIdFromSession();
        if (!custId) {
            console.error("User ID not found in session storage");
            return;
        }

        const ticket = {
            custId: custId,
            category: selectedCategory,
            detail: ticketDetail,
            status: "Open"
        };

        try {
            const response = await fetch("http://localhost:8080/api/tickets/tickets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(ticket)
            });
            if (!response.ok) {
                throw new Error("Failed to create ticket");
            }
            console.log("Ticket created successfully");

            // Fetch tickets again to update the list
            await fetchTickets();

            // Close the popup
            setShowPopup(false);
            setTicketDetail("");
            setSelectedCategory("");
        } catch (error) {
            console.error("Error creating ticket:", error);
        }
    }

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

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleDeleteTicket = async (ticketId) => {

        try {
            const response = await fetch(`http://localhost:8080/api/tickets/${ticketId}`, {
                method: "DELETE"
            });
            if (!response.ok) {
                throw new Error("Failed to delete ticket");
            }
            console.log("Ticket deleted successfully");

            // Fetch tickets again to update the list
            setTickets((prevTickets) => prevTickets.filter(ticket => ticket.ticketId !== ticketId));

        } catch (error) {
            console.error("Error deleting ticket:", error);
        }
    }

    const handleCloseViewPopup = () => {
        setShowViewPopup(false); // Close the view ticket popup
        setSelectedTicket(null); // Clear selected ticket data
    }

    // Filter tickets based on status
    const filteredTickets = filterStatus ? tickets.filter(ticket => ticket.status === filterStatus) : tickets;

    // Sort tickets based on selected criteria
    const sortedTickets = filteredTickets.sort((a, b) => {
        if (sortCriteria === "createdAt") {
            return new Date(b.createdAt) - new Date(a.createdAt); // Sort by creation date (newest first)
        } else if (sortCriteria === "status") {
            return a.status.localeCompare(b.status); // Sort by status alphabetically
        }
        return 0;
    });

    useEffect(() => {
        fetchTickets();
        fetchCategories();
    }, []);

    return (
        <div className="min-h-screen relative">
            <NavigationBar />

            {/* Main Content */}
            <div className="flex justify-center items-center mt-8">
                <div className="w-11/12 bg-white rounded-lg shadow-md p-6">
                    <p className="text-2xl font-semibold">Tickets</p>

                    {/* Filter and Sort Options */}
                    <div className="flex justify-between mt-4 mb-4">
                        <div className="flex items-center">
                            <label className="mr-2">Filter by Status:</label>
                            <select
                                className="border rounded py-2 px-3"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">All</option>
                                <option value="Open">Open</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                        <div className="flex items-center">
                            <label className="mr-2">Sort by:</label>
                            <select
                                className="border rounded py-2 px-3"
                                value={sortCriteria}
                                onChange={(e) => setSortCriteria(e.target.value)}
                            >
                                <option value="createdAt">Creation Date</option>
                                <option value="status">Status</option>
                            </select>
                        </div>
                    </div>

                    {/* Ticket Cards */}
                    <div className="mt-4">
                        {sortedTickets.length > 0 ? (
                            sortedTickets.map((ticket) => (
                                <div
                                    key={ticket.ticketId}
                                    className="flex flex-row justify-between items-center border-b border-gray-300 py-4"
                                >
                                    <div className="pr-4">
                                        <p className="font-semibold text-xl">
                                            Ticket ID: {ticket.ticketId}
                                        </p>
                                        <p className="text-gray-400">
                                            Date Created: {new Date(ticket.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="w-2/5 flex flex-col items-center pr-4 border-r border-l border-black">
                                        <p className="ml-4 text-sm text-gray-500">Ticket Detail:</p>
                                        <p className="ml-4 text-base">{ticket.detail}</p>
                                    </div>

                                    <div className="pr-4">
                                        <p className="text-sm text-gray-500">Status:</p>
                                        <p
                                            className={`text-base ${ticket.status === "Open" ? "text-green-500" : ticket.status === "Closed" ? "text-red-500" : "text-gray-500"}`}
                                        >
                                            {ticket.status}
                                        </p>
                                    </div>

                                    <div className="flex items-center">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={() => handleViewTicket(ticket.ticketId)}>
                                            View
                                        </button>
                                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                                            onClick={() => handleDeleteTicket(ticket.ticketId)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No tickets found.</p>
                        )}
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
                                <label className="block text-gray-700" htmlFor="category">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    className="w-full border rounded py-2 px-3"
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category.category} value={category.category}>
                                            {category.category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700" htmlFor="ticket-detail">
                                    Ticket Detail (Max 200 characters)
                                </label>
                                <textarea
                                    id="ticket-detail"
                                    className="w-full border rounded py-2 px-3"
                                    rows="4"
                                    value={ticketDetail}
                                    onChange={handleTicketDetailChange}
                                    maxLength={maxCharacters}
                                ></textarea>
                                <p className="text-right text-gray-500">{ticketDetail.length}/{maxCharacters}</p>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
                                    onClick={handleCreateTicket}
                                >
                                    Create Ticket
                                </button>
                                <button
                                    type="button"
                                    className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded"
                                    onClick={handleClosePopup}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Popup for Viewing a Ticket */}
            {showViewPopup && selectedTicket && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-1/3 p-6 rounded-lg shadow-lg relative">
                        <h2 className="text-xl font-semibold mb-4">Ticket Details</h2>
                        <p className="mb-4"><strong>Ticket ID:</strong> {selectedTicket.ticketId}</p>
                        <p className="mb-4"><strong>Category:</strong> {selectedTicket.category}</p>
                        <p className="mb-4"><strong>Status:</strong> {selectedTicket.status}</p>
                        <p className="mb-4"><strong>Created At:</strong> {new Date(selectedTicket.createdAt).toLocaleDateString()}</p>
                        <p className="mb-4"><strong>Updated At:</strong> {selectedTicket.updatedAt ? new Date(selectedTicket.updatedAt).toLocaleDateString() : 'Not updated'}</p>
                        <p className="mb-4"><strong>Details:</strong> {selectedTicket.detail}</p>
                        <p className="mb-4"><strong>Reply:</strong> {selectedTicket.reply || 'No reply yet'}</p>
                        
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded"
                                onClick={handleCloseViewPopup}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
