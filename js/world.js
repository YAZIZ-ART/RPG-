
(()=>{
'use strict';
const T=16,W=144,H=108,WW=W*T,WH=H*T,$=id=>document.getElementById(id);
const mb=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const hs=(x,y)=>{let h=Math.imul(x|0,374761393)+Math.imul(y|0,668265263)|0;h=Math.imul(h^h>>>13,1274126177);return((h^h>>>16)>>>0)/4294967296};
const cv=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const mk=(w,h,f)=>{const c=cv(w,h);f(c.getContext('2d'),w,h);return c};
const px=(g,x,y,c,w=1,h=1)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h)};
const cl=(v,a,b)=>v<a?a:v>b?b:v;
const C=s=>{const n=parseInt(s.slice(1),16);return(255<<24)|((n&255)<<16)|(n&0xff00)|(n>>16)};
const mkN=s=>{const r=mb(s),g=new Float32Array(65536);for(let i=0;i<65536;i++)g[i]=r();const q=(a,b)=>g[(a&255)|((b&255)<<8)];
 return(x,y)=>{const xi=Math.floor(x),yi=Math.floor(y);let u=x-xi,v=y-yi;u=u*u*(3-2*u);v=v*v*(3-2*v);const a=q(xi,yi),b=q(xi+1,yi),c=q(xi,yi+1),d=q(xi+1,yi+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}};
const fb=(n,x,y)=>n(x,y)*.6+n(x*2.1+5,y*2.1+7)*.3+n(x*4.3,y*4.3)*.1;

/* ===== SPRITE (digambar lewat kode) ===== */
const SP={},R0=mb(5);
const GP=[['#0f3a1e','#1b6a2b','#38993a','#8cd24c'],['#0b3a2e','#16604a','#2a9060','#7bd68e'],['#1a4a18','#2f7a24','#62b030','#b8e45c']];
function blob(g,cx,cy,rx,ry,p){for(let y=-ry;y<=ry;y++)for(let x=-rx;x<=rx;x++){const d=x*x/(rx*rx)+y*y/(ry*ry);if(d>1)continue;const l=.52-(x/rx*.3+y/ry*.42)+(R0()-.5)*.42-d*.22;let k=l>.8?3:l>.52?2:l>.24?1:0;if(y>0&&d>.78)k=0;px(g,cx+x,cy+y,p[k])}}
function trunk(g,cx,by,tw,th,fl){for(let i=0;i<th;i++){const w=tw+(i<fl?(fl-i)*2:0),x0=Math.round(cx-w/2),y=by-i;px(g,x0,y,'#6b4a2c',w,1);px(g,x0,y,i%4===1?'#a07a46':'#8a6238');px(g,x0+w-1,y,'#33210f');if(w>3)px(g,x0+w-2,y,'#4a3019');if(R0()<.06)px(g,x0+1+((R0()*(w-3))|0),y,'#3f8a3c')}}
SP.tree=[0,1,2].map(v=>mk(48,64,g=>{trunk(g,24,63,6,30,5);for(const[a,b,c,d]of[[13,27,10,8],[35,27,10,8],[24,29,11,7],[16,19,9,9],[32,19,9,9],[24,13,10,9],[24,7,7,5]])blob(g,a,b,c,d,GP[v])}));
SP.giant=[0,1].map(v=>mk(88,104,g=>{trunk(g,44,103,12,56,12);for(const[a,b,c,d]of[[18,54,16,12],[70,54,16,12],[44,58,20,10],[27,38,18,15],[61,38,18,15],[44,30,22,17],[44,13,15,11],[23,22,12,10],[65,22,12,10]])blob(g,a,b,c,d,GP[v]);
 for(let k=0;k<12;k++){const x=14+((R0()*60)|0),y0=56+((R0()*6)|0),l=8+((R0()*20)|0);px(g,x,y0,'#1d5a28',1,l);if(l>14)px(g,x+(R0()<.5?-1:1),y0+l-3,'#58b04a',1,2)}
 for(let k=0;k<7;k++){const a=R0()*6.28,r=R0()*14;px(g,44+Math.cos(a)*r*1.4,28+Math.sin(a)*r,'#ff5f6d',2,2)}}));
SP.palm=[0,1].map(v=>{const c=mk(44,56,g=>{const s=v?1:-1;let tx=20,ty=22;
 for(let i=0;i<34;i++){const x=20+Math.sin(i*.09)*4*s,y=55-i;px(g,x-2,y,'#8d6b3c',4,1);px(g,x-2,y,'#b08a52');px(g,x+1,y,'#5a4020');if(i%3===0)px(g,x-2,y,'#5a4020',4,1);if(i===33){tx=x;ty=y}}
 for(let k=0;k<9;k++){const a=k/9*6.283+.3,dx=Math.cos(a),sn=Math.sin(a);for(let t=0;t<=1.001;t+=.04){const x=tx+dx*t*15,y=ty-11*t+19.8*t*t+sn*4*t-2;px(g,x,y,t>.6?'#6fd04e':'#2f8f3c',2,2);px(g,x,y+2,'#1b5a2a');if(((t*25)|0)%3===0)px(g,x,y+3,'#3fa545',1,2)}}
 px(g,tx-2,ty+1,'#5a3a1a',3,3);px(g,tx+1,ty+2,'#4a2f14',3,3)});c.ax=20;return c});
const LP=['#14502a','#2a8a3a','#58b84a','#a6e060'];
function leafy(w,h,n,len,th,spread){return mk(w,h,g=>{const bx=w>>1,by=h-1;for(let k=0;k<n;k++){const dx=n>1?(k/(n-1)*2-1)*spread:0,ad=Math.abs(dx);for(let t=0;t<=1;t+=.05){const x=bx+dx*t*len,y=by-len*(t*1.1-t*t*(.5+.6*ad)),wv=Math.max(1,Math.round(th*Math.sin(Math.PI*t)+.5));px(g,x,y,LP[1],1,wv);px(g,x,y,LP[2]);px(g,x,y+(wv>>1),LP[wv>2?3:1])}}})}
SP.leaf=[leafy(40,34,5,16,5,1)];SP.fern=[leafy(22,18,7,9,2,1.1)];
SP.bush=[0,1,2].map(v=>mk(22,15,g=>{for(const[a,b,c,d]of[[7,8,6,5],[15,8,6,5],[11,6,7,6]])blob(g,a,b,c,d,GP[v])}));
SP.flower=['#ff5f8a','#ffd23f','#b57aff','#ff8a3c','#ffffff'].map(c=>mk(8,10,g=>{px(g,3,4,'#2c7a30',1,6);px(g,1,7,'#2c7a30',2,1);px(g,5,6,'#2c7a30',2,1);px(g,2,1,c,3,3);px(g,1,2,c,5,1);px(g,3,2,'#ffe066')}));
SP.mush=[mk(8,8,g=>{px(g,3,4,'#e8dcc0',2,4);px(g,1,1,'#d8383a',6,3);px(g,2,0,'#d8383a',4,1);px(g,2,1,'#fff');px(g,5,2,'#fff')})];
SP.rock=[0,1].map(()=>mk(20,13,g=>{blob(g,10,7,9,5,['#2b3333','#555f62','#8a979a','#c4d0d2']);for(let k=0;k<6;k++)px(g,4+((R0()*11)|0),2+((R0()*3)|0),'#4a9a3a',2,1)}));
SP.log=[mk(30,12,g=>{px(g,5,2,'#6b4a2c',24,8);px(g,5,2,'#8a6238',24,2);px(g,5,9,'#3a2616',24,1);for(let k=0;k<4;k++)px(g,9+k*5,4,'#4a3019',1,4);px(g,2,2,'#b08a52',5,8);px(g,3,3,'#8a6238',3,6);px(g,4,5,'#5a4020',1,2);px(g,12,1,'#3f9a3c',8,2)})];
SP.reed=[0,1,2].map(()=>mk(12,20,g=>{for(let k=0;k<5;k++){const x=1+k*2,h=10+((R0()*8)|0);px(g,x,19-h,'#3f9a3c',1,h);px(g,x,19-h,'#8bd44a');if(k%2)px(g,x,17-h,'#6b3f1f',2,3)}}));
SP.lily=[0,1].map(v=>mk(14,8,g=>{for(let y=-3;y<=3;y++){const w=Math.round(6*Math.sqrt(1-y*y/10.5));px(g,7-w,4+y,y<0?'#58c050':'#2f9a3a',w*2,1)}g.clearRect(7,4,6,1);if(v){px(g,5,2,'#ff9ac2',3,2);px(g,6,2,'#fff0f5')}}));
SP.tuft=[0,1].map(()=>mk(10,9,g=>{for(let k=0;k<5;k++){const h=4+((R0()*4)|0);px(g,1+k*2,8-h,k%2?'#6fc24f':'#3f9a3c',1,h)}}));
const sh=(rx,ry)=>mk(rx*2+1,ry*2+1,g=>{for(let y=-ry;y<=ry;y++){const w=Math.round(rx*Math.sqrt(1-y*y/(ry*ry+.01)));px(g,rx-w,ry+y,'#000',w*2+1,1)}});
SP.shT=sh(13,4);SP.shG=sh(24,6);SP.shS=sh(7,2);
const GL=mk(32,32,g=>{const r=g.createRadialGradient(16,16,0,16,16,16);r.addColorStop(0,'rgba(220,255,140,1)');r.addColorStop(.25,'rgba(190,255,110,.55)');r.addColorStop(1,'rgba(190,255,110,0)');g.fillStyle=r;g.fillRect(0,0,32,32)});

/* ===== GENERASI DUNIA ===== */
const PL=[['#103f5e','#14506e','#1a6482','#217a94'],['#2f9aa8','#3aaab2','#4cc0c0','#66d0c8'],['#43361f','#55442a','#6a5636','#8a7448'],['#2f7a2c','#3b8a34','#4aa03c','#5db445'],['#143d20','#1b4f27','#256030','#2f7436'],['#5e4224','#74512d','#8a6438','#a07a48']].map(a=>a.map(C));
let ter,blk,wc,wm,OB,mm;
const P={x:0,y:0,d:0,st:0,mv:0};
function build(seed){
 const N1=mkN(seed),N2=mkN(seed+1),N3=mkN(seed+2),R=mb(seed+3);
 ter=new Uint8Array(W*H);blk=new Uint8Array(W*H);
 const noT=new Uint8Array(W*H),tv=new Uint8Array(W*H),wdA=new Float32Array(W*H),cA=new Float32Array(W*H);
 const CL=[[.40,.30,16],[.18,.22,13],[.80,.80,15],[.45,.52,11],[.86,.24,11]];
 for(let ty=0;ty<H;ty++)for(let tx=0;tx<W;tx++){
  const i=ty*W+tx,rx=W*.62+Math.sin(ty*.07)*13+Math.sin(ty*.021+1)*9,rw=2.8+Math.sin(ty*.11+2);
  const wd=Math.min(Math.abs(tx-rx)-rw,Math.hypot((tx-W*.22)/1.35,ty-H*.72)-9)+(fb(N1,tx*.12,ty*.12)-.5)*3.5;
  let c=0;for(const[a,b,r]of CL)c=Math.max(c,1-(Math.hypot((tx-a*W)/1.3,ty-b*H)+(fb(N1,tx*.1,ty*.1)-.5)*6)/r);
  c=cl(c,0,1);const m=fb(N2,tx*.05,ty*.05);
  let t=wd<-1.6?0:wd<0?1:wd<1.3?2:(m>.5&&c<.45?4:3);
  const y0=H*.5+Math.sin(tx*.05)*9+Math.sin(tx*.13+1)*3,x0=W*.42+Math.sin(ty*.06+2)*8+Math.sin(ty*.15)*2;
  const pd=Math.min(Math.abs(ty-y0),Math.abs(tx-x0))+(fb(N3,tx*.2,ty*.2)-.5)*1.2;
  if(pd<1.05&&t>=2)t=5;else if(pd<1.7&&t<2)t=1;
  if((t===3||t===4)&&c>.25&&fb(N3,tx*.1+30,ty*.1)>.62)t=5;
  if(pd<2.3)noT[i]=1;
  ter[i]=t;tv[i]=(fb(N3,tx*.25,ty*.25)*255)|0;wdA[i]=wd;cA[i]=c;
  if(tx<1||ty<1||tx>=W-1||ty>=H-1)blk[i]=1}
 OB=[];
 const near=(tx,ty,r)=>{for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++){const a=tx+x,b=ty+y;if(a>=0&&b>=0&&a<W&&b<H&&blk[b*W+a])return true}return false};
 const add=(arr,tx,ty,o={})=>{const s=arr[(R()*arr.length)|0];OB.push({s,x:tx*T+8+((R()*8)|0)-4,y:ty*T+14+((R()*3)|0),...o})};
 const pick=l=>{let r=R(),a=0;for(const[w,arr,o]of l){a+=w;if(r<a){add(arr,l.tx,l.ty,o);return}}};
 const UJ=[[.3,SP.fern,{k:.6}],[.25,SP.leaf,{k:.6}],[.2,SP.bush,{k:.5,sh:SP.shS}],[.1,SP.flower],[.1,SP.mush],[.05,SP.tuft]];
 const UG=[[.3,SP.flower],[.3,SP.tuft],[.2,SP.bush,{k:.5,sh:SP.shS}],[.1,SP.fern,{k:.6}],[.05,SP.leaf,{k:.6}],[.05,SP.mush]];
 for(let ty=0;ty<H;ty++)for(let tx=0;tx<W;tx++){
  const i=ty*W+tx,t=ter[i];if(blk[i])continue;
  const r=R(),edge=Math.min(tx,ty,W-1-tx,H-1-ty);
  if(t===3||t===4){
   let p=noT[i]?0:cl((fb(N2,tx*.08+9,ty*.08+9)-.3)*1.5,0,.75)*(1-cA[i]*.97)+(t===4?.08:0);
   if(edge<4)p=.9;
   if(r<p&&!near(tx,ty,1)){const q=R();
    if(t===4&&q<.1&&!near(tx,ty,2)){add(SP.giant,tx,ty,{sh:SP.shG,c:1,k:.7,tr:2})}
    else if((wdA[i]<7&&q<.5)||q<.2)add(SP.palm,tx,ty,{sh:SP.shT,c:1,k:.9,tr:3});
    else add(SP.tree,tx,ty,{sh:SP.shT,c:1,k:.8,tr:1});
    blk[i]=1;continue}
   const rk=R();
   if(!noT[i]&&rk<.012){add(SP.rock,tx,ty,{sh:SP.shS});blk[i]=1;continue}
   if(!noT[i]&&rk>.997){add(SP.log,tx,ty,{sh:SP.shT});blk[i]=1;continue}
   if(R()<(t===4?.3:.15+cA[i]*.12)){const l=t===4?UJ:UG;l.tx=tx;l.ty=ty;pick(l)}
  }else if(t===1){if(R()<.05)add(SP.lily,tx,ty);else if(wdA[i]>-.6&&R()<.25)add(SP.reed,tx,ty,{k:.7})}
  else if(t===0){if(wdA[i]>-3.8&&R()<.015)add(SP.lily,tx,ty)}
  else if(t===2&&wdA[i]<.8&&R()<.35)add(SP.reed,tx,ty,{k:.7});
 }
 OB.sort((a,b)=>a.y-b.y);
 wc=cv(WW,WH);const wg=wc.getContext('2d'),id=wg.createImageData(WW,WH),u=new Uint32Array(id.data.buffer);wm=new Uint8Array(WW*WH);
 for(let y=0;y<WH;y++){const ty=y>>4,ly=y&15,dy=ly<8?ly:15-ly,ny=ty+(ly<8?-1:1);
  for(let x=0;x<WW;x++){const tx=x>>4,lx=x&15,dx=lx<8?lx:15-lx;let i=ty*W+tx;
   if(dx<3||dy<3){const nx=tx+(lx<8?-1:1);let ni=-1;
    if(dx<=dy){if(nx>=0&&nx<W)ni=ty*W+nx}else if(ny>=0&&ny<H)ni=ny*W+tx;
    if(ni>=0&&hs(x+99,y)<.5-Math.min(dx,dy)*.17)i=ni}
   const t=ter[i],k=cl((hs(x,y)*2.6+tv[i]/255*1.8-.8)|0,0,3);
   u[y*WW+x]=PL[t][k];if(t<2)wm[y*WW+x]=t?1:2}}
 wg.putImageData(id,0,0);
 for(let ty=0;ty<H;ty++)for(let tx=0;tx<W;tx++){const t=ter[ty*W+tx];
  if(t===3||t===4){for(let k=0;k<2;k++)if(R()<.6){const x=tx*T+1+((R()*14)|0),y=ty*T+3+((R()*12)|0);px(wg,x,y-2,t===4?'#2f8a3a':'#6fc24f',1,3);px(wg,x,y+1,'#1d5a2a')}}
  else if(t===5&&R()<.4){const x=tx*T+2+((R()*11)|0),y=ty*T+2+((R()*11)|0);px(wg,x,y,'#b5a07a',2,1);px(wg,x,y+1,'#4a3318',2,1)}}
 const mc=['#14506e','#3aaab2','#55442a','#3b8a34','#1b4f27','#8a6438'];
 mm=mk(W,H,m=>{for(let ty=0;ty<H;ty++)for(let tx=0;tx<W;tx++)px(m,tx,ty,mc[ter[ty*W+tx]]);for(const o of OB)if(o.tr)px(m,o.x>>4,o.y>>4,o.tr===2?'#0a2e16':'#165a28')});
 const sy=H>>1,sx=Math.round(W*.42+Math.sin(sy*.06+2)*8+Math.sin(sy*.15)*2);
 blk[sy*W+sx]=0;P.x=sx*T+8;P.y=sy*T+8;P.d=0}

