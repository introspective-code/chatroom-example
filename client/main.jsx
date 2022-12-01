import React, { useState, useEffect, useRef, Fragment } from 'https://cdn.skypack.dev/react';
import ReactDOM from 'https://cdn.skypack.dev/react-dom';
import io from 'https://cdn.skypack.dev/socket.io-client';

const socket = io("http://localhost:8000");

const App = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [room, setRoom]               = useState(null);
  const [username, setUsername]       = useState(null);

  const roomInputRef = useRef();
  const usernameInputRef = useRef();

  const handleSocketConnect = () => {
    setIsConnected(true);
  }

  const handleSocketDisconnect = () => {
    setIsConnected(false);
  }

  const handleSocketRoomJoined = ({ roomCode, username }) => {
    setRoom(roomCode);
    setUsername(username);
  }

  const handleSocketUserJoined = ({ username }) => {
    console.log({ username });
  }

  const handleJoinRoom = () => {
    const roomCode = roomInputRef.current.value;
    const username = usernameInputRef.current.value || socket.id;

    socket.emit('join', { roomCode, username });
  }

  useEffect(() => {
    socket.on('connect', handleSocketConnect);
    socket.on('disconnect', handleSocketDisconnect);
    socket.on('room-joined', handleSocketRoomJoined);
    socket.on('user-joined', handleSocketUserJoined);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const isInRoom    = room && username;
  const isNotInRoom = !isInRoom;

  return (
    <div>
      <div>{isConnected ? 'Connected to server.' : 'Not connected to server.'}</div>

      {isNotInRoom && (
        <Fragment>
          <div>Please join a room:</div>
          <input type="text" placeholder="Enter username" ref={usernameInputRef} />
          <input type="text" placeholder="Enter roomId" ref={roomInputRef} />
          <button onClick={handleJoinRoom}>Join Room</button>
        </Fragment>
      )}

      {isInRoom && (
        <div>{`In room: ${room} as ${username}`}</div>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
