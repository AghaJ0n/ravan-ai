/* RAVAN AI v19 — consolidated UI layer */
(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const icon=(name,cls='')=>`<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><use href="ravan-icons.svg#icon-${name}"></use></svg>`;
const labels=['نقش کاربر','نوع کار','هوش مصنوعی','ساخت پرامپت'];
const subs=['شما چه کسی هستید؟','چه کاری می‌خواهید انجام دهید؟','از کدام AI استفاده می‌کنید؟','شروع کنید'];
const cats=['همه','فناوری','کسب‌وکار','تولید محتوا','آموزش','تحقیق و تحلیل','طراحی و خلاقیت','سایر'];
const catMap={
 'فناوری':['برنامه','فناوری','توسعه','نرم افزار','نرم‌افزار','داده','مهندس'],
 'کسب‌وکار':['مدیر','کسب','بازاری','محصول','فروش','کارآفرین','مشاور'],
 'تولید محتوا':['محتوا','نویس','رسانه','شبکه','کپی'],
 'آموزش':['معلم','دانش','آموز','استاد','آموزش'],
 'تحقیق و تحلیل':['پژوه','تحقیق','تحلیل','داده'],
 'طراحی و خلاقیت':['طراح','گرافیک','هنر','خلاق'],
 'سایر':['سایر','دیگر']
};
const norm=s=>String(s||'').toLowerCase().trim().replace(/[يى]/g,'ی').replace(/ك/g,'ک').replace(/‌/g,' ').replace(/\s+/g,' ');
function v(sel){const e=q(sel);return e?(e.value||'').trim():''}
function aiName(){const e=q('.r11-ai.selected');if(!e)return'';const b=q('b,strong',e);return (b?b.textContent:e.textContent).trim().split(/\n/)[0]}
function activeStep(){const sec=q('.r11-section.active');if(sec)return Number(sec.dataset.r11step||0);return q('.r11-ws-shell')?3:0}
function roleTaskDef(){return[
 {box:'.r112-role-box',input:'#r11RoleInput,.r112-role-input',menu:'.r112-combo-menu',opt:'.r112-role-option'},
 {box:'.r115-task-box',input:'#r11TaskInput,.r115-task-input',menu:'.r115-task-menu',opt:'.r115-task-option'}
]}
function buildChrome(){
 if(q('.r19-app'))return;
 const gate=q('.r11-gate');if(!gate)return;
 qa('#ravanUiV15,#ravanUiV16,#ravanUiV18,#ravanUiV20').forEach(x=>x.remove());
 qa('.r18-rail').forEach(x=>x.remove());
 const app=document.createElement('div');app.className='r19-app';
 const top=document.createElement('header');top.className='r19-topbar';top.innerHTML=`
   <button class="r19-brand" type="button" aria-label="صفحه اصلی RAVAN AI">
     <span class="r19-brand-mark">${icon('brand')}</span>
     <span class="r19-brand-copy"><b>RAVAN AI</b><small>دستیار هوشمند ساخت پرامپت</small></span>
   </button>
   <div class="r19-top-center">
     <div class="r19-global-search">${icon('search')}<input id="r19Search" aria-label="جستجوی سراسری" placeholder="جستجو در نقش‌ها، نوع کارها یا هوش مصنوعی…"><span class="r19-kbd">Ctrl K</span></div>
     <div class="r19-tools">
       <button class="r19-icon-btn" type="button" aria-label="راهنما" data-tooltip="راهنما">${icon('help')}</button>
       <button class="r19-icon-btn" type="button" aria-label="تنظیمات" data-tooltip="تنظیمات">${icon('settings')}</button>
       <button class="r19-icon-btn" type="button" aria-label="تغییر پوسته" data-tooltip="پوسته">${icon('sun')}</button>
       <button class="r19-icon-btn r19-mobile-context-toggle" type="button" aria-label="نمایش خلاصه و پیشرفت">${icon('info')}</button>
     </div>
   </div>
   <div class="r19-account"><div class="r19-avatar" aria-label="حساب کاربری">A</div></div>`;
 const nav=document.createElement('aside');nav.className='r19-nav';nav.setAttribute('aria-label','ناوبری اصلی');
 const items=[['pen','ساخت پرامپت'],['folder','پروژه‌های من'],['template','قالب‌ها'],['book','کتابخانه'],['history','تاریخچه'],['settings','تنظیمات']];
 nav.innerHTML=`<div class="r19-navlist">${items.map((x,i)=>`<button type="button" class="r19-navitem ${i===0?'active':''}" ${i===0?'aria-current="page"':''}>${icon(x[0])}<span>${x[1]}</span></button>`).join('')}</div><div class="r19-usage"><div class="r19-usage-head">${icon('sparkles')}<span>استفاده AI</span></div><div class="r19-usage-bar"><span></span></div><div class="r19-usage-meta"><span>12 / 50</span><span>ماهانه</span></div><button class="r19-upgrade" type="button">${icon('crown')} ارتقا پلن</button></div>`;
 const main=document.createElement('main');main.className='r19-main';main.id='r19Main';
 const ctx=document.createElement('aside');ctx.className='r19-context';ctx.setAttribute('aria-label','خلاصه و راهنمای مرحله');ctx.innerHTML=`<div class="r19-context-inner"><div class="r19-slogan"><h3>پرامپت بهتر<br>نتیجه‌های بزرگ‌تر</h3><div class="line"></div></div><div id="r19Progress"></div><div id="r19Help"></div><div id="r19Choices"></div></div>`;
 const toast=document.createElement('div');toast.className='r19-toast-stack';toast.id='r19Toasts';toast.setAttribute('aria-live','polite');
 document.body.innerHTML='';document.body.append(app,toast);app.append(top,nav,main,ctx);main.append(gate);
 bindChrome(top,nav,ctx);addStep4();addCategories();decorateOptionIcons();refreshSide();
}
function bindChrome(top,nav,ctx){
 const search=q('#r19Search',top);if(search){
   search.addEventListener('input',()=>{const step=activeStep(),target=step===0?q('#r11RoleInput,.r112-role-input'):step===1?q('#r11TaskInput,.r115-task-input'):null;if(target){target.value=search.value;target.dispatchEvent(new Event('input',{bubbles:true}))}});
   search.addEventListener('keydown',e=>{if(e.key==='Enter'){const step=activeStep(),target=step===0?q('#r11RoleInput,.r112-role-input'):step===1?q('#r11TaskInput,.r115-task-input'):null;if(target)target.focus()}});
 }
 document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();q('#r19Search')?.focus()}});
 qa('.r19-navitem',nav).forEach((b,i)=>{if(i===0)return;b.addEventListener('click',()=>toast('این بخش در نسخه بعدی فعال می‌شود.'))});
 q('.r19-upgrade',nav)?.addEventListener('click',()=>toast('مدیریت پلن به‌زودی اضافه می‌شود.'));
 qa('.r19-icon-btn',top).forEach((b,i)=>{if(b.classList.contains('r19-mobile-context-toggle'))return;b.addEventListener('click',()=>toast(['راهنمای این مرحله در پنل خلاصه نمایش داده می‌شود.','تنظیمات به‌زودی یکپارچه می‌شود.','تغییر پوسته در نسخه بعدی فعال می‌شود.'][i]||'به‌زودی'))});
 q('.r19-mobile-context-toggle',top)?.addEventListener('click',()=>{ctx.classList.toggle('open')});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')ctx.classList.remove('open')});
}
function addStep4(){
 const bar=q('.r11-stepbar');if(!bar)return;
 if(!q('.r19-step4',bar)){const d=document.createElement('div');d.className='r11-stepchip r19-step4';d.innerHTML='<b>۴</b><span><strong>ساخت پرامپت</strong><small>شروع کنید</small></span>';bar.appendChild(d)}
 qa('.r11-stepchip',bar).slice(0,3).forEach((x,i)=>{const b=q('b',x);if(!b)return;qa(':scope > span',x).forEach(s=>s.remove());[...x.childNodes].filter(n=>n.nodeType===3).forEach(n=>n.remove());const sp=document.createElement('span');sp.innerHTML=`<strong>${labels[i]}</strong><small>${subs[i]}</small>`;x.appendChild(sp)});
}
function addCategories(){
 roleTaskDef().forEach(def=>{const box=q(def.box);if(!box||q('.r19-cats',box))return;const menu=q(def.menu,box);const row=document.createElement('div');row.className='r19-cats';row.setAttribute('aria-label','فیلتر دسته‌ها');row.innerHTML=cats.map((c,i)=>`<button type="button" class="r19-cat ${i===0?'active':''}" data-cat="${c}" aria-pressed="${i===0?'true':'false'}">${c}</button>`).join('');if(menu)box.insertBefore(row,menu);else box.append(row);row.addEventListener('click',e=>{const b=e.target.closest('.r19-cat');if(!b)return;qa('.r19-cat',row).forEach(x=>{const on=x===b;x.classList.toggle('active',on);x.setAttribute('aria-pressed',on?'true':'false')});applyChoiceFilter(box,def);window.dispatchEvent(new CustomEvent('ravan:filterchange',{detail:{box}}))})
 })
}
function applyChoiceFilter(box,def){
 const input=q(def.input,box),query=norm(input?.value),cat=q('.r19-cat.active',box)?.dataset.cat||'همه';let count=0;
 qa(def.opt,box).forEach(o=>{const t=norm(o.textContent);const catOk=cat==='همه'||(catMap[cat]||[]).some(k=>t.includes(norm(k)));const show=(!query||t.includes(query))&&catOk;o.hidden=!show;if(show)count++});
 let empty=q('.r19-choice-empty',box);if(!empty){empty=document.createElement('div');empty.className='r19-choice-empty';empty.style.cssText='display:none;grid-column:1/-1;padding:18px;text-align:center;color:#667085;background:#f8fafd;border:1px dashed #d9dee8;border-radius:12px;font-size:12px';empty.textContent='مورد مشابهی پیدا نشد؛ می‌توانید متن دلخواه خودتان را وارد کنید.';q(def.menu,box)?.append(empty)}empty.style.display=count?'none':'block';
}
function decorateOptionIcons(){
 roleTaskDef().forEach(def=>{qa(`${def.box} ${def.opt}`).forEach(o=>{const ico=q('.ico',o);if(!ico||ico.dataset.svg)return;const t=norm(o.textContent);let id='briefcase';if(/برنامه|توسعه|نرم افزار|نرم‌افزار|مهندس/.test(t))id='code';else if(/معلم|دانش|آموز|استاد|آموزش/.test(t))id='graduation';else if(/طراح|گرافیک|هنر|خلاق/.test(t))id='palette';else if(/پژوه|تحقیق|آزمایش/.test(t))id='flask';else if(/محتوا|نویس|رسانه/.test(t))id='content';else if(/مشاور|کاربر|منابع انسانی|تیم/.test(t))id='users';ico.innerHTML=icon(id);ico.dataset.svg='1'})})
}
function progressCard(){const step=activeStep(),role=v('#r11RoleInput,.r112-role-input'),task=v('#r11TaskInput,.r115-task-input'),ai=aiName(),pct=[25,50,75,100][step]||25,vals=[role,task,ai,''];return `<div class="r19-side-card"><div class="r19-side-title">پیشرفت شما</div><div class="r19-ringrow"><div class="r19-stepnote"><b>گام ${step+1} از ۴</b>مسیر ساخت پرامپت</div><div class="r19-ring" style="--p:${pct}"><b>${pct}%</b></div></div><div class="r19-checks">${labels.map((l,i)=>`<div class="r19-check ${i===step?'active':''} ${i<step?'done':''}"><span class="dot"></span><span>${vals[i]?esc(vals[i]).slice(0,24):l}</span><span class="tick">${i<step?'✓':'○'}</span></div>`).join('')}</div></div>`}
function helpCard(){const step=activeStep();const texts=['نقش اصلی خود را انتخاب کنید. جستجو و فیلترها فقط گزینه‌ها را محدود می‌کنند و در هر زمان می‌توانید متن دلخواه بنویسید.','نوع کاری را انتخاب کنید که می‌خواهید انجام دهید؛ گزینه‌ها بر اساس نقش شما دقیق‌تر می‌شوند.','مقصد AI را انتخاب کنید تا ساختار پرامپت با همان ابزار سازگار شود.','اطلاعات تخصصی را تکمیل کنید و خروجی نهایی را بسازید.'];return `<div class="r19-side-card"><div class="r19-side-title">راهنمای این مرحله</div><div class="r19-help">${texts[step]}</div></div>`}
function choicesCard(){const step=activeStep(),vals=[v('#r11RoleInput,.r112-role-input'),v('#r11TaskInput,.r115-task-input'),aiName(),''];return `<div class="r19-side-card"><div class="r19-side-title">انتخاب‌های شما</div><div class="r19-choices">${labels.map((l,i)=>`<div class="r19-choice ${i<=step?'active':''}">${icon(i<step?'check':'target')}<span>${vals[i]?esc(vals[i]):l}</span></div>`).join('')}</div></div>`}
function refreshSide(){
 const p=q('#r19Progress'),h=q('#r19Help'),c=q('#r19Choices');if(p)p.innerHTML=progressCard();if(h)h.innerHTML=helpCard();if(c)c.innerHTML=choicesCard();const step=activeStep();qa('.r11-stepchip').forEach((x,i)=>{x.classList.toggle('active',i===step);x.classList.toggle('done',i<step)});
 roleTaskDef().forEach(def=>{const box=q(def.box);if(box)applyChoiceFilter(box,def)})
}
function toast(msg,type='success'){const stack=q('#r19Toasts');if(!stack)return;while(stack.children.length>=3)stack.firstElementChild.remove();const t=document.createElement('div');t.className=`r19-toast ${type}`;t.textContent=msg;stack.append(t);setTimeout(()=>t.remove(),3000)}
function sync(){
 addStep4();addCategories();decorateOptionIcons();refreshSide();const ws=q('.r11-ws-shell'),main=q('.r19-main');if(ws&&main&&!main.contains(ws))main.append(ws);
 document.documentElement.dataset.ravanUi='19-consolidated';
}
function install(){
 buildChrome();sync();document.addEventListener('input',()=>setTimeout(refreshSide,0),true);document.addEventListener('change',()=>setTimeout(refreshSide,0),true);document.addEventListener('click',()=>setTimeout(sync,20),true);new MutationObserver(()=>sync()).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','aria-selected']});window.RAVAN_UI={applyChoiceFilter,toast,refreshSide};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
