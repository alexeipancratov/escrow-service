# Escrow Service
This is a demo of a blockchain-based Escrow Service. The core logic is inside the EscrowService smart contract written in Solidity.
The web application provides a friendly UI to interact with the smart contract.

### Web UI

#### Buyer
Using the Buyer interface buyers can set an agent address, the escrow condition and transfer funds to the smart contract.
![buyer](https://user-images.githubusercontent.com/3188163/120942096-40d4a480-c72f-11eb-9422-ae63c410fda1.png)

#### Agent
Using the Agent interface elected agent can either release or revert funds (based on whether the previously set condition is met or not).
![agent](https://user-images.githubusercontent.com/3188163/120942102-4631ef00-c72f-11eb-859f-a67a84b8767b.png)
