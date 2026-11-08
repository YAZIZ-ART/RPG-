(()=>{

const P=2,E=t=>t*t*(3-2*t),rnd=(a,b)=>a+Math.random()*(b-a);
function spr(w,h,fn,fl){const cv=document.createElement('canvas');cv.width=w;cv.height=h;const x=cv.getContext('2d');
 fn((a,b,c,d,col)=>{x.fillStyle=col;x.fillRect(Math.round(a),Math.round(b),Math.round(c),Math.round(d))});
 if(fl){x.globalCompositeOperation='source-atop';x.fillStyle='rgba(255,255,255,.75)';x.fillRect(0,0,w,h);x.globalCompositeOperation='source-over'}
 const im=x.getImageData(0,0,w,h),d=im.data,o=new Uint8ClampedArray(d);
 for(let j=0;j<h;j++)for(let i=0;i<w;i++){const k=(j*w+i)*4;if(d[k+3])continue;
  for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const u=i+a,v=j+b;if(u>=0&&v>=0&&u<w&&v<h&&d[(v*w+u)*4+3]){o[k]=16;o[k+1]=12;o[k+2]=28;o[k+3]=255;break}}}
 im.data.set(o);x.putImageData(im,0,0);return cv}
const dome=(r,cx,bot,w,h,c,hi,sh)=>{for(let j=0;j<h;j++){const u=(j+1)/h,hw=Math.round(w/2*Math.sqrt(1-(1-u)*(1-u)));r(cx-hw,bot-h+j,hw*2,1,j>h-3?sh:c)}r(cx-Math.round(w/4),bot-h+2,3,2,hi)};
const golemD=(k,cr)=>(r,s)=>{const R=(a,b,c,d,o)=>r(a*k,b*k,c*k,d*k,o),ar=s.q*8,ey=cr?'#ff7ad8':'#4ac8ff',st=cr?'#7a8aa8':'#8a8a9a';
 R(8,24,6,8,'#6a6a7a');R(18,24,6,8,'#6a6a7a');R(6,10,20,16,st);R(8,12,16,3,'#a8a8b8');R(12,16,1,5,'#55556a');R(20,20,1,4,'#55556a');
 R(14,17,4,4,ey);R(11,3,10,8,'#9a9aaa');R(13,6,2,2,ey);R(18,6,2,2,ey);
 R(0,12-ar,6,13,'#7a7a8a');R(26,12-ar,6,13,'#7a7a8a');R(0,24-ar,7,5,'#9a9aaa');R(25,24-ar,7,5,'#9a9aaa');
 if(cr){R(5,3,3,8,'#6ae0ff');R(24,2,3,9,'#6ae0ff');R(14,0,4,4,'#9af0ff');R(9,9,2,3,'#6ae0ff')}};
const MON=[
{n:'Slime',tier:0,w:24,h:20,hp:30,sp:.5,keep:30,aggro:140,atk:['jump'],d:(r,s)=>{const sq=s.q,w=18+sq*6,h=Math.round(12-sq*5+Math.sin(s.t*.1));dome(r,12,19,w,h,'#4cd964','#b8ffc8','#2a9a48');
 const e=19-h+Math.round(h*.45);r(8,e,3,3,'#fff');r(14,e,3,3,'#fff');r(9,e+1,2,2,'#112');r(15,e+1,2,2,'#112');r(11,e+4,3,1,'#1a6a30')}},
{n:'Kelelawar Gua',tier:0,w:30,h:20,hp:22,sp:.9,keep:50,aggro:170,fly:1,atk:['dive'],d:(r,s)=>{const f=Math.sin(s.t*(s.q>0||s.a>=0?.6:.3))*5;
 for(let i=1;i<=9;i++){const y=7+Math.round(f*i/9)+(i>5?i-5:0),h=Math.max(1,5-(i>6?i-6:0)),c=i%3?'#7a4aa0':'#5a3a7a';r(12-i,y,1,h,c);r(17+i,y,1,h,c)}
 r(12,6,6,8,'#5a3a7a');r(12,4,2,3,'#5a3a7a');r(16,4,2,3,'#5a3a7a');r(13,8,1,2,'#ff4040');r(16,8,1,2,'#ff4040');r(14,12,2,1,'#fff')}},
{n:'Jamur Beracun',tier:0,w:22,h:24,hp:36,sp:0,keep:0,aggro:90,atk:['spore'],d:(r,s)=>{const p=s.q*3;dome(r,11,14,Math.round(20+p*2),Math.round(11+p),'#d03a4a','#ff9aa0','#a02a3a');
 r(6,6,3,3,'#fff');r(13,5,3,3,'#fff');r(10,9,2,2,'#fff');r(7,14,8,8,'#f0e0c0');r(8,16,2,3,'#112');r(12,16,2,3,'#112');r(10,20,2,1,'#a06050');r(6,22,4,2,'#d8c8a0');r(12,22,4,2,'#d8c8a0')}},
{n:'Goblin',tier:1,w:34,h:30,hp:60,sp:.7,keep:34,aggro:200,atk:['stab','throw'],d:(r,s)=>{const th=s.a>=0?Math.sin(s.a*3.14)*6:-s.q*3,lg=Math.sin(s.t*.3)>0?1:0;
 r(8,26,3,4-lg,'#3a2a1a');r(13,26,3,3+lg,'#3a2a1a');r(8,19,9,8,'#7a4a22');r(8,25,9,1,'#d9a030');r(9,8,9,10,'#6ab04c');r(4,10,5,3,'#6ab04c');r(18,10,5,3,'#6ab04c');r(3,10,1,2,'#6ab04c');r(23,10,1,2,'#6ab04c');
 r(11,11,2,2,'#ffe34a');r(15,11,2,2,'#ffe34a');r(12,15,4,1,'#fff');r(17,19,3,3,'#6ab04c');r(19+th,18,8,1,'#d8e0ee');r(18+th,17,1,3,'#d9a030')}},
{n:'Golem Kecil',tier:1,w:32,h:32,hp:120,sp:.3,keep:40,aggro:170,atk:['slam'],d:golemD(1,0)},
{n:'Tengkorak',tier:1,w:32,h:32,hp:75,sp:.5,keep:80,aggro:200,atk:['bone','slash'],d:(r,s)=>{const up=s.q*6,a=s.a>=0;
 r(10,2,9,8,'#e8e8dc');r(11,5,2,2,'#222');r(15,5,2,2,'#222');r(12,6,1,1,'#f33');r(16,6,1,1,'#f33');r(11,10,7,2,'#d0d0c4');r(13,12,2,10,'#e8e8dc');
 for(let i=0;i<3;i++)r(10,13+i*3,9,1,'#e8e8dc');r(11,22,7,2,'#d0d0c4');const w=Math.sin(s.t*.2)>0?1:0;r(11,24,2,8-w,'#e8e8dc');r(16,24,2,7+w,'#e8e8dc');
 r(19,13-up,2,6,'#e8e8dc');if(a){r(21,14,8,2,'#cfd8e8');r(20,13,1,4,'#c9a227')}else{r(21,2-up,2,12,'#cfd8e8');r(19,14-up,6,1,'#c9a227')}}},
{n:'Raja Golem Kristal',tier:2,w:64,h:64,hp:420,sp:.25,keep:70,aggro:320,atk:['stomp','rock'],d:golemD(2,1)},
{n:'Lich Pemanggil',tier:2,w:56,h:64,hp:380,sp:.35,keep:130,aggro:320,atk:['pillar','orbs'],d:(r,s)=>{const b=Math.round(Math.sin(s.t*.07)*2),up=Math.round(s.q*8);
 for(let j=0;j<32;j++){const w=14+j;r(28-Math.floor(w/2),24+j+b,w,1,j%8<2?'#7a3ab0':'#4a2a7a')}
 r(18,20+b,20,6,'#3a1e6a');r(23,9+b,10,10,'#eee8d8');r(25,13+b,2,3,'#c040ff');r(29,13+b,2,3,'#c040ff');r(26,18+b,4,2,'#d8d0c0');
 r(22,5+b,12,3,'#d9a030');r(22,2+b,2,4,'#d9a030');r(27,1+b,2,5,'#d9a030');r(32,2+b,2,4,'#d9a030');
 r(12,27+b-up,7,3,'#4a2a7a');r(10,26+b-up,4,4,'#eee8d8');r(37,27+b-up,7,3,'#4a2a7a');r(42,26+b-up,4,4,'#eee8d8');
 r(49,16+b,2,44,'#6a4426');r(46,9+b,8,8,'#c040ff');r(48,11+b,4,4,'#fff')}},
{n:'Drake Api',tier:2,w:64,h:56,hp:450,sp:.4,keep:90,aggro:320,atk:['breath','swoop'],d:(r,s)=>{const fast=s.q>0||s.a>=0,wh=12+Math.round(Math.sin(s.t*(fast?.5:.15))*6),m=s.q>0?Math.round(s.q*4):0;
 for(let i=0;i<18;i++){const h=Math.round(wh*Math.sin((i+1)/19*3.14));r(14+i,26-h,1,h,'#9a2a20');r(14+i,26-h,1,2,'#e05040')}
 for(let i=0;i<12;i++)r(i,38-Math.round(i*.5),1,5-Math.round(i*.2),'#c0392b');r(0,31,3,3,'#ff9020');
 r(12,26,34,16,'#c0392b');r(14,36,30,6,'#f0c060');r(18,42,6,10,'#a02a20');r(34,42,6,10,'#a02a20');r(16,51,9,3,'#222');r(32,51,9,3,'#222');
 r(40,16,9,14,'#c0392b');r(44,10,11,10,'#d04030');r(54,13,7,6,'#d04030');r(50,12,2,2,'#ffe34a');r(46,6,2,5,'#f0e0c0');r(51,6,2,5,'#f0e0c0');
 if(m){r(56,19,4+m,3,'#ffa020');r(56,21,3+m,1,'#fff08a')}}}];
// ===== desain monster versi baru (menimpa desain lama) =====
const ell=(r,cx,cy,rx,ry,c)=>{for(let j=-ry;j<=ry;j++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-j*j/(ry*ry+.5))));r(cx-w,cy+j,w*2+1,1,c)}};
const blob=(r,cx,cy,rx,ry,c,l,d)=>{ell(r,cx,cy,rx,ry,d);ell(r,cx-1,cy-1,Math.max(1,rx-1),Math.max(1,ry-1),c);ell(r,cx-Math.round(rx/3),cy-Math.round(ry/2),Math.max(1,Math.round(rx/3)),Math.max(1,Math.round(ry/4)),l)};
const eye=(r,x,y,c)=>{r(x,y,3,3,'#fff');r(x+1,y+1,2,2,c||'#112');r(x+1,y+1,1,1,'#fff')};
MON[0].d=(r,s)=>{const q=s.q,rx=Math.round(9+q*2),ry=Math.round(7-q*2.5+Math.sin(s.t*.1)*.8),cy=19-ry;
 r(3,18,18,1,'#1f7a3a');blob(r,12,cy,rx,ry,'#4cd964','#d0ffd8','#2a9a48');ell(r,9,cy+2,1,1,'#2fb858');ell(r,15,cy+3,1,1,'#2fb858');r(11,cy-ry-1,2,2,'#7dffa0');
 eye(r,7,cy-1);eye(r,13,cy-1);r(11,cy+3,3,1,'#14502a');if(q>.4){r(6,cy-3,4,1,'#14502a');r(14,cy-3,4,1,'#14502a')}};
