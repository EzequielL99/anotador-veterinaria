// Variables
const inputMascota = document.querySelector('#mascota');
const inputPropietario = document.querySelector('#propietario');
const inputTelefono = document.querySelector('#telefono');
const inputFecha = document.querySelector('#fecha');
const inputHora = document.querySelector('#hora');
const inputSintomas = document.querySelector('#sintomas');

const formulario = document.querySelector('#nueva-cita');

const contenedorCitas = document.querySelector('#citas');

let editando = false;

// Eventos
registrarEventos();

function registrarEventos() {
    inputMascota.addEventListener('change', datosCita);
    inputPropietario.addEventListener('change', datosCita);
    inputTelefono.addEventListener('change', datosCita);
    inputFecha.addEventListener('change', datosCita);
    inputHora.addEventListener('change', datosCita);
    inputSintomas.addEventListener('change', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}

// Informacion de la cita
const objCita = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: '',
}

// Classes

class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
    }

    editarCita(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    }
}

class UI {
    imprimirAlerta(mensaje, tipo) {
        // Crear el div
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        // Agregar clase en base al tipo de error
        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        // Quitar alerta despues de 3seg.
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    imprimirCitas({
        citas
    }) {
        this.limpiarHTML();

        citas.forEach(cita => {
            const {
                mascota,
                propietario,
                telefono,
                fecha,
                hora,
                sintomas,
                id
            } = cita;

            const divCita = document.createElement('DIV');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            // Scripting de los elementos de la cita
            const pMascota = document.createElement('h2');
            pMascota.classList.add('card-title', 'font-weight-bolder');
            pMascota.textContent = mascota;

            const pPropietario = document.createElement('p');
            pPropietario.innerHTML = `
                <span class="font-weight-bolder">Propietario: </span> ${propietario}
            `;

            const pTelefono = document.createElement('p');
            pTelefono.innerHTML = `
                <span class="font-weight-bolder">Telefono: </span> ${telefono}
            `;

            const pFecha = document.createElement('p');
            pFecha.innerHTML = `
                <span class="font-weight-bolder">Fecha: </span> ${fecha}
            `;

            const pHora = document.createElement('p');
            pHora.innerHTML = `
                <span class="font-weight-bolder">Hora: </span> ${hora}
            `;

            const pSintomas = document.createElement('p');
            pSintomas.innerHTML = `
                <span class="font-weight-bolder">Sintomas: </span> ${sintomas}
            `;

            // Boton para eliminar esta cita
            const btnEliminar = document.createElement('BUTTON');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.onclick = () => {
                eliminarCita(id);
            };

            // Boton para editar
            const btnEditar = document.createElement('BUTTON');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.textContent = 'Editar';
            btnEditar.onclick = () => cargarEdicion(cita);

            // Agregar los parrafos al divCita
            divCita.appendChild(pMascota);
            divCita.appendChild(pPropietario);
            divCita.appendChild(pTelefono);
            divCita.appendChild(pFecha);
            divCita.appendChild(pHora);
            divCita.appendChild(pSintomas);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            // Agregar las citas al HTML
            contenedorCitas.appendChild(divCita);
        });
    }

    limpiarHTML() {
        while (contenedorCitas.firstChild !== null) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

const ui = new UI();
const administrarCitas = new Citas();


// Funciones
function datosCita(e) {
    objCita[e.target.name] = e.target.value;
}

// Valida y agrega una nueva cita a la clase de citas
function nuevaCita(e) {
    e.preventDefault();

    // Extraer la informacion del objeto de cita
    const {
        mascota,
        propietario,
        telefono,
        fecha,
        hora,
        sintomas
    } = objCita;

    // validar
    if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');

        return;
    }

    if (editando) {
        console.log('Modo Edicion');
        ui.imprimirAlerta('Editado correctamente');

        // Pasar el objeto de la cita a edicion
        administrarCitas.editarCita({...objCita});

        // regresar el texto del boton a su estado original
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

        // Quitar modo edicion
        editando = false;
    } else {
        console.log('Modo Nueva Cita');
        // generar ID unico
        objCita.id = Date.now();

        // Creando nueva cita
        administrarCitas.agregarCita({
            ...objCita
        });

        // Mensaje agregado
        ui.imprimirAlerta('Se agrego correctamente');
    }

    // Reiniciar Objeto
    reiniciarObjeto();

    // Reinicia formulario
    formulario.reset();

    // Mostrar en el HTML las citas
    ui.imprimirCitas(administrarCitas);
}

function reiniciarObjeto() {
    for (const key in objCita) {
        if (Object.hasOwnProperty.call(objCita, key)) {
            objCita[key] = '';
        }
    }
}

function eliminarCita(id) {
    // Eliminar la cita
    administrarCitas.eliminarCita(id);

    // Mostrar mensaje
    ui.imprimirAlerta('Se ha eliminado la cita');

    // Refrescar Citas
    ui.imprimirCitas(administrarCitas);
}

function cargarEdicion(cita) {
    const {
        mascota,
        propietario,
        telefono,
        fecha,
        hora,
        sintomas,
        id
    } = cita;

    // Llenar los inputs
    inputMascota.value = mascota;
    inputPropietario.value = propietario;
    inputTelefono.value = telefono;
    inputFecha.value = fecha;
    inputHora.value = hora;
    inputSintomas.value = sintomas;

    // Llenar el objeto
    objCita.mascota = mascota;
    objCita.propietario = propietario;
    objCita.telefono = telefono;
    objCita.fecha = fecha;
    objCita.hora = hora;
    objCita.sintomas = sintomas;
    objCita.id = id;

    // Cambiar el texto del boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;
}