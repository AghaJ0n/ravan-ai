/* RAVAN AI — persistent navigation behavior */
(()=>{
'use strict';
const root=document.documentElement;
root.dataset.ravanPersistentNav='19.19';
let replaying=false;

function forceProfessionalOff(){
  root.classList.remove('r19-professional-active');
  const host=document.getElementById('r19ProfessionalHost');
  if(host)host.hidden=true;
}
function leaveProfessional(){
  try{window.RAVAN_PROFESSIONAL?.close?.()}catch(err){console.warn('[RAVAN] close professional before navigation',err)}
  forceProfessionalOff();
}

document.addEventListener('click',e=>{
  const item=e.target?.closest?.('.r19-navitem');
  if(!item||replaying)return;
  if(!root.classList.contains('r19-professional-active'))return;

  /* Do not let recovered legacy click handlers run in professional mode.
     Exit first, then replay the exact sidebar action once the global shell is
     active again. This keeps all existing RAVAN/section handlers intact. */
  e.preventDefault();
  e.stopImmediatePropagation();
  leaveProfessional();
  setTimeout(()=>{
    forceProfessionalOff();
    replaying=true;
    try{item.click()}finally{replaying=false}
  },0);
},true);
})();
