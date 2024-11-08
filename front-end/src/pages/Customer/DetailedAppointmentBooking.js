import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function DetailedAppointmentBooking() {
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [branchDetails, setBranchDetails] = useState(null);
    const [availableDates, setAvailableDates] = useState([]);
    const [timeslots, setTimeslots] = useState([]);
    const [loadingTimeslots, setLoadingTimeslots] = useState(false);
    const [showModal, setShowModal] = useState(false); // State to show the confirmation modal
    const [bookingDetails, setBookingDetails] = useState(null); // Store selected booking details

    useEffect(() => {
        if (!location.state.branch) {
            navigate("/")
        }

        // TODO: Retrieve branch details from backend
        const branch = location.state.branch; // Retrieve the branch data
        setBranchDetails(branch); // Set the branch data

        generateAvailableDates();
    }, [location.state, navigate]);

    const generateAvailableDates = () => {
        const today = new Date();
        const currentDay = today.getDay(); // Get the current day (0 - Sunday, 6 - Saturday)
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const availableDates = [];

        // Loop through the next 5 weekdays (Mon to Fri)
        for (let i = 1; i <= 5; i++) {
            const dayIndex = (currentDay + i) % 7; // Get the index of the next weekday (Mon to Fri)
            const day = daysOfWeek[dayIndex];
            const dayOfMonth = new Date(today);
            dayOfMonth.setDate(today.getDate() + i); // Set the date to the correct weekday

            // Only add dates from the current date forward
            if (dayOfMonth >= today) {
                availableDates.push({ day, dayOfMonth });
            }
        }

        setAvailableDates(availableDates);
    };

    // Fetch available timeslots from the backend
    const fetchAvailableTimeslots = async (date) => {
        setLoadingTimeslots(true);
        try {
            const selectedDateObj = new Date(selectedDate);
            selectedDateObj.setDate(selectedDateObj.getDate() + 1);  // Add one day

            const formattedDate = selectedDateObj.toISOString().split('T')[0];
            const response = await fetch(`http://localhost:8080/api/appointments/filter/${formattedDate}/${branchDetails.landmark}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch timeslots');
            }
            
            const data = await response.json();
            setTimeslots(data);
        } catch (error) {
            console.error('Error fetching timeslots:', error);
        } finally {
            setLoadingTimeslots(false);
        }
    };

    

    // Confirm booking function
    const handleConfirmBooking = () => {
        if (!selectedAppointment || !selectedDate || !branchDetails) {
            alert('Please select a date and time slot before confirming.');
            return;
        }
        
        const selectedDateObj = new Date(selectedDate);
        selectedDateObj.setDate(selectedDateObj.getDate() + 1);  // Add one day

        const formattedDate = selectedDateObj.toISOString().split('T')[0];
        
        setBookingDetails({
            name: "John Doe", // Replace with actual user name
            date: formattedDate,
            timeSlot: selectedAppointment.timeslot,
            branch: branchDetails.landmark,
        });
        
        setShowModal(true); // Show the modal to confirm details
    };

    const handleFinalBooking = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/appointments/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: bookingDetails.name,
                    date: bookingDetails.date,
                    timeSlotId: selectedAppointment.id,
                    branchName: bookingDetails.branch
                })
            });

            if (response.ok) {
                alert('Appointment booked successfully!');
                navigate('/appointments/branches');
            } else {
                throw new Error('Failed to book the appointment');
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert('Failed to book the appointment. Please try again.');
        } finally {
            setShowModal(false); // Close the modal after booking
        }
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        fetchAvailableTimeslots(date);
    };

    const handleAppointmentSelect = (appointment) => {
        setSelectedAppointment(appointment);
    };

    const handleCancel = () => {
        navigate("/appointments/branches"); // Navigate to /appointments/branches
    };

    return (
        <div className="font-inter overflow-hidden h-screen">
            <div className="bg-[#677A84] h-[15vh] w-full"></div>
            <div className="bg-[#D9D9D9] w-full p-5 text-left mb-3">
                {branchDetails ? (
                    <>
                        <h1 className="text-2xl font-semibold mb-1">{branchDetails.landmark}</h1>
                        <p className="text-lg text-[#060313]">Schedule an Appointment</p>
                    </>
                ) : (
                    <p>Loading branch details...</p>
                )}
            </div>

            {/* Appointment details modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-lg w-1/3">
                        <h3 className="text-xl font-semibold mb-4">Confirm Your Appointment</h3>
                        <p><strong>Branch:</strong> {bookingDetails.branch}</p>
                        <p><strong>Date:</strong> {bookingDetails.date}</p>
                        <p><strong>Timeslot:</strong> {bookingDetails.timeSlot}</p>

                        <div className="flex justify-around mt-5">
                            <button
                                onClick={handleFinalBooking}
                                className="bg-[#DA291C] text-white py-2 px-4 rounded-lg"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 text-black py-2 px-4 rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex h-[calc(85vh-20px)] p-5">
                <div className="flex-2 flex flex-col gap-2 overflow-hidden mr-3">
                    {/* Date Selection */}
                    <div className="bg-white rounded-lg shadow-md p-3">
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-lg font-medium">
                                {selectedDate ? selectedDate : 'Select a Date'}
                            </p>
                            <button className="text-lg">&#9660;</button> 
                        </div>
                        <div className="flex justify-evenly mb-3">
                            {availableDates.map((date, idx) => (
                                <button
                                    key={idx}
                                    className={`w-12 h-16 rounded-lg flex flex-col items-center justify-center cursor-pointer ${selectedDate === date.dayOfMonth.toLocaleDateString() ? 'bg-[#DA291C]' : 'bg-[#F5F5F5]'}`}
                                    onClick={() => handleDateSelect(date.dayOfMonth.toLocaleDateString())}
                                >
                                    <p className="text-sm font-semibold">{date.dayOfMonth.getDate()}</p> {/* Date on top */}
                                    <p className="text-xs">{date.day}</p> {/* Day below */}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Appointment Time Selection */}
                    <div className="bg-white rounded-lg shadow-md p-3 overflow-y-scroll max-h-[355px]">
                        {loadingTimeslots ? (
                            <p>Loading timeslots...</p>
                        ) : (
                            <>
                                {timeslots.length > 0 ? (
                                    timeslots.map((timeslot, idx) => (
                                        <div
                                            key={timeslot.id}
                                            className={`flex justify-between items-center p-2 mb-2 rounded-lg cursor-pointer border-2 ${
                                                selectedAppointment?.id === timeslot.id ? 'border-[#DA291C]' : 'border-[#C7C7C7]'
                                            }`}
                                            onClick={() => handleAppointmentSelect(timeslot)}
                                            role="button"
                                            tabIndex={0}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    handleAppointmentSelect(timeslot);
                                                }
                                            }}
                                        >
                                            <div>
                                                <p className="text-sm font-semibold">{branchDetails?.landmark || 'Branch'}</p>
                                                <p className="text-sm text-green-700">{timeslot.timeslot}</p>
                                            </div>
                                            <div
                                                className={`w-5 h-5 rounded-full border-2 ${
                                                    selectedAppointment?.id === timeslot.id ? 'bg-[#DA291C]' : 'bg-transparent'
                                                }`}
                                            ></div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No available timeslots for the selected date.</p>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Location Info and Actions */}
                <div className="flex-1 flex flex-col gap-2">
                    <div className="bg-white rounded-lg shadow-md p-3">
                        <h2 className="text-xl font-semibold">Location</h2>
                        <p className="text-base font-medium">{branchDetails ? branchDetails.landmark : 'Loading...'}</p>
                        <p className="text-sm text-gray-500">{branchDetails ? branchDetails.address : 'Loading address...'}</p>
                        <div className="mt-2 p-2 bg-[#DFB0EF] text-[#803A97] font-semibold rounded-md text-center">Premier Centre</div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-3">
                        <h2 className="text-xl font-semibold">Opening Hours</h2>
                        <p className="text-sm text-[#060313]">
                            Mon-Fri: 9:00 AM to 4:30 PM<br />
                            Sat: 9:00 AM to 11:30 AM<br />
                            Sun: Closed
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={handleConfirmBooking}
                            className="bg-[#DA291C] text-white text-sm py-2 rounded-lg"
                        >
                            Confirm Appointment
                        </button>
                        <button
                            onClick={handleCancel} // Trigger handleCancel when the button is clicked
                            className="bg-[#DA291C] text-white text-sm py-2 rounded-lg transition-colors duration-300 hover:bg-red-600"
                        >
                            Cancel
                        </button>                    </div>
                </div>
            </div>
        </div>
    );
}