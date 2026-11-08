
const EL={api:['#e8431f','#ff9a3c'],air:['#2a8cf0','#8fd0ff'],tanah:['#b9803f','#f0c080'],listrik:['#f7d51d','#fff6a0'],udara:['#3fd0e8','#b8f4ff']};
const S='#d8e0ee',S2='#a9b4c8',G='#f2c94c',W='#7a4a25',D='#3a2a20',GR='#8a8a99';
// nama, senjata, elemen, rambut, gaya, baju, aksen, kulit, mata
const C=[
['Akira','Katana','api','#1e1a3a','short','#2a2f6a','#c9a227','#f2c9a0','#4a8cff'],
['Seraphina','Rapier','listrik','#f2d27a','long','#e8eefc','#6b7fd7','#f8d8b8','#4a8cff'],
['Varkas','Longsword','tanah','#2a2447','short','#1f6b3a','#8bd05a','#f2c9a0','#3a9a5a'],
['Evelyne','Tanto','air','#d9253a','long','#a01830','#ffb0b0','#f8d8b8','#4a8cff'],
['Raiden','Spear','udara','#cfd8f5','spiky','#2f55b8','#e6c050','#f2c9a0','#4a8cff'],
['Amaya','Naginata','udara','#1fb5b0','long','#2aa0c8','#f0c040','#f2c9a0','#d8a030'],
['Chronos','Halberd','tanah','#7ab8ff','spiky','#2a3a8a','#c9a227','#f2c9a0','#4a8cff'],
['Nyxara','Battle Axe','api','#7a3adf','long','#4a2a8a','#d44','#f8d8b8','#4a8cff'],
['Tharion','War Hammer','listrik','#e8e8e8','beard','#3a3050','#c9a227','#e8b894','#4a8cff'],
['Mirael','Mace','air','#c8b8f0','long','#e0d8f8','#8a5adf','#f8d8b8','#8a5adf'],
['Rurozora','Scythe','air','#1c1838','hood','#1c1838','#7a6ad0','#f2c9a0','#e0e0ff'],
['Rindou','Kusarigama','tanah','#b01840','long','#a8203a','#f0e0d0','#f8d8b8','#4a8cff'],
['Renji','Nunchaku','listrik','#2a2038','short','#4a3228','#e0a030','#f2c9a0','#4a8cff'],
['Elenara','Bow','udara','#f0dc90','long','#58b878','#f0e8b0','#f8d8b8','#3a9a5a'],
['Darius','Crossbow','api','#a8b8e8','short','#2a50b0','#f0c050','#f2c9a0','#4a8cff'],
['Zephyra','Chakram','listrik','#d8d0f8','long','#e8e4ff','#8878d8','#f8d8b8','#8a5adf'],
['Kaelthas','Throwing Knives','udara','#1e1a3a','spiky','#2a2a7a','#8888d0','#f2c9a0','#4a8cff'],
['Isolde','Trident','api','#58c8f0','long','#3a98d8','#f0e8a0','#f8d8b8','#4a8cff'],
['Sylvana','Staff','air','#8a5ad0','hat','#4a2a9a','#f0c050','#f8d8b8','#4a8cff'],
['Valdrik','Shield','tanah','#6a3a22','short','#3a3a4a','#c9a227','#e8c8b0','#4a8cff']];
const RANGED=['Bow','Crossbow','Throwing Knives','Chakram','Staff'];
function L(p,a,b,c,d,col){const n=Math.max(Math.abs(c-a),Math.abs(d-b));for(let i=0;i<=n;i++)p(Math.round(a+(c-a)*i/n),Math.round(b+(d-b)*i/n),col)}
function B(p,a,b,c,d,col){for(let x=a;x<=c;x++)for(let y=b;y<=d;y++)p(x,y,col)}
const lt=(c,n)=>'#'+[1,3,5].map(i=>Math.max(0,Math.min(255,parseInt(c.slice(i,i+2),16)+n)).toString(16).padStart(2,'0')).join('');
const ST=['#f4f8ff','#c4d0e6','#8795b0','#4a5470'],GD=['#fff2a0','#f2c94c','#b8892a','#6a4a14'],WD=['#c88a4a','#8a5a2a','#4a2c15'];
const off=(p,dx,dy)=>(x,y,c)=>p(x+dx,y+dy,c);
function blade(p,l,w,c,cv,k){for(let i=1;i<=l;i++){const tw=i>l-4?Math.max(0,w-(4-(l-i))):w,cx=Math.round((cv||0)*i*i/(l*l)*4);for(let d=-tw;d<=tw;d++)p(cx+d,-i,d<0?c[1]:d==0?c[0]:c[2]);if(k)p(cx+tw+1,-i,c[3])}p(Math.round((cv||0)*4),-l-1,c[0])}
const shaft=(p,a,b,c)=>{for(let i=a;i>=b;i--){p(-1,i,c[0]);p(0,i,c[1]);p(1,i,c[2])}};
const guard=(p,w,c,y)=>{for(let d=-w;d<=w;d++){p(d,y,c[1]);p(d,y+1,c[2])}p(-w,y-1,c[0]);p(w,y-1,c[0])};
const wrap=(p,a,b,c1,c2)=>{for(let i=a;i<=b;i++)for(let d=-1;d<=1;d++)p(d,i,(i+d)%2?c1:c2)};
const ball=(p,cx,cy,r,c)=>{for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++)if(x*x+y*y<=r*r+1)p(cx+x,cy+y,x+y<-r*.5?c[0]:x+y>r*.6?c[2]:c[1])};
const crs=(p,sx,sy,l)=>{for(let i=0;i<=40;i++){const t=i/40,x=Math.round(l*Math.sin(t*1.7)),y=Math.round(sy+l*.7*(1-Math.cos(t*1.7))),th=Math.round(4*(1-t))+1;for(let k=0;k<th;k++)p(sx+x,y+k,k==0?ST[0]:k==th-1?ST[2]:ST[1])}};
// senjata digambar dalam setengah-piksel (resolusi 2x)
const WP={
'Katana':p=>{blade(p,26,1,ST,1,1);guard(p,3,GD,0);wrap(p,2,9,'#2a2f6a','#7a84d0');ball(p,0,11,1,GD)},
'Rapier':p=>{blade(p,32,0,ST,0,1);guard(p,4,GD,0);L(p,-4,1,-2,6,GD[2]);L(p,4,1,2,6,GD[2]);wrap(p,2,9,'#6b7fd7','#e8eefc');ball(p,0,11,1,GD)},
'Longsword':p=>{blade(p,28,2,ST,0,1);for(let i=4;i<=22;i++)p(0,-i,ST[2]);guard(p,6,GD,0);shaft(p,9,2,WD);ball(p,0,11,2,GD)},
'Tanto':p=>{blade(p,14,1,['#ffd0d0','#ff6a6a','#c03030','#701818'],0,1);guard(p,2,GD,0);wrap(p,2,7,'#a01830','#ffb0b0');p(0,8,GD[1])},
'Spear':p=>{shaft(p,16,-22,WD);blade(off(p,0,-22),10,2,ST,0,1);guard(p,2,GD,-22);L(p,-1,-20,-4,-13,'#e04040');L(p,1,-20,4,-13,'#c02020')},
'Naginata':p=>{shaft(p,16,-14,WD);blade(off(p,0,-14),20,2,ST,2,1);guard(p,3,GD,-14)},
'Halberd':p=>{shaft(p,16,-24,WD);blade(off(p,0,-24),6,1,ST,0,1);B(p,2,-22,8,-15,ST[1]);B(p,2,-22,8,-21,ST[0]);B(p,7,-22,8,-15,ST[2]);L(p,-1,-18,-6,-16,ST[2]);L(p,-6,-16,-6,-12,ST[2]);guard(p,2,GD,-14)},
'Battle Axe':p=>{shaft(p,16,-22,['#7a4aa0','#4a2a6a','#2a1840']);for(const s of [-1,1])for(let y=-27;y<=-14;y++){const w=Math.round(8*Math.sqrt(Math.max(0,1-((y+20.5)/6.5)**2)));for(let x=2;x<=2+w;x++)p(s*x,y,x>w?ST[3]:y<-22?ST[0]:ST[1])}guard(p,2,GD,-13);p(0,17,GD[1])},
'War Hammer':p=>{shaft(p,16,-16,WD);B(p,-7,-24,7,-16,'#8a8a9e');B(p,-7,-24,7,-23,'#d8d8e8');B(p,-7,-17,7,-16,'#555568');B(p,-9,-23,-8,-17,'#a0a0b8');B(p,8,-23,9,-17,'#6a6a80');p(-5,-20,GD[0]);p(5,-20,GD[0]);guard(p,2,GD,-15)},
'Mace':p=>{shaft(p,16,-12,WD);ball(p,0,-18,5,['#e0a0ff','#a050e0','#5a2a90']);p(0,-24,ST[0]);p(0,-25,ST[0]);p(-6,-18,ST[1]);p(6,-18,ST[2]);p(-4,-22,ST[1]);p(4,-22,ST[1]);p(-4,-14,ST[2]);p(4,-14,ST[2]);p(-1,-20,'#fff');p(-1,-21,'#fff');guard(p,2,GD,-12)},
'Scythe':p=>{shaft(p,16,-26,WD);crs(p,0,-28,14);guard(p,2,GD,-25)},
'Kusarigama':p=>{shaft(p,8,-6,WD);crs(p,0,-8,8);[[-3,-3],[-6,-5],[-9,-8],[-11,-11]].forEach(a=>{p(a[0],a[1],GR);p(a[0]+1,a[1],'#555')});B(p,-15,-17,-11,-13,'#888');B(p,-15,-17,-11,-16,'#ccc')},
'Nunchaku':p=>{for(let i=4;i>=-10;i--){p(0,i,'#e0a030');p(1,i,'#a06a10');if(i%5==0)p(0,i,GD[0])}p(1,-11,GR);p(2,-12,GR);p(2,-13,GR);for(let i=0;i<14;i++){const x=3+Math.round(i*.35);p(x,-14-i,'#e0a030');p(x+1,-14-i,'#a06a10');if(i%5==0)p(x,-14-i,GD[0])}},
'Bow':p=>{for(let i=0;i<=48;i++){const t=i/48,y=-24+t*48,x=Math.round(9*Math.sin(t*Math.PI));p(x,y,GD[1]);p(x+1,y,GD[2]);p(x-1,y,GD[0])}L(p,0,-24,0,24,'#f0f0f0');B(p,8,-3,10,3,'#8a5a2a')},
'Crossbow':p=>{shaft(p,8,-22,WD);B(p,-2,-8,2,-4,'#5a3a1a');L(p,-11,-14,11,-14,GD[1]);L(p,-11,-13,11,-13,GD[2]);p(-12,-15,GD[0]);p(12,-15,GD[0]);L(p,-11,-14,0,-5,'#eee');L(p,11,-14,0,-5,'#ccc');L(p,0,-5,0,-20,'#8a5a30');p(0,-21,ST[0]);p(0,-22,ST[0])},
'Throwing Knives':p=>{[[0,0],[-7,3],[7,3]].forEach(a=>{const q=off(p,a[0],a[1]);blade(q,11,1,ST,0,1);guard(q,2,GD,0);wrap(q,2,5,'#2a2a7a','#8888d0')})},
'Chakram':p=>{for(let i=0;i<48;i++){const t=i/48*6.283,c=Math.cos(t),s=Math.sin(t);p(Math.round(c*11),-11+Math.round(s*11),i%2?ST[1]:GD[1]);p(Math.round(c*9),-11+Math.round(s*9),i%2?GD[2]:ST[2]);if(i%6==0)p(Math.round(c*13),-11+Math.round(s*13),ST[0])}},
'Trident':p=>{shaft(p,16,-16,WD);blade(off(p,0,-16),14,1,GD,0,1);blade(off(p,-7,-16),9,0,GD,0,1);blade(off(p,7,-16),9,0,GD,0,1);L(p,-7,-16,7,-16,GD[1]);L(p,-7,-15,7,-15,GD[2]);p(-8,-23,GD[0]);p(8,-23,GD[0]);p(-1,-15,'#4aa0e0');p(1,-15,'#4aa0e0')},
'Staff':p=>{shaft(p,16,-22,WD);ball(p,0,-28,5,['#e0a0ff','#b050f0','#6a2a9a']);p(-1,-30,'#fff');p(-1,-31,'#fff');p(0,-35,GD[0]);p(0,-36,GD[1]);p(-7,-28,GD[1]);p(7,-28,GD[1]);L(p,-5,-23,-8,-27,GD[1]);L(p,5,-23,8,-27,GD[1]);guard(p,2,GD,-21)},
'Shield':q=>{for(let y=-10;y<=12;y++){const t=(y+10)/22,w=Math.round(8*(1-Math.pow(t,1.7))+1);for(let x=-w;x<=w;x++){const ed=Math.abs(x)>=w-1||y==-10||y==-9;q(x,y,ed?(x<0?GD[0]:GD[2]):(x==0||y==-2?GD[1]:(x<0?'#fffbee':'#e8e2cc')))}}q(0,13,GD[2])}};
const E=t=>t*t*(3-2*t),SN=t=>Math.sin(t*Math.PI);
// s=kecepatan, a=pose senjata [sudut,dx,dy,sembunyi], fx=efek, proj=proyektil, hit=waktu kena, R=jangkauan, sh=getar layar
const ATK={
'Katana':{n:'Tebasan Cepat',s:.09,a:t=>[-1.5+3.3*E(t),0,0],fx:['arc',24,-1.2,1.7,1],hit:.45,R:52},
'Rapier':{n:'Tusukan Kilat',s:.09,a:t=>[1.5,SN(t)*6,0],fx:['line',34,2],hit:.4,lunge:7,R:58},
'Longsword':{n:'Tebasan Berat',s:.05,a:t=>[-2.2+4.4*E(t*t),0,0],fx:['arc',28,-1.7,1.7,2],hit:.6,R:54,sh:2},
'Tanto':{n:'Tusukan Ganda',s:.1,a:t=>[1.3,Math.abs(Math.sin(t*6.283))*5,0],fx:['line',20,1],hit:.3,lunge:3,R:40},
'Spear':{n:'Tusukan Panjang',s:.06,a:t=>[1.55,SN(t)*9,0],fx:['line',46,2],hit:.5,lunge:8,R:72},
'Naginata':{n:'Sapuan Lebar',s:.05,a:t=>[-2.4+5*E(t),0,0],fx:['arc',34,-2.1,2.3,2],hit:.5,R:60},
'Halberd':{n:'Hantaman Atas',s:.045,a:t=>[-2.3+3.8*E(t*t),0,0],fx:['arc',32,-1.8,1.5,2,'shock'],hit:.7,R:58,sh:4},
'Battle Axe':{n:'Putaran Kapak',s:.045,a:t=>[-1.6+6.28*E(t),0,0],fx:['arc',26,-1.6,4.7,2],hit:.6,R:50,sh:3},
'War Hammer':{n:'Hantaman Tanah',s:.04,a:t=>[t<.5?-1.5*E(t*2):-1.5+2.1*E((t-.5)*2),0,0],fx:['shock'],hit:.75,R:56,sh:6},
'Mace':{n:'Ayunan Elemen',s:.06,a:t=>[-1.8+3.4*E(t),0,0],fx:['arc',24,-1.3,1.7,1,'burst'],hit:.6,R:50,sh:2},
'Scythe':{n:'Sabit Bulan',s:.045,a:t=>[-2.6+5.2*E(t),0,0],fx:['arc',34,-2.3,2.3,3],hit:.5,R:62},
'Kusarigama':{n:'Lempar Rantai',s:.04,a:t=>[1.3,SN(t)*3,0,t>.15&&t<.9],proj:'sickle'},
'Nunchaku':{n:'Putaran Cepat',s:.05,a:t=>[t*12.57,0,0],fx:['arc',16,0,6.28,1],hit:.5,R:40},
'Bow':{n:'Panah Tembak',s:.06,a:t=>[.26,-SN(t)*2,0],proj:'arrow'},
'Crossbow':{n:'Baut Cepat',s:.07,a:t=>[1.3,-SN(t)*2,0],proj:'bolt'},
'Throwing Knives':{n:'Tiga Pisau',s:.08,a:t=>[1+SN(t)*.6,SN(t)*2,0],proj:'knives'},
'Chakram':{n:'Chakram Bumerang',s:.03,a:t=>[0,0,0,t>.2&&t<.9],proj:'chakram'},
'Trident':{n:'Gelombang Trisula',s:.06,a:t=>[1.55,SN(t)*8,0],fx:['line',40,3],proj:'wave',hit:.5,lunge:6,R:66},
'Staff':{n:'Bola Sihir',s:.05,a:t=>[-.4+SN(t)*.9,0,-SN(t)*3],proj:'orb'},
'Shield':{n:'Benturan Perisai',s:.06,a:t=>[.26,SN(t)*7,0],fx:['shock'],hit:.5,lunge:9,R:50,sh:3}};
function frame(c,wf,at){
 const cv=document.createElement('canvas');cv.width=128;cv.height=80;const x=cv.getContext('2d');
 let oy=0;const r=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect((a+8)*2,(b+6+oy)*2,w*2,h*2)};
 const [,wp,el,hair,st,cl,ac,sk,ey]=c;const h2=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect((a+8)*2,(b+6+oy)*2,w,h)};
 const bob=(wf==1||wf==3)?1:0,la=wf==1?-1:0,lb=wf==3?-1:0,dk='#241c3a';
 // rambut belakang
 oy=bob;
 if(st=='long')r(10,6,12,14,hair);
 if(st=='hood')r(10,5,12,16,cl);
 if(st=='hat')r(10,7,12,12,hair);
 // kaki
 oy=0;
 r(12,21,3,6+la,'#2a2a44');r(12,25+la,3,2,dk);
 r(17,21,3,6+lb,'#2a2a44');r(17,25+lb,3,2,dk);
 // badan
 oy=bob;
 r(12,14,8,7,cl);r(12,20,8,1,ac);r(15,15,2,2,EL[el][0]);
 r(10,14,2,5,cl);r(20,14,2,5,cl);r(10,19,2,2,sk);r(20,19,2,2,sk);
 if(st=='hood'){r(9,13,14,3,cl);r(11,15,10,1,'#0c0a1a')}
 // kepala
 r(12,6,8,8,sk);r(14,10,1,2,ey);r(17,10,1,2,ey);r(15,13,2,1,'#c07060');
 if(st=='hood'){r(11,4,10,4,cl);r(12,7,8,1,cl);r(12,8,8,6,'#0c0a1a');r(14,10,1,1,ey);r(17,10,1,1,ey)}
 else{r(11,5,10,3,hair);r(11,8,2,4,hair);r(19,8,2,4,hair)}
 if(st=='spiky'){r(12,3,2,2,hair);r(15,2,2,3,hair);r(18,3,2,2,hair)}
 if(st=='beard'){r(12,12,8,4,'#f0f0f0');r(14,12,4,1,sk);r(11,8,2,5,hair);r(19,8,2,5,hair)}
 if(st=='hat'){r(8,5,16,2,ac=='#f0c050'?'#3a1e80':cl);r(12,1,8,4,'#3a1e80');r(14,-3,4,4,'#3a1e80');r(12,4,8,1,ac)}
 if(st=='long'){r(11,12,2,8,hair);r(19,12,2,8,hair)}
 if(st!='hood'){h2(14,10,1,1,'#fff');h2(17,10,1,1,'#fff');h2(13,5,7,2,lt(hair,55))}h2(12,19,16,2,lt(cl,-45));
 // senjata
 const A=at>=0?ATK[wp].a(at):null,ang=A?A[0]:.26,ox=A?Math.round(A[1]):0,oy2=A?Math.round(A[2]):0;
 const cs=Math.cos(ang),sn=Math.sin(ang),hx=21,hy=18;
 const p=(a,b,col)=>{x.fillStyle=col;const bx=(hx+ox+8)*2,by=(hy+oy2+6+oy)*2;x.fillRect(bx+Math.round(a*cs-b*sn),by+Math.round(a*sn+b*cs),1,1);x.fillRect(bx+Math.round((a+.5)*cs-(b+.5)*sn),by+Math.round((a+.5)*sn+(b+.5)*cs),1,1)};
 if(wp=='Shield'){const q=(a,b,col)=>{x.fillStyle=col;x.fillRect((11+ox+8)*2+a,(18+oy2+6+oy)*2+b,1,1)};WP.Shield(q)}
 if(!(A&&A[3]))WP[wp](p);
 // outline berwarna + shading
 const W2_=128,H2_=80,im=x.getImageData(0,0,W2_,H2_),d=im.data,o=new Uint8ClampedArray(d);
 const HA=(u,v)=>u>=0&&v>=0&&u<W2_&&v<H2_&&d[(v*W2_+u)*4+3]>0;
 for(let j=0;j<H2_;j++)for(let i=0;i<W2_;i++){const k=(j*W2_+i)*4;
  if(d[k+3]){if(!HA(i,j-1)){o[k]=Math.min(255,d[k]+50);o[k+1]=Math.min(255,d[k+1]+50);o[k+2]=Math.min(255,d[k+2]+50)}else if(!HA(i,j+1)){o[k]=d[k]*.72;o[k+1]=d[k+1]*.72;o[k+2]=d[k+2]*.72}continue}
  for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const u=i+a,v=j+b;if(HA(u,v)){const n=(v*W2_+u)*4;o[k]=d[n]*.25;o[k+1]=d[n+1]*.2;o[k+2]=d[n+2]*.3+14;o[k+3]=255;break}}}
 im.data.set(o);x.putImageData(im,0,0);return cv}
