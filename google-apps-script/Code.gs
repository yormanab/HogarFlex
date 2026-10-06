/**
 * =========================================================================
 * HOGARFLEX NOELUIS — BACKEND GOOGLE APPS SCRIPT (WEB APP)
 * =========================================================================
 * 
 * Este script es una extensión ligada (container-bound) a la hoja de cálculo HogarFlex_DB.
 * Se crea dentro del propio Google Sheets: Extensiones -> Apps Script.
 * 
 * DESPLIEGUE ACTIVO:
 * ID de implementación: AKfycbwvU1ooJOW4H_aDZaknRYM_RlS_Q_KN2_cEgLYPyvXjojQ1aXfbXTJDFpJrMqrh19DwLw
 * URL Web App: https://script.google.com/macros/s/AKfycbwvU1ooJOW4H_aDZaknRYM_RlS_Q_KN2_cEgLYPyvXjojQ1aXfbXTJDFpJrMqrh19DwLw/exec
 * Propietario: messiyorman123@gmail.com
 */

// Nombres estándar de las pestañas
var SHEET_NAMES = {
  CLIENTES: "Clientes",
  CREDITOS: "Créditos",
  PAGOS: "Pagos",
  VENTAS: "Ventas_Directas",
  PROVEEDORES: "Proveedores",
  FACTURAS: "Facturas",
  PRODUCTOS: "Productos",
  CONFIG: "Config",
  LOGS: "Logs"
};

// Encabezados por defecto para crear pestañas si están vacías
var DEFAULT_HEADERS = {
  Clientes: ["Cédula", "Nombre", "Teléfono", "Dirección"],
  Créditos: ["ID", "Cliente", "Producto(s)", "Total USD", "Cuota Inicial", "Saldo", "Estado", "Fecha Creación", "CantidadCuotas"],
  Pagos: ["ID Pago", "ID Crédito", "Cliente", "Tipo", "Monto USD", "Moneda", "Tasa BCV", "Monto Bs", "Fecha", "Referencia"],
  Ventas_Directas: ["ID", "Cliente", "Producto(s)", "Precio USD", "Método Pago", "Fecha"],
  Proveedores: ["ID", "Nombre", "Teléfono", "Dirección", "Categoría", "Notas"],
  Facturas: ["ID Factura", "Cliente", "Productos", "Total USD", "Fecha", "Estado"],
  Productos: ["ID", "Nombre", "Descripción", "Precio USD", "Categoría", "Stock"],
  Config: ["Parámetro", "Valor"],
  Logs: ["timestamp", "username", "level", "action", "details", "status", "errorMessage"]
};

/**
 * Obtener o crear una hoja garantizando sus encabezados
 */
function getOrCreateSheet_(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    var defaultHeader = DEFAULT_HEADERS[name];
    if (defaultHeader && defaultHeader.length > 0) {
      sheet.getRange(1, 1, 1, defaultHeader.length).setValues([defaultHeader]);
    }
  }
  return sheet;
}

/**
 * Escribir la hoja Créditos en Google Sheets garantizando la columna CantidadCuotas
 */
function writeCreditosSheet_(ss, rows) {
  var sheet = getOrCreateSheet_(ss, SHEET_NAMES.CREDITOS);
  sheet.clearContents();

  if (!rows || rows.length === 0) {
    var defHeader = DEFAULT_HEADERS.Créditos;
    sheet.getRange(1, 1, 1, defHeader.length).setValues([defHeader]);
    return;
  }

  // Asegurar que la primera fila (encabezado) incluya CantidadCuotas
  if (Array.isArray(rows[0])) {
    var header = rows[0];
    var colIdx = -1;
    for (var i = 0; i < header.length; i++) {
      var h = String(header[i] || "").trim().toLowerCase();
      if (h === "cantidadcuotas" || h === "cantidad cuotas" || h === "cuotas") {
        colIdx = i;
        break;
      }
    }
    if (colIdx === -1) {
      header.push("CantidadCuotas");
    }
  }

  var maxCols = 0;
  rows.forEach(function(r) {
    if (Array.isArray(r) && r.length > maxCols) maxCols = r.length;
  });

  if (maxCols > 0 && rows.length > 0) {
    var normalizedRows = rows.map(function(r) {
      var rowArr = Array.isArray(r) ? r.slice() : [r];
      while (rowArr.length < maxCols) {
        rowArr.push("");
      }
      return rowArr.map(function(val) {
        return (val === null || val === undefined) ? "" : val;
      });
    });

    sheet.getRange(1, 1, normalizedRows.length, maxCols).setValues(normalizedRows);
  }
}

/**
 * Leer la hoja Créditos desde Google Sheets devolviendo los valores con CantidadCuotas
 */
function readCreditosSheet_(ss) {
  var sheet = getOrCreateSheet_(ss, SHEET_NAMES.CREDITOS);
  var values = sheet.getDataRange().getValues();
  return values || [];
}

/**
 * Convierte una fila de la hoja Créditos a un objeto crédito restaurando CantidadCuotas
 */
