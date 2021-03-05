pipeline {
    agent any

    stages {
        stage("Checkout code") {
            steps {
                checkout scm
            }
        }
        stage("Build image") {
            agent {
                label "dockerPod"
            }
            steps {
                script {
                    myapp = docker.build("DOCKER-HUB-USERNAME/hello:${env.BUILD_ID}")
                }
            }
        }
    }

}