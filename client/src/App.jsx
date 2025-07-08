import React, { useEffect, useState, useRef } from 'react';
import { io } from "socket.io-client";
import { Container, Typography, TextField } from '@mui/material';

const App = () => {
  const [message, setMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState(""); 
  const socket = useRef(null);  

  const submitHandler = (e) => {
    e.preventDefault();
    if (socket.current) {
      socket.current.emit("message", message); 
    }
  };

  useEffect(() => {
    socket.current = io("http://localhost:3000");  

    socket.current.on("connect", () => {
      console.log("Connected with socket id:", socket.current.id);
    });

   
    socket.current.on("message", (data) => {
      console.log(`Received ${socket.current.id}:`, data);
      setReceivedMessage(data); 
    });

    socket.current.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();  
      }
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography variant="h1" component="div" gutterBottom>
        Welcome to Socket.io
      </Typography>
      <form onSubmit={submitHandler}>
        <TextField
          variant='outlined'
          label="Message"
          id='outlined-basic'
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      <Typography variant="h6" component="div" gutterBottom>
        <strong>Received Message:</strong> {receivedMessage}
      </Typography>
    </Container>
  );
};

export default App;