function parseCreditoRowToObject_(row, header) {
  if (!row || row.length === 0) return null;
  var colIdx = -1;
  if (Array.isArray(header)) {
    for (var i = 0; i < header.length; i++) {
      var h = String(header[i] || "").trim().toLowerCase();
      if (h === "cantidadcuotas" || h === "cantidad cuotas" || h === "cuotas") {
        colIdx = i;
        break;
      }
    }
  }
  if (colIdx === -1) colIdx = 8;
  var cuotasVal = (colIdx < row.length && row[colIdx] !== "" && row[colIdx] !== null && row[colIdx] !== undefined)
    ? parseInt(row[colIdx], 10)
    : 1;

  return {
    id: String(row[0] || ""),
    clientName: String(row[1] || ""),
    productsSummary: String(row[2] || ""),
    totalSaleUSD: parseFloat(row[3]) || 0,
    downpaymentAmount: parseFloat(row[4]) || 0,
    remainingBalance: parseFloat(row[5]) || 0,
    status: String(row[6] || "Al día"),
    createdAt: String(row[7] || ""),
    installmentsCount: (!isNaN(cuotasVal) && cuotasVal > 0) ? cuotasVal : 1,
    cantidadCuotas: (!isNaN(cuotasVal) && cuotasVal > 0) ? cuotasVal : 1
  };
}

/**
 * Endpoint GET: Lee y devuelve en formato JSON todos los datos de HogarFlex_DB
 * URL: https://script.google.com/macros/s/.../exec?action=read
 */
function doGet(e) {
  try {
    var params = e ? e.parameter : {};
    var action = (params.action || "read").toLowerCase();

    if (action === "ping") {
      return jsonResponse_({
        status: "success",
        message: "HogarFlex Backend Activo",
        timestamp: new Date().toISOString()
      });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      return errorResponse_("No se pudo acceder al Spreadsheet activo.");
    }

    var resultData = {};
    var targetSheets = [
      SHEET_NAMES.CLIENTES,
      SHEET_NAMES.CREDITOS,
      SHEET_NAMES.PAGOS,
      SHEET_NAMES.VENTAS,
      SHEET_NAMES.PROVEEDORES,
      SHEET_NAMES.FACTURAS,
      SHEET_NAMES.PRODUCTOS,
      SHEET_NAMES.CONFIG
    ];

    targetSheets.forEach(function(sheetName) {
      if (sheetName === SHEET_NAMES.CREDITOS) {
        resultData[sheetName] = readCreditosSheet_(ss);
      } else {
        var sheet = getOrCreateSheet_(ss, sheetName);
        var values = sheet.getDataRange().getValues();
        resultData[sheetName] = values || [];
      }
    });

    return jsonResponse_({
      status: "success",
      action: "read",
      spreadsheetName: ss.getName(),
      spreadsheetId: ss.getId(),
      timestamp: new Date().toLocaleString("es-VE"),
      data: resultData
    });
  } catch (err) {
    return errorResponse_("Error en doGet: " + err.toString());
  }
}

