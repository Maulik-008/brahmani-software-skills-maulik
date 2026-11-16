var Kit=(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s);};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function money(n){return '$'+Number(n).toFixed(2);}
var C={pages:{},act:{},on:{},inert:[],linkSel:'.links a',hash:true,onOpen:null,onClose:null};
var scrim=$('#scrim'),sheet=$('#sheet'),body=$('#sh-body'),foot=$('#sh-foot'),lastFocus=null,cur=null,hashFlag=false;
/* toast */
var toastEl=$('#toast'),toastT=$('#toast-t'),toastA=$('#toast-a'),tt,toastFn=null;
function toast(t,label,fn){toastT.textContent=t;toastA.textContent=label||'';toastFn=fn||null;toastEl.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){toastEl.classList.remove('show');},label?4200:2200);}
toastA.addEventListener('click',function(){toastEl.classList.remove('show');if(toastFn)toastFn();});
function setErr(id,msg,input){var e=$('#'+id);if(e)e.textContent=msg;if(input){if(msg)input.setAttribute('aria-invalid','true');else input.removeAttribute('aria-invalid');}}
function val(v){return typeof v==='function'?v():v;}
function render(keep){
  var f=C.pages[cur];if(!f)return;
  var top=keep?body.scrollTop:0,key=null,ae=document.activeElement;
  if(keep&&ae&&(body.contains(ae)||foot.contains(ae))){
    if(ae.id)key='#'+ae.id;
    else if(ae.name&&ae.type&&(ae.type==='radio'||ae.type==='checkbox'))key='[name="'+ae.name+'"][value="'+ae.value+'"]';
    else if(ae.dataset&&ae.dataset.act)key='[data-act="'+ae.dataset.act+'"]'+(ae.dataset.v!==undefined?'[data-v="'+ae.dataset.v+'"]':'')+(ae.dataset.id?'[data-id="'+ae.dataset.id+'"]':'')+(ae.dataset.n!==undefined?'[data-n="'+ae.dataset.n+'"]':'');
  }
  sheet.className='sheet '+(f.drawer?'drawer':'page');
  $('#sh-title').textContent=val(f.title);
  var sub=f.sub?f.sub():'';$('#sh-sub').textContent=sub;$('#sh-sub').style.display=sub?'':'none';
  body.innerHTML=f.html();
  var fo=f.foot?f.foot():'';foot.hidden=!fo;foot.innerHTML=fo;
  body.scrollTop=top;
  if(key){var el=body.querySelector(key)||foot.querySelector(key);if(el&&!el.disabled)try{el.focus({preventScroll:true});}catch(e){}}
  if(f.after)f.after();
  $$(C.linkSel).forEach(function(a){if(a.dataset.page===cur)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  if(C.onRender)C.onRender(cur);
}
function setHash(n){if(!C.hash)return;try{if(location.hash!=='#'+n){hashFlag=true;location.hash=n;}}catch(e){}}
function clearHash(){if(!C.hash)return;try{if(location.hash){history.replaceState(null,'',location.pathname+location.search);}}catch(e){try{hashFlag=true;location.hash='';}catch(_){}}}
function setInert(v){C.inert.forEach(function(s){var el=$(s);if(el)el.inert=v;});}
function open(name,fromHash){
  if(!C.pages[name])return;
  var already=scrim.classList.contains('open');
  if(!already)lastFocus=document.activeElement;
  if(C.beforeOpen)C.beforeOpen(name,already);
  cur=name;render(false);
  scrim.classList.add('open');setInert(true);
  if(!fromHash)setHash(name);
  setTimeout(function(){var x=$('#sh-x');if(x)x.focus();},60);
  if(C.onOpen)C.onOpen(name);
}
function close(fromHash){
  if(!scrim.classList.contains('open'))return;
  scrim.classList.remove('open');setInert(false);cur=null;
  $$(C.linkSel).forEach(function(a){a.removeAttribute('aria-current');});
  if(!fromHash)clearHash();
  if(lastFocus&&lastFocus.focus)try{lastFocus.focus();}catch(e){}
  if(C.onClose)C.onClose();
}
$('#sh-x').addEventListener('click',function(){close();});
scrim.addEventListener('click',function(e){if(e.target===scrim)close();});
document.addEventListener('keydown',function(e){
  if(!scrim.classList.contains('open'))return;
  if(e.key==='Escape'){close();e.stopPropagation();return;}
  if(e.key==='Tab'){
    var f=$$('button:not([disabled]),a[href],input:not([disabled]),select,textarea,summary,[tabindex="0"]',sheet).filter(function(x){return x.offsetParent!==null;});
    if(!f.length)return;var a=f[0],z=f[f.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}
  }
},true);
window.addEventListener('hashchange',function(){
  if(!C.hash)return;
  if(hashFlag){hashFlag=false;return;}
  var n=location.hash.slice(1);
  if(n&&C.pages[n]){if(cur!==n)open(n,true);}else close(true);
});
function act(e){
  var p=e.target.closest('[data-page]');
  if(p&&(body.contains(p)||foot.contains(p))){e.preventDefault();open(p.dataset.page);return;}
  var b=e.target.closest('[data-act]');if(!b)return;
  var fn=C.act[b.dataset.act];if(fn)fn(b,e);
}
body.addEventListener('click',act);foot.addEventListener('click',act);
['change','input'].forEach(function(t){body.addEventListener(t,function(e){if(C.on[t])C.on[t](e);});foot.addEventListener(t,function(e){if(C.on[t])C.on[t](e);});});
body.addEventListener('submit',function(e){e.preventDefault();if(C.on.submit)C.on.submit(e);});
foot.addEventListener('submit',function(e){e.preventDefault();if(C.on.submit)C.on.submit(e);});
function init(){var n=location.hash.slice(1);if(C.hash&&n&&C.pages[n])open(n,true);}
return {$:$,$$:$$,esc:esc,money:money,toast:toast,open:open,close:close,render:render,setErr:setErr,cfg:C,init:init,page:function(){return cur;},isOpen:function(){return scrim.classList.contains('open');}};
})();
