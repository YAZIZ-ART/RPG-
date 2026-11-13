/* =====================================================================
   AETHERIA v24  —  dimuat PALING AKHIR (setelah systems.js)
   - 8 senjata baru (Specter, Gravity, Spirit, Inkbrush, Beast, Chaos, Creation, Thunder) -> total 24
   - Skill 1-3 / 1-4 per senjata + Cooldown (CD) sesuai data, tombol skill menyesuaikan jumlah skill
   - Menu utama (Start / Continue / Setting), pilih senjata 3 halaman, HUD baru, peta rumput baru
   ===================================================================== */
(function(){
"use strict";

/* ---------- warna senjata baru ---------- */
Object.assign(PALH,{
  umbral:["#5a1fb0","#a24bff","#efdcff"], gravity:["#7a3cff","#d070ff","#f6e0ff"], spirit:["#2f8cff","#8fd8ff","#e8fbff"],
  ink:["#3a3a4a","#b8b8cc","#ffffff"], inkw:["#c8c8dc","#f0f0ff","#ffffff"], blood:["#a0081c","#ff3050","#ffd0d8"],
  chaos:["#c01a8a","#ff5ac8","#ffe0f4"], creation:["#1fb89a","#ffd35a","#ffffff"], thunder:["#ff2a4a","#5aa8ff","#ffffff"]});

/* ---------- 8 senjata baru: Basic ATK (urut combo) ---------- */
const NEW=[
 {name:"Specter",elem:"Shadow / Umbral",pal:"umbral",far:true,reach:90,mk:'bullet',cls:'gn',s8:['launch','launch','beam'],i8:'pierce',fam:'shadow',st:'void',sig:1,
  skills:[["Shadow Bullet I","streak","umbral",1,110],["Shadow Bullet II","streak","umbral",2,120],["Abyssal Laser","beam","umbral",0,200],["Phantom Slash I","slash","umbral",0,130],["Phantom Slash II","slash","umbral",0,140],["Eclipse Oblivion","wave","umbral",0,280]]},
 {name:"Gravity",elem:"Gravity",pal:"gravity",far:false,reach:80,mk:'ring',cls:'pn',s8:['thud','thud','smash'],i8:'shock',fam:'nebula',st:'nebula',sig:3,
  skills:[["Gravity Breaker","burst","gravity",0,120],["Gravity Reversal","ring","gravity",8,180],["Singularity Crush","drop","gravity",0,300]]},
 {name:"Spirit",elem:"Spirit",pal:"spirit",far:true,reach:90,mk:'wing',cls:'gn',s8:['launch','spin','xform'],i8:'shat',fam:'phantom',st:'ghost',sig:13,
  skills:[["Spirit Arrow I","streak","spirit",1,110],["Spirit Arrow II","orb","spirit",2,150],["Four Spirit Summoning","summon","spirit",4,190],["Eternal Arrow","beam","spirit",0,300]]},
 {name:"Inkbrush",elem:"Ink",pal:"ink",far:false,reach:100,mk:'drop',cls:'sl',s8:['spin','cut','xform'],i8:'surge',fam:'void',st:'blade',sig:4,
  skills:[["White Ink Slash","wave","inkw",0,120],["Black Ink Slash","wave","ink",0,170],["Yin-Yang Inkstorm","swirl","ink",0,290]]},
 {name:"Beast",elem:"Beast / Blood",pal:"blood",far:false,reach:90,mk:'flame',cls:'sl',s8:['heavy','heavy','smash'],i8:'erupt',fam:'pyro',st:'pyro',sig:15,
  skills:[["Blood Cleave I","slash","blood",0,130],["Blood Cleave II","burst","blood",8,180],["Tenfold Rampage","claws","blood",10,300]]},
 {name:"Chaos",elem:"Chaos",pal:"chaos",far:false,reach:95,mk:'shard',cls:'sl',s8:['quick','quick','xform'],i8:'crit',fam:'shadow',st:'blade',sig:4,
  skills:[["Chaos Slash I","slash","chaos",0,120],["Chaos Slash II","slash","chaos",0,130],["Ninefold Phantom","chakram","chaos",1,200],["Ninefold Chaos Execution","cross","chaos",0,300]]},
 {name:"Creation",elem:"Creation",pal:"creation",far:false,reach:90,mk:'star',cls:'sl',s8:['quick','cut','beam'],i8:'crit',fam:'holy',st:'holy',sig:12,
  skills:[["Creation Combo 1","slash","creation",0,100],["Creation Combo 2","slash","creation",0,100],["Creation Combo 3","slash","creation",0,105],["Creation Combo 4","slash","creation",0,105],["Creation Combo 5","slash","creation",0,110],["Creation Combo 6","wave","creation",0,130],["Cross Slash I","slash","creation",0,160],["Cross Slash II","cross","creation",0,300]]},
 {name:"Thunder",elem:"Thunder",pal:"thunder",far:false,reach:100,mk:'bolt',cls:'th',s8:['quick','thrust','thunder'],i8:'thunder',fam:'volt',st:'volt',sig:7,
  skills:[["Thunder Flash","claws","thunder",0,130],["Thunder Javelin","streak","thunder",3,190],["Heaven's Thunderfall","pillar","thunder",0,320]]}
];

/* ---------- Skill (urutan UI: Skill 1..4). [nama, palet, dmg, waktu-hit, efek[], CD, extra] ---------- */
const SK24={
 Specter:[
  ["Shadow Pierce","umbral",150,.3,[Z('proj',0,.9,{sh:'bullet',z:7,fd:.28,rad:34,rays:10,tr:14,n:2,iv:.06})],6],
  ["Phantom Cloak","umbral",120,.7,[Z('burst',0,.9,{r:48,rays:10,at:1,tl:.3}),Z('orbit',.1,.8,{n:4,sh:'shard',z:5,o:.3,iv:.05,fd:.22,R:22})],12,{inv:3}],
  ["Shadow Rift","umbral",220,.55,[Z('portal',0,.7,{}),Z('burst',.45,.8,{r:72,rays:12,cr:5,tl:0})],14,{mv:90}],
  ["Abyssal Execution","umbral",430,1.25,[Z('orbs',0,1.0,{n:3,cl:['#a24bff','#efdcff','#5a1fb0'],at:'t',h:-30,R:16,sq:.6,spin:6,z:4,ramp:.5}),Z('proj',1.0,.9,{sh:'orb',z:12,fd:.22,rad:70,rays:16,n:4,iv:.04,tr:18}),Z('burst',1.3,.9,{r:100,rays:18,tl:0})],22]],
 Gravity:[
  ["Gravity Pull","gravity",160,1.0,[Z('vortex',0,1.3,{r:58,arms:2,dark:1,rays:10})],8],
  ["Heavy Pressure","gravity",200,.65,[Z('burst',.1,1,{r:72,rays:10,tl:.5,cr:6})],10],
  ["Gravity Sphere","gravity",260,1.3,[Z('vortex',0,1.7,{r:62,arms:3,dark:1,rays:14})],16],
  ["Black Hole Cataclysm","gravity",440,1.9,[Z('vortex',.2,2.0,{r:112,arms:4,dark:1,rays:22}),Z('burst',2.1,.9,{r:132,rays:20,tl:0})],25]],
 Spirit:[
  ["Spirit Rain","spirit",170,.65,[Z('rain',0,1.1,{n:10,iv:.08,sh:'shard',z:6,w:100,h:50,rad:24})],8],
  ["Guardian Spirits","spirit",200,1.0,[Z('orbit',0,1.8,{n:2,sh:'wing',z:6,o:.6,iv:.3,fd:.3,R:26})],16,{inv:2}],
  ["Foresight Vision","spirit",150,.6,[Z('burst',0,.9,{r:56,at:1,tl:.4,rays:10}),Z('orbs',0,1.2,{n:3,cl:['#8fd8ff','#e8fbff','#2f8cff'],at:'f',h:-26,R:20,sq:.5,spin:7,z:4,ramp:.3})],14,{inv:2.5}],
  ["Spirit Realm","spirit",410,1.5,[Z('burst',0,1,{r:130,rays:16,at:1,tl:.5}),Z('orbit',.3,1.6,{n:4,sh:'wing',z:8,o:.6,iv:.12,fd:.3,R:40}),Z('rain',.9,.9,{n:12,iv:.06,sh:'shard',z:6,w:120,h:60,rad:26})],25]],
 Inkbrush:[
  ["White Canvas","inkw",150,.45,[Z('wave',0,.9,{sz:42,big:1})],7],
  ["Black Ink Prison","ink",190,.6,[Z('bind',0,2.0,{}),Z('burst',.1,.7,{r:50,rays:8,tl:.2})],12],
  ["Ink Doppelganger","ink",230,1.0,[Z('orbit',0,1.7,{n:3,sh:'drop',z:7,o:.4,iv:.2,fd:.3,R:26})],16],
  ["Yin-Yang Domain","ink",420,1.6,[Z('vortex',0,1.8,{r:104,arms:2,rays:16}),Z('vortex',.15,1.65,{r:72,arms:2,rays:10,c:'inkw'})],24]],
 Beast:[
  ["Blood Rend","blood",170,.4,[Z('wave',0,.85,{sz:46,big:1})],7],
  ["Beast Howl","blood",180,.5,[Z('burst',0,1,{r:86,rays:14,at:1,tl:.35})],12],
  ["Blood Transformation","blood",120,.7,[Z('burst',0,.9,{r:56,rays:12,at:1,tl:.3}),Z('orbit',.2,1.0,{n:6,sh:'flame',z:6,o:.3,iv:.05,fd:.2,R:20})],20,{dm:[1.35,7]}],
  ["Crimson Apocalypse","blood",440,1.3,[Z('wave',.3,.9,{sz:84,big:1}),Z('claw',.6,.5,{n:6,iv:.08}),Z('burst',1.25,.9,{r:112,rays:18,tl:0})],25]],
 Chaos:[
  ["Blade Formation","chaos",160,.9,[Z('orbit',0,1.5,{n:9,sh:'shard',z:5,o:.4,iv:.04,fd:.25,R:26})],9,{inv:2}],
  ["Chaos Pursuit","chaos",210,.85,[Z('proj',0,1.3,{sh:'shard',z:6,fd:.35,n:9,iv:.1,cv:26,rad:26,tr:8})],12],
  ["Ninefold Cage","chaos",240,.9,[Z('bind',0,1.9,{}),Z('orbit',0,.9,{n:9,sh:'shard',z:5,o:.3,iv:.03,fd:.3,R:30})],16],
  ["Chaos Dominion","chaos",430,1.5,[Z('rain',0,1.4,{n:20,iv:.06,sh:'shard',z:6,w:140,h:60,rad:26}),Z('burst',1.5,.9,{r:120,rays:18,tl:0})],25]],
 Creation:[
  ["Celestial Blade","creation",170,.8,[Z('orbit',0,1.5,{n:5,sh:'shard',z:7,o:.5,iv:.07,fd:.28,R:24})],9],
  ["Creation Wall","creation",100,.6,[Z('wave',0,1.3,{sz:70,big:1}),Z('burst',0,.8,{r:40,at:1,tl:.2,rays:8})],14,{inv:5}],
  ["Astral Construct","creation",260,.7,[Z('rain',.3,.8,{n:1,sh:'shard',z:18,w:0,h:0,rad:46,rays:12}),Z('burst',.65,1,{r:100,rays:16,tl:0})],16],
  ["Genesis Domain","creation",450,1.7,[Z('burst',0,1.2,{r:130,rays:16,tl:.5}),Z('rain',.5,1.2,{n:14,iv:.07,sh:'shard',z:8,w:130,h:60,rad:24}),Z('burst',1.8,.9,{r:130,rays:20,pil:1,tl:0})],26]],
 Thunder:[
  ["Lightning Dash","thunder",150,.25,[Z('proj',0,.5,{sh:'bolt',z:6,fd:.15,rad:28,rays:10,tr:12}),Z('burst',.12,.6,{r:50,rays:10,tl:0})],7,{mv:90}],
  ["Thunder Spear","thunder",200,.35,[Z('proj',0,.9,{sh:'bolt',z:9,fd:.32,rad:44,rays:12,tr:14}),Z('burst',.3,.7,{r:60,rays:12,tl:0})],10],
  ["Storm Recall","thunder",240,.4,[Z('rain',0,.6,{n:2,sh:'zap',w:40,h:20,rad:30}),Z('burst',.1,.8,{r:72,rays:12,cr:5,tl:.1})],14,{mv:110}],
  ["Divine Thunderstorm","thunder",440,1.9,[Z('rain',0,1.8,{n:18,iv:.09,sh:'zap',w:150,h:70,rad:28}),Z('burst',1.9,.9,{r:130,rays:20,pil:1,tl:0})],25]]
};

/* CD skill 16 senjata lama (urutan Skill 1,2,3). Senjata 9-16 belum punya CD di data -> pola standar 8/14/25 */
const CD_OLD=[[8,14,25],[7,14,25],[8,14,25],[8,15,26],[8,14,25],[8,15,26],[7,14,25],[7,14,25]];

/* ---------- daftarkan 8 senjata baru ke semua tabel per-indeks ---------- */
const NSK=[3,3,3,3,3,3,3,3,3,3,3,4,3,3,3,3]; // jumlah skill senjata lama (Ain Soph Aur: Skill 1-3 saja)
NEW.forEach((w,j)=>{
  const k=16+j, def=SK24[w.name], four=def.length===4;
  const order=four?[0,1,3,2]:[0,1,2];          // urutan internal: skill ultimate selalu di indeks 2
  const ns=order.map((o,ii)=>{const s=def[o],ty='N'+k+ii,dur=Math.max(...s[4].map(q=>q.s+q.d))+.12;DUR[ty]=dur;HITT[ty]=s[3]/dur;return[s[0],ty,s[1],0,s[2]];});
  const nd={name:w.name,elem:w.elem,pal:w.pal,skills:w.skills,far:w.far,reach:w.reach,ns,nst:order.map(o=>def[o][4]),
    cds:order.map(o=>def[o][5]),extra:order.map(o=>def[o][6]||null),map:four?[0,1,3,2]:[0,1,2],nSk:def.length};
  LIST.push(nd);
  MK[w.name]=w.mk;CLS.push(w.cls);S8.push(w.s8);I8.push(w.i8);WFAM.push(w.fam);WST.push(w.st);WSIG.push(WSIG[w.sig]);
});
/* lengkapi data senjata lama */
LIST.slice(0,16).forEach((w,k)=>{const n=k===11?3:w.ns.length;
  w.nSk=3;w.map=[0,1,2];w.extra=[null,null,null];
  w.cds=k<8?CD_OLD[k].slice():[8,14,25];});
/* tabel yang dipakai efek lama harus punya 4 slot */
ncd.length=4;ncd.fill(0);MCOST[3]=28;

/* ---------- ikon senjata (potongan kartu) ---------- */
const ICON=[];for(let i=0;i<24;i++){const im=new Image();im.src='img/w'+String(i).padStart(2,'0')+'.jpg';ICON.push(im);}
WI.length=16;for(let i=16;i<24;i++)WI.push(ICON[i]);
const imgOk=im=>im&&im.complete&&im.naturalWidth>0;

/* senjata baru memakai gambar kartu: digambar ADITIF agar latar gelap menghilang */
const _dw24=drawWeapon;
drawWeapon=function(pos){
  if(sel<16)return _dw24(pos);
  const im=ICON[sel];if(!imgOk(im))return;
  const c=pal(LIST[sel].pal),act=pl.cast>0,k=act?1-pl.cast/.5:0,sw=act?Math.sin(k*PI):0,sz=40+sw*10,hand=V(pos.x+pl.face*10,pos.y-16);
  ctx.save();ctx.globalCompositeOperation='lighter';gl(hand,c[0],sz*.55,.22+.4*sw);
  for(let j=act?3:0;j>=0;j--){const ang=pl.face*(-.5+(act?(sw*1.5-j*.3):Math.sin(tg*2)*.08));
    ctx.save();ctx.translate(hand.x,hand.y);ctx.rotate(ang);ctx.scale(pl.face,1);ctx.globalAlpha=j?.2:.95;ctx.imageSmoothingEnabled=true;
    ctx.beginPath();ctx.arc(0,-sz*.35,sz*.5,0,TAU);ctx.clip();ctx.drawImage(im,-sz*.5,-sz*.85,sz,sz);ctx.restore();}
  ctx.restore();};

/* ---------- Skill: CD per senjata, buff, teleport ---------- */
const BUFF={t:0,m:1};
const ui2in=(wd,k)=>wd.map[k];
function applyExtra(i){
  const wd=LIST[sel],x=wd.extra&&wd.extra[i];if(!x)return;
  if(x.inv)ST9.inv=Math.max(ST9.inv,x.inv);
  if(x.dm){BUFF.m=x.dm[0];BUFF.t=x.dm[1];}
  if(x.mv){const dir=(mon&&mon.alive&&dist(pl.pos,mon.pos)<320)?norm(sub(mon.pos,pl.pos)):V(pl.face,0),old=V(pl.pos.x,pl.pos.y);
    let np=add(pl.pos,mul(dir,x.mv));np=V(clamp(np.x,16,WW-16),clamp(np.y,50,WH-30));resolveObs(np,8);pl.pos=np;pl.face=dir.x>=0?1:-1;
    const P=pal(wd.pal);for(let q=0;q<10;q++)parts.push({p:lerpV(old,np,q/9),v:V(0,0),l:.3,m:.3,c:P[1]});fxAdd('tele',old,P[1],{d:.4});fxAdd('tele',np,P[1],{d:.4});}
}
const _cN24=castN;
castN=function(i){
  const wd=LIST[sel];for(let k=0;k<4;k++)if(wd.cds[k])ncm[k]=wd.cds[k];
  const n=fx.length;_cN24(i);if(fx.length>n)applyExtra(i);};
const _c24=cast;
cast=function(i,m,f){const n=fx.length;_c24(i,m,f);if(fx.length>n&&BUFF.t>0)fx[fx.length-1].dmg*=BUFF.m;};
function useSlot(k){if(state!=='battle')return;const wd=LIST[sel];if(k<0||k>=wd.nSk)return;castN(ui2in(wd,k));}

const _u24=update;
update=function(dt){
  if(!ST9.pause&&ST9.dead<=0){ncd[3]=Math.max(0,ncd[3]-dt);BUFF.t=Math.max(0,BUFF.t-dt);}
  _u24(dt);if(state==='battle'&&(tg-saveT>6)){saveT=tg;saveGame();}};
const _dp24=drawPlayer;
drawPlayer=function(){_dp24();
  if(state!=='battle'||pl.hidden)return;
  const c=pal(LIST[sel].pal);ctx.save();ctx.globalCompositeOperation='lighter';
  if(ST9.inv>.6)parc(add(pl.pos,V(0,-14)),24+Math.sin(tg*8)*1.5,0,TAU,[fade(c[1],.8),fade(c[2],.6)],.9,.9);
  if(BUFF.t>0){parc(add(pl.pos,V(0,4)),22,tg*3,tg*3+TAU,[c[0],c[2]],.8,.4);gl(add(pl.pos,V(0,-14)),c[0],26,.18);}
  ctx.restore();};

/* ---------- simpan / lanjut ---------- */
let saveT=0;
function saveGame(){try{localStorage.setItem('aeth24',JSON.stringify({sel,lv:ST9.lv,xp:ST9.xp}));}catch(_){}}
function loadGame(){try{const s=JSON.parse(localStorage.getItem('aeth24')||'null');return s&&typeof s.sel==='number'&&s.sel>=0&&s.sel<24?s:null;}catch(_){return null;}}
function startBattle(){BUFF.t=0;resetBattle();state='battle';saveT=tg;saveGame();}

/* ---------- peta rumput cerah (mirip gambar referensi) ---------- */
function patch(fn,pairs){let s=fn.toString();pairs.forEach(([a,b])=>{if(!s.includes(a))console.warn('patch miss',a);s=s.split(a).join(b);});return(0,eval)('('+s+')');}
mkTree=patch(mkTree,[
  ["['#2f8a4a','#4cc070','#7fe09a','#b8ffb0']","['#3aa84a','#5ad06a','#8af09a','#c8ffc0']"],
  ["['#1f5a3a','#2a7a48','#3a9a58','#62c77f']","['#2a8a2e','#3aa83a','#58c84c','#8fe870']"],
  ["'#1f5a3a'","'#2a7a34'"],["'#1b4f36'","'#256e2e'"],["'#2f8a52'","'#3fa84a'"],["'#143d28'","'#1c5a26'"]]);
buildBg=patch(buildBg,[["'#3a7d5c'","'#35a83f'"],["'#2f6a50'","'#2c9636'"],["'#448a64'","'#45bd4d'"],["'#86684a'","'#9a7448'"],
  ["['#5fc27a','#7fe09a','#2f9a52','#4cc070']","['#7be86f','#a6f58f','#2f9a3a','#4cc84e']"],["'#2f9a52'","'#2f9a3a'"],["'#3fb062'","'#43b84a'"],["'#7fe09a'","'#a6f58f'"],
  ["['#ffd35a','#ff8ac0','#ffffff','#9ad0ff']","['#ffffff','#ffffff','#fff2c0','#ffe070']"],["'#2a5f48'","'#23802e'"],["'#4cc070'","'#5fd45a'"],
  ["place(8,'tree');place(12,'rock');","place(11,'tree');place(14,'rock');"]]);
buildBg();

/* ---------- posisi kontrol (mengikuti gambar referensi HUD) ---------- */
JB.x=76;JB.y=282;
DSB.x=430;DSB.y=324;DSB.r=17;
SNDB.x=W-54;SNDB.y=23;SNDB.r=10;
PBN[0]=-200;PBN[1]=-200;PBN[2]=1;PBN[3]=1;           // tombol "II" lama dimatikan
const MENUB={x:W-22,y:23,r:14},BASB={x:574,y:278,r:40};
function slotPos(n,k){
  if(n>=4)return[[479,323],[485,267],[510,220],[558,190]][k];
  const a=[185,222,258][k]*PI/180;return[574+Math.cos(a)*92,278+Math.sin(a)*92];}

/* ---------- helper gambar ---------- */
const FT='"Trebuchet MS","Segoe UI",Arial,sans-serif';
function tx(s,x,y,size,col,al,w){ctx.font=(w||'bold')+' '+size+'px '+FT;ctx.textAlign=al||'left';ctx.textBaseline='alphabetic';ctx.fillStyle=typeof col==='string'?col:css(col);ctx.fillText(s,x,y);}
function tsh(s,x,y,size,col,al){ctx.save();ctx.shadowColor='rgba(0,0,0,.85)';ctx.shadowBlur=3;ctx.shadowOffsetY=1;tx(s,x,y,size,col,al);ctx.restore();}
function rr(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function bar24(x,y,w,h,k,c1,c2,label){
  ctx.save();rr(x,y,w,h,h/2);ctx.fillStyle='rgba(10,6,28,.75)';ctx.fill();ctx.clip();
  const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,c1);g.addColorStop(1,c2);ctx.fillStyle=g;ctx.fillRect(x,y,w*clamp(k,0,1),h);
  ctx.fillStyle='rgba(255,255,255,.28)';ctx.fillRect(x,y,w*clamp(k,0,1),Math.max(1,h*.3));ctx.restore();
  ctx.save();rr(x,y,w,h,h/2);ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=1;ctx.stroke();ctx.restore();
  if(label)tsh(label,x+w/2,y+h-3,h-4,'#fff','center');}
function iconCircle(idx,x,y,r,ring){
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fillStyle='rgba(13,8,38,.92)';ctx.fill();
  const im=ICON[idx];if(imgOk(im)){ctx.save();ctx.beginPath();ctx.arc(x,y,r-1,0,TAU);ctx.clip();ctx.imageSmoothingEnabled=true;ctx.drawImage(im,x-r,y-r,r*2,r*2);ctx.restore();}
  ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.strokeStyle=ring;ctx.lineWidth=2;ctx.stroke();ctx.restore();}

/* ---------- HUD pertempuran ---------- */
function skillBtn(k,n,wd,c){
  const [x,y]=slotPos(n,k),i=wd.map[k],r=21,cdv=ncd[i],cm=ncm[i]||1,ult=wd.ns[i][4]>=300;
  const cost=MCOST[i],lack=ST9.mp<cost;
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);
  const base=ult?[255,200,70,1]:[c[0],c[1],lerpC(c[0],c[2],.5)][k%3],g=ctx.createRadialGradient(x-5,y-6,2,x,y,r);
  g.addColorStop(0,css(lerpC(base,WHITE,.7)));g.addColorStop(.5,css(base));g.addColorStop(1,css(lerpC(base,[10,5,30,1],.55)));ctx.fillStyle=g;ctx.fill();
  ctx.lineWidth=2.5;ctx.strokeStyle=ult?'#ffd35a':'rgba(255,255,255,.85)';ctx.stroke();
  ctx.beginPath();ctx.arc(x,y,r-5,0,TAU);ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1;ctx.stroke();
  ctx.strokeStyle='#fff';ctx.fillStyle='#fff';ctx.lineWidth=2.2;ctx.lineCap='round';ctx.beginPath();
  const gk=ult?3:k%3;
  if(gk===0){ctx.moveTo(x-8,y+8);ctx.lineTo(x+8,y-8);ctx.moveTo(x-2,y+9);ctx.lineTo(x+9,y-2);ctx.stroke();}
  else if(gk===1){for(let q=-1;q<=1;q++){ctx.arc(x+q*7,y+3,4,PI*1.1,PI*1.9);ctx.moveTo(x+q*7+4,y+3);}ctx.stroke();ctx.beginPath();ctx.arc(x,y-5,2.2,0,TAU);ctx.fill();}
  else if(gk===2){ctx.arc(x,y,8,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(x,y,2.8,0,TAU);ctx.fill();}
  else{for(let q=0;q<4;q++){const a=q*PI/2;ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*10,y+Math.sin(a)*10);}ctx.stroke();ctx.beginPath();ctx.arc(x,y,3.4,0,TAU);ctx.fill();}
  if(lack&&cdv<=0){ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fillStyle='rgba(20,30,90,.55)';ctx.fill();}
  if(cdv>0){ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,r,-PI/2,-PI/2+TAU*(cdv/cm));ctx.closePath();ctx.fillStyle='rgba(0,0,0,.68)';ctx.fill();tsh(cdv>=10?cdv.toFixed(0):cdv.toFixed(1),x,y+5,12,'#fff','center');}
  ctx.restore();
  const lb=ctx.createLinearGradient(0,0,0,1);void lb;
  ctx.save();rr(x-22,y-r-14,44,12,6);ctx.fillStyle='rgba(5,3,20,.7)';ctx.fill();ctx.restore();
  tx('Skill '+(k+1),x,y-r-5,9,'#fff','center');}

