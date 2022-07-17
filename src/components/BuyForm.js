import React, { Component, PureComponent } from 'react';
import ethLogo from '../ethereum-eth-logo.png'
import MTNlogo from '../ethereum-eth-logo-animated.gif'

class BuyForm extends Component {



    constructor(props) {
        super(props);
        this.state = {
            output: '0',
        }
    }

    render() {
        return (

            <form className='mb-3' onSubmit={(event) => {
                event.preventDefault()
                let etherAmount;
                etherAmount = this.input.value.toString();
                etherAmount = window.web3.utils.toWei(etherAmount, 'ether');
                this.props.buyTokens(etherAmount)
            }}>

                <div>
                    <lable className='float-left'><b>Input</b></lable>
                    <span className='float-right text-muted'>Balance: {window.web3.utils.fromWei(this.props.ethBalance, 'ether')}</span>
                </div>

                <div className='input-group mb-4'>
                    <input
                        type='text'
                        onChange={(event) => {
                            const etherAmount = this.input.value.toString();
                            this.setState({ output: etherAmount * 100 })
                        }
                        }
                        ref={(input) => { this.input = input }}
                        className='form-control form-control-lg '
                        placeholder='0'
                        required
                    />
                    <div className='input-group-append'>
                        <div className='input-group-text'>
                            <img src={ethLogo} height='32' alt='' />
                            &nbsp;&nbsp;&nbsp; ETH
                        </div>
                    </div>
                </div>


                <div>
                    <lable className='float-left'><b>Output</b></lable>
                    <span className='float-right text-muted'>Balance: {window.web3.utils.fromWei(this.props.tokenBalance, 'ether')}</span>
                </div>

                <div className='input-group mb-2'>
                    <input
                        type='text'
                        className='form-control form-control-lg '
                        placeholder='0'
                        value={this.state.output}
                        disabled
                    />

                    <div className='input-group-append'>
                        <div className='input-group-text'>
                            <img src={MTNlogo} height='32' alt='' />
                            &nbsp; MTN
                        </div>
                    </div>
                </div>


                <div className='mb-5'>
                    <span className='float-left text-muted'>Exchange Rate</span>
                    <span className='float-right text-muted'>1 ETH = 100 MTN</span>
                </div>

                <button type='submit' className='btn btn-primary btn-block btn-lg'>Swap!</button>
            </form>
        );
    }
}

export default BuyForm;