/**
 * ============================================================
 * Google Apps Script — מדור רפואה | עמוד הדרכה
 * ============================================================
 *
 * הגדרת Google Sheet:
 * -------------------
 * שם הגיליון:  הדרכה
 *
 * עמודות (שורה 1 = כותרות, שורה 2 ואילך = נתונים):
 * | A: emoji | B: title | C: url | D: category | E: type |
 *
 * ערכים לדוגמה:
 *   emoji  = 📘
 *   title  = מדריך הדרכת חובשים
 *   url    = https://drive.google.com/file/d/XXX/view
 *   category = חובש       (אפשרי: חובש / מטב / כללי / וכו')
 *   type   = pdf           (אפשרי: pdf / video / doc / link)
 *
 * פריסה:
 * -------
 * 1. Extensions → Apps Script → הדבק את הקוד
 * 2. Deploy → New deployment → "Web app"
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 3. העתק את ה-URL שהתקבל ל-MATERIALS_URL ב-hadracha-page.html
 * ============================================================
 */

const SHEET_NAME = 'הדרכה';

// Column positions (1-indexed)
const COL = {
  EMOJI:    1,
  TITLE:    2,
  URL:      3,
  CATEGORY: 4,
  TYPE:     5
};

/**
 * Entry point — handles all GET requests from the website
 */
function doGet(e) {
  try {
    const materials = getMaterials();
    return jsonResponse({ success: true, materials });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

/**
 * Reads all material rows from the "הדרכה" sheet
 */
function getMaterials() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    throw new Error('גיליון "' + SHEET_NAME + '" לא נמצא');
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return []; // No data rows

  const range = sheet.getRange(2, 1, lastRow - 1, 5);
  const rows = range.getValues();

  const materials = [];

  rows.forEach((row, index) => {
    const title    = String(row[COL.TITLE    - 1] || '').trim();
    const url      = String(row[COL.URL      - 1] || '').trim();
    const emoji    = String(row[COL.EMOJI    - 1] || '📋').trim();
    const category = String(row[COL.CATEGORY - 1] || 'כללי').trim();
    const type     = String(row[COL.TYPE     - 1] || '').trim().toLowerCase();

    // Skip rows with missing title or URL
    if (!title || !url) return;

    // Basic URL validation — must be https
    if (!url.startsWith('https://')) return;

    materials.push({
      emoji:    emoji    || '📋',
      title:    title,
      url:      url,
      category: category || 'כללי',
      type:     type     || autoDetectType(url)
    });
  });

  return materials;
}

/**
 * Auto-detect material type from URL if not specified in the sheet
 */
function autoDetectType(url) {
  const lower = url.toLowerCase();
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'video';
  if (lower.includes('docs.google.com/presentation'))               return 'doc';
  if (lower.includes('docs.google.com'))                            return 'doc';
  if (lower.includes('drive.google.com'))                           return 'pdf'; // Default Drive links to PDF
  return 'link';
}

/**
 * Build a JSON response with CORS headers so the website can read it
 */
function jsonResponse(obj) {
  const output = ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Quick test — run this manually in the Apps Script editor
 * to verify everything works before deploying
 */
function testGetMaterials() {
  const result = getMaterials();
  Logger.log('Total materials found: ' + result.length);
  result.forEach((m, i) => {
    Logger.log(i + 1 + '. [' + m.category + '] ' + m.title + ' (' + m.type + ')');
  });
}
