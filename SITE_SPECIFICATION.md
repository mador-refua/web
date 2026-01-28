# מפרט מערכת מדור רפואה - REUFA 0.2
## Medical Division Learning Management System

---

## 📋 מטרת המערכת

**REUFA (Rescue & Emergency Unit First Aid)** היא מערכת לניהול למידה וידע עבור מדור רפואה בצה"ל.

### יעדים עיקריים:
1. **ניהול חומרי לימוד** - וידאו, מסמכים, ספרות מקצועית
2. **מערכת מבחנים דינמית** - בחנים מותאמים אישית לפי רמת קושי ונושא
3. **מעקב ביצועים** - שמירת תוצאות מבחנים ב-Google Sheets
4. **נגישות מובייל** - עיצוב Responsive לשימוש בשטח

### קהל יעד:
- חובשים בהכשרה ובקורס
- מטפלים בכירים
- מפקדי רפואה
- מדריכי קורסים

---

## 🏗️ ארכיטקטורה טכנית

### Stack טכנולוגי:
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla - ללא frameworks)
- **Backend:** Google Apps Script (Serverless)
- **Database:** Google Sheets
- **Hosting:** GitHub Pages
- **CDN:** Google Fonts, FontAwesome, Cloudflare

### עקרונות עיצוב:
- ✅ Mobile-First Responsive Design
- ✅ Progressive Web App (PWA) capabilities
- ✅ Client-Side Rendering (CSR)
- ✅ Zero-Database Architecture (Sheets as DB)
- ✅ Offline-First (cached assets)

---

## 📄 מבנה העמודים

### 1️⃣ **index.html** - עמוד הבית
**גודל:** 8.0KB
**מטרה:** Hub מרכזי לניווט למערכות המשנה

#### תכונות:
- 3 כרטיסים ראשיים: לומדות, בחנים, ספרות מקצועית
- 2 לוגואים מרכזיים (logo1.PNG, logo2.PNG)
- תמונת רקע (background.JPEG)
- אנימציות Fade-in ו-Float
- Glass-morphism UI

#### תלויות:
- `styles.css` - עיצוב משותף
- `Assets/logo1.PNG` (1.4MB)
- `Assets/logo2.PNG` (3.2MB)
- `Assets/background.JPEG` (204KB)
- Google Fonts (Rubik)
- FontAwesome 6.4.0

#### ניווט:
```
לומדות → lomdot2-page.html
בחנים → exams.html
ספרות מקצועית → safrot-page.html
```

#### אבטחה:
✅ CSP Headers
✅ X-Frame-Options: DENY
✅ X-Content-Type-Options: nosniff
✅ Referrer-Policy
✅ Permissions-Policy

---

### 2️⃣ **lomdot2-page.html** - עמוד לומדות (וידאו)
**גודל:** 16KB
**מטרה:** ספרייה דינמית של סרטוני הדרכה

#### תכונות:
- טעינה דינמית של וידאו מ-Google Sheets
- כל וידאו מוצג עם: אימוג'י, כותרת, תיאור
- השמעה ישירה דרך Google Drive Embed
- Lazy loading של iframe
- רשימה מתקפלת (Accordion)

#### מקור נתונים:
**Google Apps Script:**
```
URL: https://script.google.com/macros/s/AKfycbz.../exec
Method: GET
Sheet: "lomdot2" (עמודה: emoji, title, description, url)
```

#### מבנה Sheet:
| emoji | title | description | url |
|-------|-------|-------------|-----|
| 🩹 | הדרכת חבישה | שיטות חבישה בסיסיות | https://drive.google.com/... |

#### JavaScript Logic:
```javascript
1. fetch(SCRIPT_URL) → טעינת רשימת וידאו
2. createVideoCards() → יצירת כרטיסים
3. toggleVideo() → פתיחה/סגירה של נגן
4. iframe lazy load → טעינה רק בלחיצה
```

#### אבטחה:
✅ CSP מאפשר: `frame-src https://drive.google.com`
✅ Rate limiting: 2 שניות בין בקשות

#### UI Elements:
- Header: כפתור חזור + לוגואים קטנים (40px)
- Loading spinner
- Error handling עם הודעות ידידותיות

---

### 3️⃣ **safrot-page.html** - ספרות מקצועית
**גודל:** 15KB
**מטרה:** ספרייה דינמית של מסמכי PDF

