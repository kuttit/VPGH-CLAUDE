pipeline {
    agent {
        label 'slave-224'
    }

    environment {
        REGISTRY          = "192.168.2.164:5000"
        APP_NAME          = "ct308-gph-vgph-df-v1"
        IMAGE_NAME        = "${REGISTRY}/${APP_NAME}"
        IMAGE_TAG         = "${BUILD_NUMBER}"
        GIT_CREDS         = "GIT_HUB_PAT"
        KUBE_CREDS        = "kubernetes-224"
        KUBE_NAMESPACE    = "ct308-gph-vgph-v1"
        SERVICE_DIR       = "payment-rails-api"
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
                        script: "git diff --name-only HEAD~1 || true",
                        returnStdout: true
                    ).trim()

                    if (changedFiles.split('\n').any { it.startsWith("${SERVICE_DIR}/") }) {
                        env.SERVICE_CHANGED = "true"
                        echo "✅ Changes detected in ${SERVICE_DIR}"
                    } else {
                        env.SERVICE_CHANGED = "false"
                        echo "⏭️ No changes in ${SERVICE_DIR}, skipping build & deploy"
                    }
                }
            }
        }

        stage('Docker Buildx & Push') {
            when {
                expression { env.SERVICE_CHANGED == "true" }
            }
            steps {
                script {
                    docker.withRegistry("http://${REGISTRY}", '') {
                        sh """
                        set -e
                        export DOCKER_BUILDKIT=1

                        docker buildx inspect default >/dev/null 2>&1 || docker buildx create --use
                        docker buildx use default

                        docker buildx build \
                          --pull \
                          --build-arg BUILDKIT_INLINE_CACHE=1 \
                          --tag ${IMAGE_NAME}:${IMAGE_TAG} \
                          --file ${SERVICE_DIR}/Dockerfile \
                          ${SERVICE_DIR} \
                          --push
                        """
                    }
                }
            }
        }

        stage('Update Kubernetes Manifest') {
            when {
                expression { env.SERVICE_CHANGED == "true" }
            }
            steps {
                sh """
                sed -i 's|image:.*|image: ${IMAGE_NAME}:${IMAGE_TAG}|' \
                ${SERVICE_DIR}/kubernetes/deploymentservice.yaml
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
                    kubectl apply -n ${KUBE_NAMESPACE} -f ${SERVICE_DIR}/kubernetes/deploymentservice.yaml
                    kubectl apply -n ${KUBE_NAMESPACE} -f ${SERVICE_DIR}/kubernetes/df-ingress.yaml
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
