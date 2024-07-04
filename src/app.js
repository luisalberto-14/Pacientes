document.addEventListener('DOMContentLoaded', ()=>{
	addEvents();
	// id();
	cargarDatosLocalStorage();
})

// Swal.fire({
// 	title: 'Error!',
// 	text: 'Do you want to continue',
// 	icon: 'error',
// 	confirmButtonText: 'Cool'
//   })

/* Variables */
//foto o imagen de perfil
const subirImagen=document.querySelector('#img');
const imagen=document.querySelector('.img-paciente');

//formulario
const nombre=document.querySelector('#nombre');
const apellido=document.querySelector('#apellido');
const email=document.querySelector('#email');
const telefono=document.querySelector('#telefono');
const fecha=document.querySelector('#fecha');
const hora=document.querySelector('#hora');
const sintoma=document.querySelector('#sintoma');
const fieltset=document.querySelector('fieldset');
const form=document.querySelector('.formulario');
const informacion=document.querySelector('#contenedor-informacion');
const h2Informacion=document.querySelector('.titulo-contenido');
const botonFormulario=document.querySelector('.button');
let datosArray=[];
let pacienteActual={};
let imagenDefault='./imagen.png';

//events
function addEvents(){
	subirImagen.addEventListener("change",imagenSubida);

	form.addEventListener('submit',validarFormu);

	
}

function cargarDatosLocalStorage() {
    const pacientesGuardados = localStorage.getItem("pacientes") || [];
    if (pacientesGuardados) {
        datosArray = JSON.parse(pacientesGuardados);
        agregarDatosHtml(datosArray);
    }
}

function imagenSubida(e){
	let imagenSubir=e.target.files[0]; //nos da el nombre y el tamaño de la imagen
	// console.log(imagenSubir)4
	if(imagenSubir){
		if(imagenSubir['type']!=='image/jpeg' && imagenSubir['type']!=='image/png'){
			mensaje("este archivo no es una imagen o la imagen no esta en formato png o jpg",true);
			return;
		}
		const reader=new FileReader();
		reader.readAsDataURL(imagenSubir);
		reader.onload=function(e){
			// console.log(e.target.result)
			// console.log(imagen.src)
			imagen.src=e.target.result;
			imagen.classList.add("imagen-nueva")
		}
	}else{
		imagen.src=imagenDefault;
	}
}

function id(){
	const ran=Math.random().toString(36).substring(2);
	const dat=Date.now();
	return ran+dat
}
//console.log(imagen.files)
//funciones
function validarFormu(e){
	e.preventDefault();
	//console.log(subirImagen.files)
	const elementosFormulario=[...form.elements] //mete en el array los campos del formulario para recorrerlos [fieldset, input#nombre, input#apellido, input#email, input#telefono, input#fecha, input#hora, textarea#sintoma, input.button]
	const emailReg= /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const telefonoReg=/^[0-9]{10}$/;
	const alertaExiste=document.querySelector('.alerta-error');
	const alertaExito=document.querySelector('.contenedor-alerta');
	//console.log(alertaExito)
	const imagenSubir=subirImagen.files[0];
	if([nombre.value.trim(),apellido.value.trim(),email.value.trim(),telefono.value.trim(),fecha.value.trim(),hora.value.trim(),sintoma.value.trim()].includes("") || (!imagenSubir && !pacienteActual.id)){
		//if ([nombre.value.trim(), apellido.value.trim(), email.value.trim(), telefono.value.trim(), fecha.value.trim(), hora.value.trim(), sintoma.value.trim()].some(value => value === "") some se usa para verificar si algún campo está vacío. Si al menos uno está vacío, muestra un mensaje de error; de lo contrario, indica que el formulario está listo para enviar.
		return mensaje('los campos estan vacios',true);
	}
	if (!emailReg.test(email.value)) {
		return mensaje('El email no es valido',true);
	}

	if(!telefonoReg.test(telefono.value)){
		return mensaje('El telefono no es un numero o no contiene 10 digitos',true);
	}

	// const imagenSubir=imagen.files;
	
	// let imagenPrev=e.target.files[0];
	// if(imagenPrev){
	// 	return mensaje("No colocaste ninguna imagen",true);
	// }

	if (imagenSubir && (imagenSubir['type'] !== 'image/jpeg' && imagenSubir['type'] !== 'image/png')) {
		return mensaje('Este archivo no es una imagen o la imagen no está en formato png o jpg', true);
	}

	alertaExiste?.remove(); //aqui se elimino y se creo otro

	mensaje('Se registro con exito',false);
	imagen.src=imagenDefault;
	// const elementosFormulario=[...form.elements]
	// console.log(elementosFormulario)
	const objPaciente={}

	elementosFormulario.forEach(elemento=>{
		//console.log(elemento.name)
		if (elemento.name) { //solo los elementos que tienen name los va a traer porque toma el boton y fieldset
			objPaciente[elemento.name]=elemento.value; //objPaciente[nombre]=Luis, objPaciente[apellido]=Lozano
			//{
  /*  "nombre": "Luis",
    "apellido": "Lozano",
    "email": "luisrockeando123@gmail.com",
    "telefono": "5534797749",
    "fecha": "2024-05-16",
    "hora": "15:06",
    "sintoma": "sadfsdfdsafsdaf"
}*/
		}
	})
	//console.log(objPaciente)

	//console.log(pacienteActual); //poder utilizarlo aqui para poder ver si dato.id existe y si no pues agrege en objeto paciente

	if (pacienteActual.id) {
		 objPaciente.id=pacienteActual.id;
		 datosArray=datosArray.map(pacientesActualizados=>pacientesActualizados.id === pacienteActual.id ? objPaciente : pacientesActualizados);
		        // const indice = datosArray.findIndex(item => item.id === pacienteActual.id);
				// if (indice !== -1) {
				// 	datosArray[indice] = { ...objPaciente, id: pacienteActual.id, imagen: pacienteActual.imagen };
				// } else {
				// 	return mensaje('No se encontró el paciente a editar', true);
				// }
		} else {
			objPaciente.id = id();
			objPaciente.imagen = pacienteActual.imagen || imagenDefault;
			datosArray = [...datosArray, objPaciente];
		}


    if (imagenSubir) {
        const reader = new FileReader();
        reader.readAsDataURL(imagenSubir);
        reader.onload = function(e){
            objPaciente.imagen = e.target.result;
            agregarDatosHtml(datosArray);
            // mensaje('Se registró con éxito', false);
        }
    } else {
		objPaciente.imagen = pacienteActual.imagen || imagenDefault; //para que no pida editar la imagen si no hay imagen
       agregarDatosHtml(datosArray);
        // mensaje('Se registró con éxito', false);
    }


	//console.log(objPaciente)
	

	form.reset();
	//console.log(datosArray)
	botonFormulario.value="Agregar Paciente";
	agregarDatosHtml(datosArray)
	pacienteActual = {}; // Resetear pacienteActual después de la operación para que puedas agregar otro paciente
	
}

