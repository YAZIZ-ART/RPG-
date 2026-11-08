
/* Paksa tampilan landscape: kalau HP tegak, halaman diputar 90 derajat */
function fit(){const w=innerWidth,h=innerHeight,p=h>w,r=document.documentElement.style;r.setProperty('--vw',(p?h:w)/100+'px');r.setProperty('--vh',(p?w:h)/100+'px');document.body.classList.toggle('rot',p)}
addEventListener('resize',fit);fit();
addEventListener('pointerdown',()=>{try{document.documentElement.requestFullscreen().then(()=>screen.orientation.lock('landscape')).catch(()=>{})}catch(e){}},{once:true});
/* Sambungkan ke game kamu di sini */
function startGame(){const f=document.getElementById('fade');f.classList.add('on');f.innerHTML='MEMUAT PETUALANGAN…';setTimeout(()=>{location.href='karakter.html'},700)}
(()=>{
const $=i=>document.getElementById(i),W=320,H=180;
const mb=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296},rn=mb(7);
const mkc=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c};
const A=mkc(),B1=mkc(),B2=mkc(),LK=mkc(),cv=$('s');cv.width=W;cv.height=H;
const g=cv.getContext('2d'),a=A.getContext('2d'),b1=B1.getContext('2d'),b2=B2.getContext('2d'),lk=LK.getContext('2d');
let cx=a;const rc=(c,x,y,w,h)=>{cx.fillStyle=c;cx.fillRect(Math.round(x),Math.round(y),w,h)};
const disc=(x,y,r,c)=>{for(let j=-r;j<=r;j++){const w=Math.floor(Math.sqrt(r*r-j*j+.5));rc(c,x-w,y+j,w*2+1,1)}};
const cl=(v,l,h)=>v<l?l:v>h?h:v;
function blob(x,y,rx,ry,p){for(let j=-ry;j<=ry;j++)for(let i=-rx;i<=rx;i++){const d=i*i/(rx*rx)+j*j/(ry*ry);if(d>1)continue;const l=.5-(i/rx*.3+j/ry*.4)+(rn()-.5)*.4-d*.2;let k=l>.78?3:l>.5?2:l>.22?1:0;if(j>0&&d>.78)k=0;rc(p[k],x+i,y+j,1,1)}}
function pine(x,by,h,c){rc('#4a2e1a',x-1,by-3,2,3);const top=by-h;for(let y=top;y<by-2;y++){const t=(y-top)/h,hw=Math.round(1+(t*.36+((t*5)%1)*.08)*h*.5);rc(c[1],x-hw,y,hw*2+1,1);rc(c[0],x-hw,y,Math.max(1,hw>>1),1);rc(c[2],x+hw-(hw>>2),y,(hw>>2)+1,1)}}
const PF=['#34a455','#1f6a3a','#124a2a'],PM=['#2a8060','#1a5a46','#103a32'],PB=['#2e4a96','#1c3274','#14245a'],GR=['#0d3a1e','#18602c','#2a8a3a','#5ab84a'],RK=['#3a3a58','#5a5a7c','#8a8aa8','#b4b4cc'];
const shard=(x,y,w,h,c1,c2)=>{cx.fillStyle=c1;cx.beginPath();cx.moveTo(x,y);cx.lineTo(x+w*.1,y-h*.8);cx.lineTo(x+w*.5,y-h);cx.lineTo(x+w*.9,y-h*.7);cx.lineTo(x+w,y);cx.fill();cx.fillStyle=c2;cx.beginPath();cx.moveTo(x,y);cx.lineTo(x+w*.1,y-h*.8);cx.lineTo(x+w*.5,y-h);cx.lineTo(x+w*.45,y);cx.fill()};

/* LANGIT */
{const id=a.createImageData(W,H),d=id.data,B=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5],S=[[8,10,48],[26,20,96],[84,38,150],[190,66,140],[248,136,98]];
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const t=Math.min(1,y/118)*4,i=Math.min(3,t|0),f=t-i,c0=S[i],c1=S[i+1],gl=Math.max(0,1-Math.hypot((x-262)/120,(y-104)/46))*.85*(y>40?1:y/40),o=(y*W+x)*4,th=(B[(y&3)*4+(x&3)]/16-.5)*22;
 for(let k=0;k<3;k++){let v=c0[k]+(c1[k]-c0[k])*f;v+=([255,150,96][k]-v)*gl;d[o+k]=cl(Math.round((v+th)/22)*22,0,255)}d[o+3]=255}
