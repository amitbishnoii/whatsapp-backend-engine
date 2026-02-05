import React, { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import "./App.css"

const App = () => {

  const socketRef = useRef(null);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    socketRef.current.emit("send-message", message);
    console.log('message sent!!');
  }

  useEffect(() => {

    socketRef.current = io("http://localhost:3000");

    socketRef.current.on("connect", () => {
      console.log('user connected: ', socketRef.current.id);
    });

    socketRef.current.on("recieve-message", (msg) => {
      console.log('got a message bro: ', msg);
    });


    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <div>
      <div className="container">
        <input type="text" value={message} onChange={(e) => { setMessage(e.target.value) }} placeholder='message' className='text-input' />
        <button className="button" onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default App