function drawHud24(){
  if(state!=='battle')return;
  const wd=LIST[sel],c=pal(wd.pal),n=wd.nSk;
  if(Q11.lv>0){ctx.save();ctx.globalCompositeOperation='soft-light';const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(80,60,160,.25)');g.addColorStop(1,'rgba(255,170,90,.15)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore();}
  bloom();
  /* banner jurus pamungkas */
  const u=fx.find(e=>e.dmg>=300&&e.t<1);
  if(u){const k=Math.min(1,u.t*6)*(1-Math.max(0,(u.t-.7)/.3));ctx.fillStyle='rgba(0,0,0,.8)';ctx.fillRect(0,0,W,22*k);ctx.fillRect(0,H-22*k,W,22*k);
    tsh((u.nk?wd.ns:wd.skills)[u.i][0].toUpperCase(),W/2,86,22,css(fade(u.pal[1],k)),'center');tsh(wd.name,W/2,104,11,css(fade(WHITE,k*.8)),'center');}
  /* kiri atas: emblem + nama + HP + MP */
  iconCircle(sel,31,29,22,css(c[1]));
  tsh(wd.name,60,19,12,'#fff');tsh('Lv '+ST9.lv+(ST9.lv>=50?' MAX':''),176,19,10,'#ffd35a','right');
  bar24(58,24,118,14,ST9.hp/mxHP(),'#ff5a6a','#b01030','HP '+Math.ceil(ST9.hp)+' / '+mxHP());
  bar24(58,41,118,12,ST9.mp/mxMP(),'#4aa8ff','#1a54c8','MP '+Math.floor(ST9.mp)+' / '+mxMP());
  bar24(58,56,118,4,ST9.lv>=50?1:ST9.xp/need(),'#ffe27a','#d9a000');
  if(ST9.psn>0)tsh('RACUN',58,72,9,'#6aff8a');
  if(BUFF.t>0)tsh('BUFF '+BUFF.t.toFixed(0)+'s',58,ST9.psn>0?83:72,9,css(c[1]));
  /* target / boss */
  const b=MONS.find(m=>m.boss&&m.alive&&m.ag),tm=b||(mon&&mon.alive?mon:null);
  if(tm){const bw=b?260:190,x0=(W-bw)/2;bar24(x0,10,bw,b?10:8,tm.hp/tm.max,'#ff5a7a','#a01040');
    tsh((b?'BOSS: ':'')+(tm.name||'SLIME')+(tm.ph2?'  [FASE 2]':'')+'  '+Math.max(0,Math.floor(tm.hp))+'/'+tm.max,W/2,b?34:31,9,'#ffe0e8','center');}
  /* tombol titik tiga */
  ctx.save();ctx.beginPath();ctx.arc(MENUB.x,MENUB.y,MENUB.r,0,TAU);ctx.fillStyle='rgba(13,8,38,.8)';ctx.fill();ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle='#fff';for(let q=-1;q<=1;q++){ctx.beginPath();ctx.arc(MENUB.x+q*6,MENUB.y,1.9,0,TAU);ctx.fill();}ctx.restore();
  /* analog */
  ctx.save();ctx.beginPath();ctx.arc(JB.x,JB.y,46,0,TAU);ctx.fillStyle='rgba(30,16,70,.45)';ctx.fill();ctx.strokeStyle='rgba(150,150,255,.85)';ctx.lineWidth=2.5;ctx.stroke();
  ctx.beginPath();ctx.arc(JB.x,JB.y,34,0,TAU);ctx.fillStyle='rgba(10,6,30,.55)';ctx.fill();
  ctx.fillStyle='rgba(180,180,255,.8)';[[0,-41,-1],[0,41,1],[-41,0,2],[41,0,3]].forEach(([dx,dy,t])=>{ctx.beginPath();const x=JB.x+dx,y=JB.y+dy;if(t<2){ctx.moveTo(x-3.5,y+(t?-2:2));ctx.lineTo(x+3.5,y+(t?-2:2));ctx.lineTo(x,y+(t?2.5:-2.5));}else{ctx.moveTo(x+(t===2?2:-2),y-3.5);ctx.lineTo(x+(t===2?2:-2),y+3.5);ctx.lineTo(x+(t===2?-2.5:2.5),y);}ctx.fill();});
  const kx=JB.x+joy.x*30,ky=JB.y+joy.y*30;const kg=ctx.createRadialGradient(kx-4,ky-5,2,kx,ky,17);kg.addColorStop(0,'#d8c8ff');kg.addColorStop(1,'#7a5cd8');
  ctx.beginPath();ctx.arc(kx,ky,17,0,TAU);ctx.fillStyle=kg;ctx.fill();ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=2;ctx.stroke();ctx.restore();
  /* skill 1..n */
  for(let k=0;k<n;k++)skillBtn(k,n,wd,c);
  /* Basic ATK */
  const nB=wd.skills.length,nx=cmb%nB,held=bHold!==null;
  ctx.save();ctx.beginPath();ctx.arc(BASB.x,BASB.y,BASB.r,0,TAU);
  const bg2=ctx.createRadialGradient(BASB.x,BASB.y,6,BASB.x,BASB.y,BASB.r);bg2.addColorStop(0,held?'rgba(150,30,50,.95)':'rgba(60,8,24,.9)');bg2.addColorStop(1,held?'rgba(220,40,60,.95)':'rgba(120,16,40,.92)');
  ctx.fillStyle=bg2;ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=held?'#ff8a98':'#ff3a52';ctx.stroke();
  ctx.beginPath();ctx.arc(BASB.x,BASB.y,BASB.r-6,0,TAU);ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=1;ctx.stroke();
  ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.lineCap='round';
  [-1,1].forEach(s=>{ctx.beginPath();ctx.moveTo(BASB.x-s*14,BASB.y-18);ctx.lineTo(BASB.x+s*10,BASB.y+4);ctx.stroke();ctx.beginPath();ctx.moveTo(BASB.x+s*5,BASB.y+0);ctx.lineTo(BASB.x+s*13,BASB.y+8);ctx.stroke();});
  ctx.restore();
  tsh('Basic',BASB.x,BASB.y+16,11,'#fff','center');tsh('Atk',BASB.x,BASB.y+28,11,'#fff','center');
  for(let q=0;q<nB;q++){const px=BASB.x+(q-(nB-1)/2)*Math.min(9,56/nB),py=BASB.y-BASB.r-8;ctx.beginPath();ctx.arc(px,py,2.6,0,TAU);ctx.fillStyle=q===nx?css(c[1]):'rgba(255,255,255,.3)';ctx.fill();}
  if(cmb>1)tsh('COMBO x'+cmb,W/2,60,13,'#ffd35a','center');
  tsh(wd.skills[nx][0],BASB.x,BASB.y-BASB.r-14,9,'#e8dcff','center');
  status24();}

