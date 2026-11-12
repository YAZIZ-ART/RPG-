"use strict";
const W=640,H=360,TAU=Math.PI*2,PI=Math.PI,WW=1600,WH=600;
let camX=0,camY=0;
const IMGS=new Array(16).fill("");
const cv=document.getElementById('c'),ctx=cv.getContext('2d');
let SC=1;
function resize(){const dpr=window.devicePixelRatio||1,s=Math.min(innerWidth/W,innerHeight/H);
  cv.style.width=W*s+'px';cv.style.height=H*s+'px';cv.width=Math.round(W*s*dpr);cv.height=Math.round(H*s*dpr);SC=cv.width/W;}
addEventListener('resize',resize);resize();

/* ---------- helpers ---------- */
const V=(x,y)=>({x,y}),add=(a,b)=>V(a.x+b.x,a.y+b.y),sub=(a,b)=>V(a.x-b.x,a.y-b.y),mul=(a,s)=>V(a.x*s,a.y*s);
const len=a=>Math.hypot(a.x,a.y),dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),lerp=(a,b,t)=>a+(b-a)*t;
const lerpV=(a,b,t)=>V(lerp(a.x,b.x,t),lerp(a.y,b.y,t)),clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const norm=a=>{const l=len(a)||1;return V(a.x/l,a.y/l)},fromA=a=>V(Math.cos(a),Math.sin(a)),angOf=v=>Math.atan2(v.y,v.x);
const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16),1];
const css=c=>`rgba(${c[0]|0},${c[1]|0},${c[2]|0},${clamp(c[3],0,1)})`;
const fade=(c,a)=>[c[0],c[1],c[2],c[3]*clamp(a,0,1)];
const lerpC=(a,b,t)=>[lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t),1];
const WHITE=[255,255,255,1];

function dot(p,c,s=2){ctx.fillStyle=css(c);ctx.fillRect(Math.floor(p.x/2)*2,Math.floor(p.y/2)*2,s,s);}
function gl(p,c,r,a){ctx.fillStyle=css(fade(c,a));ctx.fillRect(p.x-r,p.y-r,r*2,r*2);}
function tline0(a,b,cols,al){const d=sub(b,a),L=len(d);if(L<1)return;const dv=mul(d,1/L),pv=V(-dv.y,dv.x),m=(cols.length-1)*.5,steps=Math.floor(L/2);
  for(let i=0;i<=steps;i++){const q=add(a,mul(dv,i*2));for(let k=0;k<cols.length;k++)dot(add(q,mul(pv,(k-m)*2)),fade(cols[k],al));}}
function parc0(c,r,a0,a1,cols,al,sq=1){const n=Math.floor(Math.abs(a1-a0)*r/2)+1,m=(cols.length-1)*.5;
  for(let i=0;i<=n;i++){const a=lerp(a0,a1,i/n),u=V(Math.cos(a),Math.sin(a)*sq);for(let k=0;k<cols.length;k++)dot(add(c,mul(u,r+(k-m)*2)),fade(cols[k],al));}}
const SKULL=[".XXXX.","XXXXXX","XoXXoX","XXXXXX",".XXXX.",".X.X.X"];
function skull(c,col,s){for(let y=0;y<6;y++)for(let x=0;x<6;x++){const ch=SKULL[y][x];if(ch==='.')continue;
  ctx.fillStyle=css(ch==='X'?col:[5,25,12,col[3]]);ctx.fillRect(c.x+(x-3)*s,c.y+(y-3)*s,s,s);}}
function chak(c,A,B,rot){for(let k=0;k<14;k++)dot(add(c,mul(fromA(TAU*k/14),9)),A,3);
  for(let k=0;k<8;k++)dot(add(c,mul(fromA(TAU*k/8),5)),B,2);
  for(let k=0;k<4;k++)dot(add(c,mul(fromA(rot+k*PI/2),13)),WHITE,3);}
function spr(rows,pal,pos,flip,tint,s){const h=rows.length,w=rows[0].length,bx=Math.floor(pos.x),by=Math.floor(pos.y);
  for(let y=0;y<h;y++){const row=rows[y];for(let x=0;x<w;x++){const ch=row[x];if(ch==='.')continue;const c=pal[ch],xx=flip?w-1-x:x;
    ctx.fillStyle=css([Math.min(255,c[0]*tint[0]),Math.min(255,c[1]*tint[1]),Math.min(255,c[2]*tint[2]),tint[3]]);
    ctx.fillRect(bx+(xx-w/2)*s,by+(y-h)*s,s,s);}}}
function txt(s,x,y,size,col,al='left'){ctx.font=`bold ${size}px "Courier New",monospace`;ctx.textAlign=al;ctx.textBaseline='alphabetic';
  ctx.lineJoin='round';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.9)';ctx.strokeText(s,x,y);
  ctx.fillStyle=typeof col==='string'?col:css(col);ctx.fillText(s,x,y);}

/* ---------- data senjata ---------- */
const PALH={fire:["#ff4a14","#ffa032","#fff0b0"],ice:["#2a9bff","#8fe4ff","#ffffff"],fireice:["#ff5a1a","#40c8ff","#ffffff"],
void:["#7a2cff","#c25bff","#f6e0ff"],cosmic:["#ff9a1e","#ffd35a","#fff8dc"],nebula:["#6a3cff","#c24bff","#cfe6ff"],
shadow:["#8a0f30","#e0204a","#ffc0cc"],holy:["#ffb81f","#fff09a","#ffffff"],soul:["#1fd65a","#8cffb0","#eafff0"],
gamma:["#ffb800","#ffe65a","#ffffff"],volt:["#ff1f4a","#ff7a96","#ffe6ec"],tsunami:["#1a7dff","#5cc8ff","#e8fbff"],
vibra:["#8a3cff","#ffc83a","#ffffff"],lunar:["#8a4cff","#cfa8ff","#ffffff"],phantom:["#a548ff","#e0a8ff","#ffffff"],
frost:["#2f6cff","#9ad4ff","#ffffff"],pyro:["#ff2a10","#ff8a1e","#ffe08a"],earth:["#8a5a2a","#c8a060","#f4e2b0"],
wind:["#2fbfb0","#9ff0e0","#ffffff"],elec:["#ffd21f","#fff08a","#ffffff"]};
const pal=k=>PALH[k].map(hex);
const LIST=[
{name:"Frostfire",elem:"Frostfire (Api & Es)",pal:"fireice",skills:[["Fist Strike","slash","fire",0,120],["Ice Explosion","burst","ice",14,180],["Fire-Ice Burst","burst","fireice",26,320]]},
{name:"Voidspike",elem:"Prisma (Void)",pal:"void",skills:[["Crystal Shards","bolts","void",5,110],["Crystal Spear","streak","void",1,200],["Void Domain","ring","void",16,330]]},
{name:"Starlance",elem:"Cosmic",pal:"cosmic",skills:[["Lance Swing","wave","cosmic",0,130],["Jump Thrust","drop","cosmic",0,220],["Starfall Wave","ring","cosmic",14,340]]},
{name:"Nebulash",elem:"Cosmic",pal:"nebula",skills:[["Chakram Throw","chakram","nebula",0,120],["Chakram Return","chakram","nebula",1,190],["Nebula Burst","swirl","nebula",3,330]]},
{name:"Zenithblade",elem:"Chaos",pal:"shadow",skills:[["Shadow Slash","slash","shadow",0,130],["Light Slash","slash","holy",0,150],["Dual Blade X","cross","shadow",0,340]]},
{name:"Lanternis",elem:"Soulbound",pal:"soul",skills:[["Soul Orb","orb","soul",1,120],["Spirit Burst","orb","soul",3,200],["Raise the Dead","summon","soul",6,340]]},
{name:"Fangchain",elem:"Gamma",pal:"gamma",skills:[["Chain Strike","chain","gamma",0,120],["Chain Bind","chain","gamma",1,190],["Radiant Detonation","chain","gamma",2,350]]},
{name:"Tigerclaw",elem:"Voltra",pal:"volt",skills:[["Claw Rush","claws","volt",3,130],["Double Claw","claws","volt",6,210],["Thunder Teleport","teleport","volt",0,360]]},
{name:"Trident",elem:"Tsunami",pal:"tsunami",skills:[["Trident Thrust","streak","tsunami",3,120],["Water Slash","wave","tsunami",1,180],["Tsunami Spear","tide","tsunami",0,350]]},
{name:"Twin Eagle",elem:"Vibra",pal:"vibra",skills:[["Dual Shot","streak","vibra",2,120],["Crossfire Burst","streak","vibra",6,210],["Judgment Laser","beam","vibra",0,360]]},
{name:"Riftreaper",elem:"Lunar",pal:"lunar",skills:[["Crescent Slash","slash","lunar",0,130],["Lunar Rush","rush","lunar",4,210],["Moonfall","moon","lunar",0,360]]},
{name:"Ain Soph Aur",elem:"Elementary",pal:"holy",skills:[["Fire","burst","fire",14,140],["Water","tide","tsunami",0,150],["Earth","ring","earth",12,160],["Wind","swirl","wind",0,170],["Lightning","lightning","elec",0,190],["Five Elements","five","holy",0,400]]},
{name:"Sandalphon",elem:"Light",pal:"holy",skills:[["Sword Strike","slash","holy",0,130],["Light Slash","wave","holy",1,190],["Divine Judgement","pillar","holy",0,360]]},
{name:"Zadkiel",elem:"Phantom",pal:"phantom",skills:[["Phantom Call","orb","phantom",4,140],["Fairy Blessing","bolts","phantom",6,190],["Spirits Union","summon","phantom",8,350]]},
{name:"Gunbai",elem:"Frostphoon (Topan & Es)",pal:"frost",skills:[["Wind Slash","wave","frost",0,120],["Blizzard Tornado","swirl","frost",0,200],["Frozen Storm","ring","ice",12,340]]},
{name:"Camael",elem:"Pyro",pal:"pyro",skills:[["Flame Claw","claws","pyro",3,130],["Inferno Strike","wave","pyro",1,200],["Pyro Burst","burst","pyro",28,370]]}];
const FAR=["Twin Eagle","Gunbai","Ain Soph Aur","Zadkiel","Voidspike","Nebulash","Lanternis"];
const REACH={Fangchain:120,Trident:105,Starlance:100};
LIST.forEach(w=>{w.far=FAR.includes(w.name);w.reach=REACH[w.name]||85;});
const DUR={slash:.55,bolts:.95,streak:.7,orb:1.1,burst:.95,ring:1.4,wave:.95,tide:1.3,pillar:1.2,lightning:.9,beam:1.1,cross:.95,claws:.7,swirl:1.5,summon:1.6,chain:1.1,chakram:1.2,teleport:1.4,rush:.95,drop:1.05,moon:1.5,five:1.6};
const HITT={slash:.35,bolts:.55,streak:.4,orb:.6,burst:.2,ring:.5,wave:.55,tide:.5,pillar:.4,lightning:.3,beam:.3,cross:.5,claws:.35,swirl:.4,summon:.65,chain:.45,chakram:.5,teleport:.75,rush:.85,drop:.55,moon:.6,five:.7};

/* ---------- sprite ---------- */
const PA=["...hhhhhh...","..hhhhhhhh..","..hhssssshh.","..hsesseshh.","...hssssss..","..cctttttt..",".cccttggttc.",".ccctttttttc",".cctttttttc.","..ttttttttc.","...tttttt...","...tt..tt...","...tt..tt...","..bbb..bbb..","..bbb..bbb.."];
const PB=PA.slice(0,11).concat(["....tttt....","....tttt....","...bbbbbb...","...bbbbbb..."]);
const SLIME=["....gggggg....","..gghhhhgggg..",".ghhhgggggggg.",".gggggggggggg.","gggeeggggeeggg","gggeeggggeeggg","gggggggggggggg","gggggmmmmggggg",".dggggggggggd.","..dddddddddd.."];
const PPAL={h:hex("#2a1a4a"),s:hex("#f0c8a0"),e:hex("#1a1030"),c:hex("#b02a52"),t:hex("#4a4aa8"),g:hex("#ffd24a"),b:hex("#2a2040")};
const SPAL={g:hex("#5ad66a"),h:hex("#b8ffb0"),e:hex("#143018"),m:hex("#143018"),d:hex("#2e9a48")};

/* ---------- background ---------- */
let bg;
const SPAWN=V(800,330);
const MDEF=[
 {n:'SLIME',x:950,y:310,hp:1500,sc:3,pk:'g',sp:22,glow:[90,230,110,1]},
 {n:'SLIME',x:620,y:430,hp:1500,sc:3,pk:'g',sp:22,glow:[90,230,110,1]},
 {n:'SLIME ES',x:1210,y:190,hp:1900,sc:3,pk:'b',sp:24,glow:[110,200,255,1]},
 {n:'SLIME API',x:1250,y:470,hp:2300,sc:3,pk:'r',sp:26,glow:[255,130,90,1]},
 {n:'SLIME VOID',x:380,y:210,hp:2700,sc:3,pk:'p',sp:24,glow:[190,120,255,1]},
 {n:'RAJA SLIME',x:1430,y:300,hp:6500,sc:5,pk:'k',sp:14,glow:[255,215,90,1],crown:1}];
let OBS=[],TSPR=[],RSPR=[];
function mkCv(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function blobOn(g,cx,cy,rx,ry,col){g.fillStyle=col;for(let y=-Math.floor(ry);y<=ry;y++)for(let x=-Math.floor(rx);x<=rx;x++){
  const d=x*x/(rx*rx)+y*y/(ry*ry),j=Math.sin(x*.9+y*1.3)*.12;if(d+j<1)g.fillRect(Math.floor(cx)+x,Math.floor(cy)+y,1,1);}}
function mkTree(v){const w=64,h=88,c=mkCv(w,h),g=c.getContext('2d');let sd=100+v*17;const rn=()=>{sd=(sd*16807)%2147483647;return(sd-1)/2147483646};
  const bl=(cx,cy,rx,ry,col)=>blobOn(g,cx,cy,rx,ry,col);bl(32,84,24,6,'rgba(0,0,0,.28)');
  if(v===1){g.fillStyle='#4a2f1a';g.fillRect(29,64,6,20);g.fillStyle='#6b4528';g.fillRect(29,64,2,20);g.fillStyle='#33200f';g.fillRect(34,66,1,18);
    [[54,78,25],[40,66,21],[26,52,16],[10,38,11]].forEach((t,ti)=>{for(let y=t[0];y<=t[1];y++){const k=(y-t[0])/(t[1]-t[0]),half=Math.max(1,Math.round(t[2]*(.18+.82*k))),e=Math.max(1,half>>2);
      g.fillStyle=ti%2?'#1f5a3a':'#1b4f36';g.fillRect(32-half,y,half*2,1);g.fillStyle='#2f8a52';g.fillRect(32-half,y,e,1);g.fillStyle='#143d28';g.fillRect(32+half-e,y,e,1);}});}
  else{const tr=v===2?'#cfc8b4':'#4a2f1a',hl=v===2?'#efe8d8':'#6b4528',sh=v===2?'#9a937f':'#33200f';
    g.fillStyle=tr;g.fillRect(28,46,8,38);g.fillRect(25,80,14,4);g.fillStyle=hl;g.fillRect(28,46,3,38);g.fillStyle=sh;g.fillRect(34,48,2,36);
    if(v===2){g.fillStyle='#2a2a2a';for(let y=54;y<80;y+=7)g.fillRect(29+((y*3)%4),y,3,1);}
    const cl=v===2?['#2f8a4a','#4cc070','#7fe09a','#b8ffb0']:['#1f5a3a','#2a7a48','#3a9a58','#62c77f'];
    bl(36,40,26,19,cl[0]);bl(30,34,24,17,cl[1]);bl(27,27,18,12,cl[2]);bl(22,22,8,5,cl[3]);
    g.globalCompositeOperation='source-atop';for(let i=0;i<110;i++){const x=6+rn()*52|0,y=6+rn()*54|0;g.fillStyle=rn()<.5?cl[0]:cl[3];g.fillRect(x,y,2,1);}g.globalCompositeOperation='source-over';}
  return{cv:c,ax:32,ay:84};}
function mkRock(v){const S=[[32,26,12,9],[44,34,17,13],[58,44,23,17]][v],w=S[0],h=S[1],c=mkCv(w,h),g=c.getContext('2d'),cx=w/2,cy=h-9,rx=S[2],ry=S[3];
  const bl=(x,y,a,b,col)=>blobOn(g,x,y,a,b,col);bl(cx,h-4,rx+2,4,'rgba(0,0,0,.28)');
  bl(cx,cy,rx,ry,'#4a4f78');bl(cx-1,cy-2,rx-2,ry-2,'#6a6f98');bl(cx-2,cy-4,rx-5,ry-5,'#8a8fb8');bl(cx-5,cy-6,Math.max(3,rx*.5),Math.max(2,ry*.4),'#a9aed6');bl(cx-7,cy-8,Math.max(2,rx*.25),Math.max(1,ry*.2),'#d0d4f2');
  g.fillStyle='#3a3f68';g.fillRect(cx+2,cy-3,1,4);g.fillRect(cx+3,cy+1,1,3);g.fillRect(cx-6,cy,1,3);
  bl(cx+rx*.3,cy-ry+3,Math.max(2,rx*.3),1.5,'#4cc070');bl(cx+rx*.3-1,cy-ry+2,Math.max(1,rx*.15),1,'#7fe09a');
  return{cv:c,ax:cx,ay:h-4};}
function buildBg(){const c=mkCv(WW,WH),g=c.getContext('2d');g.fillStyle='#3a7d5c';g.fillRect(0,0,WW,WH);
  let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646},rr=(a,b)=>a+(b-a)*rnd(),blob=(cx,cy,rx,ry,col)=>blobOn(g,cx,cy,rx,ry,col);
  for(let i=0;i<46;i++)blob(rr(0,WW),rr(0,WH),rr(26,60),rr(10,22),'#2f6a50');
  for(let i=0;i<30;i++)blob(rr(0,WW),rr(0,WH),rr(24,50),rr(9,18),'#448a64');
  for(let i=0;i<12;i++)blob(rr(60,WW-60),rr(80,WH-40),rr(22,38),rr(8,14),'#86684a');
  const gc=['#5fc27a','#7fe09a','#2f9a52','#4cc070'];
  for(let i=0;i<1700;i++){const x=rr(3,WW-3)|0,y=rr(6,WH-3)|0,n=2+(rnd()*2|0);for(let k=0;k<n;k++){const h=2+(rnd()*3|0);g.fillStyle=gc[(rnd()*4)|0];g.fillRect(x+k*2-2,y-h,1,h);}}
  for(let i=0;i<150;i++){const x=rr(6,WW-6)|0,y=rr(10,WH-4)|0;for(let k=-2;k<=2;k++){const h=5+((k*k+(rnd()*3|0))%4),px=(x+k*1.5)|0;g.fillStyle=k%2?'#2f9a52':'#3fb062';g.fillRect(px,y-h,1,h);g.fillStyle='#7fe09a';g.fillRect(px,y-h,1,1);}}
  const fc=['#ffd35a','#ff8ac0','#ffffff','#9ad0ff'];
  for(let i=0;i<110;i++){const x=rr(6,WW-6)|0,y=rr(10,WH-4)|0;g.fillStyle='#2f9a52';g.fillRect(x,y,1,3);g.fillStyle=fc[(rnd()*4)|0];g.fillRect(x-1,y-2,3,2);g.fillStyle='#fff6c0';g.fillRect(x,y-2,1,1);}
  for(let i=0;i<140;i++){const x=rr(4,WW-4)|0,y=rr(8,WH-4)|0;g.fillStyle='#9aa0c8';g.fillRect(x,y,2,1);g.fillStyle='#6a6f98';g.fillRect(x+1,y+1,1,1);}
  for(let i=0;i<16;i++){const x=rr(30,WW-30),y=rr(50,WH-20);blob(x+6,y+8,34,9,'#2a5f48');blob(x,y,28,14,'#2f9a52');blob(x-6,y-5,16,7,'#4cc070');}
  TSPR=[mkTree(0),mkTree(1),mkTree(2)];RSPR=[mkRock(0),mkRock(1),mkRock(2)];OBS=[];
  const zones=MDEF.map(m=>[m.x,m.y,70]).concat([[SPAWN.x,SPAWN.y,95]]),ok=(x,y,r)=>zones.every(a=>Math.hypot(x-a[0],y-a[1])>a[2]+r)&&OBS.every(o=>Math.hypot(o.x-x,o.y-y)>o.r+r+38);
  const place=(n,k)=>{let cnt=0,tr=0;while(cnt<n&&tr<600){tr++;const s=(rnd()*3)|0,r=k==='tree'?8:[10,14,18][s],x=rr(50,WW-50),y=k==='tree'?rr(110,WH-25):rr(60,WH-20);if(!ok(x,y,r))continue;OBS.push({x,y,r,k,s});cnt++;}};
  place(8,'tree');place(12,'rock');bg=c;}

buildBg();
const icons=IMGS.map(s=>{const im=new Image();im.src=s;return im;});
const stars=[];for(let i=0;i<80;i++)stars.push({x:Math.random()*W,y:Math.random()*H,p:Math.random()*6.28});

/* ---------- state ---------- */
let state='menu',tg=0,sel=0,shake=0;
let pl,mon,fx=[],parts=[],dtx=[],cd=[],cdm=[];
const keys=new Set();
let movePtr=null,moveTo=null;
function resetBattle(){
  camX=clamp(510-W/2,0,WW-W);pl={pos:V(510,230),face:1,lunge:0,mov:false,lock:0,hidden:false,jump:0,cast:0};
  mon={pos:V(770,215),hp:1500,max:1500,flash:0,alive:true,rt:0,ph:0};
  fx=[];parts=[];dtx=[];cd=[];cdm=[];
  LIST[sel].skills.forEach((_,i)=>{cd.push(0);cdm.push(.5+i*.8);});
}
resetBattle();
const cardRect=i=>[11+(i%8)*78,46+Math.floor(i/8)*126,72,118];
const skillRect=(i,n)=>[W-6-(n-i)*46,H-46,42,40];
const inR=(m,r)=>m.x>=r[0]&&m.x<=r[0]+r[2]&&m.y>=r[1]&&m.y<=r[1]+r[3];
const BACK=[6,6,64,20],START=[W-130,310,118,36];

