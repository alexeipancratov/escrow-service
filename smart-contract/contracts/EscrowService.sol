// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./AccessControl.sol";

contract EscrowService is AccessControl {
	enum EscrowState {Init, AgentAndConditionAreSet, TransferOccurred}
	EscrowState public escrowState = EscrowState.Init;

	bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");
	bytes32 public constant SELLER_ROLE = keccak256("SELLER_ROLE");
	bytes32 public constant BUYER_ROLE = keccak256("BUYER_ROLE");
	uint256 public constant AGENT_FEE = 10000000;

	address public agent;
	address public seller;
	address public buyer;
	string public conditionToMeet;

	modifier isActiveState(EscrowState stateToCheck) {
		require(escrowState == stateToCheck);
		_;
	}

	constructor(address sellerAddress, address buyerAddress) {
		seller = sellerAddress;
		buyer = buyerAddress;

		_setupRole(SELLER_ROLE, seller);
		_setupRole(BUYER_ROLE, buyer);
	}

	function _setEscrowState(EscrowState state) private {
		escrowState = state;
	}

	function chooseEscrowAgentAndCondition(address escrowAgent, string memory escrowCondition) external
	    onlyRole(BUYER_ROLE) isActiveState(EscrowState.Init) {
		
		agent = escrowAgent;
		_setupRole(AGENT_ROLE, agent);

		conditionToMeet = escrowCondition;

		_setEscrowState(EscrowState.AgentAndConditionAreSet);
	}

	receive() external payable onlyRole(BUYER_ROLE) isActiveState(EscrowState.AgentAndConditionAreSet) {
		require(msg.value > AGENT_FEE, "Escrow amount must be greater than Agent Fee");
		_setEscrowState(EscrowState.TransferOccurred);
	}

	function releaseFunds() external onlyRole(AGENT_ROLE) isActiveState(EscrowState.TransferOccurred) {
		uint256 releaseAmount = address(this).balance - AGENT_FEE;

		(bool success, ) = payable(seller).call{value: releaseAmount}("");
		require(success, "Transfer to seller has failed");
		
		(success, ) = payable(agent).call{value: AGENT_FEE}("");
		require(success, "Transfer of Agent Fee has failed");

		_resetState();
	}

	function revertFunds() external onlyRole(AGENT_ROLE) isActiveState(EscrowState.TransferOccurred) {
		uint256 releaseAmount = address(this).balance - AGENT_FEE;

		(bool success, ) = payable(buyer).call{value: releaseAmount}("");
		require(success, "Transfer to buyer has failed");
		
		(success, ) = payable(agent).call{value: AGENT_FEE}("");
		require(success, "Transfer of Agent Fee has failed");

		_resetState();
	}

	function _resetState() private onlyRole(AGENT_ROLE) isActiveState(EscrowState.TransferOccurred) {
		_setEscrowState(EscrowState.Init);
		renounceRole(AGENT_ROLE, agent);
	}
}
