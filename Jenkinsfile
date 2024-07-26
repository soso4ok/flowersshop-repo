pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'soso4ok/flowersproject'
        DOCKER_CREDENTIALS_ID = '6fb21bb4-72e9-4d46-99ba-96e227758599'
        DOCKER_REGISTRY_URL = '' // Define your Docker registry URL here if needed
        MAVEN_OPTS = '-Dmaven.repo.local=.m2/repository' // Use a local repository cache
    }

    options {
        timeout(time: 30, unit: 'MINUTES') // Set a timeout for the entire pipeline
        skipStagesAfterUnstable() // Skip stages after a stage is marked as unstable
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm: [$class: 'GitSCM', branches: [[name: '*/main']], userRemoteConfigs: [[url: 'https://github.com/soso4ok/flowersshop-repo.git']]]
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean package'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def customImage = docker.build(DOCKER_IMAGE)
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry(DOCKER_REGISTRY_URL, DOCKER_CREDENTIALS_ID) {
                        docker.image(DOCKER_IMAGE).push('latest')
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    docker.withRegistry(DOCKER_REGISTRY_URL, DOCKER_CREDENTIALS_ID) {
                        docker.image(DOCKER_IMAGE).run('-d -p 8083:8083')
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
        always {
            cleanWs() // Clean workspace after build
        }
    }
}