MON[1].d=(r,s)=>{const f=Math.sin(s.t*(s.q>0||s.a>=0?.6:.3))*5;
 for(let sd=-1;sd<=1;sd+=2)for(let i=1;i<=10;i++){const x=sd<0?14-i:15+i,y=6+Math.round(f*i/10)+(i>6?i-6:0),h=4+(i%3==0?2:0)-(i>7?1:0);r(x,y,1,h,i%3?'#7a4aa0':'#4a2e68');if(i%3==0)r(x,y,1,1,'#b890e0')}
 blob(r,15,10,4,5,'#5a3a7a','#8a62b0','#3a2450');r(11,3,2,4,'#5a3a7a');r(18,3,2,4,'#5a3a7a');r(12,4,1,2,'#c07090');r(19,4,1,2,'#c07090');
 r(12,8,2,2,'#ff3030');r(17,8,2,2,'#ff3030');r(12,8,1,1,'#fff');r(17,8,1,1,'#fff');r(14,11,3,2,'#c07090');r(13,13,1,2,'#fff');r(17,13,1,2,'#fff');r(14,15,1,2,'#3a2450');r(16,15,1,2,'#3a2450')};
MON[2].d=(r,s)=>{const q=s.q,rx=Math.round(9+q*2),ry=Math.round(7+q*2);
 r(7,13,9,9,'#f0e0c0');r(14,13,2,9,'#d0b890');r(7,13,9,2,'#a07050');r(6,21,5,3,'#e0d0b0');r(12,21,5,3,'#e0d0b0');
 blob(r,11,8,rx,ry,'#d03a4a','#ff9aa0','#8a1a2c');r(1,13,20,1,'#7a1a28');ell(r,6,6,2,2,'#fff');ell(r,14,4,2,2,'#fff');ell(r,10,9,1,1,'#fff');ell(r,17,9,1,1,'#fff');
 r(3,14,1,3,'#9aff6a');r(18,14,1,2,'#9aff6a');eye(r,8,15);eye(r,12,15);r(8,14,3,1,'#5a3a20');r(12,14,3,1,'#5a3a20');r(10,19,3,2,'#5a1a1a');
 if(q>0){r(9,0,3,2,'#9aff6a');r(5,1,2,2,'#7acc4a');r(15,1,2,2,'#7acc4a')}};
