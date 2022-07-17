// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Token.sol";

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token; // It creates a variable that represents the Token smart contract
    uint256 public rate = 100;

    constructor(Token _token) public {
        token = _token;
    }

    event TokensPurchased(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    event TokensSold(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );



    function buyTokens() public payable {
        uint256 tokenAmount = msg.value * rate;
        
        require(token.balanceOf(address(this)) >= tokenAmount, 'Eth_Swap: Insufiction balnace MATIN token in Eth_Swap!');

        token.transfer(msg.sender, tokenAmount);
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _amount) public {
        require(token.balanceOf(msg.sender) >= _amount, "Eth_Swap: Insufiction balance!");
        
        uint etherAmount = _amount / rate;
        
        require(address(this).balance >= etherAmount, "Eth_Swap: Eth_Swap ethereum balance is not enough!");

        token.transferFrom(msg.sender, address(this), _amount);
        (msg.sender).transfer(etherAmount);
        emit TokensSold(msg.sender, address(token), _amount, rate);
    }
}
