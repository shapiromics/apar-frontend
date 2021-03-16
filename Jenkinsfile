pipeline {
    agent {
        kubernetes {
        label 'spring-petclinic-demo'
        defaultContainer 'jnlp'
        yaml """
apiVersion: v1
kind: Pod
metadata:
labels:
  component: ci
spec:
  # Use service account that can deploy to all namespaces
  serviceAccountName: jenkins
  containers:
  - name: maven
    image: maven:latest
    command:
    - cat
    tty: true
  - name: docker
    image: docker:latest
    command:
    - cat
    tty: true
    volumeMounts:
    - mountPath: /var/run/docker.sock
      name: docker-sock
  volumes:
    - name: docker-sock
      hostPath:
        path: /var/run/docker.sock
            """
        }
    }

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