MON[3].d=(r,s)=>{const th=s.a>=0?Math.sin(s.a*3.14)*6:-s.q*3,lg=Math.sin(s.t*.3)>0?1:0;
 r(9,26,4,4-lg,'#3a2a1a');r(14,26,4,3+lg,'#3a2a1a');r(8,29-lg,5,1,'#241810');r(14,28+lg,5,1,'#241810');
 r(9,18,10,8,'#7a4a22');r(9,18,10,2,'#9a6a38');r(9,18,2,8,'#5a3418');r(11,19,2,6,'#5a3418');r(9,25,10,2,'#3a2a1a');r(13,25,2,2,'#d9a030');r(17,19,4,3,'#6ab04c');
 ell(r,13,12,6,6,'#4a8a34');ell(r,12,11,5,5,'#6ab04c');ell(r,10,9,2,1,'#8ad468');
 for(let i=0;i<6;i++){const y=9+(i>>1);r(6-i,y,1,3,'#6ab04c');r(20+i,y,1,3,'#6ab04c');if(i&&i<5){r(6-i,y+1,1,1,'#c07060');r(20+i,y+1,1,1,'#c07060')}}
 r(10,10,3,2,'#ffe34a');r(15,10,3,2,'#ffe34a');r(11,10,1,2,'#111');r(16,10,1,2,'#111');r(10,9,3,1,'#2a4a1a');r(15,9,3,1,'#2a4a1a');
 r(13,12,2,3,'#4a8a34');r(11,15,6,1,'#2a1a1a');r(11,15,1,2,'#fff');r(13,15,1,2,'#fff');r(15,15,1,2,'#fff');
 r(20+th,19,7,2,'#d8e0ee');r(20+th,19,7,1,'#fff');r(19+th,18,1,4,'#d9a030');r(18+th,19,1,2,'#7a4a22')};
