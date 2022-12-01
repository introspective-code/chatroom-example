import React, { useState, useEffect } from 'https://cdn.skypack.dev/react';
import ReactDOM from 'https://cdn.skypack.dev/react-dom';
import io from 'https://cdn.skypack.dev/socket.io-client';

const socket = io("http://localhost:8000");

const App = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  const handleSocketConnect = () => {
    setIsConnected(true);
  }

  const handleSocketDisconnect = () => {
    setIsConnected(false);
  }

  useEffect(() => {
    socket.on('connect', handleSocketConnect);
    socket.on('disconnect', handleSocketDisconnect);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <div>
      <h1>{ isConnected ? 'Connected' : 'Not Connected' }</h1>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
