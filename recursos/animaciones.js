/* Animaciones - Taller Sin Fronteras
   - Sombra del encabezado y barra de progreso al hacer scroll
   - Aparicion de bloques al entrar en pantalla
   Si el sistema pide "reducir movimiento" o el navegador no soporta
   IntersectionObserver, todo queda visible y quieto. */
(function(){
 var d=document,root=d.documentElement;
 var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;

 /* Encabezado: sombra + barra de progreso */
 var hdr=d.querySelector('header'),pg=null;
 if(hdr&&!reduce){
  pg=d.createElement('div');pg.className='prog';pg.setAttribute('aria-hidden','true');
  hdr.appendChild(pg);
 }
 var tick=false;
 function upd(){
  tick=false;
  if(hdr)hdr.classList.toggle('scrolled',window.scrollY>8);
  if(pg){
   var h=root.scrollHeight-window.innerHeight;
   pg.style.setProperty('--p',h>0?Math.min(1,window.scrollY/h):0);
  }
 }
 window.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});
 window.addEventListener('resize',upd);
 upd();

 if(reduce||!('IntersectionObserver' in window))return;

 /* Contadores: cuentan de 0 al valor final al entrar en pantalla.
    El HTML ya trae el valor final, asi que sin JS se ve igual. */
 var nums=d.querySelectorAll('.num[data-to]');
 if(nums.length){
  var co=new IntersectionObserver(function(es){
   es.forEach(function(e){
    if(!e.isIntersecting)return;
    var el=e.target;
    co.unobserve(el);
    var to=+el.dataset.to,pre=el.dataset.pre||'',t0=null,dur=1400;
    function paso(t){
     if(t0===null)t0=t;
     var p=Math.min(1,(t-t0)/dur),v=Math.round(to*(1-Math.pow(1-p,3)));
     el.textContent=pre+v;
     if(p<1)requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
   });
  },{threshold:.6});
  nums.forEach(function(el){
   el.textContent=(el.dataset.pre||'')+'0';
   co.observe(el);
  });
 }

 /* Que elementos aparecen al hacer scroll: [selector, tipo] */
 var GRUPOS=[
  ['section > .wrap > h2'],
  ['section > .wrap > .sub'],
  ['.svc > div'],
  ['.two > div','side'],
  ['.gal figure','zoom'],
  ['.cgrid > div','zoom'],
  ['.rvw'],
  ['.c-grid > .box'],
  ['.map']
 ];

 var els=[],cuenta=new Map();
 GRUPOS.forEach(function(g){
  d.querySelectorAll(g[0]).forEach(function(el){
   /* Las fotos dentro de las columnas de servicios ya se animan con su columna */
   if(g[0]==='.gal figure'&&el.closest('.two'))return;
   var r=el.getBoundingClientRect();
   if(r.top<window.innerHeight&&r.bottom>0){el.classList.add('is-in');return} /* ya visible al cargar */
   var p=el.parentNode,k=cuenta.get(p)||0;
   cuenta.set(p,k+1);
   el.style.setProperty('--i',Math.min(k,7));
   var t=g[1];
   if(t==='side')t=k===0?'left':'right';
   el.setAttribute('data-reveal',t||'up');
   els.push(el);
  });
 });
 if(!els.length)return;
 root.classList.add('anim');

 var io=new IntersectionObserver(function(es){
  es.forEach(function(e){
   if(!e.isIntersecting)return;
   var el=e.target;
   io.unobserve(el);
   el.classList.add('is-in');
   /* Al terminar, se saca data-reveal para que los efectos hover vuelvan a funcionar */
   function listo(){el.removeAttribute('data-reveal')}
   el.addEventListener('transitionend',function f(ev){
    if(ev.target===el&&ev.propertyName==='opacity'){el.removeEventListener('transitionend',f);listo()}
   });
   setTimeout(listo,1800);
  });
 },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
 els.forEach(function(el){io.observe(el)});
})();
