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

        CONTAINER_IMAGE="registry.gitlab.com/evry/${appName}"
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
                withCredentials([usernamePassword(credentialsId: 'devopsautomate', passwordVariable: 'gitlabPassword', usernameVariable: 'gitlabUsername')]) { echo "Build Image"
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

        stages('Move config to build directory') {
            paralell {
                stage('Move develop config to build directory') {
                    when {
                        anyOf {
                            branch 'feat/warp-jenkins-config';
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
                    branch 'feat/warp-jenkins-config';
                    branch 'feat/docker';
                    branch 'feature/pipeline';
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
    }
    post {
            always {
            sh '''
               docker image rm -f ${CONTAINER_IMAGE}:${branchName}
               docker image rm -f ${dockerImage}
            '''
                deleteDir()
            }
    }
}
