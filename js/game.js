/* AETHERIA — logika pertarungan: karakter, passive, 5 skill kombinasi, monster, 3 bos */
(()=>{
'use strict';
const $=i=>document.getElementById(i),WD=window.WD,P=WD.P,K=WD.K,MONS=window.MON,FX=window.SKILLFX;
const rnd=(a,b)=>a+Math.random()*(b-a),cl=(v,a,b)=>v<a?a:v>b?b:v,dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
let ci=+sessionStorage.getItem('aetheria_char');if(!(ci>=0&&ci<20))ci=0;
const CH=C[ci],WPN=ATK[CH[1]],EC=EL[CH[2]],PS=PAS[ci],HEAVY=WPN.s<=.05,SPIN=['Battle Axe','Nunchaku'].includes(CH[1]);
const NE={Api:'api',Air:'air',Tanah:'tanah',Petir:'listrik',Udara:'udara'};
/* ---- 5 slot skill: kombinasi yang memuat elemen karakter, tiap karakter se-elemen dapat set berbeda ---- */
const list=[];FX.E.forEach((e,i)=>{if(e[1].split(' + ').some(x=>NE[x]==CH[2]))list.push(i)});
const kIdx=C.slice(0,ci).filter(c=>c[2]==CH[2]).length,SL=[0,1,2,3,4].map(j=>list[(kIdx*4+j)%list.length]);
const UNL=[1,3,6,10,15],COST=[10,16,22,30,40],CD=[3,5,7,10,14],POW=[1.6,2.2,3,4,5.5];
const TYP={'Nadi Kehidupan':'heal','Hujan':'heal','Pelangi':'heal','Tembok Batu':'guard','Titan Mekanik':'guard','Es':'stun','Medan Listrik':'stun','Tornado Petir':'stun','Lumpur':'slow','Banjir Bandang':'slow','Kabut Ilusi':'slow','Fatamorgana':'slow','Tsunami':'slow'};
const H={hp:100,mp:50,lv:1,xp:0,dir:1,at:-1,dur:.2,cd:0,hit:0,inv:0,shield:0,guard:false,hits:0,buffT:0,still:0,comboN:0,comboT:0,brk:0,dodge:0,back:0,sk:[0,0,0,0,0],dead:0,kills:0,bosses:0};
const maxHp=()=>100+H.lv*16,maxMp=()=>50+H.lv*6,bd=()=>12+H.lv*4.2;
const M=[],PR=[],EP=[],FXL=[],PT=[],FT=[];let tmx=0,start={x:P.x,y:P.y};
/* ---- statistik dari passive (buff + debuff) ---- */
function stats(){const s={dmg:1,as:1,crit:.08,def:1,mv:1,rng:1,area:1,heal:1,mp:1,skill:1,cdm:1},lo=H.hp/maxHp();
 switch(ci){case 0:if(H.buffT>0)s.mv=.9;break;case 1:s.as=1.3;s.crit+=.1;s.dmg=.85;break;case 2:if(lo<.5)s.def=1.35;s.mv=.8;break;
 case 3:if(H.back>0)s.def=.85;break;case 4:s.rng=1.25;s.as=.9;break;case 5:s.area=1.3;if(H.at>=0)s.mv=.85;break;case 6:s.as=.85;break;
 case 7:if(lo<.3){s.dmg=1.4;s.def=.75}break;case 8:s.as=.75;break;case 9:s.dmg=.85;break;case 10:s.mv=.85;break;case 11:s.dmg=.85;break;
 case 12:s.as=1+Math.min(.25,H.comboN*.05);if(H.brk>0)s.mv=.8;break;case 13:if(H.still>=2)s.dmg=1.3;if(H.at>=0)s.mv=.8;break;case 14:s.cdm=1.25;break;
 case 15:break;case 16:if(H.dodge>0)s.mv=1.25;s.def=.8;break;case 17:s.as=.8;break;case 18:s.mp=1.35;s.heal=1.15;s.skill=.85;break;
 case 19:s.mv=.75;s.as=.85;if(H.guard)s.def=1/.7;break}
 return s}
window.moveMul=()=>stats().mv;
/* ---- util efek ---- */
const burst=(x,y,n,c,sp=2)=>{for(let i=0;i<n;i++)PT.push({x,y,vx:rnd(-sp,sp),vy:rnd(-sp,.5),l:rnd(.3,.6),c})};
const text=(x,y,t,c)=>FT.push({x,y,t,c,l:.9});
/* ---- monster ---- */
function mkMon(i,tx,ty,boss){const m=MONS[i],x=tx*16+8,y=ty*16+8,d=Math.hypot(tx-WD.W*.42,ty-WD.H*.5);
 const lv=boss?[8,13,18][boss-1]:cl(1+(d/12|0),1,10),hp=boss?[1800,3400,5600][boss-1]:m.hp*(1+lv*.4);
 return{i,m,x,y,hx:x,hy:y,hp,mhp:hp,lv,boss,dmg:(4+lv*2.2)*(boss?1.6:1),xp:Math.round((8+lv*5+m.tier*10)*(boss?12:1)),cd:rnd(0,1),cd2:rnd(1,3),fd:-1,tt:0,stun:0,slow:0,burn:0,arm:0,fl:0,rt:0,dead:0}}
function near(tx,ty){for(let r=0;r<20;r++)for(let a=0;a<12;a++){const x=Math.round(tx+Math.cos(a/12*6.28)*r),y=Math.round(ty+Math.sin(a/12*6.28)*r);
 if(x>2&&y>2&&x<WD.W-2&&y<WD.H-2&&WD.ter[y*WD.W+x]>=3&&!WD.blk[y*WD.W+x]&&WD.walk(x*16+8,y*16+8))return[x,y]}return[tx,ty]}
function spawnAll(){M.length=0;const sx=P.x/16,sy=P.y/16;let n=0,g=0;
 while(n<150&&g++<6000){const tx=2+Math.random()*(WD.W-4)|0,ty=2+Math.random()*(WD.H-4)|0;if(Math.hypot(tx-sx,ty-sy)<14)continue;
  const t=WD.ter[ty*WD.W+tx];if(t<3||WD.blk[ty*WD.W+tx]||!WD.walk(tx*16+8,ty*16+8))continue;
  const far=Math.hypot(tx-sx,ty-sy)>30;M.push(mkMon(far?[0,1,2,3,4,5][Math.random()*6|0]:[0,1,2][Math.random()*3|0],tx,ty,0));n++}
 [[.14,.16,6],[.86,.2,7],[.5,.92,8]].forEach(([a,b,i],k)=>{const[x,y]=near(a*WD.W|0,b*WD.H|0);M.push(mkMon(i,x,y,k+1))})}
/* ---- damage ---- */
function deal(m,amt,o={}){if(m.dead)return;const s=stats();let crit=Math.random()<s.crit,cm=1.5;
 if(ci==3){const bk=m.fd*(P.x-m.x)<0;if(bk){cm+=.4;H.back=2}}
 if(ci==4&&WPN.fx&&WPN.fx[0]=='line'&&!o.skill)amt*=1.2;
 if(ci==0&&!o.skill){H.hits++;if(H.hits%3==0){amt*=1.35;m.burn=4;H.buffT=4}}
 if(ci==6&&HEAVY&&!o.skill)m.arm=5;if(ci==8&&HEAVY&&Math.random()<.2)m.stun=1.5;if(ci==11)m.slow=3;if(ci==14&&!o.skill)m.burn=3;
 if(ci==12&&!o.skill){H.comboN++;H.comboT=2}
 amt*=(o.skill?s.skill:s.dmg)*(crit?cm:1)*(m.arm>0?1.25:1)*rnd(.92,1.08);amt=Math.round(amt);m.hp-=amt;m.fl=.12;
 if(ci==10)H.hp=Math.min(maxHp(),H.hp+amt*.12);
 text(m.x,m.y-m.m.h,crit?amt+'!':amt,crit?'#ffd23a':'#fff');burst(m.x,m.y-m.m.h/2,6,EC[1]);
 if(ci==17&&!o.skill&&!o.sp)M.forEach(n=>{if(n!==m&&!n.dead&&dist(n,m)<40)deal(n,amt*.25,{sp:1})});
 if(m.hp<=0){m.dead=1;m.rt=m.boss?0:25;H.kills++;gain(m.xp);burst(m.x,m.y-8,18,EC[0],3);
  if(ci==9)H.hp=Math.min(maxHp(),H.hp+maxHp()*.03*s.heal);if(m.boss){H.bosses++;text(m.x,m.y-30,'BOS KALAH!','#ffd23a');if(H.bosses>=3)setTimeout(()=>msg('<b>AETHERIA TERSELAMATKAN!</b><br>Ketiga bos telah kalah.<br><button onclick="location.href=\'index.html\'">MENU UTAMA</button>'),1500)}}}
function gain(x){H.xp+=x;let need;while(H.xp>=(need=Math.round(30*Math.pow(H.lv,1.5)))&&H.lv<20){H.xp-=need;H.lv++;H.hp=maxHp();H.mp=maxMp();text(P.x,P.y-30,'LEVEL '+H.lv+'!','#8cff8c');burst(P.x,P.y-10,24,'#fff',3)}buildSk()}
function hurt(d){if(H.inv>0||H.dead)return;const s=stats();if(ci==16&&Math.random()<.15){H.dodge=3;text(P.x,P.y-30,'LUPUT','#9ff');return}
 d=Math.round(d/s.def*(H.shield>0?.4:1));H.hp-=d;H.inv=.6;text(P.x,P.y-28,'-'+d,'#ff6a6a');burst(P.x,P.y-10,8,'#f55');
 if(H.hp<=0){H.hp=0;H.dead=1;msg('<b>KAMU KALAH…</b><br><button id="rv">BANGKIT</button>');$('rv').onclick=()=>{H.dead=0;H.hp=maxHp();H.mp=maxMp();P.x=start.x;P.y=start.y;msg()}}}
/* ---- serangan senjata ---- */
function target(r){let b=null,bd2=r;M.forEach(m=>{if(m.dead)return;const d=dist(m,P);if(d<bd2){bd2=d;b=m}});return b}
function attack(){if(H.cd>0||H.at>=0||H.dead)return;const s=stats(),t=target(130);if(t)H.dir=t.x>=P.x?1:-1;
 H.at=0;H.hit=0;H.dur=Math.max(.16,1/(WPN.s*60));H.cd=Math.max(H.dur*1.2,.3)/s.as*s.cdm}
function strike(){const s=stats(),base=bd()*(1+(.09-WPN.s)*6);H.hit=1;
 if(WPN.R){const R=WPN.R*s.rng*s.area*.9,x=P.x+H.dir*R*.4,y=P.y-14;
  for(let i=0;i<16;i++){const a=-1.4+i/15*2.8;PT.push({x:P.x+H.dir*Math.cos(a)*R*.8,y:y+Math.sin(a)*R*.5,vx:H.dir*.3,vy:0,l:.25,c:i%2?EC[0]:EC[1]})}
  M.forEach(m=>{if(m.dead)return;const dx=(m.x-P.x)*H.dir;if((SPIN?Math.abs(dx)<R:dx>-8&&dx<R)&&Math.abs(m.y-P.y)<26+(SPIN?R*.4:0))deal(m,base)})}
 if(WPN.proj){const n=WPN.proj=='knives'?3:1;for(let k=0;k<n;k++)PR.push({x:P.x+H.dir*10,y:P.y-16,vx:H.dir*(WPN.proj=='bolt'?190:150),vy:n>1?(k-1)*22:0,dmg:base,pier:ci==14?2:1,bn:ci==15?3:0,bc:0,life:1.1,hit:new Set,k:WPN.proj})}
 if(WPN.sh)sh=WPN.sh}
let sh=0;
/* ---- skill ---- */
function cast(j){if(H.dead||H.lv<UNL[j]||H.sk[j]>0)return;const s=stats(),c=COST[j]*(ci==18?.9:1);if(H.mp<c)return text(P.x,P.y-30,'MANA KURANG','#7ad0ff');
 H.mp-=c;H.sk[j]=CD[j]*s.cdm;const t=target(170);if(t)H.dir=t.x>=P.x?1:-1;
 FXL.push({i:SL[j],x:t?t.x:P.x+H.dir*70,y:t?t.y:P.y,t:0,dur:1.7,a:0,b:0,pw:POW[j]})}
function applyFx(f){const e=FX.E[f.i],n=e[0],ty=TYP[n],s=stats();
 if(ty=='heal'){const h=Math.round(maxHp()*.14*f.pw*s.heal/2);H.hp=Math.min(maxHp(),H.hp+h);text(P.x,P.y-30,'+'+h,'#8cff8c');return}
 if(ty=='guard'){H.shield=6;text(P.x,P.y-30,'PERISAI','#9cf');}
 const r=ty=='guard'?0:72*(ci==5?1.3:1);
 M.forEach(m=>{if(m.dead||dist(m,f)>r+(m.boss?20:0))return;deal(m,bd()*f.pw*.7,{skill:1});if(ty=='stun'&&!m.boss)m.stun=1;if(ty=='slow')m.slow=3;if(e[1].includes('Api'))m.burn=3})}
/* ---- update ---- */
function enemyShot(m,n,sp){const a=Math.atan2(P.y-12-m.y,P.x-m.x);for(let k=-n;k<=n;k++)EP.push({x:m.x,y:m.y-m.m.h/2,vx:Math.cos(a+k*.22)*sp,vy:Math.sin(a+k*.22)*sp,dmg:m.dmg*.8,l:3,c:m.boss?'#ff7a3a':'#c0f060'})}
window.gameUpd=(dt,tm)=>{if(!H.dead){tmx=tm;const s=stats();
 H.cd-=dt;H.inv-=dt;H.shield-=dt;H.buffT-=dt;H.back-=dt;H.dodge-=dt;H.brk-=dt;
 H.mp=Math.min(maxMp(),H.mp+dt*(3+H.lv*.35)*s.mp);H.sk=H.sk.map(v=>v-dt);
 if(H.comboT>0){H.comboT-=dt;if(H.comboT<=0&&H.comboN>0){H.comboN=0;H.brk=2}}
 H.still=P.mv?0:H.still+dt;H.guard=ci==19&&!!(K.KeyG||window.gDown);
 if(P.d==2)H.dir=-1;else if(P.d==3)H.dir=1;
 if(K.Space||window.aDown)attack();
 if(H.at>=0){H.at+=dt/H.dur;if(!H.hit&&H.at>=(WPN.hit||.5))strike();if(H.at>=1)H.at=-1}}
 M.forEach(m=>{if(m.dead){if(m.rt>0&&(m.rt-=dt)<=0){m.dead=0;m.hp=m.mhp;m.x=m.hx;m.y=m.hy}return}
  m.fl-=dt;m.stun-=dt;m.slow-=dt;m.arm-=dt;m.cd-=dt;m.cd2-=dt;m.tt-=dt;if(m.burn>0){m.burn-=dt;m.bt=(m.bt||0)+dt;if(m.bt>.5){m.bt=0;deal(m,bd()*.25,{skill:1})}}
  const d=dist(m,P),ag=Math.min(m.m.aggro*.8,m.boss?300:220);if(m.tt<=0){m.fd=P.x>=m.x?1:-1;m.tt=.6}
  if(m.stun>0||H.dead||d>ag)return;
  const sp=(m.boss?30:m.m.sp*52)*(m.slow>0?.6:1)*dt;
  if(m.m.sp>0&&d>(m.m.w*.35)){const nx=m.x+(P.x-m.x)/d*sp,ny=m.y+(P.y-m.y)/d*sp;if(WD.walk(nx,m.y))m.x=nx;if(WD.walk(m.x,ny))m.y=ny}
  if(d<m.m.w*.4+8&&m.cd<=0){hurt(m.dmg);m.cd=1.2}
  if(m.cd2<=0&&d>30&&(m.boss||m.i==2||m.m.atk.some(a=>['throw','bone'].includes(a)))){enemyShot(m,m.boss?m.boss+1:0,75);m.cd2=m.boss?2.2:3.2}});
 PR.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;PT.push({x:p.x,y:p.y,vx:0,vy:0,l:.15,c:EC[1]});
  M.forEach(m=>{if(m.dead||p.hit.has(m)||Math.abs(m.x-p.x)>14||Math.abs(m.y-m.m.h/2-p.y)>m.m.h/2+4)return;p.hit.add(m);
   deal(m,p.dmg*(1+p.bc*.1)*(ci==15&&p.bc==0?.85:1));if(--p.pier<=0){if(p.bn>p.bc){p.bc++;p.hit.clear();p.vx*=-1}else p.life=0}})});
 PR.splice(0,PR.length,...PR.filter(p=>p.life>0));
 EP.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=dt;if(Math.abs(p.x-P.x)<8&&Math.abs(p.y-(P.y-12))<12){p.l=0;hurt(p.dmg)}});EP.splice(0,EP.length,...EP.filter(p=>p.l>0));
 FXL.forEach(f=>{f.t+=dt;const p=f.t/f.dur;if(p>.3&&!f.a){f.a=1;applyFx(f)}if(p>.62&&!f.b){f.b=1;applyFx(f)}});FXL.splice(0,FXL.length,...FXL.filter(f=>f.t<f.dur));
 PT.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.08;p.l-=dt});PT.splice(0,PT.length,...PT.filter(p=>p.l>0));
 FT.forEach(f=>{f.y-=14*dt;f.l-=dt});FT.splice(0,FT.length,...FT.filter(f=>f.l>0));if(sh>0)sh--;hud()};
