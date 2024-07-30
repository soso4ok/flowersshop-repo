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
        stage('Deploy with Docker Compose') {
            steps {
                script {
                    dir('/var/lib/jenkins/workspace/flowers-back') {
                        sh 'docker-compose up -d'
                    }
                }
            }
        }
    }
}
