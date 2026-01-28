# 🩺 REUFA 0.2 - מערכת למידה וניהול ידע רפואי
## מדור רפואה - בא״פ העורף

---

## 📋 תיאור הפרויקט

מערכת אינטרנטית מקיפה לניהול הכשרה רפואית במדור רפואה של בא״פ העורף. המערכת כוללת:
- 📚 מאגר לומדות (סרטוני הדרכה)
- 📝 מערכת בחנים ממוחשבת
- 📖 ספרות מקצועית
- 📊 דאשבורד סטטיסטיקות למדריכים

---

## 🎯 תכונות עיקריות

### 1️⃣ מערכת בחנים חכמה

**4 סוגי מבחנים:**
- מבחן פתיחה חובש (`exam_hovesh_1`)
- מבחן סיום חובש (`exam_hovesh_2`)
- מבחן פתיחה מט״ב (`exam_metav_1`)
- מבחן סיום מט״ב (`exam_metav_2`)

**מאפיינים:**
- 25 שאלות קבועות לכל מבחן
- ערבוב אקראי של סדר השאלות
- ערבוב אקראי של סדר התשובות
- שליחה כפולה: תוצאות אישיות + סטטיסטיקות אנונימיות
- ממשק נקי וידידותי

### 2️⃣ דאשבורד סטטיסטיקות מתקדם

**הגנת גישה:**
- סיסמה: `רפואה2025` או `refua2025`
- מודל סיסמה מעוצב עם אפשרות חזרה

**תצוגות סטטיסטיות:**
- 📊 3 קלפי סיכום: סה״כ תשובות, נבחנים, אחוז הצלחה
- 🔥 5 השאלות הקשות ביותר (דורש לפחות 3 תשובות)
- ❌ תרשים: שאלות שגויות לפי רמת קושי
- 🎯 תרשים: אחוז הצלחה לפי שאלה (10 הנפוצות)

**פילטרים:**
- סינון לפי מבחן (4 סוגים)
- סינון לפי נושא (טראומה/חילוץ)
- סינון לפי רמת קושי (קל/בינוני/קשה)
- סינון לפי תאריך ספציפי
- כפתור איפוס פילטרים

