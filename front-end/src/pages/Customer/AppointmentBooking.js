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
        
        const locationSuccess = async (position) => {
            const { latitude, longitude } = position.coords;
            fetchBranches(latitude, longitude);

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
                            Showing OCBC Branches near <span className="text-[#DA291C]">Ngee Ann Polytechnic, Singapore.</span>
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

function BranchItem({ branch }) {
    const navigate = useNavigate();

    return (
        <div className="px-3 py-2 border-2 border-neutral-500 rounded-xl" onClick={() => navigate("/appointments/timeslots", {
            state: {
                branch: branch.landmark,
            }
        })}>
            <div className="mb-2">
                <p className="text-lg font-semibold">{ branch.landmark }</p>
                <p className="text-neutral-500 text-sm">{ branch.address }</p>
                <p className="text-green-700">Available today, 3:00 PM</p>
            </div>
            <p></p>
        </div>
    )
}