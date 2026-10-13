/* RAVAN AI — persistent navigation + first-paint readiness */
(()=>{
'use strict';
const root=document.documentElement;
root.dataset.ravanPersistentNav='19.40';
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
})();
