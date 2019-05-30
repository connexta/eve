import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import logo from '../testimg.png'

const LOGO_HEIGHT = "100px";

const Banner = styled.nav`
    background: #00aad3;
    padding: 3%;
    padding-left: 4%;
    font-size: 30px;
    border-bottom: solid black 3px;
    border-top: solid black 3px;

`

const StatelessFuncComponent = ({text}) => (
    <div>
        <p>-=- {text} -=-</p>
    </div>
)

const Logo = () => {
    return <img src={logo} alt="Logo" height={LOGO_HEIGHT}/>;
}

ReactDOM.render(
        <div>
            <Banner><Logo /></Banner>
            <StatelessFuncComponent text='Heyo'/>
        </div>

    , document.getElementById('iamroot'))