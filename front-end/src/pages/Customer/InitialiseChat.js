import { useState, useEffect } from 'react';
import { socket } from '../../utils/chatSocket';
import { useNavigate } from 'react-router-dom';
import * as CryptoJS from 'crypto-js';

export default function InitialiseChat() {
    const navigate = useNavigate();
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [waitingTime, setWaitingTime] = useState(0);
    const [connectionErr, setConnectionErr] = useState(false);

    // Search Params Data
    const [faqSection, setFaqSection] = useState('');
    const [faqQuestion, setFaqQuestion] = useState('');

    // Handle Connect and Disconnect Events
    const handleConnection = () => {
        setIsConnected(true);
        console.log('Connected to Socket');
        // Generate a Unique Identifier for this Customer Session
        if (sessionStorage.getItem('customerSessionIdentifier') !== null) {
            return;
        }
        const customerSessionIdentifier = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
        sessionStorage.setItem('customerSessionIdentifier', customerSessionIdentifier);

        // Check if the Customer already exists on the waiting list.
        socket.emit('utils:verify-waitinglist', customerSessionIdentifier, (result) => {
            if (!result) { // If the Customer is not on the Waiting List, request for a new connection
                socket.emit('customer:join', customerSessionIdentifier, sessionStorage.getItem('faqSection'), sessionStorage.getItem('faqQuestion'));
            } else {
                // Check if the Customer is already in an active chat. If yes, redirect to the chat page; else, do nothing.
                socket.emit('utils:verify-activechat', customerSessionIdentifier, (chatExistanceReq) => {
                    if (chatExistanceReq.exist) {
                        navigate(`/chat?caseID=${chatExistanceReq.caseID}`);
                    }
                });
            }
        });
    }

    const handleDisconnection = () => {
        setIsConnected(false);
        socket.emit('customer:leave');
    };

    useEffect(() => {
        setFaqSection(sessionStorage.getItem('faqSection'));
        setFaqQuestion(sessionStorage.getItem('faqQuestion'));

        if (!(faqQuestion || faqQuestion)) {
            // TODO: Handle nothing saved
        }

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
    }, [socket]);

    useEffect(() => {
        if (isConnected) {
            setConnectionErr(false)
        } else {
            setConnectionErr(true);
        };
    }, [isConnected]);

    return (
        <div className="min-w-screen min-h-screen flex items-center md:justify-center">
            <img className='z-0 fixed top-0 h-screen w-screen object-cover opacity-30' src='callcenter.jpg' />
            <div className="p-5 md:p-10 rounded-xl bg-white md:drop-shadow-[0_0px_4px_rgba(0,0,0,.3)] md:w-1/2">
                <div className="flex flex-col gap-5">
                    <div>
                        <img src="/ocbc.png" className="w-1/3 lg:w-1/6 mb-2" />
                        <h1 className="font-bold text-2xl mb-2">We're connecting you to an advisor.</h1>
                        <p><span className="font-bold">Estimated Waiting Time: </span>{connectionErr ? "CONNECTION ERROR" : `${waitingTime} minutes`}</p>
                    </div>
                    <p>Our Customer Support Agents are over capacity right now. Please forgive us as we connect you to an available agent.</p>
                </div>

                {/* Future: if taking too long, ask to make appintment instead? */}
            </div>
        </div>
    )
}