const golemD2=(k,cr)=>(r,s)=>{const R=(a,b,c,d,o)=>r(a*k,b*k,c*k,d*k,o),ar=s.q*8,ey=cr?'#ff7ad8':'#59d6ff',L=cr?'#a8b8d8':'#b0b0c0',M=cr?'#7a8aa8':'#8a8a9a',D=cr?'#4a5878':'#5a5a6c',gl=Math.sin(s.t*.12)>0?ey:(cr?'#d050b0':'#2a9ad0');
 R(8,24,7,8,D);R(17,24,7,8,D);R(7,29,9,3,M);R(16,29,9,3,M);R(7,29,9,1,L);R(16,29,9,1,L);R(9,25,2,3,M);R(18,25,2,3,M);
 R(6,10,20,15,M);R(6,10,20,3,L);R(6,22,20,3,D);R(24,12,2,11,D);R(6,12,2,10,L);R(11,13,1,4,D);R(20,16,1,5,D);R(12,22,8,1,D);
 R(10,15,1,6,gl);R(21,15,1,6,gl);R(12,21,8,1,gl);R(14,16,4,5,D);R(15,17,2,3,gl);
 R(10,2,12,9,M);R(10,2,12,2,L);R(10,9,12,2,D);R(12,6,3,2,ey);R(17,6,3,2,ey);R(11,5,5,1,D);R(16,5,5,1,D);R(15,8,2,2,D);
 R(4,8,7,5,L);R(21,8,7,5,L);R(4,12,7,1,D);R(21,12,7,1,D);
 R(0,13-ar,6,12,M);R(26,13-ar,6,12,M);R(0,13-ar,2,12,L);R(30,13-ar,2,12,D);R(0,24-ar,7,5,L);R(25,24-ar,7,5,L);R(2,26-ar,1,3,D);R(4,26-ar,1,3,D);R(27,26-ar,1,3,D);R(29,26-ar,1,3,D);
 if(cr){R(2,2,3,9,'#6ae0ff');R(3,3,1,6,'#d8fbff');R(26,1,3,10,'#6ae0ff');R(27,2,1,7,'#d8fbff');R(13,0,3,3,'#9af0ff');R(17,0,2,2,'#6ae0ff');r(6,8,1,4,'#fff');r(54,6,1,5,'#fff')}
 else{R(7,11,3,2,'#4a8a3a');R(8,12,2,1,'#6aaa4a');R(20,23,4,1,'#4a8a3a')}};
