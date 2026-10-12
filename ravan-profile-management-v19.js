/* RAVAN AI — recent profile management */
(()=>{
'use strict';
const RECENT_KEY='RAVAN_AI_RecentProfiles_v11';
const PREF_KEY='ravan_shell_prefs_v19';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function readJSON(key,fallback){try{const x=JSON.parse(localStorage.getItem(key)||'');return x??fallback}catch(e){return fallback}}
function profiles(){const x=readJSON(RECENT_KEY,[]);return Array.isArray(x)?x:[]}
function prefs(){return readJSON(PREF_KEY,{})||{}}
function titleOf(p){return [p?.roleLabel||p?.role||'پروفایل',p?.taskLabel||p?.task||'کار'].join(' — ')}
function toast(msg,type='success'){window.RAVAN_UI?.toast?.(msg,type)}
function log(title,detail=''){try{window.RAVAN_SECTIONS?.log?.('profile',title,detail)}catch(e){}}
function syncCoreRecents(){
  try{if(typeof window.renderRecent==='function'){window.renderRecent();return}}catch(e){}
  const a=profiles(),wrap=q('#r11SavedWrap'),box=q('#r11SavedProfiles');
  if(wrap)wrap.style.display=a.length?'block':'none';
  if(box)box.innerHTML=a.map((p,i)=>`<button class="r11-pill" onclick="loadRecent(${i})">${esc(titleOf(p))}</button>`).join('');
}
function refreshProjects(){
  try{window.RAVAN_SECTIONS?.projects?.()}catch(e){toast('به‌روزرسانی فهرست ممکن نبود','error')}
}
function deleteOne(index){
  const a=profiles(),p=a[index];if(!p)return;
  const title=titleOf(p);
  if(prefs().confirmDelete!==false&&!confirm(`پروفایل «${title}» حذف شود؟`))return;
  a.splice(index,1);
  localStorage.setItem(RECENT_KEY,JSON.stringify(a));
  syncCoreRecents();log('حذف پروفایل اخیر',title);toast('پروفایل حذف شد');refreshProjects();
}
function clearAll(){
  const a=profiles();if(!a.length)return;
  if(!confirm(`همه ${a.length} پروفایل اخیر حذف شوند؟ این کار قابل بازگشت نیست.`))return;
  localStorage.removeItem(RECENT_KEY);
  syncCoreRecents();log('حذف همه پروفایل‌های اخیر',`${a.length} پروفایل حذف شد`);toast('همه پروفایل‌های اخیر حذف شدند');refreshProjects();
}
function enhance(){
  const view=q('.r19-utility-view.r19-section-view.open')||q('.r19-utility-view.r19-section-view');
  if(!view||q('.r19-section-head h2',view)?.textContent.trim()!=='پروژه‌های من')return;
  const a=profiles();
  qa('[data-profile-open]',view).forEach(open=>{
    const card=open.closest('.r19-data-card'),actions=open.closest('.r19-card-actions');
    if(!card||!actions||actions.querySelector('[data-profile-delete]'))return;
    const index=Number(open.dataset.profileOpen);
    const p=a[index];
    const btn=document.createElement('button');
    btn.type='button';btn.className='r19-section-btn danger small';btn.dataset.profileDelete=String(index);btn.textContent='حذف';
    btn.setAttribute('aria-label',`حذف پروفایل ${titleOf(p)}`);btn.title='حذف این پروفایل';
    actions.append(btn);
  });
  const head=qa('.r19-subsection-head',view).find(x=>q('h3',x)?.textContent.trim()==='پروفایل‌های اخیر RAVAN');
  if(head){
    const old=q('[data-profile-clear]',head);
    if(a.length&&!old){
      const btn=document.createElement('button');btn.type='button';btn.className='r19-section-btn danger small';btn.dataset.profileClear='1';btn.textContent='حذف همه';btn.title='حذف همه پروفایل‌های اخیر';btn.setAttribute('aria-label','حذف همه پروفایل‌های اخیر');head.append(btn);
    }else if(!a.length&&old)old.remove();
  }
}
document.addEventListener('click',e=>{
  const del=e.target?.closest?.('[data-profile-delete]');
  if(del){e.preventDefault();e.stopImmediatePropagation();deleteOne(Number(del.dataset.profileDelete));return}
  const clear=e.target?.closest?.('[data-profile-clear]');
  if(clear){e.preventDefault();e.stopImmediatePropagation();clearAll()}
},true);
let queued=false;function schedule(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;enhance()})}
new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true});
setTimeout(enhance,0);
document.documentElement.dataset.ravanProfileManagement='19.22';
})();
