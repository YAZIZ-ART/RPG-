/* SkillFX — 40 efek kekuatan elemen, digambar dari kode (tanpa gambar). Tiap kekuatan = motif + warna. */
(()=>{'use strict';
const T=Math.PI*2,H=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s)},env=k=>Math.min(1,k*6)*(1-k);
const C={f:'#ff6a2b',y:'#ffd84a',w:'#4cc9ff',e:'#c68a54',a:'#7ff0dc',s:'#dfe7ee',p:'#ff5cf0',g:'#5fd35f',m:'#5a3b24',i:'#bff3ff',l:'#9fb4d0',k:'#c9b8ff',h:'#5dff9c',x:'#ffffff',r:'#9aa7b5',b:'#8a6a4a',d:'#d9c4a0',o:'#ff4d5a',u:'#e6f7ff',z:'#2f8f4a'};
// urutan sama dengan 40 kekuatan di data.js
const SPEC='mist,s,w;pool,f,e;orb,p,y;vortex,f,y;pool,m,e;pool,w,y;wall,i,w;wave,w,s;quake,e,f;pull,r,o;mist,e,a;wall,b,e;bolts,y,f;bolts,w,y;rain,l,y;quake,e,y;vortex,a,f;mist,k,a;mist,d,a;vortex,a,y;dragon,f,e;sun,y,f;pool,f,e;beam,y,x;wall,z,g;mist,y,w;vortex,h,w;wave,w,e;quake,e,a;wall,r,y;pull,r,o;quake,e,y;beam,w,y;rain,l,y;beam,x,y;wave,u,a;rain,w,i;rainbow,x,x;wave,w,e;rainbow,h,k'.split(';').map(s=>s.split(','));
const DUR={mist:1.1,pool:1.6,orb:.9,vortex:1.3,wave:.9,quake:1,pull:.9,wall:1.4,bolts:.8,rain:1.6,dragon:1.2,sun:1,beam:.5,rainbow:1.5};
const gl=(g,x,y,r,c,al)=>{if(r<1)return;const q=g.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,c);q.addColorStop(1,'rgba(0,0,0,0)');g.globalAlpha=Math.max(0,Math.min(1,al));g.fillStyle=q;g.fillRect(x-r,y-r,r*2,r*2)};
const ln=(g,pts,c,w,al)=>{g.globalAlpha=Math.max(0,Math.min(1,al));g.strokeStyle=c;g.lineWidth=w;g.lineJoin='round';g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke()};
const M={
mist(g,x,y,k,f){const e=env(k);for(let i=0;i<14;i++){const a=H(i+f.s)*T,d=f.R*k*(.3+H(i+9)*.7);gl(g,x+Math.cos(a)*d,y+Math.sin(a)*d*.7-k*20,22+k*46*(.6+H(i+3)),i%2?f.c1:f.c2,.45*e)}},
pool(g,x,y,k,f){const e=env(k),rx=f.R*.8*Math.min(1,k*4);g.globalAlpha=.5*e;g.fillStyle=f.c1;g.beginPath();g.ellipse(x,y+6,rx,rx*.5,0,0,T);g.fill();g.globalAlpha=.6*e;g.fillStyle=f.c2;g.beginPath();g.ellipse(x,y+6,rx*.6,rx*.3,0,0,T);g.fill();
 for(let i=0;i<16;i++){g.globalAlpha=e;g.fillStyle=f.c2;g.fillRect(x+(H(i+f.s)-.5)*rx*1.6,y+(H(i+5)-.5)*rx*.7-((k*3+H(i+2))%1)*30,3,3)}},
orb(g,x,y,k,f){const r=f.R*.55*(k<.6?k/.6:1+(k-.6)*1.5),e=1-k*.6;gl(g,x,y-10,r,f.c1,.9*e);gl(g,x,y-10,r*.5,f.c2,e);if(k>.6){g.globalAlpha=1-k;g.strokeStyle=f.c1;g.lineWidth=3;g.beginPath();g.arc(x,y,f.R*(k-.6)/.4,0,T);g.stroke()}},
vortex(g,x,y,k,f){const e=env(k)+.15*(1-k);for(let i=0;i<46;i++){const t=i/46,a=t*14+k*9,rr=f.R*.9*(.15+t*.85)*Math.min(1,k*3);g.globalAlpha=e;g.fillStyle=i%2?f.c1:f.c2;const s=2+t*3;g.fillRect(x+Math.cos(a)*rr,y-t*80+Math.sin(a)*rr*.35,s,s)}gl(g,x,y,f.R*.5,f.c1,.25*e)},
wave(g,x,y,k,f){for(let j=0;j<3;j++){const kk=Math.min(1,k*1.2-j*.18);if(kk<=0)continue;const r=f.R*(.3+kk*1.3);g.globalAlpha=(1-kk)*.9;g.strokeStyle=j%2?f.c1:f.c2;g.lineWidth=10*(1-kk)+2;g.beginPath();g.arc(x,y,r,f.a-1.1,f.a+1.1);g.stroke();
 for(let i=0;i<8;i++){const a=f.a-1.1+H(i+j)*2.2;g.fillStyle=f.c2;g.fillRect(x+Math.cos(a)*r,y+Math.sin(a)*r-H(i)*10,3,3)}}},
quake(g,x,y,k,f){const e=1-k;g.globalAlpha=e;g.strokeStyle=f.c2;g.lineWidth=3;g.beginPath();g.ellipse(x,y+6,f.R*k,f.R*k*.55,0,0,T);g.stroke();
 for(let i=0;i<10;i++){const a=i/10*T+H(i)*.4,pts=[[x,y+6]];for(let j=1;j<5;j++){const d=f.R*k*j/4;pts.push([x+Math.cos(a)*d+(H(i*9+j)-.5)*12,y+6+Math.sin(a)*d*.55+(H(i*7+j)-.5)*6])}ln(g,pts,f.c2,2,e)}
 for(let i=0;i<14;i++){const a=H(i+f.s)*T,d=f.R*k*H(i+2);g.globalAlpha=e;g.fillStyle=f.c1;g.fillRect(x+Math.cos(a)*d,y+Math.sin(a)*d*.55-Math.sin(k*Math.PI)*40*H(i+4),4,4)}},
pull(g,x,y,k,f){const e=env(k);for(let i=0;i<30;i++){const a=H(i+f.s)*T,d=f.R*(1-k)*(.5+H(i+1)*.5)+8;ln(g,[[x+Math.cos(a)*d,y+Math.sin(a)*d*.7],[x+Math.cos(a)*d*.8,y+Math.sin(a)*d*.56]],i%2?f.c1:f.c2,2,e)}gl(g,x,y,10+k*40,f.c2,.8*e)},
wall(g,x,y,k,f){const h=46*Math.min(1,k*5)*(k>.8?(1-k)/.2:1);for(let i=0;i<7;i++){const a=f.a+(i-3)*.32,bx=x+Math.cos(a)*70,by=y+Math.sin(a)*60,hh=h*(.7+H(i+f.s)*.6);g.globalAlpha=.9;g.fillStyle=f.c1;g.beginPath();g.moveTo(bx-9,by);g.lineTo(bx-3,by-hh);g.lineTo(bx+3,by-hh);g.lineTo(bx+9,by);g.fill();g.fillStyle=f.c2;g.globalAlpha=.6;g.fillRect(bx+2,by-hh,2,hh)}},
bolts(g,x,y,k,f){const e=1-k,sd=Math.floor(k*14);gl(g,x,y,f.R*.45,f.c2,.4*e);for(let i=0;i<6;i++){const a=H(i+sd)*T,pts=[[x,y]];for(let j=1;j<=6;j++){const d=f.R*j/6;pts.push([x+Math.cos(a)*d+(H(i*5+j+sd)-.5)*26,y+Math.sin(a)*d*.8+(H(i*3+j+sd)-.5)*26])}ln(g,pts,f.c1,4,e);ln(g,pts,'#fff',1.5,e)}},
rain(g,x,y,k,f){const e=env(k)+.1;gl(g,x,y-f.R*.8,f.R*.7,f.c1,.35*e);for(let i=0;i<40;i++){const px=x+(H(i+f.s)-.5)*f.R*2,py=y-f.R+((k*2.2+H(i+7))%1)*f.R*1.6;ln(g,[[px,py],[px-3,py+12]],i%3?f.c1:f.c2,1.5,e)}
 for(let i=0;i<6;i++){g.globalAlpha=e*.5;g.strokeStyle=f.c2;g.lineWidth=1;g.beginPath();g.ellipse(x+(H(i)-.5)*f.R*1.6,y+(H(i+3)-.5)*f.R*.8,4+((k*3+H(i))%1)*10,2+((k*3+H(i))%1)*5,0,0,T);g.stroke()}},
dragon(g,x,y,k,f){const p=k*1.3;for(let i=29;i>=0;i--){const t=i/30,s=p-t*.25;if(s<0||s>1.1)continue;const d=s*f.R*2.2,pp=Math.sin(s*14)*18,px=x+Math.cos(f.a)*d-Math.sin(f.a)*pp,py=y+Math.sin(f.a)*d+Math.cos(f.a)*pp-12,r=(i?10-t*6:14);gl(g,px,py,r*2,i%2?f.c1:f.c2,.8*(1-Math.max(0,k-.7)/.3));if(!i){g.fillStyle='#fff';g.fillRect(px+3,py-3,3,3)}}},
sun(g,x,y,k,f){const e=env(k);gl(g,x,y,f.R*.6*Math.min(1,k*3),f.c1,.7*e);gl(g,x,y,f.R*.3,f.c2,e);for(let i=0;i<16;i++){const a=i/16*T+k*3,r0=14,r1=f.R*(.4+k*.9);g.globalAlpha=.7*e;g.fillStyle=i%2?f.c1:f.c2;g.beginPath();g.moveTo(x+Math.cos(a-.07)*r0,y+Math.sin(a-.07)*r0);g.lineTo(x+Math.cos(a)*r1,y+Math.sin(a)*r1);g.lineTo(x+Math.cos(a+.07)*r0,y+Math.sin(a+.07)*r0);g.fill()}},
beam(g,x,y,k,f){const L=f.R*2.2,w=Math.sin(k*Math.PI),ex=x+Math.cos(f.a)*L,ey=y+Math.sin(f.a)*L,P=[[x,y],[ex,ey]];ln(g,P,f.c1,14*w+2,.5);ln(g,P,f.c2,5*w+1,.9);ln(g,P,'#fff',2*w,1);gl(g,ex,ey,26*w,f.c1,.8);gl(g,x,y,22*w,f.c2,.8)},
rainbow(g,x,y,k,f){const e=env(k),pal=f.c1==='#ffffff'?['#ff4d4d','#ff9a3c','#ffe45a','#5fd35f','#4cc9ff','#5b6bff','#b45cff']:['#5dff9c','#7ff0dc','#c9b8ff','#ff5cf0'];pal.forEach((c,i)=>{g.globalAlpha=.85*e;g.strokeStyle=c;g.lineWidth=7;g.beginPath();g.arc(x,y+10,f.R*.55+i*7,Math.PI,Math.PI+Math.PI*Math.min(1,k*3));g.stroke()});for(let i=0;i<12;i++){g.globalAlpha=e;g.fillStyle='#fff';g.fillRect(x+(H(i+f.s)-.5)*f.R*1.2,y-H(i+4)*f.R*.7,2,2)}}
};
const L=[];
window.SkillFX={count:SPEC.length,
 cast(i,x,y,a,R=150){const sp=SPEC[i];if(!sp)return false;L.push({m:sp[0],c1:C[sp[1]],c2:C[sp[2]],x,y,a,R,t:0,d:DUR[sp[0]]||1,s:Math.random()*50});if(L.length>8)L.shift();
  const fx=window.RPGVFX;if(fx){fx.flash(x,y,C[sp[1]],R*.6,.2);fx.burst(x,y,C[sp[2]],30,200,'spark');if(sp[0]==='bolts')for(let j=0;j<4;j++){const b=j*1.57+Math.random();fx.bolt(x,y,x+Math.cos(b)*R,y+Math.sin(b)*R,C[sp[1]])}}return true},
 update(dt){for(const f of L)f.t+=dt;for(let i=L.length-1;i>=0;i--)if(L[i].t>=L[i].d)L.splice(i,1)},
 draw(ctx,cam){if(!L.length)return;ctx.save();ctx.globalCompositeOperation='lighter';for(const f of L)M[f.m](ctx,f.x-cam.x,f.y-cam.y,f.t/f.d,f);ctx.restore();ctx.globalAlpha=1}
};
})();