/* EXP, banner, kalah, pause */
function status24(){
  RW9.forEach((r,i)=>tsh('+'+r.n+' EXP',W/2,112+i*13-r.t*6,11,css([255,230,120,clamp(2.2-r.t,0,1)]),'center'));
  if(BN9.t>0){const a=clamp(BN9.t,0,1);ctx.fillStyle='rgba(0,0,0,'+.5*a+')';ctx.fillRect(0,140,W,34);tsh(BN9.txt,W/2,164,20,css([255,230,120,a]),'center');
    if(BN9.txt.startsWith('LEVEL'))tsh('HP +18   MP +4   DMG +6%',W/2,184,10,css([180,230,255,a]),'center');}
  if(ST9.dead>0){ctx.fillStyle='rgba(120,0,0,.45)';ctx.fillRect(0,0,W,H);tsh('KALAH',W/2,H/2,28,'#ff8080','center');}
  if(ST9.pause){ctx.fillStyle='rgba(0,0,10,.72)';ctx.fillRect(0,0,W,H);tsh('PAUSE',W/2,110,24,'#fff','center');
    PBT.forEach(([x,y,w,h,a])=>{ctx.save();rr(x,y,w,h,8);ctx.fillStyle='rgba(60,30,140,.92)';ctx.fill();ctx.strokeStyle='#c9a6ff';ctx.lineWidth=1.5;ctx.stroke();ctx.restore();
      tsh(['LANJUT','SUARA: '+(AU.on?'ON':'OFF'),'MENU UTAMA','KUALITAS: '+['RENDAH','SEDANG','TINGGI'][Q11.lv]][a],x+w/2,y+20,12,'#fff','center');});}}