/* ---------- input ---------- */
const KEYIDX={};
addEventListener('keydown',e=>{
  const k=e.key.length===1?e.key.toLowerCase():e.key;
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();
  keys.add(k);if(e.repeat)return;
  const go=k==='Enter'||k===' ';
  if(state==='menu'){if(go)state='select';}
  else if(state==='select'){
    if(k==='ArrowRight')sel=Math.min(sel+1,15);else if(k==='ArrowLeft')sel=Math.max(sel-1,0);
    else if(k==='ArrowDown')sel=Math.min(sel+8,15);else if(k==='ArrowUp')sel=Math.max(sel-8,0);
    else if(go){resetBattle();state='battle';}else if(k==='Escape')state='menu';}
  else if(state==='battle'){if(k==='Escape')state='select';if(k in KEYIDX)cast(KEYIDX[k]);}
});
addEventListener('keyup',e=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));
function ptr(e){const r=cv.getBoundingClientRect();return V((e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H);}


/* ---------- combat ---------- */
function cast(i){const wd=LIST[sel],sk=wd.skills[i];if(!sk||cd[i]>0||pl.lock>0)return;
  const self=['rush','teleport','drop'].includes(sk[1]),P=pal(sk[2]);
  let from=pl.pos;
  if(!wd.far&&!self&&mon.alive){const d=dist(from,mon.pos);
    if(d>wd.reach*.6&&d<wd.reach+160){const np=sub(mon.pos,mul(norm(sub(mon.pos,from)),wd.reach*.5)),old=from;
      pl.pos=V(clamp(np.x,16,WW-16),clamp(np.y,50,WH-30));from=pl.pos;
      for(let k=0;k<8;k++)parts.push({p:lerpV(old,from,k/7),v:V(0,0),l:.25,m:.25,c:P[1]});}}
  const maxR=wd.far?320:(self?260:wd.reach),dm=mon.alive?dist(from,mon.pos):1e9;let to;
  if(mon.alive&&dm<=maxR)to=V(mon.pos.x,mon.pos.y);
  else{const dv=mon.alive?norm(sub(mon.pos,from)):V(pl.face,0);to=add(from,mul(dv,wd.far?130:wd.reach));}
  pl.face=to.x>=from.x?1:-1;const dur=DUR[sk[1]]||.9;
  fx.push({t:0,dur,type:sk[1],pal:P,n:sk[3],dmg:sk[4],from:V(from.x,from.y),to,far:wd.far,self,reach:wd.reach,hit:false,moved:false,seed:Math.floor(Math.random()*1000)});
  cd[i]=cdm[i];pl.lunge=.2;pl.cast=.5;if(['rush','teleport','drop'].includes(sk[1]))pl.lock=dur;}
function spark(pos,pl2,cnt,spd){for(let i=0;i<cnt;i++){const a=Math.random()*TAU,v=V(Math.cos(a)*lerp(spd*.3,spd,Math.random()),Math.sin(a)*.8*lerp(spd*.3,spd,Math.random())),l=.3+Math.random()*.4;
  parts.push({p:V(pos.x,pos.y),v,l,m:l,c:pl2[Math.floor(Math.random()*pl2.length)]});}}
function hit(e){e.hit=true;if(!mon.alive)return;
  if(!e.far&&!e.self&&dist(e.from,mon.pos)>e.reach+16)return;
  const rad=64+(['burst','ring','swirl','summon'].includes(e.type)?e.n:0)*.8;
  if(dist(mon.pos,e.to)>rad)return;
  const dmg=Math.floor(e.dmg*(.92+Math.random()*.16));mon.hp-=dmg;mon.flash=.15;
  dtx.push({pos:add(mon.pos,V(Math.random()*20-10,-34)),txt:String(dmg),t:0,col:e.pal[1]});
  spark(add(mon.pos,V(0,-14)),e.pal,16,150);shake=Math.min(7,dmg/45);
  if(mon.hp<=0){mon.alive=false;mon.rt=2.5;spark(add(mon.pos,V(0,-14)),e.pal,50,220);}}

function update0(dt){
  for(let i=0;i<cd.length;i++)cd[i]=Math.max(0,cd[i]-dt);
  pl.lunge=Math.max(0,pl.lunge-dt);pl.cast=Math.max(0,pl.cast-dt);pl.lock=Math.max(0,pl.lock-dt);shake=Math.max(0,shake-dt*20);
  let mv=V(0,0);
  if(keys.has('a')||keys.has('ArrowLeft'))mv.x-=1;if(keys.has('d')||keys.has('ArrowRight'))mv.x+=1;
  if(keys.has('w')||keys.has('ArrowUp'))mv.y-=1;if(keys.has('s')||keys.has('ArrowDown'))mv.y+=1;
  if(moveTo&&dist(moveTo,pl.pos)>8)mv=norm(sub(moveTo,pl.pos));
  if(pl.lock>0)mv=V(0,0);
  pl.mov=mv.x!==0||mv.y!==0;
  if(pl.mov){pl.pos=add(pl.pos,mul(norm(mv),115*dt));if(Math.abs(mv.x)>.1)pl.face=mv.x>0?1:-1;}
  else if(mon.alive)pl.face=mon.pos.x>=pl.pos.x?1:-1;
  pl.pos=V(clamp(pl.pos.x,16,WW-16),clamp(pl.pos.y,50,WH-30));
  if(mon.alive){mon.ph+=dt;const np=add(mon.pos,mul(V(Math.cos(mon.ph*.7),Math.sin(mon.ph*.9)),14*dt));
    mon.pos=V(clamp(np.x,30,WW-30),clamp(np.y,50,WH-40));mon.flash=Math.max(0,mon.flash-dt);}
  else{mon.rt-=dt;if(mon.rt<=0){mon.alive=true;mon.hp=mon.max;}}
  pl.hidden=false;pl.jump=0;
  for(let i=fx.length-1;i>=0;i--){const e=fx[i];e.t+=dt;const p=e.t/e.dur,f=e.from,to=e.to,dir=norm(sub(to,f));
    if(!e.hit&&p>=(HITT[e.type]||.4))hit(e);
    if(e.type==='rush')pl.pos=lerpV(f,sub(to,mul(dir,26)),1-Math.pow(1-Math.min(1,p*1.4),2));
    else if(e.type==='teleport'){pl.hidden=p<.5;if(p>=.5&&!e.moved){e.moved=true;pl.pos=sub(to,mul(dir,34));}}
    else if(e.type==='drop'){const q=Math.min(1,p/.55);pl.pos=lerpV(f,sub(to,mul(dir,20)),q);if(p<.55)pl.jump=Math.sin(q*PI)*50;}
    if(e.t>=e.dur)fx.splice(i,1);}
  for(let i=parts.length-1;i>=0;i--){const q=parts[i];q.p=add(q.p,mul(q.v,dt));q.v=V(q.v.x*.96,q.v.y+160*dt);q.l-=dt;if(q.l<=0)parts.splice(i,1);}
  for(let i=dtx.length-1;i>=0;i--){dtx[i].t+=dt;if(dtx[i].t>.9)dtx.splice(i,1);}
}

/* ---------- efek serangan ---------- */
function burst(c,p,cols,rays,rad){if(p<=0||p>=1)return;const al=1-p,r=rad*(1-Math.pow(1-p,3));
  parc(c,r,0,TAU,[fade(cols[0],.9),cols[1%cols.length],fade(cols[0],.9)],al,.7);
  if(p<.35)gl(c,WHITE,rad*.45*(1-p/.35),.75);
  for(let i=0;i<rays;i++){const a=TAU*i/rays+.3,u=V(Math.cos(a),Math.sin(a)*.7),l1=r*(.6+.4*((i*.37)%1));
    tline(add(c,mul(u,r*.3)),add(c,mul(u,l1)),[cols[i%cols.length],WHITE],al);}}
function boltLine(top,tgt,cols,al,sd){let prev=top;for(let s=0;s<10;s++){const u=(s+1)/10,nx=lerp(top.x,tgt.x,u)+(s<9?Math.sin(sd*3+s*7)*14:0),np=V(nx,lerp(top.y,tgt.y,u));tline(prev,np,cols,al);prev=np;}}
const cpos=(o,t,pv,s,n)=>n===0?lerpV(o,t,Math.min(1,s*1.6)):add(lerpV(o,t,Math.sin(s*PI)),mul(pv,Math.sin(s*PI)*34));

function drawFx0(e){
  const tt=e.t,p=tt/e.dur,P=e.pal,A=P[0],B=P[1],C=P[2],f=add(e.from,V(0,-2)),to=e.to,n=e.n;
  const ang=angOf(sub(to,f)),dir=fromA(ang),pv=V(-dir.y,dir.x),dst=dist(f,to);
  const al=1-Math.max(0,(p-.75)/.25),sd=e.seed,up=V(0,-12);
  switch(e.type){
  case 'slash':{const head=ang-1.3+2.6*Math.min(1,p*1.7),tail=Math.max(ang-1.3,head-1.6),c0=add(add(f,mul(dir,8)),up);
    parc(c0,38,tail,head,[fade(A,.8),A,B,C,B,A],al);gl(add(c0,mul(fromA(head),38)),C,6,.35*al);
    if(p>.3)burst(add(to,up),(p-.3)/.5,P,6,26);break;}
  case 'bolts':{const cnt=Math.max(n,1);
    for(let i=0;i<cnt;i++){const q=clamp((tt-i*.07)/.4,0,1);if(q<=0)continue;
      const off=((i-(cnt-1)*.5)*9)*(1-q),base=add(f,mul(dir,14)),pos=add(add(add(base,mul(sub(sub(to,f),mul(dir,14)),q)),mul(pv,off)),up);
      for(let k=0;k<5;k++)dot(sub(pos,mul(dir,k*5)),fade(B,1-k*.18),4);
      dot(pos,C,4);dot(add(pos,mul(dir,4)),A,2);gl(pos,A,7,.25);
      burst(add(to,up),(tt-i*.07-.4)/.3,P,6,24);}break;}
  case 'streak':{const cnt=Math.max(n,1),cols=n===1?[A,B,C,B,A]:[A,C,A];
    for(let i=0;i<cnt;i++){const q=clamp((tt-i*.05)/.25,0,1);if(q<=0)continue;
      const so=mul(pv,(i-(cnt-1)*.5)*8),st=add(add(add(f,mul(dir,14)),so),up),en=add(add(to,so),up);
      const head=lerpV(st,en,q),tail=lerpV(st,en,Math.max(q-.45,0));
      tline(tail,head,cols,al);gl(head,C,5,.5*al);burst(add(to,up),(tt-i*.05-.25)/.3,P,6,22+n*2);}break;}
  case 'orb':{const cnt=Math.max(n,1);
    for(let i=0;i<cnt;i++){const q=clamp((tt-i*.12)/.5,0,1);if(q<=0)continue;const sp=(i-(cnt-1)*.5)*16;
      const at=qq=>add(add(lerpV(f,to,qq),mul(pv,Math.sin(qq*PI)*sp)),V(0,-16)),pos=at(q);
      for(let k=0;k<6;k++){const tp=at(Math.max(q-k*.03,0));dot(add(tp,V(0,Math.sin(tt*20+k)*2)),fade(A,.7-k*.1),5-k*.5);}
      gl(pos,A,10,.3);skull(pos,fade(B,al),2);burst(add(to,V(0,-14)),(tt-i*.12-.5)/.4,P,8,34);}break;}
  case 'burst':{const q=clamp(tt/.12,0,1);if(q<1)gl(add(lerpV(f,to,q),up),A,7,.7);
    const pp=(tt-.12)/(e.dur-.12);burst(add(to,V(0,-8)),pp,P,n,44+n*1.6);
    if(n>=20)burst(add(to,V(0,-8)),pp*1.2-.2,[B,A,C],Math.floor(n/2),44+n*2.2);break;}
  case 'ring':{const c0=add(to,V(0,4)),ap=Math.min(1,p*4)*al;
    parc(c0,44,0,TAU,[A,C,A],ap,.4);parc(c0,30,0,TAU,[B,B],ap*.8,.4);
    for(let i=0;i<8;i++){const a2=TAU*i/8+p*4;dot(add(c0,V(Math.cos(a2)*37,Math.sin(a2)*37*.4)),C,4);}
    if(p>.3){const q=Math.min(1,(p-.3)/.25),cnt=Math.max(n,6);
      for(let i=0;i<cnt;i++){const rr=(i*.618)%1,base=add(c0,V(Math.cos(i*2.4+sd)*rr*40,Math.sin(i*2.4+sd)*rr*13));
        const h=(26+(i*13)%22)*q*(1-Math.max(0,(p-.7)/.3));
        tline(base,add(base,V(0,-h*.5)),[A,C,A],al);tline(add(base,V(0,-h*.5)),add(base,V(0,-h)),[C],al);}}break;}
  case 'wave':{const sz=26+n*10;
    for(let k=0;k<3;k++){const pp=clamp(p*1.15-k*.07,0,1);if(pp<=0||pp>=1)continue;
      const cen=add(add(f,mul(dir,16+(dst+30)*pp)),V(0,-10));
      parc(cen,sz,ang-1,ang+1,[fade(A,.7),A,B,C,B],(1-pp)*(1-k*.25));}break;}
  case 'tide':{const wp=Math.min(1,p/.45);
    for(let xi=-70;xi<=70;xi+=2){const u=(xi+70)/140,h=64*wp*Math.pow(Math.sin(PI*u),.8)*(1+.25*Math.sin(u*9-p*14))*(1-u*.3),gx=Math.floor((to.x+xi+(p-.2)*30)/2)*2;
      for(let yy=0;yy<h;yy+=2){let col=lerpC(A,B,yy/Math.max(h,1));if(yy>=h-6)col=C;ctx.fillStyle=css(fade(col,al));ctx.fillRect(gx,to.y+6-yy,2,2);}}break;}
  case 'pillar':{parc(add(to,V(0,4)),36,0,TAU,[A,C,A],Math.min(1,p*5)*al,.35);
    const w=14*Math.sin(clamp((p-.15)/.7,0,1)*PI);
    if(p>.15){const gx=Math.floor(to.x/2)*2;
      for(let yy=Math.floor(to.y-220);yy<to.y+4;yy+=2)for(let xk=-Math.floor(w);xk<=w;xk+=2){const k=Math.abs(xk)/Math.max(w,1),col=k<.35?C:(k<.7?B:A);
        ctx.fillStyle=css(fade(col,al*(1-k*.5)));ctx.fillRect(gx+xk,yy,2,2);}
      burst(to,(p-.3)/.7,P,14,54);}break;}
  case 'lightning':{for(let b=0;b<3;b++){const tb=tt-b*.12;if(tb<0||tb>.35)continue;const bx=to.x+(b-1)*26;
      boltLine(V(bx+Math.sin(sd+b)*20,to.y-230),V(bx,to.y),[A,C,A],1-tb/.35,sd+b*5+Math.floor(tt*30));burst(V(bx,to.y),tb/.35,P,8,34);}break;}
  case 'beam':{const o=add(add(f,mul(dir,16)),up),wi=Math.floor(7*Math.sin(clamp(p*1.1,0,1)*PI))+1,cols=[];
    for(let k=-wi;k<=wi;k++){const r=Math.abs(k)/wi;cols.push(r<.35?C:(r<.7?B:A));}
    tline(o,add(o,mul(dir,360)),cols,al);gl(o,C,10,.6*al);
    for(let i=0;i<4;i++){const rp=add(o,mul(dir,60+i*70));for(let k=0;k<16;k++){const a=TAU*k/16;dot(add(rp,V(Math.cos(a)*4,Math.sin(a)*18)),fade(B,al),2);}}break;}
  case 'cross':{const c0=add(to,V(0,-14)),L=64*Math.min(1,p*3),d1=mul(norm(V(1,1)),L),d2=mul(norm(V(1,-1)),L);
    tline(sub(c0,d1),add(c0,d1),[A,B,C,B,A],al);tline(sub(c0,d2),add(c0,d2),[A,B,C,B,A],al);burst(c0,(p-.3)/.7,P,14,56);break;}
  case 'claws':{const c0=add(to,V(0,-14)),sets=n<=3?1:2;
    for(let si=0;si<sets;si++){const q=clamp((p-si*.25)*3.5,0,1);if(q<=0)continue;const sg=si===0?1:-1;
      for(let k=0;k<3;k++){const s0=add(c0,V(-36*sg+(k-1)*11,-36));tline(s0,add(s0,mul(V(72*sg,72),q)),[A,C,A],al);}}
    burst(c0,(p-.4)/.6,P,8,36);break;}
  case 'swirl':{const bx=lerp(f.x+20,to.x,Math.min(1,p*2)),by=to.y+4,gh=80*Math.min(1,p*3);
    for(let i=0;i<60;i++){const u=i/60,r=8+26*u,a3=u*14+p*22+(i%2)*PI,pos=V(bx+Math.cos(a3)*r,by-u*gh+Math.sin(a3)*r*.3),col=i%3===0?A:(i%3===1?B:C);
      dot(pos,fade(col,al),i%5===0?4:2);}
    gl(V(bx,by),A,24,.12*al);
    for(let k=0;k<n;k++){const a4=p*10+k*TAU/Math.max(n,1);chak(V(bx+Math.cos(a4)*44,by-30+Math.sin(a4)*16),fade(A,al),fade(B,al),tt*18);}
    if(p>.4)burst(add(to,V(0,-6)),(p-.4)/.6,P,10,50);break;}
  case 'summon':{const c0=add(to,V(0,6)),ap=Math.min(1,p*5)*al;
    parc(c0,42,0,TAU,[A,B,A],ap,.38);parc(c0,28,0,TAU,[B,C],ap*.7,.38);const cnt=Math.max(n,3);
    for(let i=0;i<cnt;i++){const ph=TAU*i/cnt,rise=clamp((p-.2-i*.04)*3,0,1);if(rise<=0)continue;
      const pos=add(c0,V(Math.cos(ph)*32,Math.sin(ph)*12-6-rise*22-Math.sin(tt*8+i)*2));
      for(let k=0;k<6;k++)dot(add(pos,V(Math.sin(tt*10+k+i)*3,6+k*4)),fade(A,al*(1-k/6)),4);
      gl(pos,A,9,.25*al);skull(pos,fade(C,al),2);}
    burst(add(to,V(0,-8)),(p-.65)/.35,P,12,46);break;}
  case 'chain':{const o=add(add(f,mul(dir,14)),up),t2=add(to,up),q=Math.min(1,p*3),tip=lerpV(o,t2,q),links=Math.floor(dist(o,tip)/7);
    for(let i=0;i<links;i++){const u=i/Math.max(links,1),pos=add(lerpV(o,tip,u),mul(pv,Math.sin(u*PI*2+tt*12)*6*(1-q*.5))),bx=Math.floor(pos.x/2)*2,by=Math.floor(pos.y/2)*2;
      if(i%2===0){ctx.fillStyle=css(fade(B,al));ctx.fillRect(bx-2,by,6,4);}else{ctx.fillStyle=css(fade(A,al));ctx.fillRect(bx,by-2,4,6);}}
    dot(tip,C,6);gl(tip,A,10,.4*al);
    if(n>=1){const rp=clamp((p-.3)/.4,0,1);parc(t2,34-14*rp,0,TAU,[A,C,A],al);parc(t2,24-8*rp,0,TAU,[B,B],al*.8);}
    if(n>=2){parc(add(to,V(0,4)),48,0,TAU,[A,C,A],Math.min(1,p*5)*al,.4);burst(t2,(p-.5)/.5,P,20,72);}
    else burst(t2,(p-.3)/.4,P,6,24);break;}
  case 'chakram':{const o=add(f,up),t2=add(to,up);
    for(let k=0;k<8;k++)dot(cpos(o,t2,pv,Math.max(p-k*.025,0),n),fade(B,al*(1-k/8)),4);
    chak(cpos(o,t2,pv,p,n),fade(A,al),fade(B,al),tt*18);
    if(n===0)burst(t2,(p-.62)/.3,P,8,30);else burst(t2,(p-.45)/.35,P,8,34);break;}
  case 'teleport':{if(p<.5){for(let k=0;k<3;k++){const ph=p*2-k*.25;if(ph<0||ph>.45)continue;
      const ap=mul(V(Math.cos(sd+k*2.1),Math.sin(sd+k*2.1)*.4),46);
      spr(PA,PPAL,add(to,ap),ap.x<0,[A[0]/255,A[1]/255,A[2]/255,.55*(1-ph/.45)],2);gl(add(add(to,ap),V(0,-16)),A,12,.15);}}
    else{const tb=(p-.5)/.5;for(let b=0;b<2;b++)boltLine(V(to.x+(b*2-1)*18,to.y-230),to,[A,C,A],1-tb,sd+b*5+Math.floor(tt*30));burst(to,tb,P,14,60);}break;}
  case 'rush':{const dest=sub(to,mul(dir,26)),cnt=Math.max(n,3);
    for(let i=0;i<cnt;i++){const pp=(i+1)/cnt,age=p-pp*.6;if(age<=0||age>=.35)continue;
      const cen=add(add(lerpV(f,dest,pp),V(0,-10)),mul(dir,10));parc(cen,22,ang-1,ang+1,[A,B,C,B],1-age/.35);}
    burst(add(to,V(0,-10)),(p-.75)/.25,P,8,36);break;}
  case 'drop':{if(p<.55){const pp=p/.55,pos=add(lerpV(f,sub(to,mul(dir,20)),pp),V(0,-Math.sin(pp*PI)*50-12));
      for(let k=0;k<6;k++)dot(sub(pos,mul(dir,k*4)),fade(B,1-k*.15),4);gl(pos,A,8,.4);}
    else{const q=(p-.55)/.45;burst(to,q,P,14,62);
      for(let i=0;i<7;i++){const gx=to.x+(i-3)*14,hh=(60+(i*17)%30)*Math.sin(Math.min(q*1.5,1)*PI/2)*(1-q);tline(V(gx,to.y+4),V(gx,to.y+4-hh),[A,C,A],1-q);}}break;}
  case 'moon':{const mc=add(f,V(-dir.x*10,-80)),ms=Math.min(1,p*3)*36*(1-Math.max(0,(p-.6)/.4));
    for(let yy=-Math.floor(ms);yy<=ms;yy+=2){const hw=Math.floor(Math.sqrt(Math.max(ms*ms-yy*yy,0)));
      for(let xx=-hw;xx<=hw;xx+=2){const dx=xx-ms*.35*dir.x;if(dx*dx+yy*yy<ms*ms*.7)continue;dot(add(mc,V(xx,yy)),xx*dir.x<0?B:C,2);}}
    gl(mc,A,ms*.9,.08);
    if(p>.5){const q=(p-.5)/.5;parc(add(to,up),48,ang-1.4+2.8*Math.min(1,q*2),ang-1.4,[A,B,C,B],al);burst(to,q,P,16,70);}break;}
  case 'five':{const c5=["#ff4a1a","#2f9bff","#9a6a3a","#6fe8d8","#ffe030"].map(hex),ctr=add(to,V(0,-26)),q=Math.min(1,p/.5);
    for(let i=0;i<5;i++){const a5=TAU*i/5+p*6,rr=60*(1-q)+6,op=add(ctr,V(Math.cos(a5)*rr,Math.sin(a5)*rr*.5-(1-q)*40));
      gl(op,c5[i],7,.4*al);dot(op,c5[i],6);dot(op,WHITE,2);}
    burst(ctr,(p-.5)/.5,c5,25,90);burst(ctr,(p-.58)/.42,[WHITE,hex("#ffe030"),WHITE],12,60);break;}
  }
}

/* ---------- gambar ---------- */
function sky(){ctx.fillStyle='#0a0620';ctx.fillRect(0,0,W,H);
  for(let i=0;i<6;i++){ctx.fillStyle=`rgba(64,26,128,${.05+i*.012})`;ctx.fillRect(0,i*60,W,60);}
  for(const s of stars){dot(V(s.x,s.y),[255,255,255,.4+.6*Math.abs(Math.sin(tg*1.5+s.p))],2);}}
function drawMenu(){sky();const bob=Math.sin(tg*1.6)*4;
  ctx.imageSmoothingEnabled=true;ctx.globalAlpha=.85;
  [0,4,11,12,15].forEach((i,k)=>{if(icons[i]&&icons[i].complete)ctx.drawImage(icons[i],40+k*118,210+Math.sin(tg*2+k)*6,72,118);});
  ctx.globalAlpha=1;
  txt("AETHERIA",W/2,110+bob,64,"#ffd35a",'center');txt("ECHOES OF THE FIVE ELEMENTS",W/2,140+bob,16,"#c9a6ff",'center');
  if(Math.floor(tg*2)%2===0)txt("TEKAN ENTER / SENTUH LAYAR UNTUK MULAI",W/2,190,14,"#ffffff",'center');}
function drawSelect(){sky();txt("PILIH SENJATA",W/2,32,24,"#ffd35a",'center');
  for(let i=0;i<16;i++){const r=cardRect(i).slice(),on=i===sel;if(on)r[1]-=4;
    ctx.imageSmoothingEnabled=true;
    if(icons[i]&&icons[i].complete){ctx.globalAlpha=on?1:.6;ctx.drawImage(icons[i],r[0],r[1],r[2],r[3]);ctx.globalAlpha=1;}
    else{ctx.fillStyle='#331a66';ctx.fillRect(r[0],r[1],r[2],r[3]);}
    if(on){ctx.strokeStyle=css(fade(pal(LIST[i].pal)[1],.6+.4*Math.sin(tg*6)));ctx.lineWidth=2;ctx.strokeRect(r[0]-2,r[1]-2,r[2]+4,r[3]+4);}}
  const wd=LIST[sel];let names="";wd.skills.forEach((s,i)=>names+=(i+1)+" "+s[0]+"    ");
  txt(wd.name+"  -  "+wd.elem+"  ["+(wd.far?"JARAK JAUH":"JARAK DEKAT")+"]",14,316,14,"#ffd35a");txt(names,14,338,10,"#d8c8ff");
  ctx.fillStyle='#5a2cc0';ctx.fillRect(...START);ctx.strokeStyle='#ffd35a';ctx.lineWidth=2;ctx.strokeRect(...START);
  txt("MULAI >",START[0]+START[2]/2,START[1]+24,16,"#ffffff",'center');}
function drawPlayer(){if(pl.hidden)return;const pos=pl.pos;
  ctx.fillStyle='rgba(0,0,0,.28)';ctx.fillRect(pos.x-11,pos.y-3,22,6);
  const off=V(pl.face*(pl.lunge>0?4:0),-pl.jump),bob=pl.mov?Math.abs(Math.sin(tg*12))*2:0,rows=pl.mov&&Math.floor(tg*8)%2===0?PB:PA;
  if(pl.cast>0)gl(add(add(pos,off),V(0,-16)),pal(LIST[sel].pal)[0],18+Math.sin(tg*30)*2,.2*(pl.cast/.5));
  spr(rows,PPAL,add(add(pos,off),V(0,-bob)),pl.face<0,[1,1,1,1],2);}
function drawBattle(){
  ctx.save();if(shake>0)ctx.translate(Math.random()*shake*2-shake,Math.random()*shake*2-shake);
  ctx.imageSmoothingEnabled=false;ctx.translate(-Math.round(camX),-Math.round(camY));ctx.drawImage(bg,0,0,WW,WH);
  drawEntities();
  for(const e of fx)drawFx(e);
  for(const q of parts)dot(q.p,fade(q.c,q.l/q.m+.2),q.l>.25?4:2);
  for(const d of dtx)txt(d.txt,d.pos.x-10,d.pos.y-d.t*40,14,fade(d.col,1-d.t));
  ctx.restore();drawHud();}
function drawHud(){const wd=LIST[sel],bw=220,x0=(W-bw)/2;
  ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(x0-2,10,bw+4,12);ctx.fillStyle='#e0384a';ctx.fillRect(x0,12,bw*clamp(mon.hp/mon.max,0,1),8);
  txt((mon.name||"SLIME")+"  "+Math.max(0,Math.floor(mon.hp))+" / "+mon.max,W/2,36,11,"#ffffff",'center');
  ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(...BACK);txt("< MENU",BACK[0]+BACK[2]/2,BACK[1]+14,11,"#ffffff",'center');
  txt(wd.name+" - "+wd.elem,8,46,11,"#ffd35a");
  const n=wd.skills.length,c=pal(wd.pal)[0];
  for(let i=0;i<n;i++){const r=skillRect(i,n);ctx.fillStyle='rgba(13,8,38,.85)';ctx.fillRect(...r);ctx.strokeStyle=css(c);ctx.lineWidth=2;ctx.strokeRect(...r);
    if(cd[i]>0){const hh=r[3]*(cd[i]/cdm[i]);ctx.fillStyle='rgba(0,0,0,.65)';ctx.fillRect(r[0],r[1]+r[3]-hh,r[2],hh);}
    txt(String(i+1),r[0]+r[2]/2,r[1]+14,14,"#ffffff",'center');txt(wd.skills[i][0].slice(0,7),r[0]+r[2]/2,r[1]+31,8,"#d8c8ff",'center');}
  txt("WASD/Panah: gerak   1-3 / J K L: skill   Esc: pilih senjata",8,H-8,9,"rgba(255,255,255,.8)");}

/* ===== UPGRADE v2: render HD, efek seragam, senjata asli di tangan ===== */
const WI=WIMGS.map(s=>{const i=new Image();i.src=s;return i});
icons.forEach((im,i)=>{im.src=WIMGS[i]});
let hs=0,flash=0,flashC=WHITE,decals=[];
const motes=[];for(let i=0;i<40;i++)motes.push({x:Math.random()*W,y:Math.random()*H,s:.3+Math.random(),p:Math.random()*6.28});
function fit(im,x,y,w,h,a){if(!im||!im.complete||!im.naturalWidth)return;const r=Math.min(w/im.naturalWidth,h/im.naturalHeight),dw=im.naturalWidth*r,dh=im.naturalHeight*r;
  ctx.imageSmoothingEnabled=true;ctx.globalAlpha=a==null?1:a;ctx.drawImage(im,x+(w-dw)/2,y+(h-dh)/2,dw,dh);ctx.globalAlpha=1;}
/* glow lembut (bloom) */
function gl(p,c,r,a){const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r*1.8);
  g.addColorStop(0,css(fade(c,a*1.4)));g.addColorStop(.5,css(fade(c,a*.5)));g.addColorStop(1,css(fade(c,0)));
  ctx.fillStyle=g;ctx.fillRect(p.x-r*2,p.y-r*2,r*4,r*4);}
/* garis & busur + glow seragam */
function tline(a,b,c,al){tline0(a,b,c,al);const L=dist(a,b);if(L>14)gl(lerpV(a,b,.5),c[c.length>>1],L*.3,.14*al);}
function parc(c,r,a0,a1,cols,al,sq){parc0(c,r,a0,a1,cols,al,sq);
  if(r>12&&Math.abs(a1-a0)>.3){const m=(a0+a1)/2;gl(add(c,V(Math.cos(m)*r,Math.sin(m)*r*(sq||1))),cols[cols.length>>1],r*.4,.12*al);}}
/* impak seragam: flash -> shockwave ganda -> ground ring -> sinar -> percikan */
function burst(c,p,cols,rays,rad){if(p<=0||p>=1)return;const al=1-p,e=1-Math.pow(1-p,3),r=rad*e,A=cols[0],B=cols[1%cols.length];
  if(p<.4)gl(c,WHITE,rad*.7*(1-p/.4),.9);gl(c,A,rad*.9*e,.35*al);
  parc(c,r,0,TAU,[fade(A,.8),B,WHITE,B,fade(A,.8)],al,.7);parc(c,r*.62,0,TAU,[A,B],al*.7,.7);
  parc(add(c,V(0,10)),r*1.15,0,TAU,[B],al*.5,.28);
  for(let i=0;i<rays;i++){const a=TAU*i/rays+.3,u=V(Math.cos(a),Math.sin(a)*.7),l=r*(.55+.45*((i*.37)%1));
    tline(add(c,mul(u,r*.25)),add(c,mul(u,l)),[A,WHITE],al);dot(add(c,mul(u,l*1.05)),B,3);}}
/* semua efek: rune cast seragam + blending additive */
function drawFx(e){const P=e.pal,p=e.t/e.dur,f=e.from;
  ctx.save();ctx.globalCompositeOperation='lighter';
  if(p<.5){const k=Math.sin(Math.min(1,p*2)*PI),c0=add(f,V(0,4));parc(c0,22+8*k,0,TAU,[P[0],P[2],P[0]],k*.8,.38);
    for(let i=0;i<6;i++){const a=TAU*i/6+e.t*5;dot(add(c0,V(Math.cos(a)*26,Math.sin(a)*10)),fade(P[2],k),2);}
    gl(add(f,V(0,-16)),P[0],16+6*k,.35*k);}
  drawFx0(e);ctx.restore();}
/* hit: crit, hit-stop, flash layar, knockback, bekas efek di tanah */
function hit(e){e.hit=true;if(!mon.alive)return;
  if(!e.far&&!e.self&&dist(e.from,mon.pos)>e.reach+16)return;
  const rad=64+(['burst','ring','swirl','summon'].includes(e.type)?e.n:0)*.8;if(dist(mon.pos,e.to)>rad)return;
  const crit=Math.random()<.18,big=e.dmg>=300,dmg=Math.floor(e.dmg*(.92+Math.random()*.16)*(crit?1.8:1));
  mon.hp-=dmg;mon.flash=.18;mon.kb=.2;mon.kd=Math.sign(mon.pos.x-e.from.x)||1;
  dtx.push({pos:add(mon.pos,V(Math.random()*24-12,-40)),txt:crit?dmg+'!':String(dmg),t:0,col:crit?[255,240,120,1]:e.pal[1],sz:crit?20:(big?17:14)});
  spark(add(mon.pos,V(0,-14)),e.pal,big?34:18,big?220:150);decals.push({p:V(mon.pos.x,mon.pos.y+2),c:e.pal[0],t:0});
  shake=Math.min(10,dmg/38);hs=big?.14:.06;flash=big?.5:.18;flashC=e.pal[1];
  if(mon.hp<=0){mon.alive=false;mon.rt=2.5;hs=.3;spark(add(mon.pos,V(0,-14)),e.pal,60,240);}}
function update1(dt){if(hs>0){hs-=dt;dt*=.12;}flash=Math.max(0,flash-dt*2.5);
  if(mon.kb>0){mon.kb-=dt;mon.pos.x+=mon.kd*60*dt*(mon.kb/.2);}
  if(pl.mov&&Math.random()<.35)parts.push({p:V(pl.pos.x,pl.pos.y),v:V(-pl.face*20,-10),l:.3,m:.3,c:[210,200,160,1]});
  for(const d of decals)d.t+=dt;decals=decals.filter(d=>d.t<2);update0(dt);}
