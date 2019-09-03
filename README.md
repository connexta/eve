# Project EVE

Wallboard Project for Connexta.

Project EVE serves as a display for important information both for the office and for each project team.  Project EVE includes many different components that can be mixed and matched to fit a given team's needs and the information shown on many components can also be customized.  The Wallboard is hosted at [http://eve.phx.connexta.com/](http://eve.phx.connexta.com/).

This project is built using ReactJS and NodeJS.

## Features

- Components

  - **BuildStatus**: Displays the health of major builds as given by Jenkins.  Build health can be toggled between the health of the most recent build or the health of the last 5 builds.  Health is indicated by one of three icons: green check mark for healthy builds, yellow dash for some failtures, and red x for many failed builds.
  
  - **Events**: Displays events from a given Outlook Calendar.  Users can log in/out and select which of their calendars they want displayed.
  
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
  - listvert : (optional) specific for BuildStatus or TeamBuildStatus component to vertically display content

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