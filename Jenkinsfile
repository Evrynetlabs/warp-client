pipeline {
    agent { label "slave" }
    environment{
        branchName = sh(
            script: "echo ${env.GIT_BRANCH} | sed -e 's|/|-|g'",
            returnStdout: true
        ).trim()
        dockerTag="${env.branchName}-${env.BUILD_NUMBER}"
        dockerImage="${env.CONTAINER_IMAGE}:${env.dockerTag}"
        appName="warp-client"
        githubUsername="evrynet-official"

        CONTAINER_IMAGE="registry.gitlab.com/evry/${appName}"
        status_failure="{\"state\": \"failure\",\"context\": \"continuous-integration/jenkins\", \"description\": \"Jenkins\", \"target_url\": \"${BUILD_URL}\"}"
        status_success="{\"state\": \"success\",\"context\": \"continuous-integration/jenkins\", \"description\": \"Jenkins\", \"target_url\": \"${BUILD_URL}\"}"

    }
    stages {
        stage ('Cleanup') {
            steps {
                dir('directoryToDelete') {
                    deleteDir()
                }
            }
        }

        stage('Build Image Test') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'devopsautomate', passwordVariable: 'gitlabPassword', usernameVariable: 'gitlabUsername')]) { 
                    echo "Build Image"
                    sh '''
                        docker login -u ${gitlabUsername} -p ${gitlabPassword} registry.gitlab.com
                        cp /var/lib/jenkins/evry/warp-js-deploykey docker/warp-deploykey
                        docker build --pull --target builder -t ${dockerImage} -f docker/Dockerfile .
                    '''
                }
            }
        }

        stage('Lint') {
            steps {
                sh '''
                    echo "Run lint -> ${dockerImage}"
                    docker run --rm ${dockerImage} sh -c "make lint"
                '''
            }
        }

        stage('Unit Test') {
            steps {
                sh '''
                    echo "Run lint -> ${dockerImage}"
                    docker run --rm ${dockerImage} sh -c "make test"
                '''
            }
        }

        stage('SonarQube Code Analysis') {
            steps {
                sh '''
                    echo "SonarQube Code Analysis"              
                '''
            }
        }

        stage('SonarQube Quality Gate') {
            steps {
                sh '''
                    echo "SonarQube Quality Gate"    
                '''
            }
        }

        stage('Get config from app-configs') {
            steps {
                dir('evry-app-configs') {
                    echo "Clone app-configs"
                    git branch: 'master',
                    credentialsId: 'devopsautomate',
                    url: 'https://gitlab.com/evry/evry-app-configs.git'
                }
            }
        }

        stage('Move config to build directory') {
            parallel {
                stage('Move develop config to build directory') {
                    when {
                        anyOf {
                            branch 'develop';
                        }
                    }
                    steps {
                        sh '''
                            cp evry-app-configs/develop/${appName}/configuration/app.properties .env
                        '''
                    }
                }
                stage('Move test config to build directory') {
                    when { branch 'release/*'; }
                    steps {
                        sh '''
                            cp evry-app-configs/test/${appName}/configuration/app.properties .env
                        '''
                    }
                }
                stage('Move staging config to build directory') {
                    when { branch 'master' }
                    steps {
                        sh '''
                            cp evry-app-configs/staging/${appName}/configuration/app.properties .env
                        '''
                    }
                }
            }
        }

        stage('Build and Push to Registry') {
            when {
                anyOf {
                    branch 'develop';
                    branch 'release/*';
                    branch 'master'
                }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'devopsautomate', passwordVariable: 'gitlabPassword', usernameVariable: 'gitlabUsername')]) {
                    sh '''
                        echo "Push to Registry"
                        docker login -u ${gitlabUsername} -p ${gitlabPassword} registry.gitlab.com
                        docker build --pull -t ${dockerImage} -f docker/Dockerfile .
                        docker push ${dockerImage}
                        docker tag ${dockerImage} ${CONTAINER_IMAGE}:${branchName}
                        docker push ${CONTAINER_IMAGE}:${branchName}
                    '''
                }
            }
        }
        stage('Trigger to Deployment job') {
            parallel {
                stage ('Deploy to Develop Environment') {
                    when {
                        branch 'develop'
                    }
                    steps {
                        build job: 'warp-client-deploy', parameters: [string(name: 'dockerVersion', value: env.dockerTag),string(name: 'environment', value: 'develop')]
                    }
                }
                stage ('Deploy to Test Environment') {
                    when {
                        branch 'release/*'
                    }
                    steps {
                        build job: 'warp-client-deploy', parameters: [string(name: 'dockerVersion', value: env.dockerTag),string(name: 'environment', value: 'test')]
                    }
                }
                stage ('Deploy to Staging Environment') {
                    when {
                        branch 'master'
                    }
                    steps {
                        build job: 'warp-client-deploy', parameters: [string(name: 'dockerVersion', value: env.dockerTag),string(name: 'environment', value: 'staging')]
                    }
                }
            }
        }
    }
    post {
        failure {
            withCredentials([string(credentialsId: 'evry-github-token-pipeline-status', variable: 'githubToken')]) {
                sh '''
                    curl \"https://api.github.com/repos/${githubUsername}/${appName}/statuses/${GIT_COMMIT}?access_token=${githubToken}\" \
                    -H \"Content-Type: application/json\" \
                    -X POST \
                    -d "${status_failure}"
                '''
                }
        }
        success {
            withCredentials([string(credentialsId: 'evry-github-token-pipeline-status', variable: 'githubToken')]) {
                sh '''
                    curl \"https://api.github.com/repos/${githubUsername}/${appName}/statuses/${GIT_COMMIT}?access_token=${githubToken}\" \
                    -H \"Content-Type: application/json\" \
                    -X POST \
                    -d "${status_success}"
                '''
                }
        }
        always {
            sh '''
               docker image rm -f ${CONTAINER_IMAGE}:${branchName}
               docker image rm -f ${dockerImage}
            '''
            deleteDir()
        }
    }
}
