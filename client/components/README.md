# Components

## Banner

Displays banner in the top screen. It contains Logo and Clocks. With the react-color library UI, the color of the baner is edditable in edit mode. Details can be found in Settings/componentHOC.js and Settings/ColorPicker.js

## BuildStatus

Displays the health of builds as reported by Jenkins and toggles between the health of the most recent build and the health of the 5 most recent builds. With the dropdown UI, the build status is editable in edit mode.

#### Packages:
- **Material UI**: Uses Card, CardContent, and Button from Material UI
- **Trashable**: uses makeTrashable from Trashable.

#### Props:
- **content**: array of key/value pairs with the keys being the names of the builds and the values being links to the Jenkins build status
- **listvert**: Boolean value which will list the build statuses vertically when true, rather than the default horizontal listing.

#### API:
This component relies on the Jenkins API.

### BuildIcon

For each build passed into BuildStatus in the urlList prop, a BuildIcon is generated.  The BuildIcon consists of the name of the build, an icon indicating its health, and the number of recent builds that have succeeded.

## Calendar/Events

Displays events from a calendar that the user selects.  User can log in/ log out to their Microsoft account, select a calendar from their Outlook calendars, and change the view (between day, work week, month, and agenda).  User authentication and selected calendar are stored in the cache to persist between sessions.

#### Packages:
- **msal**: The Microsoft Authentication Library handles authentication with Azure AD and allows the user to acquire tokens to make Microsoft Graph calls after authenticating.
- **React Big Calendar**: Provides calendar we embed in the Calendar component.  Documentation can be found [here](https://github.com/intljusticemission/react-big-calendar).
- **trashable**

#### API:

Before you can use the API, you must create an application in the [Azure Active Directory](https://portal.azure.com/).  To make or edit your application, navigate to Azure Active Directory -> App Registrations -> New Registration / Select your application.  The Application ID should be the same as the ID in GraphConfig.js.  Under the Authentication tab, the redirect URI should match the URL of where the Wallboard is hosted (or http://localhost:[PORT NUMBER] for local testing).  You must select to grant Access tokens and ID tokens.  Under API permissions, grant the permissions for the features you'll need as delegated privileges.  In the case of the calendar, users will need to grant User.Read and Calendars.Read permissions.

[This website](https://developer.microsoft.com/en-us/graph/graph-explorer) can be useful to see whether Microsft Graph API calls are valid and what they will return.

### GraphConfig

Describes the configuration of the Microsoft Graph API calls.  Namely, the scope of permissions the user is granting by logging in, which authority is authenticating the user, and the ID of the Azure Application with which we are authenticating.
The file contains userAgentApplication and account information such as ID or name to be used in various other components such as EventComponent.js, Login.js

### GraphService

Handles the actual API calls.  Has two functions, one to return the authenticated client and the other to return the information requested from a specific call.

## Clock

Displays time for timezones pertinent to Connexta: Phoenix (MST), Denver (MDT), Boston/DC (EST), United Kingdom (GMT) and Melbourne (AEST).

## Github

Displays the 5 most recent pull requests for a specified repository.  For each pull request, it displays the title, pull request number, excerpt from the description, number of approvals, and any pertinent status checks (such as Jenkins build status).  The component is clickable to navigate to the displayed PR. With the textfield, the github repopath is editable in edit mode.

#### Props:
- **content**: the path to reach the desired repository during API calls.  Typically takes the form of `[ORGANIZATION]/[REPOSITORY]`.  See [GitHub API documentation](https://developer.github.com/v3/repos/) for more details.

#### API:

All information for this component is pulled from the GitHub API.  Calls are authenticated with a client secret and client ID.  To set up a GitHub API application, navigate to Settings -> Developer Settings -> Personal Access Tokens.  These are the credentials you should use when setting up your environment variables (as specified in the main README).

## Grafana

Take and display screenshot of grafana dashboard.

#### Packages:
- **throttle**: Implement throttle to prevent explosive number of setState during window resizing.

#### Props:
  * **name**: name of grafana dashboard
  * **url**: url of grafana dashboard to display
  
## Settings

- Settings Icon
Once the user clicks the setting icon, the user enters an edit mode where the user can select a component from the current screen/wallboard to edit the contents of the component. Currently, the user can modify the color of the banner in the Home screen, slack channel of the SlackComponent, repo path of the Github, jenkins url of the BuildStatus, jenkins url of the BuildAF. The directory contains Setting.js which contains the setting icon container, and componentHOC.js which creates a HOC of editable components.
ColorPicker.js for Banner color picking UI and Dropdown.js for URL (of BuildStatus, BuildAF) UI.

- Login Icon
Once the user clicks the login icon, the user can login to their Microsoft account. Once logged in, any wallboard customization will be stored in the backend associated to user's ID; hence, each user can have their own unique customization. When the user clicks the login icon again, the user can either logout or can see their account info (from Microsoft account).

## MediaComponent

Rotates through media to be displayed on the Wallboard.  Each media consists of a title, body, image, and/or link.  Images/data are stored and retrieved from the back-end nodeJS server.

## SlackComponent
Displays the 10 most recent slack messages, rotating through the messages on a set interval. The slack widget is a fixed size and will only show as many messages as can fit. The component is currently not interactive in any way.
With the dropdown UI, the channel is editable in edit mode.

#### API:  
Multiple API calls are made to the Slack API for different information. The API calls rely on the `SLACK_TOKEN` and `SLACK_CHANNEL` environment variables being set. Here is the list of the API calls made...  
  * Channel History: Gets message history from specific channel
  * Channel List: Gets the list of channels for converting channel ID to name
  * User List: Gets the list of users for converting the user ID to name
  * Emoji List: Gets the list of custom slack emojis for the workspace
  
### SlackCard
This component holds an individual slack message to be used in the collection of slackmessages in the `SlackComponent` component. This contains the main logic for parsing the raw slack message obtained by the API calls.

#### Props:
  * **index**: index of the slack card in the list of slack cards
  * **messages**: list of pulled messages
  * **slackUsers**: List of pulled slack users
  * **emojis**: List of pulled emojis

### Welcome
Simple component to display Dialog (with user's name) whenever the logged in user enters the website.
