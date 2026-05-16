pipeline {
    agent any

    stages {

        stage('Clonar') {
            steps {
                echo 'Clonando repositorio...'
            }
        }

        stage('Build') {
            steps {
                echo 'Construyendo proyecto...'
            }
        }

        stage('Pruebas') {
            steps {
                echo 'Ejecutando pruebas...'
            }
        }

        stage('Calidad') {
            steps {
                echo 'Validando calidad del codigo...'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Desplegando aplicación...'
            }
        }
    }

    post {

        success {
            echo 'Pipeline exitoso'
        }

        failure {
            echo 'Pipeline falló'
        }

        unstable {
            echo 'Pipeline inestable'
        }
    }
}