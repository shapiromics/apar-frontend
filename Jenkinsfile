pipeline {
    agent any

    stages {
        stage("Build image") {
            steps {
                container ("docker") {
                    app = sh "docker build -t simojoe/apar-frontend:${env.BUILD_ID} ."
                }
            }
        }
        stage("Push image") {
            steps {
                scripts {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                            app.push("latest")
                            app.push("${env.BUILD_ID}")
                    }
                }
            }
        }
    }

}