function agregarDatosHtml(datos){
	 //console.log(datos)
	 limpiarHTML();
	datos.forEach(dato=>{
		const {nombre,apellido,imagen, email, telefono, fecha, hora, sintoma,id}=dato;
		//console.log(id)
		const div=document.createElement('DIV');
		div.classList.add('contenedor-paciente')
		const ol=document.createElement('OL');
		ol.innerHTML=
		`
		<li><p> <span class="description-nombre">${nombre+ " " +apellido}</span></p></li> 
		<div class="div-imagen"><li><img src="${imagen}" alt="imagen paciente" width="100" class="imagen-informacion"></li></div>
		<li>Email: <span class="description">${email}</span></li>
		<li>Telefono: <span class="description">${telefono}</span></li>
		<li>Fecha: <span class="description">${fecha}</span></li>
		<li>Hora: <span class="description">${hora}</span></li>
		<li>Sintoma: <span class="description">${sintoma}</span></li>
		<div class="div-botones_editar">
			<button class="button editar" id="editar-${id}" >Editar <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" class="icon-editar" viewBox="0 0 24 24" style="fill: rgba(255, 255, 255, 1);transform: ;msFilter:;"><path d="m16 2.012 3 3L16.713 7.3l-3-3zM4 14v3h3l8.299-8.287-3-3zm0 6h16v2H4z"></path></svg></button>
			<button class="button eliminar" onclick=eliminar('${id}')>Eliminar<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" style="fill: rgba(255, 255, 255, 1);transform: ;msFilter:;"><path d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H6zm4 12H8v-9h2v9zm6 0h-2v-9h2v9zm.618-15L15 2H9L7.382 4H3v2h18V4z"></path></svg></button>
		</div>
		`;
		div.appendChild(ol);
		informacion.appendChild(div);

		const editarButton = document.getElementById(`editar-${id}`);
		editarButton.addEventListener("click",()=>editar(dato));
        // editarButton.addEventListener('click', function() {
        //     editar(dato); // Llamar a la función editar y pasar el dato correspondiente
        // });
	//console.log(dato)

	})

	localStorage.setItem("pacientes",JSON.stringify(datosArray));
}

function editar(dato){ //recuerda que en el onclick agregamos comillas para que lo reconozca como un string
	// const datoObjeto=JSON.parse(dato);
	pacienteActual = { ...dato };
	nombre.value = pacienteActual.nombre;
	apellido.value = pacienteActual.apellido;
	email.value = pacienteActual.email;
	telefono.value = pacienteActual.telefono;
	fecha.value = pacienteActual.fecha;
	hora.value = pacienteActual.hora;
	sintoma.value = pacienteActual.sintoma;
	imagen.src = pacienteActual.imagen || imagenDefault;
	imagen.classList.add("imagen-nueva");
	botonFormulario.value = 'Editar Paciente';

}

function eliminar(id){
	console.log("eliminando",id);
	Swal.fire({
		title:"Advertencia",
		html:"Desea eliminar este paciente",
		icon:"warning",
		showCancelButton:true,
		confirmButtonColor:"rgba(30, 144, 255, 1)",
		confirmButtonText:"Aceptar",
		cancelButtonText:"Cancelar",
		width:"500px",
		//height:"500px",
		customClass:{
			popup:'custom-popup',
			title:'custom-title',
			confirmButton:'custom-button',
			content: 'custom-content'
		},
	  }).then(response=>{
		if(response.isConfirmed){
		  //eliminarPaciente(id); //si dices aceptar entonces hace esta funcion
		  datosArray=datosArray.filter(item=>item.id !== id); //esto se coloca para remplazar todo el array y tenerlo listo para eliminar es mejor forma para que funcione
		  agregarDatosHtml(datosArray);
		  pacienteActual = {};
		  Swal.fire("Exito","Se elimino el archivo con exito","success")
		}
	  })


}

function mensaje(string,dato=undefined){

	const alertaExiste=document.querySelector('.contenedor-alerta');

	alertaExiste?.remove();

	const alerta=document.createElement('DIV');
	alerta.textContent=string;
	alerta.classList.add('contenedor-alerta');

	if (dato) {
		alerta.classList.add('alerta-error');
	}else{
		alerta.classList.add('alerta-exito')
	}

	fieltset.appendChild(alerta);

	setTimeout(()=>{
		alerta.remove();
	},5000);
}


function limpiarHTML(){
	while(informacion.firstChild){
		informacion.removeChild(informacion.firstChild)
	}
}






