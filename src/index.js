import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

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

ReactDOM.render(
        <div>
            <Banner>Connexta</Banner>
            <StatelessFuncComponent text='Heyo'/>
        </div>

    , document.getElementById('iamroot'))