/* karakter HD: tudung, jubah berwarna sesuai elemen senjata */
const fx2=a=>a.map(r=>r.padEnd(14,'.').slice(0,14));
const PA2=fx2(["....oooooo....","...ohhhhhho...","..ohhHHHhhho..","..ohssssssho..","..ohsessesho..","...osssssso...","..occoTTTocc..",".occcotttoccc.",".occCotgtoCccc",".occcotttoccc.","..occotttocc..","...ooptpoo....","....optpo.....","....opopo.....","....obobo.....","...obbobbo....","...oooooooo..."]);
const PB2=PA2.slice(0,11).concat(["..opttpo.......","..obo.opo.....","..obbo.obbo...","...oo...ooo..."]);
const _cp={};function cpal(){if(_cp[sel])return _cp[sel];const c=pal(LIST[sel].pal),d=(a,k)=>[a[0]*k,a[1]*k,a[2]*k,1];
  return _cp[sel]={o:hex("#0d0818"),h:hex("#2a1a4a"),H:hex("#4a2e7a"),s:hex("#f0c8a0"),e:hex("#1a1030"),c:d(c[0],.7),C:c[1],t:hex("#3a3a8a"),T:hex("#5a5ab8"),g:hex("#ffd24a"),p:hex("#2a2040"),b:hex("#1a1228")};}
/* senjata ASLI (art referensi) di tangan: bentuk tidak pernah berubah, hanya diayun */
function drawWeapon(pos){const im=WI[sel];if(!im.complete||!im.naturalWidth)return;const c=pal(LIST[sel].pal),act=pl.cast>0,k=act?1-pl.cast/.5:0,sw=act?Math.sin(k*PI):0,sz=38+sw*10;
  const hand=V(pos.x+pl.face*10,pos.y-16);
  ctx.save();ctx.globalCompositeOperation='lighter';gl(hand,c[0],sz*.55,.22+.4*sw);ctx.restore();
  for(let j=act?3:0;j>=0;j--){const ang=pl.face*(-.5+(act?(sw*1.5-j*.3):Math.sin(tg*2)*.08));
    ctx.save();ctx.translate(hand.x,hand.y);ctx.rotate(ang);ctx.scale(pl.face,1);ctx.globalAlpha=j?.22:1;
    const r=Math.min(sz/im.naturalWidth,sz/im.naturalHeight);ctx.imageSmoothingEnabled=true;
    ctx.drawImage(im,-im.naturalWidth*r*.5,-im.naturalHeight*r*.7,im.naturalWidth*r,im.naturalHeight*r);ctx.restore();}}
function drawPlayer(){if(pl.hidden)return;const pos=pl.pos;
  ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(pos.x,pos.y-1,13,4,0,0,TAU);ctx.fill();
  const bob=pl.mov?Math.abs(Math.sin(tg*12))*2:Math.sin(tg*3)*.8,off=V(pl.face*(pl.lunge>0?5:0),-pl.jump-bob);
  if(pl.cast>0){ctx.save();ctx.globalCompositeOperation='lighter';gl(add(pos,V(0,-18)),pal(LIST[sel].pal)[0],22,.35*(pl.cast/.5));ctx.restore();}
  spr(pl.mov&&Math.floor(tg*8)%2===0?PB2:PA2,cpal(),add(pos,off),pl.face<0,[1,1,1,1],2);drawWeapon(add(pos,off));}
function sky(){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#05030f');g.addColorStop(.6,'#1a0a3a');g.addColorStop(1,'#2a1050');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.globalCompositeOperation='lighter';gl(V(W*.25+Math.sin(tg*.3)*20,H*.4),[90,40,200,1],120,.25);gl(V(W*.75,H*.55+Math.cos(tg*.4)*14),[200,60,160,1],110,.18);ctx.restore();
  for(const s of stars)dot(V(s.x,s.y),[255,255,255,.4+.6*Math.abs(Math.sin(tg*1.5+s.p))],2);}
function drawMenu(){sky();const bob=Math.sin(tg*1.6)*4;
  [0,2,4,11,12,15].forEach((i,k)=>{const c=pal(LIST[i].pal)[0],y=196+Math.sin(tg*2+k)*6;ctx.save();ctx.globalCompositeOperation='lighter';gl(V(66+k*104,y+55),c,46,.3);ctx.restore();fit(WI[i],20+k*104,y,92,110);});
  ctx.save();ctx.globalCompositeOperation='lighter';gl(V(W/2,100+bob),[255,200,80,1],150,.18);ctx.restore();
  txt("AETHERIA",W/2,110+bob,64,"#ffd35a",'center');txt("ECHOES OF THE FIVE ELEMENTS",W/2,140+bob,16,"#c9a6ff",'center');
  if(Math.floor(tg*2)%2===0)txt("TEKAN ENTER / SENTUH LAYAR UNTUK MULAI",W/2,178,14,"#ffffff",'center');}
function drawSelect(){sky();txt("PILIH SENJATA",W/2,32,24,"#ffd35a",'center');
  for(let i=0;i<16;i++){const r=cardRect(i).slice(),on=i===sel,c=pal(LIST[i].pal);if(on)r[1]-=4;
    ctx.fillStyle='rgba(20,10,50,.85)';ctx.fillRect(...r);
    if(on){ctx.save();ctx.globalCompositeOperation='lighter';gl(V(r[0]+36,r[1]+52),c[0],40,.35+.15*Math.sin(tg*6));ctx.restore();}
    fit(WI[i],r[0]+3,r[1]+4,r[2]-6,r[3]-24,on?1:.7);
    txt(LIST[i].name.slice(0,10),r[0]+r[2]/2,r[1]+r[3]-6,8,on?'#ffd35a':'#b8a8e0','center');
    ctx.strokeStyle=on?css(fade(c[1],.6+.4*Math.sin(tg*6))):'rgba(120,80,200,.5)';ctx.lineWidth=on?2:1;ctx.strokeRect(r[0],r[1],r[2],r[3]);}
  const wd=LIST[sel];let names="";wd.skills.forEach((s,i)=>names+=(i+1)+" "+s[0]+"    ");
  txt(wd.name+"  -  "+wd.elem+"  ["+(wd.far?"JARAK JAUH":"JARAK DEKAT")+"]",14,316,14,"#ffd35a");txt(names,14,338,10,"#d8c8ff");
  ctx.fillStyle='#5a2cc0';ctx.fillRect(...START);ctx.strokeStyle='#ffd35a';ctx.lineWidth=2;ctx.strokeRect(...START);
  txt("MULAI >",START[0]+START[2]/2,START[1]+24,16,"#ffffff",'center');}
function drawBattle(){
  ctx.save();if(shake>0)ctx.translate(Math.random()*shake*2-shake,Math.random()*shake*2-shake);
  const z=1+flash*.03;ctx.translate(W/2,H/2);ctx.scale(z,z);ctx.translate(-W/2,-H/2);
  ctx.imageSmoothingEnabled=false;ctx.translate(-Math.round(camX),-Math.round(camY));ctx.drawImage(bg,0,0,WW,WH);
  const pc=pal(LIST[sel].pal),pc1=pc[1];ctx.save();ctx.globalCompositeOperation='lighter';
  for(const m of motes){const x=(m.x+Math.sin(tg*m.s+m.p)*14+tg*6*m.s)%W+camX,y=(m.y-tg*8*m.s+H*10)%H+camY;gl(V(x,y),pc1,3,.25+.2*Math.sin(tg*2+m.p));}
  for(const d of decals){const a=1-d.t/2;parc(d.p,18+d.t*10,0,TAU,[d.c],a*.5,.35);gl(d.p,d.c,16,.2*a);for(let i=0;i<7;i++){const q=i*.9+d.p.x,L=(16+(i*7)%14)*Math.min(1,d.t*5);tline0(d.p,add(d.p,V(Math.cos(q)*L,Math.sin(q)*L*.4)),[d.c],a*.6);}}ctx.restore();
  if(fx.some(e=>e.dmg>=300)){ctx.fillStyle='rgba(6,0,24,.42)';ctx.fillRect(Math.round(camX)-4,Math.round(camY)-4,W+8,H+8);}
  drawEntities();
  for(const e of fx)drawFx(e);drawMotifs();drawHitFx();
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(const q of parts){const a=q.l/q.m;dot(q.p,fade(q.c,a+.2),q.l>.25?4:2);if(a>.6)gl(q.p,q.c,5,.2*a);}ctx.restore();
  for(const d of dtx)txt(d.txt,d.pos.x-10,d.pos.y-d.t*40,d.sz||14,fade(d.col,1-d.t));
  ctx.restore();
  if(flash>0){ctx.fillStyle=css(fade(flashC,flash*.35));ctx.fillRect(0,0,W,H);}
  const g=ctx.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,W*.62);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(4,0,16,.55)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  drawHud();}
function drawHud(){const wd=LIST[sel],c=pal(wd.pal),bw=240,x0=(W-bw)/2,fr=clamp(mon.hp/mon.max,0,1);
  ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(x0-3,9,bw+6,14);
  const g=ctx.createLinearGradient(x0,0,x0+bw,0);g.addColorStop(0,'#ff4a5a');g.addColorStop(1,'#a01030');ctx.fillStyle=g;ctx.fillRect(x0,12,bw*fr,8);
  ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(x0,12,bw*fr,2);ctx.strokeStyle='#c9a6ff';ctx.lineWidth=1;ctx.strokeRect(x0-3,9,bw+6,14);
  txt((mon.name||"SLIME")+"  "+Math.max(0,Math.floor(mon.hp))+" / "+mon.max,W/2,36,11,"#ffffff",'center');
  ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(...BACK);txt("< MENU",BACK[0]+BACK[2]/2,BACK[1]+14,11,"#ffffff",'center');
  txt(wd.name+" - "+wd.elem,8,46,11,"#ffd35a");
  const n=wd.skills.length;
  for(let i=0;i<n;i++){const r=skillRect(i,n),ult=wd.skills[i][4]>=300;ctx.fillStyle='rgba(13,8,38,.88)';ctx.fillRect(...r);
    fit(WI[sel],r[0]+4,r[1]+2,r[2]-8,24,.9);ctx.strokeStyle=ult?'#ffd35a':css(c[0]);ctx.lineWidth=2;ctx.strokeRect(...r);
    if(cd[i]>0){const hh=r[3]*(cd[i]/cdm[i]);ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(r[0],r[1]+r[3]-hh,r[2],hh);txt(cd[i].toFixed(1),r[0]+r[2]/2,r[1]+20,10,"#fff",'center');}
    txt(String(i+1),r[0]+8,r[1]+12,10,"#fff");txt(wd.skills[i][0].slice(0,7),r[0]+r[2]/2,r[1]+37,8,"#d8c8ff",'center');}
  txt("WASD/Panah: gerak   1-3 / J K L: skill   Esc: pilih senjata",8,H-8,9,"rgba(255,255,255,.8)");}

/* ===== UPGRADE v3: joystick analog, Basic ATK combo 1-2-3, Skill = rantai combo, efek khas senjata ===== */
const MK={Frostfire:['flame','shard','flame'],Voidspike:'shard',Starlance:'star',Nebulash:'ring',Zenithblade:'shard',Lanternis:'skull',Fangchain:'link',Tigerclaw:'bolt',Trident:'drop','Twin Eagle':'bullet',Riftreaper:'moon','Ain Soph Aur':['flame','drop','shard','flake','bolt','star'],Sandalphon:'wing',Zadkiel:'wing',Gunbai:'flake',Camael:'flame'};
const SELF=['rush','teleport','drop'],mp=[];
let cmb=0,cmbT=0,bcd=0,skcd=0,skQ=[],lm=null,bHold=null;const joy={id:null,x:0,y:0};
const JB=V(66,H-64),JR=44,BAS={x:W-62,y:H-62,r:32},SKB={x:W-132,y:H-46,r:23};
/* serangan (dipakai Basic ATK & Skill) */
function cast(i,mult,force){const wd=LIST[sel],sk=wd.skills[i];if(!sk||(!force&&pl.lock>0))return;
  const self=SELF.includes(sk[1]),P=pal(sk[2]);let from=pl.pos;
  if(!wd.far&&!self&&mon.alive){const d=dist(from,mon.pos);
    if(d>wd.reach*.6&&d<wd.reach+160){const np=sub(mon.pos,mul(norm(sub(mon.pos,from)),wd.reach*.5)),old=from;
      pl.pos=V(clamp(np.x,16,WW-16),clamp(np.y,50,WH-30));from=pl.pos;
      for(let k=0;k<8;k++)parts.push({p:lerpV(old,from,k/7),v:V(0,0),l:.25,m:.25,c:P[1]});}}
  const maxR=wd.far?320:(self?260:wd.reach),dm=mon.alive?dist(from,mon.pos):1e9;let to;
  if(mon.alive&&dm<=maxR)to=V(mon.pos.x,mon.pos.y);
  else{const dv=mon.alive?norm(sub(mon.pos,from)):V(pl.face,0);to=add(from,mul(dv,wd.far?130:wd.reach));}
  pl.face=to.x>=from.x?1:-1;const dur=DUR[sk[1]]||.9;
  fx.push({t:0,dur,type:sk[1],pal:P,n:sk[3],dmg:sk[4]*(mult||1),from:V(from.x,from.y),to,far:wd.far,self,reach:wd.reach,hit:false,moved:false,seed:Math.floor(Math.random()*1000),w:sel,i});
  pl.lunge=.2;pl.cast=.5;if(self)pl.lock=dur;}
function basic(){if(state!=='battle'||bcd>0||pl.lock>0||skQ.length)return;const n=LIST[sel].skills.length;
  cast(cmb%n);cmb++;cmbT=1.5;bcd=.4;}
function skill(){if(state!=='battle'||skcd>0||skQ.length)return;skcd=8;skQ=LIST[sel].skills.map((_,i)=>({i,t:0}));}
/* input: analog + tombol */
function joyMove(m){const v=sub(m,JB),l=len(v),k=Math.min(1,l/JR);joy.x=k<.15?0:v.x/(l||1)*k;joy.y=k<.15?0:v.y/(l||1)*k;}
cv.addEventListener('pointerdown',e=>{e.preventDefault();const m=ptr(e);try{cv.setPointerCapture(e.pointerId)}catch(_){}
  if(state==='menu'){state='select';return;}
  if(state==='select'){for(let i=0;i<16;i++)if(inR(m,cardRect(i)))sel=i;if(inR(m,START)){resetBattle();state='battle';}return;}
  if(inR(m,BACK)){state='select';return;}
  if(dist(m,BAS)<BAS.r+10){basic();bHold=e.pointerId;return;}
  if(dist(m,SKB)<SKB.r+10){skill();return;}
  if(m.x<W*.5&&m.y>H*.35){joy.id=e.pointerId;joyMove(m);}});
cv.addEventListener('pointermove',e=>{if(e.pointerId===joy.id)joyMove(ptr(e));});
const pup=e=>{if(e.pointerId===joy.id){joy.id=null;joy.x=joy.y=0;}if(e.pointerId===bHold)bHold=null;};
cv.addEventListener('pointerup',pup);cv.addEventListener('pointercancel',pup);
addEventListener('keydown',e=>{if(state!=='battle')return;const k=e.key.length===1?e.key.toLowerCase():e.key;
  if(k==='j'||k===' ')basic();else if(k==='k'||k==='l')skill();});
/* motif khas tiap senjata */
function motif(k,p,c,s,a){const A=c[0],B=c[1],C=c[2],d=(x,y,col,z)=>dot(V(p.x+x,p.y+y),col,z||2),ca=Math.cos(a),sa=Math.sin(a);
  switch(k){
  case'flame':d(0,0,A,s);d(0,-s*.6,B,s*.7);d(0,-s*1.1,C,Math.max(2,s*.35));break;
  case'shard':for(let i=-2;i<=2;i++)d(ca*i*s*.5,sa*i*s*.5,i?B:C,i%2?2:3);break;
  case'star':d(0,0,C,s*.6);for(const[x,y]of[[1,0],[-1,0],[0,1],[0,-1]]){d(x*s,y*s,B,2);d(x*s*.5,y*s*.5,A,2);}break;
  case'ring':for(let i=0;i<8;i++){const q=TAU*i/8+a;d(Math.cos(q)*s,Math.sin(q)*s,i%2?B:A,2);}d(0,0,C,2);break;
  case'skull':skull(p,B,Math.max(1,Math.round(s/3)));break;
  case'link':ctx.fillStyle=css(B);ctx.fillRect(p.x-s,p.y-1,s*2,3);ctx.fillStyle=css(A);ctx.fillRect(p.x-1,p.y-s,3,s*2);d(0,0,C,2);break;
  case'bolt':d(0,0,C,3);d(s*.6,s*.5,B,2);d(-s*.4,s,A,2);d(s*.3,s*1.5,B,2);break;
  case'drop':d(0,0,B,s*.7);d(0,-s*.6,A,2);d(0,s*.4,C,2);break;
  case'bullet':for(let i=0;i<4;i++)d(ca*i*3,sa*i*3,i?A:C,3);break;
  case'moon':for(let i=0;i<9;i++){const q=-1.9+i*.475+a;d(Math.cos(q)*s,Math.sin(q)*s,i%3?A:B,2);}break;
  case'wing':{const f=Math.abs(Math.sin(tg*14+a))*s;d(-f,0,A,s*.8);d(f,0,A,s*.8);d(-f*.6,s*.5,B,3);d(f*.6,s*.5,B,3);d(0,0,C,2);break;}
  case'flake':for(let i=0;i<3;i++){const q=i*PI/3+a;d(Math.cos(q)*s,Math.sin(q)*s,B,2);d(-Math.cos(q)*s,-Math.sin(q)*s,B,2);}d(0,0,C,2);break;
  default:d(0,0,B,s);}}
function drawMotifs(){ctx.save();ctx.globalCompositeOperation='lighter';
  for(const q of mp){ctx.globalAlpha=clamp(q.l/q.m*1.4,0,1);motif(q.k,q.p,q.c,q.s*(.6+.4*q.l/q.m),q.a);}ctx.restore();}
function spawnMotifs(e,dt){const nm=LIST[e.w].name;let k=MK[nm];k=Array.isArray(k)?(k[e.i]||k[0]):k;
  if(nm==='Frostfire'&&e.i===2)k=Math.random()<.5?'flame':'shard';
  const c=nm==='Frostfire'?pal(k==='flame'?'fire':'ice'):e.pal,p=e.t/e.dur,ht=HITT[e.type]||.4,t=add(e.to,V(0,-14)),f=add(e.from,V(0,-14)),R=()=>Math.random()-.5;
  const add1=(pos,v,l,s)=>{if(mp.length<320)mp.push({p:pos,v,l,m:l,k,c,s,a:Math.random()*TAU});};
  if(p<ht+.1&&!e.self){const q=Math.min(1,p/ht),pos=lerpV(f,t,q);for(let i=0;i<2;i++)add1(add(pos,V(R()*12,R()*12)),V(R()*40,R()*40-10),.5,3+Math.random()*3);}
  if(e.hit&&!e.mb){e.mb=true;for(let i=0;i<16;i++){const a=TAU*i/16,v=60+Math.random()*120;add1(V(t.x,t.y),V(Math.cos(a)*v,Math.sin(a)*v*.7-30),.75,4+Math.random()*4);}}
  if(e.hit&&p<.85&&['ring','summon','pillar','tide','swirl','five','moon','lightning'].includes(e.type))
    for(let i=0;i<2;i++)add1(add(t,V(R()*90,R()*30+10)),V(R()*20,-50-Math.random()*40),.7,3+Math.random()*3);}
/* semua efek: rune poligon khas senjata + additive */
function drawFx(e){const P=e.pal,p=e.t/e.dur,f=e.from;ctx.save();ctx.globalCompositeOperation='lighter';
  if(p<.55){const k=Math.sin(Math.min(1,p*1.8)*PI),c0=add(f,V(0,4)),sd=3+(e.w%6),rot=e.t*3;
    parc0(c0,22+8*k,0,TAU,[P[0],P[2],P[0]],k*.7,.38);
    for(let i=0;i<sd;i++){const a1=rot+TAU*i/sd,a2=rot+TAU*(i+1)/sd;tline0(add(c0,V(Math.cos(a1)*30,Math.sin(a1)*12)),add(c0,V(Math.cos(a2)*30,Math.sin(a2)*12)),[P[1]],k);}
    gl(add(f,V(0,-16)),P[0],16+6*k,.35*k);}
  drawFx0(e);ctx.restore();}
/* update: combo, rantai skill, joystick, motif */

function update(dt){if(mon!==lm){lm=mon;skQ=[];cmb=0;mp.length=0;}
  bcd=Math.max(0,bcd-dt);skcd=Math.max(0,skcd-dt);if(cmbT>0){cmbT-=dt;if(cmbT<=0)cmb=0;}
  if(bHold!==null)basic();
  if(skQ.length){skQ[0].t-=dt;if(skQ[0].t<=0){const s=skQ.shift(),sk=LIST[sel].skills[s.i];cast(s.i,1.35,true);
    if(skQ.length)skQ[0].t=Math.max(.5,(DUR[sk[1]]||.9)*(SELF.includes(sk[1])?.95:.5));}}
  moveTo=Math.hypot(joy.x,joy.y)>.15?add(pl.pos,mul(V(joy.x,joy.y),60)):null;
  for(const e of fx)spawnMotifs(e,dt);
  for(let i=mp.length-1;i>=0;i--){const q=mp[i];q.p=add(q.p,mul(q.v,dt));q.v=V(q.v.x*.97,q.v.y*.97+(q.k==='flame'||q.k==='flake'?-20:50)*dt);q.l-=dt;if(q.l<=0)mp.splice(i,1);}
  update1(dt);}
/* bloom murah: downscale + upscale additive */
const bc=document.createElement('canvas');bc.width=160;bc.height=90;const bx=bc.getContext('2d');
function bloom(){const a=Math.min(.3,.04+fx.length*.1);if(a<.06)return;bx.drawImage(cv,0,0,cv.width,cv.height,0,0,160,90);
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a;ctx.imageSmoothingEnabled=true;ctx.drawImage(bc,0,0,W,H);ctx.restore();}
/* HUD baru */
function circ(b,fill,stroke,lw){ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,TAU);ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}
function drawHud(){bloom();const wd=LIST[sel],c=pal(wd.pal),bw=240,x0=(W-bw)/2,fr=clamp(mon.hp/mon.max,0,1),n=wd.skills.length;
  const u=fx.find(e=>e.dmg>=300&&e.t<1);
  if(u){const k=Math.min(1,u.t*6)*(1-Math.max(0,(u.t-.7)/.3));ctx.fillStyle='rgba(0,0,0,.8)';ctx.fillRect(0,0,W,22*k);ctx.fillRect(0,H-22*k,W,22*k);
    txt((u.nk?wd.ns:wd.skills)[u.i][0].toUpperCase(),W/2,76,22,fade(u.pal[1],k),'center');txt(wd.name,W/2,94,11,fade(WHITE,k*.8),'center');}
  ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(x0-3,9,bw+6,14);
  const g=ctx.createLinearGradient(x0,0,x0+bw,0);g.addColorStop(0,'#ff4a5a');g.addColorStop(1,'#a01030');ctx.fillStyle=g;ctx.fillRect(x0,12,bw*fr,8);
  ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(x0,12,bw*fr,2);ctx.strokeStyle='#c9a6ff';ctx.lineWidth=1;ctx.strokeRect(x0-3,9,bw+6,14);
  txt((mon.name||"SLIME")+"  "+Math.max(0,Math.floor(mon.hp))+" / "+mon.max,W/2,36,11,"#ffffff",'center');
  ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(...BACK);txt("< MENU",BACK[0]+BACK[2]/2,BACK[1]+14,11,"#ffffff",'center');
  txt(wd.name+" - "+wd.elem,8,46,11,"#ffd35a");
  if(cmb>1)txt("COMBO x"+cmb,W-10,34,14,"#ffd35a",'right');
  /* joystick analog */
  circ({x:JB.x,y:JB.y,r:JR},'rgba(30,16,70,.4)','rgba(201,166,255,.6)',2);
  circ({x:JB.x+joy.x*JR*.75,y:JB.y+joy.y*JR*.75,r:18},'rgba(201,166,255,.65)','rgba(255,255,255,.8)',2);
  /* Basic ATK */
  const nx=cmb%n;txt(wd.skills[nx][0],BAS.x,H-102,9,"#d8c8ff",'center');
  for(let i=0;i<n;i++){const px=BAS.x+(i-(n-1)/2)*10;ctx.beginPath();ctx.arc(px,H-93,3,0,TAU);ctx.fillStyle=i===nx?css(c[1]):'rgba(255,255,255,.25)';ctx.fill();}
  circ(BAS,bHold!==null?'rgba(90,44,192,.95)':'rgba(13,8,38,.88)',css(c[1]),3);fit(WI[sel],BAS.x-24,BAS.y-24,48,40,.95);txt("ATK",BAS.x,BAS.y+26,9,"#fff",'center');
  /* Skill (rantai combo) */
  circ(SKB,'rgba(13,8,38,.88)','#ffd35a',3);
  if(skcd>0){ctx.beginPath();ctx.moveTo(SKB.x,SKB.y);ctx.arc(SKB.x,SKB.y,SKB.r,-PI/2,-PI/2+TAU*(skcd/8));ctx.closePath();ctx.fillStyle='rgba(0,0,0,.7)';ctx.fill();txt(skcd.toFixed(0),SKB.x,SKB.y+5,13,"#fff",'center');}
  else txt("SKILL",SKB.x,SKB.y+4,10,"#ffd35a",'center');
  txt("Gerak: WASD/analog  J/Spasi: ATK  K: Skill  1-2-3: Jurus  Shift/E: Dash  Esc: menu",8,H-8,9,"rgba(255,255,255,.7)");}

/* ---------- loop ---------- */
let last=performance.now();
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;tg+=dt;
  ctx.setTransform(SC,0,0,SC,0,0);ctx.clearRect(0,0,W,H);
  if(state==='battle')update(dt);
  if(state==='menu')drawMenu();else if(state==='select')drawSelect();else drawBattle();drawSnd();selSnd();drawWorldHud();
  requestAnimationFrame(loop);}
requestAnimationFrame(loop);

