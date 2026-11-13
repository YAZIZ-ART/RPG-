/* HQ v10: resolusi tinggi, partikel soft-glow, bloom 2 level, pencahayaan dinamis, color grading */
const Q11={lv:2,cap(){return[250,550,900][this.lv]},cycle(){this.lv=(this.lv+1)%3;try{localStorage.setItem('aeth_q',this.lv)}catch(_){}resize();}};try{const q=localStorage.getItem('aeth_q');Q11.lv=q!=null?Math.min(2,Math.max(0,+q|0)):(matchMedia('(pointer:coarse)').matches?1:2);}catch(_){}
const _rs10=resize;resize=function(){const d=[1,1.5,Math.min(3,Math.max(2,window.devicePixelRatio||1))][Q11.lv],s=Math.min(innerWidth/W,innerHeight/H);cv.style.width=W*s+'px';cv.style.height=H*s+'px';cv.width=Math.round(W*s*d);cv.height=Math.round(H*s*d);SC=cv.width/W;};
removeEventListener('resize',_rs10);addEventListener('resize',resize);resize();
const GS10={};function gspr(c){const k=(c[0]>>4)+','+(c[1]>>4)+','+(c[2]>>4);if(GS10[k])return GS10[k];const s=document.createElement('canvas');s.width=s.height=64;const g=s.getContext('2d'),r=g.createRadialGradient(32,32,0,32,32,32),R=(c[0]&240)|8,G=(c[1]&240)|8,B=(c[2]&240)|8;
 r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.25,'rgba('+R+','+G+','+B+',.8)');r.addColorStop(1,'rgba('+R+','+G+','+B+',0)');g.fillStyle=r;g.fillRect(0,0,64,64);return GS10[k]=s;}
const HPX=[];
function emit(p,c,n,o){o=o||{};for(let i=0;i<n&&HPX.length<Q11.cap();i++){const a=Math.random()*TAU,s=(o.sp||80)*(.3+Math.random()),l=(o.l||.5)*(.6+Math.random()*.8);HPX.push({k:o.k||'g',x:p.x,y:p.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s*.8-(o.up||0),l,m:l,s:(o.s||5)*(.5+Math.random()),c,g:o.g==null?120:o.g});}}
const _sp10=spark;spark=function(pos,pl2,cnt,spd){_sp10(pos,pl2,cnt,spd);const c=pl2[1]||pl2[0];emit(pos,c,cnt,{sp:spd,s:6,l:.6});emit(pos,[255,255,255],Math.ceil(cnt/3),{sp:spd*1.3,k:'s',s:3,l:.35,g:200});if(cnt>16)emit(pos,[90,90,100],6,{sp:30,k:'m',s:8,l:.9,g:-20});};
const _uq=update;update=function(dt){_uq(dt);
 for(let i=HPX.length-1;i>=0;i--){const q=HPX[i];q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=q.g*dt;q.vx*=.97;q.l-=dt;if(q.l<=0)HPX.splice(i,1);}
 if(state!=='battle')return;
 for(const e of fx){const p=e.t/e.dur,ht=HITT[e.type]||.4;if(!e.self&&p<ht&&p>0){const h=lerpV(add(e.from,V(0,-14)),add(e.to,V(0,-14)),p/ht);emit(h,e.pal[1],1,{sp:30,s:5,l:.45,g:-10});if(Math.random()<.6)emit(h,e.pal[2]||e.pal[0],1,{sp:60,k:'s',s:2.5,l:.3,g:60});}
  if(e.hit&&!e.q10){e.q10=1;const big=e.dmg>=300?2:1,c=add(e.to,V(0,-8));emit(c,e.pal[1],22*big,{sp:150*big,s:7,l:.7});emit(c,[255,255,255],12*big,{sp:230,k:'s',s:3,l:.4,g:240});emit(c,[80,80,90],4*big,{sp:35,k:'m',s:9,l:1,g:-25});emit(c,e.pal[0],8*big,{sp:90,s:4,l:1.1,g:-40,up:30});}}
 if(pl.mov&&Math.random()<.25)emit(V(pl.pos.x,pl.pos.y),[170,160,130],1,{sp:20,k:'m',s:5,l:.6,g:-10});};
