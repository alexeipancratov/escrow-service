import React from "react";

export default function Agent(props) {
  const handleReleaseFundsClick = (e) => {
    e.preventDefault();

    const func = async () => {
      const accounts = await props.web3.eth.getAccounts();

      props.escrowContract.methods
        .releaseFunds()
        .send({ from: accounts[0] })
        .on("error", (error) => console.log(error))
        .on("receipt", (receipt) => {
          console.log("=== Receipt ===");
          console.log(receipt);
          alert(
            `Transaction hash ${receipt.transactionHash}\nGas used: ${receipt.gasUsed}`
          );
        });
    };
    func();
  };

  const handleRevertFundsClick = (e) => {
    e.preventDefault();

    const func = async () => {
      const accounts = await props.web3.eth.getAccounts();

      props.escrowContract.methods
        .revertFunds()
        .send({ from: accounts[0] })
        .on("error", (error) => console.log(error))
        .on("receipt", (receipt) => {
          console.log("=== Receipt ===");
          console.log(receipt);
          alert(
            `Transaction hash ${receipt.transactionHash}\nGas used: ${receipt.gasUsed}`
          );
        });
    };
    func();
  };

  return (
    <>
      <h1>Agent</h1>
      <em>Warning</em>
      <p>
        Make sure the condition is fullfilled.
      </p>
      <div className="col">
        <button type="submit" className="btn btn-primary ms-1" onClick={handleReleaseFundsClick}>
          Release funds
        </button>
        <button type="submit" className="btn btn-primary ms-1" onClick={handleRevertFundsClick}>
          Revert funds
        </button>
      </div>
    </>
  );
}
