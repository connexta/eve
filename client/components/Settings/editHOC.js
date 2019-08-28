import React from 'react';
import clsx from 'clsx';
import {connect} from 'react-redux';
import styled, {css} from "styled-components";
import { CX_DARK_BLUE, BATMAN_GRAY, BANNER_HEIGHT } from "../../utils/Constants";
import { BoxStyle, CARD_SIDE_MARGINS } from "../../styles/styles";
import { Dialog, DialogTitle,
    Table, TableBody, TableCell, TableHead, TableRow, TableFooter, TextField, DialogContent } from "@material-ui/core";
import SettingContainers from "./SettingContainers";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import { Save, Cancel } from "@material-ui/icons";

const editHOC = (WrappedComponent) => {
    const StyledWrapper = styled(BoxStyle)`
      /* width: calc(100% - ${CARD_SIDE_MARGINS}px); */
      width: ${props => props.width};
      height: ${props => props.height};
      transition: outline 0.6s linear;
      -webkit-transition: outline 0.6s linear;
      cursor: ${props => props.isedit && css`pointer`};
      outline: ${props => props.isedit ? css`10px solid ${CX_DARK_BLUE}` : css`0px solid`};
    `;

    const BannerWrapper = styled.div`
        /* background: ${CX_DARK_BLUE};
         */
        background: ${props => props.content};
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
    
    const useStyles = makeStyles(theme => ({
        button : {
            margin: theme.spacing(1)
        },
        leftIcon: {
            marginRight: theme.spacing(1),
        },
    }))

    const SaveFabWrapper = styled(Save)`
        margin-right: 8px;
    `;

    const CancelFabWrapper = styled(Cancel)`
        margin-right: 8px;
    `;


    class HOC extends React.Component {

        constructor(props){
            super(props);
            this.state = {
                open: false,
                resultsOpen: false,
                key: Date.now(),
                metSaveRequirement: false
            }
            this.handleMultipleSave = this.handleMultipleSave.bind(this);
            this.getMultipleCells = this.getMultipleCells.bind(this);

        }

        metRequirement(type, text){
            if (text === undefined) return false;
            switch (type) {
                case "CHANNEL":
                    return this.slackRequirement(text);
                case "REPOPATH":
                    return this.githubRequirement(text);
                case "COLOR":
                    return this.colorRequirement(text);
                // case "URL":
                //     return this.urlRequirement(text);
                default:
                    return true;
            }
        }

        //matches to slack channel
        //i.e. ABC123DEF
        slackRequirement(text){
            let regexp = /^[A-Z0-9]{9}$/;
            return regexp.test(text);
        }

        //matches to repo path
        //i.e. repo/path
        githubRequirement(text){
            let regexp = /^[\w-_\.]+\/[\w-_\.]+$/;
            return regexp.test(text);
        }
 
        //matches to color
        //i.e. #AAA123
        colorRequirement(text){
            let regexp = /^#\w{6}$/;
            return regexp.test(text);
        }

        displaySaveResults() {
            return this.state.metSaveRequirement ?
            (
                <Dialog
                    onClose={()=>{this.setState({resultsOpen: false})}}
                    aria-labelledby="saveResults"
                    open={this.state.resultsOpen}
                >
                    <DialogTitle>
                        Successfully updated the component
                    </DialogTitle>
                    <Button onClick={()=>{this.setState({resultsOpen: false})}}> {/* close the opened result popup */}
                        {/* <Cancel style={{marginRight: 8+'px'}}/> */}
                        <CancelFabWrapper/>
                        Cancel
                    </Button>
                </Dialog>
            ) : (
                <Dialog
                    onClose={()=>{this.setState({resultsOpen: false})}}
                    aria-labelledby="saveResults"
                    open={this.state.resultsOpen}
                >
                    <DialogTitle>
                        Failed: Please provide correct input.
                    </DialogTitle>
                    <Button onClick={()=>{this.setState({resultsOpen: false})}}> {/* close the opened result popup */}
                        {/* <Cancel style={{marginRight: 8+'px'}}/> */}
                        <CancelFabWrapper/>
                        Cancel
                    </Button>
                </Dialog>
            );
        }

        // <Dialog
        // onClose={this.handleClose.bind(this)}
        // aria-labelledby="edit"
        // open={this.state.open}
        // // ma


        handleClick(){
            console.log("Clickeddddddddddddd");
            this.setState({ open: true });
        }

        handleClose() {
            this.setState({ open: false });
            console.log("closed");
            // this.props.leaveEdit();
          }



        postData(isArray, data, index){
            let dataToUpdate;
            if (isArray){
                dataToUpdate = this.props.content.slice();
                dataToUpdate[index] = data;
            }
            else {
                dataToUpdate = data;
            }
            fetch("/theme?wallboard="+this.props.currentWallboard+"&component="+this.props.name, {
                method: "POST",
                headers: { "Content-Type": 'application/json' },
                body: JSON.stringify({"data":dataToUpdate})       
            })
        }
        
        // onChange={e => {this.setState({[e.target.name]: e.target.value})}}
/*

                                    name={typeArray[jndex]+numArray[index]}
                                    onChange={e => {this.setState({[e.target.name]: e.target.value})}}
        //                             */
        // async handleSave(e){
        //     let metSaveRequirement = this.metRequirement(this.props.type[0], this.state.text)
        //     if (metSaveRequirement){
        //         await this.props.updateContent(this.state.text);
        //         this.setState({key: Date.now()})
        //         fetch("/theme?wallboard="+this.props.currentWallboard+"&component="+this.props.name, {
        //             method: "POST",
        //             headers: { "Content-Type": 'application/json' },
        //             body: JSON.stringify({"data":this.state.text})       
        //         })
        //     }
        //     this.setState({
        //         resultsOpen: true,
        //         metSaveRequirement: metSaveRequirement
        //     })

        // }

        async handleMultipleSave(e, row, column) {
            let metSaveRequirement = true;
            let metOneRequirement = false;
            let isArray = !(row == 1 && column == 1); 
            for (let index = 0; index < row; index++){
                metSaveRequirement = true; 
                //check if valid response has been inputted
                for (let jndex = 0; jndex < column; jndex++){
                    let inputData = this.state[this.props.type[jndex]+index];
                    console.log("INPPUT");
                    console.log(inputData);
                    metSaveRequirement = metSaveRequirement && 
                        this.metRequirement(this.props.type[jndex], inputData);
                }
                if (metSaveRequirement){
                    let sendData;
                    for (let jndex = 0; jndex < column; jndex++){
                        // let inputName = [this.state]
                        let inputName = this.props.type[jndex];
                        let inputData = this.state[this.props.type[jndex]+index];
                        sendData = isArray ? 
                        {...sendData, ...{[inputName]:inputData}}
                        :
                        inputData
                        ;
                    }
                    await this.props.updateContent(sendData, index, this.props.name);
                    this.postData(isArray, sendData, index);
                    metOneRequirement = true;
                    this.setState({
                        key: Date.now()
                    })
                }
            }
            this.setState({         
                metSaveRequirement: metOneRequirement, //if at least one requirement has met.
                resultsOpen: true,
                
            })
        }

        displaySaveFab(row, column) {
            return (
                // <Button onClick={this.handleSave.bind(this)}>
                <Button onClick={e => 
                    // (row == 1 && column == 1) ?
                    // this.handleSave(e) :
                    this.handleMultipleSave(e, row, column)
                }>
                    <SaveFabWrapper/>
                    Save
                </Button>
            )
        }

        // displayMultipleSaveFab(row, column) {
        //     return (
        //         <Button onClick={e => this.handleMultipleSave(e, row, column)}>
        //             <SaveFabWrapper/>
        //             Save
        //         </Button>
        //     )
        // }

        displayCancelFab() {
            // const classes = useStyles();
            return (
                <Button onClick={this.handleClose.bind(this)}>
                    {/* <Cancel style={{marginRight: 8+'px'}}/> */}
                    <CancelFabWrapper/>
                    Cancel
                </Button>
            )
          }



        settingTable(){
            return (
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                {this.props.type}
                            </TableCell>
                            <TableCell>
                                <TextField
                                    onChange={e => this.setState({text: e.target.value})}
                                >
                                </TextField>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell>
                                {this.displaySaveFab()}
                                {/* <SaveFab /> */}
                            </TableCell>
                            <TableCell>
                                {/* <CancelFab /> */}
                                {this.displayCancelFab()}
                            </TableCell>
                            {/* <TableCell onClick={this.handleClose.bind(this)} style={{cursor:"pointer"}} >
                                Cancel
                            </TableCell> */}
                        </TableRow>
                    </TableFooter>
                </Table>
            )
        }

        
        getMultipleCells(row, column, typeArray){
            let tables = [];
            console.log("creating Multiple cells");
            for (let index = 0; index < row; index++) {
                let columnCells = [];
                for (let jndex = 0; jndex < column; jndex++){
                    columnCells.push(
                        <React.Fragment key={index.toString()+jndex.toString()}>
                            <TableCell>
                                {typeArray[jndex]+index}
                            </TableCell>
                            <TableCell>
                                <TextField
                                    name={typeArray[jndex]+index}
                                    onChange={e => {this.setState({[e.target.name]: e.target.value})}}
                                >
                                </TextField>
                            </TableCell>
                        </React.Fragment>
                    )
                }
                tables.push(
                    <TableRow key={index}>
                        {columnCells}
                    </TableRow>
                )
            }
            console.log(tables);
            return tables;
        }

        

        settingTableMultiple(row, column, typeArray) {
            return (
                <Table>
                    <TableBody>
                        {this.getMultipleCells(row, column, typeArray)}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell>
                                {this.displaySaveFab(row, column)}
                            </TableCell>
                            <TableCell>
                                {this.displayCancelFab()}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            )
        }

        displayDialog() {
            let row = this.props.dimension[0];
            let column = this.props.dimension[1];
            // let typeArray = [];
            // for (let i = 0; i < column; i++){
            //     typeArray.push(this.props.type[i]);
            // }
            
            return(
                <Dialog
                onClose={this.handleClose.bind(this)}
                aria-labelledby="edit"
                open={this.state.open}
                // maxWidth={false}
              >
                <DialogTitle>
                  Editing a Component
                </DialogTitle>
                {this.settingTableMultiple(row, column, this.props.type)}
                {/* {this.props.name === "BUILDSTATUS" ?
                 this.settingTableMultiple(row, column, typeArray)
                :
                this.settingTable()
                } */}
               
              </Dialog>
            )
          }


        displayBanner() {
            return (
                this.props.isEdit ?
                <BannerWrapper
                    isedit={this.props.isEdit ? "true" : undefined}
                    content={this.props.content}
                    onClick={this.handleClick.bind(this)}
                    key={this.state.key}
                >
                    <WrappedComponent {...this.props} />
                </BannerWrapper>
                :
                <BannerWrapper
                isedit={this.props.isEdit ? "true" : undefined}
                content={this.props.content}
                key={this.state.key}
                
            >
                <WrappedComponent {...this.props} />
            </BannerWrapper>
            )
        }

        render() {

            return (
                this.props.name === "BANNER" ?
                    <>
                    {this.displayBanner()}
                    {this.displayDialog()} 
                    {this.displaySaveResults()}
                    </>
                :
                this.props.isEdit ?
                <span>
                    <StyledWrapper 
                        width={this.props.width} 
                        height={this.props.height} 
                        isedit={this.props.isEdit ? "true" : undefined} 
                        onClick={this.handleClick.bind(this)}
                        key={this.state.key}
                        raised={true}
                        >
                        <WrappedComponent {...this.props} />
                    </StyledWrapper>
                    {this.displayDialog()} 
                    {this.displaySaveResults()}
                </span>
                :
                <span>
                    <StyledWrapper 
                        width={this.props.width} 
                        height={this.props.height} 
                        isedit={this.props.isEdit ? "true" : undefined}
                        key={this.state.key}
                        raised={true}
                        >
                        <WrappedComponent {...this.props} />
                    </StyledWrapper>
                    {this.displayDialog()} 
                    {this.displaySaveResults()}
                </span>
            )
        }
    }
    const mapStateToProps = state => ({
        // isEdit: state.editMode,
        currentWallboard: state.currentWallboard
      })

    return connect(mapStateToProps)(HOC);
}



export default editHOC;