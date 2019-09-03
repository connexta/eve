import { CX_DARK_BLUE } from "./Constants";
import { jenkinsURLList, AFJenkinLink, AFURL, AFpipeline } from "./Link";

const buildAFList = [
  {
    LINK: AFJenkinLink,
    URL: AFURL,
    NAME: AFpipeline
  }
];

export const DefaultData = {
  Banner: CX_DARK_BLUE,
  SlackComponent: process.env.SLACK_CHANNEL,
  BuildStatus: jenkinsURLList,
  Github: "codice/ddf",
  BuildAF: buildAFList
};
