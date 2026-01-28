# 🔒 הגדרת מערכת הפעלה/כיבוי מבחנים (Exam Switch)

## מטרה
מערכת שמאפשרת למדריכים להפעיל/לכבות מבחנים באמצעות Google Sheets פשוט.
כאשר מבחן כבוי (OFF), הנבחנים לא יכולים לגשת אליו.

---

## שלב 1: יצירת Sheet חדש "switch"

1. פתח את Google Sheet: **"מאגר שאלות - מדור רפואה"**
2. צור גיליון חדש בשם: **`switch`**
3. במשבצת A1 כתוב: **`exam_name`**
4. במשבצת B1 כתוב: **`status`**

5. מלא את השורות הבאות:

| A (exam_name) | B (status) |
|---------------|------------|
| מבחן פתיחה חובש | ON |
| מבחן סיום חובש | OFF |
| מבחן פתיחה מט״ב | ON |
| מבחן סיום מט״ב | OFF |

**חשוב:**
- השמות חייבים להיות **בדיוק** כמו בקוד
- הסטטוס חייב להיות **ON** או **OFF** (באנגלית רישיות)

---

## שלב 2: עדכון Apps Script

פתח את Apps Script של הקובץ (**Extensions → Apps Script**)

**החלף את כל הקוד ב-doGet בקוד הבא:**

```javascript
function doGet(e) {
  const sheet = e.parameter.sheet;
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // אם מבקשים את מצב המבחנים
  if (sheet === 'switch') {
    const ws = ss.getSheetByName('switch');

    if (!ws) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          error: 'Sheet "switch" not found. Please create it first.'
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const data = ws.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);

    const switches = {};
    rows.forEach(row => {
      const examName = row[0];
      const status = row[1];
      switches[examName] = status;
    });

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, switches: switches })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // הקוד הקיים לטעינת שאלות
  const ws = ss.getSheetByName(sheet);

  if (!ws) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: 'Sheet not found: ' + sheet })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const data = ws.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);

  const questions = rows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });

  return ContentService.createTextOutput(
    JSON.stringify({ success: true, questions: questions })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

**שמור ופרוס מחדש:**
1. לחץ על **💾 Save**
2. לחץ על **Deploy → Manage deployments**
3. לחץ על **✏️ Edit** (ליד הפריסה הקיימת)
4. שנה את ה-Version ל-**New version**
5. לחץ על **Deploy**

---

## שלב 3: בדיקת ה-Apps Script

בדוק שה-URL עובד:
```
YOUR_SCRIPT_URL?sheet=switch
```

תקבל:
```json
{
  "success": true,
  "switches": {
    "מבחן פתיחה חובש": "ON",
    "מבחן סיום חובש": "OFF",
    "מבחן פתיחה מט״ב": "ON",
    "מבחן סיום מט״ב": "OFF"
  }
}
```

---

## שלב 4: בדיקה ושימוש

### להפעלת מבחן:
במשבצת ה-status של המבחן, כתוב: **ON**

### לכיבוי מבחן:
במשבצת ה-status של המבחן, כתוב: **OFF**

### מבחן חסום נראה כך:
- 🔒 אייקון מנעול
- אפור ומושבת
- הודעה: "מבחן זה אינו זמין כרגע"

---

## שלב 5: טיפים למדריכים

**מתי לכבות מבחן?**
- לפני שהשאלות מוכנות
- בזמן עדכון שאלות
- אחרי תאריך היעד

**מתי להפעיל מבחן?**
- כשכל 25 השאלות מוכנות
- כשהמבחן מוכן לנבחנים

**חשוב:**
- המערכת בודקת את הסטטוס **בכל כניסה** לדף המבחנים
- אין צורך לרענן דבר - השינוי מיידי
- הנבחנים לא רואים את sheet ה-switch

---

## בעיות נפוצות

### בעיה: "Sheet switch not found"
**פתרון:** ודא שיצרת גיליון בשם בדיוק `switch` (קטנות)

### בעיה: כל המבחנים חסומים
**פתרון:** בדוק שכתבת `ON` ולא `on` או משהו אחר

### בעיה: השינויים לא נראים
**פתרון:**
1. רענן את דף המבחנים
2. ודא שפרסת מחדש את ה-Apps Script
3. נסה לפתוח את ה-URL ישירות בדפדפן

---

## מבנה הקובץ המלא

```
Google Sheet: "מאגר שאלות - מדור רפואה"
├── switch (NEW!)
│   ├── exam_name | status
│   ├── מבחן פתיחה חובש | ON/OFF
│   ├── מבחן סיום חובש | ON/OFF
│   ├── מבחן פתיחה מט״ב | ON/OFF
│   └── מבחן סיום מט״ב | ON/OFF
├── exam_hovesh_1 (25 questions)
├── exam_hovesh_2 (25 questions)
├── exam_metav_1 (25 questions)
└── exam_metav_2 (25 questions)
```

---

**✅ זהו! המערכת מוכנה**

עכשיו למדריכים יש שליטה מלאה על זמינות המבחנים 🎯
