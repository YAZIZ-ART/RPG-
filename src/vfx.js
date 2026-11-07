/*
 * CHRONICLES OF THE FIVE — VFX PIPELINE
 * Canvas-native effects: elemental sigils, light falloff, weather motes,
 * weapon arcs, hit sparks, screen ambience and reusable particle primitives.
 * The renderer intentionally caps work to preserve mobile frame pacing.
 */
(() => {
 'use strict';
 const TAU=Math.PI*2;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const hex=(h)=>{const s=String(h||'#ffffff').replace('#','');return [parseInt(s.slice(0,2),16)||255,parseInt(s.slice(2,4),16)||255,parseInt(s.slice(4,6),16)||255]};
 class Effects{
  constructor(){this.rings=[];this.flashes=[];this.sparks=[];this.ambient=[];this.maxSparks=520;this.seed=19;}
  random(){this.seed=(this.seed*1664525+1013904223)>>>0;return this.seed/4294967296;}
  ring(x,y,color,radius=70,duration=.55,style='magic'){
   this.rings.push({x,y,color,radius,life:duration,max:duration,style,phase:this.random()*TAU});
   if(this.rings.length>36)this.rings.shift();
  }
  flash(x,y,color='#ffffff',radius=42,duration=.14){this.flashes.push({x,y,color,radius,life:duration,max:duration});if(this.flashes.length>24)this.flashes.shift();}
  burst(x,y,color,count=24,power=130,shape='spark'){
   const n=Math.min(count,this.maxSparks-this.sparks.length),rgb=hex(color);
   for(let i=0;i<n;i++){
    const a=this.random()*TAU,s=power*(.25+this.random()*.75),life=.22+this.random()*.55;
    this.sparks.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life,max:life,size:1.4+this.random()*3.8,color,rgb,shape,spin:this.random()*TAU,gravity:shape==='ember'?42:shape==='bubble'?-18:0});
   }
  }
  slash(x,y,angle,color,radius=48){
   this.rings.push({x,y,color,radius,life:.22,max:.22,style:'slash',phase:angle});
   this.burst(x+Math.cos(angle)*radius*.7,y+Math.sin(angle)*radius*.7,color,9,95,'spark');
  }
  update(dt){
   for(const p of this.sparks){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.gravity*dt;p.vx*=Math.pow(.08,dt);p.vy*=Math.pow(.22,dt);p.life-=dt;p.spin+=dt*5;}
   for(const a of this.rings)a.life-=dt;for(const f of this.flashes)f.life-=dt;
   this.sparks=this.sparks.filter(p=>p.life>0);this.rings=this.rings.filter(p=>p.life>0);this.flashes=this.flashes.filter(p=>p.life>0);
  }
  drawWorld(ctx,camera,time,quality='high'){
   const scale=quality==='low'?.55:quality==='medium'?.78:1;
   ctx.save();ctx.globalCompositeOperation='lighter';
   for(const r of this.rings){
    const x=r.x-camera.x,y=r.y-camera.y,k=1-r.life/r.max,alpha=clamp(r.life/r.max,0,1);
    ctx.globalAlpha=alpha*.8;ctx.strokeStyle=r.color;ctx.lineWidth=r.style==='slash'?5:2;ctx.shadowColor=r.color;ctx.shadowBlur=quality==='high'?16:5;ctx.beginPath();
    if(r.style==='slash'){ctx.arc(x,y,r.radius*(.7+k*.5),r.phase-.9,r.phase+.9)}else{ctx.arc(x,y,r.radius*(.25+k*.75),0,TAU)}ctx.stroke();ctx.shadowBlur=0;
    if(r.style==='magic'&&quality==='high'){
     ctx.save();ctx.translate(x,y);ctx.rotate(r.phase+time*.45);ctx.globalAlpha=alpha*.38;ctx.strokeStyle=r.color;ctx.lineWidth=1;ctx.setLineDash([4,7]);ctx.beginPath();ctx.arc(0,0,r.radius*(.38+k*.6),0,TAU);ctx.stroke();ctx.setLineDash([]);
     for(let i=0;i<8;i++){const a=i*Math.PI/4;ctx.fillStyle=r.color;ctx.fillRect(Math.cos(a)*r.radius*.72-2,Math.sin(a)*r.radius*.72-2,4,4)}ctx.restore();
    }
   }
   for(const f of this.flashes){ctx.globalAlpha=(f.life/f.max)*.42;ctx.fillStyle=f.color;ctx.shadowColor=f.color;ctx.shadowBlur=18;ctx.beginPath();ctx.arc(f.x-camera.x,f.y-camera.y,f.radius*(1-f.life/f.max*.35),0,TAU);ctx.fill();ctx.shadowBlur=0;}
   for(const p of this.sparks){const x=p.x-camera.x,y=p.y-camera.y;if(x<-30||y<-30||x>ctx.canvas.clientWidth+30||y>ctx.canvas.clientHeight+30)continue;
    const a=clamp(p.life/p.max,0,1);ctx.globalAlpha=a;ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=quality==='high'?8:2;
    if(p.shape==='spark'){ctx.save();ctx.translate(x,y);ctx.rotate(p.spin);ctx.fillRect(-p.size*.35,-p.size*1.8,p.size*.7,p.size*3.6);ctx.restore()}
    else if(p.shape==='bubble'){ctx.beginPath();ctx.arc(x,y,p.size,0,TAU);ctx.strokeStyle=p.color;ctx.lineWidth=1.2;ctx.stroke()}
    else{ctx.fillRect(x,y,p.size,p.size*1.4)}
   }
   ctx.restore();ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  }
  drawScreen(ctx,w,h,time,player,camera,quality='high'){
   if(quality==='low')return;
   ctx.save();
   // atmospheric drifting motes, deterministic so no random allocation per frame
   const count=quality==='high'?34:15;
   for(let i=0;i<count;i++){
    const x=(i*173.7+time*(7+(i%4)*2))%(w+30)-15,y=(i*91.3+Math.sin(time*.7+i)*13+time*(i%3+1)*2)%(h+30)-15;
    ctx.globalAlpha=.12+(Math.sin(time*1.8+i)*.5+.5)*.16;ctx.fillStyle=i%5===0?'#ffe4a1':'#c4f4e5';ctx.fillRect(x,y,i%7===0?2:1,i%7===0?3:1);
   }
   ctx.globalAlpha=1;
   if(player&&quality==='high'){
    const x=player.x-camera.x,y=player.y-camera.y;
    const grad=ctx.createRadialGradient(x,y,24,x,y,Math.max(w,h)*.68);grad.addColorStop(0,'rgba(4,9,17,0)');grad.addColorStop(1,'rgba(4,9,17,.22)');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
   }
   ctx.restore();
  }
  drawElementAura(ctx,x,y,color,time,radius=28){
   ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.32;ctx.strokeStyle=color;ctx.lineWidth=2;ctx.shadowColor=color;ctx.shadowBlur=13;ctx.beginPath();ctx.ellipse(x,y+3,radius+Math.sin(time*5)*2,radius*.45,0,0,TAU);ctx.stroke();ctx.restore();
  }
 }
 window.RPGVFX=new Effects();
})();
