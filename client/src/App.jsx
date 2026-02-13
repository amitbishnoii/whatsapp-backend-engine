import React, { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import "./App.css"

const App = () => {

  const socketRef = useRef(null);
  const typingTimerRef = useRef(null);
  const isTypingRef = useRef(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [recID, setRecID] = useState("");
  const [userID, setUserID] = useState("");
  const [typing, setTyping] = useState("");
  const [notTyping, setNotTyping] = useState("");
  const [showChatUI, setShowChatUI] = useState(false);
  const [socketReady, setSocketReady] = useState(false);

  const handleSend = () => {
    socketRef.current.emit("send-message", { message, recID });
    setMessages((prev) => [...prev, message]);
    setMessage("");
    setRecID("");
    console.log('message sent!!');
  }

  function handleMessageChange(e) {
    setMessage(e.target.value);

    if (!isTypingRef.current) {
      socketRef.current.emit("typing:start", { userID, recID });
      isTypingRef.current = true;
    }

    clearTimeout(typingTimerRef.current);

    typingTimerRef.current = setTimeout(() => {
      socketRef.current.emit("typing:stop", userID);
      isTypingRef.current = false;
    }, 1000);
  };

  const handleLogin = () => {
    if (!userID) return;
    if (socketRef.current) return;

    socketRef.current = io("http://localhost:3000", {
      auth: { userId: userID },
    });

    socketRef.current.emit("connect-user", userID);
    
    setSocketReady(true);
    setShowChatUI(true);
  }

  useEffect(() => {

    if (!socketReady) return;
    let socket = socketRef.current;

    socket.on("connect", () => {
      console.log('user connected: ', socketRef.current.id);
    });

    socket.on("user-online", (socketID) => {
      console.log(socketID.uid, ' user is online.');
    });

    socket.on("user-offline", (user) => {
      console.log(user, ' user is offline.');
    });

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      console.log('got a message: ', msg);
    });

    socket.on("typing-start", (username) => {
      setTyping(username);
      setNotTyping(null);
      console.log(username, ' is typing!');
    });

    socket.on("typing-stop", (username) => {
      setNotTyping(username);
      setTyping(null);
      console.log(username, ' stopped typing!');
    });

    return () => {
      socket.disconnect();
    };
  }, [socketReady]);

  return (
    <div>
      <div className="container">
        {showChatUI ? (
          <div className="cont">
            <div className="message-box">
              <input type="text" value={message} onChange={handleMessageChange} placeholder='message' className='text-input' />
              <input type="text" value={recID} onChange={(e) => { setRecID(e.target.value) }} placeholder='To...' className='text-input' />
              <button className="button" onClick={handleSend}>Send</button>
            </div>
            <div className="typing-status">
              {typing ? <p>{typing} is typing...</p> : <p></p>}
            </div>
          </div>
        ) : (
          <div className="id-box">
            <input type="text" value={userID} onChange={(e) => { setUserID(e.target.value) }} placeholder='Your User ID...' className='text-input' />
            <button className="button" onClick={handleLogin}>Login</button>
          </div>
        )}

      </div>
      <div className="message-container">
        {messages ? messages.map((text, index) => {
          return <div key={index}>{text}</div>
        }) : ""}
      </div>
    </div>
  )
}

export default App