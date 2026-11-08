/* Main game controller. All UI nodes are checked before binding to prevent silent boot failure. */
(() => {
"use strict";
const $=id=>document.getElementById(id);
const required=["game","minimap","main-menu","character-screen","new-game","continue-game","character-grid","confirm-character","game-ui","hud-name","portrait","hp-fill","mp-fill","xp-fill","hp-text","mp-text","hud-level","joystick","joy-knob","attack-btn","skill-btn","dash-btn","pause-btn","pause-screen","resume-game","save-game","quit-game"];
const missing=required.filter(id=>!$(id));
if(missing.length){const box=$("error-screen");if(box){box.classList.remove("hidden");$("error-message").textContent="Elemen HTML tidak ditemukan: "+missing.join(", ");}return;}
if(!window.GAME_DATA||!window.World||!window.GameAudio){const box=$("error-screen");box?.classList.remove("hidden");$("error-message").textContent="File data.js, world.js, atau audio.js gagal dimuat. Periksa lokasi file di GitHub.";return;}
const canvas=$("game"),ctx=canvas.getContext("2d",{alpha:false}),mini=$("minimap"),mctx=mini.getContext("2d");
const DATA=window.GAME_DATA,keys=Object.create(null),ELEMENTS=["fire","water","lightning","earth","wind"];
const HERO_PALETTES=[ ["#241b43","#5b3c83","#30233f"],["#e8d5c2","#d6b27b","#8b5a4b"],["#18352e","#477b50","#17251f"],["#551e2b","#9a3445","#321a2c"],["#263b68","#4b79a9","#d9e6ef"],["#164b4a","#4aa49a","#173b40"],["#28344a","#63758d","#1a2434"],["#381b37","#873c6e","#23152c"],["#5a4824","#b58b3f","#332719"],["#365a80","#7bb5d0","#263a54"],["#25213e","#63518a","#171529"],["#543d27","#9b7347","#2d211a"],["#512a1c","#b35c31","#271b1a"],["#24533a","#72a85e","#173a2d"],["#283b6a","#7d9ac4","#1a233f"],["#39235f","#8c5fd0","#21183d"],["#1c3448","#5c8fa5","#152638"],["#24516b","#75bad0","#183448"],["#40315e","#8b75bd","#211a38"],["#594326","#bd9b59","#30291d"] ];
const state={mode:"menu",selected:0,player:null,world:null,enemies:[],particles:[],projectiles:[],camera:{x:0,y:0},time:0,last:0,toastTime:0,joy:{x:0,y:0},quality:"high",combo:0,shake:0,pops:[],worldSeed:731,frame:0,previousElement:null,weatherTime:0};
const MON={};["slime","goblin","dragon"].forEach(n=>{const i=new Image();i.src="src/assets/sprites/"+n+".png";MON[n]=i;});
let viewW=innerWidth,viewH=innerHeight,dpr=1,joyPointer=null;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function resize(){
 viewW=Math.max(1,window.innerWidth||document.documentElement.clientWidth);
 viewH=Math.max(1,window.innerHeight||document.documentElement.clientHeight);
 const mobile= Math.min(viewW,viewH)<700;
 dpr=Math.min(window.devicePixelRatio||1,state.quality==="low"?1:(mobile?1.25:1.6));
 canvas.width=Math.round(viewW*dpr);canvas.height=Math.round(viewH*dpr);
 canvas.style.width=viewW+"px";canvas.style.height=viewH+"px";
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.imageSmoothingEnabled=false;
}
window.addEventListener("resize",resize,{passive:true});
window.addEventListener("orientationchange",()=>setTimeout(resize,180),{passive:true});
if(window.visualViewport)window.visualViewport.addEventListener("resize",resize,{passive:true});
resize();
async function requestLandscapeMode(){
 try{
  if(!document.fullscreenElement&&document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();
 }catch(e){/* Fullscreen is optional; the landscape prompt remains available. */}
 try{if(screen.orientation?.lock)await screen.orientation.lock("landscape");}catch(e){/* Some Android browsers only allow orientation lock in installed/PWA mode. */}
 setTimeout(resize,160);
}
function showScreen(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));if(id)$(id)?.classList.add("active");}
function menu(){state.mode="menu";$("game-ui").classList.add("hidden");showScreen("main-menu");GameAudio.stopMusic();}
function toast(message){const el=$("toast");el.textContent=message;el.style.opacity="1";state.toastTime=2.2;}
function selectedCharacter(){return DATA.characters[state.selected]||DATA.characters[0];}
function renderCharacterDetail(){
 const c=selectedCharacter(),el=DATA.elements[c.element];
 $("preview-name").textContent=c.name;$("preview-desc").textContent=c.description;
 $("preview-element").textContent=el.name;$("preview-weapon").textContent=c.weapon;$("preview-style").textContent=c.style;
 $("preview-art").innerHTML=`<img src="src/assets/heroes/card-${String(c.id+1).padStart(2,"0")}.webp" alt="${c.name}">`;$("preview-art").style.background=`radial-gradient(circle,${el.dark},#142236 68%)`;
}
function renderCharacters(){
 const grid=$("character-grid");grid.replaceChildren();
 DATA.characters.forEach((c,i)=>{
  const el=DATA.elements[c.element],button=document.createElement("button");
  button.type="button";button.className="character-card"+(i===state.selected?" selected":"");button.dataset.el=c.element;
  button.innerHTML=`<img class="cardart" src="src/assets/heroes/card-${String(i+1).padStart(2,"0")}.webp" alt="${c.name}" loading="lazy">`;
  button.addEventListener("click",()=>{state.selected=i;renderCharacters();renderCharacterDetail();GameAudio.sfx("click");});
  grid.appendChild(button);
 });renderCharacterDetail();
}
function chooseCharacter(){state.mode="select";state.selected=clamp(state.selected,0,DATA.characters.length-1);renderCharacters();showScreen("character-screen");try{GameAudio.sfx("click")}catch(e){console.warn("Audio click dilewati",e)}}
function createPlayer(c){
 return {x:46*32,y:51*32,r:10,speed:150,hp:120,maxHp:120,mp:80,maxMp:80,level:1,xp:0,nextXp:100,element:c.element,characterId:c.id,characterName:c.name,weapon:c.weapon,face:{x:0,y:1},attackCd:0,skillCd:0,dashCd:0,invuln:0,attackAnim:0,walk:0,alive:true};
}
function startGame(){
 requestLandscapeMode();
 if(!state.player)state.player=createPlayer(selectedCharacter());
 state.player.alive=true;state.mode="game";
 state.world=new World(state.worldSeed);state.enemies=[];state.particles=[];state.projectiles=[];state.time=0;state.combo=0;
 for(let i=0;i<24;i++)spawnEnemy();spawnEnemy(true);
 state.mode="game";state.camera.x=clamp(state.player.x-viewW/2,0,state.world.size*32-viewW);state.camera.y=clamp(state.player.y-viewH/2,0,state.world.size*32-viewH);
 showScreen(null);$("game-ui").classList.remove("hidden");$("hud-name").textContent=state.player.characterName;$("location-name").textContent="Hutan Embun";
 GameAudio.startMusic("adventure");updateHUD();toast("Petualangan dimulai. Jelajahi dunia dan hadapi monster!");
}
function spawnEnemy(boss){
 const p=state.player;if(!p||!state.world)return;
 let x,y,tries=0;
 if(boss){x=88*32;y=24*32;while(state.world.blocked(x,y,40)&&tries++<60){x-=24;y+=18;}}
 else do{const a=Math.random()*Math.PI*2,d=260+Math.random()*700;x=p.x+Math.cos(a)*d;y=p.y+Math.sin(a)*d;tries++}
 while(tries<15&&(x<40||y<40||x>state.world.size*32-40||y>state.world.size*32-40||state.world.blocked(x,y,15)));
 const pool=boss?DATA.monsters.filter(m=>m.boss):DATA.monsters.filter(m=>!m.boss);
 let template=pool[0];if(!boss){const sl=p.level<6?[6,1]:[3,5],tot=sl[0]+sl[1];template=Math.random()*tot<sl[0]?pool[0]:pool[1];}
 state.enemies.push({...template,x,y,hp:template.hp,maxHp:template.hp,attackCd:Math.random(),shootCd:2+Math.random()*2,hit:0,phase:Math.random()*6,knockX:0,knockY:0});
}
function pop(x,y,txt,color="#fff"){state.pops.push({x,y,txt,color,life:.85,max:.85});if(state.pops.length>40)state.pops.shift();}
function hurtPlayer(dmg,fromX,fromY){
 const p=state.player;if(p.invuln>0||!p.alive)return;
 p.hp=Math.max(0,p.hp-dmg);p.invuln=.55;state.shake=Math.max(state.shake,4);GameAudio.sfx("hurt");pop(p.x,p.y-26,"-"+dmg,"#ff6b7d");
 addParticle(p.x,p.y,"#ff596b",9,90);window.RPGVFX?.flash(p.x,p.y,"#ff596b",64,.22);window.RPGVFX?.burst(p.x,p.y,"#ff596b",14,120,"spark");
 if(p.hp<=0){p.alive=false;state.mode="respawn";toast("Kamu tumbang. Bangkit kembali...");setTimeout(()=>{if(state.player){p.hp=Math.ceil(p.maxHp*.65);p.x=46*32;p.y=51*32;p.alive=true;state.mode="game";toast("Kamu telah bangkit.");}},1200);}
}
function hitFx(e,el,dmg){
 const col=DATA.elements[el].color,shape={fire:"ember",water:"bubble",earth:"shard",lightning:"spark",wind:"spark"}[el];
 addParticle(e.x,e.y,col,9,95);window.RPGVFX?.flash(e.x,e.y,col,e.size*2,.12);window.RPGVFX?.burst(e.x,e.y,col,9,115,shape);pop(e.x,e.y-e.size-10,String(dmg),col);
 if(e.boss)state.shake=Math.max(state.shake,2);
}
function updateHUD(){
 const p=state.player;if(!p)return;
 $("hp-fill").style.width=clamp(p.hp/p.maxHp*100,0,100)+"%";$("mp-fill").style.width=clamp(p.mp/p.maxMp*100,0,100)+"%";$("xp-fill").style.width=clamp(p.xp/p.nextXp*100,0,100)+"%";
 $("hp-text").textContent=`${Math.ceil(p.hp)} / ${p.maxHp}`;$("mp-text").textContent=`${Math.floor(p.mp)} / ${p.maxMp}`;$("hud-level").textContent="LV "+p.level;
 if(state._pid!==p.characterId){state._pid=p.characterId;$("portrait").innerHTML=`<img src="src/assets/heroes/face-${String(p.characterId+1).padStart(2,"0")}.webp" alt="">`;}
 document.querySelectorAll(".element").forEach(b=>b.classList.toggle("active",b.dataset.element===p.element));
}
function addParticle(x,y,color,count=10,power=90,size=3,gravity=20){
 const factor=state.quality==="low"?.35:state.quality==="medium"?.65:1,n=Math.ceil(count*factor);
 for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=Math.random()*power,life=.3+Math.random()*.55;state.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life,max:life,size:size*(.5+Math.random()),color,gravity,kind:Math.random()<.25?"glow":"square"});}
}
function burst(x,y,color,radius=42){for(let i=0;i<24;i++){const a=i/24*Math.PI*2;state.particles.push({x,y,vx:Math.cos(a)*radius*3,vy:Math.sin(a)*radius*3,life:.45,max:.45,size:3,color,gravity:0,kind:"glow"});}}
function killEnemy(enemy){
 const idx=state.enemies.indexOf(enemy);if(idx<0)return;state.enemies.splice(idx,1);addParticle(enemy.x,enemy.y,enemy.color,28,160,4);window.RPGVFX?.burst(enemy.x,enemy.y,enemy.color,34,190,"spark");window.RPGVFX?.ring(enemy.x,enemy.y,enemy.color,34,.42,"magic");state.player.xp+=enemy.xp;if(enemy.boss){toast("Shadow Dragon dikalahkan! +"+enemy.xp+" XP");state.shake=9;window.RPGVFX?.ring(enemy.x,enemy.y,"#a855f7",260,.9,"magic");window.RPGVFX?.burst(enemy.x,enemy.y,"#c084fc",90,260,"spark");setTimeout(()=>{if(state.world&&state.mode!=="menu")spawnEnemy(true)},120000);}
 if(Math.random()<.22)state.player.hp=Math.min(state.player.maxHp,state.player.hp+5);
 checkLevel();if(state.enemies.length<18)for(let i=0;i<4;i++)spawnEnemy();
}
function checkLevel(){const p=state.player;while(p.xp>=p.nextXp){p.xp-=p.nextXp;p.level++;p.nextXp=Math.floor(p.nextXp*1.38);p.maxHp+=14;p.maxMp+=8;p.hp=p.maxHp;p.mp=p.maxMp;GameAudio.sfx("level");toast("LEVEL UP! Kamu mencapai level "+p.level);}}
function attack(){
 const p=state.player;if(state.mode!=="game"||!p||p.attackCd>0)return;p.attackCd=.32;p.attackAnim=.24;GameAudio.sfx("hit");
 const el=p.element,col=DATA.elements[el].color,ang=Math.atan2(p.face.y,p.face.x);
 window.RPGVFX?.slash(p.x+p.face.x*18,p.y+p.face.y*18,ang,col,54);window.RPGVFX?.elementSwing(el,p.x,p.y,ang);
 const range=64,halfAngle=.9,dmg=26+p.level*3,hit=[];
 for(const e of [...state.enemies]){const dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy);if(d>range+e.size*.5||d<.01)continue;const dot=(dx*p.face.x+dy*p.face.y)/d;if(dot>Math.cos(halfAngle)){e.hp-=dmg;e.hit=.18;if(!e.boss){e.knockX=dx/d*85;e.knockY=dy/d*85;}hitFx(e,el,dmg);hit.push(e);}}
 if(el==="lightning"&&hit.length){const src=hit[0];for(const e of [...state.enemies]){if(hit.includes(e))continue;if(Math.hypot(e.x-src.x,e.y-src.y)<130){const d2=Math.round(dmg*.5);e.hp-=d2;e.hit=.14;window.RPGVFX?.bolt(src.x,src.y,e.x,e.y,col);hitFx(e,el,d2);hit.push(e);break;}}}
 for(const e of hit)if(e.hp<=0)killEnemy(e);
 state.combo=hit.length?state.combo+1:0;if(hit.length)toast(state.combo>1?`COMBO ×${state.combo}`:"Serangan mengenai target");
}
function pickPower(a,b){const L=DATA.powers.filter(x=>x.a===a&&x.b===b);state.pv=(state.pv||0)+1;return L.length?L[state.pv%L.length]:{i:-1,name:"Elemental Burst"}}
function skill(){
 const p=state.player;if(state.mode!=="game"||!p||p.skillCd>0||p.mp<22)return;
 p.mp-=22;p.skillCd=1.35;GameAudio.sfx("magic");
 const first=p.element,second=p.previousElement&&p.previousElement!==first?p.previousElement:ELEMENTS[(ELEMENTS.indexOf(first)+1)%ELEMENTS.length];
 const pw=pickPower(first,second),combo=pw.name,c1=DATA.elements[first].color,c2=DATA.elements[second].color,dmg=Math.round((80+p.level*6)*1.35);
 toast(combo+" · "+DATA.elements[first].name+" + "+DATA.elements[second].name);state.shake=7;
 if(pw.i>=0&&window.SkillFX)window.SkillFX.cast(pw.i,p.x,p.y,Math.atan2(p.face.y,p.face.x),170);else window.RPGVFX?.skillBurst(first,second,p.x,p.y,c1,c2);burst(p.x,p.y,c1,80);
 for(const e of [...state.enemies]){const dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy);if(d<175+e.size*.5){e.hp-=dmg;e.hit=.28;const l=d||1;if(!e.boss){e.knockX=dx/l*160;e.knockY=dy/l*160;}hitFx(e,first,dmg);if(e.hp<=0)killEnemy(e);}}
 updateHUD();
}
function dash(){const p=state.player;if(state.mode!=="game"||!p||p.dashCd>0)return;p.dashCd=.9;p.invuln=.28;const ox=p.x,oy=p.y,steps=7;for(let i=0;i<steps;i++){const nx=p.x+p.face.x*19,ny=p.y+p.face.y*19;if(!state.world.blocked(nx,ny,p.r)){p.x=nx;p.y=ny;}}addParticle(ox,oy,DATA.elements[p.element].color,15,80,3,0);addParticle(p.x,p.y,DATA.elements[p.element].color,15,80,3,0);window.RPGVFX?.burst(ox,oy,DATA.elements[p.element].color,16,110,"spark");window.RPGVFX?.ring(p.x,p.y,DATA.elements[p.element].color,36,.3,"slash");GameAudio.sfx("dash");}
function setElement(element){if(!state.player||!DATA.elements[element])return;if(state.player.element!==element)state.player.previousElement=state.player.element;state.player.element=element;updateHUD();toast("Elemen aktif: "+DATA.elements[element].name);}
function cycleElement(){const p=state.player;if(!p)return;setElement(ELEMENTS[(ELEMENTS.indexOf(p.element)+1)%ELEMENTS.length]);}
function pause(){if(state.mode!=="game")return;state.mode="pause";showScreen("pause-screen");GameAudio.stopMusic();}
function resume(){if(state.mode!=="pause")return;state.mode="game";showScreen(null);GameAudio.startMusic("adventure");}
function saveGame(){
 if(!state.player)return;
 const payload={version:2,player:state.player,worldSeed:state.worldSeed,at:Date.now()};
 try{localStorage.setItem("chroniclesFiveSave",JSON.stringify(payload));toast("Permainan berhasil disimpan.");}
 catch(e){toast("Penyimpanan gagal: ruang browser tidak tersedia.");}
}
function loadGame(){
 try{const raw=localStorage.getItem("chroniclesFiveSave")||localStorage.getItem("rpgAdventureSave");if(!raw)return false;const data=JSON.parse(raw),p=data.player;if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.y))return false;
  const character=DATA.characters.find(c=>c.id===p.characterId)||DATA.characters[p.character?.id]||DATA.characters[0];
  state.selected=character.id;state.player={...createPlayer(character),...p,characterId:character.id,characterName:character.name,weapon:character.weapon,face:p.face||{x:0,y:1}};state.worldSeed=data.worldSeed||731;return true;
 }catch(e){console.warn("Save tidak dapat dibaca",e);return false;}
}
function update(dt){
 if(state.mode!=="game")return;const p=state.player;state.time+=dt;
 for(const k of ["attackCd","skillCd","dashCd","invuln","attackAnim"])p[k]=Math.max(0,p[k]-dt);
 p.mp=Math.min(p.maxMp,p.mp+dt*3.1);
 let ix=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+state.joy.x;
 let iy=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0)+state.joy.y;
 const len=Math.hypot(ix,iy);if(len>1){ix/=len;iy/=len;}
 if(len>.08){const l=Math.hypot(ix,iy)||1;p.face={x:ix/l,y:iy/l};p.walk+=dt*11;}
 const speed=p.speed*(keys.control?1.35:1),nx=p.x+ix*speed*dt,ny=p.y+iy*speed*dt;
 if(!state.world.blocked(nx,p.y,p.r))p.x=nx;if(!state.world.blocked(p.x,ny,p.r))p.y=ny;
 for(const e of [...state.enemies]){
  const dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy)||.001;e.phase+=dt*3;e.hit=Math.max(0,e.hit-dt);
  if(d<e.aggro&&d>(e.boss?130:22)){const vx=dx/d*e.speed,vy=dy/d*e.speed,tx=e.x+vx*dt,ty=e.y+vy*dt;if(!state.world.blocked(tx,e.y,e.size*.55))e.x=tx;if(!state.world.blocked(e.x,ty,e.size*.55))e.y=ty;}
  if(Math.abs(e.knockX)+Math.abs(e.knockY)>1){e.x+=e.knockX*dt;e.y+=e.knockY*dt;e.knockX*=Math.pow(.05,dt);e.knockY*=Math.pow(.05,dt);}
  e.attackCd=Math.max(0,e.attackCd-dt);
  if(d<(e.boss?e.size+20:25)&&e.attackCd<=0&&p.invuln<=0){e.attackCd=1;hurtPlayer(e.damage);}
  if(e.boss&&d<e.aggro){e.shootCd-=dt;if(e.shootCd<=0){e.shootCd=2.2;const base=Math.atan2(dy,dx);for(let k=-1;k<=1;k++){const a=base+k*.28;state.projectiles.push({x:e.x,y:e.y-30,vx:Math.cos(a)*190,vy:Math.sin(a)*190,life:3,r:9,dmg:18,color:"#b455ff"});}window.RPGVFX?.ring(e.x,e.y-30,"#a855f7",60,.4,"magic");}}
 }
 for(const q of state.projectiles){q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=dt;window.RPGVFX?.burst(q.x,q.y,q.color,1,30,"ember");if(Math.hypot(q.x-p.x,q.y-p.y)<q.r+10){q.life=0;hurtPlayer(q.dmg);}}
 state.projectiles=state.projectiles.filter(q=>q.life>0&&!state.world.blocked(q.x,q.y,2));
 for(const w of state.pops){w.y-=38*dt;w.life-=dt;}state.pops=state.pops.filter(w=>w.life>0);state.shake=Math.max(0,state.shake-dt*14);
 window.RPGVFX?.update(dt);window.SkillFX?.update(dt);
 for(const q of state.particles){q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=q.gravity*dt;q.vx*=Math.pow(.12,dt);q.life-=dt;}
 state.particles=state.particles.filter(q=>q.life>0);if(state.particles.length>420)state.particles.splice(0,state.particles.length-420);
 const maxX=state.world.size*32-viewW,maxY=state.world.size*32-viewH;
 state.camera.x=clamp(state.camera.x+(p.x-viewW/2-state.camera.x)*Math.min(1,dt*5),0,Math.max(0,maxX));
 state.camera.y=clamp(state.camera.y+(p.y-viewH/2-state.camera.y)*Math.min(1,dt*5),0,Math.max(0,maxY));
 if(state.toastTime>0){state.toastTime-=dt;if(state.toastTime<=0)$("toast").style.opacity="0";}
 updateHUD();drawMinimap();
}

