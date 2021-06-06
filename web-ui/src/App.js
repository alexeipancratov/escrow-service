import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";
import Buyer from "./components/buyer/Buyer";
import Agent from "./components/agent/Agent";
import Navigation from "./components/navigation/Navigation";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <div className="row">
          <div className="col">
            <Navigation />
            <Switch>
              <Route path="/buyer" component={Buyer} />
              <Route path="/agent" component={Agent} />
              <Redirect from="/" to="/buyer" />
            </Switch>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