drawHud=drawHud24;

/* ---------- input pertempuran (menggantikan tombol lama) ---------- */
const PAGES=[[0,1,2,3,4,5,6,7],[9,10,11,12,13,14,15,8],[16,17,18,19,20,21,22,23]];
const pageOf=i=>PAGES.findIndex(p=>p.includes(i)),slotOf=i=>PAGES[pageOf(i)].indexOf(i);
const CARDX=[96,214,329,442],CARDW=105,CARDY=[36,176],CARDH=[131,132];
const cardRect=k=>[CARDX[k%4],CARDY[k>>2],CARDW,CARDH[k>>2]];
const BTN_BACK=[17,316,117,30],BTN_OK=[505,316,119,30],ARR_L=[4,160,30,50],ARR_R=[W-34,160,30,50];
const BTN_START=[245,166,150,35],BTN_CONT=[245,208,150,34],BTN_SET=[245,248,150,34];
let setOpen=false;
const SETB=[0,1,2,3,4].map(q=>[W/2-90,118+q*32,180,26,q]);
function goPage(d){const p=(pageOf(sel)+d+3)%3;sel=PAGES[p][slotOf(sel)];}

cv.addEventListener('pointerdown',e=>{
  e.preventDefault();e.stopImmediatePropagation();
  try{cv.setPointerCapture(e.pointerId)}catch(_){}
  auResume();const m=ptr(e);
  if(state==='menu'){
    if(setOpen){for(const[x,y,w,h,a]of SETB)if(inR(m,[x,y,w,h])){if(a===0)setSnd(!AU.on);else if(a===1)AUX.mus=!AUX.mus;else if(a===2)AUX.sfx=!AUX.sfx;else if(a===3)Q11.cycle();else setOpen=false;}return;}
    if(inR(m,BTN_START)){sel=pageOf(sel)>=0?sel:0;state='select';}
    else if(inR(m,BTN_CONT)){const s=loadGame();if(s){sel=s.sel;ST9.lv=clamp(s.lv|0,1,50);ST9.xp=s.xp||0;startBattle();}else state='select';}
    else if(inR(m,BTN_SET))setOpen=true;
    return;}
  if(state==='select'){
    for(let k=0;k<8;k++)if(inR(m,cardRect(k)))sel=PAGES[pageOf(sel)][k];
    if(inR(m,ARR_L))goPage(-1);else if(inR(m,ARR_R))goPage(1);
    else if(inR(m,BTN_BACK))state='menu';
    else if(inR(m,BTN_OK))startBattle();
    return;}
  if(ST9.pause)return;
  if(dist(m,MENUB)<MENUB.r+8){ST9.pause=true;return;}
  if(dist(m,DSB)<DSB.r+8){doDash();return;}
  if(dist(m,BASB)<BASB.r+8){basic();bHold=e.pointerId;return;}
  const wd=LIST[sel];
  for(let k=0;k<wd.nSk;k++){const[x,y]=slotPos(wd.nSk,k);if(Math.hypot(m.x-x,m.y-y)<21+9){useSlot(k);return;}}
  if(m.x<W*.5&&m.y>H*.3){joy.id=e.pointerId;joyMove(m);}
},true);

