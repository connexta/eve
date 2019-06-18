# Project EVE
The new wallboard project

## Build
```
yarn build
yarn start
```

## Setting up Slack
The slack integration relies on the environment variable ```SLACK_TOKEN``` being set before use. 
To do this, create a file called ```.env``` containing the line ```export SLACK_TOKEN=xxxxxxxx```, 
replacing the value with a valid slack token. You may need to ```source .env``` for the variable to load.
  
To specify the channel you want to connect to, add ```export SLACK_CHANNEL=xxxxxx``` to your ```.env```
file, using your slack channel ID as the value.

## Format Code
Use `prettier` for code formatting through yarn:  
```
yarn prettier --write <file>
```  
  
Prettier can also be used through extensions in your IDE.   
More information can be found [here](https://prettier.io/).  
