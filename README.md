# Project EVE

Wallboard Project for Connexta.

Project EVE serves as a display for important information both for the office and for each project team.  Project EVE includes many different components that can be mixed and matched to fit a given team's needs and the information shown on many components can also be customized.  The Wallboard is hosted at [http://eve.phx.connexta.com/](http://eve.phx.connexta.com/).

This project is built using ReactJS and NodeJS.

## Features

- Components

  - **BuildStatus**: Displays the health of major builds as given by Jenkins.  Build health can be toggled between the health of the most recent build or the health of the last 5 builds.  Health is indicated by one of three icons: green check mark for healthy builds, yellow dash for some failtures, and red x for many failed builds.
  
  - **Events**: Displays events from a given Outlook Calendar.  Users can log in/out and select which of their calendars they want displayed.  Users can also manually add/remove events in edit mode.
  
  - **Media**: Users can add/remove media to be displayed on the wallboard.
  
  - **Clock**: Displays time for relevant timezones to Connexta: Phoenix (MST), Denver (MDT), Boston/DC (EST), United Kingdom (GMT), Melbourne (AEST).
  
  - **Github**: Displays most recent pull requests of a given repository.  Cycles through PR's automatically or users can manually scroll through them.  For each PR, the component links to the Github page and displays the title, PR number, exerpt from the description, and any pertinent status checks.  If the status check links to a webpage, users can click on the status check to navigate there.
  
  - **SlackComponent**: Cycles through 10 most recent slack messages on a given channel.  Displays username, profile picture, message (including styling and emojis), date, and channel of origin.

  - **Grafana**: Takes screenshot of the current grafana dashboard executed by NodeJS grafana.js.

- Custom Wallboards: Users can navigate to wallboards customized to their project team or to the main TV wallboard.

## Setup

### What you need
- yarn
- GNU make
- Docker
- .env (with all necessary environment variable; necessary for local or Dockerized environment testing)

### Setting up Enviornment Variables
The Github component requires ```GITHUB_TOKEN```.
The Slack component requires ```SLACK_CHANNEL``` and ```SLACK_TOKEN```.
The Grafana component requires ```SOAESB_BEARER_TOKEN```.

Place the environment variables in the .env file
Example: ```SLACK_CHANNEL=ABC123```

The environment variable must also be added to webpack.config.js, Dockerfile, Jenkinsfile, and Makefile. Simply follow the format of existing environment variables.  To test locally, you must add the environment variable to your machine as well.

### Setting up API's
Several components (specifically the Event, GitHub, and Slack components) use third-party API's that must be set up.

