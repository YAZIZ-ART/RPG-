/* SYSTEMS v9: level 1-50 + EXP, HP/MP, pause menu, AI musuh (patrol/kejar/combo), BOSS Hydra/Dragon/Giant, animasi jalan/lari */
const ST9={lv:1,xp:0,hp:0,mp:0,inv:0,psn:0,dead:0,pause:false,nm:0};
const mxHP=()=>120+ST9.lv*18,mxMP=()=>60+ST9.lv*4,dmM=()=>1+(ST9.lv-1)*.06,need=()=>ST9.lv*60+ST9.lv*ST9.lv*8;
ST9.hp=mxHP();ST9.mp=mxMP();
const RW9=[],BN9={t:0,txt:''},MCOST=[12,22,40],SKCOST=20;
function popTxt(p,s,col,sz){dtx.push({pos:V(p.x,p.y),txt:s,t:0,col,sz:sz||13});}
function giveXp(n){RW9.push({t:0,n});if(ST9.lv>=50)return;ST9.xp+=n;while(ST9.lv<50&&ST9.xp>=need()){ST9.xp-=need();ST9.lv++;lvlUp();}if(ST9.lv>=50)ST9.xp=0;}
function lvlUp(){ST9.hp=mxHP();ST9.mp=mxMP();BN9.t=2.2;BN9.txt='LEVEL UP  Lv '+ST9.lv;const p=pl.pos;
 fxAdd('aura',p,[255,230,120,1],{d:1.6});fxAdd('pulse',p,[90,255,160,1],{d:1.2});fxAdd('rays',p,[255,240,170,1],{d:1.6});fxAdd('runes',p,[160,200,255,1],{d:1.8});SFL=.5;SFC=[255,240,170,1];snd('awaken',1);snd('heal',.8);}
function hurtP(d,m){if(ST9.inv>0||ST9.dead>0)return;ST9.hp-=d;ST9.inv=.55;popTxt(add(pl.pos,V(0,-40)),'-'+d,[255,90,90,1],15);snd('hurt',1);shake=Math.max(shake,5);CA=Math.max(CA,.12);
 if(ST9.hp<=0){ST9.hp=0;ST9.dead=2.4;snd('lose',1);VG=1;fxAdd('collapse',pl.pos,[160,120,255,1],{d:1.2});}}
function aoeHit(c,r,d,m,psn){if(dist(pl.pos,c)<r+8){hurtP(Math.round(d),m);if(psn){ST9.psn=5;snd('status',1);}}}
/* mana + skala damage + efek jurus */
const _cN=castN;castN=function(i){if(state!=='battle'||pl.lock>0||ncd[i]>0||skQ.length||ST9.dead>0)return;
 if(ST9.mp<MCOST[i]){if(tg-ST9.nm>1){ST9.nm=tg;popTxt(add(pl.pos,V(0,-46)),'MANA KURANG',[120,170,255,1],11);}return;}
 const n=fx.length;_cN(i);if(fx.length>n){ST9.mp-=MCOST[i];const c=pal(LIST[sel].pal)[1];
  if(i===0)fxAdd('ember',pl.pos,c,{d:.9});else if(i===1)fxAdd('vortex',pl.pos,c,{d:1});else{fxAdd('over',pl.pos,c,{d:1});fxAdd('runes',pl.pos,c,{d:1.2});fxAdd('rays',pl.pos,c,{d:1.2});snd('overch',.9);}}};
