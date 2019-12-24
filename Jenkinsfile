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

        stage('Get config from app-configs') {
            steps {
                echo "Clone app-configs"
                git branch: 'master',
                credentialsId: 'devopsautomate',
                url: 'https://gitlab.com/evry/evry-app-configs.git'
                sh '''
                    ls -l
                    cd ..
                    ls -l
                    pwd
                '''
            }
        }

        stage('Build Image Test') {
            when {
                anyOf {
                    branch 'feat/warp-jenkins-config';
                    branch 'develop';
                }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'devopsautomate', passwordVariable: 'gitlabPassword', usernameVariable: 'gitlabUsername')]) {
                    sh '''
                        ls -l
                        echo "Build Image"
                        docker login -u ${gitlabUsername} -p ${gitlabPassword} registry.gitlab.com
                        cp evry-app-configs/develop/${appName}/configuration/app.properties .env
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

        stage('Build and Push to Registry') {
            when {
                anyOf {
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
