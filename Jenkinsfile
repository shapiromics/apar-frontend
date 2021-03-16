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
                container ("docker") {
                    sh "docker build -t apar-frontend:${env.BUILD_ID} . "
                }
            }
        }
    }

}
