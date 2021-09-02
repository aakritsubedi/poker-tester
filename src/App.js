import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import Header from "./components/Header";
import AutoTest from "./routes/autoTest";
import SocketTool from "./components/SocketTool";

function App() {
  return <div className="main-container">
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={SocketTool} />
        <Route path="/auto" exact component={AutoTest} />
      </Switch> 
    </Router>
  </div>
}

export default App;
