const hoja = "Reservations";
let turnos;

async function getTurnos() {
  let response;
  try {
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET,
      range: hoja + "!A:H", // MODIFICADO: Ampliado el rango a la columna H
    });
  } catch (err) {
    document.getElementById("content").innerText = err.message;
    return;
  }
  const range = response.result;
  if (!range || !range.values || range.values.length == 0) {
    // MODIFICADO: El manejo de errores ahora está en la función crearTabla
    // document.getElementById("content").innerText = "No values found.";
    return;
  }

  turnos = [];
  range.values.forEach((fila) => {
    const nuevoTurno = {
      id: fila[0],
      client: fila[1],
      email: fila[2],
      phone: fila[3],
      venue: fila[4],
      reservationDate: fila[5],
      comment: fila[6],
      category: fila[7] // NUEVO: Añadida la propiedad category
    };
    turnos.push(nuevoTurno);
  });
} // Se eliminó console.log(turnos) y la llave extra

async function editTurno(id, contenido) {
  const update = [
    contenido.id,
    contenido.client,
    contenido.email,
    contenido.phone,
    contenido.venue,
    contenido.reservationDate,
    contenido.comment,
    contenido.category // NUEVO: Añadida la categoría al actualizar
  ];
  const filaAEditar = parseInt(id) + 1;
  let response; // MODIFICADO: Declarar response aquí
  response = await gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET,
    range: `${hoja}!A${filaAEditar}:H${filaAEditar}`, // MODIFICADO: Rango ampliado
    values: [update],
    valueInputOption: "USER_ENTERED"
  });
  return response;
}