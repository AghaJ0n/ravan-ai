/* RAVAN AI — persistent navigation + first-paint readiness */
(()=>{
'use strict';
const root=document.documentElement;
root.dataset.ravanPersistentNav='19.38';
root.classList.remove('r19-first-ready');

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

  /* Utility/workspace views do not need the role catalogue. */
  if(visible(document.querySelector('.r19-utility-view.open'))) return true;
  const ws=document.querySelector('#r11Workspace.open,.r11-workspace.open');
  if(visible(ws)) return true;

  const active=document.querySelector('.r11-section.active');
  const step=Number(active?.dataset?.r11step||0);

  if(step===0){
    /* The reported flash happens when the shell exists but the role cards have
       not reached layout yet. Require several genuinely painted cards. */
    return visibleCount('.r112-role-option')>=4;
  }
  if(step===1) return visibleCount('.r115-task-option')>=2;
  if(step===2) return visibleCount('.r11-ai')>=1;
  return !!active;
}

let stableFrames=0;
let done=false;
const started=performance.now();

function probe(){
  if(done) return;
  if(appViewReady()) stableFrames++; else stableFrames=0;

  /* Two consecutive painted frames prevents revealing between DOM creation and
     the final layout/filter pass. A defensive timeout avoids trapping the user
     if a future view changes its markup. */
  if(stableFrames>=2 || (document.querySelector('.r19-app') && performance.now()-started>2200)){
    done=true;
    requestAnimationFrame(()=>{
      root.classList.add('r19-first-ready');
      root.dataset.ravanFirstReady=stableFrames>=2?'visible-content':'timeout-fallback';
      window.dispatchEvent(new CustomEvent('ravan:first-ready'));
    });
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
