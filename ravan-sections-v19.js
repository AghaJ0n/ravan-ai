/* RAVAN AI — functional sidebar sections */
(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const LIB_KEY='ravan_library_v19';
const HISTORY_KEY='ravan_activity_v19';
const PREF_KEY='ravan_shell_prefs_v19';
let returnMode='builder';
let currentSection='';
let editingLibraryId='';

const templates=[
 {cat:'آموزش',title:'طراحی آزمون و ارزشیابی',role:'معلم',task:'آزمون و ارزشیابی',ai:'chatgpt',aiLabel:'ChatGPT',desc:'ساخت آزمون، کلید، معیار تصحیح و تحلیل سطح دشواری.',goal:'مثال: یک آزمون سطح‌بندی‌شده با پاسخنامه و معیار ارزیابی آماده کن.'},
 {cat:'آموزش',title:'طرح درس اجرایی',role:'معلم',task:'طرح درس',ai:'chatgpt',aiLabel:'ChatGPT',desc:'طرح درس مرحله‌ای با هدف، فعالیت، زمان‌بندی و ارزشیابی.',goal:'مثال: برای یک جلسه ۴۵ دقیقه‌ای طرح درس قابل اجرا آماده کن.'},
 {cat:'تحقیق',title:'تحقیق مبتنی بر منابع',role:'پژوهشگر',task:'تحقیق و تحلیل',ai:'notebooklm',aiLabel:'NotebookLM',desc:'ساخت Brief پژوهشی برای تحلیل فایل‌ها، منابع و استخراج شواهد.',goal:'مثال: منابع را مقایسه کن و یافته‌ها، اختلاف‌ها و خلأهای پژوهش را استخراج کن.'},
 {cat:'محتوا',title:'برنامه تولید محتوا',role:'تولیدکننده محتوا',task:'تولید محتوا',ai:'gemini',aiLabel:'Gemini',desc:'تولید محتوای ساختاریافته متناسب با مخاطب، کانال و لحن.',goal:'مثال: یک بسته محتوایی چندبخشی برای این موضوع و مخاطب طراحی کن.'},
 {cat:'کسب‌وکار',title:'برنامه‌ریزی پروژه',role:'مدیر',task:'برنامه‌ریزی پروژه',ai:'chatgpt',aiLabel:'ChatGPT',desc:'هدف، خروجی‌ها، ریسک‌ها، اولویت‌ها و برنامه اجرایی روشن.',goal:'مثال: این پروژه را به فازها، خروجی‌ها، مسئولیت‌ها و ریسک‌ها تقسیم کن.'},
 {cat:'فناوری',title:'توسعه و بازبینی نرم‌افزار',role:'برنامه‌نویس',task:'توسعه نرم‌افزار',ai:'chatgpt',aiLabel:'ChatGPT',desc:'تعریف نیازمندی، محدودیت فنی، معیار پذیرش و خروجی کدنویسی.',goal:'مثال: راه‌حل فنی را طراحی کن و کد قابل تست با معیار پذیرش مشخص بده.'}
];

function readJSON(key,fallback){try{const x=JSON.parse(localStorage.getItem(key)||'');return x??fallback}catch(e){return fallback}}
function writeJSON(key,val){try{localStorage.setItem(key,JSON.stringify(val));return true}catch(e){return false}}
function toast(msg,type='success'){window.RAVAN_UI?.toast?.(msg,type)}
function faDate(iso,withTime=false){try{return new Intl.DateTimeFormat('fa-IR',withTime?{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}:{year:'numeric',month:'short',day:'numeric'}).format(new Date(iso))}catch(e){return''}}
function prefs(){return {...{density:'comfortable',motion:'full',history:true,confirmDelete:true},...readJSON(PREF_KEY,{})}}
function savePrefs(p){writeJSON(PREF_KEY,p);applyPrefs()}
function applyPrefs(){const p=prefs();document.documentElement.classList.toggle('r19-compact-shell',p.density==='compact');document.documentElement.classList.toggle('r19-reduce-motion',p.motion==='reduce')}
function logActivity(type,title,detail='',extra={}){if(prefs().history===false)return;const a=readJSON(HISTORY_KEY,[]);a.unshift({id:'h_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,6),type,title,detail,at:new Date().toISOString(),...extra});writeJSON(HISTORY_KEY,a.slice(0,100))}
function readProjects(){try{if(typeof window.readProjectsV7==='function')return window.readProjectsV7()||[]}catch(e){}return readJSON('TeacherAI_Projects_v7',[])}
function recentProfiles(){return qa('.r11-pill').map((b,i)=>({index:i,title:(b.textContent||'').trim()})).filter(x=>x.title)}
function iconChar(kind){return ({projects:'▣',templates:'◇',library:'▤',history:'↺',settings:'⚙'}[kind]||'•')}

function rememberReturnMode(){if(q('.r19-utility-view.open'))return;returnMode=document.documentElement.classList.contains('r19-workspace-active')?'workspace':'builder'}
function restorePrevious(){
 const view=q('.r19-utility-view');view?.classList.remove('open','r19-section-view');
 qa('.r11-gate,.r11-workspace,.r11-ws-shell').forEach(x=>x.style.removeProperty('display'));
 if(returnMode==='workspace'){
   const gate=q('.r11-gate'),ws=q('#r11Workspace,.r11-workspace');
   if(gate)gate.style.display='none';
   if(ws){ws.classList.add('open');ws.style.removeProperty('display')}
   document.documentElement.classList.add('r19-workspace-active');
   qa('.r19-navitem').forEach((b,i)=>b.classList.toggle('active',i===0));
   window.RAVAN_UI?.refreshSide?.();window.scrollTo({top:0,behavior:'smooth'});
 }else window.RAVAN_UI?.showBuilder?.();
 currentSection='';
}
function openView(kind,title,subtitle,index,body){
 rememberReturnMode();currentSection=kind;
 window.RAVAN_UI?.showUtilityView?.(title,subtitle,index);
 const view=q('.r19-utility-view');if(!view)return null;
 view.classList.add('r19-section-view');
 view.innerHTML=`<div class="r19-section-head"><div class="r19-section-title"><span class="ico">${iconChar(kind)}</span><div><h2>${esc(title)}</h2><p>${esc(subtitle)}</p></div></div><button type="button" class="r19-section-back" data-r19-section-back>← بازگشت</button></div><div class="r19-section-body">${body}</div>`;
 q('[data-r19-section-back]',view)?.addEventListener('click',restorePrevious);
 return view;
}

function renderProjects(){
 const items=readProjects().sort((a,b)=>String(b.updated||'').localeCompare(String(a.updated||'')));
 const profiles=recentProfiles();
 const body=`<div class="r19-section-toolbar"><div class="group"><input class="r19-section-search" id="r19ProjectSearch" placeholder="جستجو در نام، پایه یا مقصد…"></div><div class="group"><button class="r19-section-btn" data-project-continue>ادامه آخرین کار</button><button class="r19-section-btn primary" data-project-new>+ پرامپت جدید</button></div></div>
 <div class="r19-kpi-row"><div class="r19-kpi"><b>${items.length}</b><span>پروژه حرفه‌ای ذخیره‌شده</span></div><div class="r19-kpi"><b>${profiles.length}</b><span>پروفایل اخیر RAVAN</span></div><div class="r19-kpi"><b>${items.filter(x=>Number(x.score||0)>=80).length}</b><span>پروژه با آمادگی بالای ۸۰٪</span></div></div>
 <div class="r19-subsection-head"><h3>پروژه‌های حرفه‌ای</h3><span>ذخیره‌شده روی همین مرورگر</span></div>
 <div class="r19-card-grid" id="r19ProjectGrid">${items.length?items.map(p=>`<article class="r19-data-card" data-project-card data-search="${esc([p.name,p.grade,p.target,p.title].join(' ').toLowerCase())}"><h3>${esc(p.name||'پروژه بدون نام')}</h3><p>${esc(p.title||'پروژه آموزشی')} ${p.updated?'• آخرین ویرایش '+esc(faDate(p.updated)):''}</p><div class="r19-card-meta">${p.grade?`<span class="r19-chip">${esc(p.grade)}</span>`:''}<span class="r19-chip purple">${esc(({chatgpt:'ChatGPT',gemini:'Gemini',notebooklm:'NotebookLM',generic:'عمومی',all:'هر سه'})[p.target]||p.target||'AI')}</span><span class="r19-chip">آمادگی ${Number(p.score||0)}٪</span></div><div class="r19-card-actions"><button class="r19-section-btn primary small" data-project-open="${esc(p.id)}">باز کردن</button><button class="r19-section-btn small" data-project-duplicate="${esc(p.id)}">ساخت مشابه</button><button class="r19-section-btn small" data-project-rename="${esc(p.id)}">تغییر نام</button><button class="r19-section-btn danger small" data-project-delete="${esc(p.id)}">حذف</button></div></article>`).join(''):`<div class="r19-empty" style="grid-column:1/-1"><b>هنوز پروژه حرفه‌ای ذخیره نشده</b><p>از فرم حرفه‌ای روی «ذخیره در پروژه‌های من» بزنید تا اینجا نمایش داده شود.</p></div>`}</div>
 <div class="r19-subsection"><div class="r19-subsection-head"><h3>پروفایل‌های اخیر RAVAN</h3><span>ترکیب‌های نقش، کار و AI که اخیراً ذخیره کرده‌اید</span></div><div class="r19-card-grid">${profiles.length?profiles.map(p=>`<article class="r19-data-card"><h3>${esc(p.title)}</h3><p>ادامه سریع با همین پروفایل و انتخاب‌ها.</p><div class="r19-card-actions"><button class="r19-section-btn primary small" data-profile-open="${p.index}">ادامه این پروفایل</button></div></article>`).join(''):`<div class="r19-empty" style="grid-column:1/-1"><b>پروفایل اخیری ندارید</b><p>پس از ذخیره یک پروفایل در فضای کاری، این بخش خودکار تکمیل می‌شود.</p></div>`}</div></div>`;
 const view=openView('projects','پروژه‌های من','پروژه‌های ذخیره‌شده، کارهای اخیر و مسیرهای قابل ادامه را از یک جا مدیریت کنید.',1,body);if(!view)return;
 q('#r19ProjectSearch',view)?.addEventListener('input',e=>{const s=e.target.value.trim().toLowerCase();qa('[data-project-card]',view).forEach(c=>c.hidden=!!s&&!String(c.dataset.search||'').includes(s))});
 q('[data-project-new]',view)?.addEventListener('click',()=>{logActivity('new','شروع پرامپت جدید');returnMode='builder';restorePrevious()});
 q('[data-project-continue]',view)?.addEventListener('click',()=>{if(typeof window.continueLastV7!=='function')return toast('کار ذخیره‌شده‌ای پیدا نشد','error');window.RAVAN_UI?.showBuilder?.();try{window.continueLastV7();setTimeout(()=>window.RAVAN_PROFESSIONAL?.open?.(),40);logActivity('project','ادامه آخرین کار','فرم آموزشی ذخیره‌شده بازیابی شد')}catch(e){toast('بازیابی آخرین کار ممکن نبود','error')}});
 view.addEventListener('click',e=>{
   const b=e.target.closest('button');if(!b)return;const id=b.dataset.projectOpen||b.dataset.projectDuplicate||b.dataset.projectRename||b.dataset.projectDelete;
   if(b.dataset.profileOpen!==undefined){const i=Number(b.dataset.profileOpen);window.RAVAN_UI?.showBuilder?.();try{window.loadRecent?.(i);logActivity('profile','باز کردن پروفایل اخیر',profiles.find(x=>x.index===i)?.title||'')}catch(err){toast('پروفایل قابل بازیابی نبود','error')}return}
   if(!id)return;
   if(b.dataset.projectOpen){window.RAVAN_UI?.showBuilder?.();try{window.openProjectV7?.(id);setTimeout(()=>window.RAVAN_PROFESSIONAL?.open?.(),40);const p=items.find(x=>x.id===id);logActivity('project','باز کردن پروژه',p?.name||'',{projectId:id})}catch(err){toast('پروژه باز نشد','error')}}
   else if(b.dataset.projectDuplicate){try{window.duplicateProjectV7?.(id);window.RAVAN_UI?.showBuilder?.();setTimeout(()=>window.RAVAN_PROFESSIONAL?.open?.(),40);logActivity('project','ساخت پروژه مشابه',items.find(x=>x.id===id)?.name||'')}catch(err){toast('ساخت نسخه مشابه ممکن نبود','error')}}
   else if(b.dataset.projectRename){try{window.renameProjectV7?.(id);renderProjects()}catch(err){toast('تغییر نام ممکن نبود','error')}}
   else if(b.dataset.projectDelete){try{window.deleteProjectV7?.(id);logActivity('project','حذف پروژه',items.find(x=>x.id===id)?.name||'');renderProjects()}catch(err){toast('حذف پروژه ممکن نبود','error')}}
 });
}

function renderTemplates(){
 const cats=['همه',...new Set(templates.map(x=>x.cat))];
 const body=`<div class="r19-section-toolbar"><div class="group">${cats.map((c,i)=>`<button class="r19-section-btn small ${i===0?'primary':''}" data-template-filter="${esc(c)}">${esc(c)}</button>`).join('')}</div><div class="group"><input class="r19-section-search" id="r19TemplateSearch" placeholder="جستجو در قالب‌ها…"></div></div><div class="r19-template-grid" id="r19TemplateGrid">${templates.map((t,i)=>`<article class="r19-template-card" data-template-card data-cat="${esc(t.cat)}" data-search="${esc((t.title+' '+t.role+' '+t.task+' '+t.aiLabel).toLowerCase())}"><span class="badge">${esc(t.cat)}</span><h3>${esc(t.title)}</h3><p>${esc(t.desc)}</p><div class="r19-card-meta"><span class="r19-chip">${esc(t.role)}</span><span class="r19-chip">${esc(t.task)}</span><span class="r19-chip purple">${esc(t.aiLabel)}</span></div><div class="r19-card-actions"><button class="r19-section-btn primary" data-template-use="${i}">استفاده از قالب</button></div></article>`).join('')}</div>`;
 const view=openView('templates','قالب‌ها','با یک ساختار آماده شروع کنید؛ همه فیلدها بعد از انتخاب قالب همچنان قابل ویرایش‌اند.',2,body);if(!view)return;
 let cat='همه',search='';const filter=()=>qa('[data-template-card]',view).forEach(c=>c.hidden=!((cat==='همه'||c.dataset.cat===cat)&&(!search||c.dataset.search.includes(search))));
 qa('[data-template-filter]',view).forEach(b=>b.addEventListener('click',()=>{cat=b.dataset.templateFilter;qa('[data-template-filter]',view).forEach(x=>x.classList.toggle('primary',x===b));filter()}));
 q('#r19TemplateSearch',view)?.addEventListener('input',e=>{search=e.target.value.trim().toLowerCase();filter()});
 view.addEventListener('click',e=>{const b=e.target.closest('[data-template-use]');if(!b)return;useTemplate(Number(b.dataset.templateUse))});
}
function useTemplate(i){
 const t=templates[i];if(!t)return;returnMode='builder';window.RAVAN_UI?.showBuilder?.();
 const set=(sel,val)=>{const el=q(sel);if(!el)return false;el.value=val;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));return true};
 setTimeout(()=>{set('#r11RoleInput,.r112-role-input',t.role);try{window.r11Move?.(1)}catch(e){}setTimeout(()=>{set('#r11TaskInput,.r115-task-input',t.task);try{window.r11Move?.(1)}catch(e){}setTimeout(()=>{try{window.selectAi?.(t.ai);window.r11Move?.(1)}catch(e){}setTimeout(()=>{const g=q('#r11MainGoal');if(g){g.placeholder=t.goal;g.focus()}window.RAVAN_UI?.refreshSide?.();logActivity('template','استفاده از قالب',t.title);toast('قالب آماده شد؛ هدف اصلی را برای پروژه خودتان مشخص کنید.')},100)},70)},70)},30);
}

function libraryItems(){const a=readJSON(LIB_KEY,[]);return Array.isArray(a)?a:[]}
function saveLibrary(items){writeJSON(LIB_KEY,items.slice(0,100))}
function renderLibrary(){
 const items=libraryItems().sort((a,b)=>String(b.updated||'').localeCompare(String(a.updated||'')));
 const edit=items.find(x=>x.id===editingLibraryId);
 const body=`<form class="r19-library-form" id="r19LibraryForm"><input name="title" maxlength="80" placeholder="عنوان کوتاه" value="${esc(edit?.title||'')}"><textarea name="text" placeholder="متن، دستور، نکته یا قطعه‌ای که می‌خواهید دوباره استفاده کنید…">${esc(edit?.text||'')}</textarea><input name="tags" maxlength="120" placeholder="برچسب‌ها؛ مثال: آموزش، آزمون" value="${esc((edit?.tags||[]).join('، '))}"><div class="actions"><button class="r19-section-btn primary" type="submit">${edit?'ذخیره تغییرات':'افزودن به کتابخانه'}</button>${edit?'<button class="r19-section-btn" type="button" data-library-cancel>انصراف</button>':''}</div></form><div class="r19-section-toolbar"><div class="group"><b style="font-size:13px">موارد ذخیره‌شده</b><span class="r19-chip">${items.length} مورد</span></div><div class="group"><input class="r19-section-search" id="r19LibrarySearch" placeholder="جستجو در کتابخانه…"></div></div><div class="r19-card-grid">${items.length?items.map(x=>`<article class="r19-data-card" data-library-card data-search="${esc((x.title+' '+x.text+' '+(x.tags||[]).join(' ')).toLowerCase())}"><h3>${esc(x.title||'بدون عنوان')}</h3><p>${esc(x.text||'').slice(0,260)}${String(x.text||'').length>260?'…':''}</p><div class="r19-card-meta">${(x.tags||[]).map(t=>`<span class="r19-chip">${esc(t)}</span>`).join('')}<span class="r19-chip">${esc(faDate(x.updated))}</span></div><div class="r19-card-actions"><button class="r19-section-btn primary small" data-library-use="${esc(x.id)}">استفاده در پرامپت</button><button class="r19-section-btn small" data-library-copy="${esc(x.id)}">کپی</button><button class="r19-section-btn small" data-library-edit="${esc(x.id)}">ویرایش</button><button class="r19-section-btn danger small" data-library-delete="${esc(x.id)}">حذف</button></div></article>`).join(''):`<div class="r19-empty" style="grid-column:1/-1"><b>کتابخانه هنوز خالی است</b><p>دستورها، متن‌های پرتکرار و نکات ثابت خودتان را اینجا ذخیره کنید تا دوباره استفاده شوند.</p></div>`}</div>`;
 const view=openView('library','کتابخانه','متن‌ها، دستورها و قطعه‌های پرتکرار خودتان را روی همین مرورگر نگه دارید و دوباره استفاده کنید.',3,body);if(!view)return;
 q('#r19LibraryForm',view)?.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.currentTarget),title=String(fd.get('title')||'').trim(),text=String(fd.get('text')||'').trim();if(!title||!text)return toast('عنوان و متن را کامل کنید','error');let all=libraryItems(),rec=all.find(x=>x.id===editingLibraryId);const tags=String(fd.get('tags')||'').split(/[،,]/).map(x=>x.trim()).filter(Boolean).slice(0,8);if(rec){Object.assign(rec,{title,text,tags,updated:new Date().toISOString()});logActivity('library','ویرایش کتابخانه',title)}else{all.unshift({id:'l_'+Date.now().toString(36),title,text,tags,updated:new Date().toISOString()});logActivity('library','افزودن به کتابخانه',title)}saveLibrary(all);editingLibraryId='';renderLibrary();toast('کتابخانه ذخیره شد')});
 q('[data-library-cancel]',view)?.addEventListener('click',()=>{editingLibraryId='';renderLibrary()});
 q('#r19LibrarySearch',view)?.addEventListener('input',e=>{const s=e.target.value.trim().toLowerCase();qa('[data-library-card]',view).forEach(c=>c.hidden=!!s&&!c.dataset.search.includes(s))});
 view.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;const id=b.dataset.libraryUse||b.dataset.libraryCopy||b.dataset.libraryEdit||b.dataset.libraryDelete;if(!id)return;const rec=libraryItems().find(x=>x.id===id);if(!rec)return;
   if(b.dataset.libraryCopy){try{await navigator.clipboard.writeText(rec.text);toast('متن کپی شد')}catch(err){toast('کپی خودکار ممکن نبود','error')}}
   else if(b.dataset.libraryEdit){editingLibraryId=id;renderLibrary();setTimeout(()=>q('#r19LibraryForm input[name=title]')?.focus(),0)}
   else if(b.dataset.libraryDelete){if(prefs().confirmDelete!==false&&!confirm(`«${rec.title}» از کتابخانه حذف شود؟`))return;saveLibrary(libraryItems().filter(x=>x.id!==id));logActivity('library','حذف از کتابخانه',rec.title);renderLibrary()}
   else if(b.dataset.libraryUse){const goal=q('#r11MainGoal');if(goal){goal.value=rec.text;goal.dispatchEvent(new Event('input',{bubbles:true}));logActivity('library','استفاده از متن کتابخانه',rec.title);returnMode='workspace';restorePrevious();setTimeout(()=>goal.focus(),50);toast('متن در «هدف اصلی» قرار گرفت')}else{try{await navigator.clipboard.writeText(rec.text)}catch(err){}returnMode='builder';restorePrevious();toast('متن کپی شد؛ پس از ساخت فضای کاری در فیلد دلخواه قرار دهید.')}}
 });
}

