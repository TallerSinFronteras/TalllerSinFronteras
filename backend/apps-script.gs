/* Taller Sin Fronteras - Opiniones (Google Apps Script)
   Pegá TODO este archivo en tu proyecto de Apps Script (reemplaza el código anterior) y volvé a implementar:
   Implementar > Administrar implementaciones > editar (lápiz) > Versión: Nueva versión > Implementar.
   Propiedad de la secuencia de comandos (Configuración del proyecto > Propiedades): SECRETO = una clave larga inventada por vos
   (la misma que va en el Worker de Cloudflare). */

var ID = '1oXw51bRu7dftxnuMQyk5oRZm8mLzgukMXcj6tXptvb4';
var COLUMNAS = ['fecha', 'nombre', 'puntaje', 'opinion', 'ip', 'spam', 'motivo'];

function hoja_() {
  var h = SpreadsheetApp.openById(ID).getSheets()[0];
  h.getRange(1, 1, 1, COLUMNAS.length).setValues([COLUMNAS]);   // agrega las columnas nuevas si faltan
  h.getRange('A:A').setNumberFormat('@');
  return h;
}

function seguro_(t) { return /^[=+\-@]/.test(String(t)) ? "'" + t : String(t); }
function clave_(t) { return String(t).trim().toLowerCase().replace(/\s+/g, ' '); }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var d = JSON.parse(e.postData.contents);

    // Si hay SECRETO configurado, solo acepta envíos que vengan del Worker de Cloudflare
    var secreto = PropertiesService.getScriptProperties().getProperty('SECRETO');
    if (secreto && d.secreto !== secreto) return json_({ ok: false, error: 'no autorizado' });

    var nombre = String(d.nombre || '').trim().slice(0, 80);
    var puntaje = Math.min(5, Math.max(1, Math.round(Number(d.puntaje) || 0)));
    var opinion = String(d.opinion || '').trim().slice(0, 1000);
    var ip = String(d.ip || '').slice(0, 64);                 // ya viene "hasheada" desde el Worker
    var spam = ['si', 'no', 'sin revisar'].indexOf(d.spam) >= 0 ? d.spam : 'sin revisar';
    var motivo = String(d.motivo || '').slice(0, 200);
    if (!nombre || !puntaje) return json_({ ok: false, error: 'faltan datos' });

    var h = hoja_(), actualizada = false;

    // Misma persona (misma IP + mismo nombre): se borra la opinión anterior y se guarda la nueva
    if (ip) {
      var n = h.getLastRow();
      if (n > 1) {
        var v = h.getRange(2, 1, n - 1, COLUMNAS.length).getValues();
        for (var i = v.length - 1; i >= 0; i--) {
          if (String(v[i][4]) === ip && clave_(v[i][1]) === clave_(nombre)) {
            h.deleteRow(i + 2);
            actualizada = true;
          }
        }
      }
    }

    h.appendRow([String(d.fecha || new Date().toLocaleString('es-AR')), seguro_(nombre), puntaje, seguro_(opinion), ip, spam, seguro_(motivo)]);
    return json_({ ok: true, actualizada: actualizada });
  } catch (err) {
    return json_({ ok: false, error: 'error' });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

// Lista pública: más nuevas primero. No incluye la IP ni las marcadas como spam.
function doGet() {
  var h = hoja_(), n = h.getLastRow(), out = [];
  if (n > 1) {
    var v = h.getRange(2, 1, n - 1, COLUMNAS.length).getValues();
    for (var i = v.length - 1; i >= 0; i--) {
      if (String(v[i][5]).toLowerCase() === 'si') continue;   // spam: queda en la hoja pero no se muestra
      out.push({ fecha: String(v[i][0]), nombre: v[i][1], puntaje: v[i][2], opinion: v[i][3] });
    }
  }
  return json_(out);
}
