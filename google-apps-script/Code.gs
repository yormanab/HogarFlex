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
  CONFIG: "Config"
};

// Encabezados por defecto para crear pestañas si están vacías
var DEFAULT_HEADERS = {
  Clientes: ["Cédula", "Nombre", "Teléfono", "Dirección"],
  Créditos: ["ID", "Cliente", "Producto(s)", "Total USD", "Cuota Inicial", "Saldo", "Estado", "Fecha Creación"],
  Pagos: ["ID Pago", "ID Crédito", "Cliente", "Tipo", "Monto USD", "Moneda", "Tasa BCV", "Monto Bs", "Fecha", "Referencia"],
  Ventas_Directas: ["ID", "Cliente", "Producto(s)", "Precio USD", "Método Pago", "Fecha"],
  Proveedores: ["ID", "Nombre", "Teléfono", "Dirección", "Categoría", "Notas"],
  Facturas: ["ID Factura", "Cliente", "Productos", "Total USD", "Fecha", "Estado"],
  Productos: ["ID", "Nombre", "Descripción", "Precio USD", "Categoría", "Stock"],
  Config: ["Parámetro", "Valor"]
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
      var sheet = getOrCreateSheet_(ss, sheetName);
      var values = sheet.getDataRange().getValues();
      resultData[sheetName] = values || [];
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

    return errorResponse_("Acción no reconocida: " + action);
  } catch (err) {
    return errorResponse_("Error en doPost: " + err.toString());
  } finally {
    lock.releaseLock();
  }
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
