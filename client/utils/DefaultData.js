import { O_GUNMETAL } from "./Constants";
import { jenkinsURLList, AFJenkinLink, AFURL, AFpipeline } from "./Link";

const buildAFList = [
  {
    LINK: AFJenkinLink,
    URL: AFURL,
    NAME: AFpipeline
  }
];

export const DefaultData = {
  Banner: O_GUNMETAL,
  SlackComponent: process.env.SLACK_CHANNEL,
  BuildStatus: jenkinsURLList,
  Github: "codice/ddf",
  BuildAF: buildAFList
};