function renderHistory(){
 const events=readJSON(HISTORY_KEY,[]);const projectEvents=readProjects().map(p=>({id:'p_'+p.id,type:'project',title:'ویرایش پروژه',detail:p.name||p.title||'پروژه',at:p.updated,projectId:p.id,derived:true}));const all=[...events,...projectEvents].filter(x=>x.at).sort((a,b)=>String(b.at).localeCompare(String(a.at))).slice(0,100);
 const labels={project:'پروژه',template:'قالب',library:'کتابخانه',settings:'تنظیمات',profile:'پروفایل',new:'شروع جدید'};
 const body=`<div class="r19-section-toolbar"><div class="group"><span class="r19-chip">${all.length} رویداد</span><span class="r19-chip">تغییرات ریز داخل فرم با Undo / Redo همان فرم مدیریت می‌شوند.</span></div><div class="group"><button class="r19-section-btn danger" data-history-clear>پاک کردن تاریخچه فعالیت</button></div></div><div class="r19-timeline">${all.length?all.map(x=>`<article class="r19-history-item"><div class="r19-history-icon">${iconChar(x.type==='project'?'projects':x.type==='template'?'templates':x.type==='library'?'library':'history')}</div><div class="r19-history-copy"><b>${esc(x.title)}</b><span>${esc(x.detail||labels[x.type]||'فعالیت RAVAN')}</span>${x.projectId?`<div class="r19-card-actions"><button class="r19-section-btn small" data-history-project="${esc(x.projectId)}">باز کردن پروژه</button></div>`:''}</div><time class="r19-history-time">${esc(faDate(x.at,true))}</time></article>`).join(''):`<div class="r19-empty"><b>هنوز رویدادی ثبت نشده</b><p>از این به بعد استفاده از پروژه‌ها، قالب‌ها، کتابخانه و تغییر تنظیمات اینجا ثبت می‌شود.</p></div>`}</div>`;
 const view=openView('history','تاریخچه','ردپای کارهای مهم شما در RAVAN؛ بدون ثبت محتوای گفتگو در سرور.',4,body);if(!view)return;
 q('[data-history-clear]',view)?.addEventListener('click',()=>{if(prefs().confirmDelete!==false&&!confirm('تاریخچه فعالیت RAVAN پاک شود؟ پروژه‌های ذخیره‌شده حذف نمی‌شوند.'))return;localStorage.removeItem(HISTORY_KEY);renderHistory();toast('تاریخچه فعالیت پاک شد')});
 view.addEventListener('click',e=>{const b=e.target.closest('[data-history-project]');if(!b)return;const id=b.dataset.historyProject;window.RAVAN_UI?.showBuilder?.();try{window.openProjectV7?.(id);setTimeout(()=>window.RAVAN_PROFESSIONAL?.open?.(),40);logActivity('project','باز کردن پروژه از تاریخچه',readProjects().find(x=>x.id===id)?.name||'',{projectId:id})}catch(err){toast('پروژه باز نشد','error')}});
}

