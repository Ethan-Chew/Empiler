import { useState, useEffect } from 'react';
import { socket } from '../../utils/chatSocket';
import { useNavigate } from 'react-router-dom';
import * as CryptoJS from 'crypto-js';

export default function InitialiseChat() {
    const navigate = useNavigate();
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [waitingTime, setWaitingTime] = useState(0);

    // Search Params Data
    const [faqSection, setFaqSection] = useState('');
    const [faqQuestion, setFaqQuestion] = useState('');


    // WIP: Write code to initialise the connection to backend and await a response
    useEffect(() => {
        setFaqSection(sessionStorage.getItem('faqSection'));
        setFaqQuestion(sessionStorage.getItem('faqQuestion'));

        if (!(faqQuestion || faqQuestion)) {
            // TODO: Handle nothing saved
        }

        // Generate a Unique Identifier for this Customer Session
        const customerSessionIdentifier = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
        sessionStorage.setItem('customerSessionIdentifier', customerSessionIdentifier);

        // Handle Connect and Disconnect Events
        const handleConnection = () => {
            setIsConnected(true);
            console.log("Connected to Socket.IO Backend");
            socket.emit('customer:join', customerSessionIdentifier, faqSection, faqQuestion);
        }
        const handleDisconnection = () => {
            setIsConnected(false);
            socket.emit('customer:leave');
        };
        socket.on('connect', handleConnection);
        socket.on('disconnect', handleDisconnection);

        // Handle Utility Events
        socket.on('utils:waiting-time', (time) => {
            setWaitingTime(time);
        })

        socket.on('utils:joined-chat', (caseId) => {
            navigate(`/chat?caseID=${caseId}`);
        })

        return () => {
            socket.off('connect', handleConnection);
            socket.off('disconnect', handleDisconnection);
        }
    }, []);

    return (
        <div className="min-w-screen min-h-screen flex items-center md:justify-center">
            <div className="p-5 md:p-10 rounded-xl bg-white md:drop-shadow-[0_0px_4px_rgba(0,0,0,.3)] md:w-1/2">
                <div className="flex flex-col gap-5">
                    <div>
                        <img src="/ocbc.png" className="w-1/3 lg:w-1/6 mb-2" />
                        <h1 className="font-bold text-2xl mb-2">We're connecting you to an advisor.</h1>
                        <p><span className="font-bold">Estimated Waiting Time: </span>{waitingTime} minutes</p>
                    </div>
                    <p>Our Customer Support Agents are over capacity right now. Please forgive us as we connect you to an available agent.</p>
                </div>

                {/* Future: if taking too long, ask to make appintment instead? */}
            </div>
        </div>
    )
}