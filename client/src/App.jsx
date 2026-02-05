import React, { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import "./App.css"

const App = () => {

  const socketRef = useRef(null);
  const [message, setMessage] = useState("");
  const [recID, setRecID] = useState("");
  const [userID, setUserID] = useState("");
  const [showChatUI, setShowChatUI] = useState(false);

  const handleSend = () => {
    socketRef.current.emit("send-message", { message, recID, userID });
    setMessage("");
    setUserID("");
    setRecID("");
    console.log('message sent!!');
  }

  const handleStart = () => {
    socketRef.current.emit("connect-user", userID);
    setShowChatUI(true);
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
        {showChatUI ? (
          <div className="message-box">
            <input type="text" value={message} onChange={(e) => { setMessage(e.target.value) }} placeholder='message' className='text-input' />
            <input type="text" value={recID} onChange={(e) => { setRecID(e.target.value) }} placeholder='To...' className='text-input' />
            <button className="button" onClick={handleSend}>Send</button>
          </div>
        ) : (
          <div className="id-box">
            <input type="text" value={userID} onChange={(e) => { setUserID(e.target.value) }} placeholder='Your User ID...' className='text-input' />
            <button className="button" onClick={handleStart}>Start</button>
          </div>
        )}

      </div>
    </div>
  )
}

export default App