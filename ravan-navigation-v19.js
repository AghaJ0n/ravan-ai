/* RAVAN AI — persistent navigation behavior */
(()=>{
'use strict';
const root=document.documentElement;
root.dataset.ravanPersistentNav='19.19';

function forceProfessionalOff(){
  root.classList.remove('r19-professional-active');
  const host=document.getElementById('r19ProfessionalHost');
  if(host)host.hidden=true;
}
function leaveProfessionalForGlobalNav(){
  if(!root.classList.contains('r19-professional-active'))return;
  try{window.RAVAN_PROFESSIONAL?.close?.()}catch(err){console.warn('[RAVAN] close professional before navigation',err)}
  forceProfessionalOff();
  /* Some recovered legacy handlers finish later in the same click cycle.
     Re-assert the global shell after propagation/frame so the requested
     destination cannot remain hidden behind professional mode. */
  setTimeout(forceProfessionalOff,0);
  requestAnimationFrame(forceProfessionalOff);
  setTimeout(forceProfessionalOff,80);
}

document.addEventListener('click',e=>{
  const item=e.target?.closest?.('.r19-navitem');
  if(!item)return;
  leaveProfessionalForGlobalNav();
},true);
})();
