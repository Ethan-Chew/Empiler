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
        const availableDates = [];
    
        // Loop through the next 5 days (including Saturdays)
        for (let i = 1; availableDates.length < 7; i++) {
            const nextDate = new Date(today);
            nextDate.setDate(today.getDate() + i); // Increment date by i days
    
            // Format the date to YYYY-MM-DD
            const formattedDate = nextDate.toISOString().split('T')[0]; // YYYY-MM-DD format

            availableDates.push({
                day: nextDate.toLocaleString('en-US', { weekday: 'short' }), // e.g., Mon, Tue
                formattedDate,
                isClosed: isDayClosed(nextDate), // Add the 'closed' check
            });
        }
    
        setAvailableDates(availableDates);
    };

    const isDayClosed = (date) => {
        const closedDays = ['Sun']; // List days you consider closed (e.g., Sunday)
        const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' }); // Get day like Mon, Tue
        return closedDays.includes(dayOfWeek); // Return true if the day is closed
    };

    const getEarliestAvailableTime = (openingHours) => {
        const today = new Date();
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const todayName = dayNames[today.getDay()];
    
        // First, check if Sundays are explicitly marked as "Closed"
        if (openingHours.toLowerCase().includes('sundays and public holidays: closed')) {
            if (todayName === 'Sun') {
                return "Closed";
            }
        }
    
        // Updated regex to handle specific days and ranges of times (mon-fri, etc.)
        const regex = new RegExp(`(?:${todayName}|${dayNames.join('|')})(?:\\s*-\\s*${dayNames.join('|')})?:\\s*(\\d{1,2}\\.\\d{2}[ap]m)\\s*[-to]{1,2}\\s*(\\d{1,2}\\.\\d{2}[ap]m)`, 'i');
        const match = openingHours.match(regex);
    
        if (match) {
            const openingTime = match[1];
            const closingTime = match[2];
            return `${formatTo24Hour(openingTime)} - ${formatTo24Hour(closingTime)}`;
        }
        return null;
    };
    
    const formatTo24Hour = (time) => {
        time = time.trim().toLowerCase();
        if (time.indexOf('.') > -1) {
            time = time.replace('.', ':');
        }

        const match = time.match(/^(\d{1,2}):(\d{2})([ap]m)$/);
    
        if (!match) {
            console.error("Invalid time format:", time);
            return null;
        }

        const [, hourStr, minuteStr, period] = match;  // Destructure the match into components
        let hours = Number(hourStr); // Convert hours to a number
        let minutes = Number(minuteStr); // Convert minutes to a number
        if (period === 'pm' && hours !== 12) {
            hours += 12; // Convert PM hours to 24-hour format
        } else if (period === 'am' && hours === 12) {
            hours = 0; // Midnight case: 12am should be 00:00
        }
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    const formatTo12Hour = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        const period = hours >= 12? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        return `${String(formattedHours).padStart(2, '0')}.${String(minutes).padStart(2, '0')}${period}`;
    };
    
    const formatTimeslot = (timeslot) => {
        const [startTime, endTime] = timeslot.split('-');
        return `${formatTo12Hour(startTime)} - ${formatTo12Hour(endTime)}`;
    };

    // Fetch available timeslots from the backend
    const fetchAvailableTimeslots = async (date) => {
        setLoadingTimeslots(true);
        try {
            const selectedDateObj = new Date(date);

            const formattedDate = selectedDateObj.toISOString().split('T')[0];
            const response = await fetch(`http://localhost:8080/api/appointments/filter/${formattedDate}/${branchDetails.landmark}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch timeslots');
            }
            
            const data = await response.json();

            const operatingHours = getEarliestAvailableTime(branchDetails.openingHours);

            if (operatingHours === "Closed" || !operatingHours) {
                alert('The selected branch is closed on this date.');
                return;
            }
            
            const [start, end] = operatingHours.split('-')
            const [startHour, startMinute] = start.split(':').map(Number);
            const [endHour, endMinute] = end.split(':').map(Number);

            data.forEach((timeslot) => {
                // Check timeslot within working hours
                const [startTime, endTime] = timeslot.timeslot.split('-');
                const [slotStartHour, slotStartMinute] = startTime.split(':').map(Number);
                const [slotEndHour, slotEndMinute] = endTime.split(':').map(Number);
                
                if (
                    slotStartHour >= startHour &&
                    slotStartMinute >= startMinute &&
                    slotEndHour <= endHour &&
                    slotEndMinute <= endMinute
                    ) {
                    timeslot.isAvailable = true;
                } else {
                    timeslot.isAvailable = false;
                }
            });


            setTimeslots(data);
        } catch (error) {
            console.error('Error fetching timeslots:', error);
        } finally {
            setLoadingTimeslots(false);
        }
    };

    

    // Confirm booking function
    const handleConfirmBooking = async () => {
        if (!selectedAppointment || !selectedDate || !branchDetails) {
            alert('Please select a date and time slot before confirming.');
            return;
        }
        
        const selectedDateObj = new Date(selectedDate);

        const formattedDate = selectedDateObj.toISOString().split('T')[0];

        const token = sessionStorage.getItem('jwt');
    
        if (!token) {
            alert('Please log in to confirm the booking.');
            navigate('/login');
            return;
        }

        const verifyResponse = await fetch('http://localhost:8080/api/auth/verify', {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}` // Send the JWT token for verification
            },
            credentials: "include", // Send cookies if required
        });

        const verifyData = await verifyResponse.json();

        if (verifyResponse.ok) {
            setBookingDetails({
                name: verifyData.accountId,
                date: formattedDate,
                timeSlot: selectedAppointment.timeslot,
                branch: branchDetails.landmark,
            });
        } else {
            alert('Failed to verify user. Please log in again.');
            navigate('/login');
        }
        
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

            {/* Appointment details */}
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

            <div className="flex h-[calc(70vh-20px)] p-5">
                <div className="flex-2 flex flex-col gap-2 overflow-hidden mr-3">
                    {/* Date Selection */}
                    <div className="w-[70vw] bg-white rounded-lg shadow-md p-3">
                        <div className="flex items-center mb-3">
                            <p className="text-lg font-medium mx-auto">
                                {selectedDate
                                    ? new Date(selectedDate).toLocaleDateString('en-US', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                    })
                                    : 'Select a Date'}
                            </p>
                            <button className="text-lg">&#9660;</button> 
                        </div>
                        <div className="flex justify-evenly mb-3">
                            {availableDates.map((date, idx) => (
                                <button
                                    key={idx}
                                    className={`w-16 h-20 mr-2 rounded-lg flex flex-col items-center justify-center text-lg cursor-pointer ${
                                        selectedDate === date.formattedDate
                                            ? 'border-[#DA291C] text-[#DA291C]'
                                            : date.isClosed
                                            ? 'text-gray-300 cursor-not-allowed' // Make closed days unclickable
                                            : 'text-gray-500'
                                    }`}
                                    onClick={() => !date.isClosed && handleDateSelect(date.formattedDate)} // Only allow click on non-closed dates
                                    disabled={date.isClosed} // Prevent action on closed days
                                >
                                    <p className="w-12 h-12 mb-1 flex items-center justify-center rounded-full border-2 border-inherit text-2xl font-semibold">
                                        {new Date(date.formattedDate).getDate()}
                                    </p>
                                    <p className="text-lg">{date.day}</p>
                                    {date.isClosed && (
                                        <span className="text-xs text-red-500">Closed</span> // Display "Closed" on closed days
                                    )}
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
                                {timeslots.filter(timeslot => timeslot.isAvailable).length > 0 ? (
                                    timeslots.filter(timeslot => timeslot.isAvailable).map((timeslot, idx) => (
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
                                                <p className="text-sm text-green-700">{formatTimeslot(timeslot.timeslot)}</p>
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
                            {branchDetails?.openingHours ? (
                                branchDetails.openingHours
                                    .split(',')
                                    .map((item, index) => (
                                        <span key={index}>
                                            {item.trim()}
                                            <br />
                                        </span>
                                    ))
                            ) : (
                                <span>Opening hours not available</span>
                            )}
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