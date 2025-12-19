pipeline {
    agent {
        label 'slave-224'
    }

    tools {
        jdk 'jdk17'
        nodejs 'Node20.0.0'
    }

    environment {
        DOCKERHUB_USERNAME = "192.168.2.164:5000"
        APP_NAME = "ct308-gph-vgph-df-v1"
        IMAGE_NAME = "${DOCKERHUB_USERNAME}/${APP_NAME}"
        IMAGE_TAG = "${BUILD_NUMBER}"
        GITHUB_CREDENTIALS = "GIT_HUB_PAT"
        SCANNER_HOME = tool 'sonar-scanner'
    }

    stages {

        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Code Checkout') {
            steps {
                git branch: 'master',
                    credentialsId: "${GITHUB_CREDENTIALS}",
                    url: 'https://github.com/kuttit/VPGH-CLAUDE.git'
            }
        }

        stage('Detect Changes in payment-rails-api') {
            steps {
                script {
                    def diff = sh(
                        script: "git diff --name-only HEAD~1 HEAD",
                        returnStdout: true
                    ).trim()

                    if (diff.split('\n').any { 
                        it.startsWith('payment-rails-api/') 
                    }) {
                        env.NEST_DF_CHANGED = "true"
                        echo "Changes detected in payment-rails-api"
                    } else {
                        env.NEST_DF_CHANGED = "false"
                        echo "No changes in payment-rails-api. Skipping build & deploy."
                    }
                }
            }
        }

        stage('Docker Buildx & Push') {
            when {
                expression { env.NEST_DF_CHANGED == "true" }
            }
            steps {
                script {
                    docker.withRegistry("http://${DOCKERHUB_USERNAME}", '') {
                        sh """
                        export DOCKER_BUILDKIT=1
                        docker buildx use default

                        docker buildx build \
                          --build-arg BUILDKIT_INLINE_CACHE=1 \
                          --tag ${IMAGE_NAME}:${IMAGE_TAG} \
                          --file payment-rails-api/Dockerfile \
                          payment-rails-api \
                          --push
                        """
                    }
                }
            }
        }

        stage('Update Kubernetes Deployment File') {
            when {
                expression { env.NEST_DF_CHANGED == "true" }
            }
            steps {
                sh """
                sed -i 's/docker_tag/${IMAGE_TAG}/g' \
                payment-rails-api/kubernetes/deploymentservice.yaml
                """
            }
        }

        stage('Deploy to Kubernetes') {
            when {
                expression { env.NEST_DF_CHANGED == "true" }
            }
            steps {
                withKubeConfig(
                    credentialsId: 'kubernetes-224',
                    serverUrl: 'https://lb.kubesphere.local:6443'
                ) {
                    sh "kubectl get ns ct308-gph-vgph-v1 || kubectl create ns ct308-gph-vgph-v1"
                    sh "kubectl apply -f payment-rails-api/kubernetes/deploymentservice.yaml"
                    sh "kubectl apply -f payment-rails-api/kubernetes/df-ingress.yaml"
                }
            }
        }

        stage('Remove Previous Build Image') {
            when {
                expression { env.NEST_DF_CHANGED == "true" }
            }
            steps {
                script {
                    def prevBuildNumber = env.BUILD_NUMBER.toInteger() - 1
                    if (prevBuildNumber > 0) {
                        sh "docker rmi -f ${IMAGE_NAME}:${prevBuildNumber} || true"
                    }
                }
            }
        }
    }
}
