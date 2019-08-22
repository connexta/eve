import React from 'react';
import {connect} from 'react-redux';
import styled, {css} from "styled-components";
import { CX_DARK_BLUE } from "../../utils/Constants";
import { BoxStyle, CARD_SIDE_MARGINS } from "../../styles/styles";
import { Dialog, DialogTitle } from "@material-ui/core";
import SettingContainers from "./SettingContainers";

const editHOC = (WrappedComponent) => {
    const StyledWrapper = styled(BoxStyle)`
      /* width: calc(100% - ${CARD_SIDE_MARGINS}px); */
      width: ${props => props.width};
      height: ${props => props.height};
      transition: outline 0.6s linear;
      -webkit-transition: outline 0.6s linear;
      cursor: ${props => props.isedit === "true" && css`pointer`};
      outline: ${props => props.isedit === "true" ? css`10px solid ${CX_DARK_BLUE}` : css`0px solid`};
      
    `;

    class HOC extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                open: false
            }
        }
        handleClick(){
            console.log("Clickeddddddddddddd");
            this.setState({ open: true });
        }

        handleClose() {
            this.setState({ open: false });
            console.log("closed");
            // this.props.leaveEdit();
          }

        displayDialog() {
            return(
                <Dialog
                onClose={this.handleClose.bind(this)}
                aria-labelledby="edit"
                open={this.state.open}
                maxWidth={false}
              >
                <DialogTitle>
                  Editing a Component
                </DialogTitle>
                <SettingContainers/>
              </Dialog>
            )
          }

        render() {
            console.log("HOC" + this.props.isEdit);
            return (
                this.props.isEdit ?
                <StyledWrapper width={this.props.width} height={this.props.height} isedit={this.props.isEdit.toString()} onClick={this.handleClick.bind(this)}>
                    <WrappedComponent {...this.props} />
                    {this.displayDialog()} 
                </StyledWrapper>
                :
                <StyledWrapper width={this.props.width} height={this.props.height} isedit={this.props.isEdit.toString()}>
                    <WrappedComponent {...this.props} />
                    {this.displayDialog()} 
                </StyledWrapper>
            )
        }
    }
    const mapStateToProps = state => ({
        isEdit: state.editMode
      })

    return connect(mapStateToProps)(HOC);
}



export default editHOC;