/* RAVAN AI — persistent navigation behavior */
(()=>{
'use strict';
const root=document.documentElement;
root.dataset.ravanPersistentNav='19.19';

function leaveProfessionalForGlobalNav(){
  if(!root.classList.contains('r19-professional-active'))return;
  try{window.RAVAN_PROFESSIONAL?.close?.()}catch(err){console.warn('[RAVAN] close professional before navigation',err)}
  /* The global sidebar must win even if a legacy handler keeps stale mode
     state. Force the shell out of professional mode before the normal nav
     action runs; the destination handler will then choose Builder/Utility. */
  root.classList.remove('r19-professional-active');
  const host=document.getElementById('r19ProfessionalHost');
  if(host)host.hidden=true;
}

document.addEventListener('click',e=>{
  const item=e.target?.closest?.('.r19-navitem');
  if(!item)return;
  leaveProfessionalForGlobalNav();
},true);
})();
