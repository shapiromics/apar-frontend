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
    volumeMounts:
      - mountPath: "/root/.m2"
        name: m2
  volumes:
    - name: m2
      persistentVolumeClaim:
        claimName: m2
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