/* ===== UPGRADE v4: Jurus 1-2-3 (16 senjata) + visual Basic ATK high quality. Gameplay lama tidak diubah ===== */
PALH.five=["#ff4a1a","#2f9bff","#ffe030"];
const E5=['#ff4a1a','#2f9bff','#b08040','#6fe8d8','#ffe030'];
const hr=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const Z=(k,s,d,p)=>({k,s,d,...p});
let hitfx=[],lmN=null;const ncd=[0,0,0],ncm=[1.2,2.6,6],NB=[V(W-136,H-136),V(W-86,H-136),V(W-36,H-136)],NR=20;
function hd(sh,p,c,z,a){gl(p,c[0],z*2.4,.45);if(sh==='orb'){dot(p,c[0],z);dot(p,c[1],z*.7);dot(p,c[2],Math.max(2,z*.4));}else motif(sh,p,c,z,a);}
const NSD=[
[["Frostbite Punch","ice",150,.32,[Z('proj',0,.9,{sh:'shard',z:7,fd:.3,rad:36,rays:10,tr:8})]],
 ["Infernal Counter","fireice",240,.45,[Z('proj',0,1,{sh:'ring',z:10,fd:.42,rad:44,c:'fire',arc:16,tr:9}),Z('proj',.1,1,{sh:'ring',z:8,fd:.42,rad:40,c:'ice',arc:-12,tr:9})]],
 ["Eternal Twin Impact","fireice",380,1.0,[Z('orbs',.4,.65,{n:2,cl:['#ff7a1a','#7ad8ff'],at:'f',R:22,h:-14,sq:.5,spin:10,z:5,ramp:.15,mg:.15}),Z('burst',.95,.9,{r:100,rays:16,c:'ice',at:1,tl:0}),Z('burst',1.02,.9,{r:68,rays:12,c:'fire',at:1,tl:0})]]],
[["Crystal Pierce","void",160,.26,[Z('proj',0,.9,{sh:'shard',z:8,fd:.22,rad:30,rays:12,tr:10}),Z('burst',.22,.7,{r:36,rays:6,cr:6,tl:0})]],
 ["Shattered Prism","void",240,.85,[Z('orbit',0,1.6,{n:5,sh:'shard',z:6,o:.55,iv:.09,fd:.28})]],
 ["Astral Crystal Rupture","void",380,.85,[Z('rain',.5,.7,{n:1,sh:'shard',z:16,w:0,h:0,rad:40,rays:12}),Z('burst',.78,1,{r:112,rays:16,cr:10,tl:0})]]],
[["Starfall Thrust","cosmic",160,.24,[Z('proj',0,.9,{sh:'star',z:8,fd:.2,rad:32,rays:12,tr:12})]],
 ["Celestial Orbit","cosmic",250,.9,[Z('orbit',0,1.7,{n:6,sh:'star',z:6,o:.55,iv:.08,fd:.3})]],
 ["Supernova Lance","cosmic",390,1.45,[Z('orbs',.45,.5,{n:1,cl:['#ffd35a'],at:'f',fw:16,h:-16,sq:.4,R:1,spin:0,z:8,ramp:.2}),Z('rain',.8,1.1,{n:14,iv:.06,sh:'flame',z:7,w:150,h:70,rad:24}),Z('burst',1.45,.9,{r:112,rays:18,tl:0})]]],
[["Void Spiral","nebula",160,.3,[Z('proj',0,.9,{sh:'ring',z:9,fd:.3,rad:28,tr:8}),Z('proj',.5,.6,{sh:'ring',z:9,fd:.3,rev:1,noimp:1,tr:8})]],
 ["Abyssal Return","nebula",250,.95,[Z('proj',0,.4,{sh:'ring',z:8,fd:.25,noimp:1}),Z('vortex',.1,1.1,{r:56,arms:3})]],
 ["Event Horizon","nebula",390,1.7,[Z('vortex',.5,1.6,{r:112,arms:5,dark:1,rays:20})]]],
[["Radiant Slash","holy",170,.4,[Z('wave',0,.75,{sz:34})]],
 ["Chaos Crescent","shadow",250,.55,[Z('wave',0,.8,{sz:28,c:'void',da:-.45,oy:-18}),Z('wave',.12,.8,{sz:28,c:'holy',da:.45,oy:18}),Z('burst',.5,.6,{r:50,rays:10,c:'holy',tl:0})]],
 ["Zenith Judgment","shadow",390,1.05,[Z('wave',.5,.9,{sz:84,c:'void',big:1}),Z('wave',.58,.9,{sz:60,c:'holy',big:1}),Z('burst',1.0,.9,{r:104,rays:16,c:'holy',tl:0})]]],
[["Wraith Flame","soul",160,.38,[Z('proj',0,.9,{sh:'flame',z:8,fd:.36,rad:32,tr:10})]],
 ["Soulbound Lantern","soul",250,.95,[Z('orbit',0,1.7,{n:4,sh:'flame',z:7,o:.55,iv:.12,fd:.3})]],
 ["Eternal Haunting","soul",390,1.6,[Z('vortex',.5,1.5,{r:104,arms:4,mo:'skull',rays:18})]]],
[["Fang Lash","gamma",160,.3,[Z('whip',0,.8,{ln:170})]],
 ["Predator Bind","gamma",240,.6,[Z('whip',0,.55,{ln:170}),Z('bind',.3,1,{})]],
 ["Devourer's Chain","gamma",390,1.0,[Z('whip',.5,.8,{da:-.5,ln:170}),Z('whip',.65,.8,{da:.5,ln:170}),Z('whip',.8,.8,{ln:170}),Z('burst',.95,.8,{r:60,rays:8,tl:0}),Z('burst',1.15,.8,{r:84,rays:12,tl:0}),Z('burst',1.35,.8,{r:112,rays:18,tl:0})]]],
[["Thunder Claw","volt",170,.25,[Z('claw',0,.4,{n:1})]],
 ["Volt Pounce","volt",250,.22,[Z('proj',0,.6,{sh:'bolt',z:8,fd:.16,n:3,iv:.03,cv:7,rad:44,rays:12,tr:10}),Z('burst',.2,.7,{r:58,rays:10,tl:0})]],
 ["Thunderous Rampage","volt",390,1.3,[Z('claw',.5,.9,{n:6,iv:.1}),Z('rain',1.0,.5,{n:1,sh:'zap',w:0,h:0,rad:64,rays:10}),Z('burst',1.28,.9,{r:96,rays:14,tl:0})]]],
[["Tidal Pierce","tsunami",160,.24,[Z('proj',0,.9,{sh:'shard',z:8,fd:.22,rad:36,rays:10,tr:10})]],
 ["Abyssal Surge","tsunami",250,.55,[Z('burst',0,.5,{r:36,rays:6,at:1,tl:.15}),Z('wave',.1,.9,{sz:46})]],
 ["Leviathan's Wrath","tsunami",390,1.35,[Z('burst',.45,.7,{r:72,rays:8,at:1,tl:.2}),Z('wave',.9,.9,{sz:98,big:1}),Z('wave',1.0,.9,{sz:70,c:'frost',big:1})]]],
[["Twin Burst","vibra",170,.35,[Z('proj',0,1.2,{sh:'bullet',z:4,n:6,iv:.07,fd:.22,cv:5,rad:20,rays:5,tr:6})]],
 ["Resonance Shot","vibra",250,.78,[Z('orbs',0,.45,{n:2,cl:['#ffc83a','#8a3cff'],at:'f',fw:12,h:-10,R:10,sq:.5,spin:14,z:4,ramp:.25,mg:.15}),Z('proj',.45,1,{sh:'orb',z:11,fd:.3,rad:56,rays:14,tr:10})]],
 ["Eagle's Overdrive","vibra",390,1.45,[Z('proj',.55,1.6,{sh:'bullet',z:4,n:14,iv:.05,fd:.25,cv:14,rad:22,rays:5,tr:8}),Z('burst',1.45,.9,{r:112,rays:18,tl:0})]]],
[["Crescent Reap","lunar",170,.4,[Z('wave',0,.75,{sz:36})]],
 ["Lunar Rift","lunar",250,.72,[Z('portal',0,.6,{}),Z('wave',.35,.8,{sz:40,ox:44})]],
 ["Eclipse Execution","lunar",390,1.4,[Z('eclipse',.1,1.5,{}),Z('wave',.9,.9,{sz:102,big:1}),Z('burst',1.35,.9,{r:112,rays:18,tl:0})]]],
[["Elemental Convergence","holy",200,1.2,[Z('orbs',0,.95,{n:5,cl:E5,at:'f',fw:34,h:-12,R:18,sq:.55,spin:8,z:3,ramp:.45,mg:.3}),Z('proj',.9,1,{sh:'orb',z:12,fd:.3,rad:50,rays:12,tr:10}),Z('burst',1.2,.9,{r:62,rays:10,c:'five',tl:0})]],
 ["Primal Ascension","holy",250,1.0,[Z('orbs',0,1.05,{n:5,cl:E5,at:'f',h:-52,R:30,sq:1,fix:1,z:3,ramp:.45}),Z('wave',.6,.8,{sz:30,c:'fire'}),Z('proj',.72,.9,{sh:'shard',z:8,fd:.3,rad:36,c:'tsunami',tr:9}),Z('rain',.84,.7,{n:7,iv:.06,sh:'shard',z:6,w:80,h:30,rad:24,c:'earth'}),Z('rain',.96,.7,{n:5,iv:.07,sh:'zap',w:70,h:30,rad:22,c:'elec'}),Z('vortex',1.08,1,{r:46,arms:2,c:'wind'})]],
 ["Ain Soph Revelation","holy",400,1.55,[Z('orbs',.3,1.3,{n:5,cl:E5,at:'t',h:-34,R:62,sq:.5,spin:5,acc:10,z:5,ramp:.5,mg:.3}),Z('burst',1.55,1,{r:122,rays:24,c:'five',tl:0}),Z('burst',1.62,.9,{r:80,rays:12,c:'holy',tl:0})]]],
[["Holy Severance","holy",170,.38,[Z('wave',0,.75,{sz:38})]],
 ["Seraphic Radiance","holy",250,.85,[Z('orbit',0,1.6,{n:7,sh:'shard',z:7,o:.5,iv:.07,fd:.28,R:28})]],
 ["Divine Exaltation","holy",390,1.5,[Z('rain',.5,1.3,{n:14,iv:.07,sh:'shard',z:8,w:150,h:60,rad:26}),Z('burst',1.5,.9,{r:120,rays:20,pil:1,tl:0})]]],
[["Phantom Touch","phantom",160,.42,[Z('proj',0,.9,{sh:'wing',z:6,fd:.4,rad:30,tr:8,arc:10})]],
 ["Spectral Swarm","phantom",250,.9,[Z('orbit',0,1.6,{n:8,sh:'wing',z:5,o:.5,iv:.06,fd:.32,R:30})]],
 ["Butterfly Requiem","phantom",390,1.8,[Z('orbit',.4,1.6,{n:20,sh:'wing',z:4,o:.65,iv:.02,fd:.3,R:38}),Z('burst',1.75,.9,{r:112,rays:16,tl:0})]]],
[["Frostwind Slash","frost",170,.4,[Z('wave',0,.75,{sz:36})]],
 ["Glacial Tempest","frost",250,.7,[Z('proj',0,1,{sh:'flake',z:11,fd:.55,rad:48,rays:10,tr:14}),Z('vortex',.3,.9,{r:44,arms:2,rays:8})]],
 ["Blizzard Dominion","frost",390,1.6,[Z('rain',.5,1.4,{n:24,iv:.05,sh:'flake',z:6,w:170,h:70,rad:22}),Z('vortex',.5,1.5,{r:104,arms:3,rays:18})]]],
[["Inferno Cleave","pyro",170,.4,[Z('wave',0,.7,{sz:36}),Z('burst',.38,.7,{r:42,rays:8,cr:5,tl:0})]],
 ["Hellfire Breaker","pyro",250,.45,[Z('burst',.1,1,{r:86,rays:10,cr:10,tl:.3})]],
 ["Apocalypse Ignition","pyro",390,1.4,[Z('burst',.45,.9,{r:112,rays:14,at:1,tl:.1}),Z('wave',.9,.9,{sz:92,big:1}),Z('burst',1.3,.9,{r:96,rays:16,pil:1,tl:.1})]]]
];
NSD.forEach((w,k)=>{LIST[k].ns=w.map((s,i)=>{const ty='N'+k+i,dur=Math.max(...s[4].map(q=>q.s+q.d))+.12;DUR[ty]=dur;HITT[ty]=s[3]/dur;return[s[0],ty,s[1],0,s[2]];});LIST[k].nst=w.map(s=>s[4]);});
LIST[9].wg=LIST[12].wg=true;
/* ---------- efek jurus ---------- */
const KD={
proj(e,s,x,c){const P=c.P,{f,t,pv,ang}=c,n=s.n||1,fd=s.fd||.35,A=s.rev?t:f,B=s.rev?f:t,tr=s.tr||6;
 for(let i=0;i<n;i++){const ti=x-i*(s.iv||.07);if(ti<0)continue;const u=ti/fd,
  at=q=>add(add(lerpV(A,B,q),mul(pv,(s.cv||0)*(i-(n-1)/2)*Math.sin(q*PI))),V(0,-(s.arc||0)*Math.sin(q*PI)*(i%2?-1:1)));
  if(u<1){const pos=at(u);for(let k=1;k<=tr;k++)dot(at(Math.max(0,u-k*.05)),fade(P[1],1-k/(tr+1)),Math.max(2,s.z*.55-k*.4));hd(s.sh,pos,P,s.z||6,ang+(s.rev?PI:0));}
  else if(!s.noimp)burst(B,(ti-fd)/(s.bd||.45),P,s.rays||8,s.rad||28);}},
orbit(e,s,x,c){const P=c.P,{f,t}=c,n=s.n||5,R=s.R||24,o=s.o||.5,iv=s.iv||.07,fd=s.fd||.3,ce=add(f,V(0,-6));
 const op=(i,xx)=>{const a=TAU*i/n+xx*(8+xx*9),r=R*(.5+Math.min(1,xx/o)*.7);return V(ce.x+Math.cos(a)*r,ce.y+Math.sin(a)*r*.5-Math.min(1,xx/o)*8);};
 if(x<o+.2)parc(add(ce,V(0,14)),R*1.2,0,TAU,[P[0],P[2],P[0]],Math.min(1,x/.2)*(x>o?1-(x-o)/.2:1)*.7,.35);
 for(let i=0;i<n;i++){const tl=x-o-i*iv;let pos,a=TAU*i/n+x*10;
  if(tl<0)pos=op(i,x);
  else{const u=tl/fd,p0=op(i,o+i*iv);if(u>=1){burst(t,(tl-fd)/.4,P,5,s.rad||22);continue;}
   const ez=q=>1-Math.pow(1-q,2);pos=lerpV(p0,t,ez(u));for(let k=1;k<5;k++)dot(lerpV(p0,t,ez(Math.max(0,u-k*.06))),fade(P[1],1-k*.2),3);a=angOf(sub(t,p0));}
  hd(s.sh,pos,P,s.z||5,a);}},
wave(e,s,x,c){const P=c.P,{f,ang,pv}=c,q=x/s.d,sz=s.sz||30,a=ang+(s.da||0),dr=fromA(a),dst=dist(f,c.t);
 for(let k=0;k<4;k++){const pp=clamp(q*1.1-k*.06,0,1);if(pp<=0||pp>=1)continue;const cen=add(add(f,mul(dr,(s.ox||14)+(dst+50)*pp)),mul(pv,s.oy||0));
  parc(cen,sz*(1+k*.04),a-1,a+1,[fade(P[0],.7),P[0],P[1],P[2],P[1]],(1-pp)*(1-k*.22));
  if(k===0){gl(cen,P[0],sz*.8,.35*(1-pp));if(s.big)parc(cen,sz*.55,a-.9,a+.9,[P[1],P[2]],(1-pp)*.8);
   for(let j=0;j<2;j++){const ra=a+(hr(Math.floor(x*60)+j*7)-.5)*2;dot(add(cen,mul(fromA(ra),sz)),P[2],3);}}}
 if(q>.78)burst(c.t,(q-.78)/.22,P,s.big?14:8,s.big?60:34);},
burst(e,s,x,c){const P=c.P,o=s.at?add(e.from,V(0,-14)):c.t,g0=add(o,V(0,18)),r=s.r||60,tl=s.tl??.35;
 if(x<tl){const k=x/tl;parc(g0,r*.9,x*3,x*3+TAU,[P[0],P[2],P[0]],.4+.5*k,.4);parc(g0,r*.6*k,0,TAU,[P[1]],.7,.4);
  for(let i=0;i<8;i++){const a=TAU*i/8-x*6,rr=r*(1-k);dot(add(g0,V(Math.cos(a)*rr,Math.sin(a)*rr*.4)),P[2],3);}return;}
 const y=x-tl;burst(o,y/.6,P,s.rays||10,r);
 if(s.cr)for(let i=0;i<s.cr;i++){const a=hr(i*3.1)*TAU,d=hr(i*7.7+1)*r*.9,b=add(g0,V(Math.cos(a)*d,Math.sin(a)*d*.4)),h=(22+hr(i)*30)*Math.min(1,y/.15)*(1-Math.max(0,(y-.35)/.4));
  tline(b,add(b,V(0,-h)),[P[0],P[2],P[0]],1-Math.max(0,(y-.3)/.45));}
 if(s.pil&&y<.6){const w=12*Math.sin(Math.min(1,y/.6)*PI),gx=Math.floor(o.x/2)*2;
  for(let yy=Math.floor(o.y-230);yy<o.y+18;yy+=2)for(let xk=-Math.floor(w);xk<=w;xk+=2){const k=Math.abs(xk)/Math.max(w,1);dot(V(gx+xk,yy),fade(k<.35?P[2]:k<.7?P[1]:P[0],1-k*.5),2);}}},
vortex(e,s,x,c){const P=c.P,o=add(e.to,V(0,6)),R=s.r||56,fin=.45,main=s.d-fin,arms=s.arms||3;
 if(x<main){const k=Math.min(1,x/.3),sh=1-.35*x/main;
  for(let ar=0;ar<arms;ar++)for(let i=0;i<26;i++){const u=i/26,a=u*9+x*(12+ar)+ar*TAU/arms,rr=R*k*(.12+u*.88)*sh;dot(V(o.x+Math.cos(a)*rr,o.y+Math.sin(a)*rr*.42-u*14),fade(P[(i+ar)%3],.9-u*.4),i%4===0?4:2);}
  parc(o,R*k*sh,0,TAU,[P[0],P[2],P[0]],.6,.42);
  if(s.dark){ctx.save();ctx.globalCompositeOperation='source-over';ctx.fillStyle='#05020c';ctx.beginPath();ctx.ellipse(o.x,o.y-4,R*.3*k,R*.3*k*.42,0,0,TAU);ctx.fill();ctx.restore();parc(add(o,V(0,-4)),R*.3*k,0,TAU,[P[1],P[2]],.9,.42);}
  else gl(o,P[0],R*.4*k,.35);
  if(s.mo)for(let i=0;i<5;i++){const a=x*5+i*1.257,rr=R*(1-x/main*.7);motif(s.mo,V(o.x+Math.cos(a)*rr,o.y-18+Math.sin(a)*rr*.4),P,5,a);}}
 else burst(add(o,V(0,-10)),(x-main)/fin,P,s.rays||14,R*1.15);},
rain(e,s,x,c){const P=c.P,t=c.t,n=s.n||8,fall=.28;
 for(let i=0;i<n;i++){const ti=x-i*(s.iv||.06);if(ti<-.2)continue;const L=V(t.x+(hr(i*1.7)-.5)*(s.w||90),t.y+4+(hr(i*2.9)-.5)*(s.h||40)),u=ti/fall;
  if(u<0){parc(L,10,0,TAU,[P[1]],.3+.4*(1+ti/.2),.4);continue;}
  if(u<1){const top=V(L.x+50,L.y-190),pos=lerpV(top,L,u*.5+u*u*.5),dd=norm(sub(L,top));
   if(s.sh==='zap')boltLine(V(L.x,-10),L,[P[0],P[2],P[0]],u,i*5+Math.floor(x*30));
   else{for(let k=1;k<7;k++)dot(sub(pos,mul(dd,k*6)),fade(P[1],1-k*.14),Math.max(2,(s.z||6)*.6-k*.5));hd(s.sh||'orb',pos,P,s.z||6,angOf(dd));}}
  else burst(L,(ti-fall)/.4,P,s.rays||5,s.rad||24);}},
whip(e,s,x,c){const P=c.P,f=c.f,a=c.ang+(s.da||0),dr=fromA(a),pv=V(-dr.y,dr.x),tip0=add(f,mul(dr,Math.min(dist(f,c.t),s.ln||170))),d=s.d,
  q=x<d*.4?x/(d*.4):1-Math.max(0,(x-d*.6)/(d*.4)),tip=lerpV(f,tip0,clamp(q,0,1)),links=Math.floor(dist(f,tip)/7);
 for(let i=0;i<links;i++){const u=i/Math.max(links,1),pos=add(lerpV(f,tip,u),mul(pv,Math.sin(u*PI*2+x*14)*7*(1-u*.4))),bx=Math.floor(pos.x/2)*2,by=Math.floor(pos.y/2)*2;
  ctx.fillStyle=css(i%2?P[1]:P[0]);if(i%2)ctx.fillRect(bx-2,by,6,4);else ctx.fillRect(bx,by-2,4,6);}
 dot(tip,P[2],6);gl(tip,P[0],12,.5);if(x>d*.3&&x<d*.6)burst(tip0,(x-d*.3)/(d*.3),P,s.rays||8,s.rad||30);},
claw(e,s,x,c){const P=c.P,t=c.t,n=s.n||1;
 for(let i=0;i<n;i++){const ti=x-i*(s.iv||.09);if(ti<0||ti>.3)continue;const o=add(t,V((hr(i*3.3)-.5)*(n>1?70:8),(hr(i*5.1)-.5)*(n>1?40:6))),q=Math.min(1,ti/.1),sg=i%2?-1:1;
  for(let k=0;k<3;k++){const s0=add(o,V(-30*sg+(k-1)*10,-34));tline(s0,add(s0,V(60*sg*q,66*q)),[P[0],P[2],P[0]],1-ti/.3);}
  if(ti>.05&&ti<.3)burst(o,(ti-.05)/.25,P,6,26);}},
bind(e,s,x,c){const P=c.P,t=c.t,k=Math.min(1,x/.2)*(1-Math.max(0,(x-(s.d-.2))/.2));
 for(let j=0;j<3;j++){const a=x*(j%2?6:-6)+j*2;parc(add(t,V(0,6-j*9)),20+j*3,a,a+TAU*.8,[P[j%2?1:0],P[2]],k,.4);}
 for(let i=0;i<3;i++)dot(add(t,V(Math.cos(x*9+i*2.1)*20,-8+Math.sin(x*9+i*2.1)*8)),P[2],3);gl(t,P[0],26,.25*k);},
orbs(e,s,x,c){const{f,t,dir}=c,n=s.n||5,cl=s.cl.map(hex),ctr=add(s.at==='t'?t:f,V(s.at==='t'?0:dir.x*(s.fw||0),s.h||0)),k=Math.min(1,x/(s.ramp||.4)),sq=s.sq||.5,R=s.R||20,mg=s.mg||0,m=mg?clamp((x-(s.d-mg))/mg,0,1):0;
 for(let i=0;i<n;i++){const a=s.fix?TAU*i/n-PI/2:TAU*i/n+x*(s.spin||8)+(s.acc||0)*x*x*.5,bk=V(f.x-dir.x*8+(i-2)*3,f.y+(i-2)*2),op=V(ctr.x+Math.cos(a)*R,ctr.y+Math.sin(a)*R*sq);
  let pos=lerpV(bk,op,1-Math.pow(1-k,2));pos=lerpV(pos,ctr,m);const c0=cl[i%cl.length];gl(pos,c0,s.z*2.6,.55);dot(pos,c0,s.z*1.4);dot(pos,WHITE,Math.max(2,s.z*.6));}
 if(m>.5)gl(ctr,WHITE,14*m,.6);},
eclipse(e,s,x,c){const P=c.P,k=Math.min(1,x/.4)*(1-Math.max(0,(x-(s.d-.3))/.3)),o=V(c.f.x-c.dir.x*8,c.f.y-62),r=24*k;
 gl(o,P[0],r*2.4,.6);for(let i=0;i<20;i++){const a=TAU*i/20+x*2;tline0(add(o,V(Math.cos(a)*r*1.1,Math.sin(a)*r*1.1)),add(o,V(Math.cos(a)*r*1.7,Math.sin(a)*r*1.7)),[P[1]],k*.7);}
 ctx.save();ctx.globalCompositeOperation='source-over';ctx.fillStyle='#06020e';ctx.beginPath();ctx.arc(o.x,o.y,r,0,TAU);ctx.fill();ctx.restore();parc(o,r,0,TAU,[P[1],P[2]],k,1);},
portal(e,s,x,c){const P=c.P,k=Math.sin(Math.min(1,x/s.d)*PI),o=add(c.f,mul(c.dir,46)),a=c.ang;gl(o,P[0],24*k,.5);
 parc(o,20*k,a+PI-1.3,a+PI+1.3,[P[0],P[1],P[2]],k,1);parc(o,13*k,a+PI-1.1,a+PI+1.1,[P[2]],k*.8,1);}
};
function aura(e,f,k){const P=e.pal,c0=add(e.from,V(0,4)),rot=e.t*4;parc(c0,26+10*k,0,TAU,[P[0],P[2],P[0]],.8,.4);parc(c0,40*k,0,TAU,[P[1]],.6,.4);
 for(let i=0;i<5;i++){const a1=rot+TAU*i*2/5,a2=rot+TAU*(i*2+2)/5;tline0(add(c0,V(Math.cos(a1)*34,Math.sin(a1)*13)),add(c0,V(Math.cos(a2)*34,Math.sin(a2)*13)),[P[1]],.8*k);}
 for(let i=0;i<14;i++){const a=hr(i)*TAU+e.t*3,r=70*(1-((e.t*1.6+hr(i*2))%1));dot(add(f,V(Math.cos(a)*r,Math.sin(a)*r*.5)),P[2],2);}
 gl(f,P[0],24+18*k,.5*k);
 if(e.wg)for(const sd of[-1,1])for(let i=0;i<5;i++)tline(add(f,V(sd*5,-6-i)),add(f,V(sd*(16+i*8)*k,-12-i*7*k)),[P[1],P[2]],k);}
const _dfx=drawFx;
drawFx=function(e){if(!e.nk)return _dfx(e);const P=e.pal,f=add(e.from,V(0,-14)),t=add(e.to,V(0,-14)),ang=angOf(sub(t,f)),dir=fromA(ang);
 ctx.save();ctx.globalCompositeOperation='lighter';
 if(e.dmg>=300&&e.t<.6)aura(e,f,Math.sin(Math.min(1,e.t/.6)*PI*.5));
 else if(e.t<.3){const k=Math.sin(e.t/.3*PI);parc(add(e.from,V(0,4)),22+8*k,0,TAU,[P[0],P[2],P[0]],k*.7,.38);gl(f,P[0],16+6*k,.35*k);}
 const cx={P,f,t,ang,dir,pv:V(-dir.y,dir.x)};
 for(const s of e.nk){const x=e.t-s.s;if(x<0||x>s.d)continue;cx.P=s.c?pal(s.c):P;KD[s.k](e,s,x,cx);}
 ctx.restore();};
/* ---------- cast jurus baru (memakai mesin cast/hit yang sama) ---------- */
function castN(i){if(state!=='battle'||pl.lock>0||ncd[i]>0||skQ.length)return;const wd=LIST[sel],o=wd.skills;wd.skills=wd.ns;cast(i,1,true);wd.skills=o;
 const e=fx[fx.length-1];if(e&&e.i===i&&!e.nk){e.nk=wd.nst[i];e.wg=wd.wg;ncd[i]=ncm[i];}}
cv.addEventListener('pointerdown',e=>{if(state!=='battle')return;const m=ptr(e);for(let i=0;i<3;i++)if(dist(m,NB[i])<NR+6)castN(i);});
addEventListener('keydown',e=>{if(state==='battle'&&!e.repeat&&e.key.length===1&&'123'.includes(e.key))castN(+e.key-1);});
/* ---------- peningkatan visual semua serangan (Basic ATK & Skill lama) ---------- */
const _hit=hit;hit=function(e){const hp=mon.hp,al=mon.alive;_hit(e);if(al&&mon.hp<hp)hitfx.push({p:add(mon.pos,V(0,-16)),P:e.pal,t:0,big:e.dmg>=300,a:Math.random()*PI});};
function drawHitFx(){ctx.save();ctx.globalCompositeOperation='lighter';
 for(const h of hitfx){const k=h.t/.35,al=1-k,L=(h.big?64:40)*(1-Math.pow(1-Math.min(1,k*3),3)),P=h.P,m=h.big?3:2;
  gl(h.p,P[1],L*.8,.5*al);for(let j=0;j<m;j++){const a=h.a+j*PI/m,d=V(Math.cos(a)*L,Math.sin(a)*L*.7);tline(sub(h.p,d),add(h.p,d),[P[0],WHITE,P[0]],al);}
  parc(h.p,L*.8,0,TAU,[P[1],WHITE],al*.8,.7);}
 ctx.restore();}
const _upd=update;update=function(dt){if(mon!==lmN){lmN=mon;ncd.fill(0);hitfx=[];}
 for(let i=0;i<3;i++)ncd[i]=Math.max(0,ncd[i]-dt);for(const h of hitfx)h.t+=dt;hitfx=hitfx.filter(h=>h.t<.35);_upd(dt);};
const _sm=spawnMotifs;
spawnMotifs=function(e,dt){
 if(e.nk){if(e.t<2.6&&Math.random()<.7){const q=e.hit?e.to:lerpV(e.from,e.to,Math.random()),a=Math.random()*TAU,sp=e.hit?70:40;
   parts.push({p:V(q.x+Math.cos(a)*8,q.y-14+Math.sin(a)*8),v:V(Math.cos(a)*sp,Math.sin(a)*sp-(e.hit?60:20)),l:.5,m:.5,c:e.pal[Math.random()<.5?1:2]});}return;}
 _sm(e,dt);const p=e.t/e.dur,ht=HITT[e.type]||.4;
 if(p<ht+.12&&!e.self&&Math.random()<.7){const q=lerpV(add(e.from,V(0,-14)),add(e.to,V(0,-14)),clamp(p/ht,0,1)),a=Math.random()*TAU;
  parts.push({p:V(q.x+Math.cos(a)*6,q.y+Math.sin(a)*6),v:V(Math.cos(a)*40,Math.sin(a)*40-30),l:.4,m:.4,c:e.pal[Math.random()<.5?1:2]});}};
const _dp=drawPlayer;
drawPlayer=function(){if(pl.hidden)return;const c=pal(LIST[sel].pal),pos=pl.pos;
 if(pl.lunge>0||pl.cast>.25){for(let g=1;g<=2;g++)spr(pl.mov&&Math.floor(tg*8)%2===0?PB2:PA2,cpal(),V(pos.x-pl.face*g*8,pos.y-1),pl.face<0,[c[1][0]/255,c[1][1]/255,c[1][2]/255,.28/g],2);}
 _dp();
 if(pl.cast>0){const k=1-pl.cast/.5,h=V(pos.x+pl.face*10,pos.y-18),a0=pl.face>0?-1.5:PI+1.5,a1=a0+(pl.face>0?3:-3)*Math.min(1,k*1.5);
  ctx.save();ctx.globalCompositeOperation='lighter';parc(h,34,a0,a1,[fade(c[0],.7),c[1],c[2],c[1]],1-k*.8);gl(add(h,V(Math.cos(a1)*34,Math.sin(a1)*34)),c[2],8,.5*(1-k));ctx.restore();}};