const _sk9=skill;skill=function(){if(state!=='battle'||skcd>0||skQ.length||ST9.dead>0)return;if(ST9.mp<SKCOST){if(tg-ST9.nm>1){ST9.nm=tg;popTxt(add(pl.pos,V(0,-46)),'MANA KURANG',[120,170,255,1],11);}return;}ST9.mp-=SKCOST;_sk9();};
const _c9=cast;cast=function(i,m,f){const n=fx.length;_c9(i,m,f);if(fx.length>n)fx[fx.length-1].dmg*=dmM();};
const _dd9=doDash;doDash=function(){const p=V(pl.pos.x,pl.pos.y),b=dsh.t;_dd9();if(dsh.t>b)fxAdd('tele',p,pal(LIST[sel].pal)[1],{d:.45});};
/* ---- musuh ---- */
function normAI(m,dt){const d=dist(m.pos,pl.pos),ar=m.sc>4?170:120;m.ag=m.ag?d<ar*2:d<ar;if(!m.ag){m.at=0;return;}m.wt=2;m.cdA=Math.max(0,(m.cdA||0)-dt);const rg=m.r+16;
 if(m.at>0){m.at-=dt;m.tg=V(m.pos.x,m.pos.y);if(m.at<=0){if(dist(m.pos,pl.pos)<rg+14)hurtP(Math.round(6+m.sc*3+ST9.lv*.5),m);fxAdd('crack',m.pos,m.glow||[255,120,100,1],{d:.4,s:.5});if(m.cmb>0){m.cmb--;m.at=.22;}else m.cdA=1.3;}return;}
 m.tg=V(pl.pos.x,pl.pos.y);if(d<rg+6&&m.cdA<=0){m.at=.55;m.cmb=m.sc>3?1:0;}}
function bossAI(m,dt){const d=dist(m.pos,pl.pos);m.ag=m.ag?d<420:d<260;if(!m.ag){m.tl=0;m.bt=1.5;return;}
 if(!m.ph2&&m.hp<m.max*.5){m.ph2=true;m.sp*=1.35;fxAdd('rift',m.pos,m.col,{d:1.6,s:1.6});SFL=.6;SFC=m.col;VG=1;slowT(.05,.18);snd('roar',1.2);snd('rift',1);BN9.t=2;BN9.txt=m.name+' - FASE 2';}
 m.wt=2;m.cc=m.cc||0;if(m.tl>0){m.tl-=dt;m.tg=V(m.pos.x,m.pos.y);if(m.tl<=0)bossHit(m);return;}
 m.tg=V(pl.pos.x,pl.pos.y);if(d<m.r+30)m.tg=V(m.pos.x,m.pos.y);m.bt-=dt;
 if(m.bt<=0){m.at9=m.cc++%3;m.tl=m.ph2?.7:.95;m.cx=V(pl.pos.x,pl.pos.y);m.bt=m.ph2?1.2:2.2;snd('bcharge',.9);}}
function bossHit(m){const dm=22+ST9.lv*1.3+(m.ph2?10:0),k=m.at9,c=m.col,hy=m.boss==='hydra';
 if(k===0){aoeHit(m.pos,100,dm,m);fxAdd('cine',m.pos,c,{d:.9});fxAdd('crack',m.pos,c,{d:1,s:1.6});snd('bimpact',1);shake=Math.max(shake,9);}
 else if(k===1){if(m.boss==='dragon'){fxAdd('tele',m.pos,c,{d:.5});m.pos=V(clamp(m.cx.x-30,40,WW-40),clamp(m.cx.y-20,60,WH-40));m.tg=V(m.pos.x,m.pos.y);fxAdd('tele',m.pos,c,{d:.5});}
  aoeHit(m.cx,hy?70:60,dm*1.1,m,hy);fxAdd('crack',m.cx,c,{d:.8});fxAdd(hy?'ember':'frag',m.cx,c,{d:.9});snd(hy?'debuff':'boom',.9);}
 else{for(const o of(m.boss==='dragon'?[-40,0,40]:[0]))aoeHit(V(m.cx.x+o,m.cx.y),70,dm*1.2,m);fxAdd('cine',m.cx,c,{d:.8});fxAdd('ember',m.cx,c,{d:1});fxAdd('runes',m.cx,c,{d:1});snd('boom',1);shake=Math.max(shake,7);}
 if(Math.random()<.5)m.bt=.25;}
