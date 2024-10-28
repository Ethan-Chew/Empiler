import { socket } from './utils/chatSocket';
import { useState, useEffect } from 'react';

// ALL CODE IN THIS FILE IS OVERWRITABLE, FOR DEBUG USE ONLY. TO BE REPLACED.
export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    console.log(socket)
    // Handle Connect and Disconnect Events
    function handleConnection() {
      setIsConnected(true);
      console.log("Connected")
      socket.emit('customer:join', "Section", "Question");
    }
    function handleDisconnection() {
      setIsConnected(false);
      socket.emit('customer:leave');
    };
    socket.on('connect', handleConnection);
    socket.on('disconnect', handleDisconnection);
    socket.on("connect_error", (err) => {
      // the reason of the error, for example "xhr poll error"
      console.log(err.message);
    
      // some additional description, for example the status code of the initial HTTP response
      console.log(err.description);
    
      // some additional context, for example the XMLHttpRequest object
      console.log(err.context);
    });

    if (socket.connected) handleConnection();

    return () => {
        socket.off('connect', handleConnection);
        socket.off('disconnect', handleDisconnection);
    }
  }, []);

  return (
    <div>
      <a>Connection Status: { "" + isConnected }</a>
    </div>
  );
}