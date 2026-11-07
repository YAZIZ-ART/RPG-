/* Dunia tile-based procedural: area rumput, jalur, sungai, hutan, reruntuhan. */
window.World = class World{
 constructor(seed=42){this.seed=seed;this.size=96;this.tile=32;this.decor=[];this.obstacles=[];this.water=[];this.generate()}
 rand(x,y){let n=Math.sin(x*127.1+y*311.7+this.seed)*43758.5453;return n-Math.floor(n)}
 tileAt(x,y){const r=this.rand(x,y),r2=this.rand(x+90,y-40);let type="grass";
  if((x>39&&x<47&&y>8&&y<88)||(x>10&&x<80&&y>67&&y<72))type="water";
  else if(Math.abs(y-(45+Math.sin(x*.12)*9))<2.1||Math.abs(x-(24+Math.sin(y*.14)*7))<1.5)type="path";
  else if(r<.16)type="flower";else if(r2<.09)type="darkgrass";
  return type}
 generate(){for(let y=0;y<this.size;y++)for(let x=0;x<this.size;x++){let t=this.tileAt(x,y);if(t==="water")this.water.push({x,y});if(t==="grass"&&this.rand(x+4,y+2)>.91){let kind=this.rand(x,y)>.45?"tree":"rock";this.decor.push({x:x*this.tile+16,y:y*this.tile+16,kind,scale:.8+this.rand(x+2,y+8)*.5});if(kind==="tree"||this.rand(x,y)<.4)this.obstacles.push({x:x*this.tile+16,y:y*this.tile+16,r:kind==="tree"?12:8})}}}
 draw(ctx,camera,w,h,time){const t=this.tile, sx=Math.floor(camera.x/t)-1,sy=Math.floor(camera.y/t)-1,ex=sx+Math.ceil(w/t)+3,ey=sy+Math.ceil(h/t)+3;
  for(let y=sy;y<ey;y++)for(let x=sx;x<ex;x++){let px=x*t-camera.x,py=y*t-camera.y,kind=this.tileAt(x,y);if(kind==="water"){ctx.fillStyle="#1679b5";ctx.fillRect(px,py,t,t);ctx.fillStyle="#43c7ee";ctx.globalAlpha=.35;ctx.fillRect(px+((x*7+y*3+time*.02)%24),py+7,8,2);ctx.globalAlpha=1}
   else if(kind==="path"){ctx.fillStyle="#bd9255";ctx.fillRect(px,py,t,t);ctx.fillStyle="#d5ae72";ctx.fillRect(px+4,py+7,12,2);ctx.fillRect(px+19,py+23,8,2)}
   else{ctx.fillStyle=kind==="darkgrass"?"#277d4b":"#319b53";ctx.fillRect(px,py,t,t);ctx.fillStyle=kind==="flower"?"#f5a8e6":"#55b969";ctx.fillRect(px+((x*13+y*7)%27),py+((x*3+y*17)%26),2,3);if((x+y)%3===0){ctx.fillStyle="#287c47";ctx.fillRect(px+4,py+5,2,2)}}}
  for(const d of this.decor){let x=d.x-camera.x,y=d.y-camera.y;if(x<-55||y<-70||x>w+55||y>h+70)continue;this.drawDecoration(ctx,x,y,d,time)}
 }
 drawDecoration(ctx,x,y,d,time){ctx.save();ctx.translate(x,y);ctx.scale(d.scale,d.scale);if(d.kind==="tree"){ctx.fillStyle="#70452d";ctx.fillRect(-4,-3,8,24);ctx.fillStyle="#12633d";ctx.beginPath();ctx.arc(0,-14,19,0,Math.PI*2);ctx.fill();ctx.fillStyle="#2ebc58";ctx.beginPath();ctx.arc(-7,-22,12,0,Math.PI*2);ctx.arc(9,-18,12,0,Math.PI*2);ctx.fill();ctx.fillStyle="#75e879";ctx.fillRect(-9,-29,5,3)}else{ctx.fillStyle="#586b86";ctx.beginPath();ctx.moveTo(-11,6);ctx.lineTo(-8,-7);ctx.lineTo(2,-13);ctx.lineTo(12,-4);ctx.lineTo(10,7);ctx.closePath();ctx.fill();ctx.fillStyle="#a3b3c8";ctx.fillRect(-4,-6,5,3)}ctx.restore()}
 blocked(x,y,r=8){return this.obstacles.some(o=>Math.hypot(o.x-x,o.y-y)<o.r+r)}
};
