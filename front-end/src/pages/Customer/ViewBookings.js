import NavigationBar from "../../components/Navbar";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ViewBookings() {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        const token = sessionStorage.getItem('jwt');

        if (!token) {
            alert('Please log in to confirm the booking.');
            navigate('/login');
            return;
        }

        try {
            const verifyResponse = await fetch('http://localhost:8080/api/auth/verify', {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}` // Send the JWT token for verification
                },
                credentials: "include", // Send cookies if required
            });

            if (!verifyResponse.ok) {
                alert('Invalid token. Please log in to confirm the booking.');
                navigate('/login');
                return;
            }
    
            const verifyData = await verifyResponse.json();
            const name = verifyData.accountId; // Ensure 'name' is extracted after the token is verified

            const response = await fetch('http://localhost:8080/api/appointments/viewbookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }) // Send name in the request body
            });

            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }

            const data = await response.json();

            const bookingsWithBranchDetails = await Promise.all(data.map(async (booking) => {
                const branchDetails = await fetchBranchDetails(booking.branchName);
                return { ...booking, branchDetails };
            }));

            setBookings(bookingsWithBranchDetails);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchBranchDetails = async (branchName) => {
        try {
            const response = await fetch(`http://localhost:8080/api/branch?landmark=${branchName}`);
            if (!response.ok) {
                throw new Error('Failed to fetch branch details');
            }
            const data = await response.json();
            return data.branch; // Assuming the response is structured with 'branch' key
        } catch (error) {
            console.error('Error fetching branch details:', error);
            return null;
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
        const date = new Date(dateString); // Convert the string to a Date object
        const options = { day: '2-digit', month: 'long', year: 'numeric' }; // Format options
        return date.toLocaleDateString('en-GB', options); // Use 'en-GB' for the DD MMM YYYY format
    };

    const handleBookingClick = (booking) => {
        // Navigate to a detailed booking page or perform any action
        console.log(booking)
        navigate(`/appointments/booking/details`, {
            state: { booking } // Pass the data through state
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }



    return (
        <div className="min-h-screen">
        <>
            <NavigationBar />

            {/* Main Content */}
            <div className="flex justify-center items-center mt-8">
                <div className="w-11/12 bg-white rounded-lg shadow-md p-6">
                    <p className="text-2xl font-semibold">View Bookings</p>

                    {/* Booking Cards */}
                    <div className="mt-4">
                        {bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="flex justify-between items-center border-b border-gray-200 py-2 cursor-pointer"
                                    onClick={() => handleBookingClick(booking)}
                                >
                                    <div className="w-full rounded-lg border-2 border-gray-300 flex justify-between">
                                        <div className="w-1/2 m-5">
                                            <p className="font-semibold text-xl">{booking.branchName}</p>
                                            <p className="text-gray-400">{calculateDistance(userLatitude, userLongitude, booking.branchDetails.latitude, booking.branchDetails.longitude)} km away | {booking.branchDetails.address}</p>
                                        </div>
                                        <div className="w-1/2 m-5 border-l-4 border-gray-300 pl-4 text-[#007B00] flex justify-between items-center">
                                            <div>
                                                <p>Date: {formatDate(booking.date)}</p>
                                                <p>Timeslot: {formatTimeRange(booking.time)}</p>
                                            </div>
                                            <div className="mr-2">
                                                <p className="text-4xl font-bold text-gray-400">{'>'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 mt-4">No bookings found.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
        </div>
    );
}

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return "Distance unavailable"; // Handle undefined values
    
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance.toFixed(2); // Round to 2 decimal places
};