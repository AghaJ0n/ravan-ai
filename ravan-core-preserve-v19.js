/* RAVAN AI v19 — preserve Core DOM while consolidated shell is mounted */
(()=>{
'use strict';
const body=document.body;
if(!body||body.dataset.r19PreserveCore)return;
body.dataset.r19PreserveCore='1';
const desc=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML')||Object.getOwnPropertyDescriptor(HTMLElement.prototype,'innerHTML');
if(!desc||!desc.get||!desc.set)return;
let skipped=false;
try{
  Object.defineProperty(body,'innerHTML',{
    configurable:true,
    enumerable:desc.enumerable,
    get(){return desc.get.call(this)},
    set(value){
      const shouldPreserve=value===''&&!skipped&&this.querySelector('.r11-gate')&&!this.querySelector('.r19-app');
      if(shouldPreserve){
        skipped=true;
        window.__RAVAN_CORE_BODY_PRESERVED__=true;
        return;
      }
      return desc.set.call(this,value);
    }
  });
}catch(_){return}
const restore=()=>{
  if(!document.querySelector('.r19-app'))return false;
  try{delete body.innerHTML}catch(_){ }
  body.dataset.r19PreserveCore='done';
  return true;
};
if(!restore()){
  const mo=new MutationObserver(()=>{if(restore())mo.disconnect()});
  mo.observe(body,{childList:true,subtree:true});
  setTimeout(()=>{restore();mo.disconnect()},3000);
}
})();
