pipeline {
    agent any

    stages {
        stage("Checkout code") {
            steps {
                checkout scm
            }
        }
        stage("Build image") {
            steps {
                script {
                    myapp = docker.build("simojoe/apar-frontend:${env.BUILD_ID}")
                }
            }
        }
    }
}