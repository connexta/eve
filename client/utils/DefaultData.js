import { CX_DARK_BLUE } from "./Constants";
import { jenkinsURLList, AFJenkinLink, AFURL, AFpipeline } from "./Link";
const CHANNEL = process.env.SLACK_CHANNEL;
const REPOPATH = "codice/ddf";

const buildAFList = [
  {
    LINK: AFJenkinLink,
    URL: AFURL,
    NAME: AFpipeline
  }
];

export const DefaultData = {
  Banner: CX_DARK_BLUE,
  SlackComponent: CHANNEL,
  BuildStatus: jenkinsURLList,
  Github: REPOPATH,
  BuildAF: buildAFList
};
