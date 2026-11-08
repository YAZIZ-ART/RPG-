/*
 * CHRONICLES OF THE FIVE — WORLD ENGINE v2
 * Deterministic world generation, atlas-driven ground textures, collision,
 * animated water, layered scenery and handcrafted landmarks.
 */
(() => {
 'use strict';
 const ATLAS={grass:[0,0],grass2:[1,0],moss:[2,0],flower:[3,0],path:[0,1],path2:[1,1],water:[2,1],water2:[3,1],sand:[0,2],stone:[1,2],stone2:[2,2],soil:[3,2],leaf:[0,3],roof:[1,3],wood:[2,3],rune:[3,3]};
 const SPR={};['tree1','tree2','pine','pink','palm','bush1','bush2','rock1','rock2','crystalb','crystalp','house','castle','well','fountain','rune','torch','chest','sign','log','stump','waterfall','bridge'].forEach(n=>{const i=new Image();i.src='src/assets/sprites/'+n+'.png';SPR[n]=i;});
 window.World=class World{
  constructor(seed=731){
   this.seed=seed;this.size=112;this.tile=32;this.decor=[];this.obstacles=[];this.buildings=[];this.atlas=new Image();this.atlasReady=false;
   this.atlas.onload=()=>{this.atlasReady=true};this.atlas.onerror=()=>{this.atlasReady=false};this.atlas.src='src/assets/terrain-atlas.png';
   this.generate();
  }
  static get sprites(){return SPR}
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
   const L=(kind,tx,ty,scale=1,block=0)=>{this.decor.push({x:tx*this.tile+16,y:ty*this.tile+16,kind,scale,seed:this.rand(tx,ty),variant:0});if(block)this.obstacles.push({x:tx*this.tile+16,y:ty*this.tile+16,r:block});};
   L('well',44,53,1,14);L('torch',45,48,1);L('torch',53,48,1);L('sign',49,52,1);L('chest',51,54,1,10);L('crystalb',40,57,1.2,8);L('crystalp',41,58,1,6);L('crystalb',62,40,1.2,8);L('log',38,48,1);L('stump',60,56,1);L('waterfall',53,34,1.6,0);
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
   const cell=ATLAS[kind]||ATLAS.grass,ix=Math.floor(px),iy=Math.floor(py);
   if(this.atlasReady){ctx.imageSmoothingEnabled=false;ctx.drawImage(this.atlas,cell[0]*64,cell[1]*64,64,64,ix,iy,33,33);}
   else{const colors={grass:'#348e4e',grass2:'#286a45',moss:'#3c8750',flower:'#348e4e',path:'#9c784e',path2:'#876342',water:'#17658b',water2:'#164d78',void:'#172532'};ctx.fillStyle=colors[kind]||'#348e4e';ctx.fillRect(ix,iy,32,32);}
   const r=this.rand(x+91,y+37),r2=this.rand(x+17,y+119);
   if((kind==='water'||kind==='water2')&&quality!=='low'){
    const phase=(time*18+x*7+y*11)%34;ctx.fillStyle='#b5f5f0';ctx.globalAlpha=.24;ctx.fillRect(ix+phase-4,iy+8,9,2);ctx.fillRect(ix+((phase+17)%30),iy+22,6,1);
    ctx.globalAlpha=.13;ctx.fillStyle='#d6ffff';ctx.fillRect(ix+3+Math.floor(r*20),iy+4+Math.floor(r2*22),3,1);ctx.globalAlpha=1;
   }
  }
  draw(ctx,camera,w,h,time,quality='high'){
   const t=this.tile,sx=Math.floor(camera.x/t)-1,sy=Math.floor(camera.y/t)-1,ex=sx+Math.ceil(w/t)+3,ey=sy+Math.ceil(h/t)+3;
   for(let y=sy;y<ey;y++)for(let x=sx;x<ex;x++){
    const px=x*t-camera.x,py=y*t-camera.y,k=this.tileAt(x,y);this.drawTile(ctx,k,px,py,x,y,time,quality);
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
   const S=SPR,img=b.type==='house'?S.house:b.type==='ruin'?S.castle:S.fountain;if(!img||!img.complete||!img.naturalWidth)return;
   const w=b.type==='house'?236:b.type==='ruin'?300:84,h=w*img.naturalHeight/img.naturalWidth;
   ctx.save();ctx.translate(Math.round(x+b.w/2),Math.round(y+b.h));ctx.imageSmoothingEnabled=false;
   ctx.fillStyle='#050b1466';ctx.beginPath();ctx.ellipse(0,0,w*.42,9,0,0,Math.PI*2);ctx.fill();
   ctx.drawImage(img,Math.round(-w/2),Math.round(-h+6),Math.round(w),Math.round(h));
   if(b.type==='shrine'&&S.rune.complete){ctx.globalAlpha=.55+.25*Math.sin(time*2);ctx.drawImage(S.rune,-30,-6,60,60*S.rune.naturalHeight/S.rune.naturalWidth);}
   ctx.restore();
  }
  drawDecoration(ctx,x,y,d,time,quality){
   const S=SPR;let name,w;
   if(d.kind==='tree'){name=['tree1','tree2','pine','pink','palm'][Math.floor(d.seed*5)%5];w=70}
   else if(d.kind==='rock'){name=d.seed>.5?'rock1':'rock2';w=44}
   else if(d.kind==='shrub'){name=d.seed>.5?'bush1':'bush2';w=34}
   else{name=d.kind;w={well:56,torch:20,sign:30,chest:36,crystalb:32,crystalp:28,log:38,stump:30,waterfall:150}[d.kind]||40}
   const img=S[name];if(!img||!img.complete||!img.naturalWidth)return;
   w*=d.scale;const h=w*img.naturalHeight/img.naturalWidth;
   ctx.save();ctx.translate(Math.round(x),Math.round(y+12));ctx.imageSmoothingEnabled=false;
   ctx.fillStyle='#07140f55';ctx.beginPath();ctx.ellipse(0,0,w*.34,Math.max(4,w*.1),0,0,Math.PI*2);ctx.fill();
   if(d.kind==='tree')ctx.transform(1,0,Math.sin(time*1.1+d.seed*9)*.018,1,0,0);
   if(d.kind==='crystalb'||d.kind==='crystalp'){ctx.shadowColor=d.kind==='crystalb'?'#5fd0ff':'#b07bff';ctx.shadowBlur=14+4*Math.sin(time*3);}
   ctx.drawImage(img,Math.round(-w/2),Math.round(-h+4),Math.round(w),Math.round(h));
   ctx.restore();
  }
 };
})();