/* HUD tombol jurus 1-2-3 */
const _dh=drawHud;
drawHud=function(){_dh();const wd=LIST[sel],c=pal(wd.pal);
 for(let i=0;i<3;i++){const b={x:NB[i].x,y:NB[i].y,r:NR},ult=wd.ns[i][4]>=300;
  circ(b,'rgba(13,8,38,.9)',ult?'#ffd35a':css(c[0]),2.5);fit(WI[sel],b.x-13,b.y-15,26,22,.9);
  if(ncd[i]>0){ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.arc(b.x,b.y,b.r,-PI/2,-PI/2+TAU*(ncd[i]/ncm[i]));ctx.closePath();ctx.fillStyle='rgba(0,0,0,.7)';ctx.fill();txt(ncd[i].toFixed(1),b.x,b.y+4,10,'#fff','center');}
  txt(String(i+1),b.x-b.r+4,b.y-b.r+10,11,ult?'#ffd35a':'#fff');txt(wd.ns[i][0].slice(0,9),b.x,b.y-b.r-4,7,'#d8c8ff','center');}};

/* ===== UPGRADE v5: AUDIO + SFX serangan (WebAudio, tanpa file luar) + peta lebar (kamera) ===== */
const AU={ac:null,on:true,m:null,sfx:null,bgm:null,nb:null,pk:null,rvIn:null,dlIn:null,pb:0,curve:null,n:0};
try{AU.on=localStorage.getItem('aeth_mute')!=='1';}catch(_){}
const SNDB={x:W-16,y:16,r:11},R=Math.random,PS=()=>{const s=R()<.5?-1:1;return[-.55*s,.55*s]};
function auInit(){if(AU.ac)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const ac=new C(),sr=ac.sampleRate;
  const lim=ac.createDynamicsCompressor();lim.threshold.value=-2;lim.knee.value=0;lim.ratio.value=20;lim.attack.value=.001;lim.release.value=.08;
  const comp=ac.createDynamicsCompressor();comp.threshold.value=-21;comp.knee.value=20;comp.ratio.value=4;comp.attack.value=.003;comp.release.value=.18;
  const lo=ac.createBiquadFilter();lo.type='lowshelf';lo.frequency.value=105;lo.gain.value=7;const pk2=ac.createBiquadFilter();pk2.type='peaking';pk2.frequency.value=58;pk2.Q.value=1;pk2.gain.value=4;
  const hi=ac.createBiquadFilter();hi.type='highshelf';hi.frequency.value=7500;hi.gain.value=2.5;
  const m=ac.createGain();m.gain.value=AU.on?.9:0;m.connect(lo);lo.connect(pk2);pk2.connect(hi);hi.connect(comp);comp.connect(lim);lim.connect(ac.destination);
  const sfx=ac.createGain();sfx.gain.value=.8;sfx.connect(m);const bgm=ac.createGain();bgm.gain.value=.18;bgm.connect(m);
  /* reverb (impuls sintetis stereo) */
  const len=Math.floor(sr*2.4),ir=ac.createBuffer(2,len,sr);
  for(let c=0;c<2;c++){const d=ir.getChannelData(c);let y=0;for(let i=0;i<len;i++){const p=i/len,a2=Math.max(.04,1-.95*p);y+=((Math.random()*2-1)-y)*a2;d[i]=y*Math.pow(1-p,2.6)*(i<sr*.012?i/(sr*.012):1);}[.011,.017,.023,.031,.043,.057,.071].forEach(tp=>{const k=Math.floor(tp*sr*(1+c*.07));if(k<len)d[k]+=(Math.random()>.5?1:-1)*(.9-tp*5);});}
  const conv=ac.createConvolver();conv.buffer=ir;const rvIn=ac.createGain(),rhp=ac.createBiquadFilter(),rlp=ac.createBiquadFilter(),rvOut=ac.createGain();
  rhp.type='highpass';rhp.frequency.value=220;rlp.type='lowpass';rlp.frequency.value=6500;rvOut.gain.value=.55;rvIn.connect(rhp);rhp.connect(conv);conv.connect(rlp);rlp.connect(rvOut);rvOut.connect(m);const c2=ac.createConvolver(),l2=Math.floor(sr*.38),ir2=ac.createBuffer(2,l2,sr);for(let c=0;c<2;c++){const d2=ir2.getChannelData(c);for(let i=0;i<l2;i++)d2[i]=(Math.random()*2-1)*Math.pow(1-i/l2,3);}c2.buffer=ir2;const r2o=ac.createGain();r2o.gain.value=.45;rvIn.connect(c2);c2.connect(r2o);r2o.connect(m);const dIn=ac.createGain(),dL=ac.createDelay(1),dR=ac.createDelay(1),fb=ac.createGain(),dlp=ac.createBiquadFilter(),mg=ac.createChannelMerger(2),dOut=ac.createGain();dL.delayTime.value=.19;dR.delayTime.value=.27;fb.gain.value=.38;dlp.type='lowpass';dlp.frequency.value=3200;dOut.gain.value=.4;dIn.connect(dlp);dlp.connect(dL);dL.connect(dR);dR.connect(fb);fb.connect(dL);dL.connect(mg,0,0);dR.connect(mg,0,1);mg.connect(dOut);dOut.connect(m);AU.dlIn=dIn;
  /* noise putih + pink */
  const nb=ac.createBuffer(1,sr*3,sr),d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  const pk=ac.createBuffer(1,sr*3,sr),p=pk.getChannelData(0);let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
  for(let i=0;i<p.length;i++){const w=Math.random()*2-1;b0=.99886*b0+w*.0555179;b1=.99332*b1+w*.0750759;b2=.969*b2+w*.153852;b3=.8665*b3+w*.3104856;b4=.55*b4+w*.5329522;b5=-.7616*b5-w*.016898;p[i]=(b0+b1+b2+b3+b4+b5+b6+w*.5362)*.11;b6=w*.115926;}
  /* kurva saturasi */
  const cu=new Float32Array(1024);for(let i=0;i<1024;i++){const x=i*2/1024-1;cu[i]=(3+30)*x*20*(Math.PI/180)/(Math.PI+30*Math.abs(x));}
  AU.ac=ac;AU.m=m;AU.sfx=sfx;AU.bgm=bgm;AU.nb=nb;AU.pk=pk;AU.rvIn=rvIn;AU.curve=cu;}catch(e){AU.ac=null;}}
function auResume(){auInit();if(AU.ac&&AU.ac.state!=='running')AU.ac.resume().catch(()=>{});}
/* output: pan (opsional menyapu) + kirim reverb */
function outTo(ac,out,o,t,dur){const rv=o.rv==null?.2:o.rv,dl=o.dl!=null?o.dl:(rv>.3?(rv-.3)*.6:0);
  if(o.bus===AU.bgm){out.connect(AU.bgm);if(rv>0&&o.rv&&AU.rvIn){const s=ac.createGain();s.gain.value=rv;out.connect(s);s.connect(AU.rvIn);}if(dl>0&&o.rv&&AU.dlIn){const s=ac.createGain();s.gain.value=dl;out.connect(s);s.connect(AU.dlIn);}return;}
  let nd=out;if(ac.createStereoPanner){const p=ac.createStereoPanner(),ps=o.ps;p.pan.setValueAtTime(ps?ps[0]:AU.pb*.6+(R()*2-1)*.2,t);if(ps)p.pan.linearRampToValueAtTime(ps[1],t+dur);nd.connect(p);nd=p;}
  nd.connect(AU.sfx);if(rv>0&&AU.rvIn){const s=ac.createGain();s.gain.value=rv;nd.connect(s);s.connect(AU.rvIn);}
  if(dl>0&&AU.dlIn){const s=ac.createGain();s.gain.value=dl;nd.connect(s);s.connect(AU.dlIn);}}
/* FM synth: lonceng/logam yang lebih realistis */
function FMT(fc,ratio,idx,dur,vol,at,o){o=o||{};const ac=AU.ac;if(!ac||vol<.002||AU.n>140)return;const t=ac.currentTime+(at||0)+.005,c=ac.createOscillator(),m=ac.createOscillator(),mg=ac.createGain(),g=ac.createGain();
  c.frequency.value=fc;m.frequency.value=fc*ratio;mg.gain.setValueAtTime(fc*idx,t);mg.gain.exponentialRampToValueAtTime(Math.max(1,fc*idx*.02),t+dur);m.connect(mg);mg.connect(c.frequency);
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vol,t+.002);g.gain.exponentialRampToValueAtTime(.0001,t+dur);c.connect(g);outTo(ac,g,o,t,dur);
  c.start(t);m.start(t);c.stop(t+dur+.05);m.stop(t+dur+.05);AU.n+=2;c.onended=()=>{AU.n-=2};}
/* ducking musik saat efek besar */
function duck(k){const ac=AU.ac;if(!ac||!AU.bgm)return;const g=AU.bgm.gain,t=ac.currentTime;g.cancelScheduledValues(t);g.setTargetAtTime(.18*k,t,.03);g.setTargetAtTime(.18,t+.45,.35);}
/* oscillator: f0->f1 selama dur. opsi: a,lp,vib,uni(cents),ws(saturasi),ps(pan),rv(reverb) */
function T(f0,f1,dur,type,vol,at,o){o=o||{};const ac=AU.ac;if(!ac||vol<.002||(AU.n>140&&o.bus!==AU.bgm))return;
  const t=ac.currentTime+(at||0)+.005,g=ac.createGain(),pv=o.bus===AU.bgm?1:1+(R()-.5)*.05,a0=Math.max(20,f0*pv),a1=f1&&f1!==f0?Math.max(20,f1*pv):0;
  const mk=cents=>{const os=ac.createOscillator();os.type=type||'sine';os.frequency.setValueAtTime(a0,t);if(a1)os.frequency.exponentialRampToValueAtTime(a1,t+dur);if(cents)os.detune.value=cents;else if(o.det)os.detune.value=o.det;
    os.connect(g);os.start(t);os.stop(t+dur+.05);return os;};
  const main=mk(0);let cnt=1;if(o.uni){mk(-o.uni);mk(o.uni);cnt=3;}
  const a=o.a==null?.005:Math.min(o.a,dur*.9),vv=o.uni?vol*.6:vol;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vv,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  let out=g;
  if(o.lp){const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=o.lp;out.connect(f);out=f;}
  if(o.ws&&AU.curve){const w=ac.createWaveShaper();w.curve=AU.curve;w.oversample='2x';out.connect(w);const pg=ac.createGain();pg.gain.value=.55;w.connect(pg);out=pg;}
  if(o.vib){const l=ac.createOscillator(),lg=ac.createGain();l.frequency.value=o.vib[0];lg.gain.value=o.vib[1];l.connect(lg);lg.connect(main.frequency);l.start(t);l.stop(t+dur+.05);}
  outTo(ac,out,o,t,dur);AU.n+=cnt;main.onended=()=>{AU.n-=cnt};}
/* noise: filter sweep f0->f1 (pink untuk lowpass/bandpass, putih untuk highpass) */
function N(dur,vol,at,o){o=o||{};const ac=AU.ac;if(!ac||vol<.002||(AU.n>140&&o.bus!==AU.bgm))return;
  const t=ac.currentTime+(at||0)+.005,s=ac.createBufferSource(),g=ac.createGain(),f=ac.createBiquadFilter();
  s.buffer=(o.ty==='highpass'?AU.nb:AU.pk);s.loop=true;f.type=o.ty||'bandpass';f.Q.value=o.q||1;
  f.frequency.setValueAtTime(Math.max(30,o.f0||1000),t);if(o.f1)f.frequency.exponentialRampToValueAtTime(Math.max(30,o.f1),t+dur);
  const a=o.a==null?.004:Math.min(o.a,dur*.9),k=o.ty==='highpass'?1:3.2;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vol*k,t+a);
  if(o.sw)g.gain.linearRampToValueAtTime(vol*k,t+Math.max(a+.001,dur*o.sw));
  g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);outTo(ac,g,o,t,dur);
  s.start(t,Math.random()*2);s.stop(t+dur+.05);AU.n++;s.onended=()=>{AU.n--};}
/* keluarga suara per elemen */
const FAM={fire:{f:220,w:'sawtooth',b:1800,tx:'crackle'},ice:{f:900,w:'triangle',b:5000,tx:'tinkle'},
fireice:{f:300,w:'sawtooth',b:3000,tx:'crackle',tx2:'tinkle'},void:{f:170,w:'sawtooth',b:900,tx:'drone',tx2:'tinkle'},
cosmic:{f:440,w:'triangle',b:3000,tx:'sparkle'},nebula:{f:300,w:'sine',b:1400,tx:'drone',tx2:'sparkle'},
shadow:{f:150,w:'sawtooth',b:1000,tx:'drone'},holy:{f:523,w:'sine',b:4000,tx:'bell'},soul:{f:260,w:'sine',b:1200,tx:'wail'},
gamma:{f:700,w:'square',b:5000,tx:'metal'},volt:{f:400,w:'sawtooth',b:4000,tx:'zap'},tsunami:{f:200,w:'sine',b:900,tx:'bubble'},
vibra:{f:620,w:'square',b:5000,tx:'synth'},lunar:{f:330,w:'sine',b:1800,tx:'bell',tx2:'wail'},phantom:{f:500,w:'sine',b:3500,tx:'flutter'},
frost:{f:600,w:'triangle',b:3500,tx:'wind',tx2:'tinkle'},pyro:{f:140,w:'sawtooth',b:1200,tx:'roar'},earth:{f:110,w:'sine',b:600,tx:'rumble'},
wind:{f:500,w:'sine',b:2500,tx:'wind'},elec:{f:500,w:'sawtooth',b:4500,tx:'zap'},five:{f:523,w:'sine',b:3500,tx:'bell',tx2:'sparkle'}};
/* tekstur khas tiap elemen */
function TX(k,at,dur,v,f){switch(k){
 case'crackle':{const n=Math.max(2,Math.floor(dur*16));for(let i=0;i<n;i++)N(.025+R()*.03,v*.7,at+R()*dur,{f0:1200+R()*2600,q:2});N(dur,v*.35,at,{f0:700,f1:260,ty:'lowpass',q:.7,a:.02});break;}
 case'tinkle':{const n=Math.max(3,Math.floor(dur*14));for(let i=0;i<n;i++){const fr=2400+R()*3600;T(fr,fr*.96,.12+R()*.1,'sine',v*.35,at+R()*dur,{a:.002});}break;}
 case'drone':T(f*.5,f*.46,dur,'sawtooth',v*.32,at,{lp:420,a:Math.min(.25,dur*.4)});T(f*.505,f*.48,dur,'sawtooth',v*.22,at,{lp:360,a:.12});N(dur,v*.22,at,{f0:300,f1:900,q:3,a:dur*.4});break;
 case'sparkle':{const sc=[0,2,4,7,9,12,14,16],n=Math.max(3,Math.floor(dur*12));for(let i=0;i<n;i++){const fr=f*Math.pow(2,sc[i%8]/12)*2;T(fr,fr,.2,'triangle',v*.28,at+i*dur/n,{a:.003,rv:.45});}break;}
 case'metal':{FMT(f,2.76,2.2,.34,v*.3,at,{rv:.25});FMT(f*1.51,5.4,1.2,.22,v*.16,at,{rv:.25});[1,2.76,5.4,8.9].forEach((m,i)=>T(f*m,f*m*.995,.16+.06/(i+1),'sine',v*.16/(i+1),at,{a:.001}));N(.04,v*.45,at,{f0:6000,ty:'highpass',q:.5});break;}
 case'bell':{FMT(f,3.5,1.3,1.5,v*.34,at,{rv:.5});FMT(f*2.01,1.41,.8,1.1,v*.2,at,{rv:.5});[1,2,3].forEach((m,i)=>T(f*m,f*m,1.2/(1+i*.4),'sine',v*.16/(i+1),at,{a:.002,rv:.5}));break;}
 case'wail':T(f,f*1.25,dur,'sine',v*.4,at,{a:dur*.3,vib:[6,f*.03],uni:7,rv:.5});T(f*2,f*2.4,dur,'sine',v*.12,at,{a:dur*.3,vib:[5,f*.05]});N(dur,v*.18,at,{f0:1500,f1:800,q:6,a:dur*.3});break;
 case'zap':{const n=Math.max(2,Math.floor(dur*12));for(let i=0;i<n;i++){const t0=at+R()*dur,fr=300+R()*1500;T(fr*2,fr*.3,.07,'sawtooth',v*.32,t0,{a:.001});N(.05,v*.35,t0,{f0:3000+R()*3000,ty:'highpass'});}break;}
 case'bubble':{const n=Math.max(3,Math.floor(dur*14));for(let i=0;i<n;i++){const fr=250+R()*500;T(fr,fr*1.8,.08,'sine',v*.3,at+R()*dur,{a:.004});}N(dur,v*.4,at,{f0:900,f1:400,q:.8,ty:'lowpass',a:dur*.3});break;}
 case'synth':T(f*2,f,dur,'square',v*.22,at,{lp:3500,a:.002});T(f*3,f*1.5,dur,'sawtooth',v*.16,at,{lp:5000,a:.002});break;
 case'flutter':{const n=Math.max(4,Math.floor(dur*22));for(let i=0;i<n;i++)N(.035,v*.32,at+i*dur/n+R()*.01,{f0:2500+R()*2500,q:3});T(f*2,f*2.6,dur,'sine',v*.14,at,{a:dur*.4,vib:[9,f*.06]});break;}
 case'wind':N(dur,v*.6,at,{f0:500,f1:2200,q:2.5,a:dur*.35,sw:.6});break;
 case'rumble':T(f*.4,f*.2,dur,'sine',v*.5,at,{a:.01});N(dur,v*.5,at,{f0:220,f1:90,ty:'lowpass',q:.8,a:.01});break;
 case'roar':N(dur,v*.7,at,{f0:450,f1:160,ty:'lowpass',q:1,a:.02,sw:.5});TX('crackle',at,dur,v*.55,f);break;}}
/* kata kerja suara: (F=keluarga, at, v=volume, d=durasi, n=opsi) */
const SK={
 sw(F,at,v,d){d=d||.22;const p=PS();N(d,.5*v,at,{f0:350,f1:F.b*.9,q:1.3,a:d*.4,ps:p,rv:.12});N(d*.9,.28*v,at+d*.1,{f0:F.b*.5,f1:200,ty:'lowpass',q:.7,a:d*.2,ps:p,rv:.1});T(F.f*.5,F.f*.25,d,'sine',.12*v,at,{a:d*.3,ps:p});TX(F.tx,at,d,v*.45,F.f);},
 sg(F,at,v){N(.2,.4*v,at,{f0:5500,ty:'highpass',q:.5});T(3400,5400,.3,'sine',.11*v,at,{a:.002});T(5100,7200,.2,'sine',.06*v,at+.01,{a:.002});},
 wh(F,at,v,d){SK.ru(F,at,v*.8,d||.2);},
 ru(F,at,v,d){d=d||.3;const p=PS();N(d,.6*v,at,{f0:300,f1:2600,q:1.5,a:d*.3,ps:p});TX(F.tx,at,d,v*.35,F.f);},
 pr(F,at,v,d){d=d||.3;const p=PS();T(F.f*.8,F.f*2.2,d,F.w,.28*v,at,{lp:F.b,a:d*.3,ps:p,uni:8,rv:.25});N(d*1.1,.35*v,at,{f0:F.b*.3,f1:F.b*1.2,q:2,a:d*.4,ps:p});TX(F.tx,at,d,v*.35,F.f);},
 im(F,at,v){N(.012,.55*v,at,{f0:3500,ty:'highpass',q:.5,rv:.05});T(190,46,.22,'sine',.7*v,at,{ws:1});T(60,32,.3,'sine',.5*v,at,{a:.003,rv:.05});N(.28,.07*v,at,{f0:F.f*2,q:24,rv:.25});N(.2,.5*v,at,{f0:F.b,f1:F.b*.25,q:.8,rv:.3});TX(F.tx,at,.24,v*.55,F.f);if(F.tx2)TX(F.tx2,at,.2,v*.35,F.f);},
 li(F,at,v){T(150,50,.14,'sine',.4*v,at);N(.1,.32*v,at,{f0:F.b*.8,f1:F.b*.3,q:1});T(F.f*3,F.f*2.6,.1,'triangle',.1*v,at,{a:.002});},
 bg(F,at,v){N(.015,.7*v,at,{f0:3000,ty:'highpass',rv:.1});T(110,24,.9,'sine',v,at,{ws:1,a:.003});T(55,28,1.1,'sine',.7*v,at,{a:.004,rv:.05});N(.5,.08*v,at,{f0:F.f*1.5,q:20,rv:.4});N(.35,.06*v,at+.02,{f0:F.f*3,q:26,rv:.4});T(240,55,.35,'sawtooth',.3*v,at,{lp:800,ws:1});N(.9,.8*v,at,{f0:F.b,f1:80,ty:'lowpass',q:.7,rv:.45});N(.14,.55*v,at,{f0:7500,ty:'highpass'});for(let i=0;i<6;i++)N(.05,.3*v,at+.05+R()*.4,{f0:600+R()*2400,q:3,rv:.2});TX(F.tx,at,.7,v*.9,F.f);if(F.tx2)TX(F.tx2,at+.03,.55,v*.7,F.f);},
 ch(F,at,v,d){d=d||.5;T(F.f*.5,F.f*2,d,F.w,.3*v,at,{a:d*.85,lp:F.b,uni:12,rv:.35});T(F.f*.75,F.f*3,d,'sine',.15*v,at,{a:d*.85,rv:.4});N(d,.28*v,at,{f0:300,f1:F.b,q:3,a:d*.85,rv:.3});TX(F.tx,at,d,v*.4,F.f);},
 ci(F,at,v,d){d=d||.5;T(F.f,F.f*1.02,d,'sine',.18*v,at,{a:d*.3,vib:[6,F.f*.02],uni:9,rv:.5});T(F.f*1.5,F.f*1.5,d,'sine',.1*v,at+.05,{a:d*.3,rv:.5});TX('sparkle',at,d,v*.55,F.f);N(d,.18*v,at,{f0:800,f1:3000,q:4,a:d*.5,rv:.4});},
 ra(F,at,v,d,n){n=n||6;d=d||.5;for(let i=0;i<n;i++){const t=at+i*d/n+R()*.02;N(.16,.28*v,t,{f0:F.b*.6,f1:F.b*.2,q:2});SK.li(F,t+.2,v*.8);}},
 zp(F,at,v){N(.14,.9*v,at,{f0:5000,ty:'highpass',q:.5,rv:.15});T(2200,90,.28,'sawtooth',.45*v,at,{a:.001,lp:6000,ws:1});TX('zap',at,.4,v*.8,F.f);N(1.1,.55*v,at+.06,{f0:260,f1:55,ty:'lowpass',q:.8,a:.05,rv:.4});T(70,35,.6,'sine',.35*v,at+.05,{a:.02});},
 ls(F,at,v){T(2200,260,.2,'sawtooth',.28*v,at,{lp:6000,a:.002});T(3000,500,.16,'square',.14*v,at,{lp:7000,a:.002});N(.08,.2*v,at,{f0:6000,ty:'highpass'});},
 lb(F,at,v,d){d=d||.8;T(110,130,d,'sawtooth',.4*v,at,{lp:1800,a:.15,vib:[28,10],uni:10,rv:.3});T(330,360,d,'square',.18*v,at,{lp:3500,a:.2,vib:[34,20]});T(880,900,d,'sine',.16*v,at,{a:.2,rv:.4});N(d,.45*v,at,{f0:3500,f1:1800,q:1,a:.12});T(55,50,d,'sine',.3*v,at,{a:.1});},
 wv(F,at,v,d){d=d||.6;const p=PS();N(d,.75*v,at,{f0:180,f1:1500,q:.8,a:d*.5,sw:.7,ps:p,rv:.3});N(d,.4*v,at,{f0:500,f1:200,ty:'lowpass',q:.5,a:d*.3,ps:p});TX('bubble',at,d,v*.6,F.f);},
 sp(F,at,v){N(.45,.8*v,at,{f0:2500,f1:500,q:.7,a:.01,rv:.35});T(200,55,.32,'sine',.6*v,at,{ws:1});TX('bubble',at,.4,v*.6,F.f);N(.1,.4*v,at,{f0:6500,ty:'highpass'});},
 wi(F,at,v,d){d=d||.6;N(d,.7*v,at,{f0:350,f1:2400,q:2.2,a:d*.4,sw:.55});N(d,.4*v,at,{f0:700,f1:1200,q:5,a:d*.4,sw:.55});TX(F.tx2||'tinkle',at+d*.2,d*.7,v*.3,F.f);},
 sh(F,at,v){N(.22,.6*v,at,{f0:7000,ty:'highpass',q:.6});for(let i=0;i<7;i++){const fr=2600+R()*4200;T(fr,fr*.9,.2+R()*.2,'sine',.16*v,at+R()*.2,{a:.001});}T(180,60,.25,'sine',.45*v,at);},
 ck(F,at,v,d){d=d||.3;N(d,.4*v,at,{f0:600,f1:3000,q:1.4,a:d*.5});N(.06,.9*v,at+d*.6,{f0:5200,ty:'highpass',q:.6});T(2400,500,.1,'square',.2*v,at+d*.6,{a:.001});TX('metal',at+d*.55,.3,v*.6,F.f);},
 cl(F,at,v){TX('metal',at,.3,v,F.f);},
 sk(F,at,v,d){d=d||.6;TX('wail',at,d,v,F.f);N(d,.2*v,at,{f0:900,f1:400,q:7,a:d*.4,rv:.5});},
 bn(F,at,v,d){d=d||.7;const n=Math.floor(d*16);for(let i=0;i<n;i++){const t=at+R()*d;N(.025,.6*v,t,{f0:1400+R()*1600,q:4});T(500+R()*500,300,.05,'square',.15*v,t,{a:.001,lp:2500});}},
 fl(F,at,v,d){d=d||.6;TX('flutter',at,d,v,F.f);TX('sparkle',at,d,v*.35,F.f);N(d,.15*v,at,{f0:3000,f1:5000,q:2,a:d*.4,ps:PS(),rv:.4});},
 bl(F,at,v,d,n){d=d||.7;const k=Math.pow(2,(n||0)/12);[1,1.5,2,3].forEach((m,i)=>{T(F.f*k*m,F.f*k*m,d/(1+i*.25),'sine',.2*v/(i+1),at,{a:.004,vib:i>1?[5,2]:null,rv:.55});T(F.f*k*m*1.003,F.f*k*m*1.003,d/(1+i*.25),'sine',.1*v/(i+1),at,{a:.004,rv:.55});});},
 po(F,at,v,d){d=d||.8;N(d,.6*v,at,{f0:250,f1:2000,q:6,a:d*.4,sw:.7,ps:[-.8,.8],rv:.4});T(F.f*.4,F.f*1.6,d,'sine',.28*v,at,{a:d*.5,vib:[7,F.f*.1],uni:10,rv:.4});N(d,.3*v,at,{f0:1500,f1:300,q:8,a:d*.4,sw:.5,ps:[.8,-.8]});TX(F.tx,at,d,v*.35,F.f);},
 tp(F,at,v,d){d=d||.2;T(1800,150,d,'sine',.35*v,at,{a:.002});N(d,.5*v,at,{f0:5000,f1:300,q:2,a:.004});TX('zap',at,d*1.2,v*.6,F.f);},
 dr(F,at,v){N(.015,.7*v,at,{f0:3000,ty:'highpass'});T(90,22,.8,'sine',v,at,{ws:1,a:.003});T(48,26,1,'sine',.6*v,at,{a:.004});N(.7,.8*v,at,{f0:900,f1:80,ty:'lowpass',q:.7,rv:.4});for(let i=0;i<7;i++)N(.05,.35*v,at+.05+R()*.4,{f0:700+R()*1800,q:3,rv:.2});TX(F.tx,at,.5,v*.7,F.f);},
 sn(F,at,v,d){d=d||.5;T(F.f*2,F.f*2.05,d,'sawtooth',.14*v,at,{a:.04,lp:2800,vib:[22,F.f*.8]});N(d,.3*v,at,{f0:1200,f1:2400,q:3,a:.05});TX(F.tx,at,d,v*.2,F.f);},
 gr(F,at,v,d){d=d||.5;T(150,80,d,'sawtooth',.4*v,at,{a:.03,lp:700,vib:[28,18]});T(300,170,d,'sawtooth',.2*v,at,{a:.03,lp:1200,vib:[26,20]});N(d,.3*v,at,{f0:900,f1:300,q:2,a:.03});},
 rr(F,at,v,d){d=d||.8;T(75,48,d,'sawtooth',.5*v,at,{a:.2,lp:320,vib:[5,6]});T(150,95,d,'sawtooth',.2*v,at,{a:.2,lp:600});N(d,.35*v,at,{f0:300,f1:100,ty:'lowpass',a:.2});},
 ea(F,at,v){T(2900,1900,.4,'sawtooth',.18*v,at,{a:.01,lp:5500,vib:[42,320]});T(3500,2400,.35,'square',.08*v,at+.03,{a:.01,lp:6000,vib:[38,250]});}};