/* ===== TAMPILAN ===== */
const cvs=$('c'),ctx=cvs.getContext('2d'),buf=cv(8,8),g=buf.getContext('2d'),ZT=[240,320,420,560,760];
let zi=2,dpr=1,cw=0,ch=0,S=3,bw=0,bh=0,sx=0,sy=0,tm=0,last=0,mi=0,ph=0,auto=false,joy=null;
const PH=[{n:'SIANG',m:[255,255,255],nt:0,sh:.5},{n:'PAGI',m:[255,214,182],nt:0,sh:1},{n:'SENJA',m:[255,164,110],nt:.15,sh:.6},{n:'MALAM',m:[70,96,170],nt:1,sh:0}];
const cur={m:[255,255,255],nt:0,sh:.5};
const FF=Array.from({length:40},()=>({x:Math.random(),y:Math.random(),a:Math.random()*6.28,v:.02+Math.random()*.03,p:Math.random()*6}));
const LV=Array.from({length:22},()=>({x:Math.random(),y:Math.random(),v:6+Math.random()*8,p:Math.random()*6,c:['#7bd34a','#c9a23a','#4fae45'][(Math.random()*3)|0]}));
function rs(){dpr=Math.min(devicePixelRatio||1,2.5);cw=cvs.width=Math.round(innerWidth*dpr);ch=cvs.height=Math.round(innerHeight*dpr);S=Math.max(1,Math.round(cw/ZT[zi]));bw=Math.ceil(cw/S);bh=Math.ceil(ch/S);buf.width=bw;buf.height=bh}
const walk=(x,y)=>{for(const[ax,ay]of[[-4,-2],[4,-2],[-4,1],[4,1]]){const X=Math.floor(x+ax),Y=Math.floor(y+ay);if(X<0||Y<0||X>=WW||Y>=WH)return false;const i=(Y>>4)*W+(X>>4);if(blk[i]||ter[i]===0)return false}return true};
const K={};
addEventListener('keydown',e=>{K[e.code]=1;if(e.code==='KeyM')tb();if(e.code==='KeyT')ct();if(e.code==='Equal'||e.code==='NumpadAdd')zm(1);if(e.code==='Minus'||e.code==='NumpadSubtract')zm(-1);if(e.code.startsWith('Arrow'))e.preventDefault()});
addEventListener('keyup',e=>K[e.code]=0);addEventListener('resize',rs);
cvs.addEventListener('pointerdown',e=>{joy={id:e.pointerId,ox:e.clientX,oy:e.clientY,x:e.clientX,y:e.clientY};cvs.setPointerCapture(e.pointerId)});
cvs.addEventListener('pointermove',e=>{if(joy&&joy.id===e.pointerId){joy.x=e.clientX;joy.y=e.clientY}});
const ju=e=>{if(joy&&joy.id===e.pointerId)joy=null};cvs.addEventListener('pointerup',ju);cvs.addEventListener('pointercancel',ju);
function zm(d){zi=cl(zi+d,0,4);rs()}
function tb(){$('big').classList.toggle('on')}
function ct(){mi=(mi+1)%5;auto=mi===4;if(!auto)ph=mi;$('bt').textContent=auto?'AUTO':PH[ph].n}
function nm(){build((Math.random()*1e6|0)+1)}
$('bz1').onclick=()=>zm(1);$('bz0').onclick=()=>zm(-1);$('bt').onclick=ct;$('bm').onclick=tb;$('big').onclick=tb;$('mm').onclick=tb;

