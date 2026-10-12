/* RAVAN AI v19.14 — restore Core workspace, legacy globals and professional teacher form */
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
document.documentElement.dataset.ravanBridgeLoaded='19.14';

const gate=document.querySelector('.r11-gate');

/* Restore the Core workspace when the malformed legacy inline block prevented
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
   execute normally. This avoids the v19.5 mistake of rendering both UIs at once. */
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
  document.documentElement.dataset.ravanProfessionalBridge=legacyNodes.length?'ready':'missing';
  attached=true;
  return true;
}
function tryAttach(){if(!attached)attach()}

function closeLegacyOverlays(){
  const welcome=professionalHost.querySelector('#welcomeOverlay');
  const home=professionalHost.querySelector('#homeOverlayV7');
  if(welcome)welcome.style.display='none';
  if(home){home.classList.remove('open');home.style.display='none'}
}

const originalTeacherAdvanced=typeof window.r11OpenTeacherAdvanced==='function'?window.r11OpenTeacherAdvanced:null;
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

  /* Let the original Core perform its own transition, then enforce the two
     required calls separately so one missing legacy overlay cannot abort the
     rest of the transition. */
  try{originalTeacherAdvanced?.call(window)}catch(e){console.warn('[RAVAN] legacy advanced transition',e)}
  try{window.closeHomeV7?.()}catch(e){}
  try{window.closeWelcome?.()}catch(e){}
  try{window.startProfessional?.()}catch(e){console.warn('[RAVAN] startProfessional',e)}
  try{window.setStep?.(0)}catch(e){console.warn('[RAVAN] setStep',e)}
  closeLegacyOverlays();
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
  document.documentElement.dataset.ravanProfessionalBridge=legacyNodes.length?'ready':'missing';
  window.RAVAN_UI?.refreshSide?.();
  window.scrollTo({top:0,behavior:'auto'});
}

/* Inline onclick resolves this global at click time, so replacing it here makes
   the existing purple button functional without editing the legacy payload. */
window.r11OpenTeacherAdvanced=enterProfessional;
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
