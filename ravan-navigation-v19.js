/* RAVAN AI — persistent navigation + first-paint readiness */
(()=>{
'use strict';
const root=document.documentElement;
root.dataset.ravanPersistentNav='19.40';
root.dataset.ravanAnswerProgress='19.42';
root.classList.remove('r19-first-ready');

/* The loader must cover the app, not prevent layout. The inline bootstrap guard
   initially hides body children to avoid any parser flash; once this controller
   runs, remove only that visibility rule so cards can receive real layout while
   the opaque html loader remains above them. */
const bootGuard=document.getElementById('ravan-pre-shell-guard');
if(bootGuard){
  bootGuard.textContent=bootGuard.textContent.replace('html:not(.r19-first-ready) body>*{visibility:hidden!important}','');
}

const visible=(el)=>{
  if(!el || el.hidden) return false;
  const cs=getComputedStyle(el);
  if(cs.display==='none' || cs.visibility==='hidden' || Number(cs.opacity||1)===0) return false;
  const r=el.getBoundingClientRect();
  return r.width>24 && r.height>24 && r.bottom>0 && r.right>0 && r.top<innerHeight && r.left<innerWidth;
};

const visibleCount=(selector)=>[...document.querySelectorAll(selector)].filter(visible).length;

function appViewReady(){
  const app=document.querySelector('.r19-app');
  if(!app) return false;

  if(visible(document.querySelector('.r19-utility-view.open'))) return true;
  const ws=document.querySelector('#r11Workspace.open,.r11-workspace.open');
  if(visible(ws)) return true;

  const active=document.querySelector('.r11-section.active');
  const step=Number(active?.dataset?.r11step||0);

  if(step===0) return visibleCount('.r112-role-option')>=4;
  if(step===1) return visibleCount('.r115-task-option')>=2;
  if(step===2) return visibleCount('.r11-ai')>=1;
  return !!active && visible(active);
}

let stableFrames=0;
let done=false;
const started=performance.now();

function release(reason){
  if(done) return;
  done=true;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    root.classList.add('r19-first-ready');
    root.dataset.ravanFirstReady=reason;
    window.dispatchEvent(new CustomEvent('ravan:first-ready'));
  }));
}

function probe(){
  if(done) return;
  if(appViewReady()) stableFrames++; else stableFrames=0;

  if(stableFrames>=2){
    release('visible-content');
    return;
  }
  if(document.querySelector('.r19-app') && performance.now()-started>8000){
    release('timeout-fallback');
    return;
  }
  requestAnimationFrame(probe);
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(probe),{once:true});
else requestAnimationFrame(probe);