const _sM9=stepMon;stepMon=function(m,dt){if(m.alive&&ST9.dead<=0){if(m.boss)bossAI(m,dt);else normAI(m,dt);}_sM9(m,dt);};
const BD=[{n:'HYDRA',b:'hydra',x:1250,y:130,hp:7000,r:34,sp:42,col:[90,255,140,1]},{n:'DRAGON',b:'dragon',x:1330,y:470,hp:10000,r:36,sp:55,col:[255,110,60,1]},{n:'GIANT',b:'giant',x:300,y:480,hp:12000,r:36,sp:36,col:[255,170,60,1]}];
const _iM9=initMonsters;initMonsters=function(){_iM9();for(const d of BD)MONS.push({pos:V(d.x,d.y),hp:d.hp,max:d.hp,flash:0,alive:true,rt:0,ph:Math.random()*6,kb:0,kd:1,name:d.n,pk:'g',sc:6,r:d.r,home:V(d.x,d.y),tg:V(d.x,d.y),wt:2,sp:d.sp,sp0:d.sp,leash:60,glow:d.col,boss:d.b,col:d.col,bt:2,xpd:false});ST9.hp=mxHP();ST9.mp=mxMP();};
function onKill(m){const b=!!m.boss;giveXp(b?600+ST9.lv*10:Math.round(m.sc*14+ST9.lv));fxAdd('dis',m.pos,b?m.col:(m.glow||[200,200,255,1]),{d:1,s:b?4:m.sc/2});snd('die',1);
 if(b){m.rt=120;fxAdd('collapse',m.pos,m.col,{d:1.4});fxAdd('rift',m.pos,m.col,{d:1.4,s:1.4});snd('final',1);snd('win',1);slowT(.2,.9);SFL=.7;SFC=m.col;VG=1;BN9.t=3;BN9.txt=m.name+' DIKALAHKAN';}}
/* update utama: pause, slow-mo, regen mana, racun, EXP, mode BGM, efek jurus pamungkas */
const _u9=update;update=function(dt){if(ST9.pause)return;const rd=dt;if(TS.t>0){TS.t-=rd;if(TS.t<=0)TS.k=1;}dt*=TS.k;
 if(ST9.dead>0){ST9.dead-=rd;if(ST9.dead<=0){ST9.hp=mxHP();ST9.mp=mxMP();pl.pos=V(SPAWN.x,SPAWN.y);ST9.inv=2;ST9.psn=0;for(const m of MONS)m.ag=false;fxAdd('tele',pl.pos,[200,200,255,1],{d:.6});}return;}
 ST9.inv=Math.max(0,ST9.inv-rd);ST9.mp=Math.min(mxMP(),ST9.mp+(4+ST9.lv*.1)*dt);ST9.hp=Math.min(mxHP(),ST9.hp+.5*dt);
 if(ST9.psn>0){ST9.psn-=dt;ST9.hp-=(3+ST9.lv*.2)*dt;if(ST9.hp<=0)hurtP(1,null);}
 _u9(dt);
 for(const m of MONS){if(m.alive){if(m.xpd){m.xpd=false;m.ph2=false;if(m.sp0)m.sp=m.sp0;}}else if(!m.xpd){m.xpd=true;onKill(m);}}
 for(const e of fx)if(e.nk&&e.i===2&&e.hit&&!e.u9){e.u9=1;RB=.35;VG=.8;fxAdd('cine',e.to,e.pal[1],{d:.9});fxAdd('crack',e.to,e.pal[1],{d:1.2,s:1.6});fxAdd('frag',e.to,e.pal[1],{d:.9});slowT(.15,.22);snd('final',.5);}
 BN9.t=Math.max(0,BN9.t-rd);for(const r of RW9)r.t+=rd;while(RW9.length&&RW9[0].t>2.2)RW9.shift();
 let md='field';for(const m of MONS)if(m.alive&&m.ag){if(m.boss){md='boss';break;}md='intense';}BGMODE=md;};
