import React, { Component } from 'react';
import './App.css';
import Main from './Main';
import Navbar from './Navbar';
import Web3 from 'web3';
import EthSwap from '../abis/EthSwap.json';
import Token from '../abis/Token.json';


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    // console.log(window.web3)
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ ethBalance });  // this.setState({ ethBalance: ethBalance });

    const networkId = await web3.eth.net.getId();

    const tokenData = Token.networks[networkId];

    // load Token contract
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address);
      this.setState({ token });

      let tokenBalance = await token.methods.balanceOf(this.state.account).call();

      this.setState({ tokenBalance: tokenBalance.toString() });

    } else {
      window.alert('Token contract not deployed to detected network!')
    }

    // load EthSwap contract
    const ethSwapData = EthSwap.networks[networkId];

    if (ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);
      this.setState({ ethSwap });

    } else {
      window.alert('Token contract not deployed to detected network!')
    }

    // console.log(this.state.account)
    // console.log(this.state.ethBalance)
    // console.log(this.state.token);
    // console.log(this.state.tokenBalance)
    // console.log(this.state.ethSwap)

    this.setState({ loading: false })
  }

  async loadWeb3() { // it looks for tow diffrent things

    if (window.ethereum) { // modern web3 browsers they will have this
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) { // legacy web browsers will have this
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum ...')
    }



  }

  buyTokens = (etherAmount) => {
    this.setState({ loading: true })
    this.state.ethSwap.methods.buyTokens()
      .send({ from: this.state.account, value: etherAmount })
      .on('transactionHash', (hash) => {this.setState({ loading: false })
    })
  }

  sellTokens = (tokenAmount) => {
    this.setState({ loading: true })
    this.state.token.methods.approve(this.state.ethSwap.address, tokenAmount).send({ from: this.state.account}).on('transactionHash', (hash) => {
      this.state.ethSwap.methods.sellTokens(tokenAmount).send({ from: this.state.account}).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      ethBalance: '0',
      token: {},
      ethSwap: {},
      tokenBalance: '0',
      loading: true,
    }
  }

  render() {

    let content;
    if (this.state.loading) {
      content = <p id='loader' className='text-center'>loading...</p>
    } else {
      content = <Main
        ethBalance={this.state.ethBalance}
        tokenBalance={this.state.tokenBalance}
        buyTokens={this.buyTokens}
        sellTokens={this.sellTokens}
      />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 mr-auto ml-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                {content}
              </div>
            </main>
          </div>
        </div>

      </div>
    );
  }
}

export default App;