MON[4].d=golemD2(1,0);MON[6].d=golemD2(2,1);
MON[5].d=(r,s)=>{const up=s.q*6,a=s.a>=0,w=Math.sin(s.t*.2)>0?1:0,B='#e8e8dc',Bd='#b8b8a8';
 r(11,24,3,8-w,B);r(16,24,3,7+w,B);r(10,31-w,5,1,Bd);r(15,30+w,5,1,Bd);r(12,24,1,6,Bd);r(11,22,9,3,Bd);r(10,21,11,1,B);r(13,12,3,10,B);
 for(let i=0;i<4;i++){r(9+(i>1?1:0),13+i*2,11-(i>1?2:0),1,B);r(9,14+i*2,1,1,Bd);r(19,14+i*2,1,1,Bd)}
 r(8,11,13,2,B);r(7,12,2,3,B);r(20,12,2,3,B);r(5,10,8,2,'#8a2a30');r(3,12,6,6,'#8a2a30');r(4,17,3,2,'#6a1a20');
 ell(r,15,6,5,5,B);r(10,8,11,4,B);r(11,11,9,2,Bd);r(11,5,3,3,'#1a1a1a');r(16,5,3,3,'#1a1a1a');r(12,6,1,2,'#ff3030');r(17,6,1,2,'#ff3030');r(14,8,2,2,'#222');
 for(let i=0;i<5;i++)r(12+i*2,11,1,2,'#222');r(10,0,11,3,'#6a6a7a');r(9,2,13,2,'#8a8a9a');r(14,0,2,2,'#c9a227');
 r(20,13-up,2,6,B);r(19,12-up,3,2,Bd);
 if(a){r(22,14,9,2,'#c8d0e0');r(22,14,9,1,'#fff');r(21,13,1,4,'#c9a227');r(26,16,1,1,'#7a5a3a')}else{r(22,6-up,2,10,'#c8d0e0');r(22,6-up,1,10,'#fff');r(20,15-up,6,1,'#c9a227');r(22,16-up,2,2,'#7a4a22')}};