a.putImageData(id,0,0)}
{const gr=a.createRadialGradient(73,21,8,73,21,44);gr.addColorStop(0,'rgba(190,170,255,.6)');gr.addColorStop(1,'rgba(190,170,255,0)');a.fillStyle=gr;a.fillRect(20,0,110,70);
disc(73,21,15,'#ebe4ff');for(let y=-15;y<=15;y++)for(let x=-15;x<=15;x++)if(x*x+y*y<=225&&x*.6+y*.4>7)rc('#c8bff0',73+x,21+y,1,1);
for(const[x,y,r]of[[67,16,4],[79,27,3],[75,13,2],[66,27,2],[82,18,2]])disc(x,y,r,'#c0b6ee')}

/* GUNUNG, TEBING, KASTIL */
cx=b1;const PK=[[268,66,.62],[212,98,.5],[312,88,.55]];
for(let x=165;x<W;x++){let best=999,bn=0;PK.forEach(([px,py,s])=>{const y=py+Math.abs(x-px)*s+Math.sin(x*.7)*1.2+Math.sin(x*.23)*2;if(y<best){best=y;bn=px}});
 const lit=x<bn,y0=Math.round(best);for(let y=y0;y<140;y++){const dp=y-y0;let c=lit?(dp<4?'#a090e8':'#6a5cc4'):(dp<4?'#5a4cb0':'#3a2f8a');if(y>112)c=lit?'#4a449c':'#2c2a72';if(y0<82&&dp<7+((x*7)%3))c=lit?'#e4dcff':'#a49ae0';rc(c,x,y,1,1)}}
for(let x=6;x<150;x++){const top=x<112?80:Math.round(80+(x-112)*.85),lf=x<10?(10-x)*2:0;
 for(let y=top+lf;y<124;y++){const k=rn(),dp=y-top;rc(dp<3?(k<.5?'#2f7a4a':'#58a850'):k<.15?'#2e2a60':k<.3?'#6a62a8':(x*.4+y*.1)%5<1.2?'#3a3472':'#4a4380',x,y,1,1)}}
for(let x=14;x<112;x+=8)blob(x,79,6,4,GR);
const WN=[];
rc('#2b2563',14,66,92,14);rc('#4a42a0',14,66,1,14);for(let x=14;x<106;x+=6)rc('#2b2563',x,63,3,3);
for(const[x,w,top,roof]of[[18,8,56,10],[32,10,46,14],[46,12,34,22],[60,9,50,14],[73,11,44,16],[86,10,54,12],[98,8,60,9]]){
 rc('#2b2563',x-w/2,top,w,80-top);rc('#4a42a0',x-w/2,top,1,80-top);rc('#1c1848',x+w/2-2,top,2,80-top);
 for(let y=0;y<roof;y++){const hw=Math.round((w/2+1)*(y/roof));rc('#1d1a4a',x-hw,top-roof+y,hw*2+1,1);rc('#3a3a8a',x-hw,top-roof+y,Math.max(1,hw>>1),1)}
 rc('#1d1a4a',x-w/2-1,top,w+2,2);for(let wy=top+5;wy<72;wy+=9){rc('#120e32',x-1,wy,2,4);WN.push([x-1,wy,2,4])}}
rc('#6a4a2a',46,0,1,2);rc('#c04070',47,0,4,2);
for(const x of[28,40,54,66,80,92]){rc('#120e32',x,70,2,5);WN.push([x,70,2,5])}

/* DANAU (animasi) */
for(let y=128;y<152;y++){const t=(y-128)/24;lk.fillStyle=`rgb(${26+t*20|0},${52+t*70|0},${120+t*60|0})`;lk.fillRect(86,y,170,1)}
for(let i=0;i<70;i++){lk.fillStyle='rgba(120,180,255,.35)';lk.fillRect(90+rn()*160|0,129+rn()*22|0,2+rn()*5|0,1)}

