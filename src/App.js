import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import Header from "./components/Header";
import SocketTool from "./components/SocketTool";
import AutoTester from "./components/AutoTester";

function App() {
  return <div className="main-container">
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={SocketTool} />
        <Route path="/auto" exact component={AutoTester} />
      </Switch> 
    </Router>
  </div>
}

export default App;
