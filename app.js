/* Both publications use local assets. */
const CONTACT_EMAIL='pflupianez@gmail.com';
if(CONTACT_EMAIL){const a=document.createElement('a');a.className='text-link';a.href='mailto:'+CONTACT_EMAIL+'?subject='+encodeURIComponent('Consulta para estudiosangría');a.textContent=CONTACT_EMAIL+' ↗';document.querySelector('#contact-target').replaceChildren(a);}
const BOOKS={cal:{title:'El corazón en un sobre',count:84,width:498.89801025390625,height:708.6610107421875,folder:'assets/pages',pdf:'https://www.juntadeandalucia.es/aaiicc/caletras/sites/default/files/docs/el_corazon_en_un_sobre-.pdf'},maf:{title:'PAUL',count:86,width:481.8900146484375,height:708.6610107421875,folder:'assets/paul',pdf:null}};
const reader=document.querySelector('#reader'),body=document.querySelector('#reader-body'),tools=document.querySelector('#reader-tools'),hint=document.querySelector('#reader-hint'),counter=document.querySelector('#page-counter');
let flip=null,active='cal',meta=BOOKS.cal,current=0,linear=false,lastTrigger=null,generation=0;
const pagePath=i=>BOOKS[active].folder+'/'+String(i+1).padStart(3,'0')+'.webp';
const flipHint='Arrastra una esquina, pulsa las flechas o usa las teclas ← →.';
function updateCounter(){counter.textContent=(current+1)+' / '+meta.count;document.querySelector('#prev-page').disabled=current===0;document.querySelector('#next-page').disabled=current>=meta.count-1;}
function destroyFlip(){if(flip){flip.destroy();flip=null;}body.replaceChildren();}
function resetControls(){document.querySelector('#read-linear').textContent='Lectura continua';for(const id of ['prev-page','next-page','page-counter','zoom-page'])document.getElementById(id).hidden=false;hint.textContent=flipHint;}
function makePage(i){const im=new Image();im.src=pagePath(i);im.alt=meta.title+', página '+(i+1);im.decoding='async';im.loading=Math.abs(i-current)<4?'eager':'lazy';return im;}
const loadFlip=()=>window.St?Promise.resolve():new Promise(r=>{const s=document.createElement('script');s.src='assets/page-flip.js';s.onload=s.onerror=r;document.head.append(s)});
async function showBook(){const ticket=++generation;try{await loadFlip();if(ticket!==generation||!reader.open)return;destroyFlip();body.classList.remove('linear');if(!window.St||!St.PageFlip){linear=true;showLinear();return;}
 const ratio=meta.height/meta.width,maxHeight=body.clientHeight-32,narrow=body.clientWidth<700,width=Math.max(100,Math.min(600,(body.clientWidth-38)/(narrow?1:2),maxHeight/ratio));const holder=document.createElement('div');holder.className='flip-holder';body.append(holder);
 for(let i=0;i<meta.count;i++){const page=document.createElement('div');page.className='page';page.append(makePage(i));holder.append(page);}
 flip=new St.PageFlip(holder,{width:Math.round(width),height:Math.round(width*ratio),size:'fixed',showCover:true,usePortrait:true,autoSize:true,maxShadowOpacity:.24,mobileScrollSupport:false,flippingTime:matchMedia('(prefers-reduced-motion: reduce)').matches?1:650,startPage:Math.min(current,meta.count-1)});flip.loadFromHTML(holder.querySelectorAll('.page'));flip.on('flip',e=>{current=e.data;updateCounter();});updateCounter();
 }catch(e){linear=true;showLinear();hint.textContent='La animación no está disponible. Puedes leer todas las páginas desplazándote.';}}
function showLinear(){destroyFlip();body.classList.add('linear');for(let i=0;i<meta.count;i++)body.append(makePage(i));document.querySelector('#read-linear').textContent='Volver a hojear';for(const id of ['prev-page','next-page','page-counter','zoom-page'])document.getElementById(id).hidden=true;hint.textContent='Desplázate para leer la publicación completa.';}
async function openReader(kind,trigger){if(!BOOKS[kind])return;lastTrigger=trigger;active=kind;meta=BOOKS[kind];current=0;linear=false;reader.showModal();document.body.classList.add('modal-open');document.querySelector('#reader-title').textContent=meta.title;tools.hidden=false;hint.hidden=false;tools.style.display='flex';const pdfLink=tools.querySelector('a');pdfLink.hidden=!meta.pdf;if(meta.pdf)pdfLink.href=meta.pdf;else pdfLink.removeAttribute('href');resetControls();await showBook();}
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>openReader(b.dataset.open,b)));
document.querySelector('#close-reader').onclick=()=>reader.close();reader.addEventListener('close',()=>{generation++;destroyFlip();document.body.classList.remove('modal-open');lastTrigger?.focus();});
document.querySelector('#prev-page').onclick=()=>flip?.flipPrev();document.querySelector('#next-page').onclick=()=>flip?.flipNext();
reader.addEventListener('keydown',e=>{if(linear)return;if(e.key==='ArrowLeft'){e.preventDefault();flip?.flipPrev();}if(e.key==='ArrowRight'){e.preventDefault();flip?.flipNext();}});
document.querySelector('#read-linear').onclick=async()=>{linear=!linear;if(linear)showLinear();else{resetControls();await showBook();}};
const zoom=document.querySelector('#zoom-dialog');document.querySelector('#zoom-page').onclick=()=>{document.querySelector('#zoom-content').replaceChildren(makePage(current));zoom.showModal();};document.querySelector('#close-zoom').onclick=()=>zoom.close();
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(reader.open&&!linear)showBook();},250);});

document.querySelectorAll('[data-spread]').forEach(button=>button.addEventListener('click',()=>{const pages=button.dataset.spread.split(',');['spread-left','spread-right'].forEach((id,i)=>{const img=document.getElementById(id);img.src='assets/pages/'+pages[i].padStart(3,'0')+'.webp';img.alt='Página '+pages[i]+' de la antología';});document.querySelectorAll('[data-spread]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});}));
