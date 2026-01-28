# הגדרת מערכת סטטיסטיקות - Statistics Dashboard

מדריך זה מסביר כיצד להגדיר את מערכת הסטטיסטיקות האנונימית **בקובץ נפרד**.

---

## 📊 שלב 1: יצירת Google Sheet לסטטיסטיקות

### 1.1 צור Google Sheet **חדש ונפרד**
- קרא לו: **"סטטיסטיקות מבחנים - מדור רפואה"**
- זה קובץ **נפרד לגמרי** מקובץ השאלות!

⚠️ **חשוב:** אל תוסיף את הגליון הזה לקובץ הקיים של השאלות - זה קובץ חדש לגמרי!

### 1.2 צור גליון בשם `exam_statistics`

שנה את השם של הגליון הראשון ל-`exam_statistics` **בדיוק**!

---

## 📝 שלב 2: מבנה העמודות

בגליון `exam_statistics`, הוסף את העמודות הבאות (שורה 1 = כותרות):

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| timestamp | exam_name | question_text | topic | difficulty | is_correct |

### הסבר על העמודות:

- **timestamp** - תאריך ושעה (אוטומטי)
- **exam_name** - שם המבחן (מבחן פתיחה חובש, מבחן סיום מט״ב, וכו')
- **question_text** - טקסט השאלה המלא
- **topic** - נושא (trauma / rescue)
- **difficulty** - רמת קושי (Easy / Medium / Hard)
- **is_correct** - האם הנבחן ענה נכון (TRUE / FALSE)

**⚠️ חשוב:** אין עמודת שם, אין עמודת ת"ז - **אנונימי לחלוטין!**

---

## 💻 שלב 3: Apps Script לסטטיסטיקות (קובץ נפרד!)

### 3.1 פתיחת Apps Script בקובץ הסטטיסטיקות

1. ב-Google Sheet של **"סטטיסטיקות מבחנים"**, לחץ על **Extensions** → **Apps Script**
2. מחק את כל הקוד הקיים

### 3.2 הדבק את הקוד הזה:

```javascript
// Apps Script לסטטיסטיקות מבחנים - קובץ נפרד!
// מטפל רק בשמירה ושליפה של סטטיסטיקות אנונימיות

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // בדיקה שזה שליחת סטטיסטיקות (array של תשובות)
    if (!data.statistics || !Array.isArray(data.statistics)) {
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, error: 'Invalid data: statistics array required' })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ws = ss.getSheetByName('exam_statistics');

    if (!ws) {
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, error: 'Sheet not found: exam_statistics' })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // הוספת כל תשובה כשורה
    data.statistics.forEach(stat => {
      ws.appendRow([
        new Date(),
        stat.exam_name,
        stat.question_text,
        stat.topic,
        stat.difficulty,
        stat.is_correct
      ]);
    });

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: 'Statistics saved successfully',
        count: data.statistics.length
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ws = ss.getSheetByName('exam_statistics');

    if (!ws) {
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, error: 'Sheet not found: exam_statistics' })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const data = ws.getDataRange().getValues();

    // בדיקה שיש נתונים
    if (data.length <= 1) {
      return ContentService.createTextOutput(
        JSON.stringify({ success: true, statistics: [], total: 0 })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const headers = data[0];
    const rows = data.slice(1);

    const statistics = rows.map(row => {
      let obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        statistics: statistics,
        total: statistics.length
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 3.3 פריסת Apps Script

1. שמור את הקוד (Ctrl+S)
2. לחץ על **Deploy** → **New deployment**
3. לחץ על ⚙️ ליד "Select type" ובחר **Web app**
4. הגדרות:
   - **Execute as:** Me
   - **Who has access:** Anyone
5. לחץ **Deploy**
6. **⭐ העתק את ה-Web app URL** - תצטרך אותו!

**דוגמה ל-URL:**
```
https://script.google.com/macros/s/AKfycby.../exec
```

---

## 🔗 שלב 4: עדכון קבצי המבחנים והדאשבורד

### 4.1 עדכן את ה-STATISTICS_URL בכל קובץ מבחן

**בכל 4 הקבצים הבאים:**
- `exam-hovesh-1.html`
- `exam-hovesh-2.html`
- `exam-metav-1.html`
- `exam-metav-2.html`

**מצא את השורה:**
```javascript
const STATISTICS_URL = 'YOUR_STATISTICS_APPS_SCRIPT_URL_HERE';
```

**החלף ב-URL שקיבלת:**
```javascript
const STATISTICS_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
```

### 4.2 עדכן את ה-STATISTICS_URL ב-Dashboard

**בקובץ `instructor-dashboard.html`:**

**מצא את השורה:**
```javascript
const STATISTICS_URL = 'YOUR_STATISTICS_APPS_SCRIPT_URL_HERE';
```

**החלף ב-URL שקיבלת:**
```javascript
const STATISTICS_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
```

---

## 📊 שלב 5: גישה ל-Dashboard

פשוט פתח את הקובץ:
```
instructor-dashboard.html
```

או לחץ על "סטטיסטיקות" בעמוד הבית.

**אין צורך בסיסמה!** כל מי שיודע את ה-URL יכול לראות.

---

## ✅ בדיקה

1. השלם מבחן אחד מלא (25 שאלות)
2. פתח את Google Sheet → **"סטטיסטיקות מבחנים"**
3. פתח את הגליון `exam_statistics`
4. אמור לראות **25 שורות חדשות** (שורה אחת לכל שאלה)
5. כל שורה מכילה:
   - Timestamp (מתי נשלח)
   - Exam name (איזה מבחן)
   - Question text (השאלה המלאה)
   - Topic (trauma / rescue)
   - Difficulty (Easy / Medium / Hard)
   - Is correct (TRUE / FALSE)
6. פתח את `instructor-dashboard.html`
7. אמור לראות:
   - "סה"כ תשובות: 25"
   - "נבחנים (הערכה): 1"
   - תרשימים עם הנתונים

---

## 🎯 מה הדאשבורד יציג?

**📈 סטטיסטיקות כלליות:**
- סה"כ תשובות שנשלחו
- הערכת מספר נבחנים (חלוקה ב-25)
- אחוז הצלחה כללי
- כמה שאלות ייחודיות יש

**📊 תרשימים אינטראקטיביים:**
- **תרשים עוגה** - ביצועים לפי נושא (טראומה vs חילוץ)
- **תרשים עמודות** - ביצועים לפי רמת קושי (Easy/Medium/Hard)
- **תרשים אופקי** - אחוז הצלחה ל-10 השאלות הנפוצות ביותר

**🔥 תובנות:**
- 5 השאלות הקשות ביותר
- תגיות צבעוניות (נושא, קושי)
- כמה אנשים ענו על כל שאלה

**🔍 פילטרים:**
- סינון לפי מבחן ספציפי
- סינון לפי נושא (טראומה/חילוץ)
- סינון לפי רמת קושי

---

## 🗂️ סיכום המבנה

**יש לך עכשיו 2 Apps Scripts נפרדים:**

### Apps Script #1: קובץ השאלות (קיים)
- **קובץ:** "מאגר שאלות - מדור רפואה"
- **מטרה:** טוען שאלות למבחנים
- **Endpoint:** `doGet(?sheet=exam_hovesh_1)`
- **URL:** SCRIPT_URL (קיים)

### Apps Script #2: קובץ הסטטיסטיקות (חדש!)
- **קובץ:** "סטטיסטיקות מבחנים - מדור רפואה"
- **מטרה:** שומר ומציג סטטיסטיקות אנונימיות
- **Endpoints:**
  - `doPost()` - שמירת תוצאות
  - `doGet()` - שליפת תוצאות לדאשבורד
- **URL:** STATISTICS_URL (חדש!)

**יתרונות:**
- ✅ הפרדה מלאה בין שאלות לסטטיסטיקות
- ✅ קל לנהל ולשתף
- ✅ פרטיות נוספת
- ✅ אין קשר בין הקבצים

---

## 🔧 פתרון תקלות

### "Sheet not found: exam_statistics"
- ודא שהגליון נקרא **בדיוק** `exam_statistics`
- ודא שהקוד רץ בקובץ הנכון (קובץ הסטטיסטיקות!)

### "סה"כ תשובות: 0" בדאשבורד
- בדוק שעדכנת את `STATISTICS_URL` בכל 5 הקבצים
- בדוק שה-URL נכון (העתקת את כל ה-URL)
- בדוק שיש נתונים בגליון `exam_statistics`

### סטטיסטיקות לא נשלחות
- בדוק ב-Console (F12) האם יש שגיאות
- ודא ש-Apps Script פרוס עם **"Who has access: Anyone"**
- נסה לעשות מבחן חדש ובדוק שוב

---

**נוצר עבור מדור רפואה** 🩺

**מערכת סטטיסטיקות אנונימית מלאה:**
- אין שם, אין ת"ז
- רק נתונים על ביצועים
- דאשבורד מקצועי ויפה
- פשוט להגדיר ולהשתמש
