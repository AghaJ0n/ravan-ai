/* RAVAN AI v14 — visual cleanup / responsive polish */
(function(){
  'use strict';
  const css = String.raw`
  :root{--r14-max:940px;--r14-line:#e5e7f0;--r14-purple:#5d49cf;--r14-soft:#f7f5ff}

  /* Launcher shell: tighter, aligned, no unnecessary empty zones */
  .r11-gate{padding:24px!important;align-items:flex-start!important;justify-content:center!important;background:radial-gradient(circle at 82% 4%,rgba(111,91,218,.12),transparent 27%),radial-gradient(circle at 12% 92%,rgba(52,120,246,.08),transparent 26%),#f5f6fb!important}
  .r11-shell{width:min(1040px,100%)!important;margin:12px auto 28px!important;border-radius:24px!important;box-shadow:0 22px 60px rgba(45,43,84,.13)!important}
  .r11-head{padding:21px 26px!important;min-height:0!important;gap:16px!important}
  .r11-brand h1{font-size:26px!important;margin-bottom:5px!important}
  .r11-brand p{max-width:760px!important;font-size:12px!important;line-height:1.75!important}
  .r11-mark{font-size:10.5px!important;padding:6px 10px!important}
  .r11-body{padding:20px 26px 24px!important;min-height:0!important}

  .r11-stepbar{max-width:var(--r14-max)!important;margin:0 auto 18px!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important}
  .r11-stepchip{min-height:50px!important;padding:9px 11px!important;border-radius:12px!important;gap:8px!important;font-size:11px!important;line-height:1.55!important}
  .r11-stepchip b{width:28px!important;height:28px!important;min-width:28px!important;border-radius:8px!important}

  .r11-section>.r11-title{max-width:var(--r14-max)!important;margin:0 auto 12px!important;padding:0 2px!important}
  .r11-title h2{font-size:19px!important;margin:0 0 4px!important;line-height:1.5!important}
  .r11-title p{font-size:11px!important;line-height:1.75!important;max-width:760px!important}

  .r112-role-box,.r115-task-box{width:100%!important;max-width:var(--r14-max)!important;margin:0 auto!important;padding:16px 18px!important;border-radius:16px!important;box-shadow:0 7px 20px rgba(55,48,112,.045)!important}
  .r112-role-label,.r115-task-label{font-size:12px!important;margin-bottom:7px!important}
  .r112-role-input,.r115-task-input{min-height:46px!important;font-size:13px!important;padding-top:10px!important;padding-bottom:10px!important}
  .r112-role-note,.r115-task-note{font-size:10.5px!important;line-height:1.75!important;margin-top:8px!important;color:#7b8191!important}
  .r112-role-next{min-height:44px!important;margin-top:11px!important;border-radius:10px!important}

  /* Suggestions use the available width instead of one long skinny column. */
  .r112-combo-menu.open,.r115-task-menu.open{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:4px!important;max-height:214px!important;padding:5px!important;margin-top:6px!important;border-radius:12px!important;box-shadow:0 8px 22px rgba(42,38,80,.08)!important}
  .r112-role-option,.r115-task-option{min-width:0!important;padding:7px 9px!important;gap:8px!important}
  .r112-role-option .ico,.r115-task-option .ico{width:30px!important;height:30px!important;font-size:14px!important}
  .r112-role-option b,.r115-task-option b{font-size:12px!important}
  .r112-role-option small,.r115-task-option small{font-size:9.7px!important;line-height:1.55!important}

  /* Recent profiles: a compact, deliberate panel directly under the chooser. */
  .r11-saved{max-width:var(--r14-max)!important;margin:12px auto 0!important;padding:11px 13px!important;border:1px solid #e7e8f0!important;border-radius:13px!important;background:#fafbfe!important;display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:10px!important}
  .r11-saved h3{font-size:11px!important;margin:0!important;white-space:nowrap;color:#666d80!important}
  .r11-pills{gap:6px!important;min-width:0!important}
  .r11-pill{font-size:10px!important;padding:6px 9px!important;background:#fff!important}

  .r11-ai-grid,.r11-rec,.r11-actions{max-width:var(--r14-max)!important;margin-left:auto!important;margin-right:auto!important}
  .r11-ai-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important}
  .r11-ai{padding:13px!important;border-radius:13px!important}
  .r11-rec{margin-top:10px!important;padding:10px 12px!important}
  .r11-actions{margin-top:14px!important;padding-top:13px!important}

  /* Workspace cleanup */
  .r11-ws-shell{max-width:1200px!important;padding:18px!important}
  .r11-ws-top{border-radius:18px!important;padding:18px 20px!important}
  .r11-ws-main{grid-template-columns:240px minmax(0,1fr)!important;gap:14px!important;margin-top:14px!important}
  .r11-ws-side,.r11-ws-content{border-radius:16px!important}
  .r11-ws-content{padding:17px!important}
  .r11-fields{gap:10px!important}
  .r11-field{padding:12px!important;border-radius:12px!important}
  .r13-section-head{margin-top:1px!important;padding:10px 12px!important}

  @media(max-width:900px){
    .r11-gate{padding:12px!important}
    .r11-shell{margin:0 auto 18px!important;border-radius:20px!important}
    .r11-head{padding:18px 20px!important;flex-direction:row!important;align-items:center!important}
    .r11-body{padding:16px 18px 20px!important}
    .r11-stepbar{grid-template-columns:repeat(3,minmax(0,1fr))!important;margin-bottom:15px!important}
    .r11-ws-main{grid-template-columns:1fr!important}
    .r11-ws-side{position:static!important}
    .r11-fields{grid-template-columns:1fr!important}
    .r11-field.wide{grid-column:auto!important}
  }

  @media(max-width:700px){
    .r11-gate{padding:8px!important}
    .r11-shell{border-radius:17px!important}
    .r11-head{padding:16px!important;gap:10px!important}
    .r11-brand h1{font-size:21px!important}
    .r11-brand p{font-size:10.5px!important;line-height:1.65!important}
    .r11-mark{font-size:9px!important;padding:5px 8px!important}
    .r11-body{padding:14px!important}
    .r11-stepbar{gap:5px!important;margin-bottom:14px!important}
    .r11-stepchip{min-height:46px!important;padding:7px 8px!important;gap:5px!important;font-size:9.7px!important}
    .r11-stepchip b{width:24px!important;height:24px!important;min-width:24px!important;font-size:10px!important}
    .r11-title h2{font-size:17px!important}
    .r11-title p{font-size:10px!important}
    .r112-role-box,.r115-task-box{padding:13px!important;border-radius:14px!important}
    .r112-combo-menu.open,.r115-task-menu.open{grid-template-columns:1fr!important;max-height:205px!important}
    .r11-saved{grid-template-columns:1fr!important;gap:7px!important;padding:10px 11px!important}
    .r11-ai-grid{grid-template-columns:1fr!important}
    .r11-ws-shell{padding:8px!important}
    .r11-ws-top{padding:15px!important}
  }

  @media(max-width:520px){
    .r11-head{flex-direction:column!important;align-items:flex-start!important}
    .r11-mark{align-self:flex-start!important}
    .r11-stepchip{align-items:center!important}
    .r11-stepchip span{display:block!important}
    .r11-section>.r11-title{margin-bottom:10px!important}
    .r11-title{gap:8px!important}
    .r113-step-back{padding:7px 9px!important;font-size:10px!important}
  }
  `;

  function installStyles(){
    if(document.getElementById('ravanUiV14')) return;
    const s=document.createElement('style');
    s.id='ravanUiV14';
    s.textContent=css;
    document.head.appendChild(s);
    document.documentElement.dataset.ravanUi='14';
  }

  function tidySaved(){
    const wrap=document.getElementById('r11SavedWrap');
    const pills=document.getElementById('r11SavedProfiles');
    if(!wrap||!pills) return;
    wrap.style.display = pills.children.length ? 'grid' : 'none';
  }

  function installObserver(){
    const pills=document.getElementById('r11SavedProfiles');
    if(!pills) return;
    const mo=new MutationObserver(tidySaved);
    mo.observe(pills,{childList:true,subtree:true});
    tidySaved();
  }

  function boot(){
    installStyles();
    installObserver();
    tidySaved();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
