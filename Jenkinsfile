pipeline {
    agent any
    environment {
     DISCORD_WEBHOOK = credentials('discord-webhook')
    }

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
                to: "suazasolorzanoj@gmail.com"
            )
             discordSend(
            description: "✅ Build exitoso",
            footer: "tecnologi-sas CI/CD",
            link: env.BUILD_URL,
            result: currentBuild.currentResult,
            title: "Build SUCCESS",
            webhookURL: env.DISCORD_WEBHOOK
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
                to: "suazasolorzanoj@gmail.com"
            )
            discordSend(
            description: "❌ Build falló",
            footer: "tecnologi-sas CI/CD",
            link: env.BUILD_URL,
            result: currentBuild.currentResult,
            title: "Build FAILURE",
            webhookURL: env.DISCORD_WEBHOOK
        )
        }

        unstable {

            echo 'Pipeline inestable'

            emailext(
                subject: "⚠️ Pipeline Inestable - ${env.JOB_NAME}",
                body: "El pipeline quedó inestable.",
                to: "suazasolorzanoj@gmail.com"
            )
        }
    }
}