addEventListener('keydown',e=>{
  const k=e.key;
  if(state==='menu'){if(k==='Enter'||k===' '){e.stopImmediatePropagation();e.preventDefault();if(setOpen)setOpen=false;else state='select';}return;}
  if(state==='select'){let used=true;
    if(k==='ArrowRight'){const s=slotOf(sel);if(s<7)sel=PAGES[pageOf(sel)][s+1];else{goPage(1);sel=PAGES[pageOf(sel)][0];}}
    else if(k==='ArrowLeft'){const s=slotOf(sel);if(s>0)sel=PAGES[pageOf(sel)][s-1];else{goPage(-1);sel=PAGES[pageOf(sel)][7];}}
    else if(k==='ArrowDown')sel=PAGES[pageOf(sel)][(slotOf(sel)+4)%8];else if(k==='ArrowUp')sel=PAGES[pageOf(sel)][(slotOf(sel)+4)%8];
    else if(k==='PageDown')goPage(1);else if(k==='PageUp')goPage(-1);
    else if(k==='Enter'||k===' ')startBattle();else if(k==='Escape')state='menu';else used=false;
    if(used){e.stopImmediatePropagation();e.preventDefault();}return;}
  if(state==='battle'&&!ST9.pause){
    if(k>='1'&&k<='4'){e.stopImmediatePropagation();e.preventDefault();if(!e.repeat)useSlot(+k-1);}
    else if(k==='k'||k==='K'||k==='l'||k==='L'){e.stopImmediatePropagation();}}
},true);

