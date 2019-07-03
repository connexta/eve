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

export async function getUserDetails(accessToken) {
  const client = getAuthenticatedClient(accessToken);

  const user = await client.api("/me").get();
  return user;
}

export async function getCalendarEvents(accessToken) {
  const client = getAuthenticatedClient(accessToken);
  const events = await client
    .api(
      "/me/calendar/calendarView?startDateTime=2019-07-01T00:00:00.0000000&endDateTime=2019-07-31T23:59:59.0000000&$top=100&$select=subject,start,end"
    )
    .get();
  return events;
}
