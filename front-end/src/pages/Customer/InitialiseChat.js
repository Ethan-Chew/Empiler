import { useState, useEffect } from 'react';
import { socket } from '../../utils/chatSocket';
import { useNavigate } from 'react-router-dom';
import * as CryptoJS from 'crypto-js';

// Components
import Navbar from '../../components/Navbar';
import { BsCalendarCheck } from "react-icons/bs";

export default function InitialiseChat() {
    const navigate = useNavigate();
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [waitingTime, setWaitingTime] = useState(0);
    const [connectionErr, setConnectionErr] = useState(false);

    // Reccomend make Appointment
    const [custWaitingTime, setCustWaitingTime] = useState(0);
    const [displayReccoAppt, setDisplayReccoAppt] = useState(false);

    // Handle Connect and Disconnect Events
    const handleConnection = () => {
        if (isConnected) return;
        setIsConnected(true);

        // Generate a Unique Identifier for this Customer Session
        let customerSessionIdentifier = sessionStorage.getItem('customerSessionIdentifier');
    
        if (!customerSessionIdentifier) {
            customerSessionIdentifier = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
            sessionStorage.setItem('customerSessionIdentifier', customerSessionIdentifier);
        }

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
        sessionStorage.removeItem('customerSessionIdentifier');
        socket.emit('customer:leave');
    };

    const handleDisconnectionButton = () => {
        socket.disconnect();
        navigate('/');
    };

    useEffect(() => {
        if (!(sessionStorage.getItem('faqQuestion') || sessionStorage.getItem('faqSection'))) {
            // TODO: Handle nothing saved
        }

        socket.on('connect', handleConnection);
        socket.on('disconnect', handleDisconnection);

        // Handle Utility Events
        socket.on('utils:waiting-time', (time) => {
            setWaitingTime(time);
        })

        socket.on('utils:joined-chat', (caseID, staffName) => {
             navigate(`/chat?caseID=${caseID}`, {
                state: {
                    staffName: staffName
                }
             });
        })

        return () => {
            socket.off('connect', handleConnection);
            socket.off('disconnect', handleDisconnection);
        }
    }, []);

    // Handle the display of the Suggest Appointment button
    useEffect(() => {
        // Increment inactivity time every minute
        const interval = setInterval(() => {
            setCustWaitingTime(prev => prev + 1);

            if (custWaitingTime >= 5 || (waitingTime < 10 && custWaitingTime >= 3)) {
                setDisplayReccoAppt(true);
            }
        }, 60000);

        return () => {
            clearInterval(interval);
        }
    }, []);

    useEffect(() => {
        if (isConnected) {
            setConnectionErr(false)
        } else {
            setConnectionErr(true);
        };
    }, [isConnected]);

    return (
        <div className="flex flex-col h-screen">
          <><Navbar />
            <div className="w-full bg-ocbcred text-white py-3 px-5">
              <h1 className="text-2xl font-semibold">OCBC Support | Live Chat</h1>
            </div>
            <div className="flex-grow overflow-hidden flex items-center justify-center">
              <div className="flex flex-col items-center justify-center p-10 bg-white drop-shadow-[0_0px_4px_rgba(0,0,0,.15)]">
                <p className="text-xl font-medium text-gray-800 mb-2">Please hold while we connect you to an agent.</p>
                <div className="w-8 h-8 border-4 border-t-4 border-gray-300 rounded-full animate-spin mb-2" style={{ borderTopColor: "#8b3d58" }}></div>
                <p>Estimated Waiting Time: <span className="font-bold">{connectionErr ? "Loading queue information..." : `${waitingTime} minutes`}</span></p>
                <button
                  className="mt-4 px-4 py-2 bg-ocbcred text-white rounded hover:bg-ocbcdarkred focus:outline-none"
                  onClick={handleDisconnectionButton}
                >
                  Cancel Chat
                </button>

                {/* Suggest Appointment */}
                <div className="border-t-2 border-neutral-200 py-2 mt-5">
                    <p className='font-semibold mb-3'>Cannot wait? Consider making an appointment instead.</p>
                    <button
                        className='w-full py-2 px-4 flex flex-row rounded-xl bg-white drop-shadow-[0_0px_3px_rgba(0,0,0,.15)] items-center gap-3 text-ocbcred hover:text-ocbcdarkred'
                        onClick={() => navigate('/appointments/branches')}
                    >
                        <div className='w-10 h-10 rounded-full bg-ocbcred/10 flex justify-center items-center'>
                            <BsCalendarCheck className='text-xl' />
                        </div>
                        <p className='text-lg font-medium'>Make an Appointment</p>
                    </button>
                </div>
              </div>
            </div>
          </>
        </div>
    )
}