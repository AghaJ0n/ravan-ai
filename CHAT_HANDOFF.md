# RAVAN AI — Chat Handoff

این فایل برای تحویل پروژه به چت جدید ساخته شده است تا ادامه کار بدون اتلاف زمان انجام شود.

## وضعیت فعلی
- پروژه: `AghaJ0n/ravan-ai`
- سایت: `https://aghaj0n.github.io/ravan-ai/`
- شاخه انتشار: `main`
- GitHub Pages فعال است.
- Core فشرده‌ی موجود حفظ شده و Bootstrap هنوز از payloadها و `ravan-dynamic-v13.js` استفاده می‌کند.
- لایه UI دیگر زنجیره‌ای از overrideهای v14/v15/v16/v18/v20 نیست و Consolidate شده است.

## فایل‌های فعال UI
`index.html` بعد از Core این فایل‌ها را بارگذاری می‌کند:
- `ravan-tokens-v19.css` — Design Tokens
- `ravan-layout-v19.css` — Desktop/Tablet/Mobile layout
- `ravan-components-v19.css` — Components, states, workspace styling
- `ravan-ui-v19.js` — UI chrome/state/context/filtering
- `ravan-a11y-v19.js` — Keyboard/ARIA/combobox behavior
- `ravan-icons.svg` — SVG icon sprite
- `ravan-scenic-v19.svg` — تزئین بصری Context panel

فایل‌های `ravan-ui-v14.js`, `ravan-ui-v15.js`, `ravan-ui-v16.js`, `ravan-ui-v18.js`, `ravan-ui-v20.js` و `ravan-combos-v17.js` از tree فعلی حذف شده‌اند؛ تاریخچه Git برای rollback باقی است.

## هدف محصول
RAVAN AI یک Web Application / AI Workspace فارسی RTL برای ساخت ورودی/پرامپت دقیق بر اساس مسیر اصلی زیر است:
1. نقش کاربر
2. نوع کار
3. هوش مصنوعی / مقصد AI
4. Workspace / ساخت پرامپت

بعد از تکمیل سه انتخاب اول، فرم تخصصی متناسب با همان ترکیب ساخته می‌شود.

## قانون مهم جریان
فیلد «هدف اصلی» نباید قبل از کامل شدن این سه بخش دیده شود:
`نقش → نوع کار → مقصد AI`

بعد از تکمیل هر سه، عنوان/راهنما/مثال هدف اصلی باید متناسب با همان پروفایل ساخته شود.

## قانون Combo Box
هر فیلد انتخابی باید این قابلیت‌ها را حفظ کند:
- انتخاب از پیشنهادها
- تایپ آزاد
- جست‌وجوی زنده
- فیلتر پیشنهادها
- ماوس و صفحه‌کلید
- Arrow Up/Down
- Enter
- Esc
- ARIA combobox/listbox

این رفتار اکنون در `ravan-a11y-v19.js` Consolidate شده است؛ فایل قدیمی `ravan-combos-v17.js` دیگر در runtime نیست.

## Design System فعلی
- Page background: `#F5F7FB`
- Surface: `#FFFFFF`
- Text: `#172033`
- Muted: `#667085`
- Border: `#E4E7EC`
- Primary: `#6246EA`
- Success: `#16A36A`
- Warning: `#F59E0B`
- Error: `#E5484D`
- Info: `#2F80ED`
- Font: Vazirmatn با fallback Tahoma / Segoe UI
- Radius: 10 / 14 / 18 / 24
- Spacing: سیستم 4pt
- Shadowها محدود و سبک
- Motion: حدود 160–200ms با `prefers-reduced-motion`

## معماری Layout
Desktop بزرگ:
- Navigation در سمت راست: حدود `240px`
- Main در وسط: `minmax(0,1fr)`
- Context در سمت چپ: حدود `260px`
- Header حدود `70px`
- Max width کل: `1700px`

Responsive:
- 1200–1439: سه‌ستونه فشرده‌تر
- 900–1199: Navigation به icon rail تبدیل می‌شود و Context بالای Main می‌رود
- زیر 768: تک‌ستونه، Navigation پایین صفحه و Context به Drawer تبدیل می‌شود

## UI اصلی
- Header: Brand، Global Search، Ctrl+K، Help/Settings/Theme، Account
- Navigation راست: ساخت پرامپت، پروژه‌های من، قالب‌ها، کتابخانه، تاریخچه، تنظیمات، Usage
- Main: Stepper چهارمرحله‌ای، Title، Search، Filter chips، Cards
- Context چپ: Progress، راهنمای مرحله، انتخاب‌های فعلی
- Role/Task cards: Grid responsive و انتخاب با Border + Check
- AI cards: Grid responsive
- Workspace: همان Design System با Fields Grid و comboboxهای قابل تایپ
- Iconها: SVG outline؛ Emoji برای UI production استفاده نشود

## نکات UX که باید حفظ شوند
- RTL ساختاری واقعی
- نقش/نوع کار/AI مستقل انتخاب شوند
- Back داده‌ها را حفظ کند
- Start Over از Back جدا باشد
- فیلد نامرتبط نمایش داده نشود
- `localStorage` فعلی حفظ شود
- Chrome اولویت تست اول، Edge دوم
- Focus visible و keyboard navigation حفظ شود
- Touch target موبایل حداقل حدود 44px

## آخرین تغییر معماری
بر اساس Design System مرجع کاربر، تصمیم گرفته شد که به‌جای اضافه‌کردن Override جدید، UI Consolidate شود. نتیجه اکنون در فایل‌های تفکیک‌شده‌ی Tokens / Layout / Components / UI / A11y قرار دارد و `index.html` فقط همین لایه نهایی را بعد از Core بارگذاری می‌کند.

## قدم بعدی
1. سایت زنده را روی Chrome Desktop بازبینی بصری کن.
2. با تصویر Design System مرجع مقایسه کن: Navigation باید راست و Context باید چپ باشد.
3. Flow کامل Role → Task → AI → Workspace را تست کن.
4. Role/Task search و Dynamic field comboboxها را با Mouse + Arrow + Enter + Esc تست کن.
5. عرض‌های حدود 1440، 1024، 768 و Mobile را تست کن.
6. اگر اختلاف بصری باقی بود، در یکی از سه CSS اصلی اصلاح کن؛ Override نسخه‌ای جدید نساز.
7. رفتارهای state/a11y را فقط در `ravan-ui-v19.js` یا `ravan-a11y-v19.js` اصلاح کن.

## دسترسی GitHub
اتصال فعلی برای repository زیر مجاز است:
`AghaJ0n/ravan-ai`