function drawWeapon(p,color){
 const angle=Math.atan2(p.face.y,p.face.x);ctx.save();ctx.translate(p.face.x*7,p.face.y*5);ctx.rotate(angle+Math.PI/2);
 const name=(p.weapon||"").toLowerCase();ctx.lineCap="square";ctx.lineJoin="miter";
 ctx.strokeStyle="#5a392b";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,13);ctx.stroke();
 ctx.strokeStyle="#d7c59b";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-5,5);ctx.lineTo(5,5);ctx.stroke();
 ctx.shadowColor=color;ctx.shadowBlur=state.quality==="high"?9:3;
 if(name.includes("bow")){ctx.strokeStyle=color;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-8,10);ctx.quadraticCurveTo(-19,22,-8,34);ctx.stroke();ctx.strokeStyle="#e6e2d6";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-8,10);ctx.lineTo(-8,34);ctx.stroke();}
 else if(name.includes("crossbow")){ctx.strokeStyle="#c7d5df";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-12,19);ctx.lineTo(12,19);ctx.moveTo(0,12);ctx.lineTo(0,34);ctx.stroke();}
 else if(name.includes("axe")){ctx.fillStyle=color;ctx.fillRect(-9,17,18,13);ctx.fillStyle="#d8e2e8";ctx.fillRect(-11,18,5,10);}
 else if(name.includes("hammer")){ctx.fillStyle="#9ba9b7";ctx.fillRect(-9,18,18,9);ctx.fillStyle="#d9e4ed";ctx.fillRect(-7,16,14,3);}
 else if(name.includes("mace")){ctx.fillStyle=color;ctx.beginPath();ctx.arc(0,26,7,0,Math.PI*2);ctx.fill();for(let i=0;i<6;i++){const a=i*Math.PI/3;ctx.fillRect(Math.cos(a)*8-1,26+Math.sin(a)*8-1,3,3)}}
 else if(name.includes("shield")){ctx.fillStyle="#b8a16b";ctx.beginPath();ctx.moveTo(-9,15);ctx.lineTo(9,15);ctx.lineTo(7,29);ctx.lineTo(0,35);ctx.lineTo(-7,29);ctx.closePath();ctx.fill();ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();}
 else if(name.includes("scythe")){ctx.strokeStyle="#c7d8e7";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,12);ctx.lineTo(0,35);ctx.stroke();ctx.strokeStyle=color;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,15);ctx.quadraticCurveTo(17,10,13,0);ctx.stroke();}
 else if(name.includes("kusarigama")||name.includes("nunchaku")||name.includes("knives")){ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,12);ctx.lineTo(7,21);ctx.lineTo(-3,31);ctx.stroke();ctx.fillStyle="#dce7ef";ctx.fillRect(3,17,5,8);ctx.fillRect(-7,27,5,8);}
 else if(name.includes("chakram")){ctx.strokeStyle=color;ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,25,8,0,Math.PI*2);ctx.stroke();ctx.strokeStyle="#e5edf2";ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,25,4,0,Math.PI*2);ctx.stroke();}
 else if(name.includes("trident")){ctx.strokeStyle="#d6e5ed";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,12);ctx.lineTo(0,35);ctx.moveTo(-6,17);ctx.lineTo(0,11);ctx.lineTo(6,17);ctx.moveTo(-6,17);ctx.lineTo(-6,11);ctx.moveTo(6,17);ctx.lineTo(6,11);ctx.stroke();}
 else{ctx.fillStyle="#dce7ef";ctx.beginPath();ctx.moveTo(-3,12);ctx.lineTo(0,38);ctx.lineTo(3,12);ctx.closePath();ctx.fill();ctx.fillStyle=color;ctx.fillRect(-1,17,2,15);}
 ctx.shadowBlur=0;ctx.restore();
}

