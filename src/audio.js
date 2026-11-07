/* Lightweight synthesized soundtrack and sound effects. */
window.GameAudio = (() => {
 let ctx=null,musicGain=null,sfxGain=null,timer=null,step=0,unlocked=false;
 const notes=[0,3,7,10,7,3,5,2],roots={calm:196,adventure:220,battle:146.83};
 function init(){
  if(ctx)return;
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  ctx=new AC();musicGain=ctx.createGain();sfxGain=ctx.createGain();
  musicGain.gain.value=.28;sfxGain.gain.value=.65;musicGain.connect(ctx.destination);sfxGain.connect(ctx.destination);
 }
 function resume(){init();if(ctx&&ctx.state==="suspended")ctx.resume();unlocked=true}
 function tone(freq,duration,wave="sine",volume=.06,target=sfxGain,delay=0){
  if(!ctx||!target)return;const now=ctx.currentTime+delay,o=ctx.createOscillator(),g=ctx.createGain();
  o.type=wave;o.frequency.setValueAtTime(freq,now);g.gain.setValueAtTime(.0001,now);
  g.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),now+.018);
  g.gain.exponentialRampToValueAtTime(.0001,now+duration);
  o.connect(g);g.connect(target);o.start(now);o.stop(now+duration+.03);
 }
 function stopMusic(){if(timer)clearInterval(timer);timer=null}
 function startMusic(mode="calm"){resume();stopMusic();if(!ctx)return;step=0;const root=roots[mode]||roots.calm;
  const play=()=>{const n=Math.pow(2,notes[step%notes.length]/12);tone(root*n,.48,"triangle",.035,musicGain);if(step%4===0)tone(root/2,.8,"sine",.022,musicGain,.03);if(step%8===0)tone(root*2,.25,"sine",.012,musicGain,.06);step++};
  play();timer=setInterval(play,520);
 }
 function sfx(kind){resume();if(!ctx)return;
  if(kind==="hit"){tone(115,.09,"square",.09);tone(72,.12,"triangle",.05,sfxGain,.025)}
  else if(kind==="magic"){tone(390,.22,"sine",.09);tone(590,.3,"triangle",.055,sfxGain,.07);tone(790,.2,"sine",.035,sfxGain,.14)}
  else if(kind==="dash"){tone(180,.14,"sawtooth",.06);tone(430,.12,"sine",.035,sfxGain,.04)}
  else if(kind==="hurt")tone(88,.2,"sawtooth",.08);
  else if(kind==="level")[523,659,784,1046].forEach((f,i)=>tone(f,.25,"triangle",.055,sfxGain,i*.1));
  else if(kind==="click")tone(340,.055,"square",.035);
 }
 function setVolumes(m,s){if(musicGain)musicGain.gain.value=m;if(sfxGain)sfxGain.gain.value=s}
 return {init,resume,startMusic,stopMusic,sfx,setVolumes};
})();
