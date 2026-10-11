/* RAVAN AI v19 — targeted Core workspace bridge */
(()=>{
'use strict';
const workspace=document.querySelector('.r11-ws-shell');
if(!workspace||workspace.dataset.r19CoreBridge)return;
workspace.dataset.r19CoreBridge='1';

/* The consolidated UI rebuilds <body>. Keep only the real Core workspace
   node alive so its direct event listeners/state survive that rebuild. */
workspace.remove();

function attach(){
  const main=document.querySelector('.r19-main');
  if(!main)return false;
  if(!workspace.isConnected)main.appendChild(workspace);
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
