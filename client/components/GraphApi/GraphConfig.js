import { UserAgentApplication } from "msal";

export const config = {
  appId: "63595ad7-d372-4227-9ede-590410f05977",
  authority: "https://login.microsoftonline.com/organizations/",
  scopes: ["user.read", "calendars.readwrite", "sites.read.all"]
};

export const userAgentApplication = new UserAgentApplication({
  auth: {
    clientId: config.appId,
    authority: config.authority
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true
  }
});

export const user = userAgentApplication.getAccount();
export const userID = user ? user.accountIdentifier : "Guest";
export const userName = user ? user.name : "Guest";
