@Library('github.com/connexta/cx-pipeline-library@master') _

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
    stage('Setup') {
      steps {
        dockerd {}
        slackSend channel: '#cmp-build-bots', color: 'GREY', message: "STARTED: ${JOB_NAME} ${BUILD_NUMBER} ${BUILD_URL}"
      }
    }
    stage('Build Image') {
      steps {
        withCredentials([
          string(credentialsId: 'SLACK_TOKEN', variable: 'SLACK_TOKEN'),
          string(credentialsId: 'SLACK_CHANNEL', variable: 'SLACK_CHANNEL'),
          string(credentialsId: 'SOAESB_BEARER_TOKEN', variable: 'SOAESB_BEARER_TOKEN'),
          string(credentialsId: 'GITHUB_TOKEN', variable: 'GITHUB_TOKEN')
        ]) {
          sh 'make image SLACK_TOKEN=${SLACK_TOKEN} \
          SLACK_CHANNEL=${SLACK_CHANNEL} \
          GITHUB_TOKEN=${GITHUB_TOKEN} \
          SOAESB_BEARER_TOKEN=${SOAESB_BEARER_TOKEN} \
          GIT_BRANCH=' + env.BRANCH_NAME
        }
      }
    }
    stage('Push Image') {
      when {
        allOf {
          expression { env.CHANGE_ID == null }
          expression { env.BRANCH_NAME == "master" || "DEV" }
        }
      }
      steps {
        sh 'make push GIT_BRANCH=' + env.BRANCH_NAME
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
          expression { env.BRANCH_NAME == "master" || "DEV" }
        }
      }
      steps {
        sh 'docker rm -f $(docker ps --format "{{.ID}}:{{.Image}}" | grep registry.phx.connexta.com:5000/devops/eve-wallboard | awk -F ":" \'{print $1}\')'
      }
    }
  }
  post {
    success {
      script {
        if (env.BRANCH_NAME == 'master') {
          slackSend channel: '#cmp-build-bots', color: 'good', message: "Wallboard Build Successful! :jenkins-party: \nUpdated :docker: deployment available at registry.phx.connexta.com:5000/devops/eve-wallboard:master Visit: ${RUN_DISPLAY_URL} and bask in the devops glory!"
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
  }
}