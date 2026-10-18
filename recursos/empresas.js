/* Empresas con las que trabajamos - Taller Sin Fronteras
   n = nombre de la empresa; l = localidad (opcional);
   i:1 = también aparece en el cuadro "Marcas que están con nosotros" del inicio;
   logo = ruta a su logo (opcional), por ejemplo 'clientes/empresa.svg'.
   Todas las empresas de esta lista se muestran en paginas/empresas.html. */
var EMPRESAS=[
 {n:'Manaos SRL',l:'Catán, Buenos Aires'},
 {n:'Marolio SRL',l:'Rodríguez, Buenos Aires'},
 {n:'Mercado Libre',l:'Terminal Celina, Buenos Aires'},
 {n:'La Dolche Bonafide',l:'Mataderos, CABA'},
 {n:'Transporte Morresi',l:'Santa Fe',i:1},
 {n:'Transporte De Dios',l:'San Juan',i:1},
 {n:'La Sevillanita',l:'Tucumán',i:1},
 {n:'Don Arsanto',l:'Vedia, Buenos Aires',i:1},
 {n:'Madasa SRL',l:'Catamarca',i:1},
 {n:'Transporte La Silvia',l:'Navarro, Buenos Aires',i:1},
 {n:'Expreso Oro Negro',l:'San Justo, Buenos Aires',i:1},
 {n:'Feedlot Los Pampas',l:'Ascensión, Entre Ríos'},
 {n:'Colser',l:'Villars, Buenos Aires'},
 {n:'Transporte Dan Flor',l:'Rafael Castillo, Buenos Aires'},
 {n:'Trans Atuhel',l:'Córdoba'},
 {n:'Transporte Global',l:'Tucumán'},
 {n:'El Indiecito',l:'Corrientes'},
 {n:'Transporte del Centro',l:'Coronel Moldes, Córdoba'},
 {n:'El Condori',l:'Bursaco, Buenos Aires'}
];

/* Logos: cada empresa busca su logo en logos/marcas-que-trabajan-con-nosotros/ con su nombre en minúsculas y con guiones
   (por ejemplo manaos-srl.svg, .png, .jpg o .webp). Si no hay logo, se muestra solo el nombre.
   Para usar otro archivo, agregale a la empresa logo:'logos/marcas-que-trabajan-con-nosotros/archivo.png'. */
function logoEmpresa(c,base){
 var im=document.createElement('img'),k=0;
 var s=c.n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
 var L=c.logo?[base+c.logo]:['svg','png','jpg','jpeg','webp'].map(function(e){return base+'logos/marcas-que-trabajan-con-nosotros/'+s+'.'+e});
 im.alt='';im.style.display='none';
 im.onload=function(){im.style.display=''};
 im.onerror=function(){k++;if(k<L.length)im.src=L[k];else im.remove()};
 im.src=L[0];
 return im;
}
