// Referencias a los elementos del DOM
const tablaBody = document.getElementById("tablaBody");
const filtroFecha = document.getElementById("filtroFecha");
const filtroVenue = document.getElementById("filtroVenue");
const filtroCategoria = document.getElementById("filtroCategoria");

// NUEVAS referencias para el rango de fechas
const rangoFechasContainer = document.getElementById("rangoFechasContainer");
const fechaInicioInput = document.getElementById("fechaInicio");
const fechaFinalInput = document.getElementById("fechaFinal");



function popularFiltros() {
  const venues = new Set();
  const categorias = new Set();

  turnos.slice(1).forEach(turno => {
    if (turno.venue) venues.add(turno.venue);
    if (turno.category) categorias.add(turno.category);
  });

  filtroVenue.innerHTML = '<option value="todos">Todos</option>';
  filtroCategoria.innerHTML = '<option value="todas">Todas</option>';
  
  venues.forEach(venue => {
    const option = document.createElement("option");
    option.value = venue;
    option.innerText = venue;
    filtroVenue.appendChild(option);
  });

  categorias.forEach(categoria => {
    const option = document.createElement("option");
    option.value = categoria;
    option.innerText = categoria;
    filtroCategoria.appendChild(option);
  });
}

/**
 * @param {Array} datosParaMostrar 
 */
function crearTabla(datosParaMostrar) {
  tablaBody.innerHTML = "";

  const datosSinCabecera = datosParaMostrar.slice(1);

  if (datosSinCabecera.length === 0) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");
    celda.colSpan = 5;
    celda.textContent = "No hay reservaciones que coincidan con los filtros seleccionados.";
    fila.appendChild(celda);
    tablaBody.appendChild(fila);
    return;
  }

  datosSinCabecera.forEach(turno => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${turno.client}</td>
      <td>${turno.email}</td>
      <td>${turno.reservationDate}</td>
      <td>${turno.venue}</td>
      <td>${turno.category || 'N/A'}</td> 
    `;
    tablaBody.appendChild(fila);
  });
}

/**
 * Filtra los turnos basado en los valores seleccionados en los dropdowns y renderiza la tabla.
 */
function aplicarFiltros() {
  let turnosFiltrados = [...turnos];

  // 1. Filtrar por Venue
  const venueSeleccionado = filtroVenue.value;
  if (venueSeleccionado !== "todos") {
    turnosFiltrados = turnosFiltrados.filter(turno => turno.venue === venueSeleccionado);
  }

  // 2. Filtrar por Categoría
  const categoriaSeleccionada = filtroCategoria.value;
  if (categoriaSeleccionada !== "todas") {
    turnosFiltrados = turnosFiltrados.filter(turno => turno.category === categoriaSeleccionada);
  }

  // 3. Filtrar por Fecha 
  const filtroTiempo = filtroFecha.value;
  const ahora = new Date();

  if (filtroTiempo === "semanal") {
    const primerDiaSemana = new Date(ahora);
    primerDiaSemana.setDate(ahora.getDate() - ahora.getDay());
    primerDiaSemana.setHours(0, 0, 0, 0);

    const ultimoDiaSemana = new Date(primerDiaSemana);
    ultimoDiaSemana.setDate(primerDiaSemana.getDate() + 6);
    ultimoDiaSemana.setHours(23, 59, 59, 999);

    turnosFiltrados = turnosFiltrados.filter(turno => {
      const fechaTurno = new Date(turno.reservationDate);
      return fechaTurno >= primerDiaSemana && fechaTurno <= ultimoDiaSemana;
    });
  } else if (filtroTiempo === "mensual") {
    const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const ultimoDiaMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);
    ultimoDiaMes.setHours(23, 59, 59, 999);
    
    turnosFiltrados = turnosFiltrados.filter(turno => {
       const fechaTurno = new Date(turno.reservationDate);
       return fechaTurno >= primerDiaMes && fechaTurno <= ultimoDiaMes;
    });
  } else if (filtroTiempo === "rango") {
    const fechaInicio = fechaInicioInput.value;
    const fechaFinal = fechaFinalInput.value;

    if (fechaInicio) {
        const inicio = new Date(fechaInicio.replace(/-/g, '\/'));
        inicio.setHours(0, 0, 0, 0);
        turnosFiltrados = turnosFiltrados.filter(turno => new Date(turno.reservationDate) >= inicio);
    }
    if (fechaFinal) {
        const final = new Date(fechaFinal.replace(/-/g, '\/'));
        final.setHours(23, 59, 59, 999);
        turnosFiltrados = turnosFiltrados.filter(turno => new Date(turno.reservationDate) <= final);
    }
  }
  
  crearTabla(turnosFiltrados);
}

/**
 * Muestra u oculta el contenedor de rango de fechas y aplica los filtros.
 */
function manejarCambioFiltroPrincipal() {
    if (filtroFecha.value === 'rango') {
        rangoFechasContainer.classList.remove('escondido');
    } else {
        rangoFechasContainer.classList.add('escondido');
    }
    aplicarFiltros();
}

// Añadir listeners para los cambios en todos los filtros
filtroFecha.addEventListener("change", manejarCambioFiltroPrincipal);
filtroVenue.addEventListener("change", aplicarFiltros);
filtroCategoria.addEventListener("change", aplicarFiltros);
fechaInicioInput.addEventListener("change", aplicarFiltros);
fechaFinalInput.addEventListener("change", aplicarFiltros);