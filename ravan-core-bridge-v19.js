/* RAVAN AI v19.9 — preserve Core workspace and patch targeted UI DOM insertion */
(()=>{
'use strict';

/* v19 UI inserts category/search helpers relative to descendants of the
   role/task boxes. Native insertBefore requires the reference node to be a
   direct child, so route only those two helper insertions to the reference
   node's real parent. */
const nativeInsertBefore=Node.prototype.insertBefore;
if(!window.__RAVAN_INSERTBEFORE_FIX__){
  window.__RAVAN_INSERTBEFORE_FIX__=1;
  Node.prototype.insertBefore=function(newNode,refNode){
    const helper=newNode?.nodeType===1 && (
      newNode.classList?.contains('r19-field-search-icon') ||
      newNode.classList?.contains('r19-cats')
    );
    if(
      helper &&
      refNode?.parentNode &&
      refNode.parentNode!==this &&
      this.nodeType===1 &&
      this.contains?.(refNode)
    ){
      return nativeInsertBefore.call(refNode.parentNode,newNode,refNode);
    }
    return nativeInsertBefore.call(this,newNode,refNode);
  };
}
document.documentElement.dataset.ravanBridgeLoaded='19.9';

const workspace=document.getElementById('r11Workspace')||document.querySelector('.r11-workspace');
if(!workspace||workspace.dataset.r19CoreBridge)return;
workspace.dataset.r19CoreBridge='1';
workspace.remove();

function attach(){
  const main=document.querySelector('.r19-main');
  if(!main)return false;
  if(!workspace.isConnected)main.appendChild(workspace);
  document.documentElement.dataset.ravanWorkspaceBridge='ready';
  return true;
}

if(!attach()){
  const observer=new MutationObserver(()=>{
    if(attach())observer.disconnect();
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(()=>{attach();observer.disconnect()},3000);
}
})();
