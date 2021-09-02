import { useState,useEffect, createRef } from "react";
import PokerService from "../services/poker";
import Select from "react-select";
import io from "socket.io-client";
import "../assets/css/auto-test.css"
const AutoTest=()=>{
  const [data,setData]=useState([]);
  const [selectedServer, setSelectedServer] = useState("");
  const [servers, setServers] = useState([]);
  const [isConnected, setIsConnected] = useState({
    status: false,
    message: "trying to connect to server",
  });
  const refs=[];
  let [rows,setRows]=useState([]);
  let [newSocket,setNewSocket]=useState(null);
  const changeServer = (selectedServer) => {
    setSelectedServer(selectedServer);
  };

  const getConnection = (url) => {
    return io(url);
  };
  useEffect(() => {
    async function fetchMyAPI() {
      const events = await PokerService.fetchAllEvents();
      let filtered_events=events.data.filter(item=>item.event&&item.data&&item.listener&&item.event!=="disconnect")
      
      const servers = await PokerService.fetchServers();
      const myServers = servers.data.map((server) => ({
        value: server.server,
        label: server.server,
      }));
      
      setData(filtered_events);
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
        // setNewSocket(newSocket);
        let rows=autoFire(newSocket);
        setRows(rows);
        console.log("connected!!");
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

  function fireEvent(socket, event, data,listener,index) {
    data=JSON.parse(data);
    // console.log(data);
    socket.emit(event,data);
    listenEvent(socket, listener,index);
  }
  
  function listenEvent(socket, listenTo,index) {
    socket.on(listenTo, (retdata) => {
      // console.log("response ",retdata);      
      data[index].status="complete";  
      refs[index].current.style.backgroundColor="green";
      refs[index].current.innerHTML="complete";
      // console.log(summary,summary.current);
      document.querySelector(".summary").innerHTML=`${data.filter(item=>item.status==="complete").length}/${data.length}`;
      socket.removeListener(listenTo);
    });
  }
  
  function autoFire(socket)
  {  
    let rows=data.map((item,index)=>{
      fireEvent(socket,item.event,item.data,item.listener,index);
      item.status="running";
      let ref=createRef()
      let row= <tr key={index}>
        <td>{index+1}</td>
        <td>{item.event}</td>
        {/* <td>{item.data}</td> */}
        <td>{item.listener}</td>
        <td ref={ref}>{item.status}</td>
      </tr>
      refs.push(ref);
      return row;
    })
    return rows;
  }

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
    <div className="auto-test">
        <h2 className="page-title">Auto Test</h2>
        <div className="summary" >
          {data.filter(item=>item.status==="complete").length}/{data.length}
        </div>
        <table className="workTable">
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Event</th>
              {/* <th>Data</th> */}
              <th>Listener</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
        {
          rows
        }
        </tbody>
        </table>
        
    </div>
    </div>
    );
}

export default AutoTest;