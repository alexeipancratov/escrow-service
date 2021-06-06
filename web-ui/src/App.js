import React, { useEffect, useState } from "react";
import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";
import Web3 from "web3";
import Buyer from "./components/buyer/Buyer";
import Agent from "./components/agent/Agent";
import Navigation from "./components/navigation/Navigation";
import abi from "./contractAbis/escrowService.json";
import config from "./config.json";
import "./App.css";

function App() {
  const [web3, setWeb3] = useState();
  const [escrowContract, setEscrowContract] = useState();

  useEffect(() => {
    const func = async () => {
      if (!window.ethereum) {
        console.log("Metamask is not installed.");
      }

      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();

      setWeb3(web3);

      // const accounts = await web3.eth.getAccounts();
      // accounts.shift();
      // setAgentAccounts(accounts);
      // console.log(accounts);

      const escrowContractInstance = new web3.eth.Contract(
        abi,
        config.escrowContractAddress
      );
      setEscrowContract(escrowContractInstance);
    };

    func();
  }, []);

  return (
    <BrowserRouter>
      <div className="container">
        <div className="row">
          <Navigation />
          <Switch>
            <Route
              path="/buyer"
              render={(props) => (
                <Buyer {...props} escrowContract={escrowContract} web3={web3} />
              )}
            />
            <Route
              path="/agent"
              render={(props) => (
                <Agent {...props} escrowContract={escrowContract} web3={web3} />
              )}
            />
            <Redirect from="/" to="/buyer" />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