function exportBackup(){const data={exportedAt:new Date().toISOString(),app:'RAVAN AI',storage:{}};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);data.storage[k]=localStorage.getItem(k)}const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`RAVAN_AI_Backup_${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);logActivity('settings','تهیه نسخه پشتیبان','داده‌های محلی RAVAN');toast('نسخه پشتیبان ساخته شد')}
function renderSettings(){
 const p=prefs(),dark=document.documentElement.classList.contains('r19-dark');
 const seg=(name,options,current)=>`<div class="r19-segment">${options.map(([v,l])=>`<button type="button" data-pref="${name}" data-value="${v}" class="${current===v?'active':''}">${l}</button>`).join('')}</div>`;
 const body=`<div class="r19-settings-grid"><section class="r19-settings-card"><h3>ظاهر و تجربه کاربری</h3><p>این تنظیمات فقط روی همین مرورگر ذخیره می‌شوند.</p><div class="r19-setting-row"><div><b>پوسته</b><small>روشن یا تیره</small></div>${seg('theme',[['light','روشن'],['dark','تیره']],dark?'dark':'light')}</div><div class="r19-setting-row"><div><b>تراکم رابط</b><small>فاصله‌ها و اندازه کارت‌ها</small></div>${seg('density',[['comfortable','راحت'],['compact','فشرده']],p.density)}</div><div class="r19-setting-row"><div><b>حرکت‌ها</b><small>انیمیشن و اسکرول نرم</small></div>${seg('motion',[['full','عادی'],['reduce','کاهش‌یافته']],p.motion)}</div></section><section class="r19-settings-card"><h3>داده و حریم محلی</h3><p>پروژه‌ها، پروفایل‌ها و تنظیمات فعلی روی مرورگر شما نگهداری می‌شوند.</p><div class="r19-setting-row"><div><b>ثبت تاریخچه فعالیت</b><small>فعالیت‌های مهم منوی RAVAN</small></div>${seg('history',[['true','روشن'],['false','خاموش']],String(p.history!==false))}</div><div class="r19-setting-row"><div><b>تأیید قبل از حذف</b><small>برای کتابخانه و تاریخچه</small></div>${seg('confirmDelete',[['true','بله'],['false','خیر']],String(p.confirmDelete!==false))}</div><div class="r19-card-actions"><button class="r19-section-btn" data-settings-backup>دانلود نسخه پشتیبان</button></div></section><section class="r19-settings-card"><h3>تنظیمات حرفه‌ای آموزشی</h3><p>ذخیره خودکار، بازیابی، رفتار فرم معلم و تنظیمات پیشرفته در پنل حرفه‌ای مدیریت می‌شوند.</p><div class="r19-card-actions"><button class="r19-section-btn primary" data-settings-professional>باز کردن تنظیمات حرفه‌ای</button></div></section><section class="r19-settings-card"><h3>میانبرها</h3><p><b>Ctrl / Cmd + K</b> برای جستجوی سریع و <b>Esc</b> برای بستن پنل‌های جانبی.</p><p style="margin-top:10px">در فرم حرفه‌ای، Undo / Redo با میانبرهای استاندارد مرورگر پشتیبانی می‌شود.</p></section></div>`;
 const view=openView('settings','تنظیمات','ظاهر RAVAN، رفتار رابط و داده‌های محلی را از اینجا مدیریت کنید.',5,body);if(!view)return;
 view.addEventListener('click',e=>{const b=e.target.closest('[data-pref]');if(!b)return;const name=b.dataset.pref,val=b.dataset.value,next=prefs();if(name==='theme'){document.documentElement.classList.toggle('r19-dark',val==='dark');localStorage.setItem('ravan_theme',val);logActivity('settings','تغییر پوسته',val==='dark'?'تیره':'روشن')}else{next[name]=(name==='history'||name==='confirmDelete')?val==='true':val;savePrefs(next);logActivity('settings','تغییر تنظیمات',name)}renderSettings()});
 q('[data-settings-backup]',view)?.addEventListener('click',exportBackup);
 q('[data-settings-professional]',view)?.addEventListener('click',()=>{window.RAVAN_UI?.showBuilder?.();setTimeout(()=>{window.RAVAN_PROFESSIONAL?.open?.();setTimeout(()=>{try{window.openSettingsV9?.()}catch(e){toast('تنظیمات حرفه‌ای در دسترس نیست','error')}},80)},20)});
}

function openSection(kind){if(kind==='projects')renderProjects();else if(kind==='templates')renderTemplates();else if(kind==='library')renderLibrary();else if(kind==='history')renderHistory();else if(kind==='settings')renderSettings()}
function navKind(index){return ({1:'projects',2:'templates',3:'library',4:'history',5:'settings'})[index]||''}

document.addEventListener('click',e=>{
 const nav=e.target?.closest?.('.r19-navitem');if(nav){const i=Number(nav.dataset.navIndex);if(i>=1&&i<=5){e.preventDefault();e.stopImmediatePropagation();openSection(navKind(i));return}}
 const topSettings=e.target?.closest?.('[data-action="settings"]');if(topSettings){e.preventDefault();e.stopImmediatePropagation();openSection('settings')}
},true);

applyPrefs();
window.RAVAN_SECTIONS={open:openSection,projects:renderProjects,templates:renderTemplates,library:renderLibrary,history:renderHistory,settings:renderSettings,restore:restorePrevious,log:logActivity,version:'19.17'};
document.documentElement.dataset.ravanSections='19.17';
})();
