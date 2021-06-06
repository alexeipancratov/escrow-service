import React, { useState } from "react";
import config from "../../config.json";

export default function Buyer(props) {
  const [escrowParams, setEscrowParams] = useState({
    agent: "",
    conditions: "",
  });
  const [ethAmount, setEthAmount] = useState("");

  const onEscrowParamChange = (e) => {
    const { id, value } = e.target;
    setEscrowParams({ ...escrowParams, [id]: value });
  };

  const handleSetEscrowAndConditions = (e) => {
    e.preventDefault();

    console.log(escrowParams);

    const func = async () => {
      const accounts = await props.web3.eth.getAccounts();

      props.escrowContract.methods
        .chooseEscrowAgentAndCondition(
          escrowParams.agent,
          escrowParams.conditions
        )
        .send({ from: accounts[0] })
        .on("error", (error) => console.log(error))
        .on("receipt", (receipt) => {
          console.log("=== Receipt ===");
          console.log(receipt);
          alert(
            `Transaction hash ${receipt.transactionHash}\nGas used: ${receipt.gasUsed}`
          );

          setEscrowParams({
            agent: "",
            conditions: "",
          });
        });
    };
    func();
  };

  const onEthAmountChange = (e) => {
    setEthAmount(e.target.value);
  };

  const handleMoneyTransfer = (e) => {
    e.preventDefault();

    const func = async () => {
      const accounts = await props.web3.eth.getAccounts();

      props.web3.eth
        .sendTransaction({
          from: accounts[0],
          to: config.escrowContractAddress,
          value: props.web3.utils.toWei(ethAmount.toString(), "ether"),
        })
        .on("error", (error) => console.log(error))
        .on("receipt", (receipt) => {
          alert(
            `Transaction hash ${receipt.transactionHash}\nGas used: ${receipt.gasUsed}`
          );
          setEthAmount("");
        });
    };
    func();
  };

  return (
    <>
      <h1>Buyer</h1>
      <div className="col">
        <h4>Step 1 - Escrow Params</h4>
        <form className="escrowForm" onSubmit={handleSetEscrowAndConditions}>
          <div className="mb-3">
            <label htmlFor="agent">Escrow Agent</label>
            <input
              type="text"
              className="form-control"
              id="agent"
              placeholder="Escrow Agent"
              onChange={onEscrowParamChange}
              value={escrowParams.agent}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="conditions">Escrow Conditions</label>
            <input
              type="text"
              className="form-control"
              id="conditions"
              placeholder="Escrow Conditions"
              onChange={onEscrowParamChange}
              value={escrowParams.conditions}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Set Escrow Params
          </button>
        </form>
      </div>
      <div className="col">
        <h4>Step 2 - Transfer ETH</h4>
        <form className="escrowForm" onSubmit={handleMoneyTransfer}>
          <div className="mb-3">
            <label htmlFor="ethAmount">ETH Amount</label>
            <input
              type="text"
              className="form-control"
              id="ethAmount"
              placeholder="0.00000"
              onChange={onEthAmountChange}
              value={ethAmount}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Transfer ETH
          </button>
        </form>
      </div>
    </>
  );
}