function drawPlayer(){
 const p=state.player,x=p.x-state.camera.x,y=p.y-state.camera.y,el=DATA.elements[p.element],bob=Math.sin(p.walk)*2,palette=HERO_PALETTES[p.characterId%HERO_PALETTES.length];
 ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.imageSmoothingEnabled=false;
 window.RPGVFX?.drawElementAura(ctx,0,5,el.color,state.time,25);
 ctx.fillStyle="#0a1721aa";ctx.fillRect(-12,8,24,6);
 if(p.invuln>0&&Math.floor(state.time*18)%2===0)ctx.globalAlpha=.45;
 // cloak and body with crisp layered pixel shading
 ctx.fillStyle=palette[0];ctx.fillRect(-10,-14+bob,20,25);ctx.fillStyle=palette[1];ctx.fillRect(-8,-13+bob,16,14);ctx.fillStyle=palette[2];ctx.fillRect(-7,-12+bob,5,10);ctx.fillStyle=palette[1];ctx.fillRect(1,-12+bob,7,13);
 ctx.fillStyle="#b28b56";ctx.fillRect(-8,3+bob,6,8);ctx.fillRect(2,3+bob,6,8);
 ctx.fillStyle="#e4b98e";ctx.fillRect(-6,-23+bob,12,11);ctx.fillStyle=palette[2];ctx.fillRect(-7,-26+bob,14,5);ctx.fillRect(-8,-22+bob,3,8);ctx.fillRect(5,-22+bob,3,8);
 ctx.fillStyle="#202039";ctx.fillRect(-3,-18+bob,2,2);ctx.fillRect(3,-18+bob,2,2);
 ctx.fillStyle=el.color;ctx.fillRect(-8,-10+bob,16,4);ctx.fillRect(-3,-5+bob,6,6);ctx.fillStyle="#f2d48e";ctx.fillRect(-8,-7+bob,2,2);ctx.fillRect(6,-7+bob,2,2);
 // weapon direction
 drawWeapon(p,el.color);
 if(p.attackAnim>0){ctx.globalAlpha=.8;ctx.strokeStyle=el.color;ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,34,Math.atan2(p.face.y,p.face.x)-1.05,Math.atan2(p.face.y,p.face.x)+1.05);ctx.stroke();ctx.shadowBlur=0;}
 ctx.restore();
}
function qualityShadow(){return state.quality==="high"?10:state.quality==="medium"?4:0;}
function drawEnemy(e){
 const x=e.x-state.camera.x,y=e.y-state.camera.y;if(x<-140||y<-160||x>viewW+140||y>viewH+100)return;
 const img=MON[e.sprite],ok=img&&img.complete&&img.naturalWidth,w=e.w,h=ok?w*img.naturalHeight/img.naturalWidth:w;
 ctx.save();ctx.translate(Math.round(x),Math.round(y+Math.sin(e.phase)*(e.boss?1.5:2)));
 ctx.fillStyle="#07111c88";ctx.beginPath();ctx.ellipse(0,e.boss?18:8,w*.36,Math.max(5,w*.1),0,0,Math.PI*2);ctx.fill();
 if(ok){
  ctx.imageSmoothingEnabled=false;const sy=e.id==="slime"?1+Math.sin(e.phase*2)*.07:1;
  ctx.save();if(state.player&&state.player.x>e.x)ctx.scale(-1,1);
  if(e.hit>0&&"filter" in ctx)ctx.filter="brightness(2.8)";else if(e.hit>0)ctx.globalAlpha=.55;
  ctx.drawImage(img,Math.round(-w/2),Math.round(-h*sy+(e.boss?22:10)),Math.round(w),Math.round(h*sy));ctx.restore();
 }else{ctx.fillStyle=e.color;ctx.beginPath();ctx.arc(0,0,e.size,0,Math.PI*2);ctx.fill();}
 const bw=Math.max(34,w*.7),top=-h-(e.boss?-8:2);
 ctx.fillStyle="#120d22cc";ctx.fillRect(-bw/2-1,top-1,bw+2,6);ctx.fillStyle=e.boss?"#a855f7":"#f15b68";ctx.fillRect(-bw/2,top,bw*clamp(e.hp/e.maxHp,0,1),4);
 if(e.boss){ctx.font="700 11px Oxanium,sans-serif";ctx.textAlign="center";ctx.fillStyle="#e9d5ff";ctx.fillText(e.name+" · "+e.lv,0,top-5);}
 ctx.restore();
}
function drawProjectiles(){
 ctx.save();ctx.globalCompositeOperation="lighter";
 for(const q of state.projectiles){const x=q.x-state.camera.x,y=q.y-state.camera.y;ctx.fillStyle=q.color;ctx.shadowColor=q.color;ctx.shadowBlur=16;ctx.beginPath();ctx.arc(x,y,q.r,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.shadowBlur=0;ctx.beginPath();ctx.arc(x,y,q.r*.4,0,Math.PI*2);ctx.fill();}
 ctx.restore();
}
function drawPops(){
 ctx.save();ctx.font="800 15px Oxanium,sans-serif";ctx.textAlign="center";ctx.lineWidth=3;ctx.strokeStyle="#0a0618";
 for(const w of state.pops){const x=w.x-state.camera.x,y=w.y-state.camera.y;ctx.globalAlpha=clamp(w.life/w.max*1.6,0,1);ctx.strokeText(w.txt,x,y);ctx.fillStyle=w.color;ctx.fillText(w.txt,x,y);}
 ctx.restore();
}
function drawMinimap(){
 if(!state.player||!state.world)return;mctx.clearRect(0,0,160,120);mctx.fillStyle="#244b3e";mctx.fillRect(0,0,160,120);
 for(let y=0;y<120;y+=3)for(let x=0;x<160;x+=3){const wx=Math.floor(x/160*state.world.size),wy=Math.floor(y/120*state.world.size),t=state.world.tileAt(wx,wy);mctx.fillStyle=(t==="water"||t==="water2")?"#268db0":(t==="path"||t==="path2")?"#b89565":t==="void"?"#101a25":"#347e4c";mctx.fillRect(x,y,3,3);}
 mctx.fillStyle="#f4d36e";mctx.beginPath();mctx.arc(state.player.x/(state.world.size*32)*160,state.player.y/(state.world.size*32)*120,3,0,Math.PI*2);mctx.fill();
}
function render(){
 ctx.clearRect(0,0,viewW,viewH);
 if(state.world&&["game","pause","respawn"].includes(state.mode)){
  ctx.save();if(state.shake>0)ctx.translate((Math.random()-.5)*state.shake*1.6,(Math.random()-.5)*state.shake*1.6);
  state.world.draw(ctx,state.camera,viewW,viewH,state.time,state.quality);
  // draw enemies and particles; keep world layers simple and predictable
  window.RPGVFX?.drawWorld(ctx,state.camera,state.time,state.quality);window.SkillFX?.draw(ctx,state.camera);
  for(const e of state.enemies)drawEnemy(e);
  for(const q of state.particles){const x=q.x-state.camera.x,y=q.y-state.camera.y;ctx.globalAlpha=clamp(q.life/q.max,0,1);ctx.fillStyle=q.color;if(q.kind==="glow"){ctx.shadowBlur=10;ctx.shadowColor=q.color;}ctx.fillRect(x,y,q.size,q.size);ctx.shadowBlur=0;}
  ctx.globalAlpha=1;drawPlayer();drawProjectiles();drawPops();ctx.restore();window.RPGVFX?.drawScreen(ctx,viewW,viewH,state.time,state.player,state.camera,state.quality);
  if(state.quality!=="low"){ctx.fillStyle="#c8f4df18";for(let i=0;i<18;i++){const x=(i*193+state.time*8)%viewW,y=(i*113+state.time*17)%viewH;ctx.fillRect(x,y,2,3);}}
 }else{
  const g=ctx.createLinearGradient(0,0,viewW,viewH);g.addColorStop(0,"#152b3a");g.addColorStop(.55,"#203d45");g.addColorStop(1,"#111c30");ctx.fillStyle=g;ctx.fillRect(0,0,viewW,viewH);
  for(let i=0;i<28;i++){const x=(i*157+state.time*5)%viewW,y=(i*89+Math.sin(state.time+i)*14)%viewH;ctx.fillStyle="#d6e8cf22";ctx.fillRect(x,y,3,3);}
 }
}
function frame(t){const dt=Math.min(.04,Math.max(0,(t-state.last)/1000));state.last=t;state.time+=state.mode==="menu"||state.mode==="select"?dt:0;update(dt);render();requestAnimationFrame(frame);}
function bindUI(){
 $("new-game").addEventListener("click",()=>{try{GameAudio.resume()}catch(e){console.warn("Audio tidak tersedia",e)}chooseCharacter();});
 $("continue-game").addEventListener("click",()=>{try{GameAudio.resume()}catch(e){console.warn(e)}if(loadGame())startGame();else{toast("Belum ada data permainan. Pilih karakter terlebih dahulu.");chooseCharacter();}});
 $("open-exit")?.addEventListener("click",()=>{try{window.close()}catch(e){}toast("Tutup tab browser untuk keluar.");});
 $("open-options").addEventListener("click",()=>showScreen("options-screen"));$("open-credits").addEventListener("click",()=>showScreen("credits-screen"));
 $("back-menu").addEventListener("click",menu);$("options-back").addEventListener("click",menu);$("credits-back").addEventListener("click",menu);
 $("confirm-character").addEventListener("click",()=>{state.player=createPlayer(selectedCharacter());startGame();});
 $("attack-btn").addEventListener("pointerdown",e=>{e.preventDefault();attack();});$("skill-btn").addEventListener("pointerdown",e=>{e.preventDefault();skill();});$("dash-btn").addEventListener("pointerdown",e=>{e.preventDefault();dash();});
 $("pause-btn").addEventListener("click",pause);$("resume-game").addEventListener("click",resume);
 $("save-game").addEventListener("click",saveGame);$("quit-game").addEventListener("click",()=>{saveGame();state.world=null;state.player=null;state.mode="menu";$("game-ui").classList.add("hidden");menu();});
 document.querySelectorAll(".element").forEach(b=>b.addEventListener("click",()=>setElement(b.dataset.element)));
 $("music-volume").addEventListener("input",e=>GameAudio.setVolumes(+e.target.value,+"0.65"));
 $("sfx-volume").addEventListener("input",e=>GameAudio.setVolumes(+"0.28",+e.target.value));
 $("quality").addEventListener("change",e=>{state.quality=e.target.value;resize();});
 const joy=$("joystick"),knob=$("joy-knob");
 function joyMove(e){const r=joy.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),max=r.width*.34,len=Math.hypot(dx,dy),scale=len>max?max/len:1;state.joy.x=dx*scale/max;state.joy.y=dy*scale/max;knob.style.transform=`translate(${dx*scale}px,${dy*scale}px)`;}
 function joyEnd(){joyPointer=null;state.joy.x=state.joy.y=0;knob.style.transform="";}
 joy.addEventListener("pointerdown",e=>{joyPointer=e.pointerId;joy.setPointerCapture(e.pointerId);joyMove(e);});
 joy.addEventListener("pointermove",e=>{if(e.pointerId===joyPointer)joyMove(e);});joy.addEventListener("pointerup",joyEnd);joy.addEventListener("pointercancel",joyEnd);joy.addEventListener("lostpointercapture",joyEnd);
 window.addEventListener("keydown",e=>{const k=e.key.toLowerCase();keys[k]=true;if([" ","arrowup","arrowdown","arrowleft","arrowright"].includes(k))e.preventDefault();if(e.repeat)return;if(k===" "||k==="j")attack();if(k==="k")skill();if(k==="shift")dash();if(k==="e")cycleElement();if(k==="escape"){if(state.mode==="game")pause();else if(state.mode==="pause")resume();}});
 window.addEventListener("keyup",e=>{keys[e.key.toLowerCase()]=false;});
 document.addEventListener("visibilitychange",()=>{if(document.hidden&&state.mode==="game")pause();});
}
try{bindUI();renderCharacters();requestAnimationFrame(frame);}catch(error){console.error("Chronicles boot error:",error);$("error-screen").classList.remove("hidden");$("error-message").textContent=(error.message||"Kesalahan saat menyiapkan game.")+" — periksa lokasi src/ dan nama file.";}
})();
