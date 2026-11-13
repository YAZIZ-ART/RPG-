/* AUDIO HQ v10: 48kHz, anti-macet (watchdog + auto-resume), anggaran voice dinamis, mix lebih halus */
(function(){const A=window.AudioContext||window.webkitAudioContext;if(A&&!A.__hq){const H=function(){let c;try{c=new A({latencyHint:'interactive',sampleRate:48000});}catch(e){c=new A();}return c;};H.prototype=A.prototype;H.__hq=1;window.AudioContext=H;window.webkitAudioContext=H;}})();
let LIVE9=0;
(function(){const B=(window.BaseAudioContext||window.webkitAudioContext||AudioContext).prototype;for(const k of['createOscillator','createBufferSource']){const o=B[k];B[k]=function(){const n=o.apply(this,arguments);LIVE9++;n.addEventListener('ended',()=>{LIVE9=Math.max(0,LIVE9-1);});return n;};}})();
/* penyebab suara hilang: penghitung voice (AU.n) bocor saat tab di-background / context suspend -> dikunci 140 -> semua suara ditolak */
function heal9(){const ac=AU.ac;if(!ac)return;if(ac.state==='suspended'||ac.state==='interrupted'){ac.resume().catch(()=>{});AU.n=0;return;}
 if(AU.n>LIVE9+6)AU.n=LIVE9;if(AU.n<0)AU.n=0;if(AU.m&&AU.on&&AU.m.gain.value<.05)AU.m.gain.value=.9;}
setInterval(heal9,700);
for(const ev of['pointerdown','keydown','touchstart','focus'])addEventListener(ev,()=>{try{auResume();}catch(_){}},true);
document.addEventListener('visibilitychange',()=>{if(!document.hidden){try{auResume();}catch(_){}AU.n=0;}});
/* anggaran voice: batasi jumlah suara per 100ms + redam otomatis saat ramai (hindari distorsi & CPU overload) */
let bk9=0,bt9=0;const bud9=()=>{const n=performance.now();if(n-bt9>100){bt9=n;bk9=0;}return++bk9<=40;},att9=()=>1/Math.sqrt(1+Math.max(0,AU.n-24)/40);
const _T9=T;T=function(f0,f1,d,ty,v,at,o){if(!(o&&o.bus===AU.bgm)){if(!bud9())return;v*=att9();const k=1+(Math.random()-.5)*.07;f0*=k;f1*=k;}return _T9(f0,f1,d,ty,v,at,o);};
const _N9=N;N=function(d,v,at,o){if(!(o&&o.bus===AU.bgm)){if(!bud9())return;v*=att9();}return _N9(d,v,at,o);};
const _F9=FMT;FMT=function(fc,r,i,d,v,at,o){if(!bud9())return;return _F9(fc,r,i,d,v*att9(),at,o);};
