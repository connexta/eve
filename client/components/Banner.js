import React from "react";
import styled, {css} from "styled-components";
import { CX_DARK_BLUE, BATMAN_GRAY, BANNER_HEIGHT } from "../utils/Constants";
import logo from "../../resources/logo-offwhite.png";
import Clock from "../components/Clock";
import {connect} from 'react-redux';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Dialog, DialogTitle,
    Table, TableBody, TableCell, TableHead, TableRow, TableFooter, TextField, DialogContent } from "@material-ui/core";
import { Save, Cancel } from "@material-ui/icons";
import Button from '@material-ui/core/Button';
import editHOC from "./Settings/editHOC";

const BannerGrid = styled.div`
  background: ${CX_DARK_BLUE};
  height: ${BANNER_HEIGHT}px;
  width: 100%;
  margin: 0px;
  padding: 4px 40px 0 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  transition: box-shadow 0.6s linear;
  -webkit-transition: box-shadow 0.6s linear;
  cursor: ${props => props.isedit && css`pointer`};
  box-shadow: ${props => props.isedit ? css`0px 10px 10px ${BATMAN_GRAY}` : css`0px 0px 0px`};
  z-index: 1;
  position: relative;
`;

const StyledLogo = styled.img`
  margin: 0 0 12px 0;
`;

const CancelFabWrapper = styled(Cancel)`
margin-right: 8px;
`;

const Logo = () => {
    return <StyledLogo src={logo} alt="Logo" height="104px" />;
  };

class Banner extends React.Component {
    
    constructor(props){
        super(props);

    }

    render() {
        return (
            // this.props.isEdit ?
            // <div>
                // {/* <BannerGrid 
                //     container 
                //     onClick={this.handleClick.bind(this)}
                //     isedit={this.props.isEdit ? "true" : undefined}
                //     > */}
                    <>
                    <Link to="/">
                    <Logo />
                    </Link>
                    <Clock timezone="US/Arizona" place="PHX" />
                    <Clock timezone="US/Mountain" place="DEN" />
                    <Clock timezone="US/Eastern" place="BOS" />
                    <Clock timezone="Europe/London" place="LON" />
                    <Clock timezone="Australia/Melbourne" place="MEL" />
                    </>
                // {/* </BannerGrid> */}
                // {/* {this.displayDialog()}  */}
            // </div>
          
        //   :
        //   <div>
        //     <BannerGrid 
        //         container
        //         isedit={this.props.isEdit ? "true" : undefined}
        //         >
        //         <Link to="/">
        //         <Logo />
        //         </Link>
        //         <Clock timezone="US/Arizona" place="PHX" />
        //         <Clock timezone="US/Mountain" place="DEN" />
        //         <Clock timezone="US/Eastern" place="BOS" />
        //         <Clock timezone="Europe/London" place="LON" />
        //         <Clock timezone="Australia/Melbourne" place="MEL" />
        //         </BannerGrid>
        //         {/* {this.displayDialog()}  */}
        //   </div>

        )
    }
}

// const mapStateToProps = state => ({
//     components: state.currentComponents,
//     isEdit: state.editMode
//   })


const WrappedComponent = editHOC(Banner);
export default WrappedComponent;
  