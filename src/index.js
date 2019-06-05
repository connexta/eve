import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import logo from '../resources/logo-white.png'
import Clock from 'react-live-clock';

const Banner = styled.nav`
    background: #00add2;
    padding-left: 40px;
    padding-right: 40px;
    margin: 0%;
    font-size: 2em;
    border-bottom: solid black 3px;
    border-top: solid black 3px;
    max-height: 125px;
`

const RightBox = styled.nav`
  background: #f2f2f2;
  padding: 3%;
  padding-left: 4%;
  font-size: 30px;
  border-left: solid black 3px;
  width: 33vw;
`

const LeftBox = styled.nav`
  background: #658398;
  padding: 3%;
  padding-left: 4%;
  font-size: 30px;
  border-right: solid black 3px;
  width: 66vw;
`

const ContentHorz = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 90vh;
`

const MainGridVert = styled.div`
  display: flex;
  flex-direction: column;
`

const ClockGridVert = styled.div`
  font-size: 1.3em;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 10px;
`

const ClockGridHorz = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`

const BannerGrid = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px
`

const StatelessFuncComponent = ({text}) => (
  <div>
    <p>-=- {text} -=-</p>
  </div>
)

const Logo = () => {
  return <img src={logo} alt="Logo" height="100vh" />;
}

class ClockComponent extends React.Component {
  render() {
    return (
      <div>
        <ClockGridHorz>
          <ClockGridVert>
            <div>PST: <Clock format={'HH:mm'} ticking={true} timezone={'US/Pacific'} /></div>
            <div>EST: <Clock format={'HH:mm'} ticking={true} timezone={'US/Eastern'} /></div>
          </ClockGridVert>
          <ClockGridVert>
            <div>CST: <Clock format={'HH:mm'} ticking={true} timezone={'US/Central'} /></div>
            <div>ACT: <Clock format={'HH:mm'} ticking={true} timezone={'Australia/Sydney'} /></div>
          </ClockGridVert>
        </ClockGridHorz>
      </div>
    );
  }
}

ReactDOM.render(
  <div>
    <MainGridVert>
      <Banner>
        <BannerGrid>
          <Logo />
          <ClockComponent />
        </BannerGrid>
      </Banner>
      <ContentHorz>
        <LeftBox>
          Left Box
        </LeftBox>
        <RightBox>
          Right Box
        </RightBox>
      </ContentHorz>
    </MainGridVert>
  </div>

, document.getElementById('iamroot'))