new MutationObserver(()=>{
  if(!done) requestAnimationFrame(probe);
}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden']});

/* Step 4 used to jump straight to 100% as soon as the workspace opened. Keep
   the first three choices worth 75%, then make the last 25% follow the answers
   that actually exist in the generated/professional questionnaire. */
const ANSWERABLE='input,textarea,select,[contenteditable="true"]';
const ignoredInputTypes=new Set(['hidden','button','submit','reset','image']);
let progressScheduled=false;
let progressWriting=false;

function questionScope(){
  if(document.querySelector('.r19-utility-view.open')) return null;
  const professional=document.getElementById('r19ProfessionalHost');
  if(root.classList.contains('r19-professional-active') && professional && !professional.hidden){
    return {node:professional,professional:true};
  }
  const workspace=document.querySelector('#r11Workspace.open,.r11-workspace.open');
  if(workspace){
    return {node:workspace.querySelector('#r11DynamicFields')||document.querySelector('#r11DynamicFields')||workspace,professional:false};
  }
  return null;
}

function controlEligible(el,professional){
  if(!el || el.disabled) return false;
  if(el.matches('input') && ignoredInputTypes.has((el.type||'text').toLowerCase())) return false;
  if(el.getAttribute('aria-hidden')==='true') return false;
  if(el.closest('[hidden],template')) return false;
  if(el.closest('.r19-global-search,.r19-utility-actions,.r11-actions,.actions,.toolbar,.tool-bar')) return false;
  if(el.closest('[role="dialog"],.modal,[class*="modal"],[class*="overlay"],[id*="Modal"],[id*="Overlay"]')) return false;
  if(professional && !el.closest('section.step')) return false;
  if(!professional){
    const field=el.closest('.r11-field,[data-r13-field],.r13-field,.field,.form-group');
    if(field){
      const cs=getComputedStyle(field);
      if(cs.display==='none' || cs.visibility==='hidden') return false;
    }
  }
  return true;
}

function answerValue(el){
  if(el.matches('[contenteditable="true"]')) return (el.textContent||'').trim();
  const type=(el.type||'').toLowerCase();
  if(type==='checkbox' || type==='radio') return el.checked?'1':'';
  if(type==='file') return el.files?.length?'1':'';
  if(el.tagName==='SELECT' && el.multiple){
    return [...el.selectedOptions].some(o=>String(o.value||'').trim())?'1':'';
  }
  return String(el.value??'').trim();
}

function isRequiredControl(el){
  if(el.required || el.getAttribute('aria-required')==='true') return true;
  const field=el.closest('.r11-field,[data-r13-field],.r13-field,.field,.form-group');
  return !!field && (field.matches('.required,[data-required="true"]') || !!field.querySelector('[required],[aria-required="true"]'));
}

function questionStats(){
  const scope=questionScope();
  if(!scope) return null;
  const controls=[...scope.node.querySelectorAll(ANSWERABLE)].filter(el=>controlEligible(el,scope.professional));
  const groups=new Map();

  controls.forEach((el,index)=>{
    const type=(el.type||'').toLowerCase();
    const fieldKey=el.closest('[data-r13-field]')?.getAttribute('data-r13-field');
    let key='';
    if(fieldKey) key=`field:${fieldKey}`;
    else if((type==='radio'||type==='checkbox') && el.name) key=`choice:${el.name}`;
    else if(el.id) key=`id:${el.id}`;
    else if(el.name) key=`name:${el.name}:${type||el.tagName}`;
    else key=`control:${index}`;
    if(!groups.has(key)) groups.set(key,{controls:[],required:false});
    const group=groups.get(key);
    group.controls.push(el);
    group.required=group.required||isRequiredControl(el);
  });

  const all=[...groups.values()];
  const required=all.filter(group=>group.required);
  const tracked=required.length?required:all;
  let answered=0;
  for(const group of tracked){
    const choiceGroup=group.controls.some(el=>['checkbox','radio'].includes((el.type||'').toLowerCase()));
    const complete=choiceGroup
      ? group.controls.some(el=>!!answerValue(el))
      : group.controls.every(el=>!!answerValue(el));
    if(complete) answered++;
  }
  return {answered,total:tracked.length,requiredOnly:required.length>0};
}

function escHtml(value){
  return String(value||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

function shortValue(selector,fallback){
  const el=document.querySelector(selector);
  const value=String(el?.value||'').trim();
  return escHtml((value||fallback).slice(0,24));
}

function selectedAi(){
  const el=document.querySelector('.r11-ai.selected');
  if(!el) return 'هوش مصنوعی';
  const name=(el.querySelector('b,strong')?.textContent||el.textContent||'هوش مصنوعی').trim().split(/\n/)[0];
  return escHtml(name.slice(0,24));
}

function applyQuestionProgress(){
  progressScheduled=false;
  if(progressWriting) return;
  const scope=questionScope();
  const progress=document.getElementById('r19Progress');
  if(!scope || !progress) return;

  const stats=questionStats();
  if(!stats) return;
  const total=stats.total;
  const answered=Math.min(stats.answered,total);
  const ratio=total ? answered/total : 0;
  const pct=Math.round(75+(ratio*25));
  const remaining=Math.max(0,total-answered);
  const complete=total>0 && remaining===0;
  const status=total===0
    ? 'سؤال‌ها در حال آماده‌سازی‌اند'
    : complete
      ? 'همه سؤال‌های اصلی تکمیل شده‌اند'
      : `${remaining} سؤال اصلی باقی مانده`;
  const lastLabel=total
    ? `پاسخ‌ها ${answered} از ${total}`
    : 'پاسخ به سؤال‌ها';
  const role=shortValue('#r11RoleInput,.r112-role-input','نقش کاربر');
  const task=shortValue('#r11TaskInput,.r115-task-input','نوع کار');
  const ai=selectedAi();
  const signature=[answered,total,pct,role,task,ai].join('|');

  progressWriting=true;
  try{
    root.dataset.ravanQuestionProgress=`${answered}/${total}`;
    root.dataset.ravanProgressPercent=String(pct);
    root.dataset.ravanProgressMode=stats.requiredOnly?'required':'all';

    if(progress.dataset.r19AnswerSignature!==signature || !progress.querySelector('[data-r19-answer-progress]')){
      progress.innerHTML=`<div class="r19-side-card" data-r19-answer-progress="19.42"><div class="r19-side-title">پیشرفت شما</div><div class="r19-ringrow"><div class="r19-stepnote"><b>گام ۴ از ۴</b>${escHtml(status)}</div><div class="r19-ring" style="--p:${pct}"><b>${pct}%</b></div></div><div class="r19-checks"><div class="r19-check done"><span class="dot"></span><span>${role}</span><span class="tick">✓</span></div><div class="r19-check done"><span class="dot"></span><span>${task}</span><span class="tick">✓</span></div><div class="r19-check done"><span class="dot"></span><span>${ai}</span><span class="tick">✓</span></div><div class="r19-check ${complete?'done':'active'}"><span class="dot"></span><span>${escHtml(lastLabel)}</span><span class="tick">${complete?'✓':'•'}</span></div></div></div>`;
      progress.dataset.r19AnswerSignature=signature;
    }
  }finally{
    progressWriting=false;
  }
}

function scheduleQuestionProgress(){
  if(progressScheduled) return;
  progressScheduled=true;
  requestAnimationFrame(()=>requestAnimationFrame(applyQuestionProgress));
}

document.addEventListener('input',scheduleQuestionProgress,true);
document.addEventListener('change',scheduleQuestionProgress,true);
document.addEventListener('click',()=>{
  scheduleQuestionProgress();
  setTimeout(scheduleQuestionProgress,80);
},true);

const progressObserver=new MutationObserver((mutations)=>{
  if(progressWriting){
    setTimeout(scheduleQuestionProgress,0);
    return;
  }
  if(mutations.some(m=>m.type==='childList' || (m.type==='attributes' && ['class','hidden','style'].includes(m.attributeName)))){
    scheduleQuestionProgress();
  }
});

function startProgressObserver(){
  progressObserver.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden','style']});
  scheduleQuestionProgress();
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',startProgressObserver,{once:true});
else startProgressObserver();
})();
