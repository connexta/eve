import React from 'react'
import { connect } from 'react-redux'
import { Dialog, DialogTitle, List, ListItem, ListItemText, 
    Table, TableBody, TableCell, TableHead, TableRow, TableFooter, TextField } from "@material-ui/core";
// import { toggleEdit } from "../../actions";


//Display all the components in the current screen


//export default class Github extends React.Component {
// const CurrentContainers = () => {
// class CurrentContainers extends React.Component {
//     render(){
//         return (
//             <div>
//                 {this.props.components}
//             </div>   
//         );
//     }
// }


// const SettingContainers = (props) => {
class SettingContainers extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            open: this.props.open
        }
    }

    handleClose(){
        console.log("CLCLCLCL");
        
    };

    componentDidUpdate(prevProps) {
        // if (this.state.open !== prevProps.open) {
        //     this.props.
        // }
    }

     settingTable(){
        return (
            <Table>
            <TableBody>
                <TableRow>
                    <TableCell>
                        Cancel
                    </TableCell>
                </TableRow>
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell onClick={() => this.props.onChange()}>
                        Cancel
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
        )
    }



    
    render() {
        console.log(this.props.components);
    // console.log(props.editMode);
    console.log("EDIDIDIDIT", this.props.isEdit);
        return (
            this.settingTable()
        //     <Dialog
        //     onClose={this.handleClose()}
        //     aria-labelledby="edit"
        //     open={this.state.open}
        //     maxWidth={false}
        // >
        //     <DialogTitle>
        //     Editing a Component
        //     </DialogTitle>
        //     {this.settingTable()}
        // </Dialog>
        // <List>
        //     {props.components.map((element, index) => (
        //         <ListItem button onClick={() => this.handleClose()} key={index}>
        //             <ListItemText primary={element} />
        //         </ListItem>
        //     ))}
        // </List>
        )
    }
    
}

const mapStateToProps = (state) => ({
    components: state.currentComponents,
    isEdit: state.editMode
})

const mapDispatchToProps = dispatch => ({
    // toggleEdit: dispatch(toggleEdit)
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingContainers)