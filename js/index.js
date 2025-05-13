
const turnosContainer = document.getElementById("turnosContainer");
const detalleContainer = document.getElementById("detalleContainer");
let indiceSeleccionado;

const clientElement = document.getElementById("client");
const emailElement = document.getElementById("email");
const reservationDateElement = document.getElementById("reservationDate");
const phoneElement = document.getElementById("phone");
const venueElement = document.getElementById("venue");
const comentarioElement = document.getElementById("comentario");
const marcarTerminadoElement = document.getElementById("finalizar");


function createTarjeta(turno,index){
  const nuevaTarjeta = document.createElement("div");
  nuevaTarjeta.classList = "tarjeta";
  nuevaTarjeta.innerHTML = `
    <h3>${turno.client}</h3>
    <p>${turno.venue}</p>
    <p>${turno.reservationDate}</p>
    <p>${turno.spend}</p>
  `
  nuevaTarjeta.addEventListener("click", ()=> actualizarDetalle(index))
  turnosContainer.appendChild(nuevaTarjeta);
}

function actualizarTarjetas(){
  turnosContainer.innerHTML = "";
  turnos.forEach((turno,i) => {
    createTarjeta(turno,i);
  })
}

function actualizarDetalle(index){
  if(indiceSeleccionado !== undefined) turnosContainer.children[indiceSeleccionado].classList.toggle("seleccionado",false);
  clientElement.innerText = turnos[index].client;
  emailElement.innerText = turnos[index].email;
  reservationDateElement.innerText = turnos[index].reservationDate;
  phoneElement.innerText = turnos[index].phone;
  venueElement.innerText = turnos[index].venue;
  detalleContainer.classList.toggle("escondido",false);
  indiceSeleccionado = index;
  turnosContainer.children[indiceSeleccionado].classList.toggle("seleccionado",true);
}

finalizar.addEventListener("click",()=> marcarTerminado(indiceSeleccionado))

async function marcarTerminado(i){
  const updateTurno = turnos[i];
  updateTurno.comentario = commentElementElement.value;
  const res = await editTurno(updateTurno.id,updateTurno);
  if(res.status === 200){
    turnos = turnos.filter(turno => turno.id !== updateTurno.id);
    indiceSeleccionado = 0;
    await actualizarTarjetas()
    detalleContainer.classList.toggle("escondido",true);
    commentElement.value="";
  }
}