function upd(dt){
 let vx=(K.KeyD||K.ArrowRight?1:0)-(K.KeyA||K.ArrowLeft?1:0),vy=(K.KeyS||K.ArrowDown?1:0)-(K.KeyW||K.ArrowUp?1:0),mg=1;
 if(vx||vy){const l=Math.hypot(vx,vy);vx/=l;vy/=l}
 else if(joy){const dx=joy.x-joy.ox,dy=joy.y-joy.oy,l=Math.hypot(dx,dy);if(l>6){mg=Math.min(1,l/44);vx=dx/l;vy=dy/l}}
 let sp=0;
 if(vx||vy){sp=58*(window.moveMul?window.moveMul():1)*mg*(K.ShiftLeft||K.ShiftRight?1.7:1);const i=(Math.floor(P.y)>>4)*W+(Math.floor(P.x)>>4);if(ter[i]===1)sp*=.6;
  const nx=P.x+vx*sp*dt,ny=P.y+vy*sp*dt;if(walk(nx,P.y))P.x=nx;if(walk(P.x,ny))P.y=ny;
  P.d=Math.abs(vx)>Math.abs(vy)?(vx<0?2:3):(vy<0?1:0);P.st+=sp*dt*.2}
 P.mv=sp>0;
 if(auto)ph=[1,0,2,3][Math.floor(tm/12)%4];
 const tg=PH[ph],a=Math.min(1,dt*2.5);cur.m=cur.m.map((v,i)=>v+(tg.m[i]-v)*a);cur.nt+=(tg.nt-cur.nt)*a;cur.sh+=(tg.sh-cur.sh)*a}
