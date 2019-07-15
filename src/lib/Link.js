//URL for get data from overall repos
export const overviewURL =
  "http://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/";

//URL for the Alliance team main repo to keep track of
const AllianceURL =
  "https://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/Alliance/pipelines/master/";

//URL for the DDF team main repo to keep track of
const DDFURL =
  "https://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/DDF/pipelines/master/";

//URL for the DIB team main repo to keep track of
const DIBURL =
  "https://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/DIB/pipelines/master/";

//URL for the GSR team main repo to keep track of
const GSRURL =
  "https://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/GSR/pipelines/master/";

//URL for the AF team main repo to keep track of
const AFURL =
  "http://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/HAART-Jobs/pipelines/SOAESB_Nightly_Release_Builder/";

export const jenkinsURLList = {
  alliance: AllianceURL,
  ddf: DDFURL,
  dib: DIBURL,
  gsr: GSRURL,
  af: AFURL
};
