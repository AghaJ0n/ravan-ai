/* RAVAN AI v19 — workspace action reliability */
(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
const norm=s=>String(s||'').replace(/\s+/g,' ').trim();
const isBuildButton=el=>{
  if(!el)return false;
  const t=el.tagName==='INPUT'?(el.value||''):(el.textContent||'');
  return norm(t).includes('ساخت فضای کاری من');
};
function toast(msg,type='error'){
  if(window.RAVAN_UI?.toast){window.RAVAN_UI.toast(msg,type);return;}
  let n=q('#r19WorkspaceNotice');
  if(!n){n=document.createElement('div');n.id='r19WorkspaceNotice';Object.assign(n.style,{position:'fixed',left:'16px',bottom:'84px',zIndex:'9999',maxWidth:'320px',padding:'12px 14px',borderRadius:'12px',background:'#172033',color:'#fff',font:'12px/1.9 Vazirmatn,Tahoma,sans-serif',boxShadow:'0 12px 32px rgba(20,30,55,.2)'});document.body.append(n)}
  n.textContent=msg;clearTimeout(n._t);n._t=setTimeout(()=>n.remove(),3500);
}
function syncControls(scope){
  qa('input,textarea,select',scope||document).forEach(el=>{
    if(el.disabled)return;
    try{el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))}catch(_){ }
  });
}
function invalidControl(btn){
  const form=btn.form||btn.closest('form');
  if(!form)return null;
  return qa('input,textarea,select',form).find(el=>!el.disabled&&typeof el.checkValidity==='function'&&!el.checkValidity())||null;
}
function snapshot(){return {ws:qa('.r11-ws-shell').length,active:q('.r11-section.active'),href:location.href};}
function changed(s){return qa('.r11-ws-shell').length!==s.ws||q('.r11-section.active')!==s.active||location.href!==s.href;}
function prepare(btn){
  if(btn.dataset.r19WorkspacePrepared)return;
  btn.dataset.r19WorkspacePrepared='1';
  btn.style.pointerEvents='auto';
  btn.style.touchAction='manipulation';
  btn.style.position=btn.style.position||'relative';
  btn.style.zIndex='6';
  if(!btn.getAttribute('aria-label'))btn.setAttribute('aria-label','ساخت فضای کاری من');
}
function scan(){qa('button,input[type="button"],input[type="submit"],[role="button"]').filter(isBuildButton).forEach(prepare)}
function handle(e){
  const btn=e.target?.closest?.('button,input[type="button"],input[type="submit"],[role="button"]');
  if(!isBuildButton(btn))return;
  prepare(btn);
  const scope=btn.closest('.r11-section,.r11-ws-shell,.r11-gate,form')||document;
  syncControls(scope);
  const invalid=invalidControl(btn);
  if(invalid){
    setTimeout(()=>{try{invalid.reportValidity();invalid.focus({preventScroll:false})}catch(_){ }},0);
    return;
  }
  if(btn.dataset.r19WorkspaceRetry==='1')return;
  const s=snapshot();
  setTimeout(()=>{
    if(changed(s)||!btn.isConnected||btn.disabled||btn.getAttribute('aria-busy')==='true')return;
    btn.dataset.r19WorkspaceRetry='1';
    syncControls(scope);
    const form=btn.form||btn.closest('form');
    try{
      if(form&&typeof form.requestSubmit==='function'&&(btn.type||'').toLowerCase()==='submit') form.requestSubmit(btn);
      else btn.click();
    }catch(err){console.error('[RAVAN workspace action]',err)}
    setTimeout(()=>{
      if(!changed(s)&&btn.isConnected&&!btn.disabled){
        toast('ساخت فضای کاری اجرا نشد. لطفاً فیلدهای این مرحله را بررسی کنید و دوباره تلاش کنید.');
      }
      delete btn.dataset.r19WorkspaceRetry;
    },500);
  },350);
}
document.addEventListener('click',handle,true);
document.addEventListener('touchstart',e=>{const b=e.target?.closest?.('button,[role="button"],input');if(isBuildButton(b))prepare(b)},{passive:true,capture:true});
function boot(){scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
