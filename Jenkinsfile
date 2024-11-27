pipeline {
    agent any
    environment {
        DOCKER_USER = 'fernanbeast'  // Tu nombre de usuario de Docker Hub
        DOCKER_BUILDX = 'docker-buildx-builder'  // Nombre del builder de Buildx
        NODE_ENV = 'production'  // Establece el entorno de Node.js
    }
    stages {
        stage('Clonar Repositorio') {
            steps {
                // Clonando el repositorio de GitHub, usando credenciales si es privado
                git branch: 'main', url: 'https://github.com/FernanBeast/Buildx3.git', credentialsId: 'github-credentials-id'
            }
        }

        stage('Configurar Docker Buildx') {
            steps {
                script {
                    // Crear un builder si no existe, y configurarlo para usarlo
                    sh '''
                        # Verifica si el builder ya está creado, si no lo crea
                        docker buildx ls | grep -q ${DOCKER_BUILDX} || docker buildx create --name ${DOCKER_BUILDX} --use
                    '''
                }
            }
        }

        stage('Construir Imagen Docker usando Buildx') {
            steps {
                script {
                    // Construir la imagen Docker usando Buildx
                    sh '''
                        docker buildx build --platform linux/amd64,linux/arm64 -t ${DOCKER_USER}/mi-imagen:latest .
                    '''
                }
            }
        }

        stage('Ejecutar Pruebas Unitarias') {
            steps {
                script {
                    // Ejecutar pruebas unitarias (Ejemplo: con npm test o un script específico)
                    sh 'npm install'  // Instalar dependencias de Node.js
                    sh 'npm run test -- --reporter mocha-junit-reporter --reporter-options mochaFile=tests/test-results.xml'
                    // Guardar los resultados de las pruebas en un archivo XML (o JSON si lo prefieres)
                }
            }
        }

        stage('Subir Imagen a Docker Hub') {
            steps {
                script {
                    // Subir la imagen a Docker Hub usando Buildx
                    sh '''
                        docker buildx build --push --platform linux/amd64,linux/arm64 -t ${DOCKER_USER}/mi-imagen:latest .
                    '''
                }
            }
        }

        stage('Iniciar Servidor Node.js') {
            steps {
                script {
                    // Instalar las dependencias necesarias para el servidor Node.js y arrancar el servidor
                    sh 'npm install'  // Instalar dependencias del servidor Node.js
                    sh 'nohup node server.js &'
                    // El servidor Node.js correrá en el fondo, proporcionando los resultados de las pruebas en http://localhost:3000
                    echo 'Servidor Node.js iniciado. Acceda a http://localhost:3000 para ver los resultados.'
                }
            }
        }
    }

    post {
        always {
            // Limpiar el espacio de trabajo al final del pipeline
            cleanWs()
        }
    }
}
