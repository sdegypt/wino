const mysql = require('mysql2');
const util = require('util');

// إعداد الاتصال بقاعدة البيانات
const db = mysql.createConnection({
  host: '89.163.214.37',             // عنوان السيرفر (MaznHost)
  user: 'amlhabra_brak',             // اسم المستخدم
  password: 'hSgMaUAGjPdGa7ZfRM6T',  // كلمة المرور
  database: 'amlhabra_brak',         // اسم قاعدة البيانات
  port: 3306,                        // البورت الافتراضي لـ MySQL
  charset: 'utf8mb4',               // الترميز لدعم الرموز العربية والإيموجي
  connectTimeout: 30000,            // مهلة الاتصال
  acquireTimeout: 30000             // مهلة الحصول على اتصال
});

// محاولة الاتصال
db.connect((err) => {
  if (err) {
    console.error("❌ لم يتم الاتصال بقاعدة البيانات:", err.message);
    console.error("تفاصيل الخطأ:", err);
    return;
  }
  console.log("✅ تم الاتصال بقاعدة البيانات بنجاح");
});

// معالج أخطاء الاتصال بعد التشغيل
db.on('error', (err) => {
  console.error('⚠️ خطأ في الاتصال بقاعدة البيانات:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('🔁 تم فقدان الاتصال، يُفضل إعادة تشغيل الاتصال أو السيرفر.');
    // يمكن إضافة منطق لإعادة الاتصال هنا لاحقًا
  } else {
    throw err;
  }
});

// تحويل دوال الاستعلام إلى وعود (Promises)
db.query = util.promisify(db.query);

module.exports = db;