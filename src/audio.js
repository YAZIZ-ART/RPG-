/* Audio sintetis tanpa file eksternal: musik ambient dan SFX. */
window.GameAudio = (() => {
 let ctx=null, master=null, musicGain=null, sfxGain=null, musicTimer=null, step=0;
 const scales=[0,3,5,7,10,12,15,17], roots={calm:196,battle:147,boss:110};
 function init(){if(ctx)return;ctx=new (window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();musicGain=ctx.createGain();sfxGain=ctx.createGain();musicGain.gain.value=.32;sfxGain.gain.value=.65;musicGain.connect(master);sfxGain.connect(master);master.connect(ctx.destination)}
 function tone(freq,dur,type="sine",vol=.08,into=sfxGain,when=0){if(!ctx)return;const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,ctx.currentTime+when);g.gain.setValueAtTime(.0001,ctx.currentTime+when);g.gain.exponentialRampToValueAtTime(vol,ctx.currentTime+when+.015);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+when+dur);o.connect(g);g.connect(into);o.start(ctx.currentTime+when);o.stop(ctx.currentTime+when+dur+.03)}
 function startMusic(mode="calm"){init();if(ctx.state==="suspended")ctx.resume();stopMusic();step=0;const root=roots[mode]||roots.calm;musicTimer=setInterval(()=>{if(!ctx)return;const n=scaleNote(step++%8);tone(root*n,.34,"triangle",.035,musicGain);if(step%4===0)tone(root/2,.65,"sine",.025,musicGain,.02);if(step%8===0)tone(root*2,.18,"sine",.018,musicGain,.03)},430)}
 function scaleNote(i){return Math.pow(2,scales[i]/12)}
 function stopMusic(){if(musicTimer)clearInterval(musicTimer);musicTimer=null}
 function setVolumes(m,s){if(musicGain)musicGain.gain.value=m;if(sfxGain)sfxGain.gain.value=s}
 function sfx(kind){init();if(ctx.state==="suspended")ctx.resume();({hit:()=>{tone(120,.09,"sawtooth",.12);tone(65,.12,"square",.06,sfxGain,.02)},magic:()=>{tone(440,.2,"sine",.12);tone(660,.28,"triangle",.08,.04)},dash:()=>{tone(240,.16,"sawtooth",.07);tone(520,.12,"sine",.04,.04)},hurt:()=>tone(90,.25,"square",.1),level:()=>[523,659,784,1046].forEach((f,i)=>tone(f,.28,"triangle",.07,sfxGain,i*.11)),click:()=>tone(330,.06,"square",.04)})[kind]?.()}
 return {init,startMusic,stopMusic,sfx,setVolumes};
})();