const rp=(n,iv,t0,k,f,v,d,x)=>Array.from({length:n},(_,i)=>[t0+i*iv,k,f,v,d,x]);
/* ---- resep suara Basic ATK (urutan LIST: 16 senjata, tiap senjata 3 serangan; Ain Soph Aur 6) ---- */
const BREC=[
/*Frostfire*/[[[0,'sw','fire',.8,.2],[.17,'im','fire',1],[.19,'bg','fire',.45]],
 [[0,'sw','ice',.7,.18],[.14,'sh','ice',1],[.16,'im','ice',.6]],
 [[0,'ch','fireice',.8,.16],[.15,'bg','fireice',1.1],[.17,'sh','ice',.8],[.22,'im','fire',.7]]],
/*Voidspike*/[[[0,'ch','void',.5,.15],...rp(5,.07,0,'pr','void',.4,.4),...rp(5,.07,.4,'im','void',.4)],
 [[0,'ch','void',.5,.14],[.1,'pr','void',.9,.18],[.25,'bg','void',.7],[.26,'sh','void',.9]],
 [[0,'ci','void',.8,.6],[.45,'ra','void',.6,.55,6],[.72,'bg','void',.9],[.74,'sh','void',.8]]],
/*Starlance*/[[[0,'sw','cosmic',.8,.3],[.1,'pr','cosmic',.5,.42],[.5,'im','cosmic',.9]],
 [[0,'ru','cosmic',.7,.35],[.4,'sw','cosmic',.8,.2],[.58,'dr','cosmic',1],[.6,'sh','cosmic',.6]],
 [[0,'ch','cosmic',.7,.55],[.4,'ci','cosmic',.7,.4],[.48,'ra','cosmic',.7,.5,7],[.7,'bg','cosmic',1]]],
/*Nebulash*/[[[0,'ru','nebula',.5,.2],[0,'sn','nebula',.6,.55],[.55,'im','nebula',.8]],
 [[0,'sn','nebula',.6,.8],[.5,'im','nebula',.7],[.85,'ru','nebula',.5,.3],[1.05,'cl','nebula',.5]],
 [[0,'sn','nebula',.6,.5],[.3,'po','nebula',.9,1.1],[.62,'bg','nebula',1.1]]],
/*Zenithblade*/[[[0,'sw','shadow',.8,.2],[.02,'sg','shadow',.7],[.17,'im','shadow',.9]],
 [[0,'sw','holy',.8,.2],[.02,'sg','holy',.9],[.17,'im','holy',.9],[.19,'bl','holy',.4,.5]],
 [[0,'sw','shadow',.8,.2],[.02,'sg','shadow',.7],[.12,'sw','holy',.8,.2],[.14,'sg','holy',.9],[.32,'bg','shadow',1.1],[.34,'bg','holy',.7]]],
/*Lanternis*/[[[0,'sk','soul',.6,.5],[.5,'im','soul',.8]],
 [...rp(3,.12,0,'sk','soul',.4,.45),...rp(3,.12,.5,'im','soul',.6)],
 [[0,'ci','soul',.8,.5],[.15,'bn','soul',.9,.8],[.2,'sk','soul',.7,.9],[1.02,'bg','soul',.95]]],
/*Fangchain*/[[[0,'ck','gamma',.9,.35],[.37,'im','gamma',.8]],
 [[0,'ck','gamma',.8,.35],[.36,'cl','gamma',.8],...rp(4,.07,.4,'cl','gamma',.5),[.55,'im','gamma',.7]],
 [[0,'ck','gamma',.8,.35],[.35,'ci','gamma',.8,.5],[.55,'bg','gamma',1.1]]],
/*Tigerclaw*/[[[0,'sw','volt',.7,.15],[.1,'zp','volt',.7],[.24,'im','volt',.9]],
 [[0,'sw','volt',.7,.15],[.08,'zp','volt',.6],[.175,'sw','volt',.7,.15],[.25,'zp','volt',.8],[.3,'im','volt',1]],
 [[0,'tp','volt',.9,.22],[.2,'wh','volt',.5,.2],[.4,'wh','volt',.5,.2],[.55,'zp','volt',.4],[.7,'tp','volt',.8,.2],[.74,'zp','volt',1.1],[.78,'gr','volt',.8,.5],[.85,'bg','volt',1.2]]],
/*Trident*/[[[0,'sw','tsunami',.6,.12],...rp(3,.05,0,'pr','tsunami',.5,.25),[.3,'sp','tsunami',.9],[.35,'im','tsunami',.4]],
 [[0,'sw','tsunami',.7,.25],[.1,'wv','tsunami',.6,.45],[.52,'sp','tsunami',.9]],
 [[0,'ch','tsunami',.8,.45],[.3,'wv','tsunami',1,.9],[.62,'bg','tsunami',1.1],[.65,'sp','tsunami',1]]],
/*Twin Eagle*/[[[0,'ls','vibra',.8],[.05,'ls','vibra',.8],[.27,'im','vibra',.7],[.32,'im','vibra',.7]],
 [[0,'ci','vibra',.5,.3],...rp(6,.05,0,'ls','vibra',.55),...rp(6,.05,.26,'im','vibra',.45)],
 [[0,'ch','vibra',.9,.3],[.28,'lb','vibra',1,.85],[.32,'bg','vibra',.8],[.6,'im','vibra',.5]]],
/*Riftreaper*/[[[0,'sw','lunar',.9,.22],[.02,'sg','lunar',.6],[.17,'im','lunar',.9]],
 [[0,'ru','lunar',.8,.5],...rp(4,.15,0,'sw','lunar',.6,.14),[.82,'im','lunar',1],[.84,'sg','lunar',.5]],
 [[0,'ch','lunar',.8,.65],[.25,'bl','lunar',.8,.8],[.72,'sw','lunar',1.1,.3],[.8,'bg','lunar',1.2],[.82,'bl','lunar',.6,.9,-5]]],
/*Ain Soph Aur*/[[[0,'bl','five',.5,.4,0],[.02,'pr','fire',.7,.14],[.16,'bg','fire',1]],
 [[0,'bl','five',.5,.4,2],[.1,'ch','tsunami',.5,.2],[.2,'wv','tsunami',.9,.8],[.62,'sp','tsunami',1]],
 [[0,'bl','five',.5,.4,-5],[.35,'ra','earth',.8,.55,8],[.7,'bg','earth',1]],
 [[0,'bl','five',.5,.4,7],[.1,'wi','wind',1,1.3],[.6,'im','wind',.7]],
 [[0,'bl','five',.5,.4,9],[.05,'ch','elec',.5,.2],[.22,'zp','elec',1.1],[.34,'zp','elec',.9],[.46,'zp','elec',.8]],
 [[0,'bl','five',.7,.6,0],[.1,'bl','five',.6,.6,4],[.2,'bl','five',.6,.6,7],[.3,'bl','five',.6,.6,12],[.4,'bl','five',.6,.6,16],[0,'ch','five',.9,.8],
  [.82,'bg','five',1.3],[.85,'bg','fire',.5],[.9,'wv','tsunami',.4,.4],[.95,'zp','elec',.6],[1.0,'dr','earth',.5],[1.05,'wi','wind',.5,.5]]],
/*Sandalphon*/[[[0,'sw','holy',.8,.2],[.02,'sg','holy',.8],[.17,'im','holy',.9]],
 [[0,'sw','holy',.9,.22],[.02,'sg','holy',.9],[.1,'pr','holy',.5,.4],[.52,'im','holy',.9],[.54,'bl','holy',.5,.6]],
 [[0,'ch','holy',.9,.5],[0,'bl','holy',.7,.9,-12],[.15,'ci','holy',.8,.5],[.3,'bl','holy',.7,.9,0],[.4,'bg','holy',1.2],[.42,'bl','holy',.8,1,12]]],
/*Zadkiel*/[[[0,'fl','phantom',.7,.5],...rp(4,.12,0,'sk','phantom',.3,.4),...rp(4,.12,.5,'im','phantom',.5)],
 [[0,'bl','phantom',.5,.5,12],...rp(6,.07,0,'pr','phantom',.4,.4),...rp(6,.07,.4,'im','phantom',.35)],
 [[0,'ci','phantom',.8,.5],[.2,'sk','phantom',.7,.9],[.2,'fl','phantom',.8,.9],[1.0,'bg','phantom',1.1],[1.02,'bl','phantom',.6,.8,12]]],
/*Gunbai*/[[[0,'sw','frost',.9,.25],[.05,'wi','frost',.6,.4],[.52,'im','frost',.8]],
 [[0,'wi','frost',1,1.2],[.2,'sh','ice',.5],[.55,'im','frost',.8],[.9,'sh','ice',.4]],
 [[0,'ch','frost',.7,.5],[.1,'wi','frost',.9,.9],[.45,'ra','ice',.7,.5,7],[.7,'bg','ice',1],[.72,'sh','ice',1]]],
/*Camael*/[[[0,'sw','pyro',.8,.2],[.1,'sw','pyro',.6,.15],[.2,'im','pyro',.9],[.22,'bg','pyro',.4]],
 [[0,'ch','pyro',.6,.25],[.25,'sw','pyro',.9,.25],[.3,'pr','pyro',.7,.3],[.52,'bg','pyro',.9]],
 [[0,'ch','pyro',.9,.18],[.14,'dr','pyro',1.1],[.16,'bg','pyro',1.2],[.3,'rr','pyro',.7,.7]]]];
/* ---- resep suara Jurus 1-2-3 (sinkron dengan timeline visual jurus) ---- */
const JREC=[
/*Frostfire*/[[[0,'sw','ice',.7,.15],[0,'pr','ice',.6,.3],[.3,'sh','ice',.9],[.32,'im','ice',.6]],
 [[0,'ch','fireice',.6,.3],[.1,'pr','fire',.7,.42],[.12,'pr','ice',.7,.42],[.45,'bg','fireice',.9],[.47,'sh','ice',.6]],
 [[0,'ch','fireice',.8,.9],[.4,'sn','fire',.4,.5],[.9,'dr','fireice',.9],[.95,'bg','ice',1],[.97,'sh','ice',.8],[1.02,'bg','fire',1]]],
/*Voidspike*/[[[0,'ch','void',.5,.12],[.05,'pr','void',.8,.2],[.22,'sh','void',.9],[.24,'im','void',.6]],
 [[0,'ci','void',.6,.5],[0,'sn','void',.5,.55],...rp(5,.09,.55,'pr','void',.5,.28),...rp(5,.09,.83,'im','void',.55)],
 [[0,'ch','void',.8,.5],[.4,'ra','void',.4,.3,4],[.5,'pr','void',.9,.28],[.78,'bg','void',1.1],[.8,'sh','void',.9]]],
/*Starlance*/[[[0,'sw','cosmic',.7,.12],[0,'pr','cosmic',.8,.2],[.22,'im','cosmic',.9]],
 [[0,'ci','cosmic',.7,.55],...rp(6,.08,.55,'pr','cosmic',.45,.3),...rp(6,.08,.85,'im','cosmic',.5)],
 [[0,'ch','cosmic',.9,.5],[.45,'ch','cosmic',1,.9],[.8,'ra','cosmic',.8,.9,14],[1.45,'bg','cosmic',1.2]]],
/*Nebulash*/[[[0,'sn','nebula',.6,.35],[.3,'im','nebula',.8],[.5,'sn','nebula',.4,.3],[.8,'cl','nebula',.4]],
 [[0,'sn','nebula',.5,.3],[.1,'po','nebula',.9,.7],[.78,'bg','nebula',.9]],
 [[0,'ch','nebula',.8,.5],[.45,'po','nebula',1,1.2],[.5,'dr','void',.5],[1.65,'bg','nebula',1.2]]],
/*Zenithblade*/[[[0,'sw','holy',.9,.2],[.02,'sg','holy',.8],[.1,'pr','holy',.5,.3],[.4,'im','holy',.9]],
 [[0,'sw','shadow',.8,.2],[.02,'sg','shadow',.7],[.12,'sw','holy',.8,.2],[.14,'sg','holy',.8],[.5,'bg','holy',.9],[.52,'bg','shadow',.6]],
 [[0,'ch','shadow',.9,.5],[0,'ci','holy',.6,.5],[.5,'sw','shadow',1,.4],[.52,'sg','shadow',.8],[.58,'sw','holy',1,.4],[.6,'sg','holy',.8],[1,'bg','holy',1.2]]],
/*Lanternis*/[[[0,'sk','soul',.6,.4],[.36,'im','soul',.8]],
 [[0,'ci','soul',.6,.5],[.1,'sk','soul',.5,.5],...rp(4,.12,.55,'pr','soul',.45,.3),...rp(4,.12,.85,'im','soul',.5)],
 [[0,'ci','soul',.8,.5],[.3,'sk','soul',.8,1.2],[.5,'bn','soul',.8,1],[1.55,'bg','soul',1.1]]],
/*Fangchain*/[[[0,'ck','gamma',.9,.3],[.26,'im','gamma',.8]],
 [[0,'ck','gamma',.8,.3],[.2,'im','gamma',.6],...rp(5,.08,.3,'cl','gamma',.5),...rp(4,.15,.55,'im','gamma',.4)],
 [[0,'ch','gamma',.8,.5],[.3,'sn','gamma',.6,.6],[.5,'ck','gamma',1,.3],[.65,'ck','gamma',1,.3],[.8,'ck','gamma',1,.3],[.95,'bg','gamma',.7],[1.15,'bg','gamma',.9],[1.35,'bg','gamma',1.1]]],
/*Tigerclaw*/[[[0,'sw','volt',.7,.15],[.06,'zp','volt',.8],[.12,'im','volt',.8]],
 [[0,'wh','volt',.7,.2],[0,'pr','volt',.6,.16],[.2,'bg','volt',.9]],
 [[0,'ch','volt',.8,.5],[.5,'gr','volt',.7,.5],...rp(6,.1,.5,'sw','volt',.6,.12),...rp(6,.1,.55,'zp','volt',.5),[1,'zp','volt',1.1],[1.28,'bg','volt',1.1]]],
/*Trident*/[[[0,'sw','tsunami',.6,.12],[0,'pr','tsunami',.7,.22],[.22,'sp','tsunami',.9]],
 [[0,'ch','tsunami',.7,.3],[.1,'wv','tsunami',.9,.7],[.55,'sp','tsunami',.9]],
 [[0,'ch','tsunami',.8,.6],[0,'dr','tsunami',.8],[.45,'wv','tsunami',.6,.6],[.6,'rr','tsunami',.9,1],[.9,'wv','tsunami',1,1],[1.3,'bg','tsunami',1.2]]],
/*Twin Eagle*/[[...rp(6,.07,0,'ls','vibra',.55),...rp(6,.07,.22,'im','vibra',.4)],
 [[0,'ch','vibra',.8,.45],[.45,'ls','vibra',.9],[.75,'bg','vibra',.9]],
 [[0,'ch','vibra',.9,.55],[.15,'ea','vibra',.9],...rp(14,.05,.55,'ls','vibra',.4),...rp(14,.05,.8,'im','vibra',.3),[1.45,'bg','vibra',1.2]]],
/*Riftreaper*/[[[0,'sw','lunar',.9,.25],[.02,'sg','lunar',.6],[.1,'pr','lunar',.5,.4],[.4,'im','lunar',.9]],
 [[0,'sw','lunar',.8,.25],[0,'po','lunar',.7,.5],[.35,'pr','lunar',.7,.4],[.72,'im','lunar',.9]],
 [[0,'ch','lunar',.9,.8],[.1,'bl','lunar',.8,.9],[.3,'sk','lunar',.5,1],[.9,'sw','lunar',1,.4],[1.35,'bg','lunar',1.2],[1.38,'bl','lunar',.6,.9,-5]]],
/*Ain Soph Aur*/[[[0,'bl','five',.5,.5,0],[.08,'bl','five',.5,.5,4],[.16,'bl','five',.5,.5,7],[.24,'bl','five',.5,.5,12],[.32,'bl','five',.5,.5,16],[0,'ch','five',.8,.9],[.9,'pr','five',1,.3],[1.2,'bg','five',1]],
 [[0,'ci','five',.8,.7],[0,'bl','five',.6,.9,0],[.6,'sw','fire',.8,.25],[.62,'pr','fire',.7,.5],[.72,'pr','tsunami',.8,.3],[1.02,'sp','tsunami',.8],[.84,'ra','earth',.7,.4,7],[.96,'ra','elec',.9,.35,5],[1.08,'wi','wind',.9,1],[1.63,'bg','wind',.8]],
 [[0,'bl','five',.7,.6,0],[.1,'bl','five',.6,.6,4],[.2,'bl','five',.6,.6,7],[.3,'ch','five',1,1.2],[.9,'ci','five',.8,.6],[1.55,'bg','five',1.3],[1.62,'bl','holy',.9,.8,0],[1.62,'bg','holy',1]]],
/*Sandalphon*/[[[0,'sw','holy',.9,.2],[.02,'sg','holy',.8],[.1,'pr','holy',.5,.3],[.38,'im','holy',.9]],
 [[0,'ci','holy',.7,.5],[0,'bl','holy',.6,.8,0],...rp(7,.07,.5,'pr','holy',.4,.28),...rp(7,.07,.78,'im','holy',.4)],
 [[0,'bl','holy',.9,1,-12],[0,'ch','holy',1,.9],[.1,'ci','holy',.8,.8],[.5,'ra','holy',.8,.95,14],[1.5,'bg','holy',1.3],[1.52,'bl','holy',.9,1,12]]],
/*Zadkiel*/[[[0,'fl','phantom',.7,.5],[.4,'im','phantom',.7]],
 [[0,'fl','phantom',.8,1],[0,'ci','phantom',.6,.5],...rp(8,.06,.5,'pr','phantom',.35,.32),...rp(8,.06,.82,'im','phantom',.35)],
 [[0,'bl','phantom',.8,1,0],[.4,'fl','phantom',1,1.4],[.4,'ci','phantom',.6,.8],[1,'ch','phantom',.9,.7],[1.75,'bg','phantom',1.2],[1.77,'bl','phantom',.8,1,12]]],
/*Gunbai*/[[[0,'sw','frost',.9,.25],[.05,'wi','frost',.6,.4],[.4,'im','frost',.8]],
 [[0,'wi','frost',.9,.9],[.3,'po','frost',.7,.8],[.55,'sh','frost',.8],[.75,'bg','frost',.8]],
 [[0,'ch','frost',.9,.5],[.1,'wi','frost',1,1.9],[.5,'ra','ice',.7,1.2,24],[.5,'po','frost',.9,1],[1.55,'bg','ice',1.1],[1.57,'sh','ice',1]]],
/*Camael*/[[[0,'sw','pyro',.9,.25],[.38,'bg','pyro',.8]],
 [[0,'ch','pyro',.8,.3],[.1,'ch','pyro',.6,.3],[.4,'dr','pyro',1],[.42,'ra','pyro',.6,.3,10]],
 [[0,'ch','pyro',.9,.5],[.1,'rr','pyro',.8,.6],[.45,'bg','pyro',.8],[.9,'sw','pyro',1,.4],[1.3,'bg','pyro',1.3],[1.35,'rr','pyro',.9,.8]]]];
function subB(v,d,f0){d=d||.5;f0=f0||64;T(f0,f0*.52,d,'sine',.85*v,0,{a:.004,rv:0,ps:[0,0]});T(f0*2,f0,d*.5,'sine',.3*v,0,{a:.002,rv:0,ps:[0,0]});}
const SUBK={im:.4,bg:1.1,dr:1.1,zp:.5,ch:.25,sw:.22,pr:.2,wv:.4,sp:.45,lb:.5,rr:.3,gr:.25,sh:.25,po:.3,tp:.3,ra:.35};
function sfxPlay(ev){const F=FAM[ev[2]]||FAM.holy,f=SK[ev[1]],v=ev[3]==null?1:ev[3];if(f)f(F,0,v,ev[4],ev[5]);const k=SUBK[ev[1]];if(k)subB(v*k,ev[1]==='bg'||ev[1]==='dr'?.8:.45);if((ev[1]==='bg'||ev[1]==='dr')&&v>=.9)duck(.4);}
/* suara khas tiap senjata (dimainkan di setiap serangan + saat dipilih di menu) */
const WSIG=[[[0,'bl','ice',.35,.5,0],[0,'wh','fire',.5,.25],[.05,'sh','ice',.3]],[[0,'ci','void',.5,.4],[0,'sh','void',.3]],[[0,'ci','cosmic',.5,.4],[.1,'bl','cosmic',.3,.6,12]],
[[0,'sn','nebula',.5,.4],[.1,'po','nebula',.4,.5]],[[0,'sg','holy',.7],[.08,'sg','shadow',.6]],[[0,'sk','soul',.5,.5],[0,'bn','soul',.4,.4]],
[[0,'cl','gamma',.6],[.1,'cl','gamma',.5],[.2,'ck','gamma',.5,.2]],[[0,'gr','volt',.5,.4],[.1,'zp','volt',.4]],[[0,'wv','tsunami',.5,.4],[.2,'sp','tsunami',.4]],
[[0,'ea','vibra',.7],[.05,'ls','vibra',.4],[.12,'ls','vibra',.4]],[[0,'bl','lunar',.5,.8,-7],[0,'sk','lunar',.4,.7]],
[[0,'bl','five',.5,.5,0],[.07,'bl','five',.5,.5,4],[.14,'bl','five',.5,.5,7],[.21,'bl','five',.5,.5,12],[.28,'bl','five',.5,.5,16]],
[[0,'bl','holy',.6,.8,-12],[.05,'ci','holy',.5,.4]],[[0,'fl','phantom',.6,.5],[0,'bl','phantom',.4,.6,12]],[[0,'wi','frost',.7,.5],[.1,'sh','ice',.3]],[[0,'rr','pyro',.6,.5],[0,'im','pyro',.5]]];
function sigPlay(w,mult){const g=WSIG[w];if(!g||!AU.ac||!AU.on||AU.ac.state!=='running')return;
  g.forEach(ev=>{const t=ev[0],e2=ev.slice();e2[3]=(e2[3]==null?1:e2[3])*mult;if(t<=.001)sfxPlay(e2);else setTimeout(()=>sfxPlay(e2),t*1000);});}
let lastSel=-1;function selSnd(){if(state!=='select'){lastSel=-1;return;}if(sel!==lastSel){lastSel=sel;sigPlay(sel,.9);subB(.5,.5,58);}}
/* jadwal suara mengikuti waktu efek (sinkron hit-stop) */
function audioTick(){if(!AU.ac||!AU.on||AU.ac.state!=='running')return;AU.pb=Math.max(-1,Math.min(1,(mon.pos.x-camX-W/2)/(W/2)));
  for(const e of fx){if(!e.sq){const rec=((e.nk?JREC:BREC)[e.w]||[])[e.i]||[];e.sq=rec.slice().sort((a,b)=>a[0]-b[0]);e.sj=0;sigPlay(e.w,e.nk?1.25:.8);if(e.nk){subB(.9,.7,56);duck(.5);}}
    while(e.sj<e.sq.length&&e.sq[e.sj][0]<=e.t+.001){sfxPlay(e.sq[e.sj]);e.sj++;}}}
function sfxHit(e,kill,crit){if(!AU.ac||!AU.on)return;const big=e.dmg>=300;
  N(.01,.4,0,{f0:3000,ty:'highpass'});T(320,85,.15,'sine',.45,0,{ws:1});subB(.35,.3,70);N(.09,.3,0,{f0:2200,f1:800,q:1.2,rv:.15});T(900,300,.08,'sine',.12,.01,{a:.002});
  if(crit){[1568,2093,2637].forEach((f,i)=>T(f,f,.45,'triangle',.14/(i+1),i*.04,{a:.002,rv:.5}));N(.1,.3,0,{f0:6000,ty:'highpass'});}
  if(big){T(70,28,.6,'sine',.65,0,{ws:1});N(.4,.4,0,{f0:700,f1:120,ty:'lowpass',rv:.4});}
  if(kill){T(520,55,.7,'sine',.5,.05,{ws:1});N(.6,.4,.05,{f0:3000,f1:300,q:1,rv:.4});[784,988,1318].forEach((f,i)=>T(f,f,.6,'triangle',.1,.2+i*.07,{a:.003,rv:.5}));}}
/* musik latar: pad + arpeggio lembut (menu/pilih) dan sedikit ritme saat bertarung */
const BG={step:0,next:0},CHD=[[57,60,64,67],[53,57,60,64],[48,52,55,59],[52,56,59,62]],SCL=[57,60,62,64,67,69,72,76],mf=m=>440*Math.pow(2,(m-69)/12);
function bgmTick(){const ac=AU.ac;if(!ac||ac.state!=='running'||!AU.on)return;const battle=state==='battle',sp=battle?.23:.31,o={bus:AU.bgm};
  if(BG.next<ac.currentTime)BG.next=ac.currentTime+.08;
  while(BG.next<ac.currentTime+.35){const st=BG.step,beat=st%16,bar=(st>>4)%4,ch=CHD[bar],at=BG.next-ac.currentTime;
    if(beat===0){ch.forEach((m,i)=>{T(mf(m),mf(m),sp*16,'sine',.07,at,{bus:AU.bgm,a:.9,lp:1500,rv:.45,uni:6});T(mf(m)*1.004,mf(m)*1.004,sp*16,'triangle',.04,at,{bus:AU.bgm,a:1.2,lp:900,rv:.4});
        if(i<3)T(mf(m-12),mf(m-12),sp*16,'sawtooth',.018,at,{bus:AU.bgm,a:1.6,lp:700,rv:.5,uni:9});});
      T(mf(ch[0]-24),mf(ch[0]-24),sp*8,'sine',.32,at,{bus:AU.bgm,a:.05});}
    if(beat===8)T(mf(ch[0]-24),mf(ch[0]-24),sp*6,'sine',.26,at,o);
    if(st%2===0){const nt=ch[[0,1,2,3,2,1,3,2][(st>>1)%8]]+24;T(mf(nt),mf(nt),.5,'triangle',battle?.065:.05,at,{bus:AU.bgm,a:.01,lp:3200,rv:.35});}
    if(st%4===0&&((st*7+bar*5)%9)>2){const nt=SCL[(st*3+bar*2+(st>>5))%8]+12;T(mf(nt),mf(nt),.7,'triangle',battle?.07:.06,at,{bus:AU.bgm,a:.02,lp:3800,rv:.55,vib:[5,mf(nt)*.004]});}
    if(battle){if(beat%4===0)T(130,36,.2,'sine',.44,at,o);if(beat===10)T(120,38,.16,'sine',.3,at,o);
      if(beat===4||beat===12){N(.16,.12,at,{f0:2200,q:.8,bus:AU.bgm,rv:.3});T(210,120,.1,'triangle',.1,at,o);}
      if(st%2===0)N(.04,.07,at,{f0:8000,ty:'highpass',bus:AU.bgm});
      if(st%2===1)T(mf(ch[0]-24),mf(ch[0]-24),.18,'sawtooth',.06,at,{bus:AU.bgm,lp:420,a:.005});}
    BG.step++;BG.next+=sp;}}
setInterval(bgmTick,90);
/* tombol suara + aktivasi audio saat sentuh pertama */
addEventListener('pointerdown',auResume,true);addEventListener('keydown',auResume,true);
function setSnd(v){AU.on=v;if(AU.m)AU.m.gain.value=v?.9:0;try{localStorage.setItem('aeth_mute',v?'0':'1')}catch(_){}}
cv.addEventListener('pointerdown',e=>{const m=ptr(e);if(dist(m,SNDB)<SNDB.r+6){e.stopImmediatePropagation();e.preventDefault();auResume();setSnd(!AU.on);}},true);
addEventListener('keydown',e=>{if(e.key==='m'||e.key==='M')setSnd(!AU.on);});
function drawSnd(){const b=SNDB;ctx.save();ctx.globalAlpha=.85;circ({x:b.x,y:b.y,r:b.r},'rgba(13,8,38,.7)','rgba(201,166,255,.7)',1.5);
  ctx.fillStyle='#fff';ctx.fillRect(b.x-6,b.y-2,3,4);ctx.beginPath();ctx.moveTo(b.x-3,b.y-2);ctx.lineTo(b.x+1,b.y-5);ctx.lineTo(b.x+1,b.y+5);ctx.lineTo(b.x-3,b.y+2);ctx.closePath();ctx.fill();
  if(AU.on){ctx.strokeStyle='#fff';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(b.x+1,b.y,4,-.9,.9);ctx.stroke();ctx.beginPath();ctx.arc(b.x+1,b.y,7,-.9,.9);ctx.stroke();}
  else{ctx.strokeStyle='#ff5a5a';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(b.x+3,b.y-4);ctx.lineTo(b.x+8,b.y+4);ctx.moveTo(b.x+8,b.y-4);ctx.lineTo(b.x+3,b.y+4);ctx.stroke();}ctx.restore();}
