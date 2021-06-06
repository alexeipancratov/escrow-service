// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./AccessControl.sol";

contract EscrowService is AccessControl {
	enum EscrowState {Init, TransferOccurred}
	EscrowState public escrowState = EscrowState.Init;

	bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");
	bytes32 public constant SELLER_ROLE = keccak256("SELLER_ROLE");
	bytes32 public constant BUYER_ROLE = keccak256("BUYER_ROLE");
	uint256 public constant AGENT_FEE = 1000;

	address public agent;
	address public seller;
	address public buyer;
	string private conditionToMeet;

	modifier isActiveState(EscrowState stateToCheck) {
		require(escrowState == stateToCheck);
		_;
	}

	constructor(address agentAddress, address sellerAddress, address buyerAddress, string memory escrowCondition) {
		agent = agentAddress;
		seller = sellerAddress;
		buyer = buyerAddress;
		conditionToMeet = escrowCondition;

		_setupRole(AGENT_ROLE, agent);
		_setupRole(SELLER_ROLE, seller);
		_setupRole(BUYER_ROLE, buyer);
	}

	function _setEscrowState(EscrowState state) private {
		escrowState = state;
	}

	receive() external payable onlyRole(BUYER_ROLE) isActiveState(EscrowState.Init) {
		require(msg.value > AGENT_FEE, "Escrow amount must be greater than Agent Fee");
		_setEscrowState(EscrowState.TransferOccurred);
	}

	function finishEscrow(string memory conditionToCheck) external onlyRole(AGENT_ROLE) isActiveState(EscrowState.TransferOccurred) {
		bool escrowConditionIsMet = keccak256(abi.encodePacked((conditionToMeet))) == keccak256(abi.encodePacked((conditionToCheck)));
		uint256 releaseAmount = address(this).balance - AGENT_FEE;

        bool success;
		if (escrowConditionIsMet) {
			(success, ) = payable(seller).call{value: releaseAmount}("");
			require(success, "Transfer to seller has failed");
		} else {
			(success, ) = payable(buyer).call{value: releaseAmount}("");
			require(success, "Transfer to buyer has failed");
		}
		
		(success, ) = payable(agent).call{value: AGENT_FEE}("");
		require(success, "Transfer of Agent Fee has failed");

		_setEscrowState(EscrowState.Init);
	}
}
