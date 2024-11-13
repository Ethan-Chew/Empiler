import NavigationBar from "../../components/Navbar";
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BookingDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const { booking } = location.state || {}; // Destructure the state (with a fallback)
    const [userLatitude, setUserLatitude] = useState(null);
    const [userLongitude, setUserLongitude] = useState(null);

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
    }, []);

    console.log(booking);

    if (!booking) {
        return <p>No booking details found</p>;
    }

    // Destructure booking details and branch details
    const { branchDetails } = booking;
    const { address, landmark } = branchDetails;

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
                                        <button className="w-1/3 h-full border-2 border-gray-100 shadow-md rounded-lg font-semibold text-2xl flex flex-col items-center justify-center m-5 p-5">
                                            <img src="/scheduleAppointment.svg" alt="Schedule Appointment" className="w-12 h-12 mb-4" />
                                            <p>Reschedule Appointment</p>
                                        </button>
                                        <button className="w-1/3 h-full border-2 border-gray-100 shadow-md rounded-lg font-semibold text-2xl flex flex-col items-center justify-center m-5 p-5">
                                            <img src="/scheduleAppointment.svg" alt="Schedule Appointment" className="w-12 h-12 mb-4" />
                                            <p>Cancel Appointment</p>
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

                {/* Footer Section */}
                <footer className="bg-gray-200 w-full py-4 mt-8">
                    <div className="text-center text-gray-600">
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
