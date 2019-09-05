//URL for the Alliance team main repo to keep track of
const AllianceURL =
  "http://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/Alliance/pipelines/master/";

//URL for the DDF team main repo to keep track of
const DDFURL =
  "http://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/DDF/pipelines/master/";

//URL for the DIB team main repo to keep track of
const DIBURL =
  "http://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/DIB/pipelines/master/";

//URL for the GSR team main repo to keep track of
const GSRURL =
  "http://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/GSR/pipelines/master/";

//URL for the SOA-ESB team main repo to keep track of
const SOAESBURL =
  "http://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/HAART-Jobs/pipelines/SOAESB_Nightly_Release_Builder/";

//URL for the REFLEX team main repo to keep track of
const REFLEXURL =
  "http://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/reflex-jobs/pipelines/Nightly/pipelines/reflex-nightly/";

//URL for the ION team main repo to keep track of
export const IONURL =
  "http://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/ION/";

<<<<<<< HEAD
export const GSRPIPELINEURL =
  "http://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/gsr/";

export const jenkinsURLList = [
  { NAME: "Alliance", URL: AllianceURL },
  { NAME: "DDF", URL: DDFURL },
  { NAME: "DIB", URL: DIBURL },
  { NAME: "GSR", URL: GSRURL },
  { NAME: "SOAESB", URL: SOAESBURL },
  { NAME: "REFLEX", URL: REFLEXURL }
];

export const GSRUrlList = [
  { NAME: "master", URL: GSRURL },
  {
    NAME: "11.x",
    URL:
      "http://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/GSR/pipelines/11.x/"
  },
  {
    NAME: "13.x",
    URL:
      "http://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/GSR/pipelines/13.x/"
  }
=======
export const jenkinsURLList = [
  { Alliance: AllianceURL },
  { DDF: DDFURL },
  { DIB: DIBURL },
  { GSR: GSRURL },
  { SOAESB: SOAESBURL },
  { REFLEX: REFLEXURL }
>>>>>>> 737ec059a306c8b7870a5c39b31c274745d27b9a
];

/*AF team*/

//Specific AF team Git build pipeline to keep track of
export const AFpipeline = "SOAESB_Nightly_Release_Builder";

//URL for the AF team main repo Jenkins
export const AFJenkinLink =
  "http://jenkins.phx.connexta.com/service/jenkins/job/HAART-Jobs/job/SOAESB_Nightly_Release_Builder/";

//URL for the AF team main repo to keep track of
export const AFURL =
  "http://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/HAART-Jobs/pipelines/SOAESB_Nightly_Release_Builder/";

/* Grafana */
export const SOAESB_GRAFANA_URL =
  "http://haart-kube.phx.connexta.com:3000/grafana/d/6hIxKFVZk/soa_dashboard?orgId=1";
