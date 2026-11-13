/* AETHERIA v25 - dimuat setelah aetheria24.js: perbaikan musik, SFX khas senjata baru, VFX tambahan */
(function(){"use strict";
const AUX={mus:true,sfx:true};window.AUX=AUX;

/* ---------- MUSIK: tidak lagi "mati" saat skill di-spam ---------- */
let lastDuck=-9;
duck=function(k){const ac=AU.ac;if(!ac||!AU.bgm)return;if(tg-lastDuck<1.4)return;lastDuck=tg;
  const g=AU.bgm.gain,t=ac.currentTime,b=AUX.mus?.18:0;g.cancelScheduledValues(t);g.setTargetAtTime(b*Math.max(.55,k),t,.04);g.setTargetAtTime(b,t+.3,.15);};
setInterval(()=>{const ac=AU.ac;if(!ac||!AU.bgm||!AU.on)return;const b=AUX.mus?.18:0;
  if(tg-lastDuck>1.2&&Math.abs(AU.bgm.gain.value-b)>.02){AU.bgm.gain.cancelScheduledValues(ac.currentTime);AU.bgm.gain.setTargetAtTime(b,ac.currentTime,.1);}
  if(AU.sfx)AU.sfx.gain.value=AUX.sfx?1.15:0;},400);

/* ---------- SFX khas 8 senjata baru ---------- */
const rn=Math.random;
const REC={
 Specter:(v,k)=>{T(520,70,.3,'sawtooth',.22*v,0,{lp:1100,ws:1});N(.22,.4*v,0,{f0:3500,f1:300,q:2});if(k===3){T(60,30,.9,'sine',.6*v,.2,{ws:1});FMT(2400,2.1,2,.5,.15*v,.25,{rv:.4});}},
 Gravity:(v,k)=>{T(130,28,.55,'sine',.7*v,0,{ws:1});N(.45,.5*v,0,{f0:900,f1:70,ty:'lowpass'});if(k>=2)T(40,90,.6,'sine',.4*v,.3,{a:.4});},
 Spirit:(v,k)=>{[880,1175,1568,2093].slice(0,k===3?4:3).forEach((f,i)=>FMT(f,3,1,.55,.12*v,i*.07,{rv:.55}));N(.25,.25*v,0,{f0:600,f1:5000,q:1.5,a:.15});},
 Inkbrush:(v,k)=>{N(.32,.55*v,0,{f0:700,f1:3800,q:3,a:.12,ps:[-.6,.6]});T(220,140,.3,'triangle',.12*v,0,{lp:700});if(k===3)for(let i=0;i<3;i++)FMT(300+i*90,1.5,2,.6,.1*v,i*.1,{rv:.4});},
 Beast:(v,k)=>{T(75,42,.5,'sawtooth',.42*v,0,{lp:520,vib:[22,9],ws:1});N(.3,.55*v,0,{f0:1400,f1:180,ty:'lowpass'});if(k===3){T(50,22,1,'sine',.8*v,.15,{ws:1});SX.shock(v*.6);}},
 Chaos:(v,k)=>{for(let i=0;i<(k===3?9:5);i++)T(300+rn()*1800,150+rn()*600,.07,'square',.1*v,i*.05,{lp:3500,a:.002});N(.2,.4*v,0,{f0:2500,f1:6000,q:3});},
 Creation:(v,k)=>{[0,4,7,12,16].slice(0,k===3?5:3).forEach((s,i)=>FMT(660*Math.pow(2,s/12),3,1,.5,.13*v,i*.06,{rv:.55}));N(.4,.3*v,0,{f0:2000,f1:9000,ty:'highpass',a:.25});},
 Thunder:(v,k)=>{ELX.volt(0,.8*v,k===3?1:0);N(.05,.8*v,0,{f0:5000,ty:'highpass'});T(150,40,.3,'sine',.5*v,0,{ws:1});}
};
function wsfx(w,slot,skill){if(!AU.ac||!AU.on||AU.ac.state!=='running')return;const f=REC[LIST[w].name];if(!f)return;
  try{f(skill?(slot===3?1.25:.95):.55,skill?slot:-1);if(skill&&slot===3){snd('overch',.8);}}catch(_){}}
const _cn=castN;
castN=function(i){const n=fx.length;_cn(i);if(fx.length>n){const wd=LIST[sel],x=wd.extra&&wd.extra[i];
  if(sel>=16)wsfx(sel,wd.map.indexOf(i),true);
  if(x&&(x.inv||x.dm))snd('heal',.55);if(x&&x.mv)SX.quick(.7,1.2);}};
const _bs=basic;
basic=function(){const n=fx.length;_bs();if(fx.length>n&&sel>=16)wsfx(sel,0,false);};

/* ---------- VFX tambahan ---------- */
const RINGS=[],IMP={t:0},CAB={t:0};let lastTg=0;
const _ht=hit;
hit=function(e){const hp=mon.hp,al=mon.alive;_ht(e);
  if(al&&mon.hp<hp){RINGS.push({p:V(mon.pos.x,mon.pos.y-8),t:0,c:e.pal[1],big:e.dmg>=300});
    if(e.dmg>=300&&!e.imp25){e.imp25=1;IMP.t=.09;CAB.t=.35;}else if(e.dmg>=180)CAB.t=Math.max(CAB.t,.12);}};
const _de=drawEntities;
drawEntities=function(){_de();
  const d=Math.min(.05,Math.max(0,tg-lastTg));lastTg=tg;
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(let i=RINGS.length-1;i>=0;i--){const r=RINGS[i];r.t+=d;const k=r.t/(r.big?.6:.35);if(k>=1){RINGS.splice(i,1);continue;}
    const R=(r.big?90:44)*(1-Math.pow(1-k,3));parc(r.p,R,0,TAU,[r.c,WHITE],1-k,.4);if(r.big)parc(r.p,R*.6,0,TAU,[r.c],(1-k)*.7,.4);}
  for(const e of fx){if(!e.nk||e.dmg<300||e.t>1.4)continue;const P=e.pal,k=Math.sin(Math.min(1,e.t/1.4)*PI),to=e.to;
    for(let i=0;i<9;i++){const x=to.x+(i-4)*15;tline0(V(x,to.y-150),V(x*.9+to.x*.1,to.y),[P[1],P[2]],.45*k);}
    if(e.t<1){const o=e.from;for(let i=0;i<6;i++){const a=tg*1.6+i*TAU/6,p=V(o.x+Math.cos(a)*34,o.y-30+Math.sin(a)*14);
      for(let q=0;q<3;q++){const s=rn;void s;tline0(V(p.x-3,p.y-3+q*3),V(p.x+3-(i%2)*3,p.y-3+q*3+(i%3)),[P[2]],.7*k);}}}}
  ctx.restore();};
const _dp=drawPlayer;
drawPlayer=function(){
  if(pl.cast>0&&!pl.hidden){const t=1-pl.cast/.5,sx=t<.25?1+.14*(t/.25):1-.1*Math.sin((t-.25)/.75*PI),sy=t<.25?1-.14*(t/.25):1+.12*Math.sin((t-.25)/.75*PI);
    ctx.save();ctx.translate(pl.pos.x,pl.pos.y);ctx.scale(sx,sy);ctx.translate(-pl.pos.x,-pl.pos.y);_dp();ctx.restore();}
  else _dp();};
const _hd=drawHud;
drawHud=function(){
  if(state==='battle'){
    const d=Math.min(.05,Math.max(0,tg-(_hd.t||tg)));_hd.t=tg;
    if(CAB.t>0){CAB.t-=d;const a=Math.min(.14,CAB.t*.5),o=Math.min(3,CAB.t*8);ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a;
      ctx.drawImage(cv,0,0,cv.width,cv.height,-o,0,W,H);ctx.drawImage(cv,0,0,cv.width,cv.height,o,0,W,H);ctx.restore();}
    if(IMP.t>0){IMP.t-=d;ctx.save();ctx.globalCompositeOperation='difference';ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);ctx.restore();}
    const f=ST9.hp/mxHP();if(f<.3&&ST9.dead<=0){const a=.18+.12*Math.sin(tg*6)+(.3-f);ctx.save();const g=ctx.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H*.95);g.addColorStop(0,'rgba(120,0,0,0)');g.addColorStop(1,'rgba(200,0,20,'+Math.min(.6,a)+')');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore();}
  }
  _hd();};
})();
