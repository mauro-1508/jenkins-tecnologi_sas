// ===============================
// TECHSOLUTIONS DASHBOARD SCRIPT
// ===============================

// FECHA AUTOMÁTICA

const fecha = new Date();

const opciones = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);

document.getElementById("fecha").innerHTML =
    "📅 " + fechaFormateada;


// ===============================
// MENSAJE DINÁMICO
// ===============================

const mensajes = [
    "Bienvenido nuevamente al sistema académico 🚀",
    "Hoy hay 12 clases programadas 📚",
    "Recuerda revisar los reportes del sistema 📊",
    "El rendimiento académico aumentó un 8% 📈",
    "TechSolutions S.A.S. funcionando correctamente ✅"
];

const mensajeRandom =
    mensajes[Math.floor(Math.random() * mensajes.length)];

document.getElementById("mensaje").innerHTML = mensajeRandom;


// ===============================
// CONTADOR ANIMADO
// ===============================

const counters = document.querySelectorAll('.number');

counters.forEach(counter => {

    counter.innerText = '0';

    const updateCounter = () => {

        const target = +counter.getAttribute('data-target');

        const c = +counter.innerText;

        const increment = target / 100;

        if(c < target){

            counter.innerText = `${Math.ceil(c + increment)}`;

            setTimeout(updateCounter, 20);

        }else{

            counter.innerText = target;

        }

    };

    updateCounter();

});


// ===============================
// TABLA DINÁMICA
// ===============================

const estudiantes = [

    {
        nombre: "Carlos Gómez",
        curso: "Programación Web",
        promedio: "4.7"
    },

    {
        nombre: "Laura Martínez",
        curso: "Base de Datos",
        promedio: "4.9"
    },

    {
        nombre: "Andrés López",
        curso: "Java POO",
        promedio: "4.3"
    },

    {
        nombre: "Valentina Ruiz",
        curso: "Diseño UX/UI",
        promedio: "4.8"
    }

];

const tabla = document.getElementById("tabla-estudiantes");

estudiantes.forEach(estudiante => {

    tabla.innerHTML += `

        <tr>

            <td>${estudiante.nombre}</td>

            <td>${estudiante.curso}</td>

            <td>${estudiante.promedio}</td>

        </tr>

    `;

});


// ===============================
// BARRA DE PROGRESO
// ===============================

let progreso = 0;

const barra = document.getElementById("barra");

const intervalo = setInterval(() => {

    progreso++;

    barra.style.width = progreso + "%";

    barra.innerHTML = progreso + "%";

    if(progreso >= 96){

        clearInterval(intervalo);

    }

}, 30);


// ===============================
// RELOJ DIGITAL
// ===============================

function actualizarHora(){

    const ahora = new Date();

    const hora = ahora.toLocaleTimeString();

    document.getElementById("reloj").innerHTML =
        "🕒 " + hora;

}

setInterval(actualizarHora, 1000);


// ===============================
// CAMBIO DE COLOR AUTOMÁTICO
// ===============================

const colores = [
    "#2563eb",
    "#7c3aed",
    "#0ea5e9",
    "#14b8a6",
    "#f59e0b"
];

let index = 0;

setInterval(() => {

    document.querySelector(".topbar").style.background =
        colores[index];

    index++;

    if(index >= colores.length){

        index = 0;

    }

}, 3000);