function dp(){window.drawHero&&window.drawHero(g,Math.round(P.x-sx),Math.round(P.y-sy),P)}
const lb=y=>{let a=0,b=OB.length;while(a<b){const m=(a+b)>>1;if(OB[m].y<y)a=m+1;else b=m}return a};
function dob(o){const s=o.s,ax=s.ax??(s.width>>1),x=o.x-ax-sx,y=o.y-s.height+1-sy;
 if(o.c&&P.y<o.y&&P.y>o.y-s.height+14&&Math.abs(P.x-o.x)<s.width/2-4)g.globalAlpha=.5;
 const off=o.k?Math.round(Math.sin(tm*1.5+o.x*.05)*o.k):0;
 if(off){const h=(s.height*.55)|0;g.drawImage(s,0,0,s.width,h,x+off,y,s.width,h);g.drawImage(s,0,h,s.width,s.height-h,x,y+h,s.width,s.height-h)}else g.drawImage(s,x,y);
 g.globalAlpha=1}
function dm(c){const k=c.width/W,q=c.getContext('2d');q.imageSmoothingEnabled=false;q.drawImage(mm,0,0,c.width,c.height);
 q.strokeStyle='rgba(255,255,255,.55)';q.lineWidth=1;q.strokeRect(sx/T*k,sy/T*k,bw/T*k,bh/T*k);
 if(((tm*2)|0)%2===0){q.fillStyle='#ff4060';q.fillRect(P.x/T*k-1.5,P.y/T*k-1.5,3,3)}}
