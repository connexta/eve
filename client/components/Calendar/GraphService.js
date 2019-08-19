var graph = require("@microsoft/microsoft-graph-client");

function getAuthenticatedClient(accessToken) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: done => {
      done(null, accessToken.accessToken);
    }
  });

  return client;
}

// Makes a given call to the Microsoft Graph API
export async function callApi(accessToken, call) {
  const client = getAuthenticatedClient(accessToken);
  return await client.api(call).get();
}
