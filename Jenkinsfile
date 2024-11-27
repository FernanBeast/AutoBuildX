pipeline {
    agent any
    environment {
        DOCKER_USER = 'fernanbeast'
        DOCKER_BUILDX = 'docker-buildx-builder'
        NODE_ENV = 'production'
    }
    stages {
        stage('Clonar Repositorio') {
            steps {
                git branch: 'main', url: 'https://github.com/FernanBeast/Buildx3.git', credentialsId: 'github-credentials-id'
            }
        }

        stage('Configurar Docker Buildx') {
            steps {
                script {
                    sh '''
                        docker buildx ls | grep -q ${DOCKER_BUILDX} || docker buildx create --name ${DOCKER_BUILDX} --use
                    '''
                }
            }
        }

        stage('Construir Imagen Docker usando Buildx') {
            steps {
                script {
                    sh '''
                        docker buildx build --platform linux/amd64,linux/arm64 -t ${DOCKER_USER}/mi-imagen:latest .
                    '''
                }
            }
        }

        stage('Ejecutar Pruebas Unitarias') {
            steps {
                script {
                    sh 'npm install'
                    sh 'npm run test -- --reporter mocha-junit-reporter --reporter-options mochaFile=tests/test-results.xml'
                }
            }
        }

        stage('Subir Imagen a Docker Hub') {
            steps {
                script {
                    sh '''
                        docker buildx build --push --platform linux/amd64,linux/arm64 -t ${DOCKER_USER}/mi-imagen:latest .
                    '''
                }
            }
        }

        stage('Iniciar Servidor Node.js') {
            steps {
                script {
                    sh 'npm install'
                    sh 'nohup node server.js > server.log 2>&1 &'
                    sh 'sleep 5'
                    echo 'Servidor Node.js iniciado. Acceda a http://localhost:3000 para ver los resultados.'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}

