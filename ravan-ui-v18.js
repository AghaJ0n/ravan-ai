/* RAVAN AI v18 — productive onboarding side rail */
(function(){
'use strict';

const css = String.raw`
:root{
  --r18-bg:#f4f6fb;
  --r18-card:#fff;
  --r18-line:#e3e7f1;
  --r18-muted:#7b8192;
  --r18-text:#252a3d;
  --r18-purple:#5b47c7;
  --r18-soft:#f7f8fc;
  --r18-green:#16856b;
}

.r18-rail{display:grid;gap:10px;align-content:start}
.r18-rail-card{
  background:var(--r18-card);
  border:1px solid var(--r18-line);
  border-radius:16px;
  padding:14px;
  box-shadow:0 8px 24px rgba(43,39,82,.045);
  box-sizing:border-box;
}
.r18-rail-head{padding:16px}
.r18-rail-head .r11-title{margin:0!important;padding:0!important;display:block!important}
.r18-rail-head .r11-title h2{font-size:18px!important;line-height:1.55!important;margin:0 0 6px!important;color:var(--r18-text)!important}
.r18-rail-head .r11-title p{font-size:10.5px!important;line-height:1.85!important;color:var(--r18-muted)!important;margin:0!important}
.r18-rail-head .r113-step-back{margin-top:12px!important;width:100%!important;justify-content:center!important}

.r18-progress-top{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px}
.r18-progress-title{font-size:11px;font-weight:800;color:#34394d}
.r18-progress-num{font-size:10px;color:var(--r18-purple);background:#f0edff;border:1px solid #ddd6ff;padding:4px 8px;border-radius:999px;white-space:nowrap}
.r18-progress-track{height:7px;border-radius:999px;background:#eceef5;overflow:hidden;margin-bottom:12px}
.r18-progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,#735ee0,#5b47c7);transition:width .2s ease}
.r18-status{display:grid;gap:7px}
.r18-status-row{display:grid;grid-template-columns:24px minmax(0,1fr);gap:8px;align-items:center;padding:8px 9px;border-radius:11px;background:#f8f9fc;border:1px solid #edf0f6}
.r18-status-row .ico{width:24px;height:24px;border-radius:7px;background:#eeebff;color:#5b47c7;display:grid;place-items:center;font-size:11px}
.r18-status-row small{display:block;font-size:8.8px;color:#8a90a0;margin-bottom:1px}
.r18-status-row b{display:block;font-size:10.5px;color:#33384b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.r18-status-row.done .ico{background:#e8f7f2;color:var(--r18-green)}
.r18-status-row.done{background:#f7fcfa;border-color:#e0f1eb}
.r18-tip{font-size:9.8px;line-height:1.85;color:#70778b}
.r18-tip strong{display:block;color:#40465a;font-size:10.5px;margin-bottom:4px}

.r18-rail .r11-saved{
  width:100%!important;
  max-width:none!important;
  margin:0!important;
  padding:14px!important;
  display:block!important;
  background:#fff!important;
  border:1px solid var(--r18-line)!important;
  border-radius:16px!important;
  box-shadow:0 8px 24px rgba(43,39,82,.045)!important;
}
.r18-rail .r11-saved.r15-empty{display:none!important}
.r18-rail .r11-saved h3{font-size:10.5px!important;margin:0 0 8px!important;color:#565d70!important}
.r18-rail .r11-pills{display:flex!important;gap:5px!important;flex-wrap:wrap!important}
.r18-rail .r11-pill{font-size:9px!important;padding:5px 7px!important;background:#f9faff!important}

@media (min-width:1101px){
  html,body{background:var(--r18-bg)!important}
  .r11-gate{padding:10px 12px 18px!important;background:radial-gradient(circle at 92% 2%,rgba(105,84,217,.12),transparent 24%),radial-gradient(circle at 6% 96%,rgba(70,127,240,.07),transparent 22%),var(--r18-bg)!important}
  .r11-shell{background:transparent!important;border:0!important;box-shadow:none!important;overflow:visible!important}
  .r11-body{padding:10px 0 0!important}
  .r11-stepbar{background:#fff!important;border:1px solid var(--r18-line)!important;box-shadow:0 8px 24px rgba(43,39,82,.045)!important}

  .r11-section.active{
    background:transparent!important;
    border:0!important;
    box-shadow:none!important;
    padding:0!important;
    border-radius:0!important;
    display:grid!important;
    grid-template-columns:minmax(270px,310px) minmax(0,1fr)!important;
    grid-template-rows:auto!important;
    gap:14px!important;
    align-items:start!important;
    min-height:0!important;
    height:auto!important;
  }
  .r18-rail{
    grid-column:1!important;
    grid-row:1 / span 4!important;
    position:sticky;
    top:10px;
    align-self:start!important;
  }
  .r11-section>.r11-title,.r11-section>.r11-saved{display:none!important}

  .r112-role-box,.r115-task-box{
    grid-column:2!important;
    grid-row:1!important;
    width:100%!important;
    max-width:none!important;
    margin:0!important;
    padding:14px!important;
    background:#fff!important;
    border:1px solid var(--r18-line)!important;
    border-radius:16px!important;
    box-shadow:0 10px 28px rgba(43,39,82,.05)!important;
  }
  .r112-role-next{width:220px!important;margin:10px 0 0 auto!important}

  .r11-section[data-r11step="2"]>.r11-ai-grid{
    grid-column:2!important;
    grid-row:1!important;
    width:100%!important;
    max-width:none!important;
    background:#fff!important;
    border:1px solid var(--r18-line)!important;
    border-radius:16px!important;
    padding:12px!important;
    box-sizing:border-box!important;
    box-shadow:0 10px 28px rgba(43,39,82,.05)!important;
  }
  .r11-section[data-r11step="2"]>.r11-rec{
    grid-column:2!important;
    grid-row:2!important;
    width:100%!important;
    margin:0!important;
    box-sizing:border-box!important;
  }

  .r112-combo-menu.open,.r115-task-menu.open{
    grid-template-columns:repeat(4,minmax(0,1fr))!important;
    max-height:220px!important;
  }
  .r11-actions{
    background:#fff!important;
    border:1px solid var(--r18-line)!important;
    border-radius:14px!important;
    padding:9px 10px!important;
    margin:10px 0 0!important;
    box-shadow:0 8px 22px rgba(43,39,82,.04)!important;
  }
}

@media (min-width:1450px){
  .r11-section.active{grid-template-columns:320px minmax(0,1fr)!important}
  .r112-combo-menu.open,.r115-task-menu.open{grid-template-columns:repeat(5,minmax(0,1fr))!important}
}
@media (max-width:1100px){
  .r11-section.active{display:block!important}
  .r18-rail{display:block!important;margin-bottom:10px!important}
  .r18-rail-card{margin-bottom:8px!important}
  .r18-progress-card,.r18-tip-card{display:none!important}
  .r18-rail .r11-saved{margin-top:8px!important}
  .r112-role-box,.r115-task-box{margin-top:0!important}
}
`;

function getAiName(){
  const selected=document.querySelector('.r11-ai.selected');
  if(!selected) return '';
  const b=selected.querySelector('b,strong');
  if(b && b.textContent.trim()) return b.textContent.trim();
  return (selected.textContent||'').trim().split(/\n/)[0].slice(0,80);
}
function val(sel){
  const el=document.querySelector(sel);
  return el ? (el.value||'').trim() : '';
}
function esc(s){
  return String(s||'').replace(/[&<>"']/g,m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
}
function statusRow(icon,label,value,done){
  return `<div class="r18-status-row ${done?'done':''}"><span class="ico">${icon}</span><div><small>${label}</small><b>${value?esc(value):'هنوز انتخاب نشده'}</b></div></div>`;
}
function currentStepIndex(section){
  const n=Number(section && section.dataset ? section.dataset.r11step : 0);
  return Number.isFinite(n)?n:0;
}
function progressMarkup(section){
  const step=currentStepIndex(section);
  const role=val('#r11RoleInput');
  const task=val('#r11TaskInput');
  const ai=getAiName();
  const done=[!!role,!!task,!!ai];
  const count=Math.max(step+1,done.filter(Boolean).length);
  const pct=Math.min(100,Math.max(33,(count/3)*100));
  return `
    <div class="r18-progress-top">
      <span class="r18-progress-title">پروفایل در حال ساخت</span>
      <span class="r18-progress-num">${Math.min(3,count)} از ۳</span>
    </div>
    <div class="r18-progress-track"><div class="r18-progress-fill" style="width:${pct}%"></div></div>
    <div class="r18-status">
      ${statusRow('۱','نقش',role,!!role)}
      ${statusRow('۲','نوع کار',task,!!task)}
      ${statusRow('۳','مقصد AI',ai,!!ai)}
    </div>`;
}
function tipText(step){
  if(step===0) return 'اول نقش را مشخص کنید. این انتخاب تعیین می‌کند در مرحله بعد چه نوع کارهایی و چه پارامترهایی پیشنهاد شوند.';
  if(step===1) return 'نوع کار را انتخاب یا تایپ کنید. پیشنهادها بر اساس نقش شما فیلتر می‌شوند و متن آزاد هم پذیرفته می‌شود.';
  return 'مقصد AI را مشخص کنید. بعد از این مرحله، فرم تخصصی دقیقاً بر اساس نقش + کار + مقصد ساخته می‌شود.';
}
function buildRails(){
  document.querySelectorAll('.r11-section').forEach(section=>{
    let rail=section.querySelector(':scope > .r18-rail');
    if(!rail){
      rail=document.createElement('aside');
      rail.className='r18-rail';
      section.prepend(rail);

      const title=section.querySelector(':scope > .r11-title');
      if(title){
        const head=document.createElement('div');
        head.className='r18-rail-card r18-rail-head';
        head.appendChild(title);
        rail.appendChild(head);
      }

      const progress=document.createElement('div');
      progress.className='r18-rail-card r18-progress-card';
      progress.innerHTML=progressMarkup(section);
      rail.appendChild(progress);

      const saved=section.querySelector(':scope > .r11-saved');
      if(saved) rail.appendChild(saved);

      const tip=document.createElement('div');
      tip.className='r18-rail-card r18-tip-card';
      tip.innerHTML=`<div class="r18-tip"><strong>راهنمای همین مرحله</strong>${tipText(currentStepIndex(section))}</div>`;
      rail.appendChild(tip);
    }
  });
}
function refreshRails(){
  document.querySelectorAll('.r11-section').forEach(section=>{
    const p=section.querySelector('.r18-progress-card');
    if(p) p.innerHTML=progressMarkup(section);
  });
}
function install(){
  document.getElementById('ravanUiV18')?.remove();
  const s=document.createElement('style');
  s.id='ravanUiV18';
  s.textContent=css;
  document.head.appendChild(s);
  buildRails();
  refreshRails();

  document.addEventListener('input',e=>{
    if(e.target && (e.target.id==='r11RoleInput'||e.target.id==='r11TaskInput')) refreshRails();
  },true);
  document.addEventListener('click',()=>setTimeout(refreshRails,0),true);
  const root=document.querySelector('.r11-body');
  if(root) new MutationObserver(()=>refreshRails()).observe(root,{subtree:true,attributes:true,attributeFilter:['class']});
  document.documentElement.dataset.ravanUi='18';
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install,{once:true}); else install();
})();