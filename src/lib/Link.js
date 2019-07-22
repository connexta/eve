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

//URL for the SOA-ESB team main repo to keep track of
const SOAESBURL =
  "http://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/HAART-Jobs/pipelines/SOAESB_Nightly_Release_Builder/";

//URL for the REFLEX team main repo to keep track of
const REFLEXURL = 
  "http://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/reflex-jobs/pipelines/Nightly/pipelines/reflex-nightly/";

export const jenkinsURLList = {
  Alliance: AllianceURL,
  DDF: DDFURL,
  DIB: DIBURL,
  GSR: GSRURL,
  SOAESB: SOAESBURL,
  REFLEX: REFLEXURL
};
