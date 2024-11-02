import React, { useState } from 'react';

function DetailedAppointmentBooking() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const handleAppointmentSelect = (appointment) => {
        setSelectedAppointment(appointment);
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}></div>
            <div style={styles.titleSection}>
                <h1 style={styles.titleText}>OCBC Sixth Avenue Branch</h1>
                <p style={styles.subtitleText}>Schedule an Appointment</p>
            </div>

            {/* Main Content */}
            <div style={styles.content}>
                {/* Date and Appointment Selection */}
                <div style={styles.leftSection}>
                    {/* Date Selection */}
                    <div style={styles.selectionBox}>
                        <div style={styles.dateHeader}>
                            <p style={styles.dateText}>
                                {selectedDate ? selectedDate : 'Select a Date'}
                            </p>
                            <button style={styles.arrowButton}>&#9660;</button> {/* Down Arrow */}
                        </div>
                        <div style={styles.dateCircles}>
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                                <button
                                    key={idx}
                                    style={{
                                        ...styles.dateCircle,
                                        backgroundColor: selectedDate === day ? '#DA291C' : '#F5F5F5',
                                    }}
                                    onClick={() => handleDateSelect(day)}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Appointment Time Selection */}
                    <div style={styles.selectionBox}>
                        <div style={styles.appointmentList}>
                            {Array.from({ length: 10 }).map((_, idx) => ( 
                                <div
                                    key={idx}
                                    style={{
                                        ...styles.appointmentBox,
                                        borderColor: selectedAppointment === idx ? '#DA291C' : '#C7C7C7',
                                    }}
                                    onClick={() => handleAppointmentSelect(idx)}
                                >
                                    <p style={styles.appointmentLocation}>Sixth Avenue Branch</p>
                                    <p style={styles.appointmentTime}>2:00 PM - 2:30 PM</p>
                                    <div
                                        style={{
                                            ...styles.selectCircle,
                                            backgroundColor: selectedAppointment === idx ? '#DA291C' : 'transparent',
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Location Info and Actions */}
                <div style={styles.rightSection}>
                    <div style={styles.locationBox}>
                        <h2 style={styles.locationHeader}>Location</h2>
                        <p style={styles.locationName}>OCBC Sixth Avenue Branch</p>
                        <p style={styles.locationDetails}>827 Bukit Timah Road | 279886</p>
                        <div style={styles.premierCenterTag}>Premier Centre</div>
                    </div>

                    <div style={styles.openingHoursBox}>
                        <h2 style={styles.openingHoursHeader}>Opening Hours</h2>
                        <p style={styles.openingHoursText}>
                            Mon-Fri: 9:00 AM to 4:30 PM<br />
                            Sat: 9:00 AM to 11:30 AM<br />
                            Sun: Closed
                        </p>
                    </div>

                    <div style={styles.actionButtons}>
                        <button style={styles.actionButton}>Confirm Appointment</button>
                        <button style={styles.actionButton}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: 'Inter, sans-serif',
        overflow: 'hidden', 
        height: '100vh', 
    },
    header: {
        backgroundColor: '#677A84',
        height: '15vh',
        width: '100%',
    },
    titleSection: {
        backgroundColor: '#D9D9D9',
        width: '100%',
        padding: '20px 10px', 
        textAlign: 'left',
        marginBottom: '10px', 
    },
    titleText: {
        fontSize: '2em', 
        fontWeight: '600',
        marginBottom: '5px',
    },
    subtitleText: {
        fontSize: '1em',
        color: '#060313',
    },
    content: {
        display: 'flex',
        height: 'calc(85vh - 20px)',
        padding: '20px',
    },
    leftSection: {
        flex: '2',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px', 
        overflowY: 'hidden', 
        marginRight: '10px',
    },
    rightSection: {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px', 
    },
    selectionBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: '15px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    },
    dateHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '10px',
    },
    dateText: {
        fontSize: '1em',
        fontWeight: '500',
        margin: 0,
    },
    arrowButton: {
        background: 'none',
        border: 'none',
        fontSize: '1em',
        cursor: 'pointer',
    },
    dateCircles: {
        display: 'flex',
        justifyContent: 'space-evenly',
        marginBottom: '10px',
    },
    dateCircle: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    },
    appointmentList: {
        maxHeight: '355px',
        overflowY: 'scroll',
        padding: '10px',
        borderRadius: '15px',
        backgroundColor: '#FFFFFF',
    },
    appointmentBox: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        border: '2px solid #C7C7C7',
        borderRadius: '10px',
        marginBottom: '5px',
        cursor: 'pointer',
    },
    appointmentLocation: {
        fontSize: '0.9em',
        fontWeight: '600',
        color: '#000000',
    },
    appointmentTime: {
        fontSize: '0.9em',
        color: '#007B00',
    },
    selectCircle: {
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        border: '2px solid #C7C7C7',
    },
    locationBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: '15px',
        padding: '10px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    },
    locationHeader: {
        fontSize: '1.3em',
        fontWeight: '600',
        color: '#000000',
    },
    locationName: {
        fontSize: '1em',
        fontWeight: '500',
    },
    locationDetails: {
        fontSize: '0.9em',
        color: '#707070',
    },
    premierCenterTag: {
        marginTop: '10px',
        padding: '5px 10px',
        backgroundColor: '#DFB0EF',
        color: '#803A97',
        borderRadius: '10px',
        fontWeight: '600',
        textAlign: 'center',
    },
    openingHoursBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: '15px',
        padding: '10px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    },
    openingHoursHeader: {
        fontSize: '1.3em',
        fontWeight: '600',
        color: '#000000',
    },
    openingHoursText: {
        fontSize: '0.9em',
        color: '#060313',
    },
    actionButtons: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },
    actionButton: {
        backgroundColor: '#DA291C',
        color: '#FFFFFF',
        fontSize: '0.9em',
        padding: '8px 16px',
        borderRadius: '10px',
        cursor: 'pointer',
        border: 'none',
        transition: 'background-color 0.3s ease',
    },
};

export default DetailedAppointmentBooking;