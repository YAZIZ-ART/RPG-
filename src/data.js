/* Game data — validated, plain JavaScript, no external dependency. */
(() => {
 const elements={
  fire:{name:"Api",icon:"🔥",color:"#ff713c",dark:"#8e2d20",description:"Serangan agresif dengan ledakan dan bara."},
  water:{name:"Air",icon:"💧",color:"#42c9ff",dark:"#164c9a",description:"Kontrol area, gelombang, dan pemulihan."},
  lightning:{name:"Listrik",icon:"⚡",color:"#ffe45a",dark:"#8c641d",description:"Serangan cepat dan rantai energi."},
  earth:{name:"Tanah",icon:"🪨",color:"#d6a36a",dark:"#70452b",description:"Pertahanan kuat dan hantaman berat."},
  wind:{name:"Udara",icon:"🌀",color:"#69e4d0",dark:"#176b72",description:"Mobilitas tinggi dan tebasan angin."}
 };
 const raw=[
 ["Akira","fire","Katana","Duelist"],["Seraphina","lightning","Rapier","Swift striker"],["Varkas","earth","Longsword","Vanguard"],["Evelyne","water","Tanto","Trickster"],["Raiden","wind","Spear","Lancer"],
 ["Amaya","wind","Naginata","Dancer"],["Chronos","earth","Halberd","Warden"],["Nyxara","fire","Battle Axe","Berserker"],["Tharion","lightning","War Hammer","Breaker"],["Mirael","water","Mace","Cleric"],
 ["Rurozora","water","Scythe","Reaper"],["Rindou","earth","Kusarigama","Controller"],["Renji","lightning","Nunchaku","Brawler"],["Elenara","wind","Bow","Ranger"],["Darius","fire","Crossbow","Gunner"],
 ["Zephyra","lightning","Chakram","Rogue"],["Kaelthas","wind","Throwing Knives","Assassin"],["Isolde","water","Trident","Sentinel"],["Sylvana","water","Staff","Mystic"],["Valdrik","earth","Shield","Guardian"]
 ];
 const characters=raw.map((c,i)=>({id:i,name:c[0],element:c[1],weapon:c[2],style:c[3],level:1,description:`${c[0]} adalah petualang ${c[3].toLowerCase()} yang menguasai elemen ${elements[c[1]].name.toLowerCase()}.`}));
 const combinations={
  "fire-water":"Uap Mendidih","fire-earth":"Lava Membara","fire-lightning":"Plasma","fire-wind":"Pusaran Api",
  "water-fire":"Gelombang Uap","water-earth":"Lumpur Arus","water-lightning":"Arus Bermuatan","water-wind":"Kabut Es",
  "lightning-fire":"Halilintar","lightning-water":"Petir Konduktor","lightning-earth":"Magnetisme","lightning-wind":"Kilat Badai",
  "earth-fire":"Batu Magma","earth-water":"Benteng Lumpur","earth-lightning":"Titan Magnetik","earth-wind":"Debu Badai",
  "wind-fire":"Angin Topan Api","wind-water":"Tsunami","wind-earth":"Badai Pasir","wind-lightning":"Tornado Petir"
 };
 const monsters=[
  {id:"slime",name:"Blue Slime",hp:38,damage:5,xp:14,color:"#42caff",size:13,speed:38,aggro:250},
  {id:"goblin",name:"Forest Goblin",hp:64,damage:8,xp:25,color:"#91d451",size:15,speed:48,aggro:290},
  {id:"boar",name:"Wild Boar",hp:82,damage:11,xp:34,color:"#b8794d",size:17,speed:62,aggro:230},
  {id:"wisp",name:"Shadow Wisp",hp:50,damage:9,xp:30,color:"#b57aff",size:12,speed:55,aggro:320},
  {id:"moss",name:"Moss Guardian",hp:145,damage:16,xp:70,color:"#4caa76",size:22,speed:28,aggro:360}
 ];
 window.GAME_DATA={elements,characters,combinations,monsters};
})();