/**
 * Endpoint POST: Recibe datos completos en JSON y los escribe en las hojas correspondientes
 * Body: { action: "write", data: { Clientes: [...], Créditos: [...], Pagos: [...], Ventas_Directas: [...], Config: [...] } }
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Esperar hasta 20 segundos por el lock para sincronizaciones concurrentes
    lock.waitLock(20000);
  } catch (lockErr) {
    return errorResponse_("El backend está ocupado procesando otra petición. Reintentando...");
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return errorResponse_("Cuerpo de petición (body) vacío.");
    }

    var payload = JSON.parse(e.postData.contents);
    var action = (payload.action || "write").toLowerCase();

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      return errorResponse_("No se pudo acceder al Spreadsheet activo.");
    }

    if (action === "write") {
      var dataObj = payload.data || {};

      for (var sheetKey in dataObj) {
        if (!dataObj.hasOwnProperty(sheetKey)) continue;

        var rows = dataObj[sheetKey];
        if (!Array.isArray(rows) || rows.length === 0) continue;

        if (sheetKey === SHEET_NAMES.CREDITOS) {
          writeCreditosSheet_(ss, rows);
          continue;
        }

        var sheet = getOrCreateSheet_(ss, sheetKey);
        sheet.clearContents();

        // Normalizar filas para que todas tengan exactamente el mismo número de columnas
        var maxCols = 0;
        rows.forEach(function(r) {
          if (Array.isArray(r) && r.length > maxCols) maxCols = r.length;
        });

        if (maxCols > 0 && rows.length > 0) {
          var normalizedRows = rows.map(function(r) {
            var rowArr = Array.isArray(r) ? r.slice() : [r];
            while (rowArr.length < maxCols) {
              rowArr.push("");
            }
            return rowArr.map(function(val) {
              return (val === null || val === undefined) ? "" : val;
            });
          });

          sheet.getRange(1, 1, normalizedRows.length, maxCols).setValues(normalizedRows);
        }
      }

      SpreadsheetApp.flush();

      return jsonResponse_({
        status: "success",
        action: "write",
        message: "Base de datos HogarFlex_DB actualizada exitosamente en Google Sheets.",
        timestamp: new Date().toLocaleString("es-VE")
      });
    }

    // Acción para subir fotos/comprobantes a Google Drive sin autenticación del cliente
    if (action === "upload_receipt") {
      var folderName = "HogarFlex_Comprobantes";
      var folders = DriveApp.getFoldersByName(folderName);
      var parentFolder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

      var subfolderName = payload.monthFolder || "00_Varios";
      var subfolders = parentFolder.getFoldersByName(subfolderName);
      var targetFolder = subfolders.hasNext() ? subfolders.next() : parentFolder.createFolder(subfolderName);

      var fileName = payload.fileName || ("PAGO_" + Date.now() + ".jpg");
      var base64Data = payload.base64 || "";

      if (base64Data) {
        var parts = base64Data.split(";base64,");
        var contentType = (parts[0] || "").replace("data:", "") || "image/jpeg";
        var decoded = Utilities.base64Decode(parts[1] || parts[0]);
        var blob = Utilities.newBlob(decoded, contentType, fileName);
        var file = targetFolder.createFile(blob);

        return jsonResponse_({
          status: "success",
          action: "upload_receipt",
          fileId: file.getId(),
          fileUrl: file.getUrl(),
          fileName: fileName
        });
      }
      return errorResponse_("Datos base64 no proporcionados para el comprobante.");
    }

    // Acción para subir imágenes de productos a Google Drive (HogarFlex_Productos)
    if (action === "upload_product_image") {
      var folderName = "HogarFlex_Productos";
      var folders = DriveApp.getFoldersByName(folderName);
      var productFolder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

      var prodId = String(payload.productId || "").replace(/[^a-zA-Z0-9_-]/g, "");
      var fileName = payload.fileName || ("producto_" + prodId + ".jpg");
      var base64Data = payload.base64 || "";

      if (base64Data) {
        var existingFiles = productFolder.getFilesByName(fileName);
        if (existingFiles.hasNext()) {
          var existingFile = existingFiles.next();
          return jsonResponse_({
            status: "success",
            action: "upload_product_image",
            fileId: existingFile.getId(),
            fileUrl: existingFile.getUrl(),
            fileName: fileName,
            alreadyExists: true
          });
        }

        var parts = base64Data.split(";base64,");
        var contentType = (parts[0] || "").replace("data:", "") || "image/jpeg";
        var decoded = Utilities.base64Decode(parts[1] || parts[0]);
        var blob = Utilities.newBlob(decoded, contentType, fileName);
        var file = productFolder.createFile(blob);

        return jsonResponse_({
          status: "success",
          action: "upload_product_image",
          fileId: file.getId(),
          fileUrl: file.getUrl(),
          fileName: fileName,
          alreadyExists: false
        });
      }
      return errorResponse_("Datos base64 no proporcionados para la foto del producto.");
    }

    // Acción para registrar lote de logs del sistema en la pestaña Logs
    if (action === "append_logs" || action === "log_to_sheets" || action === "logtosheets") {
      var logsArr = payload.logs || payload.logsArray || payload.data || [];
      var rowsInserted = logToSheets(logsArr);
      return jsonResponse_({
        status: "success",
        success: true,
        action: "append_logs",
        rowsInserted: rowsInserted,
        message: "Logs guardados en Google Sheets exitosamente (" + rowsInserted + " filas)."
      });
    }

    return errorResponse_("Acción no reconocida: " + action);
  } catch (err) {
    return errorResponse_("Error en doPost: " + err.toString());
  } finally {
    lock.releaseLock();
  }
}

/**
 * Agrega un lote de logs a la pestaña Logs en Google Sheets
 * Columnas: timestamp | username | level | action | details | status | errorMessage
 */
function logToSheets(logsArray) {
  if (!logsArray || !Array.isArray(logsArray) || logsArray.length === 0) return 0;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet_(ss, SHEET_NAMES.LOGS || "Logs");
  var headers = DEFAULT_HEADERS.Logs || ["timestamp", "username", "level", "action", "details", "status", "errorMessage"];

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  var rowsToInsert = logsArray.map(function(item) {
    var detailsStr = "";
    if (item.details !== null && item.details !== undefined) {
      detailsStr = typeof item.details === "object" ? JSON.stringify(item.details) : String(item.details);
    }
    return [
      String(item.timestamp || new Date().toISOString()),
      String(item.username || "Yorgeh2023"),
      String(item.level || "INFO"),
      String(item.action || ""),
      detailsStr,
      String(item.status || "success"),
      String(item.errorMessage || "")
    ];
  });

  var startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, rowsToInsert.length, headers.length).setValues(rowsToInsert);
  SpreadsheetApp.flush();
  return rowsToInsert.length;
}

/**
 * Auxiliar: Respuesta JSON compatible con CORS
 */
function jsonResponse_(obj) {
  obj = obj || {};
  obj.success = true;
  if (!obj.status) obj.status = "success";
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Auxiliar: Respuesta de error en formato JSON
 */
function errorResponse_(msg) {
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    status: "error",
    error: msg,
    message: msg
  })).setMimeType(ContentService.MimeType.JSON);
}
