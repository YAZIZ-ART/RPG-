/* AUDIO v9: SFX tambahan (buff, heal, boss, ledakan, dll) + BGM Battlefield / Intense / Boss */
const ok9=()=>AU.ac&&AU.on&&AU.ac.state==='running'&&AU.n<115;
const S9={
buff(v){[0,4,7,12].forEach((s,i)=>FMT(660*Math.pow(2,s/12),3,1,.5,.14*v,i*.06,{rv:.5}));N(.3,.3*v,0,{f0:3000,ty:'highpass'});},
heal(v){[0,7,12].forEach((s,i)=>T(523*Math.pow(2,s/12),523*Math.pow(2,s/12),.7,'sine',.16*v,i*.1,{a:.05,rv:.6,uni:8}));ELX.holy(0,.4*v,0);},
power(v){T(180,1600,.6,'sawtooth',.2*v,0,{a:.5,lp:4000,uni:15,rv:.3});N(.6,.3*v,0,{f0:400,f1:9000,ty:'highpass',a:.55});FMT(1320,2,1.5,.6,.2*v,.55,{rv:.5});},
awaken(v){S9.power(v);SX.shock(v*.8);ELX.holy(.4,.9*v,1);[392,494,587,784].forEach(f=>T(f,f*1.01,1.6,'sine',.13*v,.3,{a:.5,vib:[5,f*.01],uni:10,rv:.7}));},
overch(v){T(90,900,.8,'sawtooth',.22*v,0,{a:.7,lp:3000,ws:1,vib:[24,30]});for(let i=0;i<8;i++){N(.03,.5*v,i*.1,{f0:5000,ty:'highpass'});T(2500+R()*2000,200,.06,'square',.15*v,i*.1,{a:.001});}},
status(v){T(900,500,.1,'square',.12*v,0,{lp:2500});T(700,350,.14,'square',.1*v,.1,{lp:2500});},
debuff(v){T(520,110,.5,'sawtooth',.25*v,0,{lp:1200,ws:1});N(.4,.3*v,0,{f0:1500,f1:200,ty:'lowpass'});},
boom(v){ELX.pyro(0,v,1);SX.shock(v);},
debris(v){for(let i=0;i<12;i++)N(.05,.5*v,.1+R()*.9,{f0:300+R()*900,q:4,ps:[-.8+R()*1.6,0]});},
collapse(v){T(900,40,1.4,'sawtooth',.3*v,0,{lp:1500,ws:1});N(1.2,.6*v,0,{f0:6000,f1:100,ty:'lowpass',rv:.5});SX.shock(v);},
rift(v){ELX.void(0,v,1);T(55,30,1.5,'sine',.5*v,0,{ws:1});N(1,.4*v,0,{f0:200,f1:3000,q:8,a:.6,ps:[-.9,.9],rv:.6});},
final(v){S9.boom(v);S9.collapse(v*.7);SX.crit(v);S9.debris(v);},
hurt(v){T(180,70,.18,'sawtooth',.3*v,0,{lp:900,ws:1});N(.1,.4*v,0,{f0:900,f1:200,ty:'lowpass'});},
die(v){T(420,60,.5,'square',.2*v,0,{lp:2000,ws:1});N(.4,.4*v,0,{f0:3000,f1:200,q:1,rv:.3});},
roar(v){T(75,50,1.3,'sawtooth',.5*v,0,{a:.1,lp:420,vib:[11,14],uni:20,ws:1});T(150,90,1.3,'sawtooth',.25*v,0,{a:.15,lp:900,vib:[9,20]});N(1.3,.5*v,0,{f0:700,f1:250,q:2,a:.1,rv:.4});},
bcharge(v){T(70,260,.9,'sawtooth',.3*v,0,{a:.8,lp:900,uni:20});N(.9,.35*v,0,{f0:200,f1:5000,ty:'highpass',a:.85});},
bimpact(v){SX.smash(v);S9.debris(v*.6);},
ult(v){SX.xform(v,1);SX.hum(v,1);},
win(v){[523,659,784,1047,784,1047,1319].forEach((f,i)=>{FMT(f,3,.8,.5,.2*v,i*.14,{rv:.5});T(f/2,f/2,.4,'triangle',.12*v,i*.14,{a:.01});});},
lose(v){[440,392,349,294,220].forEach((f,i)=>{T(f,f*.99,.6,'triangle',.2*v,i*.25,{a:.02,rv:.5,lp:1800});T(f/2,f/2,.6,'sine',.2*v,i*.25,{a:.02});});}};
function snd(n,v){if(ok9()&&S9[n])S9[n](v==null?1:v);}
let BGMODE='field';const B9={n:0,st:0},RT9=[45,43,40,38];
function bgm9(){return;if(!ok9()||BGMODE==='field'||state!=='battle')return;const ac=AU.ac,boss=BGMODE==='boss',sp=boss?.17:.2;if(B9.n<ac.currentTime)B9.n=ac.currentTime+.05;
 while(B9.n<ac.currentTime+.3){const st=B9.st,b=st%16,bar=(st>>4)%4,at=B9.n-ac.currentTime,o={bus:AU.bgm},root=mf(RT9[bar]);
  if(boss){if(b%8===0){T(root,root*.5,sp*8,'sawtooth',.2,at,{bus:AU.bgm,lp:500,a:.05,uni:12});T(root*3,root*3,sp*8,'sawtooth',.06,at,{bus:AU.bgm,lp:1200,a:.2,uni:15,rv:.4});}
   if(b%4===0)T(80,28,.3,'sine',.7,at,o);if(b%8===6||b===15)N(.12,.25,at,{f0:900,f1:200,ty:'lowpass',bus:AU.bgm,rv:.3});
   if(st%2===0)T(root*(b%4?2:1),root*(b%4?2:1),.1,'sawtooth',.08,at,{bus:AU.bgm,lp:900,a:.002});
   if(b===0&&bar===0)[0,3,7].forEach(s=>T(mf(RT9[0]+24+s),mf(RT9[0]+24+s),sp*16,'sine',.05,at,{bus:AU.bgm,a:1,rv:.6,uni:10}));}
  else{if(b%4===0)T(120,38,.2,'sine',.55,at,o);if(b===4||b===12){N(.14,.25,at,{f0:2400,q:.8,bus:AU.bgm,rv:.25});T(200,110,.1,'triangle',.18,at,o);}
   N(.03,.1,at,{f0:8500,ty:'highpass',bus:AU.bgm});if(st%2===0)T(root,root,.18,'sawtooth',.1,at,{bus:AU.bgm,lp:700,a:.004});
   if(b%4===2){const nt=mf(RT9[bar]+24+[0,3,7,10][(st>>2)%4]);T(nt,nt,.2,'square',.05,at,{bus:AU.bgm,lp:2500,a:.003,rv:.3});}}
  B9.st++;B9.n+=sp;}}
setInterval(bgm9,90);
