import SocketTool from "./components/SocketTool";
import Header from "./components/Header";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

function App() {
  return <div class="main-container">
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={SocketTool } />
      </Switch> 
    </Router>
  </div>
}

export default App;
