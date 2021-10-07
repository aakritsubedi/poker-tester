import Select from "react-select";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";

import PokerService from "../services/poker";

import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/neat.css";
require("codemirror/mode/css/css");
require("codemirror/mode/javascript/javascript");

const AutoTester = () => {
  const [socket, setSocket] = useState("");
  const [selectedServer, setSelectedServer] = useState("");
  const [servers, setServers] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState("");

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
      if (data || data === "") {
        const eventsList = [...events];
        eventsList[index].response = data || {};
        eventsList[index].status = "Success";
        document.querySelector("#success-summary").innerHTML = `${
          events.filter((event) => event.status === "Success").length
        }/${
          events.filter((event) => event.status !== "Insufficient data").length
        } successful`;
        setEvents(eventsList);
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
        status: event.data ? "Waiting..." : "Insufficient data",
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

  const viewModal = (event) => {
    setSelectedEvent(event);
  };

  return (
    <>
      <div className="container-fluid">
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
        <br />

        <div className="alert alert-primary clearfix">
          <span id="success-summary">
            {events.filter((event) => event.status === "Success").length}/
            {
              events.filter((event) => event.status !== "Insufficient data")
                .length
            }{" "}
            successful.
          </span>
          <br />
          {
            events.filter((event) => event.status === "Insufficient data")
              .length
          }
          /{events.length} have insufficient data.
          <button
            className="btn btn-success float-right"
            onClick={triggerAllEvents}
          >
            Trigger All
          </button>
        </div>
        <div className="data-summary"></div>
        <table className="table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Socket Info</th>
              <th>Status</th>
              <th></th>
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
                    {row.data && (
                      <button
                        className="btn btn-primary mr-2"
                        onClick={() =>
                          fireEvent(row.event, row.data, row.listener, index)
                        }
                      >
                        Run
                      </button>
                    )}
                    {row.status === "Success" && (
                      <button
                        className="btn btn-primary"
                        data-toggle="modal"
                        data-target="#eventInfo"
                        onClick={() => viewModal(row)}
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selectedEvent && (
        <div
          className="modal fade"
          id="eventInfo"
          tabindex="-1"
          role="dialog"
          aria-labelledby="eventInfoLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="eventInfoLabel">
                  Summary of event `{selectedEvent.event}`
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div>
                  <table className="table table-sm">
                    <tr>
                      <td>Event Name: {selectedEvent.event}</td>
                    </tr>
                    <tr>
                      <td>Event Listener: {selectedEvent.listener}</td>
                    </tr>
                    <tr>
                      <td>Status: {selectedEvent.status}</td>
                    </tr>
                  </table>
                </div>
                <h3>Response</h3>
                <CodeMirror
                  value={JSON.stringify(selectedEvent.response || {}, null, 2)}
                  options={{
                    mode: "javascript",
                    theme: "material",
                    lineNumbers: true,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AutoTester;
