const $=id=>document.getElementById(id);
const names=['europe','north-america','south-america','africa','asia','australia'];
const desktop=[[18.2,15.5,11.5],[73,6.5,14.7],[4.5,40,10.8],[19.1,48,21.5],[64.5,40,27.2],[54.8,76.6,10.3]];
const mobile=[[8,13,18],[77,9,23],[-4,47,17],[2,69,28],[77,49,33],[75,79,18]];
const innerDesktop=[[4,19,6],[88,13,7],[3,45,5],[6,69,8],[89,52,10],[90,83,6]];
const innerMobile=[[-3,2,12],[88,1,14],[-6,43,10],[-9,77,14],[91,53,16],[90,91,12]];
function islands(id,inner){names.forEach((name,i)=>{const el=document.createElement('div');el.className='island';el.dataset.i=i;el.style.setProperty('--duration',(12+i*1.9)+'s');el.style.setProperty('--delay',(-i*2.4)+'s');el.innerHTML=`<img src="assets/${name}.png" alt="">`;$(id).append(el)});}
islands('entrance-islands');islands('interior-islands');
function layout(){const phone=innerWidth<700;[['entrance-islands',phone?mobile:desktop],['interior-islands',phone?innerMobile:innerDesktop]].forEach(([id,pos])=>{[...$(id).children].forEach((el,i)=>{const[x,y,w]=pos[i];el.style.left=x+'%';el.style.top=y+'%';el.style.width=w+'%'})});}
addEventListener('resize',layout);layout();
let active=false,start=0,originX=50,originY=34;
function focusGlobe(){const r=$('globe').getBoundingClientRect();originX=(r.x+r.width/2)/innerWidth*100;originY=(r.y+r.height/2)/innerHeight*100;$('world').style.transformOrigin=`${originX}% ${originY}%`;}
focusGlobe();
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const ease=v=>v*v*(3-2*v);
function render(t){
 const p=clamp(t/1650);const z=1+32*Math.pow(p,3.5);
 $('world').style.transform=`translateY(${innerHeight*(.5-originY/100)*ease(p)}px) scale(${z})`;
 $('route').style.opacity=1-clamp(t/470);document.querySelector('.wordmark').style.opacity=1-clamp(t/470);
 $('entry-action').style.opacity=1-clamp(t/350);document.querySelector('.entrance-language').style.opacity=1-clamp(t/350);$('entrance-islands').style.opacity=1-clamp((t-350)/950);
 $('flash').style.opacity=t<1550?ease(clamp((t-1120)/430)):1-ease(clamp((t-1720)/570));
 if(t>=1550){$('landing').hidden=false;$('entrance').style.visibility='hidden';const lp=ease(clamp((t-1590)/1000));$('app').style.transform=`translateY(${(1-lp)*42}px) scale(${1.06-.06*lp})`;$('app').style.opacity=lp;}
 else{$('landing').hidden=true;$('entrance').style.visibility='visible';}
 if(t>=2590){$('flash').style.opacity=0;$('app').style.transform='none';$('app').style.opacity=1;}
}
function enter(){if(active)return;focusGlobe();active=true;$('enter').disabled=true;document.body.style.overflow='hidden';if(matchMedia('(prefers-reduced-motion:reduce)').matches){render(3000);finish();return;}start=performance.now();function frame(now){const t=now-start;render(t);if(t<2700)requestAnimationFrame(frame);else finish();}requestAnimationFrame(frame);}
function finish(){document.body.style.overflow='';$('back').focus({preventScroll:true});}
function reset(){active=false;$('world').style.transform='';$('entrance').style.visibility='visible';$('landing').hidden=true;$('entry-action').style.opacity=1;document.querySelector('.entrance-language').style.opacity=1;$('flash').style.opacity=0;$('route').style.opacity=1;document.querySelector('.wordmark').style.opacity=1;$('entrance-islands').style.opacity=1;$('enter').disabled=false;window.scrollTo(0,0);$('enter').focus({preventScroll:true});}
$('enter').onclick=enter;$('globe').onclick=enter;$('back').onclick=reset;
window.demoAt=t=>{if(t===0)focusGlobe();render(t)};window.resetDemo=reset;
// Device-local trip data. No cloud accounts, sharing or document uploads.
const STORAGE='vellvia.trips.v1';
const main=$('trip-main');let trips=[],storeOK=true,currentTrip=null,screen="home";
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const parseDate=s=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return null;const d=new Date(s+'T12:00:00Z');return Number.isFinite(+d)&&d.toISOString().slice(0,10)===s?d:null};
function dates(start,end){const s=parseDate(start),e=parseDate(end);if(!s||!e||e<s||s.getUTCFullYear()<1900||e.getUTCFullYear()>2200)return[];const count=Math.round((e-s)/86400000)+1;if(count>366)return[];return Array.from({length:count},(_,i)=>new Date(+s+i*86400000).toISOString().slice(0,10));}
const dateLabel=s=>new Intl.DateTimeFormat(LANGUAGES[language].locale,{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(parseDate(s));
const weekday=s=>new Intl.DateTimeFormat(LANGUAGES[language].locale,{weekday:'long',timeZone:'UTC'}).format(parseDate(s));
function validTrip(t){return t&&typeof t.id==='string'&&typeof t.destination==='string'&&t.destination.length<=100&&dates(t.start,t.end).length&&t.days&&typeof t.days==='object';}
try{const raw=localStorage.getItem(STORAGE);if(raw){const data=JSON.parse(raw);if(!Array.isArray(data)||!data.every(validTrip))throw Error('invalid');trips=data;}}catch(e){storeOK=false;}
function persist(){try{if(!storeOK)return false;localStorage.setItem(STORAGE,JSON.stringify(trips));return true;}catch(e){storeOK=false;return false;}}
function note(){return `<div class="storage-note ${storeOK?'':'error'}" role="status">${storeOK?tr('storage'):tr('storageError')}</div>`;}
function showHome(){screen="home";currentTrip=null;main.innerHTML=note()+`<div class="eyebrow">${tr('eyebrow')}</div><div class="page-top"><h1>${tr('trips')}</h1>${trips.length?`<button class="primary" id="new-trip">${tr('new')}</button>`:''}</div>${trips.length?`<div class="trip-list">${trips.map(t=>`<button class="trip-card" data-trip="${esc(t.id)}"><span class="card-go" aria-hidden="true">${arrow(true)}</span><h2>${esc(t.destination)}</h2><p>${dateLabel(t.start)} - ${dateLabel(t.end)} · ${tr('days',{count:dates(t.start,t.end).length})}</p></button>`).join('')}</div>`:`<section class="empty"><div class="empty-icon" aria-hidden="true">↗</div><h2>${tr('emptyTitle')}</h2><p>${tr('emptyBody')}</p><button class="primary" id="new-trip">${tr('new')}</button></section>`}`;$('new-trip').onclick=showForm;main.querySelectorAll('[data-trip]').forEach(b=>b.onclick=()=>showTrip(b.dataset.trip));window.scrollTo(0,0);}
function showForm(){screen="form";main.innerHTML=note()+`<button class="quiet back-list" id="cancel-top">${arrow()} ${tr('mine')}</button><div class="eyebrow">${tr('newEyebrow')}</div><h1>${tr('where')}</h1><p class="intro">${tr('intro')}</p><form class="form-card" id="trip-form" novalidate><div class="field"><label for="destination">${tr('destination')}</label><input id="destination" name="destination" required maxlength="100" placeholder="${tr('destPlaceholder')}" autocomplete="off"><p class="field-help">${tr('destHelp')}</p></div><div class="date-grid"><div class="field"><label for="start-date">${tr('start')}</label><input id="start-date" name="start" type="date" required></div><div class="field"><label for="end-date">${tr('end')}</label><input id="end-date" name="end" type="date" required></div></div><p class="field-help" id="length-hint">${tr('hint')}</p><div class="form-error" id="form-error" role="alert"></div><div class="form-actions"><button class="primary" type="submit">${tr('create')} ${arrow(true)}</button><button class="quiet" type="button" id="cancel-form">${tr('cancel')}</button></div></form>`;$('cancel-top').onclick=showHome;$('cancel-form').onclick=showHome;
function hint(){const ds=dates($('start-date').value,$('end-date').value);$('form-error').textContent='';$('length-hint').textContent=ds.length?tr('rangeHint',{start:dateLabel(ds[0]),end:dateLabel(ds[ds.length-1]),count:ds.length}):tr('hint');}
$('start-date').onchange=()=>{$('end-date').min=$('start-date').value;hint();};$('end-date').onchange=hint;
$('trip-form').onsubmit=e=>{e.preventDefault();const destination=$('destination').value.trim(),start=$('start-date').value,end=$('end-date').value;let error='';if(!destination)error=tr('noDest');else if(!parseDate(start)||!parseDate(end))error=tr('noDates');else if(end<start)error=tr('reverseDates');else if(!dates(start,end).length)error=tr('dateLimit');if(error){$('form-error').textContent=error;return;}const trip={id:crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2),destination,start,end,days:{}};trips.push(trip);persist();showTrip(trip.id);};window.scrollTo(0,0);$('destination').focus({preventScroll:true});}
let tripTab="itinerary";
function showTrip(id,tab="itinerary"){tripTab=tab;const t=trips.find(x=>x.id===id);if(!t){showHome();return;}screen="trip";currentTrip=t;const ds=dates(t.start,t.end);main.innerHTML=`<div class="trip-nav"><button class="trip-back" id="to-trips">${arrow()} ${tr('backTrips')}</button></div>`+note()+`<div class="eyebrow">${tr('journey')}</div><h1>${esc(t.destination)}</h1><div class="trip-summary"><span class="pill">${dateLabel(t.start)} - ${dateLabel(t.end)}</span><span class="pill">${tr('days',{count:ds.length})}</span></div><nav class="trip-tabs" aria-label="${tr('journey')}">${["itinerary","usefulLinks","documents"].map((key,i)=>`<button id="tab-${i}" class="trip-tab ${tripTab===["itinerary","links","documents"][i]?"selected":""}" aria-pressed="${tripTab===["itinerary","links","documents"][i]}">${tr(key)}</button>`).join('')}</nav><div id="trip-panel"><h2 class="subheading">${tr('dayByDay')}</h2><p class="intro" style="margin-bottom:22px">${tr('skeleton')}</p><div class="timeline">${ds.map((d,i)=>{const entry=t.days[d]||{};return `<section class="day"><div class="day-header"><span class="day-number">${i+1}</span><div><h3>${tr('day',{count:i+1})} · ${weekday(d)}</h3><div class="day-date">${dateLabel(d)}</div></div></div><div class="day-fields"><div><label for="place-${i}">${tr('place')}</label><input id="place-${i}" data-day="${d}" data-field="place" maxlength="160" placeholder="${tr('placePlaceholder')}" value="${esc(entry.place||'')}"></div><div><label for="notes-${i}">${tr('notes')}</label><textarea id="notes-${i}" data-day="${d}" data-field="notes" maxlength="4000" placeholder="${tr('notesPlaceholder')}">${esc(entry.notes||'')}</textarea></div></div><div class="save-status" id="status-${i}" role="status"></div></section>`}).join('')}</div></div>`;$('to-trips').onclick=showHome;main.querySelectorAll('[data-day]').forEach(input=>{input.oninput=()=>{const d=input.dataset.day;t.days[d]??={};t.days[d][input.dataset.field]=input.value;const ok=persist();input.closest('.day').querySelector('.save-status').textContent=ok?tr('saved'):tr('notSaved');if(!ok){main.querySelector('.storage-note').textContent=tr('storageErrorShort');main.querySelector('.storage-note').classList.add('error');}}});['itinerary','links','documents'].forEach((tab,i)=>$('tab-'+i).onclick=()=>showTrip(id,tab));if(tab==='links')renderLinks();if(tab==='documents')renderDocuments(id);window.scrollTo(0,0);}
showHome();

function applyLanguage(){
 document.documentElement.lang=language;document.documentElement.dir=LANGUAGES[language].dir;
 document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=tr(el.dataset.i18n));
 $('entrance').setAttribute('aria-label',tr('entrance'));$('enter').setAttribute('aria-label',tr('enter'));$('globe').setAttribute('aria-label',tr('globe'));
 document.querySelectorAll('.language-picker').forEach(el=>{el.setAttribute('aria-label',tr('language'));el.innerHTML=Object.entries(LANGUAGES).map(([code,l])=>`<option value="${code}">${l.name}</option>`).join('');el.value=language;el.onchange=()=>changeLanguage(el.value)});
}
function changeLanguage(next){
 if(!LANGUAGES[next]||next===language)return;
 const y=scrollY,focused=document.activeElement?.id,fields=screen==='form'?['destination','start-date','end-date'].map(id=>[id,$(id).value]):[],error=screen==='form'?$('form-error').textContent:'';
 const errorKey=Object.keys(LANGUAGES[language].text).find(k=>tr(k)===error);
 language=next;try{localStorage.setItem('vellvia.language.v1',language)}catch(e){}
 applyLanguage();
 if(screen==='form'){showForm();fields.forEach(([id,value])=>$(id).value=value);$('end-date').min=$('start-date').value;$('end-date').dispatchEvent(new Event('change'));if(errorKey)$('form-error').textContent=tr(errorKey);}
 else if(screen==='trip')showTrip(currentTrip.id,tripTab);else showHome();
 window.scrollTo(0,y);if(focused&&$(focused))$(focused).focus({preventScroll:true});
}
function entryLetters(){const label=document.querySelector('.entry-label');label.innerHTML=['he','en'].map((code,n)=>`<span class="entry-phrase phrase-${code}" dir="${LANGUAGES[code].dir}">${[...LANGUAGES[code].text.enter].map((c,i)=>`<span class="morph-letter" style="--i:${i};--phase:${n*6}s">${c===' '?'&nbsp;':c}</span>`).join('')}</span>`).join('');}
entryLetters();applyLanguage();showHome();
