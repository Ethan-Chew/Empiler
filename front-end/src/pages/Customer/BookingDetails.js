import NavigationBar from "../../components/Navbar";
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function BookingDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const { booking } = location.state || {}; // Destructure the state (with a fallback)
    const [userLatitude, setUserLatitude] = useState(null);
    const [userLongitude, setUserLongitude] = useState(null);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [availableDates, setAvailableDates] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [loadingTimeslots, setLoadingTimeslots] = useState(false);
    const [reminderTypes, setReminderTypes] = useState([]);
    const [selectedReminder, setSelectReminder] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

    // Destructure booking details and branch details
    const { branchDetails } = booking;
    const { address, landmark } = branchDetails;


    useEffect(() => {
        // Get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                setUserLatitude(position.coords.latitude);
                setUserLongitude(position.coords.longitude);
            }, () => {
                alert('Could not get your location.');
            });
        }

        if (booking) {
            loadAvailableDates();
            fetchAvailableTimeslots(booking.date);
        }

        const fetchReminderTypes = async () => {
            const response = await fetch('http://localhost:8080/api/appointments/remindertypes');
            const data = await response.json();
            setReminderTypes(data);

            reminderTypes.forEach(async (reminder) => { console.log(reminder.type) });

            console.log(booking);

            const combinedDateTime = new Date(booking.date + 'T' + booking.time.split('-')[0]);
            console.log(combinedDateTime);
            const unixTimestamp = combinedDateTime.getTime() / 1000;
            console.log(unixTimestamp);

            // const response2 = await fetch('http://localhost:8080/api/appointments/reminders', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         appointmentId: booking.id,
            //         reminderType: selectReminder,
            //         reminderTime: unixTimestamp,
            //         area: 'telegram'
            //     }),
            // });

            // const data2 = await response2.json();
            // console.log(data2);
        }
        fetchReminderTypes();
        console.log( 'Reminder Types: ', reminderTypes);

    }, [booking]);

    const loadAvailableDates = () => {
        const dates = [];
        const currentDate = new Date();
        for (let i = 0; i < 7; i++) {
            const newDate = new Date(currentDate);
            newDate.setDate(currentDate.getDate() + i);
            dates.push(newDate.toISOString().split('T')[0]);
        }
        setAvailableDates(dates);
        setSelectedDate(dates[0]);
    };

    const getEarliestAvailableTime = (openingHours, selectedDate) => {
        const today = new Date(selectedDate);
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const todayName = dayNames[today.getDay()];
    
        // First, check if Sundays are explicitly marked as "Closed"
        if (openingHours.toLowerCase().includes('sundays and public holidays: closed')) {
            if (todayName === 'Sun') {
                console.log("Branch is closed on Sundays");
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

    const updateAppointments = async () => {
        try {
            const formattedDate = new Date(selectedDate).toISOString().split('T')[0];

    
            // Prepare the data to send for updating the appointment
            const updatedBooking = {
                id: booking.id,
                date: booking.date,
                timeslotId: booking.timeslotId,
                branchName: booking.branchDetails.landmark,
                newDate: formattedDate,
                newTimeslotId: selectedTime,
                newBranchName: booking.branchDetails.landmark,
            };
    
            const response = await fetch(`http://localhost:8080/api/appointments/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedBooking),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update appointment');
            }
    
            const result = await response.json();
    
            alert('Appointment rescheduled successfully!');
            setShowRescheduleModal(false);
            navigate('/appointments/viewBooking');
        } catch (error) {
            console.error('Error updating appointment:', error);
            alert('Failed to reschedule appointment. Please try again.');
        }
    };

    const cancelAppointment = async () => {
        try {
            // Prepare the data needed for the cancellation
            const { id } = booking;

            console.log(id);
            
            // Call the API to delete the appointment
            const response = await fetch('http://localhost:8080/api/appointments/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    appointmentId: id
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to cancel appointment');
            }
    
            const result = await response.json();
    
            alert('Appointment canceled successfully!');
            navigate('/appointments/viewBooking');  // Navigate back to the bookings view
    
        } catch (error) {
            console.error('Error canceling appointment:', error);
            alert('Failed to cancel appointment. Please try again.');
        }
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

    const fetchAvailableTimeslots = async (date) => {
        setLoadingTimeslots(true);
        try {
            const selectedDateObj = new Date(date);
            const formattedDate = selectedDateObj.toISOString().split('T')[0];
    
            const response = await fetch(
                `http://localhost:8080/api/appointments/filter/${formattedDate}/${booking.branchDetails.landmark}`
            );
    
            if (!response.ok) {
                throw new Error('Failed to fetch timeslots');
            }
    
            const data = await response.json();
            const operatingHours = getEarliestAvailableTime(booking.branchDetails.openingHours, selectedDate);
            console.log(operatingHours);
    
            if (operatingHours === "Closed" || !operatingHours) {
                alert('The selected branch is closed on this date.');
                return;
            }
    
            const [start, end] = operatingHours.split('-');
            const [startHour, startMinute] = start.split(':').map(Number);
            const [endHour, endMinute] = end.split(':').map(Number);

    
            // Map timeslots from backend to include timeslotId
            const mappedTimeslots = data.map(timeslot => {
                const [slotStart, slotEnd] = timeslot.timeslot.split('-');
                const [slotStartHour, slotStartMinute] = slotStart.split(':').map(Number);
                const [slotEndHour, slotEndMinute] = slotEnd.split(':').map(Number);

                return {
                    timeslotId: timeslot.id,
                    timeslot: `${slotStart} - ${slotEnd}`,
                    startHour: slotStartHour,
                    startMinute: slotStartMinute,
                    endHour: slotEndHour,
                    endMinute: slotEndMinute
                };
            });

            // Filter timeslots based on branch operating hours
            const filteredTimeslots = mappedTimeslots.filter((timeslot) => {
                const isValidStart = timeslot.startHour >= startHour && timeslot.startMinute >= startMinute;
                const isValidEnd = timeslot.endHour <= endHour && timeslot.endMinute <= endMinute;
                return isValidStart && isValidEnd;
            });
    
    
            setAvailableTimes(filteredTimeslots);
        } catch (error) {
            console.error('Error fetching timeslots:', error);
        } finally {
            setLoadingTimeslots(false);
        }
    };


    const formatTo12Hour = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        const period = hours >= 12 ? 'pm' : 'am';
        const formattedHours = hours % 12 || 12;
        return `${String(formattedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}${period}`;
    };
    
    const formatTimeRange = (timeRange) => {
        const [startTime, endTime] = timeRange.split('-'); // Assuming timeRange format: '09:00-09:30'
        return `${formatTo12Hour(startTime)} - ${formatTo12Hour(endTime)}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    };

    const handleReschedule = () => {
        setShowRescheduleModal(true);
    };

    const closeModal = () => {
        setShowRescheduleModal(false);
    };

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        fetchAvailableTimeslots(newDate);
    };

    const handleTimeChange = (e) => {
        setSelectedTime(e.target.value);
    };

    const handleReminderChange = (e) => {
        setSelectReminder(e.target.value);
    };

    // Toggle the modal
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleReminderSet = async () => {
        const combinedDateTime = new Date(booking.date + 'T' + booking.time.split('-')[0]);
        const unixTimestamp = combinedDateTime.getTime() / 1000;

        const response = await fetch('http://localhost:8080/api/appointments/reminders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                appointmentId: booking.id,
                reminderType: selectedReminder,
                reminderTime: unixTimestamp,
                area: 'telegram'
            }),
        });

        const data = await response.json();
        console.log(data);

        alert('Reminder set successfully!');
        toggleModal();
    };

    if (!booking) {
        return <p>No booking details found</p>;
    }


    return (
        <div className="min-h-screen flex flex-col justify-between">
            <>
                <NavigationBar />
                <div className="flex justify-center items-center mt-8">
                    <div className="w-11/12 bg-white rounded-lg shadow-md p-6">
                        <h2 className="font-semibold text-4xl text-center p-5">Appointment Details</h2>
                        <div className="mt-4">
                            <div className="w-full rounded-lg border-2 border-gray-300 flex justify-between">
                                <div className="w-auto m-5 flex flex-col justify-between p-10">
                                    <p className="font-bold text-3xl">{landmark}</p>
                                    <p className="text-gray-400 mt-5 text-xl">
                                        {calculateDistance(userLatitude, userLongitude, booking.branchDetails.latitude, booking.branchDetails.longitude)} km away | {address}
                                    </p>
                                    <p className="text-[#007B00] mt-5 text-xl">{formatDate(booking.date)}, {formatTimeRange(booking.time)}</p>
                                </div>
                                <div className="w-full m-5 border-l-4 border-gray-300 pl-4 flex flex-col justify-between items-center">
                                    <div className="w-full h-3/4 m-5 flex pl-4 pr-4 justify-center items-center">
                                        <button className="w-1/3 h-full border-2 border-gray-100 shadow-md rounded-lg font-semibold text-2xl flex flex-col items-center justify-center m-5 p-5" onClick={handleReschedule}>
                                            <img src="/scheduleAppointment.svg" alt="Schedule Appointment" className="w-12 h-12 mb-4" />
                                            <p>Reschedule Appointment</p>
                                        </button>
                                        <button 
                                            className="w-1/3 h-full border-2 border-gray-100 shadow-md rounded-lg font-semibold text-2xl flex flex-col items-center justify-center m-5 p-5"
                                            onClick={cancelAppointment}
                                        >
                                            <img src="/scheduleAppointment.svg" alt="Schedule Appointment" className="w-12 h-12 mb-4" />
                                            <p>Cancel Appointment</p>
                                        </button>
                                        <button 
                                            className="w-1/3 h-full border-2 border-gray-100 shadow-md rounded-lg font-semibold text-2xl flex flex-col items-center justify-center m-5 p-5"
                                            onClick={toggleModal}
                                        >
                                            <img src="/scheduleAppointment.svg" alt="Schedule Appointment" className="w-12 h-12 mb-4" />
                                            <p>Set Reminder</p>
                                        </button>
                                    </div>
                                    <button className="w-2/3 h-full border-2 border-gray-100 shadow-md rounded-lg font-semibold text-2xl flex flex-col items-center justify-center m-5 p-5" onClick={() => navigate("/appointments/viewBooking")}>
                                        Back
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Modal for selecting reminder */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-md p-6">
                            <h3 className="text-2xl font-semibold mb-4">Set Reminder</h3>
                            <label htmlFor="block mb-2">Choose a Reminder Time:</label>
                            <select
                                className="w-full border border-gray-300 rounded p-2 mb-4"
                                id="reminderType"
                                value={selectedReminder}
                                onChange={handleReminderChange}
                            >
                                <option value="">Select a reminder</option>
                                {reminderTypes.map((reminder, index) => (
                                    <option key={index} value={reminder.type}>
                                        {reminder.type}
                                    </option>
                                ))}
                            </select>

                            <div>
                                <button className="bg-gray-300 text-black py-2 px-4 rounded mr-2" onClick={toggleModal}>Close</button>
                                <button className="bg-[#007B00] text-white py-2 px-4 rounded" onClick={handleReminderSet} disabled={!selectedReminder}>
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reschedule Modal */}
                {showRescheduleModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-md p-6">
                            <h3 className="text-2xl font-semibold mb-4">Reschedule Appointment</h3>
                            <label className="block mb-2">Select a new date:</label>
                            <select value={selectedDate} onChange={handleDateChange} className="w-full border border-gray-300 rounded p-2 mb-4">
                                {availableDates.map((date) => (
                                    <option key={date} value={date}>{formatDate(date)}</option>
                                ))}
                            </select>

                            <label className="block mb-2">Select a new time:</label>
                            <select value={selectedTime} onChange={handleTimeChange} className="w-full border border-gray-300 rounded p-2 mb-4" disabled={loadingTimeslots}>
                                {availableTimes.map((timeslot) => (
                                    <option key={timeslot.timeslotId} value={timeslot.timeslotId}>
                                        {timeslot.timeslot}
                                    </option>
                                ))}
                            </select>

                            <div className="flex justify-end mt-5">
                                <button className="bg-gray-300 text-black py-2 px-4 rounded mr-2" onClick={closeModal}>Cancel</button>
                                <button className="bg-[#007B00] text-white py-2 px-4 rounded" onClick={updateAppointments} disabled={!selectedTime}>
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Section */}
                <footer className="bg-[#677A84] font-white w-full py-4 mt-8">
                    <div className="text-center text-white">
                        © 2024 OCBC Bank. All rights reserved.
                    </div>
                </footer>
            </>
        </div>
    );
}

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return "Distance unavailable";
    
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(2);
};
