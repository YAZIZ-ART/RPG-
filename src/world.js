/*
 * CHRONICLES OF THE FIVE — WORLD ENGINE v2
 * Deterministic world generation, atlas-driven ground textures, collision,
 * animated water, layered scenery and handcrafted landmarks.
 */
(() => {
 'use strict';
 const ATLAS={grass:[0,0],grass2:[1,0],moss:[2,0],flower:[3,0],path:[0,1],path2:[1,1],water:[2,1],water2:[3,1],sand:[0,2],stone:[1,2],stone2:[2,2],soil:[3,2],leaf:[0,3],roof:[1,3],wood:[2,3],rune:[3,3]};
 window.World=class World{
  constructor(seed=731){
   this.seed=seed;this.size=112;this.tile=32;this.decor=[];this.obstacles=[];this.buildings=[];this.atlas=new Image();this.atlasReady=false;
   this.atlas.onload=()=>{this.atlasReady=true};this.atlas.onerror=()=>{this.atlasReady=false};this.atlas.src='src/assets/terrain-atlas.png';
   this.generate();
  }
  rand(x,y){let n=Math.sin(x*127.1+y*311.7+this.seed*17)*43758.5453123;return n-Math.floor(n)}
  tileAt(x,y){
   if(x<0||y<0||x>=this.size||y>=this.size)return 'void';
   const river=Math.abs(x-(55+Math.sin(y*.075)*5))<2.2;
   if(river&&!(y>48&&y<59))return this.rand(x+8,y+3)>.5?'water':'water2';
   if((y>50&&y<54)||(Math.abs(x-(25+Math.sin(y*.08)*4))<1.2))return this.rand(x+2,y+4)>.55?'path':'path2';
   const r=this.rand(x,y);
   if(r<.07)return 'flower';if(r<.17)return 'grass2';if(r>.94)return 'moss';return 'grass';
  }
  generate(){
   for(let y=0;y<this.size;y++)for(let x=0;x<this.size;x++){
    const tile=this.tileAt(x,y);if(!['grass','grass2','moss','flower'].includes(tile))continue;
    const r=this.rand(x+200,y+70);
    if(r>.945&&!(x>43&&x<68&&y>43&&y<62)){
     const kind=this.rand(x+4,y+8)>.3?'tree':'rock';
     this.decor.push({x:x*this.tile+16,y:y*this.tile+16,kind,scale:.78+this.rand(x+9,y+3)*.5,seed:this.rand(x,y),variant:Math.floor(this.rand(x+13,y+4)*3)});
     if(kind==='tree'||this.rand(x+10,y)<.4)this.obstacles.push({x:x*this.tile+16,y:y*this.tile+16,r:kind==='tree'?12:9});
    }
    if(this.rand(x+43,y+18)>.985)this.decor.push({x:x*this.tile+16,y:y*this.tile+16,kind:'shrub',scale:.7+this.rand(x,y+80)*.5,seed:this.rand(x+7,y+7)});
   }
   this.buildings=[
    {id:'village-house',x:47*this.tile,y:45*this.tile,w:7*this.tile,h:5*this.tile,type:'house',name:'Rumah Penjaga'},
    {id:'old-ruin',x:69*this.tile,y:34*this.tile,w:5*this.tile,h:4*this.tile,type:'ruin',name:'Reruntuhan Kuno'},
    {id:'shrine',x:34*this.tile,y:27*this.tile,w:4*this.tile,h:4*this.tile,type:'shrine',name:'Altar Lima Elemen'}
   ];
   for(const b of this.buildings)this.obstacles.push({x:b.x+b.w/2,y:b.y+b.h/2,r:Math.max(b.w,b.h)*.43});
  }
  blocked(x,y,r=8){
   if(x<10||y<10||x>this.size*this.tile-10||y>this.size*this.tile-10)return true;
   const tx=Math.floor(x/this.tile),ty=Math.floor(y/this.tile);
   for(let yy=ty-1;yy<=ty+1;yy++)for(let xx=tx-1;xx<=tx+1;xx++){
    const t=this.tileAt(xx,yy);if((t==='water'||t==='water2')&&Math.hypot((xx+.5)*this.tile-x,(yy+.5)*this.tile-y)<this.tile*.62+r)return true;
   }
   return this.obstacles.some(o=>Math.hypot(o.x-x,o.y-y)<o.r+r);
  }
  drawTile(ctx,kind,px,py,x,y,time,quality){
   const cell=ATLAS[kind]||ATLAS.grass;
   if(this.atlasReady)ctx.drawImage(this.atlas,cell[0]*64,cell[1]*64,64,64,Math.floor(px),Math.floor(py),32,32);
   else{const colors={grass:'#348e4e',grass2:'#286a45',moss:'#3c8750',flower:'#348e4e',path:'#9c784e',path2:'#876342',water:'#17658b',water2:'#164d78',void:'#172532'};ctx.fillStyle=colors[kind]||'#348e4e';ctx.fillRect(px,py,32,32);}
   if((kind==='water'||kind==='water2')&&quality!=='low'){
    const phase=(time*18+x*7+y*11)%34;ctx.fillStyle='#b5f5f0';ctx.globalAlpha=.2;ctx.fillRect(px+phase-4,py+8,9,2);ctx.fillRect(px+((phase+17)%30),py+22,6,1);ctx.globalAlpha=1;
   }
   if(kind==='flower'&&quality==='high'){ctx.fillStyle='#ffe6a5';ctx.globalAlpha=.75;ctx.fillRect(px+18,py+9,2,2);ctx.globalAlpha=1;}
  }
  draw(ctx,camera,w,h,time,quality='high'){
   const t=this.tile,sx=Math.floor(camera.x/t)-1,sy=Math.floor(camera.y/t)-1,ex=sx+Math.ceil(w/t)+3,ey=sy+Math.ceil(h/t)+3;
   for(let y=sy;y<ey;y++)for(let x=sx;x<ex;x++){
    const px=x*t-camera.x,py=y*t-camera.y,k=this.tileAt(x,y);this.drawTile(ctx,k,px,py,x,y,time,quality);
    if(k==='path'||k==='path2'){ctx.fillStyle='#f1d39a20';ctx.fillRect(px+2,py+2,28,1);}
   }
   // distant atmosphere and riverbank foam
   if(quality!=='low'){
    ctx.save();ctx.globalAlpha=.12;ctx.fillStyle='#c8f6e5';
    for(let i=0;i<7;i++){const x=((i*173+time*5)% (w+80))-40,y=((i*97+time*2)%(h+50))-25;ctx.fillRect(x,y,14,1)}ctx.restore();
   }
   for(const b of this.buildings){const x=b.x-camera.x,y=b.y-camera.y;if(x<-240||y<-220||x>w+240||y>h+220)continue;this.drawBuilding(ctx,x,y,b,time,quality)}
   const visible=this.decor.filter(d=>{const x=d.x-camera.x,y=d.y-camera.y;return x>-70&&y>-100&&x<w+70&&y<h+100}).sort((a,b)=>a.y-b.y);
   for(const d of visible)this.drawDecoration(ctx,d.x-camera.x,d.y-camera.y,d,time,quality);
  }
  drawBuilding(ctx,x,y,b,time,quality){
   ctx.save();ctx.translate(Math.round(x),Math.round(y));
   ctx.fillStyle='#08131dcc';ctx.fillRect(-5,b.h-4,b.w+10,12);
   if(b.type==='house'){
    ctx.fillStyle='#463c37';ctx.fillRect(0,16,b.w,b.h-16);ctx.fillStyle='#79503d';ctx.fillRect(5,22,b.w-10,b.h-27);
    ctx.fillStyle='#9d4e3e';ctx.beginPath();ctx.moveTo(-10,20);ctx.lineTo(b.w/2,-24);ctx.lineTo(b.w+10,20);ctx.closePath();ctx.fill();
    ctx.fillStyle='#d17a53';ctx.fillRect(8,17,b.w-16,5);ctx.fillStyle='#e0aa6a';ctx.fillRect(b.w*.42,b.h-37,b.w*.16,37);
    ctx.fillStyle='#243e54';ctx.fillRect(17,37,28,21);ctx.fillRect(b.w-45,37,28,21);ctx.strokeStyle='#d9b67c';ctx.lineWidth=2;ctx.strokeRect(17,37,28,21);ctx.strokeRect(b.w-45,37,28,21);
    ctx.fillStyle='#ffe3a1';ctx.globalAlpha=.15+.12*Math.sin(time*2);ctx.fillRect(20,40,22,15);ctx.fillRect(b.w-42,40,22,15);ctx.globalAlpha=1;
    ctx.fillStyle='#55372e';ctx.fillRect(b.w*.47,b.h-17,2,2);
   }else if(b.type==='shrine'){
    ctx.fillStyle='#515e69';ctx.fillRect(4,10,b.w-8,b.h-10);ctx.fillStyle='#87959a';ctx.fillRect(0,7,b.w,8);ctx.fillRect(7,0,b.w-14,7);
    ctx.fillStyle='#18283a';ctx.fillRect(14,20,b.w-28,b.h-20);ctx.strokeStyle='#d5bd81';ctx.strokeRect(12,18,b.w-24,b.h-18);
    ctx.fillStyle='#8be9ff';ctx.shadowColor='#8be9ff';ctx.shadowBlur=quality==='high'?16:5;ctx.fillRect(b.w/2-3,25,6,6);ctx.shadowBlur=0;
   }else{
    ctx.fillStyle='#626e70';ctx.fillRect(0,8,b.w,b.h-8);ctx.fillStyle='#9a9b88';ctx.fillRect(5,2,b.w-10,8);ctx.fillStyle='#293c45';ctx.fillRect(18,30,b.w-36,b.h-30);
    ctx.fillStyle='#b1a98e';ctx.fillRect(0,8,9,b.h-8);ctx.fillRect(b.w-9,8,9,b.h-8);ctx.fillStyle='#46565a';ctx.fillRect(13,14,b.w-26,4);
   }
   ctx.restore();
  }
  drawDecoration(ctx,x,y,d,time,quality){
   ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(d.scale,d.scale);
   if(d.kind==='tree'){
    ctx.fillStyle='#0b1b18aa';ctx.fillRect(-14,7,28,8);ctx.fillStyle='#543c2d';ctx.fillRect(-5,-3,10,31);ctx.fillStyle='#77533a';ctx.fillRect(-2,0,3,22);
    const palettes=[['#154c38','#1e7047','#38a85c'],['#214a39','#2e8052','#61a96a'],['#3a4935','#526b3e','#82964b']][d.variant];
    ctx.fillStyle=palettes[0];ctx.fillRect(-18,-25,36,30);ctx.fillRect(-13,-35,26,15);ctx.fillStyle=palettes[1];ctx.fillRect(-21,-29,42,18);ctx.fillRect(-14,-40,28,15);ctx.fillStyle=palettes[2];ctx.fillRect(-10,-34,14,8);ctx.fillRect(5,-26,9,7);
    if(quality==='high'){ctx.fillStyle='#a0dc83';ctx.globalAlpha=.55;ctx.fillRect(-8,-33,4,3);ctx.fillRect(9,-24,3,3);ctx.globalAlpha=1;}
   }else if(d.kind==='rock'){
    ctx.fillStyle='#15272b88';ctx.fillRect(-12,4,24,6);ctx.fillStyle='#526b70';ctx.fillRect(-11,-5,22,12);ctx.fillStyle='#849a98';ctx.fillRect(-7,-10,13,8);ctx.fillStyle='#aab9aa';ctx.fillRect(-4,-8,5,3);
   }else{
    ctx.fillStyle='#1b5e3b';ctx.fillRect(-10,-3,20,8);ctx.fillStyle='#3b9b57';ctx.fillRect(-7,-8,14,8);ctx.fillStyle='#8acb73';ctx.fillRect(-3,-9,5,3);
   }
   ctx.restore();
  }
 };
})();
