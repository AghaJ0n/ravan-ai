/* RAVAN AI v19 — accessibility + keyboard/combobox behavior */
(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
const norm=s=>String(s||'').toLowerCase().trim().replace(/[يى]/g,'ی').replace(/ك/g,'ک').replace(/‌/g,' ').replace(/\s+/g,' ');
const unique=a=>[...new Set(a.filter(Boolean))];
const S={
 grade:['پیش‌دبستانی','پایه اول دبستان','پایه دوم دبستان','پایه سوم دبستان','پایه چهارم دبستان','پایه پنجم دبستان','پایه ششم دبستان','پایه هفتم','پایه هشتم','پایه نهم','پایه دهم','پایه یازدهم','پایه دوازدهم','کلاس چندپایه'],
 subject:['فارسی','ریاضی','علوم تجربی','مطالعات اجتماعی','قرآن','هدیه‌های آسمانی','هنر','تربیت بدنی','تفکر و پژوهش','زبان انگلیسی','عربی','فیزیک','شیمی','زیست‌شناسی','تاریخ','جغرافیا','مهارت‌های زندگی'],
 duration:['۳۰ دقیقه','۴۵ دقیقه','۶۰ دقیقه','۷۵ دقیقه','۹۰ دقیقه','یک زنگ درسی','دو زنگ درسی'],
 learning_flow:['اکتشافی','توضیح + تمرین','مسئله‌محور','پروژه‌محور','مشارکتی','بازی‌محور','کلاس معکوس'],
 difficulty:['آسان','متوسط','دشوار','سطح‌بندی‌شده','آسان تا متوسط','متوسط تا دشوار','بر اساس سطوح بلوم'],
 content_format:['متن آموزشی','داستان آموزشی','بازی آموزشی','فعالیت کلاسی','بسته آموزشی','کاربرگ','آزمون کوتاه','ارائه / اسلاید','سناریوی تدریس','ترکیبی'],
 content_length:['۳۰۰ تا ۵۰۰ کلمه','۵۰۰ تا ۸۰۰ کلمه','۸۰۰ تا ۱۲۰۰ کلمه','یک صفحه','دو صفحه','۵ دقیقه','۱۰ دقیقه','۱۵ دقیقه','سه فعالیت'],
 pedagogy:['ساده و کودکانه','مثال‌محور','داستانی','اکتشافی','مسئله‌محور','پروژه‌محور','مشارکتی','بازی‌محور','گام‌به‌گام'],
 output_format:['Markdown','جدول','چک‌لیست','متن آماده کپی','JSON','گزارش بخش‌بندی‌شده','ساختار ارائه','ایمیل آماده ارسال'],
 depth:['کوتاه و اجرایی','متعادل','عمیق و استدلالی'],
 ms_context:['Word','Excel','PowerPoint','Teams','Outlook','OneNote'],
 nb_gap_policy:['اگر منبع کافی نیست صریحاً اعلام کن و حدس نزن','کمبود منبع را اعلام کن و سؤال بپرس','فقط بخش‌های دارای پشتوانه منبع را تولید کن']
};
function fieldValue(id){return q('#r11f_'+id)?.value.trim()||''}
function topics(){const s=norm(fieldValue('subject'));if(s.includes('ریاضی'))return['جمع و تفریق','ضرب و تقسیم','کسرها','اعداد اعشاری','اندازه‌گیری','هندسه','محیط و مساحت','الگوها','حل مسئله'];if(s.includes('علوم'))return['چرخه آب','حالت‌های ماده','نیرو و حرکت','نور و صدا','بدن انسان','گیاهان','جانوران','زمین و خاک','انرژی'];if(s.includes('فارسی'))return['روخوانی','درک مطلب','املا','نگارش','واژه‌آموزی','دستور زبان','نشانه‌ها','داستان‌خوانی'];if(s.includes('اجتماعی'))return['خانواده و جامعه','محله','نقشه و جهت‌یابی','حقوق و مسئولیت‌ها','تاریخ ایران','جغرافیای ایران'];return['مفهوم اصلی درس','مرور یک فصل','آموزش یک مهارت','حل تمرین','جمع‌بندی و مرور','ارزشیابی یک مبحث']}
function fromHint(field){const t=field.querySelector('.hint')?.textContent||'';if(!/مثال[:：]/.test(t))return[];const x=t.replace(/^.*?مثال[:：]\s*/,'').replace(/[.؛。]+$/,'');const a=x.split(/،|,|\s+یا\s+/).map(x=>x.trim()).filter(x=>x.length>1&&x.length<70);return a.length>1?a:[]}
function choicesFor(id,field){return unique(id==='topic'&&window.r11State?.role==='teacher'?topics():(S[id]||fromHint(field)))}
function setupRoleTask(){
 const defs=[
  {box:'.r112-role-box',input:'#r11RoleInput,.r112-role-input',menu:'.r112-combo-menu',opt:'.r112-role-option',id:'r19-role-options'},
  {box:'.r115-task-box',input:'#r11TaskInput,.r115-task-input',menu:'.r115-task-menu',opt:'.r115-task-option',id:'r19-task-options'}
 ];
 defs.forEach(def=>{
   const box=q(def.box),input=box&&q(def.input,box),menu=box&&q(def.menu,box);if(!box||!input||!menu||input.dataset.r19a11y)return;
   input.dataset.r19a11y='1';menu.id=menu.id||def.id;input.setAttribute('role','combobox');input.setAttribute('aria-autocomplete','list');input.setAttribute('aria-controls',menu.id);input.setAttribute('aria-expanded','false');menu.setAttribute('role','listbox');
   let idx=-1;
   const options=()=>qa(def.opt,box).filter(x=>!x.hidden&&getComputedStyle(x).display!=='none');
   function refreshAria(){qa(def.opt,box).forEach((o,i)=>{if(!o.id)o.id=`${menu.id}-${i+1}`;o.setAttribute('role','option');o.setAttribute('tabindex','-1');o.setAttribute('aria-selected',o.classList.contains('active')?'true':'false')})}
   function clearKb(){qa(def.opt,box).forEach(o=>o.classList.remove('r19-kb'));input.removeAttribute('aria-activedescendant')}
   function move(d){const list=options();if(!list.length)return;idx=(idx+d+list.length)%list.length;clearKb();const o=list[idx];o.classList.add('r19-kb');input.setAttribute('aria-activedescendant',o.id);o.scrollIntoView({block:'nearest',behavior:'smooth'})}
   input.addEventListener('focus',()=>{input.setAttribute('aria-expanded','true');refreshAria()});
   input.addEventListener('blur',()=>setTimeout(()=>input.setAttribute('aria-expanded','false'),120));
   input.addEventListener('input',()=>{idx=-1;clearKb();window.RAVAN_UI?.applyChoiceFilter(box,def);refreshAria()});
   input.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();input.setAttribute('aria-expanded','true');move(1)}else if(e.key==='ArrowUp'){e.preventDefault();input.setAttribute('aria-expanded','true');move(-1)}else if(e.key==='Enter'&&idx>=0){const list=options();if(list[idx]){e.preventDefault();list[idx].click();clearKb();idx=-1}}else if(e.key==='Escape'){e.preventDefault();clearKb();idx=-1;input.setAttribute('aria-expanded','false')}});
   menu.addEventListener('click',()=>setTimeout(refreshAria,0));window.addEventListener('ravan:filterchange',()=>{idx=-1;clearKb();refreshAria()});refreshAria();
 });
}
function closeDynamic(except){qa('.r19-combo-menu.open').forEach(m=>{if(m!==except){m.classList.remove('open');m.closest('.r19-combo')?.querySelector('input')?.setAttribute('aria-expanded','false')}})}
function addDynamicCombo(field,input,id){
 if(input.dataset.r19combo)return;const initial=choicesFor(id,field);if(!initial.length)return;input.dataset.r19combo='1';input.setAttribute('role','combobox');input.setAttribute('aria-autocomplete','list');input.setAttribute('aria-expanded','false');
 const wrap=document.createElement('div');wrap.className='r19-combo';const row=document.createElement('div');row.className='r19-combo-row';const menu=document.createElement('div');menu.className='r19-combo-menu';menu.id=`r19-combo-${id}-${Math.random().toString(36).slice(2,7)}`;menu.setAttribute('role','listbox');input.setAttribute('aria-controls',menu.id);const toggle=document.createElement('button');toggle.type='button';toggle.className='r19-combo-toggle';toggle.setAttribute('aria-label','نمایش پیشنهادها');toggle.textContent='⌄';
 input.parentNode.insertBefore(wrap,input);row.append(input,toggle);wrap.append(row,menu);const note=document.createElement('div');note.className='r19-combo-note';note.textContent='انتخاب از پیشنهادها + تایپ آزاد + جست‌وجوی زنده';wrap.append(note);let idx=-1;
 const list=()=>choicesFor(id,field);
 function render(open=true){const query=norm(input.value),items=list().filter(x=>!query||norm(x).includes(query)).slice(0,30);idx=-1;menu.innerHTML='';input.removeAttribute('aria-activedescendant');if(items.length)items.forEach((x,i)=>{const o=document.createElement('button');o.type='button';o.className='r19-combo-option';o.id=`${menu.id}-o${i}`;o.setAttribute('role','option');o.setAttribute('aria-selected','false');o.textContent=x;o.addEventListener('mousedown',e=>e.preventDefault());o.addEventListener('click',()=>pick(x));menu.append(o)});else{const e=document.createElement('div');e.className='r19-combo-empty';e.textContent='پیشنهاد مشابهی پیدا نشد؛ همین متن تایپ‌شده قابل استفاده است.';menu.append(e)}if(open){closeDynamic(menu);menu.classList.add('open');input.setAttribute('aria-expanded','true')}}
 function pick(x){input.value=x;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));menu.classList.remove('open');input.setAttribute('aria-expanded','false');input.focus()}
 function move(d){const opts=qa('.r19-combo-option',menu);if(!opts.length)return;idx=(idx+d+opts.length)%opts.length;opts.forEach((o,i)=>{const on=i===idx;o.classList.toggle('active',on);o.setAttribute('aria-selected',on?'true':'false')});const o=opts[idx];input.setAttribute('aria-activedescendant',o.id);o.scrollIntoView({block:'nearest'})}
 input.addEventListener('focus',()=>render());input.addEventListener('input',()=>render());input.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();if(!menu.classList.contains('open'))render();move(1)}else if(e.key==='ArrowUp'){e.preventDefault();if(!menu.classList.contains('open'))render();move(-1)}else if(e.key==='Enter'&&menu.classList.contains('open')&&idx>=0){e.preventDefault();pick(qa('.r19-combo-option',menu)[idx].textContent)}else if(e.key==='Escape'){menu.classList.remove('open');input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant')}});toggle.addEventListener('mousedown',e=>e.preventDefault());toggle.addEventListener('click',()=>{if(menu.classList.contains('open')){menu.classList.remove('open');input.setAttribute('aria-expanded','false')}else{render();input.focus()}})
}
function enhanceDynamic(){qa('#r11DynamicFields .r11-field[data-r13-field]').forEach(field=>{const input=q('input.r11-input,input',field);if(input)addDynamicCombo(field,input,field.dataset.r13Field)})}
function labelIconButtons(){qa('button').forEach(b=>{if(!b.getAttribute('aria-label')&&!b.textContent.trim()&&b.querySelector('svg'))b.setAttribute('aria-label','دکمه')})}
function ensureTouchTargets(){qa('button,[role="button"]').forEach(el=>{if(!el.hasAttribute('tabindex')&&el.tagName!=='BUTTON')el.tabIndex=0})}
function boot(){setupRoleTask();enhanceDynamic();labelIconButtons();ensureTouchTargets();document.addEventListener('click',e=>{if(!e.target.closest('.r19-combo'))closeDynamic()});const root=q('#r11DynamicFields');if(root)new MutationObserver(enhanceDynamic).observe(root,{childList:true,subtree:true});new MutationObserver(()=>{setupRoleTask();enhanceDynamic();labelIconButtons()}).observe(document.body,{childList:true,subtree:true});document.documentElement.dataset.ravanA11y='19'}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