/* ---- gambar ---- */
const SC={};const msp=(m,f,fl)=>{const k=m.i+'_'+f+'_'+fl;return SC[k]||(SC[k]=window.monSpr(m.m.w,m.m.h,r=>m.m.d(r,{t:f*6,q:0,a:-1}),fl))};
const HF={};const hf=(wf,at)=>{const b=at<0?-1:Math.floor(at*10),k=wf+'|'+b;return HF[k]||(HF[k]=frame(CH,wf,b<0?-1:b/10))};
window.drawHero=(g,x,y,p)=>{if(H.inv>0&&Math.floor(tmx*20)%2)return;g.globalAlpha=.3;g.fillStyle='#000';g.fillRect(x-8,y-2,16,3);g.globalAlpha=1;
 if(H.shield>0){g.globalAlpha=.35;g.fillStyle='#8cf';g.beginPath();g.arc(x,y-12,15,0,6.28);g.fill();g.globalAlpha=1}
 g.save();g.translate(x,y);g.scale(H.dir,1);g.drawImage(hf(p.mv&&H.at<0?Math.floor(tmx*8)%4:-1,H.at),-24,-33,64,40);g.restore()};
window.drawEntities=(g,sx,sy)=>{const vis=M.filter(m=>!m.dead&&m.x>sx-60&&m.x<sx+700&&m.y>sy-60&&m.y<sy+500).sort((a,b)=>a.y-b.y);
 vis.forEach(m=>{const f=Math.floor(tmx*8)%8,fl=m.fl>0?1:0,c=msp(m,f,fl),x=Math.round(m.x-sx),y=Math.round(m.y-sy),z=m.m.fly?14:0;
  g.globalAlpha=.3;g.fillStyle='#000';g.fillRect(x-c.width/3,y-2,c.width*.66,3);g.globalAlpha=m.stun>0?.7:1;g.drawImage(c,x-(c.width>>1),y-c.height-z);g.globalAlpha=1;
  if(m.burn>0){g.fillStyle='#f83';g.fillRect(x-2,y-c.height-z-4,4,3)}
  if(m.hp<m.mhp||m.boss){const w=Math.max(14,c.width*.8)|0;g.fillStyle='#000';g.fillRect(x-(w>>1)-1,y-c.height-z-8,w+2,4);g.fillStyle=m.boss?'#e03a3a':'#4cd964';g.fillRect(x-(w>>1),y-c.height-z-7,w*m.hp/m.mhp,2)}
  g.font='5px "Press Start 2P",monospace';g.fillStyle='#fff';g.fillText((m.boss?'BOS ':'Lv')+m.lv,x-8,y-c.height-z-10)});
 PR.forEach(p=>{g.fillStyle=EC[0];g.fillRect(p.x-sx-3,p.y-sy-1,6,3);g.fillStyle='#fff';g.fillRect(p.x-sx-1,p.y-sy,2,1)});
 EP.forEach(p=>{g.fillStyle=p.c;g.fillRect(p.x-sx-2,p.y-sy-2,4,4)});
 PT.forEach(p=>{g.globalAlpha=Math.min(1,p.l*4);g.fillStyle=p.c;g.fillRect(Math.round(p.x-sx),Math.round(p.y-sy),2,2)});g.globalAlpha=1;
 g.font='6px "Press Start 2P",monospace';FT.forEach(f=>{g.globalAlpha=Math.min(1,f.l*2);g.fillStyle='#000';g.fillText(f.t,f.x-sx-5+1,f.y-sy+1);g.fillStyle=f.c;g.fillText(f.t,f.x-sx-5,f.y-sy)});g.globalAlpha=1};