#### Event
In order to access a user's Outlook Calendar in the Event component, you must first register an application through Microsoft's [Azure Portal](https://portal.azure.com/#home).  You must register the application through a university or business associated Microsoft account in order to be able to grant the necessary privileges to the application.  Additionally, by using an account belonging to a specific organization, you can restrict those with access to your application to those with emails in your organization.  Begin by navigating to Azure Active Directory -> App Registrations.  Here, click "New Registration".  You'll be asked to give your application a name, supported account types (such as those only from your organization), and a redirect URI.  The redirect URI will be necessary to authenticate users in your applications.

Next, you'll see some information about your new application.  Take note of the application ID, this should be stored in the GraphConfig file as ```appId```.  Navigate to the Authentication tab.  Here, you must list all Redirect URI's.  That is, every page from which users will be logging in/logging out.  Take care that each URI exactly matches the URI users will be navigating from, including trailing ```/``` characters.  A separate redirect URI must be given for each route of the Wallboard.  A Logout URL is the site from which a user's session information should be cleared.  Make to sure to enable Access and ID tokens under the ```Implicit Grant``` section.

Under API permissions you must list the permissions the application grants.  In our case, we need to grant ```User.Read``` and ```Calendars.Read``` as Delegated (not Application) privileges.

#### GitHub
To generate a GitHub Token, navigate to [your profile settings](https://github.com/settings/profile).  From here, navigate to Developer settings -> Personal Access Tokens.  Here you can select a button to ```Generate new token```.  Here you can choose which privileges to grant to your application.  In the case of this project, you'll want to give it all repo privileges.  After this, you'll see the generated token.  Make sure to store it someplace safe, you won't be able to see it again.  This value should be stored in the GITHUB_TOKEN environment variable in order for the API to work properly.  It is important to note that this GitHub token will be associated with your account, and the one who creates it has control of the privileges it grants and will be the one to receive security alerts related to the token.

#### Slack

The Slack API requires registering a bot user token.  The bot account used to fetch Slack messages for display on the wallboard will have such a token that you can use.  This token should be stored in the ```SLACK_TOKEN``` environment variable.

### Running the Wallboard locally
In two separate terminals,
For client, run
```
yarn go (synonymous with yarn install && yarn build && yarn start)
```
For server in http, run
```
yarn server (synonymous with node server/server.js)
```
Or for server in https, run
```
yarn https
```
Then navigate to 0.0.0.0:8080 on Mac or localhost:8080 on Windows.
It is necessary to run the server if you are testing components that utilize backend API calls (i.e. Grafana)
  
### Running the Wallboard in Dockerized environment
Make sure Docker is running, then run
```
make go
```
Then navigate to 0.0.0.0:3000 on Mac or localhost:3000 on Windows.

### Hosting the Wallboard
Make a PR and merge it to master branch of github repo.
Jenkins will pick up the change and will automatically build based on the change.
The change will be reflected in [http://eve.phx.connexta.com/](http://eve.phx.connexta.com/).

#### Docker
```make go``` will create a new Docker image tagged with `master` and subsequently run the newly created Docker image.
**NOTE:** You must set your environment variables in .env file before building the image for the app to work. 
Then navigate to 0.0.0.0:8080 on Mac or localhost:8080 on Windows. 
You can kill the container through the command ```docker kill wallboard```  

#### Jenkins
The Jenkins has already been setup in devops/eve-wallboard of the Jenkins server

Required build setup:
- Github Webhook setup : An admin needs to add a webhook to the Jenkins service in the Github repository settings.
`https://dzone.com/articles/adding-a-github-webhook-in-your-jenkins-pipeline`
- Jenkins setup: In the Jenkins service website, create multibranch pipeline project to detect github SCM repo.
- Environment variable setup: In the Jenkins service website, Create secret text in Credentials (i.e. SLACK_TOKEN)

### Admin Status
With login feature, user can use Microsoft account to login, and customize their own unique wallboard, which would be stored in backend associated to the user's account ID. There can be one unique Admin Role which enables the admin user to modify components with `AdminOnly` prop (i.e. EventComponent, MediaComponent and ReleaseVersion). The Admin role can be setup by creating a Jenkins credentials for environment variable with key name `WALLBOARDADMIN` with value name being user's Microsoft ID (which can be identified in Account Info of Login icon after user logged in). Such environment variable will be verified to see if it matches to the logged in user's ID in login.js.
If such Jenkins credentials have not been setup, then, as a default, everyone will receive a Admin role to be able to modify any components.

### How to add new Wallboard & new Components

#### Adding new Wallboard
1. Create a `<wallboard>.js` in client/wallboards
2. from Redux store, use `updateCurrentWallboard` to update the current wallboard in `componentDidMount()`
3. from Redux store, use `updateCurrentWallboard` to update to "HOME" in `componentWillUnmount()`
4. Create a const variable for style and pass it to any new components in the wallboard
5. Pass appropriate props (see below) to the new components, which will be taken care of in client/Settings/componentHOC.js

- For step 2 - 5, `client/wallboards/TVWallboard.js` is a good example to take a look at.
- For possible props for components will be
  - style : takes object with css styling
  - type : takes array with specific name (i.e. URL, NAME, CHANNEL, REPOPATH) used to test the content and to display in the edit mode Dialog
  - name : takes a string used as a name to store along with data in the backend\
  - default : (optional) overrides the existing default (client/utils/DefaultData.js) (format needs to match. If in doubt, check out DefaultData.js)
  - disable : (optional) disable any edit interaction
  - disableEffect : (optional) disable effect of edit mode (i.e. outline expansion) but still be able to interact in edit mode
  - disablePopup : (optional) disable dialog to be popup. Currently used for EventComponents, MediaComponents and ReleaseVersion as they have either inherent dialog or no need for a dialog.
  - listvert : (optional) specific for BuildStatus component to vertically display content
  - AdminOnly : (optional) make it editable only if the user is Admin.

#### Adding new Component
1. Create a `<component>.js` in client/components with appropriate functions
2. Wrap and export the component with componentHOC.

- All the details of the card containing the component has been taken care by componentHOC.js. Specific width, height or margin should be passed as step 4 of Adding new Wallboard.

## Format Code
Use `prettier` for code formatting through yarn. The following command will prettify .js code in all directories including subdirectories.
```
make pretty
```  
Prettier can also be used through extensions in your IDE.   
More information can be found [here](https://prettier.io/).
