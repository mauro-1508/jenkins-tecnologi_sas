# Taller Práctico: Jenkins con Docker

## Tabla de Contenidos

1. [Instalar Docker](#1-instalar-docker)
2. [Crear Contenedor Jenkins](#2-crear-contenedor-jenkins)
3. [Acceder a Jenkins](#3-acceder-a-jenkins)
4. [Configuración Inicial](#4-configuración-inicial)
5. [Instalar Plugins Necesarios](#5-instalar-plugins-necesarios)
6. [Verificar Java y Maven dentro de Jenkins](#6-verificar-java-y-maven-dentro-de-jenkins)
7. [Configurar Maven en Jenkins](#7-configurar-maven-en-jenkins)
8. [Crear y Ejecutar un Pipeline](#8-crear-y-ejecutar-un-pipeline)
9. [Notificaciones por Correo Electrónico (Opcional)](#9-notificaciones-por-correo-electrónico-opcional)
10. [Configurar Webhooks con GitHub](#10-configurar-webhooks-con-github)

---

## 1. Instalar Docker

Antes de comenzar, asegúrate de tener **Docker** instalado en tu sistema. Puedes descargarlo desde [https://www.docker.com](https://www.docker.com).

---

## 2. Crear Contenedor Jenkins

### Crear volumen persistente

El volumen garantiza que los datos de Jenkins no se pierdan al reiniciar el contenedor:

```bash
docker volume create jenkins_home
```

### Ejecutar Jenkins

**Linux:**

```bash
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts
```

**Windows:**

```cmd
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home -v //var/run/docker.sock:/var/run/docker.sock jenkins/jenkins:lts
```

### Verificar que el contenedor está en ejecución

```bash
docker ps
```

---

## 3. Acceder a Jenkins

Con el contenedor corriendo, abre tu navegador y dirígete a:

```
http://localhost:8080/
```
![alt text](image-1.png)
Contenedor Jenkins ejecutándose
---

## 4. Configuración Inicial

### Obtener la contraseña de administrador

Al ingresar por primera vez, Jenkins solicita una contraseña inicial. Ejecútala con:

```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

![!Pantalla de desbloqueo de Jenkins](image-3.png)


### Bienvenida a Jenkins — Instalar plugins

Se mostrará la pantalla de bienvenida. Selecciona **Install suggested plugins** para instalar los plugins recomendados por la comunidad.

![Bienvenida a Jenkins](image-2.png)



## 5. Instalar Plugins Necesarios

Navega a **Manage Jenkins → Plugins → Available plugins** e instala los siguientes:

- ✅ **Git**
- ✅ **GitHub Integration**
- ✅ **Pipeline**
- ✅ **Maven Integration**
- ✅ **Mail** (Email Extension)


Espera a que todos los plugins se descarguen e instalen correctamente.

![Progreso de instalación de plugins](image-4.png)

## 7. Crear y Ejecutar un Pipeline

### 1. Crear un nuevo Job

Desde la pantalla principal, haz clic en **New Item**, asigna el nombre `verificacion-git`, selecciona **Pipeline** y haz clic en **OK**.

### 2. Configurar el Pipeline

Desplázate hasta la sección **Pipeline**. En el campo **Definition**, selecciona **Pipeline script**.

### 3. Script del Pipeline

Pega el siguiente script en el área de texto:

```groovy
pipeline {
    agent any
    stages {
        stage('Clonar repositorio') {
            steps {
                git branch: 'dev',
                    url: 'https://github.com/cjsarasty456/practica-jenkins.git'
            }
        }
        stage('Compilar') {
            steps {
                sh 'mvn clean compile'
            }
        }
        stage('Pruebas') {
            steps {
                sh 'mvn test'
            }
        }
    }
}
```

### 4. Guardar

Haz clic en **Save**.

### 5. Ejecutar la tarea

Haz clic en **Build Now** para lanzar el pipeline.

[Job verificacion-git creado]![alt text](image-5.png)
### 6. Revisar la salida

Haz clic en el número de build y selecciona **Console Output** para ver el detalle de ejecución.
![alt text](image-6.png)

---

## 9. Notificaciones por Correo Electrónico (Opcional)

### Configurar credenciales de Gmail

Para enviar correos desde Jenkins usando Gmail necesitas una **contraseña de aplicación**:

1. Ve a [myaccount.google.com](https://myaccount.google.com)
2. Busca **Contraseñas de aplicación** en el apartado de Seguridad
3. Crea una nueva contraseña con el nombre `Jenkins`
4. Copia la contraseña de 16 caracteres generada


Configura el servidor SMTP en **Manage Jenkins → System → Notificación por correo electrónico**:

| Campo | Valor |
|-------|-------|
| Servidor SMTP | `smtp.gmail.com` |
| Puerto SMTP | `465` |
| Usuario | `tu_correo@gmail.com` |
| Contraseña | *(contraseña de aplicación)* |
| Seguridad | SSL |

Puedes probar la configuración activando **Probar configuración enviando un correo de prueba**.

![alt text](image-7.png)

Si todo está correcto, recibirás un email de prueba en tu bandeja.

![alt text](image-8.png)

### Agregar credenciales en Jenkins

Ve a **Manage Jenkins → System → Extended E-mail Notification → Credentials → Add**.

Selecciona **Username with password**, ingresa tu correo y la contraseña de aplicación, y haz clic en **Create**.
![alt text](image-9.png)
### Actualizar el Pipeline con notificaciones

Reemplaza el script anterior por el siguiente, que incluye notificación por email al finalizar:

```groovy
pipeline {
    agent any
    stages {
        stage('Clonar repositorio') {
            steps {
                git branch: 'dev',
                    url: 'https://github.com/cjsarasty456/practica-jenkins.git'
            }
        }
        stage('Compilar') {
            steps {
                sh 'mvn clean compile'
            }
        }
        stage('Pruebas') {
            steps {
                sh 'mvn test'
            }
        }
    }
    post {
        success {
            mail to: 'tu_correo@gmail.com',
                 subject: 'Pipeline EXITOSO',
                 body: 'La compilación y pruebas finalizaron correctamente.'
        }
        failure {
            mail to: 'tu_correo@gmail.com',
                 subject: 'Pipeline FALLÓ',
                 body: 'La compilación o pruebas presentaron errores.'
        }
    }
}
```

Ejecuta el pipeline con **Build Now**. Si es exitoso, recibirás el correo de notificación.

![alt text](image-10.png)

---

## 10. Configurar Webhooks con GitHub

Los webhooks permiten que Jenkins ejecute el pipeline automáticamente cada vez que se haga un `git push`.
## 11.configurar Webhooks con discord
integrar discord con jenkins para recibir notificaciones de los pipelines en un canal de discord, para esto se debe crear un webhook en el canal de discord y luego configurar jenkins para enviar las notificaciones a ese webhook.
neceitamos este plugin para esto: https://plugins.jenkins.io/discord/
![alt text](image-11.png)
Luego de instalar el plugin, debemos configurar las credenciales en jenkins para el webhook de discord, para esto vamos a "Manage Jenkins" -> "Manage Credentials" -> "Add Credentials" y seleccionamos "Secret text" 

![alt text](image-13.png)

pegamos el webhook de discord, luego le damos un id a esa credencial para poder usarla en el pipeline.
![alt text](image-12.png)
### Crear un túnel público con localhost.run

Para que GitHub pueda comunicarse con tu Jenkins local, necesitas exponer el puerto 8080 mediante un túnel SSH.

#### Windows

Verifica que OpenSSH esté instalado abriendo CMD y ejecutando:

```cmd
ssh
```

Si no aparece la ayuda de SSH, instálalo desde PowerShell como administrador:

```powershell
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
```

Luego crea el túnel:

```cmd
ssh -R 80:localhost:8080 nokey@localhost.run
```

#### Ubuntu / Linux

```bash
sudo apt update
sudo apt install openssh-client -y
ssh -R 80:localhost:8080 nokey@localhost.run
```

Para ejecutarlo en segundo plano:

```bash
ssh -f -N -R 80:localhost:8080 nokey@localhost.run
```

El resultado será una URL pública similar a:

```
https://abcde.lhr.life
```

> ⚠️ **Importante:** mantén el terminal abierto mientras uses el túnel.

### Configurar el Job para usar SCM

En el Job `verificacion-git`, ve a **Configurar** y actualiza la sección **Pipeline**:

| Campo | Valor |
|-------|-------|
| Definition | Pipeline script from SCM |
| SCM | Git |
| Repository URL | `https://github.com/usuario/repositorio.git` |
| Branch | `*/dev` |
| Credentials | *(selecciona las creadas)* |

### Activar el disparador webhook

En la sección **Build Triggers**, activa:

```
✅ GitHub hook trigger for GITScm polling
```

### Configurar el webhook en GitHub

1. Entra al repositorio en GitHub
2. Ve a **Settings → Webhooks → Add webhook**
3. Completa los campos:

| Campo | Valor |
|-------|-------|
| Payload URL | `https://abc123.lhr.life/github-webhook/` |
| Content Type | `application/json` |
| SSL verification | Disable (solo para pruebas) |
| Events | Just the push event |

> ⚠️ La URL debe terminar obligatoriamente en `/github-webhook/`

4. Haz clic en **Add webhook**. GitHub enviará una prueba automática y deberías ver un **200 OK**.

asi tendria que quedar el jenkinsfile para que envie las notificaciones a discord y correo electronico.

```groovy
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
```

### Probar la ejecución automática

Realiza un cambio en tu repositorio y haz push:

```bash
git add .
git commit -m "prueba webhook"
git push origin dev
```

Jenkins ejecutará el pipeline automáticamente. En el historial de builds verás:

```
Started by GitHub push
```

---

## Resumen del Flujo

```
Código en GitHub
      │
      │ git push
      ▼
  GitHub Webhook
      │
      │ HTTP POST → /github-webhook/
      ▼
  Jenkins (via túnel lhr.life)
      │
      ├─ Stage: Clonar repositorio
      ├─ Stage: Compilar (mvn clean compile)
      └─ Stage: Pruebas (mvn test)
                │
                ▼
         Notificación por Email y a discourd
         (éxito o fallo)
```

---

*Taller elaborado con Jenkins 2.555.2 · Docker · Maven 3.9.9 · Java 21*