/* ---------- menu utama ---------- */
const TITLE=new Image();TITLE.src='img/title.jpg';
const SELIMG=[1,2,3].map(n=>{const im=new Image();im.src='img/select'+n+'.jpg';return im;});
function cover(im){ctx.imageSmoothingEnabled=true;ctx.drawImage(im,0,0,W,H);}
function bgFallback(){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#5a3a7a');g.addColorStop(.6,'#e08a60');g.addColorStop(1,'#2a1a4a');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
drawMenu=function(){
  if(imgOk(TITLE))cover(TITLE);else bgFallback();
  /* judul AETHERIA */
  ctx.save();const cx=W*.5,t=tg;
  ctx.fillStyle='rgba(40,16,70,.2)';ctx.beginPath();ctx.ellipse(cx,66,140,46,0,0,TAU);ctx.fill();
  ctx.font='bold 46px Georgia,"Times New Roman",serif';ctx.textAlign='center';ctx.textBaseline='alphabetic';
  ctx.shadowColor='rgba(255,190,120,.9)';ctx.shadowBlur=14+Math.sin(t*2)*4;ctx.fillStyle='#f7ead0';ctx.fillText('AETHERIA',cx,78);
  ctx.shadowBlur=0;ctx.font='italic bold 13px Georgia,serif';ctx.fillStyle='#e8d8f8';ctx.fillText('Echoes of the Five Elements',cx,100);
  ctx.strokeStyle='rgba(247,234,208,.7)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx-120,108);ctx.lineTo(cx+120,108);ctx.stroke();ctx.restore();
  /* kilau tombol Start */
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.1+.07*Math.sin(tg*3);ctx.fillStyle='#ffd38a';rr(BTN_START[0],BTN_START[1],BTN_START[2],BTN_START[3],8);ctx.fill();ctx.restore();
  if(!loadGame()){ctx.save();ctx.fillStyle='rgba(0,0,0,.35)';rr(BTN_CONT[0],BTN_CONT[1],BTN_CONT[2],BTN_CONT[3],8);ctx.fill();ctx.restore();}
  tsh('Ketuk Start untuk bermain',W/2,H-10,10,'rgba(255,255,255,.8)','center');
  if(setOpen){ctx.fillStyle='rgba(0,0,12,.7)';ctx.fillRect(0,0,W,H);
    ctx.save();rr(W/2-110,84,220,214,12);ctx.fillStyle='rgba(40,22,90,.96)';ctx.fill();ctx.strokeStyle='#c9a6ff';ctx.lineWidth=2;ctx.stroke();ctx.restore();
    tsh('SETTING',W/2,108,16,'#fff','center');
    SETB.forEach(([x,y,w,h,a])=>{ctx.save();rr(x,y,w,h,8);ctx.fillStyle='rgba(90,50,190,.9)';ctx.fill();ctx.strokeStyle='#e0ccff';ctx.lineWidth=1.5;ctx.stroke();ctx.restore();
      tsh(['Suara: '+(AU.on?'ON':'OFF'),'Musik: '+(AUX.mus?'ON':'OFF'),'Efek Suara: '+(AUX.sfx?'ON':'OFF'),'Kualitas: '+['Rendah','Sedang','Tinggi'][Q11.lv],'Tutup'][a],x+w/2,y+18,12,'#fff','center');});}
};

/* ---------- pilih senjata (3 halaman) ---------- */
drawSelect=function(){
  const pg=pageOf(sel),im=SELIMG[pg];
  if(imgOk(im))cover(im);else{ctx.fillStyle='#14082e';ctx.fillRect(0,0,W,H);}
  const wd=LIST[sel],c=pal(wd.pal),r=cardRect(slotOf(sel)),p=.5+.5*Math.sin(tg*4);
  ctx.save();ctx.globalCompositeOperation='lighter';
  ctx.strokeStyle=css(fade(c[1],.55+.35*p));ctx.lineWidth=3;rr(r[0]-2,r[1]-2,r[2]+4,r[3]+4,6);ctx.stroke();
  ctx.fillStyle=css(fade(c[0],.12+.1*p));rr(r[0],r[1],r[2],r[3],6);ctx.fill();ctx.restore();
  ctx.save();ctx.strokeStyle='#ffe9a8';ctx.lineWidth=1.5;rr(r[0]-3,r[1]-3,r[2]+6,r[3]+6,7);ctx.stroke();ctx.restore();
  /* plat info */
  ctx.save();rr(W/2-150,318,300,28,8);ctx.fillStyle='rgba(8,4,28,.72)';ctx.fill();ctx.strokeStyle='rgba(201,166,255,.8)';ctx.lineWidth=1.2;ctx.stroke();ctx.restore();
  tsh(wd.name+'  -  '+wd.elem,W/2,330,11,'#ffe9a8','center');
  tsh(wd.skills.length+' Basic ATK   |   '+wd.nSk+' Skill',W/2,342,9,'#d8c8ff','center');
  /* panah halaman */
  [[ARR_L,-1],[ARR_R,1]].forEach(([a,d])=>{ctx.save();rr(a[0],a[1],a[2],a[3],8);ctx.fillStyle='rgba(8,4,28,.6)';ctx.fill();ctx.strokeStyle='rgba(201,166,255,.9)';ctx.lineWidth=1.5;ctx.stroke();
    ctx.fillStyle='#fff';ctx.beginPath();const cx=a[0]+a[2]/2,cy=a[1]+a[3]/2;ctx.moveTo(cx+d*6,cy);ctx.lineTo(cx-d*5,cy-9);ctx.lineTo(cx-d*5,cy+9);ctx.closePath();ctx.fill();ctx.restore();});
  for(let q=0;q<3;q++){ctx.beginPath();ctx.arc(W/2-12+q*12,H-5,3,0,TAU);ctx.fillStyle=q===pg?'#ffe9a8':'rgba(255,255,255,.35)';ctx.fill();}
};

/* sinkronkan kondisi awal */
for(let i=0;i<24;i++)if(!LIST[i].cds)LIST[i].cds=[8,14,25];
})();
