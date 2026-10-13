/* RAVAN AI v19 — consolidated UI layer */
(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[m]));
const icon=(name,cls='')=>`<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><use href="ravan-icons.svg#icon-${name}"></use></svg>`;
const labels=['نقش کاربر','نوع کار','هوش مصنوعی','ساخت پرامپت'];
const subs=['شما چه کسی هستید؟','چه کاری می‌خواهید انجام دهید؟','از کدام AI استفاده می‌کنید؟','شروع کنید'];
const cats=['همه','فناوری','کسب‌وکار','تولید محتوا','آموزش','تحقیق و تحلیل','طراحی و خلاقیت','سایر'];
const catMap={
 'فناوری':['برنامه','فناوری','توسعه','نرم افزار','نرم‌افزار','داده','مهندس'],
 'کسب‌وکار':['مدیر','کسب','بازاری','محصول','فروش','کارآفرین','مشاور','مسئول اجرایی','اجرایی','کارشناس','کارمند','اداری'],
 'تولید محتوا':['محتوا','نویس','رسانه','شبکه','کپی'],
 'آموزش':['معلم','دانش','آموز','استاد','آموزش','معاون','مدرسه'],
 'تحقیق و تحلیل':['پژوه','تحقیق','تحلیل','داده'],
 'طراحی و خلاقیت':['طراح','گرافیک','گرافیست','بصری','هنر','خلاق'],
 'سایر':['سایر','دیگر']
};
const norm=s=>String(s||'').toLowerCase().trim().replace(/[يى]/g,'ی').replace(/ك/g,'ک').replace(/‌/g,' ').replace(/\s+/g,' ');
function v(sel){const e=q(sel);return e?(e.value||'').trim():''}
function aiName(){const e=q('.r11-ai.selected');if(!e)return'';const b=q('b,strong',e);return (b?b.textContent:e.textContent).trim().split(/\n/)[0]}
function workspaceActive(){
 const ws=q('#r11Workspace,.r11-workspace');
 if(!ws||q('.r19-utility-view.open'))return false;
 if(ws.classList.contains('open'))return true;
 const gate=q('.r11-gate');
 return !!(gate&&getComputedStyle(gate).display==='none');
}
function activeStep(){if(workspaceActive())return 3;const sec=q('.r11-section.active');if(sec)return Number(sec.dataset.r11step||0);return 0}
function roleTaskDef(){return[
 {box:'.r112-role-box',input:'#r11RoleInput,.r112-role-input',menu:'.r112-combo-menu',opt:'.r112-role-option'},
 {box:'.r115-task-box',input:'#r11TaskInput,.r115-task-input',menu:'.r115-task-menu',opt:'.r115-task-option'}
]}
function installInteractionStyles(){
 if(q('#r19InteractionStyles'))return;
 const s=document.createElement('style');s.id='r19InteractionStyles';s.textContent=`
 .r113-step-back{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:40px!important;margin-top:10px!important;padding:0 14px!important;border:1px solid var(--color-border)!important;border-radius:10px!important;background:#fff!important;color:#475467!important;cursor:pointer!important}
 .r113-step-back:hover{border-color:#c9bfff!important;color:var(--color-primary)!important;background:#faf9ff!important}
 .r11-saved{display:block!important;width:100%!important;margin:16px 0 0!important;padding:12px 14px!important;border:1px dashed var(--color-border)!important;border-radius:12px!important;background:var(--color-surface-soft)!important;box-shadow:none!important}
 .r11-saved.r15-empty{display:none!important}.r11-saved h3{margin:0 0 8px!important;font-size:11px!important;color:var(--color-text-muted)!important}.r11-pills{display:flex!important;gap:6px!important;flex-wrap:wrap!important}.r11-pill{cursor:pointer!important}
 .r19-utility-view{display:none;min-height:420px;padding:28px;border:1px solid var(--color-border);border-radius:18px;background:#fff;box-shadow:var(--shadow-md);direction:rtl}.r19-utility-view.open{display:block}.r19-utility-view h2{margin:0 0 8px;font-size:24px;color:var(--color-text)}.r19-utility-view p{margin:0;color:var(--color-text-muted);font-size:13px;line-height:1.9}.r19-utility-actions{display:flex;gap:8px;margin-top:20px}.r19-utility-actions button{min-height:44px;padding:0 16px;border:1px solid var(--color-border);border-radius:10px;background:#fff;color:#344054;font:inherit;cursor:pointer}.r19-utility-actions button.primary{border-color:var(--color-primary);background:var(--color-primary);color:#fff}
 .r19-context.r19-pulse .r19-side-card{animation:r19pulse .7s ease}@keyframes r19pulse{0%,100%{box-shadow:var(--shadow-sm)}50%{box-shadow:0 0 0 4px rgba(98,70,234,.13),var(--shadow-md)}}
 .r19-main>.r11-workspace{position:static!important;inset:auto!important;z-index:auto!important;width:100%!important;height:auto!important;min-height:0!important;margin:0!important;padding:0!important;background:transparent!important;overflow:visible!important;display:none!important}
 .r19-main>.r11-workspace.open,html.r19-workspace-active .r19-main>.r11-workspace{display:block!important;animation:r19wsin .18s ease}
 html.r19-workspace-active .r19-main>.r11-gate{display:none!important}
 .r19-main>.r11-workspace .r11-ws-shell{display:block!important;width:100%!important;max-width:none!important;margin:0!important;padding:0!important}
 @keyframes r19wsin{from{opacity:.35;transform:translateY(4px)}to{opacity:1;transform:none}}
 html.r19-dark body,html.r19-dark .r19-app{background:#111827!important;color:#e5e7eb!important}html.r19-dark{--color-bg:#111827;--color-surface:#182234;--color-surface-soft:#202b3e;--color-text:#f3f4f6;--color-text-muted:#aab4c3;--color-border:#344054}html.r19-dark .r19-topbar,html.r19-dark .r19-nav,html.r19-dark .r19-main-card,html.r19-dark .r19-side-card,html.r19-dark .r19-utility-view,html.r19-dark .r112-role-option,html.r19-dark .r115-task-option,html.r19-dark .r11-ai,html.r19-dark .r11-btn,html.r19-dark .r11-saved{background:#182234!important;color:#f3f4f6!important}html.r19-dark input,html.r19-dark textarea,html.r19-dark select{background:#111827!important;color:#f3f4f6!important}
 `;document.head.append(s);
}
function unwindLegacy(){
 qa('#ravanUiV15,#ravanUiV16,#ravanUiV18,#ravanUiV20').forEach(x=>x.remove());
 qa('.r18-rail').forEach(rail=>{
   const sec=rail.closest('.r11-section');
   if(sec){
     const title=q('.r11-title',rail),saved=q('.r11-saved',rail);
     if(title)sec.prepend(title);
     if(saved)sec.append(saved);
   }
   rail.remove();
 });
}
function setNavActive(index){qa('.r19-navitem').forEach((b,i)=>{const on=i===index;b.classList.toggle('active',on);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')})}
function showBuilder(){
 q('.r19-utility-view')?.classList.remove('open');
 const gate=q('.r11-gate'),ws=q('#r11Workspace,.r11-workspace');
 if(ws)ws.classList.remove('open');
 document.documentElement.classList.remove('r19-workspace-active');
 gate?.style.removeProperty('display');
 qa('.r11-ws-shell').forEach(x=>x.style.removeProperty('display'));
 setNavActive(0);refreshSide();q('.r19-main')?.scrollTo?.({top:0,behavior:'smooth'});window.scrollTo({top:0,behavior:'smooth'});
}
function showUtilityView(title,description,index=0){
 const main=q('.r19-main');if(!main)return;
 document.documentElement.classList.remove('r19-workspace-active');
 qa('.r11-gate,.r11-workspace,.r11-ws-shell').forEach(x=>x.style.setProperty('display','none','important'));
 let view=q('.r19-utility-view',main);if(!view){view=document.createElement('section');view.className='r19-utility-view';main.append(view)}
 view.innerHTML=`<h2>${esc(title)}</h2><p>${esc(description)}</p><div class="r19-utility-actions"><button type="button" class="primary" data-r19-back-builder>بازگشت به ساخت پرامپت</button></div>`;
 view.classList.add('open');q('[data-r19-back-builder]',view)?.addEventListener('click',showBuilder);setNavActive(index);window.scrollTo({top:0,behavior:'smooth'});
}
function toggleTheme(){
 const dark=!document.documentElement.classList.contains('r19-dark');document.documentElement.classList.toggle('r19-dark',dark);localStorage.setItem('ravan_theme',dark?'dark':'light');toast(dark?'حالت تیره فعال شد.':'حالت روشن فعال شد.');
}
function buildChrome(){
 if(q('.r19-app'))return;
 const gate=q('.r11-gate');if(!gate)return;
 installInteractionStyles();unwindLegacy();
 const app=document.createElement('div');app.className='r19-app';
 const top=document.createElement('header');top.className='r19-topbar';top.innerHTML=`
   <button class="r19-brand" type="button" aria-label="صفحه اصلی RAVAN AI">
     <span class="r19-brand-mark">${icon('brand')}</span>
     <span class="r19-brand-copy"><b>RAVAN AI</b><small>دستیار هوشمند ساخت پرامپت</small></span>
   </button>
   <div class="r19-top-center">
     <div class="r19-global-search">${icon('search')}<input id="r19Search" aria-label="جستجوی سراسری" placeholder="جستجو در نقش‌ها، نوع کارها یا هوش مصنوعی…"><span class="r19-kbd">Ctrl K</span></div>
     <div class="r19-tools">
       <button class="r19-icon-btn" type="button" aria-label="راهنما" data-action="help" data-tooltip="راهنما">${icon('help')}</button>
       <button class="r19-icon-btn" type="button" aria-label="تنظیمات" data-action="settings" data-tooltip="تنظیمات">${icon('settings')}</button>
       <button class="r19-icon-btn" type="button" aria-label="تغییر پوسته" data-action="theme" data-tooltip="پوسته">${icon('sun')}</button>
       <button class="r19-icon-btn r19-mobile-context-toggle" type="button" aria-label="نمایش خلاصه و پیشرفت">${icon('info')}</button>
     </div>
   </div>
   <div class="r19-account"><button type="button" class="r19-avatar" aria-label="حساب کاربری">A</button></div>`;
 const nav=document.createElement('aside');nav.className='r19-nav';nav.setAttribute('aria-label','ناوبری اصلی');
 const items=[['pen','ساخت پرامپت'],['folder','پروژه‌های من'],['template','قالب‌ها'],['book','کتابخانه'],['history','تاریخچه'],['settings','تنظیمات']];
 nav.innerHTML=`<div class="r19-navlist">${items.map((x,i)=>`<button type="button" class="r19-navitem ${i===0?'active':''}" data-nav-index="${i}" ${i===0?'aria-current="page"':''}>${icon(x[0])}<span>${x[1]}</span></button>`).join('')}</div><div class="r19-usage"><div class="r19-usage-head">${icon('sparkles')}<span>استفاده AI</span></div><div class="r19-usage-bar"><span></span></div><div class="r19-usage-meta"><span>12 / 50</span><span>ماهانه</span></div><button class="r19-upgrade" type="button">${icon('crown')}<span>ارتقا پلن</span></button></div>`;
 const main=document.createElement('main');main.className='r19-main';main.id='r19Main';
 const ctx=document.createElement('aside');ctx.className='r19-context';ctx.setAttribute('aria-label','خلاصه و راهنمای مرحله');ctx.innerHTML=`<div class="r19-context-inner"><div class="r19-slogan"><h3>پرامپت بهتر<br>نتیجه‌های بزرگ‌تر</h3><div class="line"></div></div><div id="r19Progress"></div><div id="r19Help"></div><div id="r19Choices"></div></div>`;
 const toastStack=document.createElement('div');toastStack.className='r19-toast-stack';toastStack.id='r19Toasts';toastStack.setAttribute('aria-live','polite');
 document.body.innerHTML='';document.body.append(app,toastStack);app.append(top,nav,main,ctx);main.append(gate);
 if(localStorage.getItem('ravan_theme')==='dark')document.documentElement.classList.add('r19-dark');
 bindChrome(top,nav,ctx);addStep4();addCategories();addSearchIcons();decorateOptionIcons();refreshSide();
}
function bindChrome(top,nav,ctx){
 const search=q('#r19Search',top);if(search){
   search.addEventListener('input',()=>{showBuilder();const step=activeStep(),target=step===0?q('#r11RoleInput,.r112-role-input'):step===1?q('#r11TaskInput,.r115-task-input'):null;if(target){target.value=search.value;target.dispatchEvent(new Event('input',{bubbles:true}))}});
   search.addEventListener('keydown',e=>{if(e.key==='Enter'){const step=activeStep(),target=step===0?q('#r11RoleInput,.r112-role-input'):step===1?q('#r11TaskInput,.r115-task-input'):null;if(target)target.focus()}});
 }
 document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();q('#r19Search')?.focus()}});
 q('.r19-brand',top)?.addEventListener('click',showBuilder);
 const navActions=[
  ()=>showBuilder(),
  ()=>showUtilityView('پروژه‌های من','پروژه‌های ذخیره‌شده و جریان‌های کاری شما در این بخش مدیریت می‌شوند.',1),
  ()=>showUtilityView('قالب‌ها','قالب‌های آماده برای شروع سریع ساخت پرامپت در این بخش قرار می‌گیرند.',2),
  ()=>showUtilityView('کتابخانه','محتوا و منابع ذخیره‌شده‌ی شما در کتابخانه قابل دسترسی خواهند بود.',3),
  ()=>showUtilityView('تاریخچه','سوابق ساخت و ویرایش پرامپت‌ها در این بخش نمایش داده می‌شوند.',4),
  ()=>showUtilityView('تنظیمات','تنظیمات رابط، پوسته و ترجیحات RAVAN AI از این بخش مدیریت می‌شوند.',5)
 ];
 qa('.r19-navitem',nav).forEach((b,i)=>b.addEventListener('click',()=>navActions[i]?.()));
 q('.r19-upgrade',nav)?.addEventListener('click',()=>showUtilityView('مدیریت پلن','مدیریت سهمیه و ارتقای پلن در این بخش انجام خواهد شد.',0));
 q('[data-action="help"]',top)?.addEventListener('click',()=>{ctx.classList.add('open','r19-pulse');q('#r19Help')?.scrollIntoView({block:'nearest',behavior:'smooth'});setTimeout(()=>ctx.classList.remove('r19-pulse'),800)});
 q('[data-action="settings"]',top)?.addEventListener('click',()=>showUtilityView('تنظیمات','تنظیمات رابط، پوسته و ترجیحات RAVAN AI از این بخش مدیریت می‌شوند.',5));
 q('[data-action="theme"]',top)?.addEventListener('click',toggleTheme);
 q('.r19-avatar',top)?.addEventListener('click',()=>showUtilityView('حساب کاربری','پروفایل و ترجیحات حساب کاربری در این بخش قرار می‌گیرند.',0));
 q('.r19-mobile-context-toggle',top)?.addEventListener('click',()=>ctx.classList.toggle('open'));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')ctx.classList.remove('open')});
}
function addStep4(){
 const bar=q('.r11-stepbar');if(!bar)return;
 if(!q('.r19-step4',bar)){const d=document.createElement('div');d.className='r11-stepchip r19-step4';d.innerHTML='<b>۴</b><span><strong>ساخت پرامپت</strong><small>شروع کنید</small></span>';bar.appendChild(d)}
 qa('.r11-stepchip',bar).slice(0,3).forEach((x,i)=>{const b=q('b',x);if(!b)return;qa(':scope > span',x).forEach(s=>s.remove());[...x.childNodes].filter(n=>n.nodeType===3).forEach(n=>n.remove());const sp=document.createElement('span');sp.innerHTML=`<strong>${labels[i]}</strong><small>${subs[i]}</small>`;x.appendChild(sp)});
}
function addCategories(){
 roleTaskDef().forEach(def=>{const box=q(def.box);if(!box||q('.r19-cats',box))return;const menu=q(def.menu,box);const row=document.createElement('div');row.className='r19-cats';row.setAttribute('aria-label','فیلتر دسته‌ها');row.innerHTML=cats.map((c,i)=>`<button type="button" class="r19-cat ${i===0?'active':''}" data-cat="${c}" aria-pressed="${i===0?'true':'false'}">${c}</button>`).join('');if(menu&&menu.parentNode)menu.parentNode.insertBefore(row,menu);else box.append(row);row.addEventListener('click',e=>{const b=e.target.closest('.r19-cat');if(!b)return;qa('.r19-cat',row).forEach(x=>{const on=x===b;x.classList.toggle('active',on);x.setAttribute('aria-pressed',on?'true':'false')});applyChoiceFilter(box,def);window.dispatchEvent(new CustomEvent('ravan:filterchange',{detail:{box}}))})
 })
}
function addSearchIcons(){
 roleTaskDef().forEach(def=>{const box=q(def.box),input=box&&q(def.input,box);if(!box||!input||q('.r19-field-search-icon',box))return;const s=document.createElement('span');s.className='r19-field-search-icon';s.setAttribute('aria-hidden','true');s.innerHTML=icon('search');if(input.parentNode)input.parentNode.insertBefore(s,input)})
}
function applyChoiceFilter(box,def){
 const input=q(def.input,box),query=norm(input?.value),cat=q('.r19-cat.active',box)?.dataset.cat||'همه';let count=0;
 qa(def.opt,box).forEach(o=>{const t=norm(o.textContent);const catOk=cat==='همه'||(catMap[cat]||[]).some(k=>t.includes(norm(k)));const show=(!query||t.includes(query))&&catOk;o.hidden=!show;if(show)count++});
 let empty=q('.r19-choice-empty',box);if(!empty){empty=document.createElement('div');empty.className='r19-choice-empty';empty.textContent='مورد مشابهی پیدا نشد؛ می‌توانید متن دلخواه خودتان را وارد کنید.';q(def.menu,box)?.append(empty)}empty.hidden=!!count;
}
function decorateOptionIcons(){
 roleTaskDef().forEach(def=>{qa(`${def.box} ${def.opt}`).forEach(o=>{const ico=q('.ico',o);if(!ico||ico.dataset.svg)return;const t=norm(o.textContent);let id='briefcase';if(/برنامه|توسعه|نرم افزار|نرم‌افزار|مهندس/.test(t))id='code';else if(/معلم|دانش|آموز|استاد|آموزش/.test(t))id='graduation';else if(/طراح|گرافیک|گرافیست|هنر|خلاق/.test(t))id='palette';else if(/پژوه|تحقیق|آزمایش/.test(t))id='flask';else if(/محتوا|نویس|رسانه/.test(t))id='content';else if(/مشاور|کاربر|منابع انسانی|تیم/.test(t))id='users';ico.innerHTML=icon(id);ico.dataset.svg='1'})})
}
function syncWorkspaceState(){
 const main=q('.r19-main'),ws=q('#r11Workspace,.r11-workspace'),gate=q('.r11-gate');
 if(ws&&main&&ws.parentElement!==main)main.append(ws);
 const utilOpen=!!q('.r19-utility-view.open');
 const gateHidden=!!(gate&&getComputedStyle(gate).display==='none');
 const active=!!(ws&&!utilOpen&&(ws.classList.contains('open')||gateHidden));
 document.documentElement.classList.toggle('r19-workspace-active',active);
 if(active&&ws){ws.classList.add('open');ws.style.removeProperty('display')}
 return active;
}
function progressCard(){const step=activeStep(),role=v('#r11RoleInput,.r112-role-input'),task=v('#r11TaskInput,.r115-task-input'),ai=aiName(),pct=[25,50,75,100][step]||25,vals=[role,task,ai,step===3?'فضای کاری آماده':''];return `<div class="r19-side-card"><div class="r19-side-title">پیشرفت شما</div><div class="r19-ringrow"><div class="r19-stepnote"><b>گام ${step+1} از ۴</b>${step===3?'فضای کاری آماده است':'مسیر ساخت پرامپت'}</div><div class="r19-ring" style="--p:${pct}"><b>${pct}%</b></div></div><div class="r19-checks">${labels.map((l,i)=>`<div class="r19-check ${i===step?'active':''} ${i<step?'done':''}"><span class="dot"></span><span>${vals[i]?esc(vals[i]).slice(0,24):l}</span><span class="tick">${i<step?'✓':i===step?'•':'○'}</span></div>`).join('')}</div></div>`}
function helpCard(){const step=activeStep();const texts=['نقش اصلی خود را انتخاب کنید. جستجو و فیلترها فقط گزینه‌ها را محدود می‌کنند و در هر زمان می‌توانید متن دلخواه بنویسید.','نوع کاری را انتخاب کنید که می‌خواهید انجام دهید؛ گزینه‌ها بر اساس نقش شما دقیق‌تر می‌شوند.','مقصد AI را انتخاب کنید تا ساختار پرامپت با همان ابزار سازگار شود.','فضای کاری آماده است. «هدف اصلی» و پارامترهای اختصاصی را کامل کنید، سپس دکمه «ساخت خروجی برای AI» را بزنید.'];return `<div class="r19-side-card"><div class="r19-side-title">راهنمای این مرحله</div><div class="r19-help">${texts[step]}</div></div>`}
function choicesCard(){const step=activeStep(),vals=[v('#r11RoleInput,.r112-role-input'),v('#r11TaskInput,.r115-task-input'),aiName(),step===3?'ساخت پرامپت':''];return `<div class="r19-side-card"><div class="r19-side-title">انتخاب‌های شما</div><div class="r19-choices">${labels.map((l,i)=>`<div class="r19-choice ${i<=step?'active':''}">${icon(i<step?'check':'target')}<span>${vals[i]?esc(vals[i]):l}</span></div>`).join('')}</div></div>`}
function refreshSide(){
 const p=q('#r19Progress'),h=q('#r19Help'),c=q('#r19Choices');if(p)p.innerHTML=progressCard();if(h)h.innerHTML=helpCard();if(c)c.innerHTML=choicesCard();const step=activeStep();qa('.r11-stepchip').forEach((x,i)=>{x.classList.toggle('active',i===step);x.classList.toggle('done',i<step)});
 roleTaskDef().forEach(def=>{const box=q(def.box);if(box)applyChoiceFilter(box,def)})
}
function toast(msg,type='success'){const stack=q('#r19Toasts');if(!stack)return;while(stack.children.length>=3)stack.firstElementChild.remove();const t=document.createElement('div');t.className=`r19-toast ${type}`;t.textContent=msg;stack.append(t);setTimeout(()=>t.remove(),3000)}
function sync(){
 addStep4();addCategories();addSearchIcons();decorateOptionIcons();syncWorkspaceState();refreshSide();
 document.documentElement.dataset.ravanUi='19.12-consolidated';
}
let syncQueued=false;
function scheduleSync(){if(syncQueued)return;syncQueued=true;requestAnimationFrame(()=>{syncQueued=false;sync()})}
function install(){
 window.RAVAN_UI={applyChoiceFilter,toast,refreshSide,showBuilder,showUtilityView,syncWorkspaceState};buildChrome();sync();document.addEventListener('input',()=>setTimeout(refreshSide,0),true);document.addEventListener('change',()=>setTimeout(refreshSide,0),true);document.addEventListener('click',scheduleSync,true);
 new MutationObserver(muts=>{const meaningful=muts.some(m=>{const t=m.target?.nodeType===1?m.target:m.target?.parentElement;return t&&!t.closest?.('.r19-context,.r19-toast-stack')});if(meaningful)scheduleSync()}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','aria-selected','style']});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
