# Project EVE

Wallboard Project for Connexta.

Project EVE serves as a display for important information both for the office and for each project team.  Project EVE includes many different components that can be mixed and matched to fit a given team's needs and the information shown on many components can also be customized.  The Wallboard is hosted at [http://eve.phx.connexta.com/](http://eve.phx.connexta.com/).

This project is built using ReactJS and NodeJS.

## Features

- Components

  - **BuildStatus**: Displays the health of major builds as given by Jenkins.  Build health can be toggled between the health of the most recent build or the health of the last 5 builds.  Health is indicated by one of three icons: green check mark for healthy builds, yellow dash for some failtures, and red x for many failed builds.
  
  - **Calendar**: Displays events from a given Outlook Calendar.  Users can log in/out and select which of their calendars they want displayed.  Users can toggle between day, work week, month, and agenda views.
  
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
The Github component requires ```GITHUB_TOKEN``` and ```GITHUB_CLIENT_SECRET```.
The Slack component requires ```SLACK_CHANNEL``` and ```SLACK_TOKEN```.
The Grafana component requires ```SOAESB_BEARER_TOKEN```.

Place the environment variables in the .env file
Example: ```SLACK_CHANNEL=ABC123```

### Running the Wallboard locally
In two separate terminals,
For client, run
```
yarn go (synonymous with yarn install && yarn build && yarn start)
```
For server, run
```
yarn server (synonymous with node server/server.js)
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

## Format Code
Use `prettier` for code formatting through yarn. The following command will prettify .js code in all directories including subdirectories.
```
make pretty
```  
Prettier can also be used through extensions in your IDE.   
More information can be found [here](https://prettier.io/).
