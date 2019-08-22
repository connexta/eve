import React from "react";
import styled from "styled-components";
import BuildStatus from "../components/BuildStatus";
import SlackComponent from "../components/SlackComponent";
import Github from "../components/Github";
import Calendar from "../components/Calendar/Calendar";
import { LeftBox, RightBox } from "../styles/WallboardStyles";
import Grid from "@material-ui/core/Grid";
import { jenkinsURLList } from "../utils/Link";
import MediaComponent from "../components/MediaComponent";
import EventComponent from "../components/EventComponent";
import {connect} from 'react-redux';
import { addComponents, deleteComponents } from "../actions";
import {bindActionCreators} from 'redux';
import { CARD_SIDE_MARGINS } from "../styles/styles";
import { GITHUB_HEIGHT } from "../components/Github";

const CHANNEL = process.env.SLACK_CHANNEL;

/*
You can change the size of any component through the use of styled components.

< Example >
To change height of BuildStatus...

const StyledBuildStatus = styled(BuildStatus)`
  height: 100px;
`

*/
// const hoc = (WrappedComponent) => (props) => {
//   return (
//     <span>
//       {this.props.isEdit ? (
//         <WrappedComponent {...props} onClick={this.handleClick}>
//           {this.props.isEdit}
//         </WrappedComponent>
//       ) : (
//         <WrappedComponent {...props}>
//         {this.props.isEdit}
//       </WrappedComponent>
//       )}
//     </span>
//   )
// }
// const BuildStatusHOC = editHOC(BuildStatus);
const buildStatusWidth = `calc(100% - ${CARD_SIDE_MARGINS}px)`;
const SlackHeight = `calc(100% - ${GITHUB_HEIGHT}px - 72px - 32px)`;

class TVWallboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      localComponents: ["BuildStatus", "Media", "Event", "Slack", "Github"],
      //BuildStatus: urlList
      //SlackComponent: channel
      //Github: repoPath. //show examples as well.
      //pass down hidden/show mode.
    }
  }

  componentDidMount(){
    console.log("attempting to add components");
    console.log(this.props.components);
    this.props.addComponents(this.state.localComponents);
  }

  componentWillUnmount() {
    this.props.deleteComponents(this.state.localComponents);
  }

  handleClick(){
    console.log("clickeD!");
  }

  ClickedComponent(Component){
    // return <Component onClick={this.handleClick}/>
    return <Component/>
  }




  render() {
    console.log("EDDDDDDDDD" + this.props.isEdit);
    return (
      <Grid container style={{ height: "100%" }} spacing={0}>
        <LeftBox item>
          {/* {this.ClickedComponent( */}
            <BuildStatus 
              width={buildStatusWidth} 
              isEdit={this.props.isEdit} 
              urlList={jenkinsURLList}
              name="BuildStatus"
              type="URL"
              />
            {/* <BuildStatus width="100%" isEdit={this.props.isEdit} urlList={jenkinsURLList}/> */}
          {/* <BuildStatus isEdit={this.props.isEdit} urlList={jenkinsURLList} onClick={this.handleClick}/> */}
          <Grid
            container
            direction="row"
            style={{ height: "calc(100% - 260px)" }}
          >
            <MediaComponent />
            <EventComponent />
          </Grid>
        </LeftBox>
        <RightBox item>
          <SlackComponent 
            height={SlackHeight} 
            isEdit={this.props.isEdit}
            CHANNEL={CHANNEL}
            type="CHANNEL"
            />
          <Github repoPath={"codice/ddf"} />
        </RightBox>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  components: state.currentComponents,
  isEdit: state.editMode
})

const mapDispatchToProps = dispatch => ({
    addComponents: component => dispatch(addComponents(component)),
    deleteComponents: component => dispatch(deleteComponents(component)),
    // toggleEdit: dispatch(toggleEdit)
})
// function mapDispatchToProps(dispatch) {
//   // return {AddComponents: function() {
//   //   dispatch(AddComponents(ownProps.components))
//   // }
//   return {
//     actions: bindActionCreators(addComponents, dispatch)
//   }
//   // return {
//   //   addComponents
//   // }
// }

export default connect(mapStateToProps, mapDispatchToProps)(TVWallboard);
// export default connect(mapStateToProps)(TVWallboard);
// export default connect()(TVWallboard);
//addComponents