#### תכונות:
- Grid Layout של כרטיסי PDF
- כל כרטיס: אימוג'י גדול, כותרת, תג PDF
- פתיחה ישירה של PDF ב-Google Drive
- Responsive: 2 עמודות ב-mobile, 3+ ב-desktop

#### מקור נתונים:
**Google Apps Script:**
```
URL: https://script.google.com/macros/s/AKfycbxT3zOiv2zy1F.../exec
Method: GET
Sheet: "safrot" (עמודה: emoji, title, url)
```

#### מבנה Sheet:
| emoji | title | url |
|-------|-------|-----|
| 📖 | פרוטוקול טראומה 2024 | https://drive.google.com/.../view |

#### CSS Grid:
```css
grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
gap: 14px;
```

#### אבטחה:
✅ URL Validation (חייב להתחיל ב-https://drive.google.com)
✅ HTML Escaping למניעת XSS

---

### 4️⃣ **exams.html** - קטגוריות בחנים
**גודל:** 6.4KB
**מטרה:** עמוד בחירת קטגוריית מבחן

#### תכונות:
- 3 קטגוריות:
  1. **מטפל מחלץ** (פעיל) → exams-metapel.html
  2. **מאגר כללי** (בקרוב)
  3. **אימון יחידתי** (בקרוב)

#### ניווט:
```javascript
function openCategory(type) {
  if (type === 'metapel') {
    window.location.href = 'exams-metapel.html';
  }
  // שאר הקטגוריות - לא פעילות
}
```

#### UI:
- כרטיסים עם badge: "פעיל" / "בקרוב"
- קטגוריות לא פעילות: opacity 0.6, לא ניתן ללחיצה

---

### 5️⃣ **exams-metapel.html** - רשימת מבחנים
**גודל:** 5.7KB
**מטרה:** תפריט בחירת מבחן ספציפי

#### תכונות:
- 4 מבחנים זמינים:
  1. מבחן פתיחה חובש → exam-hovesh-1.html
  2. מבחן סיום חובש → exam-hovesh-2.html
  3. מבחן פתיחה מטב → exam-metav-1.html
  4. מבחן סיום מטב → exam-metav-2.html

#### מידע על כל מבחן:
- אימוג'י (🩹/✅/🚑/⭐)
- כותרת
- תיאור: "25 שאלות · טראומה וחילוץ"
- Badge: "פעיל"

---

### 6️⃣ **exam-hovesh-1.html** - מבחן פתיחה חובש
**גודל:** 29KB
**מטרה:** מבחן דינמי עם בחירת שאלות חכמה

#### תכונות מרכזיות:

##### 🎯 מסך 1: פרטים אישיים
- שם מלא
- מספר אישי
- שם יחידה
- ולידציה: כל השדות חובה

##### 🎯 מסך 2: המבחן
- 25 שאלות בדיוק
- בחירה דינמית לפי נושא וקושי
- Progress bar
- תצוגת שאלות עם תגיות T|R + E|M|H

##### 🎯 מסך 3: תוצאות
- הצגת תשובות נכונות/שגויות
- סימון ויזואלי (ירוק/אדום)
- כפתור חזרה לתפריט

#### מקור נתונים:
**Google Apps Script - קריאה:**
```
URL: https://script.google.com/macros/s/AKfycbzNophQs_dsKlGRFmB1.../exec?sheet=exam_hovesh_1
Method: GET
Response: { success: true, questions: [...], total: 50 }
```

#### מבנה Sheet - exam_hovesh_1:
| question | answer1 | answer2 | answer3 | answer4 | correct | topic | difficulty |
|----------|---------|---------|---------|---------|---------|-------|------------|
| מהו הטיפול הראשוני בדימום? | לחץ ישיר | חוסם עורקים | עירוי | תרופות | 1 | trauma | Easy |

**Columns:**
- `question` - טקסט השאלה
- `answer1-4` - 4 תשובות אפשריות
- `correct` - מספר התשובה הנכונה (1-4)
- `topic` - "trauma" או "rescue"
- `difficulty` - "Easy", "Medium", "Hard"

#### אלגוריתם בחירת שאלות:

**התפלגות מבחן פתיחה חובש:**
```javascript
distribution: {
  trauma: {
    Easy: 4,     // 16% מסך המבחן
    Medium: 8,   // 32% מסך המבחן
    Hard: 5      // 20% מסך המבחן
  },
  rescue: {
    Easy: 4,     // 16% מסך המבחן
    Medium: 3,   // 12% מסך המבחן
    Hard: 1      // 4% מסך המבחן
  }
}
// סה"כ: 17 טראומה (68%) + 8 חילוץ (32%) = 25 שאלות
```

**שלבי הבחירה:**
```javascript
1. loadQuestions() → טעינת כל השאלות מ-Sheet
2. filter() → סינון שאלות ריקות
3. selectQuestions() → בחירה לפי distribution:
   a. סינון לפי topic + difficulty
   b. shuffleArray() → ערבוב אקראי
   c. slice(0, count) → קח כמות מבוקשת
4. shuffleArray(selected) → ערבוב סופי
5. displayQuestions() → תצוגה למשתמש
```

#### שליחת תוצאות:
**Google Apps Script - כתיבה:**
```
URL: https://script.google.com/macros/s/AKfycbzQ-px5HcK3nivAJwrHo.../exec
Method: POST
Mode: no-cors
Body: {
  name: "שם החייל",
  id: "1234567",
  unit: "יחידה",
  examType: "מבחן מקדים חובש",
  scoreTrauma: 85,
  scoreRescue: 90,
  totalScore: 87
}
```

#### חישוב ציון:
```javascript
// חישוב נפרד לטראומה וחילוץ
traumaCorrect = שאלות טראומה נכונות
traumaTotal = סך שאלות טראומה
traumaScore = (traumaCorrect / traumaTotal) * 100

rescueCorrect = שאלות חילוץ נכונות
rescueTotal = סך שאלות חילוץ
rescueScore = (rescueCorrect / rescueTotal) * 100

totalScore = (traumaCorrect + rescueCorrect) / 25 * 100
```

#### אבטחה:
✅ CSP מאפשר Google Scripts
✅ HTML Escaping בשאלות
✅ Input Validation
⚠️ console.log × 11 (debug code - צריך להסיר)

---

### 7️⃣ **exam-hovesh-2.html** - מבחן סיום חובש
**גודל:** 29KB
**מטרה:** מבחן סיום עם דגש על חילוץ

#### הבדלים מפתיחה:
**התפלגות שונה:**
```javascript
distribution: {
  trauma: {
    Easy: 2,     // 8%
    Medium: 5,   // 20%
    Hard: 3      // 12%
  },
  rescue: {
    Easy: 2,     // 8%
    Medium: 9,   // 36%
    Hard: 4      // 16%
  }
}
// סה"כ: 10 טראומה (40%) + 15 חילוץ (60%) = 25 שאלות
```

**Sheet:** אותו Sheet - `exam_hovesh_1`

---

### 8️⃣ **exam-metav-1.html** - מבחן פתיחה מטב
**גודל:** 29KB
**Sheet:** `exam_metav_1`
**התפלגות:** זהה לחובש פתיחה (70% טראומה, 30% חילוץ)

---

### 9️⃣ **exam-metav-2.html** - מבחן סיום מטב
**גודל:** 29KB
**Sheet:** `exam_metav_1`
**התפלגות:** זהה לחובש סיום (40% טראומה, 60% חילוץ)

---

## 🎨 styles.css - עיצוב משותף
**גודל:** 7.0KB

### תכונות:
- **Gradient Background:** 3 צבעים עם אנימציה
- **Glass-morphism:** backdrop-filter blur
- **RTL Support:** direction: rtl
- **Mobile-First:** breakpoints ב-360px, 400px, 600px
- **Animations:** fadeIn, fadeInUp, fadeInDown, float

### קלאסים גלובליים:
```css
.card - כרטיס בסיסי
.header - כותרת עם לוגואים
.page-title - כותרת ממורכזת
.back-btn, .home-btn - כפתורי ניווט
.loading-screen - מסך טעינה
```

---

## 🔐 אבטחה

### Security Headers (כל הדפים):
```html
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### Content Security Policy:
```
default-src 'self';
script-src 'self' 'unsafe-inline' https://script.google.com https://script.googleusercontent.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com;
font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;
img-src 'self' data: https:;
connect-src 'self' https://*.google.com https://script.google.com;
frame-src https://drive.google.com;
```

### הגנות:
✅ XSS Prevention (HTML Escaping)
✅ Clickjacking Protection (X-Frame-Options)
✅ MIME Sniffing Prevention
✅ URL Validation
⚠️ No HTTPS enforcement (GitHub Pages handles)
⚠️ No rate limiting on client side

---

## 📊 תלויות חיצוניות

### Google Services:
1. **Google Sheets** - Database
2. **Google Apps Script** - Backend API
3. **Google Drive** - Media hosting (PDF, Video)
4. **Google Fonts** - Rubik font family

### CDN:
1. **FontAwesome 6.4.0** - Icons
2. **Cloudflare** - FontAwesome delivery

### APIs בשימוש:
```
lomdot2: script.google.com/macros/s/AKfycbz.../exec
safrot: script.google.com/macros/s/AKfycbxT3zOiv2zy1F.../exec
exams (read): script.google.com/macros/s/AKfycbzNophQs_dsKlGRFmB1.../exec
exams (write): script.google.com/macros/s/AKfycbzQ-px5HcK3nivAJwrHo.../exec
```

---

## ⚠️ חולשות ובעיות ידועות

### 🔴 קריטי:

#### 1. גודל Assets
**בעיה:**
- logo1.PNG: **1.4MB** 🔴
- logo2.PNG: **3.2MB** 🔴
- **סה"כ לוגואים: 4.6MB**

**השפעה:**
- טעינה איטית במובייל (3G: ~15 שניות)
- בזבוז bandwidth
- ניקוד SEO נמוך

**פתרון:**
```bash
# דחיסה מומלצת:
logo1.PNG: 1.4MB → 100-150KB (דחיסה 90%)
logo2.PNG: 3.2MB → 100-150KB (דחיסה 95%)
```

#### 2. No-CORS Mode בשליחת תוצאות
**בעיה:**
```javascript
fetch(RESULTS_URL, {
  method: 'POST',
  mode: 'no-cors',  // ⚠️ לא יכול לקרוא response!
  ...
})
```

**השפעה:**
- לא יודעים אם השליחה הצליחה
- אין error handling אמיתי
- משתמש לא מקבל feedback

**פתרון:**
- CORS configuration ב-Apps Script
- או webhook alternative

#### 3. Client-Side Question Storage
**בעיה:**
- כל השאלות (כולל תשובות נכונות) נשלחות ל-client
- ניתן לראות תשובות ב-DevTools Console

**סיכון אבטחה:**
- רמאות קלה
- חשיפת מאגר שאלות

**פתרון:**
```javascript
// Option 1: שליחת תשובות רק אחרי הגשה
GET /questions → ללא correct field
POST /submit → מקבל ציון מהשרת

// Option 2: Hash verification
correct: sha256('answer1')
```

### 🟡 בינוני:

#### 4. Debug Code בפרודקשן
**בעיה:**
- 11 × `console.log()` בקבצי מבחן
- חשיפת לוגיקה פנימית

**פתרון:**
```javascript
// להסיר או להחליף ב:
if (DEBUG_MODE) console.log(...)
```

#### 5. Inline Event Handlers
**בעיה:**
```html
<div onclick="openExam('exam-hovesh-1.html')">
```

**חסרונות:**
- CSP דורש `unsafe-inline`
- קשה לתחזוקה
- לא scalable

**פתרון:**
```javascript
// Event delegation
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-exam]')) {
    openExam(e.target.dataset.exam);
  }
});
```

#### 6. Hard-coded URLs
**בעיה:**
```javascript
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz.../exec';
```

**חסרונות:**
- שינוי Apps Script דורש עדכון קוד
- 4 מבחנים × 2 URLs = 8 מקומות לעדכן

**פתרון:**
```javascript
// config.js
const API_ENDPOINTS = {
  questionsRead: 'https://...',
  resultsWrite: 'https://...',
};
```

#### 7. אין Retry Logic
**בעיה:**
- קריסת Apps Script → המבחן נכשל
- אין ניסיון חוזר

**פתרון:**
```javascript
async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      if (i === retries - 1) throw err;
      await sleep(2000 * (i + 1)); // exponential backoff
    }
  }
}
```

### 🟢 קל:

#### 8. אין Service Worker
**הזדמנות:**
- Offline support
- Faster loading
- PWA capabilities

#### 9. אין Analytics
**חסר:**
- מעקב שימוש
- זיהוי bottlenecks
- A/B testing

#### 10. אין Error Tracking
**חסר:**
- Sentry / LogRocket
- ניטור שגיאות בפרודקשן

---

## 📈 מדדי ביצועים (Performance)

### Page Load Times (אומדן):

**index.html:**
- 4G: ~2 שניות (בגלל לוגואים)
- 3G: ~8 שניות
- **מומלץ:** < 1.5 שניות

**exam pages:**
- First Paint: ~1 שניות
- API Response: ~2-3 שניות
- Total Interactive: ~3-5 שניות

### Lighthouse Score (צפוי):
- **Performance:** 60-70/100 (בגלל images)
- **Accessibility:** 90-95/100
- **Best Practices:** 85-90/100
- **SEO:** 95-100/100

---

## 🔄 תהליכי עבודה (Workflows)

### תרחיש 1: חייל עושה מבחן
```
1. index.html → לחיצה על "בחנים"
2. exams.html → בחירת "מטפל מחלץ"
3. exams-metapel.html → בחירת מבחן ספציפי
4. exam-hovesh-1.html:
   a. מילוי פרטים אישיים
   b. לחיצה "התחל מבחן"
   c. טעינת 25 שאלות מ-Google Sheets
   d. מענה על כל השאלות
   e. לחיצה "שלח מבחן"
   f. POST תוצאות ל-Apps Script
   g. הצגת תשובות נכונות/שגויות
