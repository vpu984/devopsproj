pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'vishal984'
        IMAGE_NAME = 'simple-microservice'
        IMAGE_TAG = 'latest'
        KUBE_NAMESPACE = 'default'
        KUBECONFIG_PATH = 'C:\\Users\\vishal\\.kube\\config'   // 👈 Adjust this to your actual kubeconfig path
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checking out repository...'
                checkout([$class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[url: 'https://github.com/vpu984/devopsproj.git']]
                ])
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                bat """
                docker build -t %DOCKERHUB_USER%/%IMAGE_NAME%:%IMAGE_TAG% .
                """
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo '📤 Pushing image to Docker Hub...'
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
                echo '🚀 Deploying to Kubernetes...'
                bat """
                set KUBECONFIG=%KUBECONFIG_PATH%
                kubectl apply -f microservice-deployment.yaml
                kubectl apply -f microservice-service.yaml
                kubectl set image deployment/simple-microservice simple-microservice=%DOCKERHUB_USER%/%IMAGE_NAME%:%IMAGE_TAG% -n %KUBE_NAMESPACE%
                """
            }
        }

        stage('Verify Deployment') {
            steps {
                echo '🔍 Verifying Pods...'
                bat """
                set KUBECONFIG=%KUBECONFIG_PATH%
                kubectl get pods -n %KUBE_NAMESPACE%
                """
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful! Check your Kubernetes service and Grafana dashboard."
        }
        failure {
            echo "❌ Build or deployment failed. Please check Jenkins logs for more details."
        }
    }
}
