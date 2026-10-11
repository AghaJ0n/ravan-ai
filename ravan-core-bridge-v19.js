/* RAVAN AI v19.8 — preserve Core workspace and patch targeted UI DOM insertion */
(()=>{
'use strict';

/* v19 UI adds a search icon relative to an input nested inside the role/task
   combo. Its old call uses box.insertBefore(icon,input), although `input` is
   not a direct child of `box`, which throws a DOMException and aborts the UI
   mount. Keep the native behavior everywhere else and repair only that exact
   descendant case. */
const nativeInsertBefore=Node.prototype.insertBefore;
if(!window.__RAVAN_INSERTBEFORE_FIX__){
  window.__RAVAN_INSERTBEFORE_FIX__=1;
  Node.prototype.insertBefore=function(newNode,refNode){
    if(
      newNode?.nodeType===1 &&
      newNode.classList?.contains('r19-field-search-icon') &&
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
document.documentElement.dataset.ravanBridgeLoaded='19.8';

/* Core buildWs() toggles the `open` class on #r11Workspace itself and keeps
   references to many descendants. Preserve that exact parent node — not only
   .r11-ws-shell — while the consolidated UI rebuilds <body>. */
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
