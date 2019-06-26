pipeline {
  agent { label 'dind' }
  options {
    buildDiscarder(logRotator(numToKeepStr:'25'))
    disableConcurrentBuilds()
    timestamps()
  }
  environment { PATH="${tool 'docker-latest'}/bin:$PATH" }
  triggers {
    /*
        Restrict nightly builds to master branch, all others will be built on change only.
    */
    cron(BRANCH_NAME == "master" ? "H 5 * * 1" : "")
  }
  stages {
    stage("${env.BRANCH_NAME}") {
      steps {
        script {
          String fullJobName = "${JOB_NAME}"
          String[] jobName = fullJobName.split("/")
          String wallboardEnv
          String filterPat
          switch ("${env.BRANCH_NAME}") {
              case 'master':
                  wallboardEnv = "production"
                  filterPat = "^(${jobName[0]}${env.BRANCH_NAME}closedtrue)\$"
                  break
              case 'development':
                  wallboardEnv = "development"
                  filterPat = "^(${jobName[0]})${env.BRANCH_NAME}(closedtrue|synchronizedfalse)\$"
                  break
              default:
                  echo 'wallboard environment could not be determined!'
                  exit
          }
          properties([
              pipelineTriggers([
                  [$class: 'GenericTrigger',
                      genericVariables: [
                          [
                              key: 'repo',
                              value: '$.repository.name',
                              expressionType: 'JSONPath', //Optional, defaults to JSONPath
                              regexpFilter: '', //Optional, defaults to empty string
                              defaultValue: "${jobName[0]}" //Optional, defaults to empty string
                          ],
                          [
                              key: 'action',
                              value: '$.action',
                              expressionType: 'JSONPath',
                              regexpFilter: '',
                              defaultValue: 'synchronized'
                          ],
                          [
                              key: 'merged',
                              value: '$.pull_request.merged',
                              expressionType: 'JSONPath',
                              regexpFilter: '',
                              defaultValue: 'false'
                          ],
                          [
                              key: 'base_branch',
                              value: '$.pull_request.base_branch',
                              expressionType: 'JSONPath',
                              regexpFilter: '',
                              defaultValue: 'null'
                          ]
                      ],
                      printContributedVariables: true,
                      printPostContent: true,
                      regexpFilterText: '$repo$base_branch$action$merged',
                      regexpFilterExpression: filterPat
                  ]
              ])
          ])
        }
      }
    }
    stages {
      stage('Build Image') {
        steps {
          sh 'make image'
        }
      }
      stage('Push Image') {
        when {
          allOf {
            expression { env.CHANGE_ID == null }
            expression { env.BRANCH_NAME == "master" }
          }
        }
        steps {
          sh 'make push'
        }
      }
      // The following stage doesn't actually re-deploy the marathon service, but actually kills the existing docker container
      // that is tied to it, so that marathon reschedules it. This is to get around the annoying dc/os auth issues
      stage('Deploy Marathon Service') {
        environment {
          DOCKER_HOST="tcp://swarm.phx.connexta.com:2375"
          DOCKER_API_VERSION=1.23
        }
        when {
          allOf {
            expression { env.CHANGE_ID == null }
            expression { env.BRANCH_NAME == "master" }
          }
        }
        steps {
          sh 'docker rm -f $(docker ps --format "{{.ID}}:{{.Image}}" | grep registry.phx.connexta.com:5000/devops/blue-ocean-wallboard | awk -F ":" \'{print $1}\')'
      } 
      }
    }
    post {
      success {
       script {
          if (env.BRANCH_NAME == 'master') {
            slackSend channel: '#cmp-build-bots', color: 'good', message: "Wallboard Build Successful! :jenkins-party: \nUpdated :docker: deployment available at registry.phx.connexta.com:5000/devops/blue-ocean-wallboard:latest Visit: ${RUN_DISPLAY_URL} and bask in the devops glory!"
          } else {
            slackSend channel: '#cmp-build-bots', color: 'good', message: "Awesome! '${JOB_NAME} [#${BUILD_NUMBER}]' built successfully :jenkins-party:"
          }
        }
      }
      failure {
        slackSend channel: '#cmp-build-bots', color: 'danger', message: "Uh-oh... it looks like '${JOB_NAME} [#${BUILD_NUMBER}]' encountered a failure. \nTake a look here: ${RUN_DISPLAY_URL} and :fixit:"
      }
      aborted {
        slackSend channel: '#cmp-build-bots', color: 'warning', message: "Hmm, it seems that '${JOB_NAME} [#${BUILD_NUMBER}]' was aborted. \nSomebody might want to take a look here: ${RUN_DISPLAY_URL}"
      }
      cleanup {
        echo "cleaning up build node..."
        wrap([$class: 'MesosSingleUseSlave']) {
          sh 'echo "...Shutting down Jenkins slave: `hostname`"'
        }
      }
    }
  }
}
