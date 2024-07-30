pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'soso4ok/flowersproject'
        DOCKER_CREDENTIALS_ID = 'f56d9d50-b9ea-46f9-a4db-99c50969c14a'
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
        stage('Deploy with Docker Compose') {
            steps {
                script {
                         dir('/var/lib/jenkins/workspace/flowers-back') {
                                    sh "docker-compose up -d"
                                }
                }
            }
        }
    }
    post {
        always {
            sh 'docker-compose -f docker-compose.yml down'
        }
    }
}