/* LAYAR DEPAN */
cx=b2;
for(let x=88;x<W+6;x+=5+((rn()*5)|0))pine(x,131,14+((rn()*14)|0),PB);
for(let x=0;x<150;x+=8)pine(x+((rn()*5)|0),126+((rn()*10)|0),24+((rn()*22)|0),PM);
for(let x=196;x<275;x+=9)pine(x+((rn()*4)|0),132+((rn()*4)|0),26+((rn()*20)|0),PM);
pine(12,136,64,PF);pine(34,142,46,PF);pine(4,152,52,PF);pine(56,140,32,PF);
for(let x=0;x<W;x++){const top=Math.round(146+Math.sin(x*.05)*2+Math.sin(x*.13));for(let y=top;y<H;y++){const k=rn();rc(k<.5?'#2f8a3a':k<.8?'#3a9a42':k<.92?'#256e32':'#58b04a',x,y,1,1)}}
for(let y=150;y<H;y++){const c=112+(y-150)*2.2,hw=5+(y-150)*.35;for(let x=c-hw|0;x<=c+hw;x++){const k=rn(),e=Math.abs(x-c)>hw-1.5;rc(e?'#7a5530':k<.5?'#a8804a':k<.8?'#8a6438':'#c09a60',x,y,1,1)}}
for(let i=0;i<150;i++){const x=rn()*W|0,y=150+rn()*30|0;rc(rn()<.5?'#58b04a':'#256e32',x,y-2,1,3)}
for(let x=6;x<96;x+=14){rc('#7a4a28',x,134,3,15);rc('#a06a3a',x,134,1,15)}rc('#8a5a30',6,138,92,2);rc('#8a5a30',6,143,92,2);
rc('#5a3a1c',44,118,3,32);rc('#a8723a',32,116,26,10);rc('#6a4220',32,116,26,1);rc('#6a4220',32,125,26,1);rc('#3a2010',40,120,10,2);rc('#3a2010',46,118,3,6);
/* pohon besar */
rc('#4a3020',305,70,10,80);rc('#6b4a2c',305,70,3,80);rc('#33210f',313,70,2,80);for(let y=0;y<8;y++)rc('#4a3020',302-y/2,142+y,16+y,1);
for(const[x,y,rx,ry]of[[302,42,24,18],[280,62,18,12],[314,74,14,12],[298,22,16,10],[270,48,12,9],[290,84,12,8]])blob(x,y,rx,ry,['#14501f','#2a8a30','#4ab04a','#86d65a']);
/* tiang lentera */
rc('#6a4424',294,100,3,50);rc('#6a4424',278,100,19,2);rc('#3a2a1a',280,102,1,5);rc('#3a2a1a',277,107,7,1);rc('#ffb030',278,108,5,7);rc('#3a2a1a',277,115,7,1);
/* tenda */
for(let y=116;y<=148;y++){const hw=Math.round((y-116)*.82);rc('#d9b07e',258-hw,y,hw*2+1,1);rc('#f0cd9c',258-hw,y,Math.max(1,hw>>2),1);rc('#b58656',258+(hw>>1),y,(hw>>1)+1,1)}
for(let y=128;y<=148;y++){const hw=Math.round((y-128)*.4);rc('#3a1a10',262-hw,y,hw*2+1,1);if(y>134)rc('#e0702a',262-hw*.6,y,hw*1.2+1,1)}
rc('#6a4424',257,112,2,5);
rc('#9a6a38',274,141,15,12);rc('#5a3a1c',274,141,15,1);rc('#5a3a1c',274,152,15,1);rc('#5a3a1c',274,141,1,12);rc('#5a3a1c',288,141,1,12);rc('#6a4424',275,146,13,1);
for(let i=0;i<9;i++){const an=i/9*6.283;const x=240+Math.cos(an)*9,y=148+Math.sin(an)*3;rc(i%2?'#6a6a88':'#8a8aa8',x-1,y,3,2)}
/* tepi depan */
for(let x=-4;x<W+8;x+=9)blob(x,176+((rn()*4)|0),9,6,GR);
blob(60,176,10,6,RK);blob(96,150,6,3,RK);blob(112,152,5,3,RK);blob(296,176,9,5,RK);
shard(16,172,8,24,'#9a5af0','#d0a8ff');shard(26,174,9,17,'#7a3ad0','#b080ff');shard(8,175,7,12,'#8a4ae0','#c090ff');
shard(300,176,7,18,'#3a7af0','#a0d0ff');shard(307,177,6,11,'#2a5ad0','#80b8ff');
for(let i=0;i<46;i++){const x=rn()*W|0,y=152+rn()*26|0,c=['#ff6ea0','#c890ff','#fff2a0','#fff'][(rn()*4)|0];rc('#2a8a3a',x,y,1,3);rc(c,x-1,y-1,3,1);rc(c,x,y-2,1,3)}

