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

    // const CancelFab = () => {
    //     const classes = useStyles();
    //     return (
    //         <Button className={classes.button}>
    //             <Cancel className={classes.leftIcon} />
    //             Cancel
    //         </Button>
    //     )
    // }


    class HOC extends React.Component {

        constructor(props){
            super(props);
            this.state = {
                open: false,
                resultsOpen: false,
                key: Date.now(),
                metSaveRequirement: false,

            }
            this.handleMultipleSave = this.handleMultipleSave.bind(this);
            this.getMultipleCells = this.getMultipleCells.bind(this);
        }

        // componentDidUpdate(prevProps){
        //     if (this.props.content !== prevProps.content) {
        //         console.log("component did update");
        //         this.props.updateContent("CKJBH2KQV");
        //     }
        // }

        metRequirement(type, text){
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

        handleSave(){
            console.log("saved");
            let metSaveRequirement = this.metRequirement(this.props.type, this.state.text)
            if (metSaveRequirement){
                this.props.updateContent(this.state.text);
                // location.reload();
                this.setState({key: Date.now()})
                // this.handleClose();
                // console.log("CURRENT COMPONENT " + this.constructor.displayName);
                console.log("currentWallboard " + this.props.currentWallboard);
                console.log("name " + this.props.name);
                console.log("data: " + this.state.text);
                fetch("/theme?wallboard="+this.props.currentWallboard+"&component="+this.props.name, {
                    method: "POST",
                    headers: { "Content-Type": 'application/json' },
                    body: JSON.stringify({"data":this.state.text})
                    
                })


            }
            else {
                // alert("Invalid context to save");
                // this.setState({resultsOpen: true})
            }
            this.setState({
                resultsOpen: true,
                metSaveRequirement: metSaveRequirement
            })
            // this.props.updateContent("CKJBH2KQV");

        }

        displaySaveFab() {
            return (
                <Button onClick={this.handleSave.bind(this)}>
                    <SaveFabWrapper/>
                    Save
                </Button>
            )
        }

        displayMultipleSaveFab(numFields) {
            return (
                <Button onClick={e => this.handleMultipleSave(e, numFields)}>
                    <SaveFabWrapper/>
                    Save
                </Button>
            )
        }

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

        async handleMultipleSave(e, numFields) {
            console.log("TESTIGNA DFKAS DFASD FASDF");
            console.log(numFields);
            for (let index = 0; index < numFields; index++){
                console.log([this.props.type+index]);
                console.log(this.state["key"]);
                let inputURL = this.state[this.props.type+index];
                
                console.log(index + " " + inputURL);
                let sendData = {[this.state["NAME"+index]]:this.state[this.props.type+index]};
                console.log(sendData);
                if (inputURL !== undefined){
                    console.log("CALLING " + index);
                    await this.props.updateContent(sendData, index);
                    // console.log(inputURL);
                }
            }
            this.setState({key: Date.now()})
            // this.setState({ [e.target.name]: e.target.value})
            // console.log("handling multiple saves");
            // console.log(this.state[e.target.name]);
            // console.log(index);
            // this.props.updateContent(this.state[e.target.name]);
            // this.props.updateContent(this.state.text);
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

        getMultipleCells(numFields){
            let tables = [];
            console.log("creating Multiple cells");
            for (let index = 0; index < numFields; index++) {
                // let cellName = "url#"+(index+1);
                let urlName = this.props.type + index;
                let displayName = "NAME" + index;
                tables.push(
                    <TableRow key={index}>
                        <TableCell>
                            {displayName}
                        </TableCell>
                        <TableCell>
                            <TextField
                                name={displayName}
                                onChange={e => {this.setState({[e.target.name]: e.target.value})}}
                                // onChange={e => this.handleMultipleSave(e, numFields)}
                            >
                            </TextField>
                        </TableCell>
                        <TableCell>
                            {urlName}
                        </TableCell>
                        <TableCell>
                            <TextField
                                name={urlName}
                                onChange={e => {this.setState({[e.target.name]: e.target.value})}}
                                // onChange={e => this.handleMultipleSave(e, numFields)}
                            >
                            </TextField>
                        </TableCell>
                    </TableRow>

                )
            }
            console.log(tables);
            return tables;
        }

        

        settingTableMultiple(numFields) {
            console.log("MULTIPLE");
            return (
                <Table>
                    <TableBody>
                        {this.getMultipleCells(numFields)}
                        {/* <TableRow>
                            <TableCell>
                                {this.props.type}
                            </TableCell>
                            {this.getMultipleCells(numFields)}
                            {/* <TableCell>
                                <TextField
                                    onChange={e => this.setState({text: e.target.value})}
                                >
                                </TextField>
                            </TableCell> 
                        </TableRow> */}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell>
                                {this.displayMultipleSaveFab(numFields)}
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

        displayDialog() {
            console.log("WHATS YOU NAME")
            console.log(this.props.name);
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
                {this.props.name === "BUILDSTATUS" ?
                 this.settingTableMultiple(this.props.num)
                :
                this.settingTable()
                }
               
                {/* <SettingContainers onChange={()=>this.handleClose()} id="hahaha"/> */}
              </Dialog>
            )
          }

        //   test() {
        //     fetch("/theme?wallboard="+this.props.currentWallboard+"&component="+this.props.name, {
        //         method: "GET",
        //         headers: { "Content-Type": 'application/json' }
        //     })
        //     .then(response=>{
        //         console.log("RESPONSING response");
        //         console.log(response)
        //     })
        //     .then(data=>{
        //         console.log("RESPONSING data");
        //         console.log(data)
        //     })
        //     .catch(err=>{
        //         console.log(err);
        //     })
        //   }
        displayBanner() {
            console.log("display ");
            console.log(this.props.isEdit);
            console.log(this.props.name);

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
            // console.log("HOC" + this.props.isEdit);
            // console.log("test");
            // console.log(this.test());
            console.log("iyutsuide");
            console.log(this.props.isEdit);
            console.log(this.props.name);
            console.log(this.props.content);
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