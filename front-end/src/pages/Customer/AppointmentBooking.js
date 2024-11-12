import NavigationBar from "../../components/Navbar";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Required for Leaflet Map to work as intended
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = L.icon({ iconUrl: "/marker-icon.png" });

export default function AppointmentBooking() {
    const [branches, setBranches] = useState([]);
    const [index, setIndex] = useState(0);

    // User Location
    const [userLatitude, setUserLatitude] = useState(null);
    const [userLongitude, setUserLongitude] = useState(null);
    const [userLocation, setUserLocation] = useState("");

    useEffect(() => {
        const fetchBranches = async (lat, lon) => {
            try {
                const response = await fetch(`http://localhost:8080/api/branches?page=${index}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "lat": lat,
                        "lon": lon,
                    })
                });
                const data = await response.json();
                setBranches(data.branches);
            } catch (error) {
                console.error(error);
            }
        }

        const fetchUserLocation = async (lat, lon) => {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
                const data = await response.json();
                const placeName = data.display_name.split(',')[0];
                setUserLocation(placeName);
            } catch (error) {
                console.error(error);
            }
        }
        
        const locationSuccess = async (position) => {
            const { latitude, longitude } = position.coords;
            fetchBranches(latitude, longitude);
            fetchUserLocation(latitude, longitude);

            setUserLatitude(latitude);
            setUserLongitude(longitude);
        }
        
        const locationError = () => {
            console.log("Unable to retrieve location");
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
        } else {
            console.log("Geolocation not supported");
        }
    }, []);

    return (
        <>
            <NavigationBar />
            <div className="flex flex-col items-center font-inter overflow-x-hidden w-full">
                {/* Header and Title */}
                <div className="w-full bg-gray-200 text-left py-5">
                    <h1 className="text-4xl font-semibold text-black mb-2 px-5">Schedule an Appointment</h1>
                    <p className="text-2xl font-light text-gray-900 px-5">Schedule an appointment at an OCBC Branch near you.</p>
                </div>

                {/* Main Content */}
                <div className="flex w-full mt-5 px-5">
                    <div className="w-1/2 pr-5">
                        <p className="text-xl font-semibold text-black mb-2">Select a Branch</p>
                        <p className="text-base font-light text-black mb-2">
                            Showing OCBC Branches near <span className="text-[#DA291C]">{userLocation || "your location"}</span>
                        </p>

                        <div className="mt-3 h-[40vh] overflow-y-scroll pr-2">
                            {branches.map((branch, index) => (
                                <BranchItem branch={branch} key={index} />
                            ))}
                        </div>
                    </div>

                    <div className="w-1/2 flex justify-center items-center">
                        {userLatitude && userLongitude ? (
                            <MapContainer center={[userLatitude, userLongitude]} zoom={13} scrollWheelZoom={false} className="w-full h-full">
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {branches.map((branch, index) => (
                                    <Marker key={index} position={[branch.latitude, branch.longitude]} icon={markerIcon}>
                                        <Popup>
                                            <p>{branch.landmark}</p>
                                            <p>{branch.address}</p>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        ) : <p>Loading Map...</p>}
                    </div>
                </div>
            </div>
        </>
    );
}

const getEarliestAvailableTime = (openingHours) => {
    const today = new Date();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const todayName = dayNames[today.getDay()];
    if (todayName === "Sun") return "Closed";

    // Updated regex to handle variations in spaces and separators
    const regex = new RegExp(`(?:${todayName}|${dayNames.join('|')})(?:\\s*-\\s*${dayNames.join('|')})?:\\s*(\\d{1,2}\\.\\d{2}[ap]m)\\s*[-to]{1,2}\\s*(\\d{1,2}\\.\\d{2}[ap]m)`, 'i');
    const match = openingHours.match(regex);

    if (match) {
        const openingTime = match[1];
        return formatTo24Hour(openingTime);
    }
    return null;
};

const formatTo24Hour = (time) => {
    const [timePart, period] = time.toLowerCase().split(/[ap]m/);
    let [hours, minutes] = timePart.split('.').map(Number);
    if (period === 'p' && hours !== 12) hours += 12;
    if (period === 'a' && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

function BranchItem({ branch }) {
    const navigate = useNavigate();
    const earliestTime = getEarliestAvailableTime(branch.openingHours);

    return (
        <div className="px-3 py-2 border-2 border-neutral-500 rounded-xl" onClick={() => navigate("/appointments/timeslots", {
            state: {
                branch: branch
            }
        })}>
            <div className="mb-2">
                <p className="text-lg font-semibold">{ branch.landmark }</p>
                <p className="text-neutral-500 text-sm">{ branch.address }</p>
                <p className={`text-${earliestTime === "Closed" ? "red-500" : "green-700"}`}>
                    {earliestTime === "Closed" ? "Closed today" : `Available today at ${earliestTime}`}
                </p>
            </div>
            <p></p>
        </div>
    )
}