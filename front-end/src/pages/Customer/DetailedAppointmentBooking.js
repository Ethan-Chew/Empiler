import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

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
    const [showDates, setShowDates] = useState(true); // State to toggle dates visibility
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    const toggleDates = () => setShowDates(!showDates); // Toggle function

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
    
        for (let i = 0; availableDates.length < 7; i++) {
            const nextDate = new Date(today);
            nextDate.setDate(today.getDate() + i); // Increment date by i days
    
            // Format the date to YYYY-MM-DD
            const formattedDate = nextDate.toISOString().split('T')[0]; // YYYY-MM-DD format

            availableDates.push({
                day: nextDate.toLocaleString('en-US', { weekday: 'long' }), // e.g., Mon, Tue
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

    const getEarliestAvailableTime = (openingHours, selectedDate) => {
        const today = new Date(selectedDate);
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

            const operatingHours = getEarliestAvailableTime(branchDetails.openingHours, selectedDate);

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


    const checkLoggedIn = async () => {
        const verifyRequest = await fetch('http://localhost:8080/api/auth/verify', {
            method: 'GET',
            credentials: 'include',
        });

        if (verifyRequest.status === 200) {
            const data = await verifyRequest.json();
            setIsLoggedIn(true);
        }
    }
    

    // Confirm booking function
    const handleConfirmBooking = async () => {
        if (!selectedAppointment || !selectedDate || !branchDetails) {
            alert('Please select a date and time slot before confirming.');
            return;
        }
        
        const selectedDateObj = new Date(selectedDate);

        const formattedDate = selectedDateObj.toISOString().split('T')[0];

        const token = checkLoggedIn(); 
    
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
            console.log(bookingDetails);
            const response = await fetch('http://localhost:8080/api/appointments/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: bookingDetails.name,
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
        <div className="font-inter overflow-hidden min-h-screen">
            <Navbar />
            <div className="bg-white m-auto w-[98%] border-b-2 border-gray-300 p-5 text-left mb-3 flex flex-col items-center align-center">
                {branchDetails ? (
                    <>
                        <h1 className="text-4xl font-semibold mb-1">Appointment Booking</h1>
                        <h1 className="text-xl mb-1 text-gray-500">{branchDetails.landmark}</h1>
                    </>
                ) : (
                    <p>Loading branch details...</p>
                )}
            </div>

            {/* Appointment details */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-lg w-1/3 flex flex-col justify-center items-center">
                        <h3 className="text-2xl font-semibold mb-4">Booking Confirmation</h3>
                        <p className="text-xl mb-2">You have selected an appointment for:</p>

                        <p className="font-medium">{branchDetails?.landmark}</p>
                        <p className="text-sm text-gray-500">{branchDetails?.address}</p>

                        <p className="mt-2 text-base text-green-600">
                            {new Date(bookingDetails?.date).toLocaleDateString("en-GB", {
                                weekday: "long",   // Day of the week (Friday)
                                day: "numeric",    // Day of the month (13)
                                month: "long",     // Month (June)
                                year: "numeric",   // Year (2025)
                            })}
                        </p>
                        <p className="text-sm">
                            {formatTimeslot(bookingDetails?.timeSlot)}
                        </p>

                        <div className="flex flex-col justify-around mt-5">
                            <div>
                                <button
                                    onClick={handleFinalBooking}
                                    className="bg-[#DA291C] text-white py-4 px-12 mb-4 rounded-3xl text-xl font-semibold"
                                >
                                    Confirm Booking
                                </button>
                            </div>
                            <div className="flex justify-center">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-600 text-white py-2 px-6 rounded-3xl"
                                >
                                    Cancel Selection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex h-[calc(70vh-20px)] p-5">
                <div className="flex-2 flex flex-col gap-2 overflow-hidden mr-3">
                    {/* Date Selection */}
                    <div className="w-[70vw] bg-white border-gray-200 border-3 rounded-xl shadow-md p-3">
                        <div className="flex items-center mb-3 border-b border-gray-300 pb-2">
                            <p className="text-lg font-medium mx-auto">
                                {selectedDate
                                    ? new Date(selectedDate).toLocaleDateString('en-US', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                    })
                                    : 'Select a Date'}
                            </p>
                            <button className="text-lg" onClick={toggleDates}>
                                {showDates ? '▲' : '▼'}
                            </button>
                        </div>
                        <div className="flex justify-evenly mb-3">
                            {showDates && (
                                <div className="w-[100%] flex justify-evenly mt-3">
                                    {availableDates.map((date, idx) => (
                                        <button
                                            key={idx}
                                            className={`w-16 h-22 mr-2 rounded-lg flex flex-col items-center justify-center text-lg cursor-pointer transition-colors duration-300 ${
                                                selectedDate === date.formattedDate
                                                    ? 'border-[#DA291C] text-[#DA291C] hover:border-[#A51C14]'
                                                    : date.isClosed
                                                    ? 'text-gray-300 cursor-not-allowed' // Make closed days unclickable
                                                    : 'text-gray-500 hover:border-gray-700'
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
                            )}
                        </div>
                    </div>

                    {/* Appointment Time Selection */}
                    <div className="bg-white mt-5 border-gray-200 border-3 rounded-lg shadow-md p-3 overflow-y-scroll max-h-[355px]">
                        {loadingTimeslots ? (
                            <p>Loading timeslots...</p>
                        ) : (
                            <>
                                {timeslots.filter(timeslot => timeslot.isAvailable).length > 0 ? (
                                    timeslots.filter(timeslot => timeslot.isAvailable).map((timeslot, idx) => (
                                        <div
                                            key={timeslot.id}
                                            className={`flex justify-between items-center p-2 mb-2 rounded-lg cursor-pointer border-2 shadow-md hover:shadow-lg transition-shadow ${
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
                                                className={`w-4 h-4 rounded-full border-2 mr-2 ${
                                                    selectedAppointment?.id === timeslot.id ? 'bg-[#DA291C] ring-2 ring-offset-[6px] ring-red-500' : 'bg-transparent'
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
                    <div className="h-[100%] bg-white border-gray-200 border-3 rounded-lg shadow-md p-3 flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">Location</h2>
                            <p className="text-base font-medium">{branchDetails ? branchDetails.landmark : 'Loading...'}</p>
                            <p className="text-sm text-gray-500">{branchDetails ? branchDetails.address : 'Loading address...'}</p>
                            <div className="mt-2 p-2 bg-[#DFB0EF] text-[#803A97] font-semibold rounded-md text-center">Premier Centre</div>
                        </div>

                        <h2 className="pt-4 text-xl font-semibold">Opening Hours</h2>
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
                        <div className="pt-10 flex flex-col gap-2">
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
                            </button>                    
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}