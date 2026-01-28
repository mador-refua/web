# הגדרת מערכת מבחנים - Google Sheets + Apps Script

מדריך זה מסביר כיצד להגדיר את מערכת המבחנים עם 4 גליונות נפרדים.

---

## 📊 שלב 1: יצירת Google Sheet עם 4 גליונות

### 1.1 צור Google Sheet חדש
- קרא לו: **"מאגר שאלות - מדור רפואה"**
- זה יהיה הקובץ המרכזי לכל המבחנים

### 1.2 צור 4 גליונות (Sheets)

1. **גליון ראשון:** שנה את השם ל-`exam_hovesh_1`
   - מבחן פתיחה חובש

2. **גליון שני:** הוסף גליון חדש וקרא לו `exam_hovesh_2`
   - מבחן סיום חובש

3. **גליון שלישי:** הוסף גליון חדש וקרא לו `exam_metav_1`
   - מבחן פתיחה מט״ב

4. **גליון רביעי:** הוסף גליון חדש וקרא לו `exam_metav_2`
   - מבחן סיום מט״ב

**⚠️ חשוב:** השמות חייבים להיות **בדיוק** כמו למעלה!

---

## 📝 שלב 2: מבנה העמודות

בכל אחד מהגליונות, הוסף את העמודות הבאות (שורה 1 = כותרות):

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| id | question | answer1 | answer2 | answer3 | answer4 | correct | topic | difficulty |

### הסבר על העמודות:

- **id** - מספר השאלה (1-25)
- **question** - טקסט השאלה
- **answer1-4** - 4 תשובות אפשריות
- **correct** - מספר התשובה הנכונה (1, 2, 3, או 4)
- **topic** - נושא השאלה:
  - `trauma` (טראומה)
  - `rescue` (חילוץ)
- **difficulty** - רמת קושי:
  - `Easy` (קל)
  - `Medium` (בינוני)
  - `Hard` (קשה)

---

## 🎯 שלב 3: הוספת שאלות

### עקרונות חשובים:

1. **כל גליון מכיל בדיוק 25 שאלות** (id מ-1 עד 25)
2. **אין הגרלה** - המערכת מציגה את השאלות בדיוק כפי שהן בגליון
3. **כל הנבחנים מקבלים את אותן השאלות** באותו הסדר
4. **המדריך שולט על התפלגות הנושאים והקושי** על ידי בחירת 25 השאלות

### דוגמה לגליון:

| id | question | answer1 | answer2 | answer3 | answer4 | correct | topic | difficulty |
|----|----------|---------|---------|---------|---------|---------|-------|------------|
| 1 | מהו הטיפול הראשוני בדימום חיצוני? | לחץ ישיר | חוסם עורקים | עירוי נוזלים | תרופות | 1 | trauma | Easy |
| 2 | איך מטפלים בשבר פתוח? | כיסוי סטרילי ולחץ | רק קיבוע | רק חבישה | לא לטפל | 1 | trauma | Medium |
| 3 | מהו סימן למצב הלם? | דופק מהיר וחלש | חום גבוה | כאב ראש | שיעול | 1 | trauma | Hard |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 25 | שאלה אחרונה | תשובה 1 | תשובה 2 | תשובה 3 | תשובה 4 | 1 | rescue | Medium |

---

## 💻 שלב 4: יצירת Apps Script

### 4.1 פתיחת Apps Script
1. ב-Google Sheet, לחץ על **Extensions** → **Apps Script**
2. מחק את הקוד הקיים

### 4.2 הדבק את הקוד הזה:

```javascript
function doGet(e) {
  const sheetName = e.parameter.sheet || 'exam_hovesh_1'; // ברירת מחדל
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName(sheetName);

  if (!ws) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: 'Sheet not found: ' + sheetName
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const data = ws.getDataRange().getValues();
  const headers = data[0]; // שורת כותרות
  const rows = data.slice(1); // כל השאלות

  const questions = rows
    .filter(row => row[0] && row[0].toString().trim() !== '') // רק שאלות לא ריקות
    .map(row => {
      let obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });

  return ContentService.createTextOutput(
    JSON.stringify({
      success: true,
      questions: questions,
      total: questions.length
    })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

### 4.3 פריסת Apps Script
1. שמור את הקוד (Ctrl+S)
2. לחץ על **Deploy** → **New deployment**
3. לחץ על ⚙️ ליד "Select type" ובחר **Web app**
4. הגדרות:
   - **Execute as:** Me
   - **Who has access:** Anyone
5. לחץ **Deploy**
6. **העתק את ה-Web app URL** שקיבלת

**דוגמה ל-URL:**
```
https://script.google.com/macros/s/AKfycby.../exec
```

---

## 🔗 שלב 5: עדכון קבצי המבחנים

קבצי ה-HTML כבר מוגדרים עם השמות הנכונים של הגליונות:

1. **exam-hovesh-1.html** → שואב מ-`exam_hovesh_1`
2. **exam-hovesh-2.html** → שואב מ-`exam_hovesh_2`
3. **exam-metav-1.html** → שואב מ-`exam_metav_1`
4. **exam-metav-2.html** → שואב מ-`exam_metav_2`

**אין צורך לשנות כלום בקבצי ה-HTML** - הם כבר מוגדרים נכון!

---

## 📋 סיכום התפלגות מומלצת

אלה הן המלצות בלבד - **אתה שולט על ההתפלגות** על ידי בחירת השאלות:

### מבחני פתיחה (hovesh-1, metav-1):
- **70% טראומה / 30% חילוץ** (17 טראומה, 8 חילוץ)
- דגש על: Easy ו-Medium

### מבחני סיום (hovesh-2, metav-2):
- **40% טראומה / 60% חילוץ** (10 טראומה, 15 חילוץ)
- דגש על: Medium ו-Hard

**אבל זה רק המלצה!** אתה יכול לבחור כל התפלגות שאתה רוצה.

---

## ✅ בדיקה

1. פתח אחד מקבצי המבחנים בדפדפן
2. פתח **Console** (F12)
3. אמור לראות:
   ```
   ✅ נטענו 25 שאלות מהגיליון
   ```
4. כל שאלה תציג **2 tags** בצד ימין:
   - **T** או **R** (Trauma / Rescue)
   - **E**, **M**, או **H** (Easy / Medium / Hard)
   - לדוגמה: `T | M` = שאלת טראומה בינונית

---

## 🔧 פתרון תקלות

### "Sheet not found"
- ודא שהשם של הגליון בדיוק `exam_hovesh_1`, `exam_hovesh_2`, `exam_metav_1`, או `exam_metav_2`

### "נדרשות בדיוק 25 שאלות בגיליון, נמצאו X"
- בדוק שבגליון יש בדיוק 25 שורות עם id מ-1 עד 25
- וודא שכל השורות מלאות (אין שורות ריקות)

### Tag לא מוצג
- בדוק ב-Console שהשאלות מכילות:
  - `topic: "trauma"` או `"rescue"`
  - `difficulty: "Easy"/"Medium"/"Hard"`

---

**נוצר עבור מדור רפואה** 🩺

**המערכת עודכנה להיות פשוטה יותר:**
- אין הגרלה אוטומטית
- המדריך שולט על כל השאלות
- כל הנבחנים מקבלים אותן שאלות
- קל יותר לנהל ולעקוב
