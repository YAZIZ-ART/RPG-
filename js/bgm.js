/* BGM11: musik adaptif 4 mode (menu/field/intense/boss): pad + bass + arp + lead + drum, ganti mode per bar dengan crash/boom */
const P11=[0,3,5,7,10];
const MD={
menu:{bpm:72,prog:[[0,'m'],[8,'M'],[3,'M'],[10,'M']],lead:['4 . . . . . . . 2 . . . . . . .','3 . . . . . 2 . . . . . 0 . . .','5 . . . . . 4 . . . . . 3 . . .','2 . . . 3 . . . 0 . . . . . . .']},
field:{bpm:96,prog:[[0,'m'],[8,'M'],[3,'M'],[10,'M']],lead:['4 . . 3 . . 2 . 0 . . . 2 . . .','3 . . 2 . . 0 . 2 . 3 . 4 . . .','5 . . 4 . . 3 . 2 . . . 0 . . .','2 . 3 . 4 . . . 3 . 2 . 0 . . .']},
intense:{bpm:132,prog:[[0,'m'],[8,'M'],[5,'m'],[7,'M']],lead:['5 . 4 . 5 . 7 . 5 . 4 . 3 . 4 .','4 . 3 . 4 . 5 . 4 . 3 . 2 . 3 .','5 . 7 . 8 . 7 . 5 . 4 . 5 . . .','7 . 5 . 4 . 5 . 3 . 2 . 0 . . .']},
boss:{bpm:144,prog:[[0,'m'],[1,'M'],[0,'m'],[7,'M']],lead:['7 7 . 5 7 . 8 . 7 . 5 . 4 . 5 .','8 8 . 7 8 . 9 . 8 . 7 . 5 . 7 .','7 7 . 5 7 . 8 . 10 . 8 . 7 . 5 .','5 . 7 . 8 . 9 . 10 . . . 8 7 . .']}};
for(const k in MD)MD[k].lead=MD[k].lead.map(s=>s.split(' ').map(x=>x==='.'?-1:+x));
function d11(k,at,v){const b=AU.bgm;
 if(k==='k'){T(165,42,.17,'sine',.9*v,at,{bus:b,a:.001,rv:0});N(.012,.35*v,at,{f0:3500,ty:'highpass',bus:b,rv:0});}
 else if(k==='s'){N(.15,.32*v,at,{f0:1900,q:.7,bus:b,rv:.25});T(230,160,.09,'triangle',.28*v,at,{bus:b,a:.001,rv:0});}
 else if(k==='h')N(.035,.11*v,at,{f0:8500,ty:'highpass',bus:b,rv:0});
 else if(k==='o')N(.2,.1*v,at,{f0:8000,ty:'highpass',bus:b,rv:.2});
 else if(k==='t')T(180,90,.26,'sine',.6*v,at,{bus:b,a:.001,rv:.2});
 else if(k==='c')N(1.3,.18*v,at,{f0:5500,ty:'highpass',bus:b,rv:.4});}
function step11(m,s,bar,at,sp){const M=MD[m],pr=M.prog[bar],ct=pr[1]==='m'?[0,3,7]:[0,4,7],base=45+pr[0],b=AU.bgm,boss=m==='boss',itn=m==='intense',menu=m==='menu',hard=boss||itn;
 if(s===0){for(const c of ct)T(mf(base+12+c),mf(base+12+c),sp*16,'sawtooth',boss?.055:.04,at,{bus:b,a:sp*6,lp:boss?750:1100,uni:14,rv:.5});T(mf(base-12),mf(base-12),sp*16,'sine',.3,at,{bus:b,a:.05,rv:0});}
 const bv=boss?.2:itn?.15:.3,bn=mf(base-12+(s%8===6?12:0));
 if(boss){if([0,3,4,6,8,11,12,14].includes(s))T(bn,mf(base-12),sp*1.5,'sawtooth',bv,at,{bus:b,a:.004,lp:520,ws:1,rv:0});}
 else if(itn){if(s%2===0)T(bn,mf(base-12),sp*1.7,'sawtooth',bv,at,{bus:b,a:.004,lp:600,rv:0});}
 else if(s%8===0)T(mf(base-12),mf(base-12),sp*7,'sine',bv,at,{bus:b,a:.01,rv:0});
 if(hard||(s%2===0&&!menu)){const nt=mf(base+ct[(s>>(hard?0:1))%3]+12*((s>>3)&1)+24);T(nt,nt,sp*(hard?1.5:2),boss?'square':'triangle',boss?.04:.05,at,{bus:b,a:.003,lp:boss?2200:3200,rv:.35,dl:.3});}
 const L=M.lead[bar],id=L[s];if(id>=0){let ln=1;while(s+ln<16&&L[s+ln]===-1)ln++;const f=mf(60+P11[id%5]+12*Math.floor(id/5));T(f,f,sp*ln*.95,'square',.045,at,{bus:b,a:.01,lp:2600,vib:[5,6],rv:.5,dl:.3});T(f,f,sp*ln*.95,'triangle',.07,at,{bus:b,a:.01,rv:.4});}
 if(menu){if(s%4===2)d11('h',at,.5);}
 else if(m==='field'){if(s%8===0)d11('k',at,.8);if(s===12)d11('s',at,.4);if(s%4===2)d11('h',at,.6);}
 else if(itn){if(s%4===0)d11('k',at,.9);if(s===4||s===12)d11('s',at,.8);if(s%2===0&&s%8!==6)d11('h',at,.7);if(s===14)d11('o',at,.8);}
 else{if([0,3,6,8,11,14].includes(s))d11('k',at,1);if(s===4||s===12)d11('s',at,1);d11('h',at,.5);if(bar===3&&s>=12)d11('t',at,.9);if(s===0&&bar===0)d11('c',at,1);}
 if(m==='field'&&s===0&&bar%2===0)N(sp*16,.05,at,{f0:500,f1:900,q:1.2,a:sp*8,bus:b,rv:.4});
 if(m==='field'&&Math.random()<.07)for(let i=0;i<3;i++)T(4200,4300,.035,'sine',.025,at+i*.07,{bus:b,a:.002,rv:.3});}
const B11={n:0,st:0,bar:0,cur:'menu'};
function bgm11(){const ac=AU.ac;if(!ac||ac.state!=='running'||!AU.on||!AU.bgm)return;const tgt=state==='battle'?BGMODE:'menu';if(B11.n<ac.currentTime)B11.n=ac.currentTime+.06;
 while(B11.n<ac.currentTime+.28){const at=B11.n-ac.currentTime;
  if(B11.st%16===0&&tgt!==B11.cur){B11.cur=tgt;B11.st=0;B11.bar=0;if(tgt!=='menu'){d11('c',at,.8);T(120,40,.5,'sine',.6,at,{bus:AU.bgm,a:.002,rv:.2});}}
  const sp=60/MD[B11.cur].bpm/4;step11(B11.cur,B11.st%16,B11.bar%4,at,sp);B11.st++;if(B11.st%16===0)B11.bar++;B11.n+=sp;}}
setInterval(bgm11,80);
