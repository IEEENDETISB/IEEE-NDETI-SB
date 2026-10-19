# دليل حل مشكلة مزامنة Google Drive مع معرض صور IEEE NDETI

## الرابط الحالي المعتمد في الموقع (`SCRIPT_URL`):
`https://script.google.com/macros/s/AKfycbyx1i2GvBTk1_6hcznqg7NDW14Wc3ZjVZvFKvsJeyGgARWNTA6D3_CwlydmVA5Rsao/exec`
✅ تم ربط هذا الرابط بنجاح وجلب الألبومات والصور مباشرة ومصنفة من Google Drive.

وهذا يعني أن مشروع Google Apps Script المنشور لا يحتوي على دالة باسم `doGet`، أو تم نشره دون حفظ الدالة.

---

## الحل بخطوات بسيطة (يستغرق دقيقتين فقط):

### الخطوة 1: ضبط صلاحيات مجلد Google Drive
1. افتح رابط مجلد الصور:
   [https://drive.google.com/drive/folders/1LgDs__LAVqmRxzhojH3lXebktwr0VH-y](https://drive.google.com/drive/folders/1LgDs__LAVqmRxzhojH3lXebktwr0VH-y)
2. اضغط كليك يمين على اسم المجلد واشتر **Share** (مشاركة).
3. تحت **General access** (الوصول العام)، تأكد من اختياره:
   👉 **Anyone with the link** (أي شخص لديه الرابط) وتعيين الصفة **Viewer** (عارض).
4. اضغط **Done** (تم).

---

### الخطوة 2: إنشاء ونشر Google Apps Script
1. ادخل على الرابط التالي بحساب جوجل الخاص بك:
   [https://script.google.com](https://script.google.com)
2. اضغط على زر **New project** (مشروع جديد) أعلى اليسار (أو افتح مشروعك الحالي إذا كان لديك).
3. امسح أي كود مكتوب داخل نافذة `Code.gs`، وضع الكود التالي بالكامل:

```javascript
const FOLDER_ID = "1LgDs__LAVqmRxzhojH3lXebktwr0VH-y";

function doGet(e) {
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const images = [];

    function collectImages(currentFolder) {
      const files = currentFolder.getFiles();
      while (files.hasNext()) {
        const file = files.next();
        const mime = file.getMimeType();
        
        if (mime.indexOf('image/') !== -1) {
          const fileId = file.getId();
          images.push({
            name: file.getName().replace(/\.[^/.]+$/, ""),
            url: "https://lh3.googleusercontent.com/d/" + fileId,
            driveUrl: "https://drive.google.com/file/d/" + fileId + "/view",
            date: file.getDateCreated().getTime()
          });
        }
      }

      const subFolders = currentFolder.getFolders();
      while (subFolders.hasNext()) {
        collectImages(subFolders.next());
      }
    }

    collectImages(folder);

    images.sort((a, b) => b.date - a.date);

    return ContentService.createTextOutput(JSON.stringify(images))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. اضغط على أيقونة الحفظ (💾) أو **Ctrl + S**.
5. من أعلى اليمين اضغط على زر **Deploy** (نشر) ⬅️ ثم اختر **New deployment** (نشر جديد).
6. اضغط على أيقونة الترس ⚙️ بجانب "Select type" واختر **Web app**.
7. اضبط البيانات كالتالي:
   - **Description**: `IEEE NDETI Gallery Sync`
   - **Execute as**: `Me (<حسابك>)`
   - **Who has access**: `Anyone` *(مهم جداً حتى يتمكن زوار الموقع من رؤية الصور)*
8. اضغط **Deploy**.
9. ستظهر نافذة تطلب منح الصلاحيات (**Authorize access**):
   - اختر حساب جوجل الخاص بك.
   - إذا ظهرت رسالة تحذير "Google hasn't verified this app"، اضغط على **Advanced** (خيارات متقدمة) ثم **Go to Untitled project (unsafe)**.
   - اضغط **Allow** (سماح).
10. سيظهر لك رابط الـ **Web app URL** (ينتهي بـ `/exec`). قم بنسخه.

---

### الخطوة 3: تحديث الرابط في الموقع
ضع الرابط الجديد الذي نسخته بدلاً من الرابط القديم في:
1. `gallery.html` في السطر:
   ```javascript
   const SCRIPT_URL = 'الرابط_الجديد_هنا';
   ```
2. `index.html` في السطر:
   ```javascript
   const SCRIPT_URL = 'الرابط_الجديد_هنا';
   ```

بمجرد وضع الرابط، ستختفي رسالة التنبيه الصفراء تلقائياً، وستظهر صور مجلد Drive مباشرة في الموقع!
أيضاً يمكنك إرسال الرابط هنا في المحادثة وسأقوم بوضعه وتحديثه لك فوراً.