/* hit: suara kena musuh */
const _hitA=hit;hit=function(e){const hp=mon.hp,al=mon.alive;_hitA(e);
  if(al&&mon.hp<hp){const d=dtx[dtx.length-1];sfxHit(e,!mon.alive,!!(d&&/!$/.test(d.txt)));}};
/* update: audio tick + kamera peta lebar */
const _upd2=update;update=function(dt){audioTick();_upd2(dt);camX+=(clamp(pl.pos.x-W/2,0,WW-W)-camX)*Math.min(1,dt*8);};

/* ===== UPGRADE v6: peta sedang + alam (pohon, batu, rumput) yang menghalangi + banyak monster + dash ===== */
let MONS=[];
const SPALS={g:SPAL,b:{g:hex('#4aa8ff'),h:hex('#c0e8ff'),e:hex('#0a2040'),m:hex('#0a2040'),d:hex('#2a6ad0')},
 r:{g:hex('#ff5a4a'),h:hex('#ffc8b0'),e:hex('#401010'),m:hex('#401010'),d:hex('#c02a2a')},
 p:{g:hex('#a05af0'),h:hex('#e4c0ff'),e:hex('#200a40'),m:hex('#200a40'),d:hex('#6a2ab0')},
 k:{g:hex('#f0c840'),h:hex('#fff4b0'),e:hex('#402808'),m:hex('#402808'),d:hex('#c08a18')}};
const DSB={x:W-194,y:H-40,r:19},dsh={t:0,cd:0,dir:V(1,0)},dTr=[];
function initMonsters(){MONS=MDEF.map(d=>({pos:V(d.x,d.y),hp:d.hp,max:d.hp,flash:0,alive:true,rt:0,ph:Math.random()*6,kb:0,kd:1,name:d.n,pk:d.pk,sc:d.sc,r:d.sc*5,
  home:V(d.x,d.y),tg:V(d.x,d.y),wt:Math.random()*2,sp:d.sp,leash:d.sc>4?40:80,glow:d.glow,crown:!!d.crown}));
  mon=MONS[0];lm=mon;pl.pos=V(SPAWN.x,SPAWN.y);camX=clamp(SPAWN.x-W/2,0,WW-W);camY=clamp(SPAWN.y-H/2,0,WH-H);dsh.t=0;dsh.cd=0;dTr.length=0;}
const _rbW=resetBattle;resetBattle=function(){_rbW();initMonsters();};
/* tabrakan dengan alam */
function resolveObs(p,rad){for(let it=0;it<2;it++)for(const o of OBS){const dx=p.x-o.x,dy=p.y-o.y,mn=o.r+rad,d2=dx*dx+dy*dy;if(d2<mn*mn){const d=Math.sqrt(d2)||.01;p.x=o.x+dx/d*mn;p.y=o.y+dy/d*mn;}}return p;}
function resolveMons(p,rad){for(const m of MONS){if(!m.alive)continue;const dx=p.x-m.pos.x,dy=p.y-m.pos.y,mn=rad+m.r*.85,d2=dx*dx+dy*dy;if(d2<mn*mn){const d=Math.sqrt(d2)||.01;p.x=m.pos.x+dx/d*mn;p.y=m.pos.y+dy/d*mn;}}return p;}
/* AI monster: berkeliaran di sekitar sarangnya */
function stepMon(m,dt){
  if(!m.alive){if(m!==mon){m.rt-=dt;if(m.rt<=0){m.alive=true;m.hp=m.max;}}return;}
  if(m!==mon){m.ph+=dt;m.flash=Math.max(0,m.flash-dt);if(m.kb>0){m.kb-=dt;m.pos.x+=m.kd*60*dt*(m.kb/.2);}}
  m.wt-=dt;if(m.wt<=0){m.wt=2+Math.random()*3;const a=Math.random()*TAU,r=Math.random()*m.leash;m.tg=V(m.home.x+Math.cos(a)*r,m.home.y+Math.sin(a)*r*.7);}
  const d=sub(m.tg,m.pos),L=len(d);if(L>6&&!(m.kb>0)){const sp=m.sp*(.4+.6*Math.abs(Math.sin(m.ph*3)));m.pos=add(m.pos,mul(d,sp*dt/L));}
  for(const o2 of MONS){if(o2===m||!o2.alive)continue;const dx=m.pos.x-o2.pos.x,dy=m.pos.y-o2.pos.y,mn=(m.r+o2.r)*.9,dd=Math.hypot(dx,dy)||.01;if(dd<mn){const k=(mn-dd)*.5;m.pos.x+=dx/dd*k;m.pos.y+=dy/dd*k;}}
  resolveObs(m.pos,m.r);m.pos.x=clamp(m.pos.x,30,WW-30);m.pos.y=clamp(m.pos.y,50,WH-40);}
function pickTarget(){let best=null,bd=1e9;for(const m of MONS)if(m.alive){const d=dist(m.pos,pl.pos);if(d<bd){bd=d;best=m;}}
  if(!best)return;if(mon.alive&&dist(mon.pos,pl.pos)<=bd+45)return;mon=best;lm=mon;}
/* serangan semua monster dalam jangkauan */
const _hitM=hit;hit=function(e){const cur=mon;e.hit=true;for(const m of MONS){if(!m.alive)continue;mon=m;_hitM(e);}mon=cur;};
/* skill terhalang pohon / batu */
function blockFx(e){const f=e.from,t=e.to,dx=t.x-f.x,dy=t.y-f.y,L=Math.hypot(dx,dy);if(L<8)return;let best=9;
  for(const o of OBS){const R2=(o.r+3)*(o.r+3),ox=f.x-o.x,oy=f.y-o.y,c0=ox*ox+oy*oy-R2;if(c0<0)continue;const a=dx*dx+dy*dy,b=2*(ox*dx+oy*dy),disc=b*b-4*a*c0;if(disc<0)continue;const t1=(-b-Math.sqrt(disc))/(2*a);if(t1>=0&&t1<=1&&t1<best)best=t1;}
  if(best<=1){const k=Math.max(0,best*L-4)/L;e.to=V(f.x+dx*k,f.y+dy*k);e.blk=true;spark(e.to,e.pal,14,130);
    dtx.push({pos:add(e.to,V(-24,-30)),txt:'TERHALANG',t:0,col:[210,210,225,1],sz:11});if(AU.ac&&AU.on){sfxPlay([0,'im','earth',.8]);}}}
const _castB=cast;cast=function(i,mult,force){const n=fx.length;_castB(i,mult,force);if(fx.length>n)blockFx(fx[fx.length-1]);};
/* dash */
function doDash(){if(state!=='battle'||dsh.t>0||dsh.cd>0||pl.lock>0)return;let d=V(0,0);
  if(Math.hypot(joy.x,joy.y)>.15)d=V(joy.x,joy.y);else{if(keys.has('a')||keys.has('ArrowLeft'))d.x-=1;if(keys.has('d')||keys.has('ArrowRight'))d.x+=1;if(keys.has('w')||keys.has('ArrowUp'))d.y-=1;if(keys.has('s')||keys.has('ArrowDown'))d.y+=1;}
  if(!d.x&&!d.y)d=V(pl.face,0);dsh.dir=norm(d);dsh.t=.17;dsh.cd=1.1;if(Math.abs(dsh.dir.x)>.1)pl.face=dsh.dir.x>0?1:-1;
  const c=pal(LIST[sel].pal);for(let k=0;k<12;k++)parts.push({p:V(pl.pos.x+Math.random()*10-5,pl.pos.y-2),v:V(-dsh.dir.x*70+Math.random()*40-20,-15-Math.random()*30),l:.35,m:.35,c:k%2?c[1]:[210,200,160,1]});
  if(AU.ac&&AU.on){SK.ru(FAM.wind,0,.9,.28);subB(.4,.22,78);}}
cv.addEventListener('pointerdown',e=>{if(state!=='battle')return;if(dist(ptr(e),DSB)<DSB.r+8)doDash();});
addEventListener('keydown',e=>{if(state==='battle'&&!e.repeat&&(e.key==='Shift'||e.key==='e'||e.key==='E'))doDash();});
/* update utama dunia */
const _upd3=update;update=function(dt){
  pickTarget();for(const m of MONS)stepMon(m,dt);
  _upd3(dt);
  if(dsh.cd>0)dsh.cd-=dt;
  if(dsh.t>0){const step=Math.min(dsh.t,dt),dd=step*480,n=Math.max(1,Math.ceil(dd/5));for(let i=0;i<n;i++){pl.pos=V(pl.pos.x+dsh.dir.x*dd/n,pl.pos.y+dsh.dir.y*dd/n);resolveObs(pl.pos,9);}dsh.t-=dt;dTr.push({p:V(pl.pos.x,pl.pos.y),t:1});}
  for(let i=dTr.length-1;i>=0;i--){dTr[i].t-=dt*5;if(dTr[i].t<=0)dTr.splice(i,1);}
  resolveObs(pl.pos,9);resolveMons(pl.pos,9);pl.pos.x=clamp(pl.pos.x,16,WW-16);pl.pos.y=clamp(pl.pos.y,50,WH-30);
  camY+=(clamp(pl.pos.y-H/2,0,WH-H)-camY)*Math.min(1,dt*8);};
/* gambar dunia: alam, monster, karakter diurutkan menurut kedalaman (y) */
function drawObs(o,fade2){const s=(o.k==='tree'?TSPR:RSPR)[o.s];if(fade2){ctx.save();ctx.globalAlpha=.5;}ctx.drawImage(s.cv,Math.round(o.x-s.ax),Math.round(o.y-s.ay));if(fade2)ctx.restore();}
function drawMon(m){const sc=m.sc,k=sc/3,hop=Math.abs(Math.sin(m.ph*3))*4*k,mp=add(m.pos,V(0,-hop)),sp2=SPALS[m.pk]||SPAL;
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(m.pos.x,m.pos.y-1,22*k,6*k,0,0,TAU);ctx.fill();
  for(const[dx,dy]of[[-3,0],[3,0],[0,-3],[0,3]])spr(SLIME,sp2,add(mp,V(dx,dy)),false,[0,0,0,1],sc);
  spr(SLIME,sp2,mp,false,m.flash>0?[3,3,3,1]:[1,1,1,1],sc);
  if(m.crown){const cx=Math.floor(mp.x),cy=Math.floor(mp.y)-10*sc;ctx.fillStyle='#ffd24a';ctx.fillRect(cx-12,cy-6,24,6);for(const dx of[-12,-2,8])ctx.fillRect(cx+dx,cy-14,4,8);ctx.fillStyle='#ff4a5a';ctx.fillRect(cx-1,cy-5,3,3);ctx.fillStyle='#b88a18';ctx.fillRect(cx-12,cy-1,24,1);}
  ctx.save();ctx.globalCompositeOperation='lighter';gl(add(mp,V(0,-14*k)),m.glow,18*k,.15);ctx.restore();
  const bw=30*k,bx=m.pos.x-bw/2,by=m.pos.y-10*sc-hop-(m.crown?26:12);
  ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(bx-1,by-1,bw+2,5);ctx.fillStyle=m===mon?'#ff4a5a':'#c03a48';ctx.fillRect(bx,by,bw*clamp(m.hp/m.max,0,1),3);
  if(m===mon){const ty=by-7+Math.sin(tg*6)*2;ctx.fillStyle='#ffd35a';ctx.beginPath();ctx.moveTo(m.pos.x-4,ty-3);ctx.lineTo(m.pos.x+4,ty-3);ctx.lineTo(m.pos.x,ty+2);ctx.closePath();ctx.fill();}}
function drawGhost(g){ctx.save();ctx.globalAlpha=clamp(g.t,0,1)*.45;const o=pl.pos;pl.pos=g.p;drawPlayer();pl.pos=o;ctx.restore();}
function drawEntities(){const L=[],x0=camX-70,x1=camX+W+70,y0=camY-30,y1=camY+H+130;
  for(const o of OBS)if(o.x>x0&&o.x<x1&&o.y>y0&&o.y<y1+60)L.push([o.y,0,o]);
  for(const m of MONS)if(m.alive)L.push([m.pos.y,1,m]);
  for(const g of dTr)L.push([g.p.y-1,2,g]);
  L.push([pl.pos.y,3,null]);L.sort((a,b)=>a[0]-b[0]);
  for(const it of L){if(it[1]===0){const o=it[2],bh=o.k==='tree'&&pl.pos.y<o.y&&pl.pos.y>o.y-74&&Math.abs(pl.pos.x-o.x)<30;drawObs(o,bh);}else if(it[1]===1)drawMon(it[2]);else if(it[1]===2)drawGhost(it[2]);else drawPlayer();}}
/* tombol dash + minimap */
function drawWorldHud(){if(state!=='battle')return;const b=DSB,c=pal(LIST[sel].pal);ctx.save();
  circ(b,'rgba(13,8,38,.88)',dsh.cd>0?'rgba(160,160,180,.8)':css(c[1]),3);
  ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(b.x-9,b.y-7);ctx.lineTo(b.x-2,b.y);ctx.lineTo(b.x-9,b.y+7);ctx.moveTo(b.x+1,b.y-7);ctx.lineTo(b.x+8,b.y);ctx.lineTo(b.x+1,b.y+7);ctx.stroke();
  if(dsh.cd>0){ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.arc(b.x,b.y,b.r,-PI/2,-PI/2+TAU*(dsh.cd/1.1));ctx.closePath();ctx.fillStyle='rgba(0,0,0,.7)';ctx.fill();}
  txt('DASH',b.x,b.y-24,9,'#d8c8ff','center');
  const mx=W-108,my=44,mw=100,mh=38,sx=mw/WW,sy=mh/WH;ctx.fillStyle='rgba(8,4,24,.55)';ctx.fillRect(mx,my,mw,mh);ctx.strokeStyle='rgba(201,166,255,.6)';ctx.lineWidth=1;ctx.strokeRect(mx+.5,my+.5,mw-1,mh-1);
  ctx.strokeStyle='rgba(255,255,255,.35)';ctx.strokeRect(mx+camX*sx,my+camY*sy,W*sx,H*sy);
  for(const o of OBS){ctx.fillStyle=o.k==='tree'?'#2a9a58':'#8a8fb8';ctx.fillRect(mx+o.x*sx-1,my+o.y*sy-1,2,2);}
  for(const m of MONS)if(m.alive){ctx.fillStyle=m===mon?'#ffd35a':'#ff5a5a';const s=m.sc>4?4:3;ctx.fillRect(mx+m.pos.x*sx-s/2,my+m.pos.y*sy-s/2,s,s);}
  ctx.fillStyle='#fff';ctx.fillRect(mx+pl.pos.x*sx-1.5,my+pl.pos.y*sy-1.5,3,3);ctx.restore();}
/* ===== UPGRADE v7: audio lebih gahar + nyaring sesuai elemen, visual Basic ATK & Jurus tiap senjata lebih megah ===== */
const WFAM=['fireice','void','cosmic','nebula','shadow','soul','gamma','volt','tsunami','vibra','lunar','five','holy','phantom','frost','pyro'];
const WST=['ice','void','star','nebula','blade','soul','chain','volt','water','eagle','moon','five','holy','ghost','frost','pyro'];
/* rantai output baru: EQ tebal + presence + saturasi + kompresor + limiter keras */
const _ai7=auInit;
auInit=function(){const had=AU.ac;_ai7();const ac=AU.ac;if(had||!ac)return;
 try{const m=AU.m;m.disconnect();
  const mk=(ty,f,g,q)=>{const b=ac.createBiquadFilter();b.type=ty;b.frequency.value=f;b.gain.value=g;if(q)b.Q.value=q;return b};
  const lo=mk('lowshelf',95,9),md=mk('peaking',420,-2,.9),pr=mk('peaking',3200,5,1.1),ai=mk('highshelf',8500,4.5);
  const ws=ac.createWaveShaper(),cv=new Float32Array(2048);for(let i=0;i<2048;i++){const x=i/1024-1;cv[i]=Math.tanh(x*2.2)/Math.tanh(2.2);}ws.curve=cv;ws.oversample='4x';
  const cp=ac.createDynamicsCompressor();cp.threshold.value=-24;cp.knee.value=12;cp.ratio.value=6;cp.attack.value=.002;cp.release.value=.14;
  const mu=ac.createGain();mu.gain.value=1.45;
  const lm=ac.createDynamicsCompressor();lm.threshold.value=-1.5;lm.knee.value=0;lm.ratio.value=20;lm.attack.value=.0008;lm.release.value=.06;
  m.connect(lo);lo.connect(md);md.connect(pr);pr.connect(ai);ai.connect(ws);ws.connect(cp);cp.connect(mu);mu.connect(lm);lm.connect(ac.destination);
  AU.sfx.gain.value=1.3;}catch(_){}};
/* lapisan suara khas tiap elemen (a=jeda, v=volume, h=1 untuk ledakan besar/jurus) */
const glass=(v,a,n)=>{for(let i=0;i<n;i++)FMT(3200+R()*5200,2.76+R(),1.6,.35+R()*.3,v*.2,a+i*.035+R()*.03,{rv:.45});N(.05,v*.6,a,{f0:7500,ty:'highpass'});};
const ELX={
fire(a,v,h){N(.45+h*.4,.7*v,a,{f0:1600,f1:110,ty:'lowpass',q:.8,rv:.3});for(let i=0;i<8+h*8;i++)N(.03,.6*v,a+R()*.5,{f0:900+R()*3600,q:5});T(95,34,.5,'sawtooth',.38*v,a,{lp:650,ws:1});T(2600,1100,.1,'square',.1*v,a,{lp:6000});},
ice(a,v,h){glass(v,a,5+h*5);T(1400,350,.18,'triangle',.2*v,a,{ws:1});N(.2,.35*v,a,{f0:5000,f1:1500,q:3,rv:.4});},
fireice(a,v,h){ELX.fire(a,v*.8,h);ELX.ice(a+.03,v*.8,h);},
void(a,v,h){T(62,30,.7+h*.5,'sawtooth',.4*v,a,{lp:380,ws:1,uni:25});FMT(210,1.41,2.4,.9,.2*v,a,{rv:.5});FMT(3100,1.618,1.5,.5,.12*v,a+.02,{rv:.55});N(.3,.4*v,a,{f0:200,f1:2400,q:6,a:.25,rv:.4});},
cosmic(a,v,h){for(let i=0;i<6+h*4;i++)FMT(1568*Math.pow(2,[0,2,4,7,9,12,14,16,19,21][i]/12),3.01,1,.5,.13*v,a+i*.05,{rv:.55});N(.35,.35*v,a,{f0:600,f1:7000,q:2,a:.3,rv:.4});T(110,880,.3,'sine',.22*v,a,{a:.2});},
nebula(a,v,h){N(.7,.6*v,a,{f0:250,f1:3500,q:4,a:.4,sw:.7,ps:[-.9,.9],rv:.5});T(70,45,.8,'sine',.3*v,a,{rv:.3});FMT(520,1.5,2,.8,.14*v,a,{rv:.6});},
shadow(a,v,h){T(80,38,.5+h*.4,'sawtooth',.42*v,a,{lp:450,ws:1,uni:15});N(.12,.7*v,a,{f0:6500,ty:'highpass'});FMT(300,1.2,2.8,.4,.18*v,a,{rv:.4});},
holy(a,v,h){[1047,1319,1568,2093].forEach((f,i)=>FMT(f,3.5,1.1,1.4+h*.6,.17*v/(1+i*.2),a+i*.03,{rv:.6}));N(.18,.35*v,a,{f0:6000,ty:'highpass',rv:.3});T(262,262,.9,'sine',.2*v,a,{a:.2,rv:.5,uni:8});},
soul(a,v,h){T(240,520,.8,'sine',.3*v,a,{a:.25,vib:[7,18],uni:9,rv:.5});N(.7,.3*v,a,{f0:1600,f1:700,q:8,a:.3,rv:.5});FMT(160,1.5,2,.7,.16*v,a,{rv:.5});},
gamma(a,v,h){FMT(880,2.76,2.6,.5,.3*v,a,{rv:.25});FMT(1330,5.4,1.5,.35,.2*v,a,{rv:.25});N(.04,.8*v,a,{f0:7000,ty:'highpass'});T(180,60,.2,'square',.25*v,a,{lp:1500});},
volt(a,v,h){N(.012,v,a,{f0:4000,ty:'highpass'});T(3400,70,.25+h*.2,'sawtooth',.4*v,a,{a:.001,lp:7000,ws:1});T(118,100,.35,'sawtooth',.2*v,a,{lp:900,ws:1});for(let i=0;i<4+h*6;i++){const t=a+R()*.4;T(2400+R()*2000,200,.06,'square',.18*v,t,{a:.001});N(.03,.5*v,t,{f0:5000,ty:'highpass'});}},
tsunami(a,v,h){N(.7+h*.6,.9*v,a,{f0:300,f1:2200,q:.7,a:.3,sw:.5,rv:.4});N(.9,.5*v,a+.2,{f0:1400,f1:200,ty:'lowpass',rv:.5});T(75,30,.7,'sine',.45*v,a+.1,{ws:1});for(let i=0;i<6;i++){const f=300+R()*600;T(f,f*2,.09,'sine',.2*v,a+R()*.5,{a:.004});}},
vibra(a,v,h){T(4200,500,.14,'square',.2*v,a,{lp:7000,a:.001});T(2800,360,.2,'sawtooth',.18*v,a+.02,{lp:6000,a:.001});FMT(2400,1,3,.2,.14*v,a,{rv:.2,dl:.4});N(.05,.5*v,a,{f0:8000,ty:'highpass'});},
lunar(a,v,h){FMT(330,1.5,1.8,1.6,.26*v,a,{rv:.6});FMT(494,2.01,1.2,1.3,.16*v,a+.05,{rv:.6});T(220,330,.9,'sine',.2*v,a,{a:.3,vib:[5,10],uni:12,rv:.6});N(.3,.3*v,a,{f0:7000,ty:'highpass',rv:.4});},
phantom(a,v,h){for(let i=0;i<8+h*8;i++)N(.04,.35*v,a+i*.04,{f0:2500+R()*3000,q:4,ps:[-.9+R()*1.8,0]});[392,494,587].forEach(f=>T(f,f*1.01,1,'sine',.14*v,a,{a:.3,vib:[6,f*.01],uni:10,rv:.6}));},
frost(a,v,h){N(.9+h*.5,.6*v,a,{f0:600,f1:3600,q:5,a:.4,sw:.6,rv:.4});glass(v*.8,a+.1,4+h*4);T(1200,300,.25,'triangle',.15*v,a,{ws:1});},
pyro(a,v,h){ELX.fire(a,v*1.1,1);T(60,28,.8,'sine',.55*v,a,{ws:1});N(.3,.8*v,a,{f0:500,f1:90,ty:'lowpass',q:.6,rv:.4});},
earth(a,v,h){T(55,26,.7,'sine',.65*v,a,{ws:1});N(.4,.7*v,a,{f0:700,f1:80,ty:'lowpass',q:.7,rv:.3});for(let i=0;i<6;i++)N(.04,.6*v,a+.03+R()*.3,{f0:500+R()*900,q:5});},
wind(a,v,h){N(.8,.6*v,a,{f0:300,f1:3000,q:3,a:.4,sw:.6,ps:[-.8,.8],rv:.4});T(400,1400,.6,'sine',.12*v,a,{a:.3,vib:[9,60]});},
elec(a,v,h){ELX.volt(a,v,h);},
five(a,v,h){['fire','tsunami','earth','wind','elec'].forEach((k,i)=>ELX[k](a+i*.05,v*.55,h));ELX.holy(a+.2,v*.8,h);}};
const _sp7=sfxPlay;
sfxPlay=function(ev){const v=ev[3]==null?1:ev[3],k=ev[1],x=ev.slice();x[3]=v*(k==='bg'||k==='dr'?1.25:1.35);_sp7(x);
 if(!AU.ac||!AU.on||AU.n>105)return;const L=ELX[ev[2]];if(!L)return;const h=(k==='bg'||k==='dr')?1:0;
 if(h||k==='sp'||k==='zp')L(0,Math.min(1.1,v)*(h?.95:.45),h);
 else if(k==='im')L(0,v*.4,0);
 else if(k==='ch'&&(ev[4]||0)>=.45){N(ev[4],.5*v,0,{f0:400,f1:9000,ty:'highpass',a:ev[4]*.9,q:.5});T(300,2600,ev[4],'sine',.16*v,0,{a:ev[4]*.9,uni:10,rv:.4});}
 else if(k==='sw'||k==='sg'){N(.1,.45*v,0,{f0:6500,ty:'highpass',q:.6});T(2400,3600,.12,'sine',.1*v,0,{a:.002,rv:.3});}};
const _sh7=sfxHit;
sfxHit=function(e,kill,crit){_sh7(e,kill,crit);if(!AU.ac||!AU.on)return;const big=e.dmg>=300,L=ELX[WFAM[e.w]];
 N(.02,.9,0,{f0:4500,ty:'highpass'});T(2600,400,.12,'sawtooth',.2,0,{lp:6000,ws:1});if(L)L(.01,big?.85:.45,big?1:0);};
/* ---- visual: efek khas tiap senjata (jejak, aura cast, impak) ---- */
const VT={ice:[2,3,3,6,0],void:[2,5,2,4,.5],star:[3,4,2,8,0],nebula:[3,9,3,10,0],blade:[2,7,1,3,0],soul:[2,6,2,5,0],chain:[2,4,6,9,0],volt:[2,9,4,0,1],water:[3,8,2,7,0],eagle:[2,3,1,2,.3],moon:[2,8,1,3,0],five:[5,7,2.5,8,0],holy:[2,5,2,4,0],ghost:[3,10,3,9,0],frost:[3,9,2.5,9,0],pyro:[3,6,3,6,.4]};
function cast7(e,f,P,L){const ult=e.nk&&e.i===2,p=e.t/e.dur,k=Math.sin(clamp(p/(ult?.5:.3),0,1)*PI);if(p>(ult?.5:.3)||k<=0)return;
 const c0=add(e.from,V(0,4)),n=3+(e.w%6)+(e.nk?2:0),r=(20+10*L)*(.7+k*.5);
 parc(c0,r,0,TAU,[P[0],P[2],P[0]],k*.8,.38);parc(c0,r*.6,0,TAU,[P[1]],k*.6,.38);
 for(let i=0;i<n;i++){const a=e.t*(ult?6:4)+TAU*i/n,b=a+TAU/n*2;tline(add(c0,V(Math.cos(a)*r,Math.sin(a)*r*.38)),add(c0,V(Math.cos(b)*r,Math.sin(b)*r*.38)),[P[1],P[2]],k*.9);}
 for(let i=0;i<Math.floor(8*L);i++){const a=hr(i*3+e.w)*TAU,q=(e.t*1.5+hr(i))%1,rr=r*1.4*(1-q);dot(V(c0.x+Math.cos(a)*rr,c0.y+Math.sin(a)*rr*.4-q*26*L),fade(P[i%3],k*(1-q)),2);}
 if(e.nk||e.i===2){const h=(40+30*L)*k;ctx.fillStyle=css(fade(P[1],.18*k));ctx.fillRect(f.x-4*L,f.y-h-10,8*L,h+14);ctx.fillStyle=css(fade(WHITE,.3*k));ctx.fillRect(f.x-1,f.y-h-10,2,h+14);}}
function trail7(e,st,f,t,P,L,ht){const p=e.t/e.dur,u=clamp(p/ht,0,1.15),d=sub(t,f);if(e.self||u<=0||p>ht+.18||len(d)<1)return;
 const[ns,am,fq,sp,jg]=VT[st],dir=norm(d),pv=V(-dir.y,dir.x),fa=1-Math.max(0,(p-ht)/.18);
 for(let s=0;s<ns;s++){const ph=TAU*s/ns;for(let k=0;k<16;k++){const q=clamp(u-k*.035,0,1),w=Math.sin(q*fq*PI+ph+e.t*sp)*am*L*(.4+k/22)+(jg?(hr(k*7+s+Math.floor(e.t*30))-.5)*am*jg*2:0);
  dot(add(lerpV(f,t,q),mul(pv,w)),fade(P[s%3],(1-k/16)*fa*.9),Math.max(2,Math.floor((4-k*.2)*L*.8)));}}
 const hp=lerpV(f,t,Math.min(1,u));gl(hp,P[0],14*L,.5*fa);gl(hp,WHITE,6*L,.5*fa);
 if(Math.floor(e.t*40)%2)for(const[x,y]of[[6,0],[-6,0],[0,6],[0,-6]])dot(V(hp.x+x*L,hp.y+y*L),fade(P[2],fa),2);}