const fxc=document.createElement('canvas');fxc.width=128;fxc.height=80;const fxx=fxc.getContext('2d');
window.drawOverlay=(ctx,sx,sy,S,dpr)=>{FXL.forEach(f=>{const p=f.t/f.dur;fxx.clearRect(0,0,128,80);fxx.globalAlpha=1;FX.set(fxx,f.t,p);try{FX.E[f.i][2]()}catch(e){}
 const k=S*1.1,x=(f.x-sx)*S,y=(f.y-sy)*S;ctx.imageSmoothingEnabled=false;ctx.globalAlpha=1-Math.max(0,(p-.85)/.15);ctx.globalCompositeOperation='lighter';
 ctx.drawImage(fxc,x-64*k,y-64*k,128*k,80*k);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1});
 if(H.hp/maxHp()<.3&&!H.dead){const g=ctx.createRadialGradient(ctx.canvas.width/2,ctx.canvas.height/2,ctx.canvas.height*.3,ctx.canvas.width/2,ctx.canvas.height/2,ctx.canvas.height);g.addColorStop(0,'#0000');g.addColorStop(1,'#a0102090');ctx.fillStyle=g;ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height)}};
/* ---- HUD ---- */
function msg(h){$('msg').classList.toggle('on',!!h);if(h)$('mb').innerHTML=h}
function buildSk(){const b=$('sk');b.innerHTML='';SL.forEach((i,j)=>{const e=FX.E[i],th=FX.TH[e[0]]||['','','#fff'],bt=document.createElement('button');bt.style.setProperty('--c',th[2]);
 bt.className=H.lv<UNL[j]?'lock':'';bt.innerHTML='<b>'+(j+1)+'</b>'+(H.lv<UNL[j]?'Lv'+UNL[j]:e[0])+'<u></u>';bt.onpointerdown=ev=>{ev.preventDefault();cast(j)};b.append(bt)})}
