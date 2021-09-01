import Select from "react-select";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import PokerService from "../services/poker";

import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/neat.css';
require('codemirror/mode/css/css');
require('codemirror/mode/javascript/javascript');



const SocketTool = () => {
  const [socket, setSocket] = useState("");
  const [selectedServer, setSelectedServer] = useState("");
  const [servers, setServers] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState("");
  const [events, setEvents] = useState([]);

  const [isConnected, setIsConnected] = useState({
    status: false,
    message: "trying to connect to server",
  });

  const [response, setResponse] = useState("");

  const changeServer = (selectedServer) => {
    setSelectedServer(selectedServer);
  };

  const changeEvent = (selectedEvent) => {
    setSelectedEvent(selectedEvent);
  };

  const getConnection = (url) => {
    return io(url);
  };

  const listenEvent = () => {
    const { listener } = selectedEvent;
    socket.on(listener, (data) => {
      setResponse(data);
      socket.removeListener(listener);
    });
  };

  const fireEvent = () => {
    const { event,data } = selectedEvent;
    socket.emit(event, JSON.parse(data));
    listenEvent();
  
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
        value: event.event,
        label: event.event,
      }));

      setServers(myServers);
      setSelectedServer(myServers[1]);

      setEvents(allEvents);
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
      <div>
        <h2>Events</h2>
      </div>
      <div className="row">
        <div className="column">
          <Select
            value={selectedEvent}
            options={events}
            onChange={changeEvent}
          />
        </div>
        <div className="column">
          <input value={selectedEvent.listener} />
        </div>
        <button className="btn" onClick={fireEvent}>
          Send
        </button>
      </div>
      <div className="my-3">JSON</div>
      <div className="row">
        <div className="column request-json-editor">
          <CodeMirror
            value={selectedEvent.data}
            options={{
              mode: 'javascript',
              theme: 'material',
              lineNumbers: true
            }}
            onBeforeChange={(editor,data,value)=>{
              setSelectedEvent({
                ...selectedEvent,
                data:value
              })
            }}
          />
        </div>
      </div>
      <br/>

      <div className="my-3">Response</div>
      <div className="row">
        <div className="column response-json-editor">
         <CodeMirror
            value={JSON.stringify(response,null,2)}
            options={{
              mode: 'javascript',
              theme: 'material',
              lineNumbers: true
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SocketTool;
