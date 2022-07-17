const { assert } = require('chai');
const { default: Web3 } = require('web3');

const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

require('chai')
    .use(require('chai-as-promised'))
    .should();

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('ethSwap', (accounts) => {
    let token, ethSwap

    before(async () => {
        token = await Token.new();
        ethSwap = await EthSwap.new(token.address);
        // transfer 1 million tokens 
        await token.transfer(ethSwap.address, tokens('100000'));
        await token.transfer(accounts[1], tokens('100'));
    })

    describe('Token deployment', async () => {

        it('contract has a name', async () => {
            const name = await token.name();
            assert.equal(name, "MATIN Token");
        })

    })


    describe('EthSwap deployment', async () => {

        it('contract has a name', async () => {
            const name = await ethSwap.name();
            assert.equal(name, "EthSwap Instant Exchange");
        })

        it('contrct has tokens', async () => {
            const balance = await token.balanceOf(ethSwap.address);
            assert.equal(balance.toString(), tokens('100000'));
        })

    })


    describe('buy tokens', async () => {
        let result

        before(async () => {
            result = await ethSwap.buyTokens({ from: accounts[1], value: web3.utils.toWei('1', 'ether') });
        })

        it('allows user to instantly purchase tokens from ethSwap for a fixed price', async () => {
            let balanceOfUser = await token.balanceOf(accounts[1]);
            let balanceOfEthSwap = await token.balanceOf(ethSwap.address);

            let ethBalanceOfEthSwap = await web3.eth.getBalance(ethSwap.address);

            // console.log(result.logs[0].args)

            const event = result.logs[0].args;

            assert.equal(balanceOfUser.toString(), tokens('200'));
            assert.equal(balanceOfEthSwap.toString(), tokens('99900'));

            assert.equal(ethBalanceOfEthSwap.toString(), tokens('1'));

            assert.equal(event.account, accounts[1]);
            assert.equal(event.token, token.address);
            assert.equal(event.amount.toString(), tokens('100'));
            assert.equal(event.rate.toString(), '100');
        })
    })


    describe('sell tokens', async () => {
        let result

        before(async () => {
            await ethSwap.buyTokens({ from: accounts[1], value: web3.utils.toWei('1', 'ether') });

            await token.approve(ethSwap.address, (tokens('100'), { from: accounts[1] }));
            await ethSwap.sellTokens(tokens('100'), { from: accounts[1] })
        })

        it('allows user to instantly sell tokens to ethSwap for a fixed price', async () => {
            let balanceOfUser = await token.balanceOf(accounts[1]);
            let balanceOfEthSwap = await token.balanceOf(ethSwap.address);

            let ethBalanceOfEthSwap = await web3.eth.getBalance(ethSwap.address);

            const event = result.logs[0].args;

            assert.equal(balanceOfUser.toString(), tokens('100'));
            assert.equal(balanceOfEthSwap.toString(), tokens('100000'));

            assert.equal(ethBalanceOfEthSwap.toString(), tokens('0'));

            assert.equal(event.account, accounts[1]);
            assert.equal(event.token, token.address);
            assert.equal(event.amount.toString(), tokens('100'));
            assert.equal(event.rate.toString(), '100');
        })
    })

    
})
