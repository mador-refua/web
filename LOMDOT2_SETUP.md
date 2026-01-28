# הגדרת עמוד לומדות2 - סרטונים דינמיים מ-Google Sheets

## שלב 1: יצירת Google Sheets

1. **צור Google Sheet חדש**
   - לך ל-[Google Sheets](https://sheets.google.com)
   - צור גיליון חדש
   - קרא לו "לומדות - מדור רפואה"

2. **הגדר את העמודות** (בשורה הראשונה):

   | A | B | C |
   |---|---|---|
   | emoji | title | url |

3. **הוסף סרטונים** (דוגמאות):

   | emoji | title | url |
   |---|---|---|
   | 🩹 | פגיעות מיוחדות | https://drive.google.com/file/d/1yLGOU1LFyShByrNNbbMQJ8G55mPkbjZa/view |
   | 👥 | אוכלוסיות מיוחדות | https://drive.google.com/file/d/1nut_0PUdBGMNY5Ywp_df-ZE7dlorUdv1/view |
   | 🌯 | קד סקד | https://drive.google.com/file/d/1oHXdf4Fi5VkEUBklH26MxeFXl67gFRAK/view |

## שלב 2: יצירת Apps Script

1. **פתח את Apps Script**
   - בגיליון, לך ל: **Extensions** → **Apps Script**

2. **העתק את הקוד הבא**:

```javascript
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');

    // אם השם של הגיליון שונה, שנה את 'Sheet1' לשם הנכון
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'לא נמצא גיליון בשם Sheet1'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0]; // שורה ראשונה - כותרות
    const videos = [];

    // התחל משורה 2 (דלג על הכותרות)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];

      // דלג על שורות ריקות
      if (!row[0] && !row[1] && !row[2]) continue;

      videos.push({
        emoji: row[0] || '🎥',
        title: row[1] || '',
        url: row[2] || ''
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      videos: videos,
      count: videos.length
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **פרסם את ה-Script**:
   - לחץ על **Deploy** → **New deployment**
   - בחר **Web app**
   - הגדרות:
     - **Execute as**: Me
     - **Who has access**: Anyone (או Anyone with the link)
   - לחץ **Deploy**
   - **העתק את ה-URL** שמתקבל

## שלב 3: עדכון הקוד ב-lomdot2-page.html

1. פתח את הקובץ `lomdot2-page.html`
2. מצא את השורה:
   ```javascript
   const VIDEOS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. החלף את `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` ב-URL שהעתקת

דוגמה:
```javascript
const VIDEOS_URL = 'https://script.google.com/macros/s/AKfycbz.../exec';
```

## שלב 4: בדיקה

1. פתח את `lomdot2-page.html` בדפדפן
2. אמור לראות את הסרטונים נטענים מ-Google Sheets
3. אם יש שגיאה, פתח את Console (F12) לראות פרטים

## עדכון סרטונים

כדי להוסיף/לערוך/למחוק סרטונים:
1. פשוט ערוך את ה-Google Sheet
2. רענן את הדף - השינויים יופיעו מיד!

---

## שמות אימוג'י נפוצים

העתק והדבק לתוך העמודה emoji:

- 🩹 פגיעות
- 👥 אוכלוסיות
- 🤝 שיתוף פעולה
- 🏚️ אתר הרס
- 🚑 חילוץ
- 🌯 קד סקד
- ☣️ אב"כ
- 🚨 חירום
- 💓 החייאה
- 🩺 רפואה
- 📋 פרוטוקול
- 🎓 הדרכה
- 📚 לימוד
- 🎥 סרטון
- 📖 ספרות

---

## פתרון בעיות

### "לא נמצאו סרטונים בגיליון"
- ודא שיש לפחות שורה אחת עם נתונים (מלבד שורת הכותרות)
- ודא שעמודת title לא ריקה

### "שגיאה בטעינת נתונים"
- ודא ש-Apps Script פורסם כ-"Anyone"
- בדוק שהעתקת את ה-URL הנכון
- נסה לפרסם שוב את ה-Script

### השינויים לא מתעדכנים
- Google עשוי לשמור במטמון - המתן דקה ונסה שוב
- נסה לפתוח בחלון פרטי (Incognito)
