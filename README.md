# Project EVE

Wallboard Project for Connexta.

Project EVE serves as a display for important information both for the office and for each project team.  Project EVE includes many different components that can be mixed and matched to fit a given team's need and the information shown on many components can also be customized.  The Wallboard is hosted at [http://eve.phx.connexta.com/](http://eve.phx.connexta.com/).

## Features

- Components
  - **BuildStatus**: Displays the health of major builds as given by Jenkins.  Build health can be toggled between the health of the most recent build or the health of the last 5 builds.  Health is indicated by one of three icons: green check mark for healthy builds, yellow dash for some failtures, and red x for many failed builds.
  - **Calendar**: Displays events from a given Outlook Calendar.  Users can log in/out and select which of their calendars they want displayed.  Users can toggle between day, work week, month, and agenda views.
  - **Clock**: Displays time for relevant timezones to Connexta: Phoenix (MST), Denver (MDT), Boston/DC (EST), United Kingdom (GMT), Melbourne (AEST).
  - **Github**: Displays most recent pull requests of a given repository.  Cycles through PR's automatically or users can manually scroll through them.  For each PR, the component links to the Github page and displays the title, PR number, exerpt from the description, and any pertinent status checks.  If the status check links to a webpage, users can click on the status check to navigate there.
  - **SlackComponent**: Cycles through 10 most recent slack messages on a given channel.  Displays username, profile picture, message (including styling and emojis), date, and channel of origin.
- Custom Wallboards: Userse can navigate to wallboards customized to their project team or to the main TV wallboard.

## Building
You can view the Wallboard by visiting [http://eve.phx.connexta.com/](http://eve.phx.connexta.com/).

### Setting up
The Github and Slack components require the use of environmant variables to authenticate and fetch data.  Before running the wallboard on your machine, you must set up the ```SLACK_TOKEN```, ```SLACK_CHANNEL```, ```GITHUB_CLIENT_ID```, ```GITHUB_CLIENT_SECRET```, and ```GRAPH_APP_ID``` environment variables.

**Windows:** You can set env variables by using the command ```setx -m <Var_Name> <Var_Value```  
Note that the ```-m``` flag makes it a system property so the command line shell must be run in 
administrator mode.  
Example: ```setx -m SLACK_TOKEN 12345```
  
**UNIX:** You can set env variables by using the command ```export <Var_Name>=<Var_Value>```  
Example: ```export SLACK_TOKEN=12345```

### Running the Wallboard locally
#### What you need
- yarn

#### How to build
Navigate to your clone of the repo and run `yarn go` (synonymous with `yarn install && yarn build && yarn start`).  Then navigate to 0.0.0.0:8000 on Mac or localhost:8000 on Windows.


### Hosting the Wallboard
### What you need
- yarn
- docker

## Docker
On linux run ```make image``` to generate the image.  
**NOTE:** You must set your environment variables before building the image for the app to work. 
See the **Setting up** section for more details  
  
To push, run ```make push```
  
To start the container, run ```docker run --rm -p 3000:3000 --name wallboard -d <image-id>```  
  
Once the image is running, you can connect to the wallboard app by going to ```0.0.0.0:3000``` in your web browser.
  
You can kill the container through the command ```docker kill wallboard```  

## Jenkins

Required setup:

- Github Webhook setup : An admin needs to add a webhook to the Jenkins service in the Github repository settings.
- Jenkins setup: In the Jenkins service website, create multibranch pipeline project to detect github SCM repo.
- Environment variable setup: In the Jenkins service website, Create secret text in Credentials for SLACK_TOKEN and SLACK_CHANNEL

## Format Code
Use `prettier` for code formatting through yarn:  
```
yarn prettier --write <file>
```  
  
Prettier can also be used through extensions in your IDE.   
More information can be found [here](https://prettier.io/).
