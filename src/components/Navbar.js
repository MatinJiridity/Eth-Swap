import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Navbar extends Component {


    render() {

        return (
            <div>
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a
                        className="navbar-brand col-sm-3 col-md-2 mr-0"
                        href="https://github.com/MatinJiridity"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Matin Jiri
                    </a>

                    <ul className='navbar-nav px-3'>
                        <li className='nav-item text-nowrap d-none d-sm-none d-sm-block'>
                            <small className='text-secondary'>
                                <small id='account' style={{color:'white'}}>{this.props.account}</small>
                            </small>
                            {   this.props.account
                                ? <img
                                    className='ml-2'
                                    src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                                    alt=''
                                    width='30'
                                    height='30'
                                                                
                                />
                                : <span></span>
                            }

                        </li>
                    </ul>

                </nav>

            </div>
        );
    }
}

export default Navbar;


// props is short for properties
// in App.js you have got property ( account={this.state.account} ) to Navbar