/* gambar: telegraph musuh, boss, animasi jalan/lari */
function tel(c,r,col,k){ctx.save();ctx.strokeStyle=css(fade(col,.5+.5*k));ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(c.x,c.y,r,r*.4,0,0,TAU);ctx.stroke();ctx.fillStyle=css(fade(col,.12+.2*k));ctx.beginPath();ctx.ellipse(c.x,c.y,r*k,r*k*.4,0,0,TAU);ctx.fill();ctx.restore();}
function pb(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
function drawBoss(m){const x=m.pos.x,y=m.pos.y,F=m.flash>0,t=tg,fc=pl.pos.x<x?-1:1,C=(a,b)=>F?'#fff':(m.ph2?b:a),ey=m.ph2?'#ff3030':'#ffe030';
 ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(x,y,m.r*1.1,m.r*.4,0,0,TAU);ctx.fill();
 if(m.boss==='hydra'){pb(x-30,y-26,60,26,C('#1f6b3a','#6b1f3a'));pb(x-24,y-14,48,12,C('#4aa86a','#a84a6a'));
  for(let i=-1;i<=1;i++){let px=x+i*14,py=y-22;for(let k=0;k<7;k++){px+=i*3+Math.sin(t*2+i*2+k*.6)*2.2;py-=8;pb(px-5+k*.3,py,10-k*.4,9,C('#2f8a4a','#8a2f4a'));}
   pb(px-9,py-12,18,12,C('#3aa85a','#a83a5a'));pb(px-6,py-8,4,4,ey);pb(px+3,py-8,4,4,ey);pb(px-7,py,3,4,'#fff');pb(px+4,py,3,4,'#fff');}}
 else if(m.boss==='dragon'){const w=Math.sin(t*5)*18;ctx.fillStyle=F?'#fff':(m.ph2?'#701010':'#8a1a1a');
  for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(x+s*10,y-28);ctx.lineTo(x+s*(46+w*.3),y-58-w);ctx.lineTo(x+s*60,y-30+w*.5);ctx.lineTo(x+s*24,y-18);ctx.closePath();ctx.fill();}
  pb(x-26,y-30,52,28,C('#c02a2a','#e04a1a'));pb(x-18,y-18,36,14,'#f0a060');
  for(let k=0;k<6;k++)pb(x-fc*(26+k*7),y-18+Math.sin(t*3+k)*3+k,10-k,7-k*.5,C('#a82020','#c03a10'));
  pb(x+fc*22-8,y-46,22,18,C('#d03a3a','#f05a2a'));pb(x+fc*30-3,y-40,5,4,ey);pb(x+fc*22-6,y-52,4,8,'#f4e0b0');pb(x+fc*22+6,y-52,4,8,'#f4e0b0');
  if(m.tl>0)gl(V(x+fc*34,y-36),[255,160,60,1],16,.8);}
 else{const sw=Math.sin(t*3)*6;pb(x-18,y-14+sw*.2,12,16,C('#5a4a40','#6a3a30'));pb(x+6,y-14-sw*.2,12,16,C('#5a4a40','#6a3a30'));pb(x-26,y-52,52,40,C('#8a7a6a','#9a5a4a'));
  for(let i=0;i<8;i++)pb(x-22+hr(i)*40,y-48+hr(i*3)*30,4,3,'#6a5a4a');pb(x-12,y-72,24,20,C('#9a8a7a','#aa6a5a'));pb(x-8,y-64,5,4,ey);pb(x+3,y-64,5,4,ey);
  pb(x-40,y-50+sw,14,34,C('#8a7a6a','#9a5a4a'));pb(x+26,y-50-sw,14,34,C('#8a7a6a','#9a5a4a'));pb(x+30,y-84-sw,12,50,'#6a4a2a');pb(x+26,y-92-sw,20,16,'#7a5a3a');}
 ctx.save();ctx.globalCompositeOperation='lighter';gl(V(x,y-30),m.col,40,.16+(m.ph2?.12:0));ctx.restore();
 if(m===mon){const ty=y-110+Math.sin(t*6)*2;ctx.fillStyle='#ffd35a';ctx.beginPath();ctx.moveTo(x-5,ty-4);ctx.lineTo(x+5,ty-4);ctx.lineTo(x,ty+3);ctx.closePath();ctx.fill();}
 if(m.tl>0){const k=1-m.tl/(m.ph2?.7:.95);tel(m.at9===0?m.pos:m.cx,m.at9===0?100:(m.at9===1&&m.boss!=='hydra'?60:70),m.col,k);}}
const _dm9=drawMon;drawMon=function(m){if(m.boss)return drawBoss(m);_dm9(m);if(m.at>0)tel(m.pos,m.r+22,[255,60,60,1],1-m.at/.55);};
const _dp9=drawPlayer;drawPlayer=function(){if(pl.hidden)return _dp9();const run=Math.hypot(joy.x,joy.y)>.85||dsh.t>0,bob=pl.mov?Math.abs(Math.sin(tg*(run?16:10)))*(run?2.6:1.5):0,lean=pl.mov?(run?.07:.03)*pl.face:0;
 ctx.save();ctx.translate(pl.pos.x,pl.pos.y);ctx.rotate(lean);ctx.translate(-pl.pos.x,-pl.pos.y-bob);if(ST9.inv>0&&Math.floor(tg*20)%2)ctx.globalAlpha=.5;_dp9();ctx.restore();};