function drawHQ(){ctx.save();ctx.globalCompositeOperation='lighter';
 for(let i=0;i<(Q11.lv>1?46:Q11.lv?24:0);i++){const x=camX+(((hr(i)*W+tg*(6+hr(i*3)*9))%W)+W)%W,y=camY+(((hr(i*5)*H-tg*(4+hr(i*7)*6))%H)+H)%H,a=.12+.2*(.5+.5*Math.sin(tg*1.6+i*2.1));ctx.globalAlpha=a;const s=3+hr(i*9)*4;ctx.drawImage(gspr(i%3?[255,235,170]:[150,255,200]),x-s,y-s,s*2,s*2);}
 for(const q of HPX){const a=q.l/q.m;if(q.k==='m'){ctx.globalCompositeOperation='source-over';ctx.globalAlpha=.22*a;const s=q.s*(1+(1-a)*2.2);ctx.drawImage(gspr([110,110,120]),q.x-s,q.y-s,s*2,s*2);ctx.globalCompositeOperation='lighter';continue;}
  if(q.k==='s'){ctx.globalAlpha=a;ctx.strokeStyle='rgb('+(q.c[0]|0)+','+(q.c[1]|0)+','+(q.c[2]|0)+')';ctx.lineWidth=q.s*.5*a+.5;ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(q.x-q.vx*.045,q.y-q.vy*.045);ctx.stroke();ctx.globalAlpha=a*.8;const s=q.s;ctx.drawImage(gspr([255,255,255]),q.x-s,q.y-s,s*2,s*2);continue;}
  ctx.globalAlpha=Math.min(1,a*1.2);const s=q.s*(.4+.6*a)*(.85+.3*Math.sin(tg*30+q.x));ctx.drawImage(gspr(q.c),q.x-s*2,q.y-s*2,s*4,s*4);}
 ctx.globalAlpha=.14;ctx.drawImage(gspr([255,225,170]),pl.pos.x-60,pl.pos.y-70,120,120);
 for(const e of fx){const p=e.t/e.dur,k=Math.sin(Math.min(1,p)*PI);ctx.globalAlpha=.22*k*(e.nk?1.4:1);const h=lerpV(add(e.from,V(0,-14)),add(e.to,V(0,-14)),clamp(p/(HITT[e.type]||.4),0,1)),r=e.nk?(e.i===2?120:80):60;ctx.drawImage(gspr(e.pal[1]),h.x-r,h.y-r,r*2,r*2);}
 for(const m of MONS)if(m.boss&&m.alive){ctx.globalAlpha=.16+.06*Math.sin(tg*3);ctx.drawImage(gspr(m.col),m.pos.x-90,m.pos.y-110,180,180);}
 ctx.restore();}
const _de10=drawEntities;drawEntities=function(){_de10();drawHQ();};
const b1q=document.createElement('canvas'),b2q=document.createElement('canvas');b1q.width=320;b1q.height=180;b2q.width=96;b2q.height=54;const x1q=b1q.getContext('2d'),x2q=b2q.getContext('2d');x1q.imageSmoothingEnabled=x2q.imageSmoothingEnabled=true;
bloom=function(){if(Q11.lv===0)return;const a=Math.min(.42,.07+fx.length*.07);x1q.drawImage(cv,0,0,cv.width,cv.height,0,0,320,180);x2q.drawImage(b1q,0,0,320,180,0,0,96,54);ctx.save();ctx.globalCompositeOperation='lighter';ctx.imageSmoothingEnabled=true;ctx.globalAlpha=a;ctx.drawImage(b2q,0,0,W,H);ctx.globalAlpha=a*.5;ctx.drawImage(b1q,0,0,W,H);ctx.restore();};
const _dhq=drawHud;drawHud=function(){if(state==='battle'&&Q11.lv>0){ctx.save();ctx.globalCompositeOperation='soft-light';const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(80,60,160,.35)');g.addColorStop(1,'rgba(255,170,90,.22)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore();
 const v=ctx.createRadialGradient(W/2,H/2,H*.38,W/2,H/2,H*.95);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,12,.38)');ctx.fillStyle=v;ctx.fillRect(0,0,W,H);}_dhq();};
