import NavigationBar from "../components/Navbar";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useEffect, useState } from "react";

// Required for Leaflet Map to work as intended
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = L.icon({ iconUrl: "/marker-icon.png" });
function AppointmentBooking() {
    const [branches, setBranches] = useState([]);
    const [index, setIndex] = useState(0);

    // User Location
    const [userLatitude, setUserLatitude] = useState(null);
    const [userLongitude, setUserLongitude] = useState(null);

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: 'Inter, sans-serif',
            overflowX: 'hidden',
            width: '100%',
        },
        header: {
            width: '100%',
            backgroundColor: '#677A84',
            height: '15vh',
        },
        titleContainer: {
            width: '100%',
            backgroundColor: '#d9d9d9',
            textAlign: 'left',
            padding: '20px 0',
        },
        titleText: {
            fontSize: '4vh',
            fontWeight: 600,
            color: '#000000',
            marginBottom: '10px',
            paddingLeft: '20px',
        },
        subtitleText: {
            fontSize: '2vh',
            color: '#060313',
            fontWeight: 300,
            paddingLeft: '20px',
        },
        mainContent: {
            display: 'flex',
            width: '100%',
            marginTop: '20px',
            padding: '0 20px',
        },
        leftColumn: {
            width: '50%',
            paddingRight: '20px',
        },
        selectBranchText: {
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#060313',
            marginBottom: '5px',
        },
        branchInfoText: {
            fontSize: '1rem',
            fontWeight: 300,
            color: '#060313',
        },
        highlightedText: {
            color: '#DA291C',
        },
        branchListContainer: {
            marginTop: '10px',
            height: '40vh',
            overflowY: 'scroll',
            paddingRight: '10px',
        },
        branchItem: {
            backgroundColor: '#ffffff',
            borderRadius: '30px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '15px 20px',
            marginBottom: '10px',
            fontSize: '1rem',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease', 
            cursor: 'pointer', 
        },
        branchItemHover: {
            transform: 'scale(1.02)', // Slight scale up
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)', // Stronger shadow on hover
        },
        branchName: {
            fontWeight: 600,
            color: '#060313',
        },
        branchDetails: {
            color: '#707070',
        },
        branchAvailability: {
            color: '#007B00',
        },
        rightColumn: {
            width: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        locationImagePlaceholder: {
            width: '100%',
            height: '100%',
            maxWidth: '400px',
            maxHeight: '40vh',
            backgroundColor: '#e0e0e0',
            borderRadius: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#707070',
            fontSize: '1.5rem',
            textAlign: 'center',
        },
    };

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
    
    useEffect(() => {
        console.log(userLatitude, userLongitude)
    }, [])

    return (
        <><NavigationBar />
        <div style={styles.container}>
            {/* Header and Title */}
            <div style={styles.titleContainer}>
                <h1 style={styles.titleText}>Schedule an Appointment</h1>
                <p style={styles.subtitleText}>Schedule an appointment at an OCBC Branch near you.</p>
            </div>

            {/* Main Content */}
            <div style={styles.mainContent}>
                {/* Left Column */}
                <div style={styles.leftColumn}>
                    <p style={styles.selectBranchText}>Select a Branch</p>
                    <p style={styles.branchInfoText}>
                        Showing OCBC Branches near <span style={styles.highlightedText}>Ngee Ann Polytechnic, Singapore.</span>
                    </p>

                    {/* Scrollable Branch List */}
                    <div className="overflow-y-scroll max-h-[50vh] flex flex-col gap-3">
                        {branches.map((branch, index) => (
                            <BranchItem branch={branch} key={index} />
                        ))}
                    </div>
                </div>

                {/* Right Column: Placeholder for Map */}
                <div style={styles.rightColumn}>
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
        </div></>
    );
}

function BranchItem({ branch }) {
    return (
        <div className="px-3 py-2 border-2 border-neutral-500 rounded-xl">
            <div className="mb-2">
                <p className="text-lg font-semibold">{ branch.landmark }</p>
                <p className="text-neutral-500 text-sm">{ branch.address }</p>
            </div>
            <p></p>
        </div>
    )
}

export default AppointmentBooking;