/* ANIMASI */
const ST=Array.from({length:75},()=>({x:rn()*W|0,y:rn()*95|0,p:rn()*6})),SPK=[[115,10],[172,14],[238,20],[300,48],[22,40],[190,40]],CD=[[8,14,34,2.2],[40,6,26,3],[210,12,40,2.6],[270,22,30,3.4],[150,26,24,2]],GL=[],FF=[];
for(let i=0;i<30;i++)GL.push({x:100+rn()*140|0,y:131+rn()*16|0,p:rn()*6});
for(let i=0;i<16;i++)FF.push({x:rn()*W,y:120+rn()*55,p:rn()*6});
let fxOn=true,tm=0;
function cloud(x,y,w){const n=w/5|0;for(const[c,dy,dr]of[['#4a3a98',1,0],['#8f7fd8',-1,0],['#d6ccff',-2,-2]])for(let i=0;i<n;i++){const ox=x-w/2+i*5,oy=y+(i%2)*2-Math.sin(i*1.7)*2+dy,r=4+((i*5)%3)+dr;if(r>1)disc(Math.round(ox),Math.round(oy),r,c)}}
function fr(ts){tm=ts/1000;cx=g;g.globalCompositeOperation='source-over';g.globalAlpha=1;
 g.drawImage(A,0,0);
 for(const s of ST){g.globalAlpha=.45+.55*Math.sin(tm*1.6+s.p);rc('#fff',s.x,s.y,1,1)}
 for(const[x,y]of SPK){g.globalAlpha=Math.sin(tm*2+x)>0?1:.45;rc('#cfe8ff',x,y-2,1,5);rc('#cfe8ff',x-2,y,5,1)}g.globalAlpha=1;
 for(const[x,y,w,s]of CD)cloud(Math.round((x+tm*s)%(W+80)-40),y,w);
 g.drawImage(B1,0,0);
 for(const[x,y,w,h]of WN){rc(Math.sin(tm*3+x*7+y)>.6?'#ffd88a':'#ffb040',x,y,w,h)}
 for(let x=33;x<45;x++)rc(x%3?'#8ad0f4':'#b4e4ff',x,90,1,30);rc('#e8faff',33,90,12,1);
 for(let i=0;i<14;i++)rc('#fff',33+(i*5%12),90+(tm*34+i*9)%32|0,1,4);
 g.globalAlpha=.35+.1*Math.sin(tm*3);disc(39,120,9,'#dff6ff');g.globalAlpha=1;
 g.drawImage(LK,0,0);
 for(const l of GL){const v=Math.sin(tm*1.8+l.p);if(v>.3){rc(v>.8?'#e8f8ff':'#8cc8f8',l.x,l.y,3,1)}}
 g.drawImage(B2,0,0);
 rc(Math.sin(tm*13)>0?'#fff0a0':'#ffe080',279,109,3,4);
 const fx=240,fy=147,h=15+Math.round(Math.sin(tm*11)*2+Math.sin(tm*7.3)*2);
 for(let y=0;y<h;y++){const t=y/h,hw=Math.max(1,Math.round(5.2*Math.pow(1-t,.65)*(1+.18*Math.sin(tm*14+y*.8)))),ox=Math.round(Math.sin(tm*9+y*.5)*1.6*t),yy=fy-y,h2=Math.round(hw*.72),h3=Math.round(hw*.4);
  rc('#e0301a',fx+ox-hw,yy,hw*2+1,1);rc('#ff8a1a',fx+ox-h2,yy,h2*2+1,1);if(h3>0)rc('#ffe03a',fx+ox-h3,yy,h3*2+1,1);if(y<5)rc('#fff4a8',fx+ox-(h3>>1),yy,Math.max(1,h3),1)}
 for(let i=0;i<7;i++){const p=(tm*.9+i*.37)%1;g.globalAlpha=1-p;rc('#ffd060',fx+Math.sin(i*5+tm*2)*6*p,fy-8-p*26,1,1)}g.globalAlpha=1;
 for(const f of FF){const v=.5+.5*Math.sin(tm*2+f.p);g.globalAlpha=v;rc('#e6ff8a',f.x+Math.sin(tm*.6+f.p)*8,f.y+Math.cos(tm*.5+f.p*2)*6,1,1)}g.globalAlpha=1;
 if(fxOn){g.globalCompositeOperation='lighter';
  let r=g.createRadialGradient(fx,fy-4,2,fx,fy-4,52);r.addColorStop(0,`rgba(255,150,60,${.5+.12*Math.sin(tm*17)})`);r.addColorStop(1,'rgba(255,120,40,0)');g.fillStyle=r;g.fillRect(fx-54,fy-58,108,72);
  r=g.createRadialGradient(280,113,1,280,113,32);r.addColorStop(0,`rgba(255,190,80,${.5+.08*Math.sin(tm*5)})`);r.addColorStop(1,'rgba(255,160,60,0)');g.fillStyle=r;g.fillRect(246,80,68,68);
  g.globalCompositeOperation='source-over'}
 requestAnimationFrame(fr)}
