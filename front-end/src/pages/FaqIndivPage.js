import React, { useState } from 'react';

function FaqIndivPage() {
    const [hoveredButton, setHoveredButton] = useState(null);

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflowX: 'hidden',
            fontFamily: 'Inter, sans-serif',
        },
        header: {
            width: '100%', 
            backgroundColor: '#677A84', 
            height: '15vh', 
        },
        titleContainer: {
            width: '100%', 
            backgroundColor: '#d9d9d9', 
            padding: '40px 20px',
            textAlign: 'left',
        },
        titleText: {
            fontSize: '4vh', 
            fontWeight: 600,
            color: '#000000',
            marginBottom: '10px',
        },
        contentContainer: {
            width: '100%',
            maxWidth: '800px',
            padding: '20px',
            textAlign: 'left',
        },
        roundedBox: {
            backgroundColor: '#ffffff',
            borderRadius: '30px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            margin: '20px 0',
            width: '100%', 
        },
        loremText: {
            color: '#060313',
            fontSize: '1rem',
            marginBottom: '10px',
        },
        helpfulText: {
            color: '#060313',
            fontSize: '1rem',
            marginTop: '50px',
            marginBottom: '10px',
        },
        button: {
            backgroundColor: '#ffffff',
            border: '3px solid #DA291C',
            color: '#DA291C',
            borderRadius: '5px',
            padding: '10px 20px',
            cursor: 'pointer',
            margin: '0 5px',
            textAlign: 'center',
            fontWeight: 500,
            transition: 'all 0.3s ease', 
            transform: hoveredButton === 'action' ? 'scale(1.05)' : 'scale(1)', 
        },
        actionContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
        },
        contactText: {
            fontSize: '1.25rem',
            fontWeight: 500,
            color: '#677A84',
            marginTop: '20px',
            textAlign: 'center',
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: '20px',
        },
        buttonBox: {
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            width: '48%', 
            textAlign: 'center',
            transition: 'all 0.3s ease', 
            transform: hoveredButton === 'button1' ? 'scale(1.05)' : 'scale(1)', 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', 
            marginBottom: '50px',
        },
        buttonBox2: {
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            width: '48%', 
            textAlign: 'center',
            transition: 'all 0.3s ease', 
            transform: hoveredButton === 'button2' ? 'scale(1.05)' : 'scale(1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', 
            marginBottom: '50px',
        },
        svg: {
            width: '10%', 
            height: 'auto',
            marginBottom: '10px',
        },
        buttonText: {
            fontWeight: 500,
        },
        subText: {
            fontSize: '0.9rem',
            color: '#666666',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}></div>

            <div style={styles.titleContainer}>
                <h1 style={styles.titleText}>Title Text (of article clicked)</h1>
            </div>

            <div style={styles.roundedBox}>
                <p style={styles.loremText}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.
                    Nullam congue, nunc et cursus lacinia, justo arcu cursus nisl, et fringilla nisl erat sed ante.
                    Sed tempor, dolor et suscipit sagittis, magna arcu ultricies lacus, ut consectetur magna ante sit amet arcu.
                    Suspendisse potenti. Sed sit amet ex non nisi consequat varius. Curabitur imperdiet libero at aliquet aliquam.
                    Vestibulum viverra urna ac facilisis condimentum.
                </p>
                <p style={styles.loremText}>
                    Phasellus vehicula leo quis felis fermentum, ac venenatis ex pharetra.
                    Praesent et nisi a orci blandit ullamcorper et nec odio.
                    Nunc euismod libero vitae quam egestas, vel vulputate elit ultricies.
                    Aenean luctus dolor ut velit consectetur, et dictum felis fermentum.
                    Nulla facilisi. Sed euismod ac erat vel interdum.
                </p>
                <p style={styles.helpfulText}>Was this information helpful?</p>
                <div style={styles.actionContainer}>
                    <button
                        style={styles.button}
                        onMouseEnter={() => setHoveredButton('action')}
                        onMouseLeave={() => setHoveredButton(null)}
                    >
                        No
                    </button>
                    <button
                        style={styles.button}
                        onMouseEnter={() => setHoveredButton('action')}
                        onMouseLeave={() => setHoveredButton(null)}
                    >
                        Yes
                    </button>
                </div>
            </div>

            <p style={styles.contactText}>Still need help? Get in touch.</p>

            <div style={styles.buttonContainer}>
                <div
                    style={styles.buttonBox}
                    onMouseEnter={() => setHoveredButton('button1')}
                    onMouseLeave={() => setHoveredButton(null)}
                >
                    <img src="/startLiveChat.svg" alt="Start a Live Chat" style={styles.svg} /> 
                    <p style={styles.buttonText}>Start a Live Chat</p>
                    <p style={styles.subText}>Waiting time:<br />2 minutes or less</p>
                </div>
                <div
                    style={styles.buttonBox2}
                    onMouseEnter={() => setHoveredButton('button2')}
                    onMouseLeave={() => setHoveredButton(null)}
                >
                    <img src="/scheduleAppointment.svg" alt="Schedule an Appointment" style={styles.svg} /> 
                    <p style={styles.buttonText}>Schedule an Appointment</p>
                    <p style={styles.subText}>for any further enquiries</p>
                </div>
            </div>
        </div>
    );
}

export default FaqIndivPage;