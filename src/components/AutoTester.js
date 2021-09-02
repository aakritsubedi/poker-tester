import Select from "react-select";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";

import PokerService from "../services/poker";

const AutoTester = () => {
  const [socket, setSocket] = useState("");
  const [selectedServer, setSelectedServer] = useState("");
  const [servers, setServers] = useState([]);

  const [events, setEvents] = useState([]);

  const [isConnected, setIsConnected] = useState({
    status: false,
    message: "trying to connect to server",
  });

  const changeServer = (selectedServer) => {
    setSelectedServer(selectedServer);
  };

  const getConnection = (url) => {
    return io(url);
  };

  const listenEvent = async (listener, index) => {
    socket.on(listener, (data) => {
      if (data) {
        events[index].status = "Success";
        events[index].response = data;
      }
    });
  };

  const fireEvent = (event, data, listener, index) => {
    socket.emit(event, JSON.parse(data));
    listenEvent(listener, index);
  };

  const triggerAllEvents = () => {
    events.forEach(async (myEvent, index) => {
      const { event, listener, data } = myEvent;
      if (event && listener && data) {
        fireEvent(event, data, listener, index);
      }
    });
  };

  useEffect(() => {
    async function fetchMyAPI() {
      const servers = await PokerService.fetchServers();
      const events = await PokerService.fetchAllEvents();

      const myServers = servers.data.map((server) => ({
        value: server.server,
        label: server.server,
      }));

      const allEvents = events.data.map((event) => ({
        ...event,
        response: {},
        status: event.data ? "Running" : "Insufficient data",
      }));

      setEvents(allEvents);

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
        setSocket(newSocket);
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

      return () => newSocket.close();
    }
  }, [selectedServer]);

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
      <hr />
      <button onClick={triggerAllEvents}>Trigger All</button>
      <table>
        <thead>
          <tr>
            <th>SN</th>
            <td>Socket Info</td>
            <td>Status</td>
          </tr>
        </thead>
        <tbody>
          {events.map((row, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <b>Event: </b> {row.event} <br />
                  <b>Listener: </b> {row.listener}
                </td>
                <td>{row.status}</td>
                <td>
                  <button
                    onClick={() => fireEvent(row.event, row.data, row.listener, index)}
                  >
                    Run
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AutoTester;
