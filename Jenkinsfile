pipeline {
    agent any

    stages {
        stage("Build image") {
            steps {
                container ("docker") {
                    script {
                        app = docker.build("simojoe/apar-frontend:${env.BUILD_ID}")
                    }
                }
            }
        }
        stage("Push image") {
            steps {
                container ("docker") {
                    script {
                        docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                            app.push("latest")
                            app.push("${env.BUILD_ID}")
                        }
                    }
                }
            }
        }
        stage("Installing kubectl on agent") {
            steps {
                sh 'curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl'
                sh 'chmod -R 757 /usr/local/sbin'
                sh 'chmod +x ./kubectl && mv kubectl /usr/local/sbin'
            }
        }
        stage("Deploy image") {
            steps {
                sh("ls")
                sh("kubectl get nodes")
            }
        }
    }

}
