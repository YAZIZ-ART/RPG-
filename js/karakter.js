/* ===== PEMILIHAN KARAKTER ===== */
const NAMA={api:'Api',air:'Air',tanah:'Tanah',listrik:'Listrik',udara:'Udara'};
const ICON={
 api:'<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#c9301c" stroke="#ffb090" stroke-width="1.5"/><path d="M16 4c1 5 7 8 7 15a7 7 0 0 1-14 0c0-3 2-5 3-7 .5 2 1.5 3 2.5 3 0-3-1-6 1.5-11z" fill="#ff9a3c" stroke="#fff3c0" stroke-width="1"/><path d="M16 14c1 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1.5-3 2-4 .5 1 1 1.5 1.5 1.5-.3-2-.2-3.5.5-5.5z" fill="#ffe27a"/></svg>',
 air:'<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#1d5fd0" stroke="#9fd0ff" stroke-width="1.5"/><path d="M16 4C12 11 8 15 8 20a8 8 0 0 0 16 0c0-5-4-9-8-16z" fill="#2a8cf0" stroke="#d6efff" stroke-width="1.2"/><path d="M12 19a4 4 0 0 0 3 4" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
 tanah:'<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#7a4a24" stroke="#f0c080" stroke-width="1.5"/><path d="M16 4l5 7-1 15h-8l-1-13z" fill="#e8b878" stroke="#fff0d0" stroke-width="1"/><path d="M8 12l4 2 1 12-6-3zM24 12l-4 2-1 12 6-3z" fill="#b9803f" stroke="#f0c080" stroke-width="1"/><path d="M16 4l5 7-5 3-5-3z" fill="#fff0d0"/></svg>',
 listrik:'<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#a87a08" stroke="#fff0a0" stroke-width="1.5"/><path d="M19 2L7 18h7l-3 12 14-18h-8z" fill="#ffe32a" stroke="#fff9c4" stroke-width="1.2" stroke-linejoin="round"/></svg>',
 udara:'<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#0f7f98" stroke="#a8f0ff" stroke-width="1.5"/><path d="M16 8a8 8 0 1 0 8 8 5 5 0 0 0-10-1 3 3 0 0 0 5 1" fill="none" stroke="#b8f4ff" stroke-width="3" stroke-linecap="round"/></svg>'
};
const RC={api:'#ff6a2a',air:'#3a9cff',tanah:'#e0a050',listrik:'#ffd820',udara:'#40e0f0'};

// kartu: latar elemen + api/kristal pixel + karakter dari frame()
function kartu(c,i){
 const W=96,H=64,SC=4,cv=document.createElement('canvas');cv.width=W*SC;cv.height=H*SC;cv.className='sp';
 const x=cv.getContext('2d');x.imageSmoothingEnabled=false;x.scale(SC,SC);
 const col=EL[c[2]],gd=x.createLinearGradient(0,0,0,H);
 gd.addColorStop(0,'#1a1160');gd.addColorStop(.55,'#2a1a8a');gd.addColorStop(1,col[0]);
 x.fillStyle=gd;x.fillRect(0,0,W,H);
 // lidah api/kristal bergerigi dari bawah
 for(let k=0;k<2;k++){x.globalAlpha=k?.5:.9;x.fillStyle=k?col[1]:col[0];
  for(let px=-4+k*5;px<W;px+=10){const h=14+((px*7+i*13+k*5)%17);x.beginPath();x.moveTo(px,H);x.lineTo(px+5,H-h);x.lineTo(px+10,H);x.fill()}}
 x.globalAlpha=1;
 const gl=x.createRadialGradient(W*.5,H*.45,2,W*.5,H*.45,W*.5);gl.addColorStop(0,col[1]+'66');gl.addColorStop(1,'#0000');
 x.fillStyle=gl;x.fillRect(0,0,W,H);
 x.drawImage(frame(c,-1,-1),8,2,W,H,0,0,W,H);   // potong area karakter + senjata
 return cv}

const gr=document.getElementById('gr');let sel=-1;
C.forEach((c,i)=>{
 const b=document.createElement('button');b.type='button';b.className='cd';b.setAttribute('role','radio');b.setAttribute('aria-checked','false');
 b.setAttribute('aria-label',(i+1)+'. '+c[0]+', '+c[1]+', elemen '+NAMA[c[2]]);
 const bd=document.createElement('span');bd.className='bd';bd.innerHTML=ICON[c[2]];
 const nm=document.createElement('span');nm.className='nm';nm.innerHTML=(i+1)+'. '+c[0]+'<small>('+c[1]+')</small>';
 const ck=document.createElement('span');ck.className='chk';ck.textContent='✓';
 b.append(kartu(c,i),bd,nm,ck);b.onclick=()=>pilih(i);gr.append(b)});

const sub=document.getElementById('sub'),ok=document.getElementById('ok');
const SUB0='Pilih karakter yang akan kamu gunakan!';
function pilih(i){sel=i;[...gr.children].forEach((e,j)=>{e.classList.toggle('on',j==i);e.setAttribute('aria-checked',j==i)});
 sub.classList.remove('warn');sub.textContent=C[i][0]+' · '+C[i][1]+' · Elemen '+NAMA[C[i][2]];
 ok.disabled=false;ok.classList.add('ready')}