requestAnimationFrame(fr);

/* MENU */
window.menuRun=()=>requestAnimationFrame(fr);
const bs=[...document.querySelectorAll('.nav .b,nav .b')];let sel=0,snd=true,ac=null;
function beep(f=520,d=.07){if(!snd)return;try{ac=ac||new AudioContext();const o=ac.createOscillator(),v=ac.createGain(),t=ac.currentTime;o.type='square';o.frequency.value=f;v.gain.setValueAtTime(.04,t);v.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(v);v.connect(ac.destination);o.start();o.stop(t+d)}catch(e){}}
const pick=i=>{sel=(i+bs.length)%bs.length;bs.forEach((b,k)=>b.classList.toggle('sel',k===sel))};
bs.forEach((b,i)=>{b.onmouseenter=()=>{if(sel!==i){pick(i);beep(660,.04)}};b.onclick=()=>{beep(880,.1);act(b.dataset.a)}});
const md=$('md'),mt=$('mt'),mbx=$('mb'),mf=$('mf');
function mk(t,body,btns){mt.textContent=t;mbx.innerHTML=body;mf.innerHTML='';mf.style.cssText='display:flex;flex-direction:column;gap:calc(var(--u)*1.6);align-items:center';for(const[l,fn]of btns){const b=document.createElement('button');b.className='b';b.textContent=l;b.onclick=()=>{beep(700,.06);fn(b)};mf.appendChild(b)}md.classList.add('on')}
const close=()=>md.classList.remove('on');
function act(k){
 if(k==='play')startGame();
 else if(k==='opt')mk('OPTIONS','Atur suara dan efek cahaya.',[['SUARA: '+(snd?'ON':'OFF'),b=>{snd=!snd;b.textContent='SUARA: '+(snd?'ON':'OFF')}],['EFEK CAHAYA: '+(fxOn?'ON':'OFF'),b=>{fxOn=!fxOn;$('vg').style.display=fxOn?'':'none';b.textContent='EFEK CAHAYA: '+(fxOn?'ON':'OFF')}],['TUTUP',close]]);
 else if(k==='cre')mk('CREDITS','AETHERIA<br>ECHOES OF THE FIVE ELEMENTS<br>DESAIN &amp; KODE: PABLI<br>PIXEL ART: DIGAMBAR LEWAT KODE<br>TERIMA KASIH SUDAH BERMAIN!',[['TUTUP',close]]);
 else mk('KELUAR','Keluar dari game?',[['YA',()=>{window.close();mbx.textContent='Tab tidak bisa ditutup otomatis. Silakan tutup manual.'}],['TIDAK',close]])}
addEventListener('keydown',e=>{if(e.code==='Escape'){close();return}if(md.classList.contains('on'))return;
 if(e.code==='ArrowDown'||e.code==='KeyS'){pick(sel+1);beep(660,.04);e.preventDefault()}
 else if(e.code==='ArrowUp'||e.code==='KeyW'){pick(sel-1);beep(660,.04);e.preventDefault()}
 else if(e.code==='Enter'||e.code==='Space'){bs[sel].click();e.preventDefault()}});
})();
