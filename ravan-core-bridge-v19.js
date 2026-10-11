/* RAVAN AI v19.11 — restore and preserve the Core workspace */
(()=>{
'use strict';

/* Repair the two known nested insertBefore calls in the v19 UI. */
const nativeInsertBefore=Node.prototype.insertBefore;
if(!window.__RAVAN_INSERTBEFORE_FIX__){
  window.__RAVAN_INSERTBEFORE_FIX__=1;
  Node.prototype.insertBefore=function(newNode,refNode){
    const helper=newNode?.nodeType===1 && (
      newNode.classList?.contains('r19-field-search-icon') ||
      newNode.classList?.contains('r19-cats')
    );
    if(helper && refNode?.parentNode && refNode.parentNode!==this && this.nodeType===1 && this.contains?.(refNode)){
      return nativeInsertBefore.call(refNode.parentNode,newNode,refNode);
    }
    return nativeInsertBefore.call(this,newNode,refNode);
  };
}
document.documentElement.dataset.ravanBridgeLoaded='19.11';

/* In the legacy payload, an old malformed inline block can leave the workspace
   markup unmaterialized even though r11Move/buildWs are available. index.html
   preserves the exact source fragment so we can restore that original DOM. */
let workspace=document.getElementById('r11Workspace')||document.querySelector('.r11-workspace');
let restored=false;
if(!workspace && window.__RAVAN_WORKSPACE_HTML){
  const tpl=document.createElement('template');
  tpl.innerHTML=window.__RAVAN_WORKSPACE_HTML;
  workspace=tpl.content.querySelector('#r11Workspace')||tpl.content.querySelector('.r11-workspace');
  restored=!!workspace;
}
if(!workspace){
  document.documentElement.dataset.ravanWorkspaceBridge='missing-source';
  return;
}
if(workspace.dataset.r19CoreBridge)return;
workspace.dataset.r19CoreBridge='1';
const shell=workspace.querySelector('.r11-ws-shell');
if(workspace.isConnected)workspace.remove();
document.documentElement.dataset.ravanWorkspaceBridge=restored?'restored-stashed':'stashed';

let attached=false;
function attach(){
  const main=document.querySelector('.r19-main');
  if(!main)return false;
  if(shell && shell.parentNode!==workspace)workspace.appendChild(shell);
  if(workspace.parentNode!==main)main.appendChild(workspace);
  document.documentElement.dataset.ravanWorkspaceBridge=restored?'restored-ready':'ready';
  attached=true;
  return true;
}
function tryAttach(){if(!attached)attach()}

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
