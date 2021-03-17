pipeline {
    agent any

    stages {
        stage("Build image") {
            steps {
                container ("docker") {
                    sh "docker build -t apar-frontend:${env.BUILD_ID} ."
                }
            }
        }
    }

}
