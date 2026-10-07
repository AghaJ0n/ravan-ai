/* RAVAN AI v16 — wide desktop onboarding, less vertical scrolling */
(function(){
'use strict';
const css=String.raw`
@media (min-width:1101px){
  html,body{overflow-x:hidden!important}
  .r11-gate{padding:10px 12px 18px!important;display:block!important;overflow-x:hidden!important}
  .r11-shell{width:calc(100vw - 24px)!important;max-width:1700px!important;min-width:0!important;margin:0 auto!important;box-sizing:border-box!important}
  .r11-head{width:100%!important;box-sizing:border-box!important;padding:16px 24px!important;min-height:70px!important;border-radius:18px!important}
  .r11-brand h1{font-size:24px!important;margin-bottom:2px!important}
  .r11-brand p{font-size:11.5px!important;line-height:1.65!important;max-width:1050px!important}
  .r11-mark{padding:6px 10px!important;font-size:10px!important}
  .r11-body{width:100%!important;box-sizing:border-box!important;padding:10px 0 0!important;min-height:0!important}
  .r11-stepbar{width:100%!important;max-width:none!important;margin:0 0 10px!important;padding:6px!important;gap:6px!important;border-radius:14px!important}
  .r11-stepchip{min-height:44px!important;padding:7px 10px!important;font-size:11px!important}
  .r11-stepchip b{width:26px!important;height:26px!important;min-width:26px!important}

  .r11-section.active{width:100%!important;max-width:none!important;min-height:0!important;height:auto!important;margin:0!important;padding:16px!important;box-sizing:border-box!important;display:grid!important;grid-template-columns:minmax(260px, .42fr) minmax(620px, 1.58fr)!important;grid-template-rows:auto!important;gap:12px 18px!important;align-items:start!important;border-radius:16px!important}
  .r11-section>.r11-title{grid-column:1!important;grid-row:1!important;width:auto!important;margin:0!important;padding:12px 10px!important;align-self:start!important;display:block!important}
  .r11-title h2{font-size:19px!important;margin:0 0 6px!important}
  .r11-title p{font-size:11px!important;line-height:1.75!important;max-width:320px!important}
  .r11-title .r113-step-back{margin-top:12px!important}

  .r112-role-box,.r115-task-box{grid-column:2!important;grid-row:1 / span 2!important;width:100%!important;max-width:none!important;min-height:0!important;height:auto!important;margin:0!important;padding:12px!important;box-sizing:border-box!important;border-radius:14px!important;align-self:start!important}
  .r112-role-label,.r115-task-label{font-size:12px!important;margin-bottom:6px!important}
  .r112-role-input,.r115-task-input{min-height:44px!important;padding-top:9px!important;padding-bottom:9px!important;font-size:12px!important}
  .r112-role-note,.r115-task-note{font-size:10px!important;line-height:1.6!important;margin:7px 2px 0!important}
  .r112-role-next{width:220px!important;min-height:42px!important;margin:8px 0 0 auto!important;display:block!important;font-size:12px!important}

  .r112-combo-menu.open,.r115-task-menu.open{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:4px!important;max-height:205px!important;min-height:0!important;padding:5px!important;margin-top:6px!important;overflow-y:auto!important;overflow-x:hidden!important;border-radius:11px!important}
  .r112-role-option,.r115-task-option{min-width:0!important;padding:6px 7px!important;gap:6px!important;border-radius:8px!important}
  .r112-role-option .ico,.r115-task-option .ico{width:28px!important;height:28px!important;font-size:13px!important}
  .r112-role-option b,.r115-task-option b{font-size:11px!important;margin-bottom:1px!important}
  .r112-role-option small,.r115-task-option small{font-size:8.8px!important;line-height:1.35!important}

  .r11-saved{grid-column:1!important;grid-row:2!important;width:auto!important;max-width:none!important;min-height:0!important;margin:0!important;padding:10px!important;align-self:start!important;display:block!important}
  .r11-saved h3{font-size:10px!important;margin:0 0 6px!important}
  .r11-pills{display:flex!important;gap:5px!important;flex-wrap:wrap!important}
  .r11-pill{font-size:9.5px!important;padding:4px 7px!important}
  .r11-saved.r15-empty{display:none!important}

  .r11-section[data-r11step="2"]>.r11-title{grid-column:1!important;grid-row:1!important}
  .r11-section[data-r11step="2"]>.r11-ai-grid{grid-column:2!important;grid-row:1 / span 2!important;width:100%!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important}
  .r11-section[data-r11step="2"]>.r11-rec{grid-column:1!important;grid-row:2!important;width:auto!important;margin:0!important;padding:10px!important;font-size:10.5px!important;line-height:1.65!important}
  .r11-ai{min-height:78px!important;padding:11px!important}
  .r11-ai b{font-size:12px!important;margin-bottom:3px!important}.r11-ai span{font-size:9.5px!important;line-height:1.55!important}

  .r11-actions{width:100%!important;max-width:none!important;box-sizing:border-box!important;margin:8px 0 0!important;padding:8px 4px 0!important;min-height:0!important}
  .r11-btn{padding:8px 12px!important;font-size:11px!important}

  .r11-ws-shell{width:calc(100vw - 24px)!important;max-width:1700px!important;padding:12px!important;box-sizing:border-box!important}
  .r11-ws-top{padding:15px 20px!important;border-radius:16px!important}
  .r11-ws-main{grid-template-columns:280px minmax(0,1fr)!important;gap:12px!important;margin-top:12px!important}
  .r11-ws-content{padding:14px!important}.r11-ws-side{padding:13px!important}
  .r11-fields{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:9px!important}
  .r11-field.wide{grid-column:span 2!important}
}
@media (min-width:1450px){
  .r11-section.active{grid-template-columns:minmax(300px,.36fr) minmax(850px,1.64fr)!important}
  .r112-combo-menu.open,.r115-task-menu.open{grid-template-columns:repeat(5,minmax(0,1fr))!important;max-height:185px!important}
  .r11-section[data-r11step="2"]>.r11-ai-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important}
  .r11-ws-main{grid-template-columns:300px minmax(0,1fr)!important}
  .r11-fields{grid-template-columns:repeat(4,minmax(0,1fr))!important}
}
@media (max-width:1100px){
  .r11-section.active{display:block!important}
  .r11-section>.r11-title{padding:0!important}
}
`;
function boot(){
 const old=document.getElementById('ravanUiV16');if(old)old.remove();
 const s=document.createElement('style');s.id='ravanUiV16';s.textContent=css;document.head.appendChild(s);
 document.documentElement.dataset.ravanUi='16';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();