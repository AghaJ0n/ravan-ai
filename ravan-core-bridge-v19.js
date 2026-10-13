/* RAVAN AI v19.32 — restore Core workspace, recovered legacy globals and professional teacher form */
(()=>{
'use strict';

/* Legacy Core handlers still call a global toast(). The consolidated UI owns
   the real toast renderer inside RAVAN_UI, so expose a compatibility bridge. */
if(typeof window.toast!=='function'){
  window.toast=function(message,type='success'){
    if(window.RAVAN_UI&&typeof window.RAVAN_UI.toast==='function'){
      return window.RAVAN_UI.toast(message,type);
    }
    console.info('[RAVAN]',message);
  };
}
document.documentElement.dataset.ravanBridgeLoaded='19.16';
document.documentElement.dataset.ravanLegacyRuntime=typeof window.move==='function'?'ready':'missing';

const gate=document.querySelector('.r11-gate');

/* Restore the Core workspace when the legacy inline block prevented
   its late markup from materializing. */
let workspace=document.getElementById('r11Workspace')||document.querySelector('.r11-workspace');
let restored=false;
if(!workspace && window.__RAVAN_WORKSPACE_HTML){
  const tpl=document.createElement('template');
  tpl.innerHTML=window.__RAVAN_WORKSPACE_HTML;
  workspace=tpl.content.querySelector('#r11Workspace')||tpl.content.querySelector('.r11-workspace');
  restored=!!workspace;
}
if(workspace){
  workspace.dataset.r19CoreBridge='1';
  if(workspace.isConnected)workspace.remove();
  document.documentElement.dataset.ravanWorkspaceBridge=restored?'restored-stashed':'stashed';
}else{
  document.documentElement.dataset.ravanWorkspaceBridge='missing-source';
}
const shell=workspace?.querySelector('.r11-ws-shell')||null;

/* Preserve the original TeacherAI professional interface before v19 rebuilds
   <body>. We keep all legacy top-level UI nodes (app, overlays, modals, toast)
   in a detached host; scripts stay in place so subsequent external files still
   execute normally. This avoids rendering both UIs at once. */
const professionalHost=document.createElement('section');
professionalHost.id='r19ProfessionalHost';
professionalHost.className='r19-professional-host';
professionalHost.hidden=true;
professionalHost.setAttribute('aria-label','فرم حرفه‌ای آموزشی RAVAN AI');

const returnBar=document.createElement('div');
returnBar.className='r19-professional-return';
returnBar.innerHTML='<button type="button" id="r19ProfessionalBack">← بازگشت به فضای کاری RAVAN</button><div><b>فرم حرفه‌ای آموزشی</b><span>تنظیمات کامل آموزش، ارزشیابی و کنترل کیفیت</span></div>';
const professionalBody=document.createElement('div');
professionalBody.className='r19-professional-body';
professionalHost.append(returnBar,professionalBody);

const legacyNodes=[];
[...document.body.children].forEach(el=>{
  if(el===gate||el===workspace)return;
  if(el.tagName==='SCRIPT'||el.tagName==='STYLE'||el.tagName==='LINK'||el.id==='boot')return;
  legacyNodes.push(el);
});
legacyNodes.forEach(el=>professionalBody.appendChild(el));
document.documentElement.dataset.ravanProfessionalBridge=legacyNodes.length?'stashed':'missing';

function closeLegacyOverlays(){
  const welcome=professionalHost.querySelector('#welcomeOverlay');
  const home=professionalHost.querySelector('#homeOverlayV7');
  if(welcome){
    welcome.classList.remove('open','show','active');
    welcome.setAttribute('aria-hidden','true');
    welcome.style.display='none';
  }
  if(home){
    home.classList.remove('v7-home-open','open','show','active');
    home.setAttribute('aria-hidden','true');
    home.style.display='none';
  }
}
closeLegacyOverlays();

let qualityObserver=null;
let qualityLinksInstalled=false;

function normalizeQualityText(value){
  return String(value||'')
    .replace(/[يى]/g,'ی').replace(/ك/g,'ک')
    .replace(/[\u064B-\u065F\u0670]/g,'')
    .replace(/[‌‍]/g,' ')
    .replace(/[«»"'`()[\]{}:؛،,.!?؟]/g,' ')
    .replace(/\s+/g,' ').trim().toLowerCase();
}

function qualityFieldName(issueText){
  let text=String(issueText||'').replace(/فیلد الزامی تکمیل نشده/g,' ').trim();
  const dashParts=text.split(/[—–-]/).map(x=>x.trim()).filter(Boolean);
  if(dashParts.length>1)text=dashParts[dashParts.length-1];
  text=text.replace(/^[\s۰-۹٠-٩0-9.]+/,'').trim();
  return text;
}

function controlForLabel(el){
  if(!el)return null;
  if(el.matches?.('input:not([type="hidden"]),textarea,select,[contenteditable="true"]'))return el;
  if(el.tagName==='LABEL'){
    const id=el.getAttribute('for');
    if(id){
      const byId=professionalHost.querySelector('#'+CSS.escape(id));
      if(byId)return byId;
    }
    const inside=el.querySelector('input:not([type="hidden"]),textarea,select,[contenteditable="true"]');
    if(inside)return inside;
  }
  const container=el.closest?.('.field,.form-group,.question,.input-group,.control,.card,fieldset,[class*="field"],[class*="question"]')||el.parentElement;
  return container?.querySelector?.('input:not([type="hidden"]),textarea,select,[contenteditable="true"]')||null;
}

function scoreFieldCandidate(text,target){
  if(!text||!target)return -1;
  if(text===target)return 1000;
  if(text.includes(target))return 850-Math.min(250,text.length-target.length);
  if(target.includes(text)&&text.length>=5)return 650-Math.min(200,target.length-text.length);
  const words=target.split(' ').filter(x=>x.length>1);
  if(!words.length)return -1;
  const hits=words.filter(w=>text.includes(w)).length;
  return hits>=Math.max(1,Math.ceil(words.length*.6)) ? hits*80-Math.abs(text.length-target.length) : -1;
}

function resolveQualityTarget(issueText){
  const modal=professionalHost.querySelector('#qualityModal');
  const targetName=normalizeQualityText(qualityFieldName(issueText));
  if(!targetName)return null;
  const semantic=[...professionalHost.querySelectorAll('label,legend,h1,h2,h3,h4,h5,h6,b,strong,.label,.field-label,.field-title,.control-label,[data-label]')]
    .filter(el=>!modal?.contains(el));
  let best=null,bestScore=-1;
  for(const el of semantic){
    const score=scoreFieldCandidate(normalizeQualityText(el.textContent),targetName);
    if(score<=bestScore)continue;
    const control=controlForLabel(el);
    if(control){best={control,anchor:el};bestScore=score}
  }
  if(best)return best;

  for(const control of professionalHost.querySelectorAll('input:not([type="hidden"]),textarea,select,[contenteditable="true"]')){
    if(modal?.contains(control))continue;
    const container=control.closest('.field,.form-group,.question,.input-group,.control,.card,fieldset,[class*="field"],[class*="question"]')||control.parentElement;
    const probe=[control.getAttribute('aria-label'),control.getAttribute('placeholder'),control.name,control.id,container?.textContent].filter(Boolean).join(' ');
    const score=scoreFieldCandidate(normalizeQualityText(probe),targetName);
    if(score>bestScore){best={control,anchor:container||control};bestScore=score}
  }
  return bestScore>=0?best:null;
}

function flashQualityTarget(control,anchor){
  const target=control.closest('.field,.form-group,.question,.input-group,.control,.card,fieldset,[class*="field"],[class*="question"]')||anchor||control;
  target.classList.remove('r19-quality-target-flash');
  void target.offsetWidth;
  target.classList.add('r19-quality-target-flash');
  setTimeout(()=>target.classList.remove('r19-quality-target-flash'),2400);
}

function navigateToQualityIssue(issueText){
  const found=resolveQualityTarget(issueText);
  if(!found){
    window.toast('فیلد مربوط به این مورد پیدا نشد','error');
    return;
  }
  const {control,anchor}=found;
  const steps=[...professionalHost.querySelectorAll('section.step')];
  const section=control.closest('section.step')||anchor?.closest?.('section.step');
  const stepIndex=section?steps.indexOf(section):-1;
  try{window.closeQualityModal?.()}catch(e){}
  if(stepIndex>=0){
    try{window.setStep?.(stepIndex)}catch(e){console.warn('[RAVAN] quality jump step',e)}
  }
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    (anchor||control).scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'});
    flashQualityTarget(control,anchor);
    setTimeout(()=>{
      try{control.focus({preventScroll:true})}catch(e){try{control.focus()}catch(_) {}}
    },260);
  }));
}

function issueRowFor(node,modal){
  let row=node.closest?.('[class*="issue"],[class*="problem"],[class*="warning"],[class*="error"],li');
  if(row&&row!==modal)return row;
  row=node.parentElement;
  while(row&&row.parentElement&&row.parentElement!==modal){
    const text=normalizeQualityText(row.textContent);
    if(text.includes('فیلد الزامی تکمیل نشده')&&row.children.length<=6)break;
    row=row.parentElement;
  }
  return row&&row!==modal?row:null;
}

function decorateQualityIssues(){
  const modal=professionalHost.querySelector('#qualityModal');
  if(!modal)return;
  const marker=normalizeQualityText('فیلد الزامی تکمیل نشده');
  const seen=new Set();
  const nodes=[...modal.querySelectorAll('div,li,p,span,b,strong')].filter(el=>{
    const own=normalizeQualityText(el.textContent);
    if(!own.includes(marker))return false;
    return ![...el.children].some(ch=>normalizeQualityText(ch.textContent).includes(marker));
  });
  nodes.forEach(node=>{
    const row=issueRowFor(node,modal);
    if(!row||seen.has(row))return;
    seen.add(row);
    const issueText=row.textContent||node.textContent||'';
    row.classList.add('r19-quality-field-link');
    row.setAttribute('role','button');
    row.setAttribute('tabindex','0');
    row.setAttribute('title','رفتن به این فیلد');
    row.dataset.r19QualityIssue=issueText.trim();
  });
}

function installQualityLinks(){
  if(!document.getElementById('r19-quality-link-style')){
    const style=document.createElement('style');
    style.id='r19-quality-link-style';
    style.textContent=`
      #qualityModal .r19-quality-field-link{cursor:pointer!important;position:relative;transition:transform .16s ease,box-shadow .16s ease,border-color .16s ease!important}
      #qualityModal .r19-quality-field-link:hover,#qualityModal .r19-quality-field-link:focus-visible{transform:translateY(-1px);border-color:#8b5cf6!important;box-shadow:0 7px 20px rgba(98,70,234,.13)!important;outline:none!important}
      #qualityModal .r19-quality-field-link:focus-visible{box-shadow:0 0 0 3px rgba(98,70,234,.18),0 7px 20px rgba(98,70,234,.13)!important}
      .r19-quality-target-flash{animation:r19QualityTarget 1.15s ease 2!important;outline:3px solid rgba(98,70,234,.34)!important;outline-offset:4px!important;border-radius:12px!important}
      @keyframes r19QualityTarget{0%,100%{box-shadow:0 0 0 0 rgba(98,70,234,0)}45%{box-shadow:0 0 0 7px rgba(98,70,234,.16)}}
      @media(prefers-reduced-motion:reduce){#qualityModal .r19-quality-field-link,.r19-quality-target-flash{transition:none!important;animation:none!important}}
    `;
    document.head.appendChild(style);
  }

  const modal=professionalHost.querySelector('#qualityModal');
  if(modal&&!qualityObserver){
    qualityObserver=new MutationObserver(()=>decorateQualityIssues());
    qualityObserver.observe(modal,{childList:true,subtree:true,characterData:true});
  }

  if(typeof window.runQualityCheck==='function'&&!window.runQualityCheck.__r19Linked){
    const original=window.runQualityCheck;
    const wrapped=function(...args){
      const result=original.apply(this,args);
      setTimeout(decorateQualityIssues,0);
      setTimeout(decorateQualityIssues,80);
      return result;
    };
    wrapped.__r19Linked=true;
    window.runQualityCheck=wrapped;
  }

  if(!qualityLinksInstalled){
    professionalHost.addEventListener('click',e=>{
      const row=e.target?.closest?.('.r19-quality-field-link');
      if(!row||!professionalHost.querySelector('#qualityModal')?.contains(row))return;
      e.preventDefault();
      e.stopPropagation();
      navigateToQualityIssue(row.dataset.r19QualityIssue||row.textContent||'');
    });
    professionalHost.addEventListener('keydown',e=>{
      if(e.key!=='Enter'&&e.key!==' ')return;
      const row=e.target?.closest?.('.r19-quality-field-link');
      if(!row)return;
      e.preventDefault();
      navigateToQualityIssue(row.dataset.r19QualityIssue||row.textContent||'');
    });
    qualityLinksInstalled=true;
  }
  decorateQualityIssues();
}

let attached=false;
function attach(){
  const main=document.querySelector('.r19-main');
  if(!main)return false;
  if(workspace){
    if(shell && shell.parentNode!==workspace)workspace.appendChild(shell);
    if(workspace.parentNode!==main)main.appendChild(workspace);
    document.documentElement.dataset.ravanWorkspaceBridge=restored?'restored-ready':'ready';
  }
  if(professionalHost.parentNode!==main)main.appendChild(professionalHost);
  closeLegacyOverlays();
  document.getElementById('ravan-legacy-overlay-guard')?.remove();
  installQualityLinks();
  document.documentElement.dataset.ravanProfessionalBridge=legacyNodes.length?'ready':'missing';
  attached=true;
  return true;
}
function tryAttach(){if(!attached)attach()}

const originalTeacherAdvanced=typeof window.r11OpenTeacherAdvanced==='function'?window.r11OpenTeacherAdvanced:null;
const originalOpenHome=typeof window.openHomeV7==='function'?window.openHomeV7:null;

function enterProfessional(){
  attach();
  if(!legacyNodes.length){
    window.toast('فرم حرفه‌ای در این نسخه در دسترس نیست','error');
    return;
  }
  professionalHost.hidden=false;
  document.documentElement.classList.add('r19-professional-active');
  workspace?.classList.remove('open');
  if(gate)gate.style.display='none';
  closeLegacyOverlays();
  try{originalTeacherAdvanced?.call(window)}catch(e){console.warn('[RAVAN] legacy advanced transition',e)}
  try{window.closeHomeV7?.()}catch(e){}
  try{window.closeWelcome?.()}catch(e){}
  try{window.startProfessional?.()}catch(e){console.warn('[RAVAN] startProfessional',e)}
  try{window.setStep?.(0)}catch(e){console.warn('[RAVAN] setStep',e)}
  closeLegacyOverlays();
  installQualityLinks();
  professionalHost.hidden=false;
  window.scrollTo({top:0,behavior:'auto'});
  document.documentElement.dataset.ravanProfessionalBridge='open';
  window.toast('فرم حرفه‌ای آموزشی باز شد');
}

function exitProfessional(){
  professionalHost.hidden=true;
  document.documentElement.classList.remove('r19-professional-active');
  if(gate)gate.style.display='none';
  if(workspace){
    workspace.style.removeProperty('display');
    workspace.classList.add('open');
  }
  closeLegacyOverlays();
  document.documentElement.dataset.ravanProfessionalBridge=legacyNodes.length?'ready':'missing';
  window.RAVAN_UI?.refreshSide?.();
  window.scrollTo({top:0,behavior:'auto'});
}

document.addEventListener('click',e=>{
  const btn=e.target?.closest?.('#r11TeacherAdvanced button');
  if(!btn)return;
  e.preventDefault();
  e.stopImmediatePropagation();
  enterProfessional();
},true);

window.r11OpenTeacherAdvanced=enterProfessional;

window.openHomeV7=function(){
  const home=professionalHost.querySelector('#homeOverlayV7');
  if(home){
    home.style.removeProperty('display');
    home.removeAttribute('aria-hidden');
  }
  return originalOpenHome?.call(window);
};

window.RAVAN_PROFESSIONAL={open:enterProfessional,close:exitProfessional,host:professionalHost};
returnBar.querySelector('#r19ProfessionalBack')?.addEventListener('click',exitProfessional);

setTimeout(tryAttach,0);
setTimeout(tryAttach,50);
setTimeout(tryAttach,250);
requestAnimationFrame(()=>requestAnimationFrame(tryAttach));
document.addEventListener('DOMContentLoaded',tryAttach,{once:true});
window.addEventListener('load',tryAttach,{once:true});

const observer=new MutationObserver(()=>{if(attach())observer.disconnect()});
observer.observe(document.documentElement,{childList:true,subtree:true});
setTimeout(()=>{tryAttach();observer.disconnect()},5000);
})();
