function AppointmentBooking() {
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

    return (
        <div style={styles.container}>
            {/* Header and Title */}
            <div style={styles.header}></div>
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
                    <div style={styles.branchListContainer}>
                        {[...Array(7)].map((_, index) => (
                            <div
                                key={index}
                                style={styles.branchItem}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = styles.branchItemHover.transform;
                                    e.currentTarget.style.boxShadow = styles.branchItemHover.boxShadow;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = '';
                                    e.currentTarget.style.boxShadow = '';
                                }}
                            >
                                <p style={styles.branchName}>OCBC Branch {index + 1}</p>
                                <p style={styles.branchDetails}>1.1 km | 827 Bukit Timah Road, Singapore 279886</p>
                                <p style={styles.branchAvailability}>Available today, 3:00 PM</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Placeholder for Location Image */}
                <div style={styles.rightColumn}>
                    <div style={styles.locationImagePlaceholder}>Location Image</div>
                </div>
            </div>
        </div>
    );
}

export default AppointmentBooking;