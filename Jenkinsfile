pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'soso4ok/flowersproject'
        DOCKER_CREDENTIALS_ID = '6fb21bb4-72e9-4d46-99ba-96e227758599'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/soso4ok/flowersshop-repo.git'
            }
        }
        stage('Build') {
            steps {
                script {
                    sh 'mvn clean package'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${env.DOCKER_IMAGE} ."
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('', DOCKER_CREDENTIALS_ID) {
                        sh "docker push ${env.DOCKER_IMAGE}:latest"
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    docker.withRegistry('', DOCKER_CREDENTIALS_ID) {
                        sh "docker run -d -p 8083:8083 ${env.DOCKER_IMAGE}:latest"
                    }
                }
            }
        }
    }
}
