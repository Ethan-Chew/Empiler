import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaLocationArrow } from "react-icons/fa";


// TODO: Migrate to use <Suspense />
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
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const availableDates = [];

        // Loop through the next 5 weekdays (Mon to Fri)
        for (let i = 0; i < 5; i++) {
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
    const handleConfirmBooking = async () => {
        if (!selectedAppointment || !selectedDate || !branchDetails) {
            alert('Please select a date and time slot before confirming.');
            return;
        }
        
        const selectedDateObj = new Date(selectedDate);
        selectedDateObj.setDate(selectedDateObj.getDate() + 1);  // Add one day

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
        <div className="font-inter h-screen flex flex-col">
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

            <div className="flex-grow flex p-5 h-full">
                <div className="flex-grow basis-3/4 flex flex-col gap-2 overflow-hidden mr-3">
                    <div className='w-full flex flex-col border-3 border-neutral-200 rounded-xl p-3 gap-4'>
                        <div className='pb-2 border-b-2 border-neutral-200 text-center'>
                            <a className='text-lg font-semibold'>November 2024</a>
                        </div>

                        {/* Date Selector */}
                        <div className='flex flex-row items-center justify-center gap-10'>
                            {availableDates.map((date, index) => (
                                <button 
                                    key={index}
                                    onClick={() => handleDateSelect(date.dayOfMonth.toLocaleDateString())}
                                >
                                    <div className='flex flex-col justify-center items-center gap-1'>
                                        <p className={`p-2 border-3 ${selectedDate === date.dayOfMonth.toLocaleDateString() ? 'border-ocbcred text-ocbcred' : 'border-neutral-300 text-neutral-500'} rounded-full text-xl font-semibold w-12 h-12 flex items-center justify-center`}>
                                            {date.dayOfMonth.getDate()}
                                        </p>
                                        <p className={`text-sm ${selectedDate === date.dayOfMonth.toLocaleDateString() ? 'text-ocbcred' : 'text-neutral-500'}`}>
                                            {date.day}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>

                    </div>

                    {/* Slot Selector */}
                    <div className='w-full border-3 border-neutral-200 rounded-xl p-3 flex flex-col gap-2'>
                        {/* <div className='flex flex-row py-2 px-4 border-2 rounded-xl items-center'>
                            <div>
                                <p className="text-lg font-semibold">Some Branch Name</p>
                                <p className="text-green-700">5:00pm - 5:30pm</p>
                            </div>

                            <button class="ml-auto w-10 h-10 flex items-center justify-center rounded-full border-2 border-ocbcred">
                                <div class="w-4 h-4 bg-ocbcred rounded-full"></div>
                            </button>
                        </div> */}
                        {loadingTimeslots ? (
                            <p>Loading timeslots...</p>
                        ) : (
                            <>
                                {timeslots.length > 0 ? (
                                    timeslots.map((timeslot, idx) => (
                                        
                                        <div
                                            key={timeslot.id}
                                            className="flex flex-row py-2 px-4 border-2 rounded-xl items-center"
                                            onClick={() => handleAppointmentSelect(timeslot)}
                                            role="button"
                                            tabIndex={0}
                                            onKeyUp={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    handleAppointmentSelect(timeslot);
                                                }
                                            }}
                                        >
                                            <div>
                                                <p className="text-lg font-semibold">Some Branch Name</p>
                                                <p className="text-green-700">5:00pm - 5:30pm</p>
                                            </div>

                                            <button className={`ml-auto w-10 h-10 flex items-center justify-center rounded-full border-2 ${selectedAppointment?.id === timeslot.id ? "border-ocbcred" : "border-neutral-300"}`}>
                                                <div className={`w-4 h-4 bg-ocbcred rounded-full ${selectedAppointment?.id === timeslot.id ? "block" : "hidden"}`}></div>
                                            </button>
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
                <div className='flex-grow basis-1/3 md:basis-1/4 flex flex-col gap-3 border-3 border-neutral-200 rounded-xl px-4 py-2'>
                    <div>
                        <h2 className="text-2xl font-bold">Location</h2>
                        <p className="text-lg font-medium">{branchDetails ? branchDetails.landmark : 'Loading...'}</p>
                        <p className="text-sm text-gray-500">{branchDetails ? branchDetails.address : 'Loading address...'}</p>
                        <div className="mt-2 w-fit px-5 py-1 bg-[#DFB0EF] text-[#803A97] font-semibold rounded-full text-center text-sm">
                            { branchDetails ? branchDetails.category : "Loading..." }
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold">Opening Hours</h2>
                        { branchDetails.openingHours.split(", ").map((text, index) => (
                            <p key={index}>{ text }</p>
                        ))}
                    </div>

                    <div className='mt-auto w-full space-y-3'>
                        <button
                            onClick={handleConfirmBooking}
                            className="bg-[#DA291C] text-white font-semibold text-lg py-2 px-5 rounded-lg w-full"
                        >
                            <div className='flex gap-3 items-center'>
                                <FaCalendarAlt />
                                Book Appointment
                            </div>
                        </button>
                        <button
                            onClick={handleConfirmBooking}
                            className="bg-[#DA291C] text-white font-semibold text-lg py-2 px-5 rounded-lg w-full"
                        >
                            <div className='flex gap-3 items-center'>
                                <FaLocationArrow />
                                Directions
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}