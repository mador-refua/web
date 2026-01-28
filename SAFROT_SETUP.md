# הגדרת ספרות מקצועית - Google Sheets + Apps Script

מדריך זה מסביר כיצד להגדיר את מערכת הספרות המקצועית כך שניתן לעדכן את רשימת המסמכים ישירות מ-Google Sheets.

## שלב 1: יצירת Google Sheet חדש

1. צור Google Sheet **חדש** (נפרד מזה של הלומדות)
2. קרא לו "ספרות מקצועית - מדור רפואה" (או כל שם שתרצה)
3. בשורה הראשונה (כותרות), הזן:
   - עמודה A: `emoji`
   - עמודה B: `title`
   - עמודה C: `url`

## שלב 2: הוספת נתונים לדוגמה

הוסף מסמכים בשורות הבאות:

| emoji | title | url |
|-------|-------|-----|
| 📕 | פרוטוקול הלם | https://drive.google.com/file/d/YOUR_FILE_ID/view |
| 📘 | פרוטוקול כוויות | https://drive.google.com/file/d/YOUR_FILE_ID/view |
| 📗 | פרוטוקול טראומה | https://drive.google.com/file/d/YOUR_FILE_ID/view |
| 📙 | הנחיות החייאה | https://drive.google.com/file/d/YOUR_FILE_ID/view |
| 📔 | מדריך תרופות | https://drive.google.com/file/d/YOUR_FILE_ID/view |
| 🩺 | פרוטוקול אנפילקסיס | https://drive.google.com/file/d/YOUR_FILE_ID/view |
| 💊 | מינוני תרופות חירום | https://drive.google.com/file/d/YOUR_FILE_ID/view |
| 🫀 | פרוטוקולי לב | https://drive.google.com/file/d/YOUR_FILE_ID/view |

### איך לקבל קישור ל-PDF בדרייב:
1. העלה את ה-PDF ל-Google Drive
2. לחץ ימני → "קבל קישור"
3. שנה את ההרשאות ל-"כל מי שיש לו את הקישור יכול לצפות"
4. העתק את הקישור המלא

## שלב 3: יצירת Apps Script

כיוון שזה Sheet נפרד, נצטרך Apps Script חדש:

1. ב-Google Sheet החדש, לחץ על **Extensions** → **Apps Script**
2. מחק את הקוד הקיים והדבק את הקוד הזה:

```javascript
function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheets()[0]; // Sheet הראשון

  const data = ws.getDataRange().getValues();
  const headers = data[0]; // emoji, title, url
  const rows = data.slice(1); // כל השורות מלבד הכותרות

  const documents = rows
    .filter(row => row[0] && row[1] && row[2]) // רק שורות עם נתונים
    .map(row => ({
      emoji: row[0],
      title: row[1],
      url: row[2]
    }));

  return ContentService.createTextOutput(
    JSON.stringify({
      success: true,
      documents: documents
    })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

3. שמור (Ctrl+S)
4. לחץ על **Deploy** → **New deployment**
5. לחץ על ⚙️ ליד "Select type" ובחר **Web app**
6. הגדרות:
   - Execute as: **Me**
   - Who has access: **Anyone**
7. לחץ **Deploy**
8. **העתק את ה-Web app URL שקיבלת**
9. פתח את `safrot-page.html` ובשורה 216 החלף `YOUR_APPS_SCRIPT_URL_HERE` ב-URL שהעתקת

## שלב 4: בדיקה

1. פתח את `safrot-page.html` בדפדפן
2. אמור לראות את כל המסמכים שהגדרת
3. לחיצה על כרטיס תפתח את ה-PDF בדרייב

## שלב 5: עדכון נתונים

מעכשיו, כדי להוסיף/לערוך/למחוק מסמכים:
1. פתח את Google Sheet של הספרות
2. ערוך את השורות (הוסף/מחק/שנה)
3. השינויים יופיעו מיד באתר!

## טיפים

### אימוגי מומלצים למסמכים:
- 📕 📘 📗 📙 📔 - ספרים בצבעים שונים
- 📄 📃 📑 - דפים
- 🩺 💊 💉 - ציוד רפואי
- 🫀 🧠 🫁 - איברים
- ⚕️ 🏥 - רפואה כללי
- ⚠️ 🚨 - דחוף/חירום

### אבטחה
- ודא שקבצי ה-PDF נגישים לכולם (view only)
- לא להעלות מידע רגיש/סודי
- המערכת בודקת שהקישורים הם מ-Google Drive בלבד

## פתרון תקלות

### המסמכים לא נטענים
1. בדוק שיש 3 עמודות: emoji, title, url
2. בדוק שה-Apps Script פרוס (Deployed) והעתקת את ה-URL הנכון
3. בדוק שעדכנת את ה-URL ב-safrot-page.html
4. פתח Console (F12) וראה מה השגיאה

### "YOUR_APPS_SCRIPT_URL_HERE"
- שכחת להחליף את ה-URL! עדכן בשורה 216 ב-safrot-page.html

### הקישורים לא נפתחים
- ודא שקישורי הדרייב מוגדרים ל-"כל מי שיש לו את הקישור יכול לצפות"

---

**נוצר עבור מדור רפואה** 🩺