function hud(){$('hp').style.width=H.hp/maxHp()*100+'%';$('mp').style.width=H.mp/maxMp()*100+'%';$('xp').style.width=H.xp/Math.round(30*Math.pow(H.lv,1.5))*100+'%';
 $('lv').textContent='Lv'+H.lv;$('bs').textContent='BOS '+H.bosses+'/3';
 [...$('sk').children].forEach((b,j)=>{b.lastChild.style.height=H.lv<UNL[j]?0:Math.max(0,H.sk[j])/CD[j]*100+'%'});
 let bb=null;M.forEach(m=>{if(m.boss&&!m.dead&&dist(m,P)<300)bb=m});$('boss').style.display=bb?'block':'none';if(bb){$('bn').textContent=bb.m.n;$('bh').style.width=bb.hp/bb.mhp*100+'%'}}
/* ---- mulai ---- */
addEventListener('keydown',e=>{if(/^Digit[1-5]$/.test(e.code))cast(+e.code[5]-1);if(e.code=='Space')e.preventDefault()});
const hold=(id,k)=>{const b=$(id);b.onpointerdown=e=>{e.preventDefault();window[k]=1};['pointerup','pointerleave','pointercancel'].forEach(v=>b.addEventListener(v,()=>window[k]=0))};
hold('atk','aDown');hold('grd','gDown');if(ci==19)$('grd').style.display='block';
$('bx').onclick=()=>{location.href='index.html'};
$('nm').textContent=CH[0]+' · '+CH[1];
window.worldStart();start={x:P.x,y:P.y};spawnAll();buildSk();
msg('<b>'+CH[0]+' — '+CH[1]+'</b><br>Elemen '+CH[2].toUpperCase()+'<br><br>PASIF: '+PS[0]+'<br>+ '+PS[1]+'<br>− '+PS[2]+'<br><br>Gerak: WASD / geser layar · Serang: SPASI<br>Skill: 1–5 · Kalahkan 3 bos!<br><button id="go">MULAI</button>');
$('go').onclick=()=>msg();
})();
