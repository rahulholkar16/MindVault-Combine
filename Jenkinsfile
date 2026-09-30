pipeline {
    agent {label "agent-1"};

    environment {
        SONAR_HOME= tool "Sonar"
    }

    stages {
        stage ("Clone Code") {
            steps {
                git url: "https://github.com/rahulholkar16/MindVault-Combine.git", branch: "main"
            }
        }

        stage ("SonarQube Quality Analysis") {
            steps {
                withSonarQubeEnv("Sonar") {
                    sh "$SONAR_HOME/bin/sonar-scanner"
                }
            }
        }

        stage ("Trivy Scan") {
            steps {
                sh "trivy fs --format table --exit-code 1 --severity HIGH,CRITICAL -o result.json ."
            }
        }

        stage ("OWASP Dependency Check") {
            steps {
                withCredentials ([
                    string(credentialsId: 'OWASP-NVD-ID', variable: 'OWASP-NVD-ID')
                ]) {
                    dependencyCheck(
                        additionalArguments: "--scan ./ --nvdApiKey ${OWASP-NVD-ID}",
                        odcInstallation: "dc"
                    )
                }
                dependencyCheckPublisher(
                    pattern: "**/dependency-check-report.xml"
                )
            }
        }

        stage ("Build") {
            steps {
                withCredentials([
                    file(credentialsId: 'mind-vault-root-env', variable: 'ROOT_ENV'),
                    file(credentialsId: 'mind-vault-backend-env', variable: 'BACKEND_ENV')
                ]) {
                    sh '''
                        rm -f .env backend/.env
                        cp "$ROOT_ENV" .env
                        cp "$BACKEND_ENV" backend/.env
                        docker compose build
                    '''
                }
            }
        }
        
        stage ("Push on Docker Hub") {
            steps {
                withCredentials ([
                    usernamePassword(credentialsId: 'dockerHubCreds', usernameVariable: 'USERNAME', passwordVariable: 'PASS')
                ]) {
                    sh "docker login -u ${USERNAME} -p ${PASS}"
                    sh "docker tag mindvaultcicd-mindvault-frontend ${USERNAME}/mindvaultcicd-mindvault-frontend:latest"
                    sh "docker tag mindvaultcicd-mindvault-backend ${USERNAME}/mindvaultcicd-mindvault-backend:latest"
                    sh "docker push ${USERNAME}/mindvaultcicd-mindvault-backend:latest"
                    sh "docker push ${USERNAME}/mindvaultcicd-mindvault-frontend:latest"
                }
            }
        }
        
        stage ("Deploy") {
            steps {
                sh "docker compose up -d"
            }
        }
    }
    post {
        always {
            sh 'rm -f .env backend/.env'
            sh 'docker logout || true'
            sh 'docker image prune -f'
            sh 'npm cache clean --force || true'
            sh 'bun pm cache rm || true'
            sh 'rm -rf ~/.cache/trivy || true'
        }
    }
}