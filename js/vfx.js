/* VFX v9: aura, healing pulse, rift, light rays, cinematic shockwave, ground crack, vortex, runes, dissolve, screen flash/vignette/radial blur, slow/freeze */
const FXL=[];let SFL=0,SFC=[255,255,255,1],VG=0,RB=0;const TS={k:1,t:0};
function fxAdd(k,p,c,o){FXL.push({k,p:V(p.x,p.y),c:c||[200,160,255,1],t:0,d:(o&&o.d)||1,s:(o&&o.s)||1});}
function slowT(k,t){TS.k=k;TS.t=t;}
function drawFXL(){ctx.save();ctx.globalCompositeOperation='lighter';
 for(const f of FXL){const p=f.t/f.d,al=1-p,c=f.c,x=f.p.x,y=f.p.y,s=f.s,ez=1-Math.pow(1-p,3);
  switch(f.k){
  case'aura':{const h=130*Math.sin(Math.min(1,p*1.6)*PI/2),w=20*(1-p*.5);ctx.fillStyle=css(fade(c,.22*al));ctx.fillRect(x-w/2,y-h,w,h);ctx.fillStyle=css(fade(WHITE,.5*al));ctx.fillRect(x-2,y-h,4,h);
   for(let i=0;i<3;i++){const q=(p*1.5+i/3)%1;parc(V(x,y-q*100),24*(1-q*.3),0,TAU,[c,WHITE],al*(1-q),.3);}
   for(let i=0;i<14;i++)dot(V(x+(hr(i)-.5)*40,y-((p*140+hr(i*3)*80)%120)),fade(c,al),2);gl(V(x,y-10),c,30,.4*al);break;}
  case'pulse':for(let i=0;i<3;i++){const q=clamp(p*1.4-i*.18,0,1);if(q>0&&q<1)parc(V(x,y+4),10+70*q,0,TAU,[c,WHITE],(1-q)*.9,.4);}
   for(let i=0;i<6;i++){const a=TAU*i/6,yy=y-p*50;dot(V(x+Math.cos(a)*20,yy+Math.sin(a)*6),fade(c,al),3);dot(V(x+Math.cos(a)*20,yy+Math.sin(a)*6-3),fade(WHITE,al),2);}break;
  case'rays':for(let i=0;i<14;i++){const a=TAU*i/14+p*1.2,l=(70+hr(i)*80)*Math.min(1,p*3);tline(V(x+Math.cos(a)*12,y-20+Math.sin(a)*8),V(x+Math.cos(a)*l,y-20+Math.sin(a)*l*.7),[c,WHITE],al*.8);}break;
  case'rift':{const r=(18+28*s)*Math.sin(Math.min(1,p*2.5)*PI/2)*(p>.8?(1-p)*5:1);ctx.fillStyle='rgba(8,0,20,'+.9*Math.min(1,al*2)+')';ctx.beginPath();ctx.ellipse(x,y-24,r*.45,r,0,0,TAU);ctx.fill();
   parc(V(x,y-24),r,0,TAU,[c,WHITE,c],al,2.2);for(let i=0;i<8;i++){const a=TAU*i/8+hr(i)*.5;tline(V(x+Math.cos(a)*r*.4,y-24+Math.sin(a)*r),V(x+Math.cos(a)*r*1.6,y-24+Math.sin(a)*r*1.9),[c,WHITE],al*.8);}break;}
  case'cine':parc(V(x,y+8),170*ez,0,TAU,[c,WHITE],al,.35);parc(V(x,y+8),110*ez,0,TAU,[c],al*.8,.35);gl(V(x,y),WHITE,60*(1-p),.5*al);break;
  case'collapse':{const r=(1-p)*90;parc(V(x,y-10),r,0,TAU,[c,WHITE],al,.6);parc(V(x,y-10),r*.6,0,TAU,[c],al,.6);if(p>.8)gl(V(x,y-10),WHITE,70*(p-.8)*5,.8*(1-p)*5);break;}
  case'tele':{const w=14*(1-p);ctx.fillStyle=css(fade(WHITE,.8*al));ctx.fillRect(x-w/2,y-70,w,72);gl(V(x,y-20),c,24,.5*al);for(let i=0;i<8;i++)dot(V(x+(hr(i)-.5)*30,y-hr(i*3)*60-p*20),fade(c,al),2);break;}
  case'crack':for(let i=0;i<9;i++){let a=TAU*i/9+hr(i)*.4,px=x,py=y+6;for(let k=0;k<3;k++){const l=(8+hr(i+k)*22)*s*ez,nx=px+Math.cos(a)*l,ny=py+Math.sin(a)*l*.45;tline(V(px,py),V(nx,ny),[c,WHITE],Math.min(1,al*2));a+=(hr(i*7+k)-.5)*.9;px=nx;py=ny;}}break;
  case'vortex':for(let i=0;i<30;i++){const a=i*.45+p*8,r=i*2.2*(1-p*.3);dot(V(x+Math.cos(a)*r,y-10+Math.sin(a)*r*.5),fade(i%3?c:WHITE,al),2);}break;
  case'runes':for(let i=0;i<6;i++){const a=p*3+TAU*i/6,px=x+Math.cos(a)*34,py=y-30+Math.sin(a)*12-p*10;dot(V(px,py),fade(WHITE,al),3);for(const[dx,dy]of[[-4,0],[4,0],[0,-4],[0,4]])dot(V(px+dx,py+dy),fade(c,al),2);}break;
  case'over':for(let i=0;i<6;i++){const a=TAU*hr(i+Math.floor(f.t*30)),l=20+hr(i*3+Math.floor(f.t*30))*26;tline(V(x,y-14),V(x+Math.cos(a)*l,y-14+Math.sin(a)*l),[c,WHITE],al);}gl(V(x,y-14),c,26,.4*al);break;
  case'ember':for(let i=0;i<16;i++)dot(V(x+(hr(i)-.5)*60,y-((p*90*(.6+hr(i*3)))%80)),fade(i%2?c:[255,200,80,1],al),i%3?2:3);break;
  case'frag':for(let i=0;i<10;i++){const a=TAU*i/10,r=60*ez,px=x+Math.cos(a)*r,py=y-10+Math.sin(a)*r*.6;for(const[dx,dy]of[[0,-3],[3,0],[0,3],[-3,0]])dot(V(px+dx,py+dy),fade(i%2?c:WHITE,al),2);}break;
  case'dis':for(let i=0;i<Math.floor(40*s);i++){if(p<hr(i*5)*.5)continue;dot(V(x+(hr(i)-.5)*22*s,y-hr(i*3)*18*s-p*40*(.5+hr(i*7))),fade(c,al),hr(i*9)>.5?3:2);}break;}}
 ctx.restore();}
const _de9=drawEntities;drawEntities=function(){_de9();drawFXL();};
const _uv=update;update=function(dt){SFL=Math.max(0,SFL-dt*2);VG=Math.max(0,VG-dt*.8);RB=Math.max(0,RB-dt);
 for(let i=FXL.length-1;i>=0;i--){FXL[i].t+=dt;if(FXL[i].t>=FXL[i].d)FXL.splice(i,1);}_uv(dt);};
const _dhv=drawHud;
drawHud=function(){
 if(RB>0){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.min(.35,RB);ctx.drawImage(cv,0,0,cv.width,cv.height,-W*.025,-H*.025,W*1.05,H*1.05);ctx.restore();}
 if(VG>0){const g=ctx.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H*.9);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,'+Math.min(.75,VG*.75)+')');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
 if(SFL>0){ctx.fillStyle=css(fade(SFC,Math.min(.8,SFL)));ctx.fillRect(0,0,W,H);}
 if(TS.k<.5){ctx.fillStyle='rgba(60,90,200,.12)';ctx.fillRect(0,0,W,H);}
 _dhv();};
