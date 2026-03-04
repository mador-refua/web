/**
 * ============================================================
 * Google Apps Script — מדור רפואה | פורום שאלות ותשובות
 * ============================================================
 *
 * הגדרת Google Sheet:
 * -------------------
 * שם הגיליון: qa   (צור גיליון חדש בתוך הספרדשיט הקיים)
 *
 * עמודות (שורה 1 = כותרות, שורה 2 ואילך = נתונים):
 * | A: timestamp | B: question | C: answer |
 *
 * פריסה:
 * -------
 * 1. Extensions → Apps Script → הדבק את הקוד
 * 2. Deploy → New deployment → "Web app"
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 3. העתק את ה-URL שהתקבל ל-QA_URL ב-qa.html
 * ============================================================
 */

const QA_SHEET_NAME = 'qa';

const QA_COL = {
  TIMESTAMP: 1,
  QUESTION:  2,
  ANSWER:    3
};

// ======================================================
// doGet — מטפל בשתי פעולות:
//   1. ברירת מחדל: מחזיר שאלות שנענו
//   2. action=submit&question=... : שומר שאלה חדשה
//
// תומך גם ב-JSONP (פרמטר callback=myFunc)
// ======================================================
function doGet(e) {
  const callback = e.parameter.callback || '';
  const action   = e.parameter.action   || '';

  let result;

  try {
    if (action === 'submit') {
      const question = String(e.parameter.question || '').trim();
      result = handleSubmit(question);
    } else {
      result = { success: true, items: getAnsweredQuestions() };
    }
  } catch (err) {
    result = { success: false, error: err.message };
  }

  const json = JSON.stringify(result);

  if (callback) {
    // JSONP response — אין CORS בכלל
    return ContentService
      .createTextOutput(callback + '(' + json + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

// ======================================================
// doPost — גם תומך בשליחת שאלה דרך POST (אופציונלי)
// ======================================================
function doPost(e) {
  try {
    let question = '';
    if (e.postData && e.postData.contents) {
      const body = JSON.parse(e.postData.contents);
      question = String(body.question || '').trim();
    } else if (e.parameter && e.parameter.question) {
      question = String(e.parameter.question).trim();
    }
    return ContentService
      .createTextOutput(JSON.stringify(handleSubmit(question)))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ======================================================
// handleSubmit — שומר שאלה חדשה לגיליון
// ======================================================
function handleSubmit(question) {
  if (!question) {
    return { success: false, error: 'שאלה ריקה' };
  }
  question = question.substring(0, 1000);

  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(QA_SHEET_NAME);

  if (!sheet) {
    throw new Error('גיליון "' + QA_SHEET_NAME + '" לא נמצא. צור גיליון בשם qa.');
  }

  sheet.appendRow([new Date().toISOString(), question, '']);
  return { success: true, message: 'השאלה נשמרה בהצלחה' };
}

// ======================================================
// getAnsweredQuestions — מחזיר רק שורות עם תשובה
// ======================================================
function getAnsweredQuestions() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(QA_SHEET_NAME);

  if (!sheet) throw new Error('גיליון "' + QA_SHEET_NAME + '" לא נמצא');

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const range = sheet.getRange(2, 1, lastRow - 1, 3);
  const rows  = range.getValues();
  const items = [];

  rows.forEach(row => {
    const timestamp = row[QA_COL.TIMESTAMP - 1];
    const question  = String(row[QA_COL.QUESTION - 1] || '').trim();
    const answer    = String(row[QA_COL.ANSWER   - 1] || '').trim();
    if (!question || !answer) return;
    items.push({
      timestamp: timestamp ? new Date(timestamp).toISOString() : '',
      question,
      answer
    });
  });

  // ממיין: החדשות ראשונות
  items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return items;
}

// ======================================================
// testQA — בדיקה ידנית מה-Apps Script editor
// ======================================================
function testQA() {
  const result = getAnsweredQuestions();
  Logger.log('Total answered Q&As: ' + result.length);
  result.forEach((item, i) => {
    Logger.log(i + 1 + '. Q: ' + item.question.substring(0, 60));
    Logger.log('   A: ' + item.answer.substring(0, 60));
  });
}
