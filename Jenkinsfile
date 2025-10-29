pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'vishal984'
        IMAGE_NAME = 'simple-microservice'
        IMAGE_TAG = "latest"
        KUBE_NAMESPACE = "default"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "🔹 Cloning public repository..."
                git branch: 'main', url: 'https://github.com/vpu984/devopsproj.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    bat """
                    docker build -t %DOCKERHUB_USER%/%IMAGE_NAME%:%IMAGE_TAG% .
                    """
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    bat """
                    echo %PASS% | docker login -u %USER% --password-stdin
                    docker push %DOCKERHUB_USER%/%IMAGE_NAME%:%IMAGE_TAG%
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    bat """
                    kubectl set image deployment/simple-microservice simple-microservice=%DOCKERHUB_USER%/%IMAGE_NAME%:%IMAGE_TAG% -n %KUBE_NAMESPACE% || ^
                    kubectl apply -f microservice-deployment.yaml
                    kubectl apply -f microservice-service.yaml
                    """
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                bat 'kubectl get pods -n %KUBE_NAMESPACE%'
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful! Check Grafana for new metrics."
        }
        failure {
            echo "❌ Build or deployment failed. Check Jenkins logs."
        }
    }
}
