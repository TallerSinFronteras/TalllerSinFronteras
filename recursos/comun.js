(function(){
 var nav=document.getElementById('nav'),bg=document.getElementById('bg');
 if(bg)bg.addEventListener('click',function(){bg.setAttribute('aria-expanded',nav.classList.toggle('open'))});
 var y=document.getElementById('y');if(y)y.textContent=new Date().getFullYear();

 var lb=document.createElement('dialog');lb.id='lb';
 lb.innerHTML='<button aria-label="Cerrar">&times;</button><img alt="">';
 document.body.appendChild(lb);
 lb.addEventListener('click',function(){lb.close()});

 document.querySelectorAll('.gal').forEach(function(g){
  var list=[];
  if(g.dataset.extra)g.dataset.extra.split(',').forEach(function(id){list.push('https://lh3.googleusercontent.com/gps-cs-s/'+id.trim()+'=w1200')});
  if(g.dataset.fotos)list=list.concat(g.dataset.fotos.split(','));
  else for(var i=1;i<=(+g.dataset.auto||30);i++)list.push('../fotos/'+i+'.jpg');
  var alt=g.dataset.alt||'Taller Sin Fronteras';
  var empty=g.nextElementSibling&&g.nextElementSibling.classList.contains('vacio')?g.nextElementSibling:null;
  function check(){
   if(!g.querySelector('figure')){g.style.display='none';if(empty)empty.style.display='block'}
  }
  list.forEach(function(src){
   src=src.trim();
   var f=document.createElement('figure'),im=new Image();
   im.alt=alt;im.loading='lazy';
   im.onerror=function(){f.remove();check()};
   im.src=src;
   f.appendChild(im);
   f.addEventListener('click',function(){lb.querySelector('img').src=src;lb.showModal()});
   g.appendChild(f);
  });
 });
})();