/* UI: HP/MP/EXP, boss bar, reward EXP, level up, pause */
const PBN=[78,6,40,20],PBT=[[W/2-70,128,140,30,0],[W/2-70,166,140,30,1],[W/2-70,204,140,30,2]];
function bar(x,y,w,h,k,c){ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(x-1,y-1,w+2,h+2);ctx.fillStyle=c;ctx.fillRect(x,y,w*clamp(k,0,1),h);ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(x,y,w*clamp(k,0,1),Math.max(1,h/3));}
function drawUI9(){ctx.save();
 bar(8,54,104,8,ST9.hp/mxHP(),'#e0405a');bar(8,66,104,6,ST9.mp/mxMP(),'#3a8aff');bar(8,76,104,3,ST9.lv>=50?1:ST9.xp/need(),'#ffd35a');
 txt('Lv '+ST9.lv+(ST9.lv>=50?' MAX':''),8,94,11,'#ffd35a');txt(Math.ceil(ST9.hp)+'/'+mxHP(),116,62,8,'#fff');txt(Math.floor(ST9.mp)+'/'+mxMP(),116,72,8,'#9ac8ff');
 if(ST9.psn>0)txt('RACUN',8,106,9,'#6aff8a');
 ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(PBN[0],PBN[1],PBN[2],PBN[3]);txt('II',PBN[0]+PBN[2]/2,PBN[1]+15,12,'#fff','center');
 const b=MONS.find(m=>m.boss&&m.alive&&m.ag);if(b){const bw=300,x0=(W-bw)/2;bar(x0,70,bw,9,b.hp/b.max,'#c02a5a');ctx.fillStyle='#ffd35a';ctx.fillRect(x0+bw/2,68,1,13);txt('BOSS: '+b.name+(b.ph2?'  [FASE 2]':''),W/2,66,11,'#ffd0d8','center');}
 RW9.forEach((r,i)=>txt('+'+r.n+' EXP',W/2,100+i*13-r.t*6,11,css([255,230,120,clamp(2.2-r.t,0,1)]),'center'));
 if(BN9.t>0){const a=clamp(BN9.t,0,1);ctx.fillStyle='rgba(0,0,0,'+.5*a+')';ctx.fillRect(0,140,W,34);txt(BN9.txt,W/2,164,20,css([255,230,120,a]),'center');if(BN9.txt.startsWith('LEVEL'))txt('HP +18   MP +4   DMG +6%',W/2,184,10,css([180,230,255,a]),'center');}
 if(ST9.dead>0){ctx.fillStyle='rgba(120,0,0,.45)';ctx.fillRect(0,0,W,H);txt('KALAH',W/2,H/2,28,'#ff8080','center');}
 if(ST9.pause){ctx.fillStyle='rgba(0,0,10,.7)';ctx.fillRect(0,0,W,H);txt('PAUSE',W/2,110,24,'#fff','center');
  PBT.forEach(([x,y,w,h,a])=>{ctx.fillStyle='rgba(60,30,140,.9)';ctx.fillRect(x,y,w,h);ctx.strokeStyle='#c9a6ff';ctx.strokeRect(x+.5,y+.5,w-1,h-1);txt(['LANJUT','SUARA: '+(AU.on?'ON':'OFF'),'MENU UTAMA'][a],x+w/2,y+20,12,'#fff','center');});}
 ctx.restore();}
const _dh9=drawHud;drawHud=function(){_dh9();if(state==='battle')drawUI9();};
cv.addEventListener('pointerdown',e=>{if(state!=='battle')return;const m=ptr(e);
 if(ST9.pause){e.stopImmediatePropagation();e.preventDefault();for(const[x,y,w,h,a]of PBT)if(inR(m,[x,y,w,h])){if(a===0)ST9.pause=false;else if(a===1)setSnd(!AU.on);else{ST9.pause=false;state='select';}}return;}
 if(inR(m,PBN)){e.stopImmediatePropagation();ST9.pause=true;}},true);
addEventListener('keydown',e=>{if(state!=='battle')return;if(e.key==='Escape'||e.key==='p'||e.key==='P'){e.stopImmediatePropagation();ST9.pause=!ST9.pause;}else if(ST9.pause)e.stopImmediatePropagation();},true);
initMonsters();
