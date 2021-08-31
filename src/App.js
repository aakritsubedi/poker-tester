import Sidebar from "./components/sidebar";
function App() {
  return (
    <div className="container">
      <div className="side-bar">
         <Sidebar active="connection"/>
      </div>
      <div className="content-pane">
        Hello world!!
      </div>
    </div>
  );
}

export default App;
