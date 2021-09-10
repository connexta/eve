import { O_ROYAL_BLUE } from "./Constants";
import { jenkinsURLList, AFJenkinLink, AFURL, AFpipeline } from "./Link";

const buildAFList = [
  {
    LINK: AFJenkinLink,
    URL: AFURL,
    NAME: AFpipeline
  }
];

export const DefaultData = {
  Banner: O_ROYAL_BLUE,
  SlackComponent: process.env.SLACK_CHANNEL,
  BuildStatus: jenkinsURLList,
  Github: "codice/ddf",
  BuildAF: buildAFList
};
