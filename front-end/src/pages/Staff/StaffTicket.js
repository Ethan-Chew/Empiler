import StaffNavigationBar from "../../components/StaffNavbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function StaffTicket() {
    const [tickets, setTickets] = useState([]);
    const [ticketStatusTab, setTicketStatusTab] = useState("Open");
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showViewPopup, setShowViewPopup] = useState(false);
    const [reply, setReply] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [showCancelPopup, setShowCancelPopup] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [categories, setCategories] = useState([]);
    const [sortOrder, setSortOrder] = useState("desc");



    const getUserIdFromSession = () => {
        const user = JSON.parse(sessionStorage.getItem("userDetails"));
        return user ? user.id : null;
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

    const filteredAndSortedTickets = tickets
        .filter(
            (ticket) =>
                (filterCategory === "All" || ticket.category === filterCategory) &&
                ticket.status === ticketStatusTab // Filter by Open/Closed
        )
        .sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });

    const handleTabChange = (status) => {
        setTicketStatusTab(status);
    };


    useEffect(() => {
        // Fetch tickets from API
        async function fetchTickets() {
            try{
                const response = await fetch("http://localhost:8080/api/tickets/tickets");
                const data = await response.json();
                if (Array.isArray(data)) {
                    setTickets(data);
                } else {
                    setTickets([]); // Default to empty array if data is not an array
                }
            } catch (error) {
                console.error("Failed to fetch tickets:", error);
                setTickets([]); // Handle error by setting tickets to empty array
            } finally {
                setIsLoading(false);
            }
        }
        fetchTickets();
        fetchCategories();
    }, []);

    const handleViewTicket = (ticket) => {
        setSelectedTicket(ticket);
        setShowViewPopup(true);
    };

    const handleClosePopup = () => {
        setSelectedTicket(null);
        setReply("");
        setShowViewPopup(false);
    };

    const handleReply = async () => {
        // Handle reply submission
        const updatedTicket = { ...selectedTicket, reply, adminId: getUserIdFromSession(), updatedAt: new Date().toISOString(), status: "Closed" };
        // Replace with your API endpoint
        await fetch(`http://localhost:8080/api/tickets/${selectedTicket.ticketId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTicket),
        });
        // Update ticket list after reply
        setTickets((prevTickets) =>
            prevTickets.map((t) =>
                t.ticketId === selectedTicket.ticketId ? updatedTicket : t
            )
        );
        handleClosePopup();
    };

    const handleCancelTicket = async () => {
        if (!cancelReason.trim()) {
            alert("Cancellation reason is required.");
            return;
        }
    
        const updatedTicket = {
            ...selectedTicket,
            reply: cancelReason,
            adminId: getUserIdFromSession(),
            updatedAt: new Date().toISOString(),
            status: "Cancelled",
        };

        console.log(updatedTicket);
    
        try {
            // Replace with your API endpoint
            await fetch(`http://localhost:8080/api/tickets/${selectedTicket.ticketId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedTicket),
            });
    
            // Update ticket list after cancellation
            setTickets((prevTickets) =>
                prevTickets.map((t) =>
                    t.ticketId === selectedTicket.ticketId ? updatedTicket : t
                )
            );
    
            alert("Ticket successfully cancelled.");
            handleClosePopup();
            setShowCancelPopup(false);
        } catch (error) {
            console.error("Failed to cancel ticket:", error);
            alert("An error occurred while cancelling the ticket.");
        }
    };
    
    const openCancelPopup = (ticket) => {
        setSelectedTicket(ticket);
        setCancelReason("");
        setShowCancelPopup(true);
    };

    return (
        <div className="staff-ticket">
            <StaffNavigationBar />
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-6">Staff Ticket Management</h1>

                {/* Tab Navigation */}
                <div className="flex space-x-4 mb-4">
                    <button
                        className={`px-4 py-2 rounded-lg font-semibold ${
                            ticketStatusTab === "Open"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}
                        onClick={() => handleTabChange("Open")}
                    >
                        Open Tickets
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg font-semibold ${
                            ticketStatusTab === "Closed"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}
                        onClick={() => handleTabChange("Closed")}
                    >
                        Closed Tickets
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg font-semibold ${
                            ticketStatusTab === "Cancelled"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}
                        onClick={() => handleTabChange("Cancelled")}
                    >
                        Cancelled Tickets
                    </button>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                    {/* Category Filter */}
                    <div>
                        <label className="mr-2 text-gray-700 font-semibold">Filter by Category:</label>
                        <select
                            className="border p-2 rounded"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="All">All</option>
                            {categories.map((category) => (
                                <option key={category.category} value={category.category}>
                                    {category.category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort by Date */}
                    <div>
                        <label className="mr-2 text-gray-700 font-semibold">Sort by Date:</label>
                        <select
                            className="border p-2 rounded"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="desc">Newest First</option>
                            <option value="asc">Oldest First</option>
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <p>Loading tickets...</p>
                ) : (
                    <>
                        {tickets.length === 0 ? (
                            <p>No tickets available.</p>
                        ) : (
                            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-600 text-left text-sm uppercase tracking-wider">
                                        <th className="py-3 px-4">Ticket ID</th>
                                        <th className="py-3 px-4">Category</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4">Created At</th>
                                        <th className="py-3 px-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAndSortedTickets.map((ticket) => (
                                        <tr key={ticket.ticketId} className="hover:bg-gray-100">
                                            <td className="py-3 px-4">{ticket.ticketId}</td>
                                            <td className="py-3 px-4">{ticket.category}</td>
                                            <td className="py-3 px-4">{ticket.status}</td>
                                            <td className="py-3 px-4">
                                                {new Date(ticket.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4 flex space-x-2">
                                                <button
                                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                                    onClick={() => handleViewTicket(ticket)}
                                                >
                                                    View
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                                                    onClick={() => openCancelPopup(ticket)}
                                                >
                                                    Cancel
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </>
                )}
            </div>

            {showViewPopup && selectedTicket && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-1/3 p-6 rounded-lg shadow-lg relative">
                        <h2 className="text-xl font-semibold mb-4">Ticket Details</h2>
                        <p className="mb-4">
                            <strong>Ticket ID:</strong> {selectedTicket.ticketId}
                        </p>
                        <p className="mb-4">
                            <strong>Category:</strong> {selectedTicket.category}
                        </p>
                        <p className="mb-4">
                            <strong>Status:</strong> {selectedTicket.status}
                        </p>
                        <p className="mb-4">
                            <strong>Created At:</strong>{" "}
                            {new Date(selectedTicket.createdAt).toLocaleDateString()}
                        </p>
                        <p className="mb-4">
                            <strong>Details:</strong> {selectedTicket.detail}
                        </p>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Reply
                            </label>
                            <textarea
                                className="w-full border rounded p-2"
                                rows="4"
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded"
                                onClick={handleClosePopup}
                            >
                                Close
                            </button>
                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
                                onClick={handleReply}
                            >
                                Submit Reply
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showCancelPopup && selectedTicket && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-1/3 p-6 rounded-lg shadow-lg relative">
                        <h2 className="text-xl font-semibold mb-4">Cancel Ticket</h2>
                        <p className="mb-4">
                            <strong>Ticket ID:</strong> {selectedTicket.ticketId}
                        </p>
                        <p className="mb-4">
                            <strong>Category:</strong> {selectedTicket.category}
                        </p>
                        <p className="mb-4">
                            <strong>Status:</strong> {selectedTicket.status}
                        </p>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Reason for Cancellation
                            </label>
                            <textarea
                                className="w-full border rounded p-2"
                                rows="4"
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded"
                                onClick={() => setShowCancelPopup(false)}
                            >
                                Close
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded"
                                onClick={handleCancelTicket}
                            >
                                Cancel Ticket
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