// legenda elemen
document.getElementById('lg').innerHTML=Object.keys(NAMA).map(k=>'<div>'+ICON[k]+NAMA[k]+'</div>').join('');

// tombol: hubungkan ke game lewat event
ok.onclick=()=>{if(sel<0){sub.classList.add('warn');sub.textContent='Pilih satu karakter dulu!';return}
 const c=C[sel],d={index:sel,nama:c[0],senjata:c[1],elemen:c[2]};
 window.karakterTerpilih=d;document.dispatchEvent(new CustomEvent('karakter-dipilih',{detail:d}))};
document.getElementById('back').onclick=()=>document.dispatchEvent(new CustomEvent('kembali-menu'));

// latar malam: langit, bulan, kastil, pohon
const bg=document.getElementById('bg'),g=bg.getContext('2d');let BW,BH;
function ukuran(){const s=4;BW=Math.ceil(innerWidth/s);BH=Math.ceil(innerHeight/s);bg.width=BW;bg.height=BH}
const R=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};
function kastil(x,base,w,h,col,lit){g.fillStyle=col;
 for(let k=0;k<3;k++){const tw=Math.round(w/4),tx=x+k*Math.round(w/3),th=h*(k==1?1:.7);
  g.fillRect(tx,base-th,tw,th);g.beginPath();g.moveTo(tx-2,base-th);g.lineTo(tx+tw/2,base-th-tw*1.6);g.lineTo(tx+tw+2,base-th);g.fill()}
 g.fillRect(x,base-h*.35,w,h*.35);
 g.fillStyle=lit;for(let k=0;k<4;k++)if(R(k+x)>.3)g.fillRect(x+4+k*Math.round(w/4),base-h*.6,2,3)}
function pohon(x,base,h,col){g.fillStyle=col;for(let k=0;k<4;k++){const w=h*.28*(k+1)/2+3,y=base-h+k*h*.22;g.beginPath();g.moveTo(x,y);g.lineTo(x+w,y+h*.3);g.lineTo(x-w,y+h*.3);g.fill()}}
function latar(T){
 const sk=g.createLinearGradient(0,0,0,BH);sk.addColorStop(0,'#090626');sk.addColorStop(.5,'#1d1470');sk.addColorStop(1,'#4a2a9c');
 g.fillStyle=sk;g.fillRect(0,0,BW,BH);
 for(let i=0;i<70;i++){const sx=Math.floor(R(i)*BW),sy=Math.floor(R(i+99)*BH*.7);
  g.globalAlpha=.4+.6*Math.abs(Math.sin(T*.0015+i));g.fillStyle=i%3?'#fff':'#a8b0ff';g.fillRect(sx,sy,1,1);if(i%9==0){g.fillRect(sx-1,sy,3,1);g.fillRect(sx,sy-1,1,3)}}
 g.globalAlpha=1;
 const mr=Math.max(7,Math.min(BW,BH)*.07),mx=BW*.12,my=BH*.1+mr;
 const mg=g.createRadialGradient(mx,my,mr*.6,mx,my,mr*3);mg.addColorStop(0,'#c8b8ff88');mg.addColorStop(1,'#0000');g.fillStyle=mg;g.fillRect(0,0,mx+mr*3,my+mr*3);
 g.fillStyle='#f4ecff';g.beginPath();g.arc(mx,my,mr,0,7);g.fill();g.fillStyle='#d2c6f4';
 g.fillRect(mx-mr*.4,my-mr*.2,mr*.35,mr*.3);g.fillRect(mx+mr*.2,my+mr*.3,mr*.3,mr*.3);g.fillRect(mx-mr*.1,my-mr*.6,mr*.2,mr*.2);
 // awan ungu
 g.fillStyle='#6a48c8';g.globalAlpha=.55;
 for(let k=0;k<6;k++){const cx=((k*BW*.19+T*.004*(k%3+1))%(BW+60))-30,cy=BH*.12+(k%3)*10;g.fillRect(cx,cy,40,6);g.fillRect(cx+6,cy-4,24,4);g.fillRect(cx+10,cy+6,22,3)}
 g.globalAlpha=1;
 const base=BH,kw=Math.max(34,BW*.1),kh=Math.max(60,BH*.3);
 kastil(BW*.03,base-BH*.12,kw,kh,'#1c1458','#ffc860');
 kastil(BW-kw-BW*.04,base-BH*.12,kw,kh,'#1c1458','#ffc860');
 for(let i=0;i<10;i++){const left=i<5,px=left?i*9+2:BW-(i-5)*9-2;pohon(px,base+4-(i%2)*4,BH*.22+R(i)*20,i%2?'#0f1f4a':'#143060')}
 for(let i=0;i<Math.max(8,BW/14);i++)pohon(BW*.2+R(i+50)*BW*.6,base+8,12+R(i+7)*10,'#0c1a40');
}
function anim(T){latar(T);setTimeout(()=>requestAnimationFrame(anim),100)}
addEventListener('resize',ukuran);ukuran();
if(matchMedia('(prefers-reduced-motion:reduce)').matches)latar(0);else requestAnimationFrame(anim);

document.addEventListener('karakter-dipilih',e=>{try{sessionStorage.setItem('aetheria_char',e.detail.index)}catch(x){}location.href='game.html'});
document.addEventListener('kembali-menu',()=>{location.href='index.html'});
