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

            emailext(
                subject: "✅ Pipeline Exitoso - ${env.JOB_NAME}",
                body: """
                El pipeline finalizó correctamente.

                Proyecto: ${env.JOB_NAME}
                Build: ${env.BUILD_NUMBER}

                Revisa Jenkins para más detalles.
                """,
                to: "suazasolorzano@gmail.com"
            )
        }

        failure {

            echo 'Pipeline falló'

            emailext(
                subject: "❌ Pipeline Falló - ${env.JOB_NAME}",
                body: """
                El pipeline falló.

                Proyecto: ${env.JOB_NAME}
                Build: ${env.BUILD_NUMBER}

                Revisa Jenkins.
                """,
                to: "suazasolorzano@gmail.com"
            )
        }

        unstable {

            echo 'Pipeline inestable'

            emailext(
                subject: "⚠️ Pipeline Inestable - ${env.JOB_NAME}",
                body: "El pipeline quedó inestable.",
                to: "suazasolorzano@gmail.com"
            )
        }
    }
}