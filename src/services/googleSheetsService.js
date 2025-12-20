// Permite trabajar con rutas de archivos del sistema
import path from "path";

// Librería oficial de Google para usar sus APIs
import { google } from "googleapis";

// Inicializa el servicio de Google Sheets versión 4
const sheets = google.sheets("v4");

/*
================================================
 OBTIENE LA SIGUIENTE FILA DISPONIBLE
 Lee la columna A y calcula la siguiente fila libre
================================================
*/
async function getNextEmptyRow(auth, spreadsheetId) {
  // Obtiene todos los valores de la columna A
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "reservas!A:A", // Solo se lee la primera columna
    auth,
  });

  // Si no hay datos, se empieza desde la fila 2
  const rows = response.data.values || [];
  return rows.length + 1;
}

/*
================================================
 AGREGA UNA FILA EN UNA POSICIÓN CONTROLADA
 Usa UPDATE en lugar de APPEND
================================================
*/
async function addRowToSheet(auth, spreadsheetId, values) {
  // Calcula la fila exacta donde se escribirá
  const nextRow = await getNextEmptyRow(auth, spreadsheetId);

  // Construye el rango exacto donde se insertan los datos
  const range = `reservas!A${nextRow}`;

  // Configuración de la petición a Google Sheets
  const request = {
    spreadsheetId,        // ID del documento de Google Sheets
    range,                // Rango exacto calculado dinámicamente
    valueInputOption: "RAW", // Inserta valores sin procesarlos
    resource: {
      values: [values],   // Una fila completa
    },
    auth,                 // Cliente autenticado
  };

  try {
    // Escribe los datos en la fila calculada
    const response = await sheets.spreadsheets.values.update(request);
    return response;
  } catch (error) {
    console.error("Error escribiendo fila en Google Sheets:", error);
    throw error;
  }
}

/*
================================================
 FUNCIÓN PRINCIPAL
 Es la que usa tu bot para guardar los datos
================================================
*/
const appendToSheet = async (data) => {
  try {
    // Crea la autenticación usando una cuenta de servicio
    const auth = new google.auth.GoogleAuth({
      // Ruta al archivo credentials.json
      keyFile: path.join(
        process.cwd(),
        "src/credentials",
        "credentials.json"
      ),

      // Permiso para leer y escribir en Google Sheets
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    // Obtiene el cliente autenticado
    const authClient = await auth.getClient();

    // ID del Google Sheet donde se guardan las citas
    const spreadsheetId =
      "1VD3_7K6TAzKdKv7INfxFsRVsXDJqyFXrtGcRcVVIDdk";

    // Inserta la fila en la posición correcta
    await addRowToSheet(authClient, spreadsheetId, data);

    // Confirmación interna
    return "Datos agregados correctamente";
  } catch (error) {
    console.error("Error en appendToSheet:", error);
  }
};

// Exporta la función para usarla en appointmentFlow.js
export default appendToSheet;

