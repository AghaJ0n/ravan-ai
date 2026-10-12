/* RAVAN AI — contextual guides for functional sidebar sections */
(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

const guides={
 'پروژه‌های من':{
   key:'projects',
   eyebrow:'مدیریت و ادامه کارها',
   title:'اینجا مرکز پروژه‌های در حال انجام و ذخیره‌شده شماست',
   text:'هر کاری که در فرم حرفه‌ای ذخیره می‌کنید، همراه با اطلاعات اصلی و وضعیت آمادگی در این بخش قابل مدیریت است. همچنین می‌توانید پروفایل‌های اخیر RAVAN را دوباره ادامه دهید.',
   steps:[
     ['۱','برای ادامه کار','پروژه موردنظر را پیدا کنید و «باز کردن» را بزنید.'],
     ['۲','برای شروع مشابه','از «ساخت مشابه» استفاده کنید تا ساختار پروژه حفظ شود ولی موضوع جدیدی بسازید.'],
     ['۳','برای کار تازه','«پرامپت جدید» را بزنید و مسیر نقش → نوع کار → AI را از ابتدا شروع کنید.']
   ],
   tip:'پروژه‌ها روی همین مرورگر ذخیره می‌شوند؛ برای کارهای مهم از بخش تنظیمات یک نسخه پشتیبان هم تهیه کنید.'
 },
 'قالب‌ها':{
   key:'templates',
   eyebrow:'شروع سریع با ساختار آماده',
   title:'قالب مناسب را بر اساس نتیجه‌ای که می‌خواهید انتخاب کنید',
   text:'قالب‌ها نقطه شروع هستند، نه خروجی نهایی. با انتخاب یک قالب، نقش، نوع کار، مقصد AI و یک هدف پیشنهادی برای شما آماده می‌شود و بعد می‌توانید همه جزئیات را تغییر دهید.',
   steps:[
     ['۱','هدف را پیدا کنید','قالبی را انتخاب کنید که به خروجی موردنظر شما نزدیک‌تر است.'],
     ['۲','قالب را اعمال کنید','با «استفاده از قالب» وارد Workspace آماده همان سناریو شوید.'],
     ['۳','شخصی‌سازی کنید','هدف اصلی، محدودیت‌ها، مخاطب و سایر پارامترها را متناسب با پروژه واقعی خودتان اصلاح کنید.']
   ],
   tip:'اگر هیچ قالبی دقیقاً مناسب نیست، نزدیک‌ترین مورد را انتخاب کنید؛ قالب فقط برای کم‌کردن زمان شروع است و شما محدود به آن نیستید.'
 },
 'کتابخانه':{
   key:'library',
   eyebrow:'متن‌ها و دستورهای قابل استفاده مجدد',
   title:'چیزهایی را که زیاد تکرار می‌کنید یک‌بار ذخیره کنید',
   text:'کتابخانه برای نگهداری متن‌های آماده، دستورها، قواعد ثابت، توضیحات یا هدف‌های پرتکرار است تا لازم نباشد هر بار آن‌ها را دوباره بنویسید.',
   steps:[
     ['۱','ذخیره کنید','برای هر مورد یک عنوان روشن، متن اصلی و در صورت نیاز چند برچسب بنویسید.'],
     ['۲','سریع پیدا کنید','با جستجو و برچسب‌ها متن مناسب پروژه فعلی را پیدا کنید.'],
     ['۳','استفاده کنید','«استفاده» را بزنید تا متن مستقیماً وارد هدف اصلی Workspace فعلی شود؛ بعد هم می‌توانید آن را ویرایش کنید.']
   ],
   tip:'برای قواعد ثابت مثل لحن، محدودیت‌ها یا شیوه ارجاع، عنوان‌های کوتاه و مشخص انتخاب کنید تا بعداً سریع‌تر پیدایشان کنید.'
 },
 'تاریخچه':{
   key:'history',
   eyebrow:'رد فعالیت‌های مهم RAVAN',
   title:'ببینید اخیراً چه کارهایی انجام داده‌اید و از کجا ادامه دهید',
   text:'این بخش فعالیت‌های مهم مثل باز کردن پروژه، استفاده از قالب، کار با کتابخانه و تغییر تنظیمات را ثبت می‌کند تا مسیر کارتان قابل پیگیری باشد.',
   steps:[
     ['۱','مرور کنید','جدیدترین فعالیت‌ها بالاتر نمایش داده می‌شوند.'],
     ['۲','منبع را تشخیص دهید','عنوان و توضیح هر رویداد نشان می‌دهد چه عملی در کدام بخش انجام شده است.'],
     ['۳','به پروژه برگردید','اگر یک رویداد به پروژه ذخیره‌شده مرتبط باشد، می‌توانید از همان تاریخچه دوباره پروژه را باز کنید.']
   ],
   tip:'«تاریخچه» با Undo/Redo داخل فرم حرفه‌ای فرق دارد؛ اینجا سابقه فعالیت‌ها ثبت می‌شود، نه تمام تغییرات ریز هر فیلد.'
 },
 'تنظیمات':{
   key:'settings',
   eyebrow:'شخصی‌سازی رفتار و ظاهر RAVAN',
   title:'RAVAN را با روش کاری خودتان هماهنگ کنید',
   text:'در این بخش می‌توانید ظاهر و تراکم رابط، میزان حرکت و انیمیشن، ثبت تاریخچه، تأیید حذف و نسخه پشتیبان داده‌های محلی را مدیریت کنید.',
   steps:[
     ['۱','ظاهر را تنظیم کنید','حالت نمایش و تراکم رابط را متناسب با صفحه و سلیقه خودتان انتخاب کنید.'],
     ['۲','رفتار را تعیین کنید','کاهش حرکت، ثبت تاریخچه و تأیید قبل از حذف را روشن یا خاموش کنید.'],
     ['۳','از داده‌ها محافظت کنید','قبل از تغییرات مهم یا جابه‌جایی مرورگر، از داده‌های RAVAN نسخه پشتیبان بگیرید.']
   ],
   tip:'تنظیمات این صفحه مربوط به پوسته اصلی RAVAN است؛ تنظیمات تخصصی فرم حرفه‌ای معلم از داخل همان فرم در دسترس است.'
 }
};

function installStyles(){
 if(q('#r19SectionGuideStyles'))return;
 const s=document.createElement('style');s.id='r19SectionGuideStyles';s.textContent=`
 .r19-section-guide{margin:0 0 20px;padding:18px;border:1px solid #ded9ff;border-radius:16px;background:linear-gradient(135deg,#fbfaff 0%,#f7f9ff 58%,#f5fbff 100%);box-shadow:0 6px 20px rgba(80,65,160,.05);direction:rtl}
 .r19-section-guide-top{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:16px;align-items:start}
 .r19-section-guide-eyebrow{display:inline-flex;align-items:center;gap:7px;margin-bottom:6px;color:#6246ea;font-size:11px;font-weight:800}.r19-section-guide-eyebrow::before{content:'✦';font-size:12px}
 .r19-section-guide h3{margin:0 0 7px;color:#1f2937;font-size:16px;line-height:1.7}.r19-section-guide-intro{margin:0;color:#667085;font-size:12px;line-height:2}
 .r19-guide-badge{display:inline-flex;align-items:center;justify-content:center;min-width:88px;height:30px;padding:0 10px;border:1px solid #d7d0fb;border-radius:999px;background:#fff;color:#6246ea;font-size:10px;font-weight:800;white-space:nowrap}
 .r19-guide-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:14px}
 .r19-guide-step{min-height:96px;padding:12px;border:1px solid #e8e5f7;border-radius:12px;background:rgba(255,255,255,.82)}
 .r19-guide-step-head{display:flex;align-items:center;gap:8px;margin-bottom:6px;color:#344054;font-size:11px;font-weight:800}.r19-guide-step-num{width:23px;height:23px;display:grid;place-items:center;border-radius:8px;background:#f0edff;color:#6246ea;font-size:10px;font-weight:900;flex:0 0 auto}
 .r19-guide-step p{margin:0;color:#667085;font-size:10.5px;line-height:1.9}
 .r19-guide-tip{display:flex;align-items:flex-start;gap:8px;margin-top:12px;padding:10px 12px;border-radius:11px;background:#fff7e8;color:#72510a;font-size:10.5px;line-height:1.9}.r19-guide-tip b{white-space:nowrap;color:#9a6700}
 html.r19-dark .r19-section-guide{border-color:#403b68;background:linear-gradient(135deg,#1c2231,#1c2435)}html.r19-dark .r19-section-guide h3{color:#f3f4f6}html.r19-dark .r19-guide-step{border-color:#374151;background:#20293a}html.r19-dark .r19-guide-step-head{color:#e5e7eb}html.r19-dark .r19-guide-badge{background:#20293a;border-color:#4b456f}html.r19-dark .r19-guide-tip{background:#352d1e;color:#f5d78f}html.r19-dark .r19-guide-tip b{color:#f9d56e}
 html.r19-compact-shell .r19-section-guide{padding:14px}.r19-reduce-motion .r19-section-guide *{scroll-behavior:auto!important}
 @media(max-width:900px){.r19-guide-steps{grid-template-columns:1fr}.r19-section-guide-top{grid-template-columns:1fr}.r19-guide-badge{justify-self:start}.r19-guide-step{min-height:0}}
 `;document.head.append(s);
}

function guideHTML(g){return `<section class="r19-section-guide" data-r19-guide="${esc(g.key)}" aria-label="راهنمای سریع این بخش">
 <div class="r19-section-guide-top"><div><div class="r19-section-guide-eyebrow">${esc(g.eyebrow)}</div><h3>${esc(g.title)}</h3><p class="r19-section-guide-intro">${esc(g.text)}</p></div><span class="r19-guide-badge">راهنمای سریع</span></div>
 <div class="r19-guide-steps">${g.steps.map(x=>`<div class="r19-guide-step"><div class="r19-guide-step-head"><span class="r19-guide-step-num">${esc(x[0])}</span><span>${esc(x[1])}</span></div><p>${esc(x[2])}</p></div>`).join('')}</div>
 <div class="r19-guide-tip"><b>نکته:</b><span>${esc(g.tip)}</span></div>
 </section>`}

function applyGuide(){
 const view=q('.r19-section-view.open,.r19-section-view');if(!view)return;
 const title=(q('.r19-section-head h2',view)?.textContent||'').trim();
 const g=guides[title];if(!g)return;
 if(q('.r19-section-guide',view))return;
 const body=q('.r19-section-body',view);if(!body)return;
 body.insertAdjacentHTML('afterbegin',guideHTML(g));
 view.dataset.r19GuideReady='1';
}

function install(){
 installStyles();applyGuide();
 document.addEventListener('click',()=>setTimeout(applyGuide,0),true);
 new MutationObserver(()=>applyGuide()).observe(document.body,{subtree:true,childList:true});
 window.RAVAN_SECTION_GUIDES={version:'19.18',apply:applyGuide,guides};
 document.documentElement.dataset.ravanSectionGuides='19.18';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
