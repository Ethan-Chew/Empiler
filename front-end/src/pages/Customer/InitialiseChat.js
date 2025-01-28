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
    const [queueLength, setQueueLength] = useState(0);

    // Reccomend make Appointment
    const [custWaitingTime, setCustWaitingTime] = useState(0);
    const [displayReccoAppt, setDisplayReccoAppt] = useState(false);

    // Handle Connect and Disconnect Events
    const handleConnection = () => {
        if (isConnected) {
            console.log('Already connected');
            return;
        }
        setIsConnected(true);

        socket.emit('customer:request-queue-position', sessionStorage.getItem('customerSessionIdentifier'));

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
                socket.emit('customer:join', customerSessionIdentifier, sessionStorage.getItem('faqSection'), sessionStorage.getItem('faqQuestion'));
            }
        });
    }

    const handleDisconnection = () => {
        setIsConnected(false);
        socket.emit('customer:leave', sessionStorage.getItem('customerSessionIdentifier'), sessionStorage.getItem("queueNumber"));
        sessionStorage.removeItem('customerSessionIdentifier');
        sessionStorage.removeItem('queueNumber');
    };

    const handleDisconnectionButton = () => {
        socket.emit('customer:leave', sessionStorage.getItem('customerSessionIdentifier'), sessionStorage.getItem("queueNumber"));
        sessionStorage.removeItem('customerSessionIdentifier');
        sessionStorage.removeItem('queueNumber');
        navigate('/');
    };

    useEffect(() => {
        if (!(sessionStorage.getItem('faqQuestion') || sessionStorage.getItem('faqSection'))) {
            // TODO: Handle nothing saved
        }
        // Listener for queue updates
        socket.on('utils:waiting-time', (time) => {
            console.log(`Queue position: ${time}`);
            setWaitingTime(time);
            sessionStorage.setItem('queueNumber', time);
        });

        // Listener for joining chat
        socket.on('utils:joined-chat', (caseID, staffName) => {
            navigate(`/chat?caseID=${caseID}`, {
                state: { staffName },
            });
        });

        socket.on('queue:length', (length) => {
            console.log(`Queue length: ${length}`);
            setQueueLength(length);
            sessionStorage.setItem('queueLength', length);
        });
    
        socket.on('connect', handleConnection);
    
        socket.on('disconnect', handleDisconnection);
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
                <p className="text-lg text-gray-500">People ahead of you:</p>
                <p className="text-4xl font-semibold text-ocbcred pt-2 pb-3">{waitingTime === 0 ? "You're Next!" : waitingTime}</p>
                <div className="w-full bg-gray-200 rounded-full h-6 mb-4 relative">
                     {/* Filled Section */}
                    <div
                        className="absolute top-0 left-0 h-6 bg-ocbcred rounded-full transition-all duration-1000 ease-in-out"
                        style={{ width: `${((queueLength - waitingTime) / queueLength) * 100}%`}}
                    ></div>

                    {/* Moving Indicator */}
                    <div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2  w-8 h-8 bg-white rounded-full border-2 shadow-md flex items-center justify-center"
                        style={{ left: `${((queueLength - waitingTime) / queueLength) * 100}%` }}
                    >
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                </div>
                <button
                  className="mt-4 px-4 py-2 bg-ocbcred text-white rounded hover:bg-ocbcdarkred focus:outline-none"
                  onClick={handleDisconnectionButton}
                >
                  Cancel Chat
                </button>

                {/* Suggest Appointment */}
                <div className={`border-t-2 border-neutral-200 py-2 mt-5`}>
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