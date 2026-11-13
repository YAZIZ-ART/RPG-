/* VFX2 v11: ribbon trail halus, lens distortion, zoom punch, kelopak, tint boss */
let ZP=0,LZ=null;
function tip11(e,f,t,ht){const p=e.t/e.dur;if(CLS[e.w]==='sl'){const u=clamp(p/Math.max(.14,ht*.9),0,1),fc=pl.face||1,L=e.nk?(e.i===2?2.4:1.5):(e.i%3===2?1.5:(e.i%3===1?1.2:1)),r=32+14*L,a=(fc>0?-1.2:PI+1.2)+(fc>0?2.4:-2.4)*u;return V(f.x+fc*6+Math.cos(a)*r,f.y-2+Math.sin(a)*r*.85);}return lerpV(f,t,clamp(p/ht,0,1));}
const _uv2=update;update=function(dt){_uv2(dt);if(state!=='battle')return;ZP=Math.max(0,ZP-dt*.35);if(LZ)LZ.t-=dt;
 for(const e of fx){const p=e.t/e.dur,ht=HITT[e.type]||.4;if(!e.self&&p<ht+.08&&Q11.lv>0){const h=tip11(e,add(e.from,V(0,-14)),add(e.to,V(0,-14)),ht);(e.tr=e.tr||[]).push({x:h.x,y:h.y,t:e.t});if(e.tr.length>22)e.tr.shift();}
  if(e.hit&&e.dmg>=300&&!e.z11){e.z11=1;ZP=e.nk&&e.i===2?.07:.04;LZ={x:e.to.x-camX,y:e.to.y-camY-10,t:.45};}}};
const _de11=drawEntities;drawEntities=function(){_de11();if(Q11.lv<1)return;ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.lineJoin='round';
 for(const e of fx){const tr=e.tr;if(!tr||tr.length<2)continue;const P=e.pal,n=tr.length,w=e.nk?(e.i===2?9:6):4;
  for(let pass=0;pass<2;pass++){const col=pass?WHITE:P[1];for(let i=1;i<n;i++){const k=i/n,al=clamp(1-(e.t-tr[i].t)*3,0,1)*k;if(al<=0)continue;ctx.strokeStyle='rgba('+(col[0]|0)+','+(col[1]|0)+','+(col[2]|0)+','+al*(pass?.9:.55)+')';ctx.lineWidth=(pass?w*.35:w*1.6)*k+.5;ctx.beginPath();ctx.moveTo(tr[i-1].x,tr[i-1].y);ctx.lineTo(tr[i].x,tr[i].y);ctx.stroke();}}}
 ctx.restore();ctx.save();for(let i=0;i<22;i++){const x=camX+(((hr(i)*W+tg*(14+hr(i*3)*10)+Math.sin(tg*1.3+i)*16)%W)+W)%W,y=camY+(((hr(i*7)*H+tg*(10+hr(i*5)*8))%H)+H)%H;ctx.fillStyle=i%2?'rgba(190,255,190,.5)':'rgba(255,200,230,.45)';ctx.translate(x,y);ctx.rotate(tg+i);ctx.fillRect(-2,-1,4,2);ctx.rotate(-tg-i);ctx.translate(-x,-y);}ctx.restore();};
const _dh11=drawHud;drawHud=function(){if(state==='battle'){
 if(Q11.lv>0&&ZP>.002){ctx.drawImage(cv,0,0,cv.width,cv.height,-W*ZP/2,-H*ZP/2,W*(1+ZP),H*(1+ZP));}
 if(Q11.lv>0&&LZ&&LZ.t>0){const k=1-LZ.t/.45,r=30+150*k,z=1.1;ctx.save();ctx.beginPath();ctx.arc(LZ.x,LZ.y,r,0,TAU);ctx.clip();ctx.globalAlpha=.8*(1-k);ctx.drawImage(cv,0,0,cv.width,cv.height,LZ.x-LZ.x*z,LZ.y-LZ.y*z,W*z,H*z);ctx.restore();ctx.save();ctx.strokeStyle='rgba(255,255,255,'+.5*(1-k)+')';ctx.lineWidth=2;ctx.beginPath();ctx.arc(LZ.x,LZ.y,r,0,TAU);ctx.stroke();ctx.restore();}
 if(BGMODE==='boss'){ctx.fillStyle='rgba(120,10,40,.1)';ctx.fillRect(0,0,W,H);}}
 _dh11();};
