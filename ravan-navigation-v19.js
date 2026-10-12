/* RAVAN AI — persistent navigation behavior */
(()=>{
'use strict';
const root=document.documentElement;
root.dataset.ravanPersistentNav='19.19';

document.addEventListener('click',e=>{
  const item=e.target?.closest?.('.r19-navitem');
  if(!item)return;
  if(root.classList.contains('r19-professional-active')){
    try{window.RAVAN_PROFESSIONAL?.close?.()}catch(err){console.warn('[RAVAN] close professional before navigation',err)}
  }
},true);
})();
