# אבטחת האתר - REUFA 0.2

## 🔒 שכבות אבטחה

### 1. Security Headers

#### Content Security Policy (CSP)
```
default-src 'self'
script-src 'self' 'unsafe-inline' https://script.google.com
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com
font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com
connect-src 'self' https://script.google.com
frame-src https://drive.google.com
```

**מה זה מונע:**
- ✅ XSS (Cross-Site Scripting) attacks
- ✅ טעינת סקריפטים זדוניים
- ✅ Data injection attacks

#### X-Frame-Options: DENY
**מה זה מונע:**
- ✅ Clickjacking attacks
- ✅ הטמעת האתר ב-iframe זדוני

#### X-Content-Type-Options: nosniff
**מה זה מונע:**
- ✅ MIME type sniffing attacks
- ✅ ביצוע קבצים שאינם מהסוג הנכון

#### Referrer-Policy: strict-origin-when-cross-origin
**מה זה מונע:**
- ✅ דליפת מידע ל-sites חיצוניים
- ✅ חשיפת URLs רגישים

#### Permissions-Policy
```
geolocation=(), microphone=(), camera=()
```

**מה זה מונע:**
- ✅ גישה לא מורשית למיקום
- ✅ גישה למצלמה/מיקרופון

---

### 2. Input Validation & Sanitization

#### HTML Escaping
```javascript
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}
```

**מה זה מונע:**
- ✅ XSS דרך תוכן מ-Google Sheets
- ✅ HTML injection

#### URL Validation
```javascript
function isValidUrl(url) {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' &&
           (urlObj.hostname === 'drive.google.com' ||
            urlObj.hostname === 'script.google.com' ||
            urlObj.hostname === 'script.googleusercontent.com');
}
```

**מה זה מונע:**
- ✅ Open redirect attacks
- ✅ קישורים לאתרים זדוניים
- ✅ JavaScript: protocol injection

#### Length Limiting
```javascript
title: String(v.title).substring(0, 200)
emoji: String(v.emoji || '🎥').substring(0, 10)
```

**מה זה מונע:**
- ✅ Buffer overflow
- ✅ DoS דרך תוכן ארוך מדי

---

### 3. Rate Limiting

```javascript
const RATE_LIMIT_MS = 2000; // 2 שניות בין טעינות
```

**מה זה מונע:**
- ✅ Spam של בקשות
- ✅ DoS attacks
- ✅ שימוש לרעה ב-API

---

### 4. Secure Window Opening

```javascript
const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
newWindow.opener = null;
```

**מה זה מונע:**
- ✅ Reverse tabnabbing attacks
- ✅ גישה של חלון חדש לחלון המקורי
- ✅ Phishing attacks

---

### 5. HTTPS Only

**כל ה-resources:**
- ✅ Google Fonts: HTTPS
- ✅ FontAwesome CDN: HTTPS + crossorigin + referrerpolicy
- ✅ Google Apps Script: HTTPS only
- ✅ Drive links: HTTPS only

**מה זה מונע:**
- ✅ Man-in-the-middle attacks
- ✅ Packet sniffing
- ✅ Data tampering

---

### 6. Error Handling

```javascript
catch (error) {
    console.error('שגיאה בטעינת סרטונים');
    showError('לא ניתן לטעון את הסרטונים כרגע. אנא נסה שוב מאוחר יותר.');
}
```

**מה זה מונע:**
- ✅ חשיפת מידע רגיש בשגיאות
- ✅ Stack traces לתוקפים
- ✅ Information disclosure

---

### 7. Safe Navigation

```javascript
window.location.href = './index.html'; // מניעת open redirect
```

**מה זה מונע:**
- ✅ Open redirect vulnerabilities
- ✅ Phishing דרך redirects

---

## 🛡️ מה האתר **לא** עושה

### ❌ לא נשמר מידע רגיש
- אין Cookies
- אין localStorage של מידע אישי
- אין sessionStorage של נתונים רגישים

### ❌ לא מאפשר כתיבה
- Google Sheets: **READ-ONLY**
- אין upload של קבצים
- אין שליחת נתונים חוץ מתוצאות מבחנים

### ❌ לא משתמש ב-eval או קוד דינמי
- אין `eval()`
- אין `Function()`
- אין `setTimeout/setInterval` עם strings

---

## 📋 Checklist אבטחה

- [x] CSP Headers
- [x] X-Frame-Options
- [x] X-Content-Type-Options
- [x] Referrer-Policy
- [x] Permissions-Policy
- [x] HTTPS Enforcement
- [x] Input Validation
- [x] HTML Escaping
- [x] URL Validation
- [x] Rate Limiting
- [x] Secure Window Opening
- [x] Error Handling
- [x] No eval/Function
- [x] No dangerous innerHTML (רק עם sanitization)
- [x] CORS properly configured
- [x] CDN resources with crossorigin

---

## 🔧 המלצות נוספות

### לשרת (אם יהיה):
1. הוספת HSTS headers
2. Certificate pinning
3. הגבלת rate למעבר לכתובת IP
4. WAF (Web Application Firewall)

### למפתחים:
1. לעדכן dependencies באופן קבוע
2. לבדוק vulnerabilities ב-CDNs
3. לעשות security audits תקופתיים
4. לבדוק את Google Apps Script permissions

---

## 🚨 דיווח על בעיות אבטחה

אם מצאת בעיית אבטחה, אנא:
1. **אל** תפרסם אותה פומבית
2. דווח ישירות למנהלי המערכת
3. תאר את הבעיה בפירוט
4. צרף POC (Proof of Concept) אם אפשרי

---

## 📚 מקורות ומידע נוסף

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Secure Headers](https://securityheaders.com/)
- [Google Apps Script Security](https://developers.google.com/apps-script/guides/security)

---

**עדכון אחרון:** 2025-12-20
**גרסה:** 0.2
**סטטוס:** 🟢 מאובטח
