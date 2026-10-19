/**
 * ============================================================================
 * IEEE NDETI Student Branch - Google Drive Photo Sync Script (Google Apps Script)
 * ============================================================================
 * 
 * مجلد صور فعاليات الفرع الطلابي:
 * https://drive.google.com/drive/folders/1LgDs__LAVqmRxzhojH3lXebktwr0VH-y
 * 
 * طريقة الاستخدام:
 * 1. افتح https://script.google.com
 * 2. أنشئ مشروعاً جديداً (New Project) أو افتح مشروعك الحالي.
 * 3. استبدل أي كود موجود في Code.gs بهذا الكود كاملاً واحفظ (Ctrl + S).
 * 4. اضغط على Deploy (نشر) أعلى اليمين -> ثم New deployment (نشر جديد).
 * 5. اضغط على أيقونة الترس بجانب "Select type" واختر "Web app" (تطبيق ويب).
 * 6. اضبط الإعدادات التالية بدقة:
 *    - Description: IEEE NDETI Gallery Sync
 *    - Execute as: Me (حسابك الشخصي)
 *    - Who has access: Anyone (أي شخص - مهم جداً)
 * 7. اضغط Deploy ووافق على الأذونات (Authorize access -> متقدم -> انتقال).
 * 8. انسخ رابط الـ Web app URL (الذي ينتهي بـ /exec) وضعه في متغير SCRIPT_URL
 *    في ملفي gallery.html و index.html.
 */

const FOLDER_ID = "1LgDs__LAVqmRxzhojH3lXebktwr0VH-y";

function doGet(e) {
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const images = [];

    // فحص المجلد الرئيسي وأي مجلدات فرعية بداخله
    function collectImages(currentFolder) {
      const files = currentFolder.getFiles();
      while (files.hasNext()) {
        const file = files.next();
        const mime = file.getMimeType();
        
        // التحقق من أن الملف صورة (jpg, png, webp, jpeg, etc.)
        if (mime.indexOf('image/') !== -1) {
          const fileId = file.getId();
          images.push({
            name: file.getName().replace(/\.[^/.]+$/, ""), // اسم الصورة
            url: "https://lh3.googleusercontent.com/d/" + fileId,
            driveUrl: "https://drive.google.com/file/d/" + fileId + "/view",
            date: file.getDateCreated().getTime()
          });
        }
      }

      // البحث في المجلدات الفرعية إن وُجدت
      const subFolders = currentFolder.getFolders();
      while (subFolders.hasNext()) {
        collectImages(subFolders.next());
      }
    }

    collectImages(folder);

    // ترتيب الصور تلقائياً من الأحدث إلى الأقدم
    images.sort(function(a, b) {
      return b.date - a.date;
    });

    // إرجاع الصور بصيغة JSON مع دعم CORS لجميع المتصفحات
    return ContentService.createTextOutput(JSON.stringify(images))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
