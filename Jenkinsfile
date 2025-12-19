pipeline {
    agent {
        label 'slave-224'
    }

    options {
        skipDefaultCheckout(true)
    }

    environment {
        REGISTRY       = "192.168.2.164:5000"
        APP_NAME       = "ct308-gph-vgph-df-v1"
        IMAGE_NAME     = "${REGISTRY}/${APP_NAME}"
        IMAGE_TAG      = "${BUILD_NUMBER}"
        GIT_CREDS      = "GIT_HUB_PAT"
        KUBE_CREDS     = "kubernetes-224"
        KUBE_NAMESPACE = "ct308-gph-vgph-v1"
    }

    stages {

        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                git branch: 'master',
                    credentialsId: "${GIT_CREDS}",
                    url: 'https://github.com/kuttit/VPGH-CLAUDE.git'
            }
        }

        stage('Detect Changes') {
            steps {
                script {
                    def changedFiles = sh(
                        script: "git diff --name-only HEAD~1 HEAD || true",
                        returnStdout: true
                    ).trim()

                    if (changedFiles) {
                        env.SERVICE_CHANGED = "true"
                        echo "✅ Changes detected:\n${changedFiles}"
                    } else {
                        env.SERVICE_CHANGED = "false"
                        echo "⏭️ No changes detected, skipping build & deploy"
                    }
                }
            }
        }

        stage('Docker Buildx & Push') {
            when {
                expression { env.SERVICE_CHANGED == "true" }
            }
            steps {
                sh """
                set -e
                export DOCKER_BUILDKIT=1

                docker buildx inspect default >/dev/null 2>&1 || docker buildx create --use
                docker buildx use default

                docker buildx build \
                  --pull \
                  --build-arg BUILDKIT_INLINE_CACHE=1 \
                  --tag ${IMAGE_NAME}:${IMAGE_TAG} \
                  --file Dockerfile \
                  . \
                  --push
                """
            }
        }

        stage('Update Kubernetes Manifest') {
            when {
                expression { env.SERVICE_CHANGED == "true" }
            }
            steps {
                sh """
                sed -i 's|image:.*|image: ${IMAGE_NAME}:${IMAGE_TAG}|' \
                kubernetes/deploymentservice.yaml
                """
            }
        }

        stage('Deploy to Kubernetes') {
            when {
                expression { env.SERVICE_CHANGED == "true" }
            }
            steps {
                withKubeConfig(
                    credentialsId: "${KUBE_CREDS}",
                    serverUrl: 'https://lb.kubesphere.local:6443'
                ) {
                    sh """
                    kubectl get ns ${KUBE_NAMESPACE} || kubectl create ns ${KUBE_NAMESPACE}
                    kubectl apply -n ${KUBE_NAMESPACE} -f kubernetes/deploymentservice.yaml
                    kubectl apply -n ${KUBE_NAMESPACE} -f kubernetes/df-ingress.yaml
                    kubectl rollout status deployment/${APP_NAME} -n ${KUBE_NAMESPACE}
                    """
                }
            }
        }

        stage('Cleanup Old Image (Local Only)') {
            when {
                expression { env.SERVICE_CHANGED == "true" }
            }
            steps {
                script {
                    def prev = env.BUILD_NUMBER.toInteger() - 1
                    if (prev > 0) {
                        sh "docker rmi -f ${IMAGE_NAME}:${prev} || true"
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully"
        }
        failure {
            echo "❌ Pipeline failed"
        }
    }
}
