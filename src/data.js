/* Game data — validated, plain JavaScript, no external dependency. */
(() => {
 const elements={
  fire:{img:"src/assets/ui/el-fire.png",name:"Api",icon:"🔥",color:"#ff713c",dark:"#8e2d20",description:"Serangan agresif dengan ledakan dan bara."},
  water:{img:"src/assets/ui/el-water.png",name:"Air",icon:"💧",color:"#42c9ff",dark:"#164c9a",description:"Kontrol area, gelombang, dan pemulihan."},
  lightning:{img:"src/assets/ui/el-lightning.png",name:"Listrik",icon:"⚡",color:"#ffe45a",dark:"#8c641d",description:"Serangan cepat dan rantai energi."},
  earth:{img:"src/assets/ui/el-earth.png",name:"Tanah",icon:"🪨",color:"#d6a36a",dark:"#70452b",description:"Pertahanan kuat dan hantaman berat."},
  wind:{img:"src/assets/ui/el-wind.png",name:"Udara",icon:"🌀",color:"#69e4d0",dark:"#176b72",description:"Mobilitas tinggi dan tebasan angin."}
 };
 const raw=[
 ["Akira","fire","Katana","Duelist"],["Seraphina","lightning","Rapier","Swift striker"],["Varkas","earth","Longsword","Vanguard"],["Evelyne","water","Tanto","Trickster"],["Raiden","wind","Spear","Lancer"],
 ["Amaya","wind","Naginata","Dancer"],["Chronos","earth","Halberd","Warden"],["Nyxara","fire","Battle Axe","Berserker"],["Tharion","lightning","War Hammer","Breaker"],["Mirael","water","Mace","Cleric"],
 ["Rurozora","water","Scythe","Reaper"],["Rindou","earth","Kusarigama","Controller"],["Renji","lightning","Nunchaku","Brawler"],["Elenara","wind","Bow","Ranger"],["Darius","fire","Crossbow","Gunner"],
 ["Zephyra","lightning","Chakram","Rogue"],["Kaelthas","wind","Throwing Knives","Assassin"],["Isolde","water","Trident","Sentinel"],["Sylvana","water","Staff","Mystic"],["Valdrik","earth","Shield","Guardian"]
 ];
 const characters=raw.map((c,i)=>({id:i,name:c[0],element:c[1],weapon:c[2],style:c[3],level:1,description:`${c[0]} adalah petualang ${c[3].toLowerCase()} yang menguasai elemen ${elements[c[1]].name.toLowerCase()}.`}));
 const combinations={
  "fire-water":"Uap","fire-earth":"Lava","fire-lightning":"Plasma","fire-wind":"Pusaran Api",
  "water-earth":"Lumpur","water-lightning":"Air Bermuatan","water-wind":"Es","water-fire":"Gelombang Pasang",
  "earth-fire":"Batu Panas","earth-lightning":"Magnetisme","earth-wind":"Debu Angin","earth-water":"Tembok Batu",
  "lightning-fire":"Ledakan Petir","lightning-water":"Medan Listrik","lightning-wind":"Badai Petir","lightning-earth":"Getaran Seismik",
  "wind-fire":"Angin Topan","wind-water":"Kabut Ilusi","wind-earth":"Debu Silir","wind-lightning":"Tornado Petir"
 };
 const monsters=[
  {id:"slime",name:"Slime",lv:"Lv. 1-5",sprite:"slime",w:46,hp:42,damage:6,xp:14,color:"#42caff",size:14,speed:36,aggro:240,weight:6},
  {id:"goblin",name:"Goblin",lv:"Lv. 6-15",sprite:"goblin",w:58,hp:120,damage:12,xp:40,color:"#91d451",size:16,speed:52,aggro:300,weight:3},
  {id:"dragon",name:"Shadow Dragon",lv:"Lv. 30+",sprite:"dragon",w:200,hp:1400,damage:30,xp:700,color:"#a855f7",size:48,speed:34,aggro:420,boss:true,weight:0}
 ];
 const EM={f:"fire",w:"water",l:"lightning",e:"earth",a:"wind"};
 const powers='fw:Uap;fe:Lava;fl:Plasma;fa:Pusaran Api;we:Lumpur;wl:Air Bermuatan;wa:Es;wf:Gelombang Pasang;ef:Batu Panas;el:Magnetisme;ea:Debu Angin;ew:Tembok Batu;lf:Ledakan Petir;lw:Medan Listrik;la:Badai Petir;le:Getaran Seismik;af:Angin Topan;aw:Kabut Ilusi;ae:Debu Silir;al:Tornado Petir;fe:Naga Bara;fa:Semburan Surya;fe:Lava;fl:Halilintar;we:Rimba Purba;aw:Fatamorgana;wl:Nadi Kehidupan;we:Banjir Bandang;ea:Langkah Gemuruh;el:Titan Mekanik;el:Magnetisme;el:Getaran Seismik;wl:Arus Listrik;wl:Badai Petir;la:Kilat Ruang;la:Gelombang Sonik;aw:Hujan;aw:Pelangi;ae:Tsunami;la:Aurora'.split(";").map((s,i)=>({i,a:EM[s[0]],b:EM[s[1]],name:s.slice(3)}));
 window.GAME_DATA={elements,characters,combinations,monsters,powers};
})();
