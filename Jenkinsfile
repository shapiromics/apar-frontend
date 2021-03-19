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

        stage("Deploy image") {
            steps {
                System.setProperty("org.jenkinsci.plugins.durabletask.BourneShellScript.LAUNCH_DIAGNOSTICS", "true");
                container("kube") {
                    echo "dude"
                    sh "kubectl create namespace test"
                }
            }
        }
    }

}
