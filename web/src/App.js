import TextField from "@material-ui/core/TextField";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./App.css";

function App() {
  const [state, setState] = useState({ message: "", name: "" });
  const [chat, setChat] = useState([]);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:4000");
    socketRef.current.on("message", ({ name, message }) => {
      setChat([...chat, { name, message }]);
    });
    return () => socketRef.current.disconnect();
  }, [chat]);

  const onTextChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e) => {
    const { name, message } = state;
    socketRef.current.emit("message", { name, message });
    e.preventDefault();
    setState({ message: "", name });
  };

  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h4>
          {name}: 
        </h4>
        <p>{message}</p>
      </div>
    ));
  };

  return (
    <div>
      <div class="alert">
        <h4 style={{fontStyle: "italic"}}>Note:</h4> 
        <h4 style={{color: "black"}}>Open another tab and start your conversation.</h4>
      </div>
    <div className="card">
      <form onSubmit={onMessageSubmit}>
      <h1>Chat Log</h1>
        <div className="render-chat">
          {chat.length > 0 ? renderChat() : <h3 className="no-history">No chat history found</h3>}
        </div>
        <h1>Messenger</h1>
        <div className="name-field">
          <TextField
            name="name"
            onChange={(e) => onTextChange(e)}
            value={state.name}
            required
            label="Name"
          />
        </div>
        <div>
          <TextField
            name="message"
            onChange={(e) => onTextChange(e)}
            value={state.message}
            id="outlined-multiline-static"
            variant="outlined"
            label="Message"
            style={{ width: 500, maxWidth: "100%" }}
          />
        </div>
        <div style={{ textAlign: "right" }}>
          <button>Send Message</button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default App;
