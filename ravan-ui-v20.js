/* RAVAN AI v20 — compact searchable role/task combobox patch */
(()=>{
'use strict';
const css=String.raw`
.r112-role-box.r20-enhanced:before,.r115-task-box.r20-enhanced:before{display:none!important}
.r20-enhanced{position:relative!important}
.r20-input-row{position:relative;width:min(100%,620px);margin:0 auto 8px;display:flex;align-items:center;gap:8px}
.r20-input-row:before{content:'⌕';position:absolute;right:13px;top:50%;transform:translateY(-52%);font-size:18px;color:#71809e;pointer-events:none;z-index:2}
.r20-enhanced .r112-role-input,.r20-enhanced .r115-task-input{width:100%!important;margin:0!important;padding:0 40px 0 48px!important;height:42px!important;min-height:42px!important;border:1px solid #dce3ef!important;border-radius:10px!important;background:#fff!important;box-shadow:0 6px 18px rgba(42,55,95,.045)!important;font-size:10.5px!important;outline:none!important;transition:border-color .16s,box-shadow .16s!important}
.r20-enhanced .r112-role-input:focus,.r20-enhanced .r115-task-input:focus{border-color:#bdb2ff!important;box-shadow:0 0 0 3px rgba(99,65,241,.08),0 8px 22px rgba(42,55,95,.055)!important}
.r20-toggle{position:absolute;left:6px;top:50%;transform:translateY(-50%);width:32px;height:32px;border:0;border-radius:8px;background:#f0edff;color:#5c3bea;display:grid;place-items:center;cursor:pointer;font:700 15px/1 Tahoma,sans-serif;transition:.16s;z-index:3}
.r20-toggle:hover{background:#e9e3ff}.r20-open .r20-toggle{transform:translateY(-50%) rotate(180deg)}
.r20-enhanced .r19-cats{display:none!important;width:min(100%,760px);margin:8px auto 10px!important;justify-content:center!important}
.r20-enhanced.r20-open .r19-cats{display:flex!important}
.r20-enhanced .r112-combo-menu,.r20-enhanced .r115-task-menu{display:none!important;width:min(100%,920px)!important;margin:0 auto!important;padding:10px!important;border:1px solid #e1e6f0!important;border-radius:13px!important;background:#fff!important;box-shadow:0 18px 42px rgba(44,55,96,.11)!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:9px!important;max-height:min(48vh,430px)!important;overflow:auto!important;overscroll-behavior:contain}
.r20-enhanced.r20-open .r112-combo-menu,.r20-enhanced.r20-open .r115-task-menu{display:grid!important}
.r20-enhanced .r112-role-option,.r20-enhanced .r115-task-option{min-height:82px!important;padding:12px!important;cursor:pointer!important}
.r20-enhanced .r112-role-option.r20-kb,.r20-enhanced .r115-task-option.r20-kb{border-color:#7a5af8!important;box-shadow:0 0 0 3px rgba(99,65,241,.10)!important;background:#fbfaff!important}
.r20-empty{display:none;grid-column:1/-1;padding:16px;text-align:center;color:#7e879a;font-size:10px;line-height:1.8;background:#f8f9fc;border-radius:9px}
.r20-empty.show{display:block}
.r20-combo-hint{width:min(100%,620px);margin:0 auto 9px;font-size:9px;color:#8a93a7;text-align:right;line-height:1.6}
@media(min-width:1500px){.r20-enhanced .r112-combo-menu,.r20-enhanced .r115-task-menu{grid-template-columns:repeat(5,minmax(0,1fr))!important}.r11-fields{grid-template-columns:repeat(4,minmax(0,1fr))!important}}
@media(max-width:1250px){.r20-enhanced .r112-combo-menu,.r20-enhanced .r115-task-menu{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
@media(max-width:1020px){.r20-enhanced .r112-combo-menu,.r20-enhanced .r115-task-menu{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
@media(max-width:700px){.r20-input-row,.r20-combo-hint{width:100%}.r20-enhanced .r19-cats{justify-content:flex-start!important;width:100%}.r20-enhanced .r112-combo-menu,.r20-enhanced .r115-task-menu{width:100%!important;grid-template-columns:1fr!important;max-height:52vh!important;padding:8px!important}.r20-enhanced .r112-role-option,.r20-enhanced .r115-task-option{min-height:72px!important}}
`;
const defs=[
 {box:'.r112-role-box',input:'.r112-role-input',menu:'.r112-combo-menu',opt:'.r112-role-option'},
 {box:'.r115-task-box',input:'.r115-task-input',menu:'.r115-task-menu',opt:'.r115-task-option'}
];
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
function visible(el){return getComputedStyle(el).display!=='none'}
function enhance(def){
 const box=document.querySelector(def.box),input=box?.querySelector(def.input),menu=box?.querySelector(def.menu);
 if(!box||!input||!menu||box.dataset.r20)return;
 box.dataset.r20='1';box.classList.add('r20-enhanced');input.setAttribute('role','combobox');input.setAttribute('aria-autocomplete','list');input.setAttribute('aria-expanded','false');
 const row=document.createElement('div');row.className='r20-input-row';input.parentNode.insertBefore(row,input);row.appendChild(input);
 const toggle=document.createElement('button');toggle.type='button';toggle.className='r20-toggle';toggle.textContent='⌄';toggle.setAttribute('aria-label','نمایش پیشنهادها');row.appendChild(toggle);
 const hint=document.createElement('div');hint.className='r20-combo-hint';hint.textContent='تایپ آزاد + جست‌وجوی زنده + انتخاب از پیشنهادها';row.insertAdjacentElement('afterend',hint);
 const empty=document.createElement('div');empty.className='r20-empty';empty.textContent='پیشنهاد مشابهی پیدا نشد؛ می‌توانید همین متن تایپ‌شده را ادامه دهید.';menu.appendChild(empty);
 let idx=-1;
 const options=()=>[...box.querySelectorAll(def.opt)];
 const cat=()=>box.querySelector('.r19-cat.active')?.dataset.cat||'همه';
 function open(){box.classList.add('r20-open');input.setAttribute('aria-expanded','true');apply();}
 function close(){box.classList.remove('r20-open');input.setAttribute('aria-expanded','false');clearKb();idx=-1;}
 function clearKb(){options().forEach(o=>o.classList.remove('r20-kb'))}
 function categoryMatch(text,c){if(c==='همه')return true;return (catMap[c]||[]).some(k=>text.includes(norm(k)))}
 function apply(){
   const query=norm(input.value),c=cat();let count=0;
   options().forEach(o=>{const text=norm(o.textContent);const show=(!query||text.includes(query))&&categoryMatch(text,c);o.style.display=show?'':'none';if(show)count++;o.classList.remove('r20-kb')});
   empty.classList.toggle('show',count===0);idx=-1;
 }
 function move(delta){const list=options().filter(visible);if(!list.length)return;idx=(idx+delta+list.length)%list.length;clearKb();list[idx].classList.add('r20-kb');list[idx].scrollIntoView({block:'nearest'});}
 input.addEventListener('focus',open);
 input.addEventListener('click',open);
 input.addEventListener('input',()=>{open();apply()});
 input.addEventListener('keydown',e=>{
   if(e.key==='ArrowDown'){e.preventDefault();if(!box.classList.contains('r20-open'))open();move(1)}
   else if(e.key==='ArrowUp'){e.preventDefault();if(!box.classList.contains('r20-open'))open();move(-1)}
   else if(e.key==='Enter'&&idx>=0){const list=options().filter(visible);if(list[idx]){e.preventDefault();list[idx].click();setTimeout(close,0)}}
   else if(e.key==='Escape'){e.preventDefault();close()}
 });
 toggle.addEventListener('mousedown',e=>e.preventDefault());
 toggle.addEventListener('click',()=>box.classList.contains('r20-open')?close():(open(),input.focus()));
 menu.addEventListener('click',e=>{if(e.target.closest(def.opt))setTimeout(close,0)});
 box.querySelector('.r19-cats')?.addEventListener('click',()=>setTimeout(apply,0));
 document.addEventListener('mousedown',e=>{if(!box.contains(e.target))close()});
}
function install(){
 if(!document.getElementById('ravanUiV20')){const s=document.createElement('style');s.id='ravanUiV20';s.textContent=css;document.head.appendChild(s)}
 defs.forEach(enhance);document.documentElement.dataset.ravanUi='20';
}
function boot(){install();new MutationObserver(install).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
