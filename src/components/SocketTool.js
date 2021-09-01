import Select from "react-select";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";

import PokerService from "../services/poker";

const SocketTool = () => {
  const [selectedServer, setSelectedServer] = useState("");
  const [servers, setServers] = useState([]);
  const [isConnected, setIsConnected] = useState({
    status: false,
    message: "trying to connect to server",
  });
  const [socket, setSocket] = useState();

  const changeServer = (selectedServer) => {
    setSelectedServer(selectedServer);
  };

  const getConnection = (url) => {
    return io(url);
  };
  useEffect(() => {
    async function fetchMyAPI() {
      const servers = await PokerService.fetchServers();

      const myServers = servers.data.map((server) => ({
        value: server.server,
        label: server.server,
      }));

      setServers(myServers);
      setSelectedServer(myServers[1]);
    }

    fetchMyAPI();
  }, []);

  useEffect(() => {
    if (selectedServer.value) {
      setIsConnected({
        status: false,
        message: `trying to connect to ${selectedServer.value}`,
      });

      const newSocket = getConnection(selectedServer.value);

      newSocket.on("connect", () => {
        setIsConnected({
          status: true,
          message: `connected to ${selectedServer.value}`,
        });
      });

      newSocket.on("connect_error", () => {
        setIsConnected({
          status: false,
          message: `connection error while connecting to ${selectedServer.value}`,
        });
      });

      newSocket.on("disconnect", function () {
        setIsConnected({
          status: false,
          message: `disconnected from ${selectedServer.value}`,
        });
      });
      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [selectedServer, socket]);

  return (
    <div className="container">
      <Select
        value={selectedServer}
        options={servers}
        onChange={changeServer}
      />
      {isConnected.status ? (
        <span className="help-text success">{isConnected.message}</span>
      ) : (
        <span className="help-text danger">{isConnected.message}</span>
      )}

      {isConnected.status ? (
        <div className="status">
          <div className="dot dot-success"></div>
          <span>Online</span>
        </div>
      ) : (
        <div className="status">
          <div className="dot dot-danger"></div>
          <span>Offline</span>
        </div>
      )}
    </div>
  );
};

export default SocketTool;
