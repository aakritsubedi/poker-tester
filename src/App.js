
import {BrowserRouter as Router,Route,Switch } from "react-router-dom";

import AutoPage from "./routes/AutoPage";
import AboutPage from "./routes/AboutPage";
import Sidebar from "./components/sidebar";
import Connections from "./routes/connections";
import RequestPage from "./routes/RequestPage";

function App(){
  return (
    <Router>
      <div className="container">
        <div className="side-bar">
          <Sidebar active="connection"/>
        </div>
        <div className="content-pane">
            <Switch>
                <Route path="/connection" component={Connections}/>
                <Route path="/request" component={RequestPage}/>
                <Route path="/auto" component={AutoPage}/>
                <Route path="/about" component={AboutPage}/>
            </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
