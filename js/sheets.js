const hoja = "Reservations";
let turnos;

async function getTurnos() {
  let response;
  try {
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET,
      range: hoja + "!A:G",
    });
  } catch (err) {
    document.getElementById("content").innerText = err.message;
    return;
  }
  const range = response.result;
  if (!range || !range.values || range.values.length == 0) {
    document.getElementById("content").innerText = "No values found.";
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
    comment: fila[6]
  };
  turnos.push(nuevoTurno);
});

console.log(turnos);

async function editTurno(id, contenido) {
  const update = [
    contenido.id,
    contenido.client,
    contenido.email,
    contenido.phone,
    contenido.venue,
    contenido.reservationDate,
    contenido.comment,
  ]
  const filaAEditar = parseInt(id)+1;
  response = await gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET,
    range: `${hoja}!A${filaAEditar}:G${filaAEditar}`,
    values: [update],
    valueInputOption:"USER_ENTERED"
  });
  return response;
}
}
