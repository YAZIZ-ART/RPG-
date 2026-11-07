/* Data karakter, elemen, senjata, dan kombinasi. Mudah dikembangkan. */
window.GAME_DATA = {
 elements:{
  fire:{name:"Api",icon:"🔥",color:"#ff713c",dark:"#7d251e"},
  water:{name:"Air",icon:"💧",color:"#42c9ff",dark:"#164c9a"},
  earth:{name:"Tanah",icon:"🪨",color:"#d6a36a",dark:"#70452b"},
  lightning:{name:"Listrik",icon:"⚡",color:"#ffe45a",dark:"#8c641d"},
  wind:{name:"Udara",icon:"🌀",color:"#69e4d0",dark:"#176b72"}
 },
 characters:[
  ["Akira","fire","Katana","🗡️"],["Seraphina","lightning","Rapier","⚔️"],["Varkas","earth","Longsword","🗡️"],["Evelyne","water","Tanto","🔪"],["Raiden","wind","Spear","🔱"],
  ["Amaya","wind","Naginata","⚔️"],["Chronos","earth","Halberd","⚒️"],["Nyxara","fire","Battle Axe","🪓"],["Tharion","lightning","War Hammer","🔨"],["Mirael","water","Mace","🔨"],
  ["Rurozora","water","Scythe","⚔️"],["Rindou","earth","Kusarigama","⛓️"],["Renji","lightning","Nunchaku","🥢"],["Elenara","wind","Bow","🏹"],["Darius","fire","Crossbow","🏹"],
  ["Zephyra","lightning","Chakram","☯️"],["Kaelthas","wind","Throwing Knives","🔪"],["Isolde","water","Trident","🔱"],["Sylvana","water","Staff","杖"],["Valdrik","earth","Shield","🛡️"]
 ].map((c,i)=>({id:i,name:c[0],element:c[1],weapon:c[2],weaponIcon:c[3],level:1})),
 combinations:{
  "fire-water":"Uap","fire-earth":"Lava","fire-lightning":"Plasma","fire-wind":"Pusaran Api",
  "lightning-fire":"Halilintar","lightning-water":"Air Bermuatan","lightning-earth":"Magnetisme","lightning-wind":"Kilat Ruang",
  "earth-fire":"Batu Panas","earth-water":"Tembok Batu","earth-lightning":"Titan Mekanik","earth-wind":"Langkah Gemuruh",
  "water-fire":"Gelombang Pasang","water-earth":"Lumpur","water-lightning":"Nadi Kehidupan","water-wind":"Es",
  "wind-fire":"Angin Topan","wind-water":"Tsunami","wind-earth":"Debu Silir","wind-lightning":"Tornado Petir"
 },
 monsters:[
  {name:"Blue Slime",hp:32,damage:5,xp:12,color:"#42caff",size:13,speed:35},
  {name:"Forest Goblin",hp:58,damage:8,xp:24,color:"#8fd34e",size:15,speed:48},
  {name:"Wild Boar",hp:78,damage:11,xp:32,color:"#a96c47",size:17,speed:62},
  {name:"Shadow Wisp",hp:46,damage:9,xp:28,color:"#b57aff",size:12,speed:55}
 }
};