MON[7].d=(r,s)=>{const b=Math.round(Math.sin(s.t*.07)*2),up=Math.round(s.q*8),t=s.t;
 for(let j=0;j<34;j++){const w=14+j,x=28-Math.floor(w/2),wv=Math.round(Math.sin(t*.1+j*.3)*(j>24?2:0));r(x+wv,22+j+b,w,1,j%9<2?'#8a44c8':'#4a2a7a');r(x+wv,22+j+b,2,1,'#6a38a0');r(x+wv+w-3,22+j+b,3,1,'#2a1850');if(j%6==3){r(x+wv+4,22+j+b,1,1,'#2a1850');r(x+wv+w-6,22+j+b,1,1,'#2a1850')}}
 r(26,24+b,4,30,'#d9a030');r(27,24+b,1,30,'#fff3a0');r(16,19+b,24,6,'#3a1e6a');r(16,19+b,24,1,'#6a38a0');r(14,17+b,5,6,'#d9a030');r(37,17+b,5,6,'#d9a030');r(15,14+b,3,3,'#d9a030');r(38,14+b,3,3,'#d9a030');
 ell(r,28,13+b,6,6,'#eee8d8');r(23,15+b,11,5,'#eee8d8');r(24,19+b,9,2,'#c8c0ae');r(24,11+b,4,4,'#1a0a2a');r(29,11+b,4,4,'#1a0a2a');r(25,12+b,2,2,'#c040ff');r(30,12+b,2,2,'#c040ff');r(27,16+b,2,2,'#2a1a3a');
 for(let i=0;i<5;i++)r(25+i*2,19+b,1,2,'#2a1a3a');
 r(22,6+b,12,3,'#d9a030');r(22,2+b,2,5,'#d9a030');r(27,0+b,2,6,'#d9a030');r(32,2+b,2,5,'#d9a030');r(27,3+b,2,2,'#ff3060');r(24,6+b,2,2,'#40c8ff');
 r(11,27+b-up,8,4,'#4a2a7a');r(8,26+b-up,5,5,'#eee8d8');r(37,27+b-up,8,4,'#4a2a7a');r(43,26+b-up,5,5,'#eee8d8');
 r(50,14+b,2,46,'#6a4426');r(49,14+b,1,46,'#8a6038');r(46,8+b,2,10,'#d9a030');r(54,8+b,2,10,'#d9a030');r(47,16+b,8,2,'#d9a030');
 ell(r,51,10+b,3,3,Math.sin(t*.15)>0?'#e070ff':'#c040ff');r(50,9+b,2,2,'#fff');
 for(let i=0;i<3;i++){const a=t*.05+i*2.1;r(Math.round(28+Math.cos(a)*22),Math.round(34+b+Math.sin(a)*6),2,2,'#7ae8ff')}};
MON[8].d=(r,s)=>{const fast=s.q>0||s.a>=0,t=s.t,wh=14+Math.round(Math.sin(t*(fast?.5:.15))*7),m=s.q>0?Math.round(s.q*4):0;
 for(let i=0;i<20;i++){const h=Math.round(wh*Math.sin((i+1)/21*3.14)),x=13+i;r(x,26-h,1,h,'#8a2a20');r(x,26-h,1,2,'#e05040');if(i%5==2)r(x,26-h,1,h,'#5a1a14');if(i%5==4)r(x,24,1,2,'#c04030')}
 for(let i=0;i<14;i++){const y=38-Math.round(i*.6),h=6-Math.round(i*.3);r(i,y,1,Math.max(2,h),i%3?'#c0392b':'#a02a20')}
 r(0,29,4,4,'#ff9020');r(1,30,2,2,Math.floor(t/4)%2?'#ffe34a':'#fff');
 ell(r,28,34,17,8,'#a02a20');ell(r,28,33,16,7,'#c0392b');for(let i=0;i<7;i++){r(14+i*4,40,3,2,'#f0c060');r(14+i*4,24,2,3,'#8a2a20')}r(14,38,28,2,'#e0a850');
 r(18,41,6,10,'#a02a20');r(34,41,6,10,'#a02a20');r(18,41,2,9,'#c0392b');r(34,41,2,9,'#c0392b');r(15,50,10,3,'#2a2a2a');r(31,50,10,3,'#2a2a2a');r(15,50,2,3,'#f0e0c0');r(31,50,2,3,'#f0e0c0');
 r(40,14,9,16,'#c0392b');r(40,14,2,16,'#d8503c');for(let i=0;i<5;i++)r(41,16+i*3,8,1,'#f0c060');
 ell(r,50,13,6,5,'#d04030');r(54,12,8,6,'#d04030');r(54,12,8,2,'#e0604a');r(54,17,8,2,'#a02a20');
 r(48,9,2,3,'#f0e0c0');r(52,8,2,4,'#f0e0c0');r(44,6,3,7,'#f0e0c0');r(46,4,2,4,'#f0e0c0');
 r(50,11,3,3,'#ffe34a');r(51,11,1,3,'#111');r(60,13,1,1,'#222');r(55,18,1,2,'#fff');r(58,18,1,2,'#fff');
 if(m){r(56,19,4+m,3,'#ffa020');r(56,21,3+m,1,'#fff08a')}else if(Math.floor(t/20)%2)r(62,11,1,2,'#9a9aaa')};
// ===== keadaan =====

window.MON=MON;window.monSpr=spr;
})();