function imp7(st,c,P,L,k,e){const al=1-k,ez=1-Math.pow(1-k,3),rad=(50+30*L)*ez,sd=e.seed||0,fl=Math.floor;
 const sp=(n,ln,col,up)=>{for(let i=0;i<n;i++){const a=up?-PI/2+(hr(i+sd)-.5)*1.3:TAU*i/n+hr(sd)*3,l=ln*ez*(.5+.5*hr(i*5+sd)),b=add(c,V(Math.cos(a)*rad*.2,up?6:Math.sin(a)*rad*.14)),tp=add(b,V(Math.cos(a)*l,Math.sin(a)*l*(up?1:.7)));tline(b,tp,col,al);dot(tp,fade(WHITE,al),3);}};
 gl(c,P[0],rad*.9,.3*al);
 switch(st){
 case'ice':sp(fl(10*L),rad*1.3,[P[1],WHITE],0);for(let i=0;i<fl(6*L);i++)dot(V(c.x+(hr(i+sd)-.5)*rad*2,c.y-50*(1-k)+hr(i*3)*60*k),fade(P[1],al),3);break;
 case'void':sp(fl(7*L),rad*1.5,[P[0],P[2]],1);parc(add(c,V(0,8)),rad,0,TAU,[P[0],P[1]],al*.8,.3);break;
 case'star':sp(fl(8*L),rad*1.6,[P[2],P[1]],0);parc(c,rad*.7,0,TAU,[P[1]],al,.7);for(let i=0;i<4;i++){const a=PI/4+i*PI/2;tline(c,add(c,V(Math.cos(a)*rad*1.8,Math.sin(a)*rad*1.2)),[WHITE],al*.8);}break;
 case'nebula':for(let a=0;a<3;a++)for(let i=0;i<14;i++){const q=i/14,an=TAU*a/3+q*5-k*7,rr=rad*(1-q*.8);dot(add(c,V(Math.cos(an)*rr,Math.sin(an)*rr*.6)),fade(P[(i+a)%3],al),3);}break;
 case'blade':for(const s of[-1,1])tline(add(c,V(-rad*1.1,-s*rad*.6)),add(c,V(rad*1.1,s*rad*.6)),[s>0?P[1]:P[0],WHITE],al);parc(c,rad*.5,0,TAU,[P[2]],al,.6);break;
 case'soul':sp(fl(6*L),rad*1.2,[P[1],P[0]],1);skull(add(c,V(0,-30*k-10)),fade(P[1],al),2);break;
 case'chain':sp(8,rad*1.2,[P[0],WHITE],0);parc(c,rad,0,TAU,[P[1],WHITE],al,.6);break;
 case'volt':for(let i=0;i<3;i++){let a=add(c,V((i-1)*18,-110));for(let j=1;j<=8;j++){const b=j===8?c:V(lerp(a.x,c.x,.4)+(hr(j*9+i+fl(e.t*25))-.5)*30,a.y+(c.y-a.y)/(9-j));tline(a,b,[P[1],WHITE],al);a=b;}}sp(8,rad,[P[0],P[1]],0);break;
 case'water':parc(c,rad,0,TAU,[P[0],P[1]],al,.55);parc(c,rad*.6,0,TAU,[P[1],WHITE],al,.55);for(let i=0;i<12;i++)dot(V(c.x+(hr(i+sd)-.5)*rad*1.6,c.y-Math.sin(k*PI)*(20+hr(i*3)*50)),fade(P[1],al),3);break;
 case'eagle':for(const s of[-1,1])for(let j=0;j<4;j++)tline(add(c,V(0,-6-j*3)),add(c,V(s*(20+j*14)*ez*L,-18-j*9)),[P[j%2],WHITE],al);parc(c,rad*.5,0,TAU,[P[0],P[1]],al,.6);tline(add(c,V(-rad*.8,0)),add(c,V(rad*.8,0)),[WHITE],al*.7);tline(add(c,V(0,-rad*.5)),add(c,V(0,rad*.5)),[WHITE],al*.7);break;
 case'moon':for(let i=0;i<3;i++)parc(add(c,V(0,-10)),rad*(.5+i*.3),-PI*.85,-PI*.15,[P[0],P[1],WHITE],al*(1-i*.2),.7);break;
 case'five':for(let i=0;i<5;i++){const col=hex(E5[i]);parc(c,rad*(.4+i*.22),0,TAU,[col,WHITE],al,.6);}for(let i=0;i<5;i++){const a=k*3+TAU*i/5,b=k*3+TAU*((i+2)%5)/5;tline(add(c,V(Math.cos(a)*rad,Math.sin(a)*rad*.6)),add(c,V(Math.cos(b)*rad,Math.sin(b)*rad*.6)),[hex(E5[i]),WHITE],al);}break;
 case'holy':{const h=150*ez;ctx.fillStyle=css(fade(P[1],.25*al));ctx.fillRect(c.x-8*L*(1-k*.5),c.y-h,16*L*(1-k*.5),h);ctx.fillStyle=css(fade(WHITE,.5*al));ctx.fillRect(c.x-2,c.y-h,4,h);sp(8,rad*1.3,[P[0],WHITE],0);for(let i=0;i<8;i++)dot(V(c.x+(hr(i+sd)-.5)*50,c.y-k*80-hr(i)*40),fade(P[2],al),3);break;}
 case'ghost':for(let i=0;i<fl(10*L);i++){const a=TAU*i/fl(10*L)+k*2;motif('wing',add(c,V(Math.cos(a)*rad,Math.sin(a)*rad*.5-k*40)),P,4,a);}break;
 case'frost':for(let i=0;i<6;i++){const a=i*PI/3+k,b=add(c,V(Math.cos(a)*rad*1.2,Math.sin(a)*rad*.8));tline(c,b,[WHITE,P[1]],al);tline(lerpV(c,b,.6),add(lerpV(c,b,.6),V(Math.cos(a+.8)*rad*.3,Math.sin(a+.8)*rad*.2)),[P[1]],al);}break;
 case'pyro':for(let i=0;i<14;i++)dot(V(c.x+(hr(i+sd)-.5)*30,c.y-hr(i*3)*110*ez),fade(P[i%3],al),4);parc(add(c,V(0,10)),rad*1.2,0,TAU,[P[0],P[1]],al,.3);sp(10,rad,[P[1],P[2]],1);break;}}
const _d7=drawFx;
drawFx=function(e){const st=WST[e.w]||'holy',P=e.pal,ult=e.nk&&e.i===2,L=e.nk?(ult?2.4:1.5):(e.i%3===2?1.5:(e.i%3===1?1.2:1)),ht=HITT[e.type]||.4,f=add(e.from,V(0,-14)),t=add(e.to,V(0,-14));
 ctx.save();ctx.globalCompositeOperation='lighter';cast7(e,f,P,L);ctx.restore();_d7(e);
 ctx.save();ctx.globalCompositeOperation='lighter';trail7(e,st,f,t,P,L,ht);
 const tt=e.t-ht*e.dur,k=tt/(ult?.8:.55);if(tt>0&&k<1)imp7(st,add(e.to,V(0,-4)),P,L,k,e);ctx.restore();};
const _h7=hit;
hit=function(e){_h7(e);if(!e.hit)return;if(e.nk&&e.i===2){shake=Math.max(shake,12);hs=Math.max(hs,.18);flash=Math.max(flash,.6);}else if(e.i===2)shake=Math.max(shake,7);};

/* ===== UPGRADE v8: SFX & VFX per tipe serangan (slash arc, thrust, spin, tracer, homing, AoE, eruption, impact frame, chromatic, squash&stretch) ===== */
const CLS=['pn','th','th','sp','sl','or','ch','cl','th','gn','sl','or','sl','or','sp','sl'];
const SX={
wh(v,p){N(.22,.5*v,0,{f0:300*p,f1:4200*p,q:1.2,a:.1,ps:PS()});},
quick(v,p){N(.12,.6*v,0,{f0:1200*p,f1:7000*p,q:1.5,a:.03});T(2800*p,1400*p,.08,'sine',.12*v,0,{a:.002});},
heavy(v,p){N(.4,.8*v,0,{f0:150*p,f1:2200*p,q:.9,a:.2,sw:.6});T(110*p,45,.35,'sawtooth',.3*v,0,{lp:500,ws:1});},
thrust(v,p){N(.15,.7*v,0,{f0:900*p,f1:6000*p,q:2,a:.02});T(900*p,2400*p,.1,'triangle',.2*v,0,{a:.002});FMT(1800*p,2.76,1.5,.25,.15*v,.06,{rv:.2});},
pierce(v){N(.02,.9*v,0,{f0:4000,ty:'highpass'});T(260,70,.25,'sine',.55*v,0,{ws:1});FMT(2200,3.1,2,.2,.18*v,0,{rv:.2});},
clank(v,p){FMT(900*p,2.76,2.5,.45,.3*v,0,{rv:.25});FMT(1400*p,5.4,1.5,.3,.2*v,0,{rv:.25});N(.03,.7*v,0,{f0:7000,ty:'highpass'});},
thud(v,p){T(140*p,40,.22,'sine',.8*v,0,{ws:1});N(.08,.6*v,0,{f0:800,f1:200,ty:'lowpass'});N(.015,.5*v,0,{f0:3000,ty:'highpass'});},
smash(v){T(95,24,.7,'sine',v,0,{ws:1});T(190,50,.4,'sawtooth',.35*v,0,{lp:700,ws:1});N(.5,.8*v,0,{f0:1800,f1:90,ty:'lowpass',rv:.4});N(.02,.8*v,0,{f0:3500,ty:'highpass'});},
spin(v,p){for(let i=0;i<4;i++)N(.18,.4*v,i*.12,{f0:400*p,f1:3000*p,q:2,a:.05,ps:[-.7,.7]});T(300*p,520*p,.5,'sine',.1*v,0,{vib:[14,30]});},
cut(v,p){N(.3,.7*v,0,{f0:2500*p,f1:7000*p,q:6,a:.05,ps:[-.8,.8]});T(1800*p,3800*p,.25,'sine',.1*v,0,{a:.02});},
hum(v,p){const d=.45;T(110*p,220*p,d,'sawtooth',.2*v,0,{a:d*.8,lp:900,uni:14,rv:.3});T(440*p,880*p,d,'sine',.12*v,0,{a:d*.8,rv:.4});N(d,.25*v,0,{f0:300,f1:6000,ty:'highpass',a:d*.9});},
shat(v){glass(v,0,8);N(.3,.5*v,0,{f0:6000,ty:'highpass',rv:.3});},
launch(v,p){T(600*p,100,.14,'square',.2*v,0,{lp:5000,a:.001});N(.06,.6*v,0,{f0:2500,f1:500,q:1.5});T(120,50,.12,'sine',.5*v,0,{ws:1});},
beam(v){const d=1;T(220,230,d,'sawtooth',.28*v,0,{lp:2500,uni:20,a:.05,rv:.3});T(1760,1800,d,'square',.1*v,0,{lp:5000,a:.05,vib:[30,40]});N(d,.4*v,0,{f0:2000,f1:5000,q:2,a:.1});},
crit(v){[1568,2093,2637,3136].forEach((f,i)=>FMT(f,3.5,1,.5,.16*v,i*.035,{rv:.5}));N(.02,.8*v,0,{f0:6000,ty:'highpass'});T(240,50,.3,'sine',.5*v,0,{ws:1});},
erupt(v){T(50,24,1,'sine',.9*v,0,{ws:1});N(.9,.8*v,0,{f0:500,f1:70,ty:'lowpass',rv:.4});for(let i=0;i<8;i++)N(.05,.6*v,.05+R()*.5,{f0:500+R()*1500,q:4});},
shock(v){T(80,20,.9,'sine',.9*v,0,{ws:1,ps:[0,0]});N(.5,.5*v,0,{f0:6000,f1:300,q:.8,a:.01,rv:.5});},
xform(v,p){for(let i=0;i<7;i++)FMT(880*p*Math.pow(2,[0,4,7,12,16,19,24][i]/12),3,1,.5,.12*v,i*.06,{rv:.55});N(.6,.4*v,0,{f0:500,f1:9000,ty:'highpass',a:.5});},
thunder(v){ELX.volt(0,.8*v,1);},surge(v){ELX.tsunami(0,.8*v,0);},
fin(v,p){SX.heavy(v,p);SX.shock(v);SX.crit(v*.7);}};
const S8=[['thud','thud','smash'],['thrust','launch','erupt'],['thrust','spin','beam'],['spin','spin','xform'],['quick','quick','heavy'],['launch','launch','xform'],['clank','clank','heavy'],['quick','quick','thunder'],['thrust','cut','surge'],['launch','launch','beam'],['quick','spin','heavy'],['xform','launch','beam'],['quick','heavy','xform'],['launch','launch','xform'],['cut','spin','cut'],['heavy','smash','smash']];
const I8=['shat','pierce','pierce','shock','clank','shock','clank','thunder','surge','pierce','shock','shock','crit','shock','shat','erupt'];
const _at8=audioTick;
audioTick=function(){_at8();if(!AU.ac||!AU.on||AU.ac.state!=='running'||AU.n>110)return;
 for(const e of fx){if(!e.s8){e.s8=1;const ult=e.nk&&e.i===2,v=(e.nk?1.1:.8)*(ult?1.2:1),p=e.nk?1:1+Math.min(cmb,5)*.05,f=SX[S8[e.w][e.i%3]];if(ult||(!e.nk&&e.i%3===2))SX.hum(v*.8,p);if(f)f(v,p);}
  if(e.hit&&!e.h8){e.h8=1;const ult=e.nk&&e.i===2,v=ult?1.2:(e.nk?.9:.65),f=SX[I8[e.w]];if(f)f(v,1);if(ult)SX.fin(v,1);else if(e.nk)SX.shock(v*.5);}}};
const _sh8=sfxHit;
sfxHit=function(e,kill,crit){_sh8(e,kill,crit);if(AU.ac&&AU.on&&crit)SX.crit(1);};
/* ---- VFX ---- */
let IF=0,CA=0,IFc=WHITE;
const cA=document.createElement('canvas'),cB=document.createElement('canvas');
function chroma(k){const w=cv.width,h=cv.height;if(cA.width!==w){cA.width=cB.width=w;cA.height=cB.height=h;}
 const a=cA.getContext('2d'),b=cB.getContext('2d');a.globalCompositeOperation='source-over';b.globalCompositeOperation='source-over';
 a.drawImage(cv,0,0);a.globalCompositeOperation='multiply';a.fillStyle='#ff2020';a.fillRect(0,0,w,h);
 b.drawImage(cv,0,0);b.globalCompositeOperation='multiply';b.fillStyle='#20c0ff';b.fillRect(0,0,w,h);
 const o=3+6*k;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.45*k;ctx.drawImage(cA,0,0,w,h,-o,0,W,H);ctx.drawImage(cB,0,0,w,h,o,0,W,H);ctx.restore();}
const _u8=update;update=function(dt){IF=Math.max(0,IF-dt);CA=Math.max(0,CA-dt);_u8(dt);};
const _dh8=drawHud;
drawHud=function(){if(CA>0)chroma(Math.min(1,CA/.3));
 const u=fx.find(e=>e.nk&&e.i===2&&e.t<.7);if(u){ctx.fillStyle='rgba(0,0,0,'+(.35*Math.sin(Math.min(1,u.t/.5)*PI))+')';ctx.fillRect(0,0,W,H);}
 if(IF>0){const k=IF/.09;if(k>.62){ctx.fillStyle='rgba(255,255,255,.88)';ctx.fillRect(0,0,W,H);}else{ctx.fillStyle='rgba(0,0,12,.62)';ctx.fillRect(0,0,W,H);ctx.save();ctx.globalCompositeOperation='lighter';
  for(let i=0;i<30;i++){const a=TAU*i/30+hr(i)*.3,r0=40+hr(i*3)*50;tline(V(W/2+Math.cos(a)*r0,H/2+Math.sin(a)*r0*.7),V(W/2+Math.cos(a)*300,H/2+Math.sin(a)*210),[IFc,WHITE],1);}ctx.restore();}}
 _dh8();};
const _hh8=hit;
hit=function(e){const hp=mon.hp,al=mon.alive;_hh8(e);if(!al||mon.hp>=hp)return;const ult=e.nk&&e.i===2,big=e.dmg>=300,d=dtx[dtx.length-1],crit=!!(d&&/!$/.test(d.txt));
 spark(add(mon.pos,V(0,-14)),e.pal,ult?40:(big?26:12),ult?280:200);
 for(let i=0;i<(ult?16:8);i++)parts.push({p:V(mon.pos.x+(Math.random()-.5)*24,mon.pos.y+4),v:V((Math.random()-.5)*110,-20-Math.random()*40),l:.5,m:.5,c:[200,185,150,1]});
 mon.kb=Math.max(mon.kb||0,ult?.38:(big?.3:.22));if(ult||crit){IF=ult?.1:.06;IFc=e.pal[1];}CA=ult?.35:(crit?.2:(big?.15:0));hs=Math.max(hs,ult?.2:(crit?.1:0));};
/* squash & stretch + anticipation + afterimage */
const _dp8=drawPlayer;
drawPlayer=function(){if(pl.hidden)return _dp8();const c=pl.cast,pos=pl.pos;let sx=1,sy=1;
 if(c>.38){const k=(c-.38)/.12;sx=1+.12*k;sy=1-.14*k;}else if(c>.2){const k=(c-.2)/.18;sx=1-.1*k;sy=1+.16*k;}else if(c>0){const k=c/.2;sx=1+.05*k;sy=1-.05*k;}
 if(c>.2){const cc=pal(LIST[sel].pal)[1];for(let g=3;g<=4;g++)spr(PA2,cpal(),V(pos.x-pl.face*g*8,pos.y-1),pl.face<0,[cc[0]/255,cc[1]/255,cc[2]/255,.2/(g-2)],2);}
 if(sx===1&&sy===1)return _dp8();ctx.save();ctx.translate(pos.x,pos.y);ctx.scale(sx,sy);ctx.translate(-pos.x,-pos.y);_dp8();ctx.restore();};
function slash8(e,f,t,P,L,ht){const p=e.t/e.dur,u=p/Math.max(.14,ht*.9);if(u<=0||u>1.5)return;const fc=pl.face||1,c=add(f,V(fc*6,-2)),r=32+14*L,fo=Math.min(1,(1.5-u)*2.5),b=fc>0?-1.2:PI+1.2,dr=fc>0?2.4:-2.4;
 const sw=(a0,a1,rr,cols,al)=>{for(let g=0;g<7;g++){const uu=clamp(u-g*.06,0,1),ae=lerp(a0,a1,uu),as=lerp(a0,a1,Math.max(0,uu-.4));parc(c,rr+g,as,ae,cols,(1-g/7)*al*fo,.85);}const ep=lerp(a0,a1,clamp(u,0,1));gl(add(c,V(Math.cos(ep)*rr,Math.sin(ep)*rr*.85)),WHITE,7*L,.6*fo);};
 sw(b,b+dr,r,[P[0],P[1],WHITE],.9);if(e.i%3>=1||e.nk)sw(b+dr,b+dr*.05,r*.8,[P[2],P[1],P[0]],.8);if(e.i%3===2&&(e.nk||e.i===2))sw(b+dr*.5,b+dr*1.4,r*1.25,[WHITE,P[1],P[0]],.7);}
function thrust8(e,f,t,P,L,ht){const p=e.t/e.dur,u=clamp(p/Math.max(.1,ht),0,1.1),d=sub(t,f);if(u<=0||p>ht+.12||len(d)<1)return;const dir=norm(d),pv=V(-dir.y,dir.x),ln=Math.min(len(d),120)*(.5+.5*Math.min(1,u)),al=1-Math.max(0,(p-ht)/.12);
 for(let g=-3;g<=3;g++){const o=g*3*L*(1-Math.min(1,u)*.5);tline(add(f,mul(pv,o)),add(add(f,mul(dir,ln)),mul(pv,o*.3)),[P[g&1?0:1],WHITE],al*(1-Math.abs(g)/4));}gl(add(f,mul(dir,ln)),WHITE,10*L,.6*al);}
function spin8(e,f,t,P,L,ht){const p=e.t/e.dur,u=clamp(p/Math.max(.15,ht),0,1.1),al=1-Math.max(0,(p-ht)/.15);if(e.self||p>ht+.15||u<=0)return;
 for(let g=0;g<5;g++){const q=clamp(u-g*.07,0,1),pos=lerpV(f,t,q),rt=e.t*18-g*.6,a=1-g/5;
  if(e.w===3)chak(pos,fade(P[0],.7*a*al),fade(P[1],.8*a*al),rt);else{parc(pos,9*L,rt,rt+2.4,[P[0],P[1],WHITE],a*al,1);parc(pos,5*L,rt+PI,rt+PI+2,[P[1]],a*al*.7,1);}}
 gl(lerpV(f,t,Math.min(1,u)),P[0],10*L,.5*al);}
function gun8(e,f,t,P,L,ht){const d=sub(t,f);if(len(d)<1)return;const dir=norm(d),pv=V(-dir.y,dir.x),ang=angOf(d),n=e.nk?(e.i===2?10:4):(e.i===1?5:2);
 for(let i=0;i<n;i++){const x=e.t-i*(e.nk?.05:.06);if(x<0||x>.2)continue;const m=add(add(f,mul(dir,10)),mul(pv,(i%2?4:-4)+(i%3-1)*3));
  if(x<.07){const k=1-x/.07;gl(m,WHITE,10*k*L*.7,.9*k);for(let j=0;j<5;j++){const a=ang+(j-2)*.45;tline(m,add(m,V(Math.cos(a)*(14+8*L)*k,Math.sin(a)*(14+8*L)*k)),[P[1],WHITE],k);}}
  const u=clamp(x/.12,0,1),h=lerpV(m,t,u),tl=lerpV(m,t,Math.max(0,u-.35));tline(tl,h,[P[0],WHITE,P[1]],1-x/.2);}
 if(e.nk&&e.i===2){const x=e.t-.55;if(x>0&&x<.9){const k=Math.sin(x/.9*PI),pw=Math.sin(e.t*40)*.2+.8;for(let j=-2;j<=2;j++)tline(add(f,mul(pv,j*2*L)),add(t,mul(pv,j*L)),[P[j&1?0:1],WHITE],k*pw*(1-Math.abs(j)/3));gl(t,WHITE,16*L,.7*k);}}}
function whip8(e,f,t,P,L,ht){const p=e.t/e.dur,u=clamp(p/Math.max(.12,ht),0,1),al=1-Math.max(0,(p-ht)/.2),d=sub(t,f);if(p>ht+.2||e.self||len(d)<1)return;const dir=norm(d),pv=V(-dir.y,dir.x);let pr=f;
 for(let q=.05;q<=1.001;q+=.05){const w=Math.sin(q*PI)*30*L*(1-u*.6)*Math.cos(e.t*20+q*6),pos=add(lerpV(f,t,q*u),mul(pv,w));tline(pr,pos,[P[0],WHITE],al);if(Math.round(q*20)%2)dot(pos,fade(P[1],al),4);pr=pos;}gl(pr,WHITE,8*L,.7*al);}
function claw8(e,f,t,P,L,ht){const tt=e.t-ht*e.dur+.1;if(tt<0||tt>.3)return;const k=tt/.3,al=1-k,m=Math.min(1,k*2.5);
 for(let j=-1;j<=1;j++){const a=add(t,V(-28+j*7,-30+j*10)),b=add(t,V(28+j*7,30+j*10));tline(a,lerpV(a,b,m),[P[1],WHITE,P[0]],al);}
 if(e.i%3===2||e.nk)for(let j=-1;j<=1;j++){const a=add(t,V(28+j*7,-30+j*10)),b=add(t,V(-28+j*7,30+j*10));tline(a,lerpV(a,b,m),[P[0],WHITE],al*.8);}}
function home8(e,f,t,P,L,ht){const n=e.nk?(e.i===2?9:5):(e.i===2?5:3),ds=Math.max(.2,ht*e.dur);
 for(let i=0;i<n;i++){const x=(e.t-i*.06)/ds;if(x<0||x>1)continue;const c1=add(f,V((hr(i+e.seed)-.5)*120,-30-hr(i*3)*60)),pt=q=>lerpV(lerpV(f,c1,q),lerpV(c1,t,q),q);
  for(let k=6;k>=0;k--)dot(pt(clamp(x-k*.045,0,1)),fade(P[i%3],(1-k/7)*(1-x*.3)),Math.max(2,4-k*.4));gl(pt(x),P[0],8*L,.6);}}
function aoe8(e,P,L,ht){if(!(e.nk&&e.i>=1)&&!(!e.nk&&e.i===2))return;const p=e.t/e.dur;if(p>ht+.35)return;const c=add(e.to,V(0,4)),k=Math.sin(clamp(p/ht,0,1)*PI*.5),r=(34+30*L)*(p<ht?.6+.4*k:1+(p-ht)*.8),al=p<ht?.7*k:Math.max(0,.7-(p-ht)*2);
 parc(c,r,0,TAU,[P[0],P[1],P[0]],al,.36);parc(c,r*.7,0,TAU,[P[2]],al*.8,.36);const n=5+(e.w%4);
 for(let i=0;i<n;i++){const a=e.t*2+TAU*i/n,b=a+TAU*2/n;tline(add(c,V(Math.cos(a)*r*.7,Math.sin(a)*r*.25)),add(c,V(Math.cos(b)*r*.7,Math.sin(b)*r*.25)),[P[1]],al*.8);dot(V(c.x+Math.cos(-e.t*1.5+TAU*i/n)*r*.85,c.y+Math.sin(-e.t*1.5+TAU*i/n)*r*.3),fade(WHITE,al),3);}}
const ERU={0:1,1:1,7:1,8:1,15:1};
function eru8(e,P,L,tt){const c=add(e.to,V(0,6)),k=clamp(tt/.5,0,1),hh=Math.sin(k*PI),n=Math.floor(6+5*L);
 for(let i=0;i<n;i++){const x=c.x+(hr(i+e.seed)-.5)*(80+40*L),y=c.y+(hr(i*3)-.5)*20,H=(20+hr(i*7)*50)*L*hh,w=(5+hr(i)*5)*(1-k*.3);
  for(let s=0;s<4;s++){ctx.fillStyle=css(fade(P[s%3],.9));ctx.fillRect(x-w*(1-s*.22)/2,y-H*(s+1)/4,w*(1-s*.22),H/4);}ctx.fillStyle=css(fade(WHITE,.9*hh));ctx.fillRect(x-1,y-H-2,2,3);}}
const _d8=drawFx;
drawFx=function(e){_d8(e);const P=e.pal,ult=e.nk&&e.i===2,L=e.nk?(ult?2.4:1.5):(e.i%3===2?1.5:(e.i%3===1?1.2:1)),ht=HITT[e.type]||.4,f=add(e.from,V(0,-14)),t=add(e.to,V(0,-14)),p=e.t/e.dur,cl=CLS[e.w];
 ctx.save();ctx.globalCompositeOperation='lighter';
 if(p<.4){const k=Math.sin(clamp(p/.4,0,1)*PI),h=V(f.x+(pl.face||1)*10,f.y-4);gl(h,P[1],12*L,.55*k);gl(h,WHITE,5*L,.5*k);}
 if(cl==='sl')slash8(e,f,t,P,L,ht);else if(cl==='th'||cl==='pn')thrust8(e,f,t,P,L,ht);else if(cl==='sp')spin8(e,f,t,P,L,ht);else if(cl==='gn')gun8(e,f,t,P,L,ht);
 else if(cl==='ch')whip8(e,f,t,P,L,ht);else if(cl==='cl')claw8(e,f,t,P,L,ht);else home8(e,f,t,P,L,ht);
 aoe8(e,P,L,ht);const tt=e.t-ht*e.dur,fin=e.nk?e.i>=1:e.i%3===2;
 if(tt>0&&tt<.6&&fin&&ERU[e.w])eru8(e,P,L,tt);
 if(tt>0&&tt<.5&&(e.nk||e.i%3===2)){const k=tt/.5,al=1-k;parc(add(e.to,V(0,10)),(40+50*L)*(1-Math.pow(1-k,3)),0,TAU,[P[1],WHITE],al*.8,.3);parc(add(e.to,V(0,10)),(26+34*L)*(1-Math.pow(1-k,3)),0,TAU,[P[0]],al*.6,.3);}
 ctx.restore();};

initMonsters();