function draw(dt){
 sx=bw>=WW?(WW-bw)>>1:cl(Math.round(P.x-bw/2),0,WW-bw);sy=bh>=WH?(WH-bh)>>1:cl(Math.round(P.y-bh/2),0,WH-bh);
 g.fillStyle='#0a1a10';g.fillRect(0,0,bw,bh);g.drawImage(wc,sx,sy,bw,bh,0,0,bw,bh);
 const t0=sx>>4,t1=(sx+bw)>>4,u0=sy>>4,u1=(sy+bh)>>4;
 for(let ty=Math.max(0,u0);ty<=Math.min(H-1,u1);ty++)for(let tx=Math.max(0,t0);tx<=Math.min(W-1,t1);tx++){const i=ty*W+tx;if(ter[i]>1)continue;
  for(let k=0;k<2;k++){const gx=tx*T+2+((hs(tx+k,ty*2)*12)|0),gy=ty*T+2+((hs(ty,tx+k*9)*12)|0);if(!wm[gy*WW+gx])continue;
   const bl=(tm*.7+hs(tx*3+k,ty*5+7)*5)%2;if(bl<.5){g.fillStyle=ter[i]?'#c5f5e8':'#6fd6dc';g.fillRect(gx-sx,gy-sy,3,1);if(bl<.25)g.fillRect(gx+1-sx,gy-1-sy,1,1)}}}
 const a=lb(sy),mx=sy+bh+110;
 g.globalAlpha=.3;
 for(let k=a;k<OB.length&&OB[k].y<mx;k++){const o=OB[k];if(o.sh&&o.x>sx-40&&o.x<sx+bw+40)g.drawImage(o.sh,o.x-(o.sh.width>>1)+3-sx,o.y-(o.sh.height>>1)-sy-1)}
 g.globalAlpha=1;let pd=false;
 for(let k=a;k<OB.length&&OB[k].y<mx;k++){const o=OB[k];if(!pd&&o.y>P.y){dp();pd=true}if(o.x>sx-50&&o.x<sx+bw+50)dob(o)}
 if(!pd)dp();window.drawEntities&&window.drawEntities(g,sx,sy);
 for(const l of LV){l.y+=l.v*dt/bh;l.x+=(Math.sin(tm+l.p)*9-4)*dt/bw;if(l.y>1){l.y=0;l.x=Math.random()}if(l.x<0)l.x+=1;if(l.x>1)l.x-=1;px(g,l.x*bw,l.y*bh,l.c,2,1)}
 ctx.imageSmoothingEnabled=false;ctx.globalCompositeOperation='source-over';ctx.drawImage(buf,0,0,bw*S,bh*S);
 const m=cur.m;ctx.globalCompositeOperation='multiply';ctx.fillStyle=`rgb(${m[0]|0},${m[1]|0},${m[2]|0})`;ctx.fillRect(0,0,cw,ch);
 ctx.globalCompositeOperation='lighter';
 if(cur.sh>.02)for(let k=0;k<6;k++){const x0=(k*.19+.02+Math.sin(tm*.25+k*2)*.02)*cw,w=cw*(.04+.02*(k%3)),sk=ch*.45,gr=ctx.createLinearGradient(0,0,0,ch);
  gr.addColorStop(0,`rgba(255,238,170,${.1*cur.sh})`);gr.addColorStop(1,'rgba(255,238,170,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(x0,0);ctx.lineTo(x0+w,0);ctx.lineTo(x0+w+sk,ch);ctx.lineTo(x0+sk,ch);ctx.fill()}
 if(cur.nt>.02){const lx=(P.x-sx)*S,ly=(P.y-10-sy)*S,r=70*S,gr=ctx.createRadialGradient(lx,ly,0,lx,ly,r);gr.addColorStop(0,`rgba(255,190,90,${.55*cur.nt})`);gr.addColorStop(1,'rgba(255,190,90,0)');ctx.fillStyle=gr;ctx.fillRect(lx-r,ly-r,r*2,r*2)}
 for(const f of FF){f.x+=Math.cos(f.a)*f.v*dt;f.y+=Math.sin(f.a)*f.v*dt;f.a+=(Math.random()-.5)*dt*3;f.x=(f.x+1)%1;f.y=(f.y+1)%1;
  const bl=.5+.5*Math.sin(tm*2.2+f.p);
  if(cur.nt>.05){ctx.globalAlpha=cur.nt*bl;ctx.drawImage(GL,f.x*cw-12*dpr,f.y*ch-12*dpr,24*dpr,24*dpr)}
  else if(cur.nt<.95){ctx.globalAlpha=1;ctx.fillStyle=`rgba(255,248,200,${.4*(1-cur.nt)*bl})`;ctx.fillRect(f.x*cw,f.y*ch,2*dpr,2*dpr)}}
 ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
 const vg=ctx.createRadialGradient(cw/2,ch/2,Math.min(cw,ch)*.3,cw/2,ch/2,Math.hypot(cw,ch)*.55);vg.addColorStop(0,'rgba(0,12,6,0)');vg.addColorStop(1,'rgba(0,12,6,.6)');ctx.fillStyle=vg;ctx.fillRect(0,0,cw,ch);
 if(joy){ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=2*dpr;ctx.beginPath();ctx.arc(joy.ox*dpr,joy.oy*dpr,44*dpr,0,6.283);ctx.stroke();
  const dx=joy.x-joy.ox,dy=joy.y-joy.oy,l=Math.max(1,Math.hypot(dx,dy)),k=Math.min(1,44/l);ctx.fillStyle='rgba(255,255,255,.45)';ctx.beginPath();ctx.arc((joy.ox+dx*k)*dpr,(joy.oy+dy*k)*dpr,18*dpr,0,6.283);ctx.fill()}
 window.drawOverlay&&window.drawOverlay(ctx,sx,sy,S,dpr);dm($('mm'));if($('big').classList.contains('on'))dm($('bg'));
 if(((tm*10)|0)%3===0)$('pos').textContent='X '+(P.x>>4)+' Y '+(P.y>>4)}
function loop(ts){const dt=Math.min(.05,(ts-last)/1000||0);last=ts;tm+=dt;window.gameUpd&&window.gameUpd(dt,tm);upd(dt);draw(dt);requestAnimationFrame(loop)}
window.WD={P,W,H,T,WW,WH,K,walk,get ter(){return ter},get blk(){return blk}};
window.worldStart=()=>{build(20261108);rs();$('load').remove();requestAnimationFrame(loop)};
})();
