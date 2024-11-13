import { useLocation } from 'react-router-dom';

export default function BookingDetails() {
    const location = useLocation();
    const { booking } = location.state || {}; // Destructure the state (with a fallback)

    console.log(booking);

    if (!booking) {
        return <p>No booking details found</p>;
    }

    // Destructure booking details and branch details
    const { branchName, date, time, branchDetails } = booking;
    const { address, landmark, category } = branchDetails;

    return (
        <div>
            <h2>Booking Details</h2>

            <div>
                <p><strong>Branch Name:</strong> {branchName}</p>
                <p><strong>Landmark:</strong> {landmark}</p>
                <p><strong>Category:</strong> {category}</p>
                <p><strong>Address:</strong> {address}</p>
            </div>

            <div>
                <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p> {/* Format the date */}
                <p><strong>Time Slot:</strong> {time}</p>
            </div>
        </div>
    );
}
