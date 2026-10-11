/* RAVAN AI v19.7 — preserve the real Core workspace parent across UI mount */
(()=>{
'use strict';

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