**עיצוב:**
- רקע gradient כתום (#ff9a56 → #ff6b6b)
- כפתורים וממשק בגוונים כתומים
- מותאם מושלם למובייל
- אנימציות חלקות
- רווחים אחידים

### 3️⃣ ארכיטקטורה נפרדת

**2 קבצי Google Sheets:**

**קובץ 1: מאגר שאלות**
- גיליונות: exam_hovesh_1, exam_hovesh_2, exam_metav_1, exam_metav_2
- כל גיליון: בדיוק 25 שאלות
- עמודות: id, question, answer1-4, correct, topic, difficulty
- Apps Script: מחזיר שאלות למבחן

**קובץ 2: סטטיסטיקות**
- גיליון: exam_statistics
- עמודות: timestamp, exam_name, question_text, topic, difficulty, is_correct
- Apps Script: שומר ומחזיר נתונים אנונימיים
- אין מידע מזהה (שם, תעודת זהות, יחידה)

---

## 🔧 מבנה הקבצים

### קבצי HTML ראשיים

```
index.html                      # עמוד בית עם תפריט ראשי + "בא״פ העורף"
lomdot2-page.html              # דף לומדות (סרטונים)
exams.html                     # דף בחירת מבחן
safrot-page.html               # דף ספרות מקצועית
instructor-dashboard.html       # דאשבורד סטטיסטיקות (כתום)
```

### 4 קבצי מבחן

```
exam-hovesh-1.html             # מבחן פתיחה חובש
exam-hovesh-2.html             # מבחן סיום חובש
exam-metav-1.html              # מבחן פתיחה מט״ב
exam-metav-2.html              # מבחן סיום מט״ב
```

**לוגיקה משותפת בכל קבצי המבחן:**
- טעינת 25 שאלות מ-Google Sheets
- ערבוב שאלות: `shuffleArray()`
- ערבוב תשובות: `shuffleAnswers()`
- מעקב זמן: `startTimer()`, `updateTimer()`
- שליחת תוצאות: `submitExam()`
  - תוצאות אישיות → RESULTS_URL
  - סטטיסטיקות אנונימיות → STATISTICS_URL

### קבצי CSS

```
styles.css                     # סגנונות משותפים
exam.css                       # סגנונות מבחנים
```

### תיקיות

```
Assets/                        # לוגואים ותמונות
  - logo1.PNG
  - logo2.PNG
  - background.JPEG
```

---

## 🚀 התקנה והגדרה

### שלב 1: הגדרת Google Sheets

**קובץ שאלות:**
1. צור Google Sheet: "מאגר שאלות - מדור רפואה"
2. צור 4 גיליונות: exam_hovesh_1, exam_hovesh_2, exam_metav_1, exam_metav_2
3. כל גיליון עם עמודות: id, question, answer1, answer2, answer3, answer4, correct, topic, difficulty
4. מלא **בדיוק 25 שאלות** בכל גיליון
5. ערכים אפשריים:
   - topic: "trauma" או "rescue"
   - difficulty: "Easy", "Medium", "Hard"
   - correct: 1-4

**קובץ סטטיסטיקות:**
1. צור Google Sheet: "סטטיסטיקות מבחנים - מדור רפואה"
2. צור גיליון: exam_statistics
3. עמודות: timestamp, exam_name, question_text, topic, difficulty, is_correct

### שלב 2: פריסת Apps Scripts

**Apps Script #1 - שאלות:**
```javascript
function doGet(e) {
  const sheet = e.parameter.sheet;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName(sheet);

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

**Apps Script #2 - סטטיסטיקות:**
```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName('exam_statistics');

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
    JSON.stringify({ success: true })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName('exam_statistics');
  const data = ws.getDataRange().getValues();
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
    JSON.stringify({ success: true, statistics: statistics })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

### שלב 3: עדכון URLs

בכל 4 קבצי המבחן + instructor-dashboard.html, עדכן:

```javascript
const SCRIPT_URL = 'YOUR_QUESTIONS_APPS_SCRIPT_URL';
const RESULTS_URL = 'YOUR_RESULTS_APPS_SCRIPT_URL';
const STATISTICS_URL = 'YOUR_STATISTICS_APPS_SCRIPT_URL';
```

---

## 📊 זרימת נתונים

### זרימת בחינה

```
1. נבחן נכנס לבחינה
   ↓
2. טעינת 25 שאלות מ-Google Sheets (SCRIPT_URL)
   ↓
3. ערבוב סדר השאלות (shuffleArray)
   ↓
4. ערבוב סדר התשובות (shuffleAnswers)
   ↓
5. נבחן משיב על כל השאלות
   ↓
6. שליחה כפולה:
   ├─→ תוצאות אישיות (RESULTS_URL)
   │   - שם מלא
   │   - תעודת זהות
   │   - ציון
   │   - תאריך
   │
   └─→ סטטיסטיקות אנונימיות (STATISTICS_URL)
       - שם מבחן
       - טקסט שאלה
       - נושא
       - רמת קושי
       - נכון/לא נכון
       (25 שורות - אחת לכל שאלה)
```

### זרימת דאשבורד

```
1. מדריך נכנס ל-instructor-dashboard.html
   ↓
2. מופיע מודל סיסמה
   ↓
3. הזנת סיסמה: רפואה2025 או refua2025
   ↓
4. טעינת כל הסטטיסטיקות (STATISTICS_URL - doGet)
   ↓
5. חישוב מדדים:
   - סה״כ תשובות
   - הערכת מספר נבחנים (÷25)
   - אחוז הצלחה כללי
   ↓
6. יצירת תרשימים (Chart.js):
   - שאלות שגויות לפי קושי
   - אחוז הצלחה לפי שאלה
   ↓
7. רשימת 5 השאלות הקשות ביותר
   ↓
8. אפשרות סינון לפי:
   - מבחן
   - נושא
   - קושי
   - תאריך
```

---

## 🎨 עיצוב ו-UI/UX

### עקרונות עיצוב

**צבעים:**
- ראשי (כתום): #ff9a56 → #ff6b6b
- טקסט: #2d3748
- משני: #718096
- רקע קלפים: לבן (#ffffff)

**Typography:**
- גופן ראשי: 'Rubik'
- תמיכה מלאה ב-RTL (עברית)
- גדלים רספונסיביים

**אנימציות:**
- fadeInDown
- fadeInUp
- slideUp (password modal)
- shake (password error)
- hover effects
- smooth transitions

### התאמה למובייל

**Breakpoints:**
- Desktop: > 768px
- Mobile: ≤ 768px
- Small Mobile: ≤ 360px

**שיפורים למובייל:**
- Grid עמודה אחת
- Padding מצומצם
- גופנים קטנים יותר
- כפתורים רחבים
- Touch-friendly (min 44px)

---

## 🔒 אבטחה ופרטיות

### אבטחה

**הגנת סיסמה:**
- דאשבורד סטטיסטיקות מוגן בסיסמה
- 2 סיסמאות אפשריות: `רפואה2025`, `refua2025`
- הצפנה בצד לקוח (לא מאובטח לגמרי - הסיסמה בקוד)

**הערה חשובה:**
זו הגנה בסיסית בלבד. לאבטחה אמיתית יש צורך ב:
- Backend authentication
- Database עם user management
- HTTPS
- Session management

### פרטיות

**נתונים אישיים (RESULTS_URL):**
- שם מלא
- תעודת זהות
- יחידה
- ציון
- **לא זמין דרך הדאשבורד**

**נתונים אנונימיים (STATISTICS_URL):**
- שם מבחן
- טקסט שאלה
- נושא
- רמת קושי
- נכון/לא נכון
- **אין שום מידע מזהה**

---

## 📱 תאימות דפדפנים

### נתמך במלואו
- ✅ Chrome/Edge (90+)
- ✅ Firefox (85+)
- ✅ Safari (14+)
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 10+)

### תלויות חיצוניות
- Chart.js 4.4.0 (CDN)
- Google Fonts (Rubik)
- FontAwesome 6.4.0
- Google Apps Script

---

## 🐛 בעיות ידועות ופתרונות

### בעיה: "Failed to fetch" בטעינת שאלות
**פתרון:**
1. ודא ש-Apps Script פרוס כ-"Anyone"
2. בדוק את ה-URL נכון
3. נסה לפתוח את ה-URL בדפדפן

### בעיה: סטטיסטיקות לא מגיעות
**פתרון:**
1. בדוק שהגיליון `exam_statistics` קיים
2. ודא שהעמודות נכונות
3. בדוק שה-Apps Script של הסטטיסטיקות נפרד

### בעיה: תרשימים לא מוצגים
**פתרון:**
1. ודא ש-Chart.js נטען (בדוק ב-DevTools)
2. בדוק שיש נתונים בגיליון
3. נסה לרענן את הדף

---

## 🔄 גרסאות

### v0.2 (נוכחית) - ינואר 2026
- ✨ דאשבורד סטטיסטיקות עם Chart.js
- ✨ עיצוב כתום מלא
- ✨ התאמה מושלמת למובייל
- ✨ הגנת סיסמה
- ✨ פילטר תאריך
- ✨ הוספת "בא״פ העורף"
- ♻️ מערכת בחנים מפושטת (25 שאלות קבועות)
- ♻️ ערבוב שאלות ותשובות
- ♻️ ארכיטקטורה נפרדת (2 Apps Scripts)
- 🐛 תיקוני באגים שונים

### v0.1 - דצמבר 2025
- 🎉 גרסה ראשונית
- מערכת בחנים בסיסית
- דפי תוכן (לומדות, ספרות)

---

## 👥 תרומה

פרויקט זה פותח עבור מדור רפואה - בא״פ העורף.

**מפתח ראשי:** Claude AI Assistant
**תאריך:** ינואר 2026

---

## 📞 תמיכה

לשאלות או בעיות:
1. בדוק את חלק "בעיות ידועות" למעלה
2. ודא שכל ה-Apps Scripts פרוסים נכון
3. בדוק את ה-URLs מעודכנים

---

## 📄 רישיון

© 2026 מדור רפואה - בא״פ העורף
כל הזכויות שמורות.

---

## 🎓 למדריכים

### גישה לדאשבורד
1. לחץ על האייקון 📊 בתחתית דף הבית
2. הזן סיסמה: `רפואה2025` או `refua2025`
3. צפה בסטטיסטיקות בזמן אמת

### פילטור נתונים
- בחר מבחן מהרשימה הנפתחת
- בחר נושא (טראומה/חילוץ)
- בחר רמת קושי
- בחר תאריך ספציפי
- לחץ "החל סינון"

### ניתוח תוצאות
- **5 השאלות הקשות** - מציג שאלות עם אחוז הצלחה נמוך
- **שאלות שגויות לפי קושי** - כמה טעויות בכל רמת קושי
- **אחוז הצלחה לפי שאלה** - 10 השאלות הנפוצות ביותר

---

## 🚀 פיתוחים עתידיים (אופציונלי)

- [ ] Backend אמיתי עם Node.js/Python
- [ ] מסד נתונים (PostgreSQL/MongoDB)
- [ ] אימות משתמשים מתקדם
- [ ] ייצוא לקבצי Excel/PDF
- [ ] דוחות אוטומטיים
- [ ] התראות למדריכים
- [ ] מערכת הודעות
- [ ] גרסת אפליקציה (PWA)
- [ ] תמיכה בשפות נוספות
- [ ] נושאים נוספים (לא רק טראומה/חילוץ)

---

**🩺 בהצלחה במדור רפואה!**