5. כפתור "חזור לתפריט" → index.html
```

### תרחיש 2: מדריך מעלה שאלה חדשה
```
1. פתיחת Google Sheets
2. ניווט לגיליון exam_hovesh_1
3. הוספת שורה:
   - question: "טקסט השאלה?"
   - answer1-4: תשובות
   - correct: 1-4
   - topic: "trauma" או "rescue"
   - difficulty: "Easy"/"Medium"/"Hard"
4. שמירה
5. השאלה זמינה מיד במבחן הבא!
```

### תרחיש 3: צפייה בתוצאות
```
1. פתיחת Google Sheets - תוצאות
2. עמודות:
   - Timestamp
   - name
   - id
   - unit
   - examType
   - scoreTrauma
   - scoreRescue
   - totalScore
3. ניתוח נתונים ב-Excel/Google Sheets
```

---

## 🎯 תכנון עתידי (Roadmap)

### Phase 2 (קצר טווח):
- [ ] דחיסת לוגואים (4.6MB → 300KB)
- [ ] הסרת console.log
- [ ] הוספת retry logic
- [ ] CORS fix למשוב אמיתי

### Phase 3 (בינוני):
- [ ] מאגר כללי (קטגוריה 2)
- [ ] אימון יחידתי (קטגוריה 3)
- [ ] דשבורד מדריכים
- [ ] סטטיסטיקות real-time

### Phase 4 (ארוך טווח):
- [ ] PWA עם offline support
- [ ] Multi-language (אנגלית)
- [ ] Mobile app (React Native)
- [ ] Admin panel

---

## 📚 תיעוד קיים

### קבצי MD:
1. **EXAMS_SETUP.md** (7KB) - הדרכת הגדרת מבחנים
2. **LOMDOT2_SETUP.md** (4.3KB) - הדרכת הגדרת וידאו
3. **SAFROT_SETUP.md** (4.6KB) - הדרכת הגדרת ספרות
4. **SECURITY.md** (5.6KB) - מדיניות אבטחה

---

## 👥 Stakeholders

### משתמשי קצה:
- חיילים בקורס חובש
- חיילים בקורס מטפל בכיר
- מדריכי רפואה

### מנהלי מערכת:
- קצין רפואה ראשי
- מפקד בית ספר
- מדריכים ראשיים

### מפתחים:
- מדור רפואה IT
- קבלני חוץ (אם יש)

---

## 🏆 נקודות חוזק

1. ✅ **Zero Infrastructure** - GitHub Pages חינם
2. ✅ **Serverless** - Apps Script ללא ניהול
3. ✅ **Mobile-First** - עובד מעולה בשטח
4. ✅ **Easy Updates** - עדכון Sheets = עדכון מיידי
5. ✅ **Low Maintenance** - אין DB לנהל
6. ✅ **Scalable** - Google Sheets עד 10M cells
7. ✅ **Cost-Effective** - כמעט $0

---

## 📞 Support & Contact

**GitHub Repository:**
https://github.com/drhhhh26/REUFA_0.2

**Issues & Bugs:**
https://github.com/drhhhh26/REUFA_0.2/issues

**Pull Requests:**
https://github.com/drhhhh26/REUFA_0.2/pulls

---

## 🔖 Version History

- **v0.1** - MVP עם מבחנים סטטיים
- **v0.2** - Current:
  - מבחנים דינמיים
  - לומדות + ספרות
  - תגיות T|R + E|M|H
  - Security headers
  - Background + Logos

---

**נוצר:** דצמבר 2024
**עדכון אחרון:** 24.12.2024
**מנהל פרויקט:** מדור רפואה - צה"ל
