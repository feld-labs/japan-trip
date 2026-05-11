// ══════════════════════════════════════════════════
// JAPAN TRIP 2026 — DATA LAYER
// ══════════════════════════════════════════════════

export const mu = (lat, lng) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

export const FLIGHTS = [
  { id:"f1", dir:"Outbound", route:"AUS → HND", flight:"DL780", conf:"GXQWN5", depart:"May 4, 6:00 AM", arrive:"May 5, 2:15 PM" },
  { id:"f2", dir:"Return", route:"HND → DTW → AUS", flight:"DL274", conf:"E6TB2X", depart:"May 16, 6:25 PM", arrive:"May 16, 10:11 PM" },
];

export const LODGING = [
  { id:"l1", name:"InterContinental Tokyo", dates:"May 5–7", nights:2, addr:"26-32/F Shinagawa East One Tower, Tokyo", res:"49084055", ci:"On arrival", co:"12:00 PM", cost:870.87, pin:null, lat:35.6284, lng:139.7387 },
  { id:"l2", name:"Laforet Hakone Gora Yunosumika", dates:"May 7–8", nights:1, addr:"1320 Gora, Hakone-Machi, 250-0408", res:"6192608329", ci:"3:00 PM", co:"11:00 AM", cost:487.07, pin:"7266", lat:35.2477, lng:139.0644 },
  { id:"l3", name:"Keio Prelia Hotel Kyoto", dates:"May 8–12", nights:5, addr:"396 Gojokarasuma, Shimogyo, Kyoto", res:"73424837297491", ci:"3:00 PM", co:"11:00 AM", cost:null, pin:null, lat:34.9983, lng:135.7595 },
  { id:"l4", name:"Onomichi Daiichi Hotel", dates:"May 13–14", nights:1, addr:"4-7 Nishigosho cho, Onomichi, Hiroshima", res:"73424961802629", ci:"2:00 PM", co:"11:00 AM", cost:137.28, pin:null, lat:34.4093, lng:133.1955 },
  { id:"l5", name:"Villa Fontaine Grand Ariake", dates:"May 14–16", nights:2, addr:"2-1-5 Ariake, Koto City, Tokyo", res:"73422253204824", ci:"—", co:"—", cost:311.14, pin:null, lat:35.634, lng:139.792 },
];

export const MEALS = [
  { date:"5/7", meal:"Breakfast", spot:"Hotel or in town" },
  { date:"5/7", meal:"Lunch", spot:"On train" },
  { date:"5/7", meal:"Dinner", spot:"Hakone ryokan" },
  { date:"5/8", meal:"Lunch", spot:"Nishiki Market" },
  { date:"5/8", meal:"Dinner", spot:"Pontocho Alley" },
  { date:"5/10", meal:"Lunch", spot:"Omen Udon" },
  { date:"5/12", meal:"Breakfast", spot:"Micasadeco & Cafe, Osaka" },
];

export const DAYS = [
  { key:"5/4", d:"May 4", dow:"Mon", title:"Depart Austin", region:"Austin → Tokyo", th:"travel" },
  { key:"5/5", d:"May 5", dow:"Tue", title:"Arrive Tokyo", region:"Tokyo", th:"arrival" },
  { key:"5/6", d:"May 6", dow:"Wed", title:"Walking Tour", region:"Tokyo", th:"explore" },
  { key:"5/7", d:"May 7", dow:"Thu", title:"Hakone Ryokan", region:"Hakone", th:"relax" },
  { key:"5/8", d:"May 8", dow:"Fri", title:"Kyoto Arrival", region:"Kyoto", th:"travel" },
  { key:"5/9", d:"May 9", dow:"Sat", title:"Arashiyama", region:"Kyoto", th:"nature" },
  { key:"5/10", d:"May 10", dow:"Sun", title:"Higashiyama", region:"Kyoto", th:"temple" },
  { key:"5/11", d:"May 11", dow:"Mon", title:"Open Day", region:"Kyoto", th:"flex" },
  { key:"5/12", d:"May 12", dow:"Tue", title:"Osaka Trip", region:"Osaka", th:"food" },
  { key:"5/13", d:"May 13", dow:"Wed", title:"Hiroshima", region:"Hiroshima", th:"travel" },
  { key:"5/14", d:"May 14", dow:"Thu", title:"Shimanami Kaido", region:"Onomichi", th:"adventure" },
  { key:"5/15", d:"May 15", dow:"Fri", title:"Final Tokyo", region:"Tokyo", th:"flex" },
  { key:"5/16", d:"May 16", dow:"Sat", title:"Fly Home", region:"Tokyo → Austin", th:"travel" },
];

export const TH = {
  travel:{c:"#5B8DEF"}, arrival:{c:"#A78BFA"}, explore:{c:"#FBBF24"}, relax:{c:"#22D3EE"},
  nature:{c:"#34D399"}, temple:{c:"#F87171"}, food:{c:"#FB923C"}, adventure:{c:"#2DD4BF"}, flex:{c:"#9CA3AF"},
};

export const ACTIVITIES = [
  // ── 5/5 ARRIVE TOKYO ──
  {id:"a01",n:"Haneda Airport",dt:"5/5",t:"2:15 PM",dur:"",cost:"",tr:"",addr:"Haneda Airport",note:"DL780 lands.",lat:35.5494,lng:139.7798,ic:"✈️",s:"sched",city:"Tokyo"},
  {id:"a02",n:"InterContinental Check-in",dt:"5/5",t:"~4 PM",dur:"",cost:"",tr:"",addr:"Shinagawa East One Tower",note:"Res# 49084055",lat:35.6284,lng:139.7387,ic:"🏨",s:"sched",city:"Tokyo"},
  // ── 5/6 TOKYO WALKING TOUR ──
  {id:"a03",n:"Senso-ji / Asakusa",dt:"5/6",t:"Morning",dur:"1 hr",cost:"Free",tr:"First stop",addr:"2-3-1 Asakusa, Taito City",note:"Thunder Gate, Nakamise Street.",lat:35.7148,lng:139.7967,ic:"⛩️",s:"sched",city:"Tokyo",web:"https://www.senso-ji.jp/english/"},
  {id:"a04",n:"Akihabara",dt:"5/6",t:"",dur:"30 min",cost:"Free",tr:"JR — zero detour",addr:"Akihabara, Chiyoda City",note:"Electric Town — anime, gaming.",lat:35.6996,lng:139.7714,ic:"🎮",s:"sched",city:"Tokyo"},
  {id:"a05",n:"Meiji Jingu Shrine",dt:"5/6",t:"",dur:"45 min",cost:"Free",tr:"JR Yamanote (~20 min)",addr:"1-1 Yoyogikamizonocho, Shibuya",note:"Forested approach, massive torii.",lat:35.6764,lng:139.6993,ic:"⛩️",s:"sched",city:"Tokyo",web:"https://www.meijijingu.or.jp/en/"},
  {id:"a06",n:"Takeshita Street",dt:"5/6",t:"",dur:"30 min",cost:"Free",tr:"Steps from Meiji",addr:"1-chome Jingumae, Shibuya",note:"Pop culture, crepes, fashion.",lat:35.671,lng:139.7052,ic:"🛍️",s:"sched",city:"Tokyo"},
  {id:"a07",n:"Shibuya Crossing",dt:"5/6",t:"",dur:"Pass-by",cost:"Free",tr:"~15 min walk south",addr:"Udagawacho, Shibuya",note:"Tour finale. World's busiest.",lat:35.6595,lng:139.7006,ic:"🚶",s:"sched",city:"Tokyo"},
  // ── 5/7 HAKONE ──
  {id:"a08",n:"Check out InterContinental",dt:"5/7",t:"AM",dur:"",cost:"",tr:"",addr:"Shinagawa",note:"Out by 12pm.",lat:35.6284,lng:139.7387,ic:"🏨",s:"sched",city:"Tokyo"},
  {id:"a09",n:"Travel to Hakone",dt:"5/7",t:"",dur:"",cost:"",tr:"Romancecar or Shinkansen",addr:"Gora, Hakone",note:"PIN: 7266",lat:35.2477,lng:139.0644,ic:"🚅",s:"sched",city:"Hakone"},
  {id:"a10",n:"Laforet Ryokan",dt:"5/7",t:"3 PM",dur:"Overnight",cost:"$487",tr:"",addr:"Gora 1320, Hakone",note:"Full ryokan experience.",lat:35.2477,lng:139.0644,ic:"♨️",s:"sched",city:"Hakone"},
  // ── 5/8 KYOTO ARRIVAL ──
  {id:"a11",n:"Check out Hakone",dt:"5/8",t:"11 AM",dur:"",cost:"",tr:"To Odawara",addr:"Gora, Hakone",note:"",lat:35.2477,lng:139.0644,ic:"🏨",s:"sched",city:"Hakone"},
  {id:"a12",n:"Shinkansen to Kyoto",dt:"5/8",t:"~11:30",dur:"~2 hrs",cost:"~¥11k",tr:"Hikari/Kodama",addr:"Odawara Station",note:"Or JR Pass.",lat:35.2564,lng:139.1552,ic:"🚅",s:"sched",city:"Transit"},
  {id:"a13",n:"Arrive Kyoto",dt:"5/8",t:"~1:30 PM",dur:"",cost:"",tr:"",addr:"Kyoto Station",note:"1 subway stop to hotel.",lat:34.9858,lng:135.7588,ic:"🚅",s:"sched",city:"Kyoto"},
  {id:"a14",n:"Keio Prelia Check-in",dt:"5/8",t:"3 PM",dur:"",cost:"",tr:"",addr:"396 Gojokarasuma",note:"Res# 73424837297491. 5 nights.",lat:34.9983,lng:135.7595,ic:"🏨",s:"sched",city:"Kyoto"},
  {id:"a15",n:"Nishiki Market",dt:"5/8",t:"3:30 PM",dur:"90 min",cost:"Free",tr:"10 min walk N",addr:"Higashiuoyacho, Nakagyo",note:"Kyoto's Kitchen. Close 5-6pm.",lat:35.005,lng:135.7647,ic:"🍢",s:"sched",city:"Kyoto"},
  {id:"a16",n:"Teramachi Arcades",dt:"5/8",t:"5 PM",dur:"45 min",cost:"Free",tr:"Adjacent",addr:"Teramachi-dori",note:"Craft shops, souvenirs.",lat:35.005,lng:135.766,ic:"🛍️",s:"sched",city:"Kyoto"},
  {id:"a17",n:"Pontocho Dinner",dt:"5/8",t:"6 PM",dur:"90 min",cost:"",tr:"5 min walk",addr:"Kashiwayacho, Nakagyo",note:"Kawadoko terrace. Magical at sunset.",lat:35.0039,lng:135.771,ic:"🏮",s:"sched",city:"Kyoto"},
  {id:"a18",n:"Kamogawa River Walk",dt:"5/8",t:"7:30 PM",dur:"30 min",cost:"Free",tr:"",addr:"Kamogawa River",note:"Walk south to hotel.",lat:35.001,lng:135.77,ic:"🌙",s:"sched",city:"Kyoto"},
  // ── 5/9 ARASHIYAMA ──
  {id:"a19",n:"Depart Hotel",dt:"5/9",t:"7:45 AM",dur:"",cost:"",tr:"Hankyu (~30 min)",addr:"",note:"Leave by 8am.",lat:34.9983,lng:135.7595,ic:"🏨",s:"sched",city:"Kyoto"},
  {id:"a20",n:"Tenryu-ji Temple",dt:"5/9",t:"8:30 AM",dur:"60 min",cost:"¥800",tr:"",addr:"Saga Tenryuji 68",note:"Opens 8:30. Combo ticket.",lat:35.0158,lng:135.6738,ic:"⛩️",s:"sched",city:"Kyoto"},
  {id:"a21",n:"Bamboo Forest",dt:"5/9",t:"9:30 AM",dur:"30 min",cost:"Free",tr:"N gate Tenryu-ji",addr:"Sagaogurayama",note:"Quiet at 9:30am.",lat:35.0168,lng:135.6713,ic:"🎋",s:"sched",city:"Kyoto"},
  {id:"a22",n:"Mikami Shrine",dt:"5/9",t:"10 AM",dur:"10 min",cost:"Free",tr:"",addr:"10 Sagaogurayama",note:"Hair shrine.",lat:35.0177,lng:135.6697,ic:"⛩️",s:"sched",city:"Kyoto"},
  {id:"a23",n:"Nison-in Temple",dt:"5/9",t:"10:15",dur:"40 min",cost:"¥500",tr:"",addr:"27 Saganisonin",note:"Maple/cherry trees.",lat:35.0217,lng:135.6696,ic:"⛩️",s:"sched",city:"Kyoto"},
  {id:"a24",n:"Adashino Nembutsu-ji",dt:"5/9",t:"11 AM",dur:"45 min",cost:"¥500",tr:"",addr:"17 Sagatorimoto",note:"8,000 stone statues.",lat:35.027,lng:135.6656,ic:"⛩️",s:"sched",city:"Kyoto"},
  {id:"a25",n:"Sagano Railway",dt:"5/9",t:"12 PM",dur:"30 min",cost:"¥630",tr:"Torokko Stn",addr:"",note:"CLOSED WED. Book ahead.",lat:35.0279,lng:135.6494,ic:"🚂",s:"sched",city:"Kyoto"},
  {id:"a26",n:"Monkey Park",dt:"5/9",t:"1:30 PM",dur:"75 min",cost:"¥800",tr:"",addr:"Nakaoshitacho 61",note:"20-min uphill hike.",lat:35.0114,lng:135.6766,ic:"🐒",s:"sched",city:"Kyoto"},
  {id:"a27",n:"Kimono Forest",dt:"5/9",t:"3 PM",dur:"30 min",cost:"Free",tr:"",addr:"Randen Station",note:"Grab street food.",lat:35.0153,lng:135.6784,ic:"👘",s:"sched",city:"Kyoto"},
  {id:"a28",n:"Tenzan-no-yu Onsen",dt:"5/9",t:"4 PM",dur:"90 min",cost:"¥1,450",tr:"20 min walk E",addr:"55-4 Saganomiyanomotocho",note:"NO-TATTOO POLICY.",lat:35.014,lng:135.6933,ic:"♨️",s:"sched",city:"Kyoto"},
  // ── 5/10 HIGASHIYAMA ──
  {id:"a29",n:"Depart Hotel",dt:"5/10",t:"5:45 AM",dur:"",cost:"",tr:"Bus #206 or taxi",addr:"",note:"Early start.",lat:34.9983,lng:135.7595,ic:"🏨",s:"sched",city:"Kyoto"},
  {id:"a30",n:"Kiyomizu-dera",dt:"5/10",t:"6:15 AM",dur:"90 min",cost:"¥400",tr:"",addr:"1-294 Kiyomizu",note:"Opens 6am. Packed by 8am.",lat:34.9947,lng:135.7847,ic:"⛩️",s:"sched",city:"Kyoto",web:"https://www.kiyomizudera.or.jp/en/"},
  {id:"a31",n:"Yasaka Pagoda",dt:"5/10",t:"8 AM",dur:"30 min",cost:"Free",tr:"Walk downhill",addr:"Ninenzaka/Sannenzaka",note:"Interior Sat/Sun only.",lat:34.9986,lng:135.7792,ic:"🏯",s:"sched",city:"Kyoto"},
  {id:"a32",n:"Yasaka Shrine",dt:"5/10",t:"8:45 AM",dur:"20 min",cost:"Free",tr:"",addr:"625 Gionmachi",note:"Gion gateway. 24hrs.",lat:35.0037,lng:135.7786,ic:"⛩️",s:"sched",city:"Kyoto"},
  {id:"a33",n:"Nanzen-ji",dt:"5/10",t:"9:30 AM",dur:"75 min",cost:"¥500",tr:"25 min walk E",addr:"86 Nanzenji Fukuchicho",note:"Brick aqueduct — free.",lat:35.0114,lng:135.7945,ic:"⛩️",s:"sched",city:"Kyoto"},
  {id:"a34",n:"Philosopher's Path",dt:"5/10",t:"11 AM",dur:"30 min",cost:"Free",tr:"",addr:"Sakyo Ward",note:"2km canal walk.",lat:35.019,lng:135.794,ic:"🚶",s:"sched",city:"Kyoto"},
  {id:"a35",n:"Ginkaku-ji",dt:"5/10",t:"11:45",dur:"45 min",cost:"¥500",tr:"",addr:"2 Ginkakujicho",note:"Sand gardens, viewpoint.",lat:35.027,lng:135.7982,ic:"⛩️",s:"sched",city:"Kyoto",web:"https://www.shokoku-ji.jp/en/ginkakuji/"},
  {id:"a36",n:"Omen Udon Lunch",dt:"5/10",t:"12:45",dur:"60 min",cost:"",tr:"Bus #5/#17",addr:"74 Ishibashi-cho",note:"",lat:35.027,lng:135.794,ic:"🍜",s:"sched",city:"Kyoto"},
  {id:"a37",n:"Gion / Nishiki",dt:"5/10",t:"2 PM",dur:"",cost:"",tr:"Walk south",addr:"",note:"Free afternoon.",lat:35.0037,lng:135.7786,ic:"🛍️",s:"sched",city:"Kyoto"},
  // ── 5/12 OSAKA ──
  {id:"a38",n:"Train to Osaka",dt:"5/12",t:"~6 AM",dur:"",cost:"",tr:"JR/Hankyu (~30 min)",addr:"",note:"",lat:34.9858,lng:135.7588,ic:"🚅",s:"sched",city:"Kyoto"},
  {id:"a39",n:"Micasadeco Cafe",dt:"5/12",t:"~7:30",dur:"",cost:"",tr:"",addr:"Saiwaicho, Naniwa",note:"Breakfast.",lat:34.6585,lng:135.4958,ic:"☕",s:"sched",city:"Osaka"},
  {id:"a40",n:"Dotonbori",dt:"5/12",t:"",dur:"",cost:"",tr:"",addr:"Dotonbori",note:"Walk and eat.",lat:34.6687,lng:135.5025,ic:"🍢",s:"sched",city:"Osaka"},
  {id:"a41",n:"Dekasan Egg Sandwich",dt:"5/12",t:"",dur:"",cost:"",tr:"",addr:"Kawarayamachi, Chuo",note:"",lat:34.672,lng:135.505,ic:"🥪",s:"sched",city:"Osaka"},
  {id:"a42",n:"Tokito",dt:"5/12",t:"",dur:"",cost:"",tr:"",addr:"TBD",note:"Food stop.",lat:34.67,lng:135.50,ic:"🍽️",s:"sched",city:"Osaka"},
  {id:"a43",n:"Osaka Castle",dt:"5/12",t:"",dur:"",cost:"",tr:"",addr:"1-1 Osakajo",note:"",lat:34.6873,lng:135.5262,ic:"🏯",s:"sched",city:"Osaka"},
  // ── 5/13 HIROSHIMA ──
  {id:"a44",n:"Shinkansen to Hiroshima",dt:"5/13",t:"AM",dur:"",cost:"",tr:"Shinkansen",addr:"",note:"",lat:34.9858,lng:135.7588,ic:"🚅",s:"sched",city:"Kyoto"},
  {id:"a45",n:"Hiroshima Tour",dt:"5/13",t:"",dur:"",cost:"",tr:"",addr:"Hiroshima",note:"",lat:34.3853,lng:132.4553,ic:"🏙️",s:"sched",city:"Hiroshima"},
  {id:"a46",n:"Onomichi Hotel",dt:"5/13",t:"PM",dur:"",cost:"",tr:"JR",addr:"4-7 Nishigosho cho",note:"Res# 73424961802629",lat:34.4093,lng:133.1955,ic:"🏨",s:"sched",city:"Onomichi"},
  // ── 5/14 BIKE ──
  {id:"a47",n:"Shimanami Kaido",dt:"5/14",t:"AM",dur:"Full day",cost:"",tr:"",addr:"Onomichi → Imabari",note:"70km bike, 6 bridges.",lat:34.25,lng:133.08,ic:"🚲",s:"sched",city:"Onomichi"},
  {id:"a48",n:"Return to Tokyo",dt:"5/14",t:"PM",dur:"",cost:"",tr:"Shinkansen",addr:"",note:"",lat:35.634,lng:139.792,ic:"🚅",s:"sched",city:"Tokyo"},
  {id:"a49",n:"Villa Fontaine Check-in",dt:"5/14",t:"PM",dur:"",cost:"",tr:"",addr:"2-1-5 Ariake",note:"Res# 73422253204824",lat:35.634,lng:139.792,ic:"🏨",s:"sched",city:"Tokyo"},
  // ── 5/16 FLY HOME ──
  {id:"a50",n:"Haneda Depart",dt:"5/16",t:"6:25 PM",dur:"",cost:"",tr:"",addr:"HND",note:"DL274 / E6TB2X",lat:35.5494,lng:139.7798,ic:"✈️",s:"sched",city:"Tokyo"},

  // ══ UNSCHEDULED — TOKYO ══
  {id:"u01",n:"Asahi Beer Hall",dt:null,t:"",dur:"",cost:"À la carte",tr:"5 min Senso-ji",addr:"1-23-1 Azumabashi, Sumida",note:"Rooftop views. 11:30–10pm.",lat:35.7099,lng:139.8003,ic:"🍺",s:"unsched",city:"Tokyo",best:"5/6, 5/15",web:"https://www.asahibeer.co.jp/area/05supertavern/"},
  {id:"u02",n:"Imperial Palace",dt:null,t:"",dur:"",cost:"Free",tr:"",addr:"Chiyoda, Tokyo",note:"Grounds only.",lat:35.6851,lng:139.7528,ic:"🏯",s:"unsched",city:"Tokyo",best:"5/15",web:"https://sankan.kunaicho.go.jp/english/"},
  {id:"u03",n:"Shinjuku Gyoen",dt:null,t:"",dur:"",cost:"¥500",tr:"",addr:"Naitomachi, Shinjuku",note:"Closed Mon & Thu.",lat:35.6852,lng:139.7101,ic:"🌳",s:"unsched",city:"Tokyo",best:"5/15",web:"https://fng.or.jp/shinjuku/en/"},
  {id:"u04",n:"Golden Gai",dt:null,t:"",dur:"",cost:"Free",tr:"",addr:"Kabukicho, Shinjuku",note:"Tiny bars. NIGHT only.",lat:35.6941,lng:139.7048,ic:"🍶",s:"unsched",city:"Tokyo",best:"Evening"},
  {id:"u05",n:"Tokyo National Museum",dt:null,t:"",dur:"2+ hrs",cost:"¥1,000",tr:"",addr:"Uenokoen, Taito",note:"Japan's largest.",lat:35.7188,lng:139.7765,ic:"🏛️",s:"unsched",city:"Tokyo",best:"5/15",web:"https://www.tnm.jp/?lang=en"},
  {id:"u06",n:"Tokyo Tower",dt:null,t:"",dur:"",cost:"¥1,200",tr:"",addr:"Shibakoen, Minato",note:"Main deck.",lat:35.6586,lng:139.7454,ic:"🗼",s:"unsched",city:"Tokyo",best:"5/15",web:"https://www.tokyotower.co.jp/en/"},
  {id:"u07",n:"Tsukiji Market",dt:null,t:"",dur:"",cost:"Free",tr:"",addr:"Tsukiji, Chuo",note:"Street food.",lat:35.6648,lng:139.7703,ic:"🐟",s:"unsched",city:"Tokyo",best:"5/15",web:"https://www.tsukiji.or.jp/english/"},
  {id:"u08",n:"Benizuru Pancakes",dt:null,t:"",dur:"60-90 min",cost:"~¥1,500",tr:"5 min Senso-ji",addr:"2-1-11 Nishiasakusa",note:"CASH ONLY. Same-day 7am queue. 15 seats.",lat:35.7118,lng:139.7932,ic:"🥞",s:"unsched",city:"Tokyo",best:"5/6, 5/15",web:"https://www.instagram.com/benizuru_homemade_pancake"},
  {id:"u09",n:"Omoide Yokocho",dt:null,t:"",dur:"60-90 min",cost:"À la carte",tr:"Shinjuku W exit",addr:"Nishishinjuku",note:"Yakitori alley. 1940s. Pairs w/ Golden Gai.",lat:35.6938,lng:139.6989,ic:"🏮",s:"unsched",city:"Tokyo",best:"Evening"},
  {id:"u10",n:"Beer Hall Lion Ginza",dt:null,t:"",dur:"60-90 min",cost:"~¥3-4k",tr:"3 min Ginza Stn",addr:"7-9-20 Ginza, Chuo",note:"1934 Art Deco. Oldest beer hall.",lat:35.6691,lng:139.7632,ic:"🍺",s:"unsched",city:"Tokyo",best:"Any",web:"https://www.ginzalion.jp/shop/brand/beerhalllion/"},
  {id:"u11",n:"Odaiba",dt:null,t:"",dur:"",cost:"Free",tr:"30+ min",addr:"Minato",note:"Far island.",lat:35.6206,lng:139.7805,ic:"🏝️",s:"unsched",city:"Tokyo",best:"Skip"},
  {id:"u12",n:"Gotokuji Temple",dt:null,t:"",dur:"",cost:"Free",tr:"20+ min",addr:"Setagaya",note:"Lucky cat. Isolated.",lat:35.6488,lng:139.6475,ic:"🐱",s:"unsched",city:"Tokyo",best:"Skip"},

  // ══ UNSCHEDULED — KYOTO TEMPLES ══
  {id:"u13",n:"Fushimi Inari",dt:null,t:"",dur:"2-3 hrs",cost:"Free",tr:"",addr:"Fushimi, Kyoto",note:"10,000 torii. 24hrs.",lat:34.9677,lng:135.7792,ic:"⛩️",s:"unsched",city:"Kyoto",best:"5/11",web:"https://inari.jp/en/"},
  {id:"u14",n:"Sanjusangendo",dt:null,t:"",dur:"",cost:"¥600",tr:"",addr:"Higashiyama, Kyoto",note:"1,001 statues. ★4.7.",lat:34.9879,lng:135.7717,ic:"⛩️",s:"unsched",city:"Kyoto",best:"5/11",web:"https://www.sanjusangendo.jp/en/"},
  {id:"u15",n:"Tofuku-ji",dt:null,t:"",dur:"",cost:"¥500",tr:"",addr:"Higashiyama, Kyoto",note:"Zen gardens.",lat:34.976,lng:135.7738,ic:"⛩️",s:"unsched",city:"Kyoto",best:"5/11",web:"https://tofukuji.jp/english/"},
  {id:"u16",n:"To-ji Temple",dt:null,t:"",dur:"",cost:"Varies",tr:"",addr:"Minami Ward, Kyoto",note:"Oldest pagoda.",lat:34.9803,lng:135.7477,ic:"⛩️",s:"unsched",city:"Kyoto",best:"5/11",web:"https://toji.or.jp/en/"},
  {id:"u17",n:"Kinkaku-ji",dt:null,t:"",dur:"",cost:"¥500",tr:"Bus ~40 min",addr:"Kita Ward, Kyoto",note:"Golden Pavilion.",lat:35.0394,lng:135.7292,ic:"⛩️",s:"unsched",city:"Kyoto",best:"5/9, 5/11",web:"https://www.shokoku-ji.jp/en/kinkakuji/"},
  {id:"u18",n:"Ryoan-ji",dt:null,t:"",dur:"",cost:"¥500",tr:"20 min Kinkaku-ji",addr:"Ukyo, Kyoto",note:"Rock garden.",lat:35.0345,lng:135.7183,ic:"⛩️",s:"unsched",city:"Kyoto",best:"5/9, 5/11",web:"https://www.ryoanji.jp/eng/"},

  // ══ UNSCHEDULED — KYOTO RESTAURANTS ══
  {id:"r01",n:"Odai Sushi",dt:null,t:"",dur:"60 min",cost:"¥4k",tr:"Near Arashiyama",addr:"Ukyo, Kyoto",note:"7 seats. CASH. Closed Mon. ★4.8",lat:35.017,lng:135.6914,ic:"🍣",s:"unsched",city:"Kyoto",best:"5/9"},
  {id:"r02",n:"Wagyu Sukiyaki Chikarayama",dt:null,t:"",dur:"90 min",cost:"$$$",tr:"Shijo Kawaramachi",addr:"Shimogyo, Kyoto",note:"Reserve. ★4.9 (5,600 reviews).",lat:35.0023,lng:135.7695,ic:"🥩",s:"unsched",city:"Kyoto",best:"Evening"},
  {id:"r03",n:"Master's Dream House",dt:null,t:"",dur:"60-90 min",cost:"$$",tr:"Near Pontocho",addr:"Nakagyo, Kyoto",note:"Suntory beer hall. ★4.7",lat:35.006,lng:135.7703,ic:"🍺",s:"unsched",city:"Kyoto",best:"Evening",web:"https://www.suntory.co.jp/gourmet/shop/0X00897/"},
  {id:"r04",n:"Panel Cafe Pancakes",dt:null,t:"",dur:"60 min",cost:"$$",tr:"Gion area",addr:"Higashiyama, Kyoto",note:"Soufflé pancakes. ★3.6",lat:35.0051,lng:135.7726,ic:"🥞",s:"unsched",city:"Kyoto",best:"AM"},
  {id:"r05",n:"Sakura Cafe Hanon",dt:null,t:"",dur:"60 min",cost:"$$",tr:"Kawaramachi",addr:"Shimogyo, Kyoto",note:"Opens 8am. ★4.3",lat:35.0032,lng:135.7704,ic:"🥞",s:"unsched",city:"Kyoto",best:"AM"},
  {id:"r06",n:"Pancake Room",dt:null,t:"",dur:"45 min",cost:"$$",tr:"Kyoto Station",addr:"Kyoto Tower Sando B1",note:"Counter. ★4.2",lat:34.9876,lng:135.7593,ic:"🥞",s:"unsched",city:"Kyoto",best:"5/8"},
  {id:"r07",n:"Men-ya Takakura Nijo",dt:null,t:"",dur:"45 min",cost:"$$",tr:"Central",addr:"Nakagyo, Kyoto",note:"Michelin Bib Gourmand. ★4.1",lat:35.0136,lng:135.7625,ic:"🍜",s:"unsched",city:"Kyoto",best:"Any"},
  {id:"r08",n:"Hatoya — Arashiyama",dt:null,t:"",dur:"30 min",cost:"$",tr:"Main street",addr:"Ukyo, Kyoto",note:"Premium matcha. ★4.2",lat:35.014,lng:135.6789,ic:"🍵",s:"unsched",city:"Kyoto",best:"5/9"},
  {id:"r09",n:"Hatoya — Kiyomizu",dt:null,t:"",dur:"30 min",cost:"$",tr:"Ninenzaka",addr:"Higashiyama, Kyoto",note:"Best matcha. ★4.7",lat:34.9992,lng:135.7783,ic:"🍵",s:"unsched",city:"Kyoto",best:"5/10"},
  {id:"r10",n:"Kazariya Mochi",dt:null,t:"",dur:"30 min",cost:"$$",tr:"Imamiya Shrine",addr:"Kita Ward, Kyoto",note:"Charcoal mochi. ★4.5",lat:35.0452,lng:135.7428,ic:"🍡",s:"unsched",city:"Kyoto",best:"5/11"},
  {id:"r11",n:"ichiren Ramen",dt:null,t:"",dur:"45 min",cost:"~¥1k",tr:"Near Kiyomizu",addr:"Higashiyama, Kyoto",note:"Yuzu ramen. ★4.8",lat:34.9987,lng:135.778,ic:"🍜",s:"unsched",city:"Kyoto",best:"5/10"},
  {id:"r12",n:"Itsukichaya Pontocho",dt:null,t:"",dur:"90 min",cost:"$$$",tr:"Pontocho Alley",addr:"Nakagyo, Kyoto",note:"Kaiseki. Reserve. ★4.8",lat:35.0042,lng:135.771,ic:"🍽️",s:"unsched",city:"Kyoto",best:"5/8"},
  {id:"r13",n:"Tempura Gen",dt:null,t:"",dur:"45 min",cost:"~¥2k",tr:"N of Gion",addr:"Nakagyo, Kyoto",note:"Jumbo shrimp. ★4.9",lat:35.0085,lng:135.7712,ic:"🍤",s:"unsched",city:"Kyoto",best:"Any"},
  {id:"r14",n:"Chao Chao Gyoza",dt:null,t:"",dur:"45 min",cost:"$",tr:"Kawaramachi",addr:"Shimogyo, Kyoto",note:"Opens 2pm. ★4.5",lat:35.0028,lng:135.7695,ic:"🥟",s:"unsched",city:"Kyoto",best:"PM"},
  {id:"r15",n:"Dainoji Okonomiyaki",dt:null,t:"",dur:"60 min",cost:"$$",tr:"Near Kinkaku-ji",addr:"Kita Ward, Kyoto",note:"DIY. ★4.9",lat:35.0382,lng:135.7314,ic:"🥘",s:"unsched",city:"Kyoto",best:"5/9, 5/11"},
  {id:"r16",n:"Yakiniku enen",dt:null,t:"",dur:"90 min",cost:"$$$",tr:"Shijo Kawaramachi",addr:"Shimogyo, Kyoto",note:"Wagyu yakiniku. Reserve. ★4.8",lat:35.0027,lng:135.7664,ic:"🥩",s:"unsched",city:"Kyoto",best:"Evening"},
  {id:"r17",n:"Unagiya Segawa",dt:null,t:"",dur:"60 min",cost:"$$$",tr:"Central",addr:"Nakagyo, Kyoto",note:"Clay pot unagi. ★4.8",lat:35.0057,lng:135.757,ic:"🐟",s:"unsched",city:"Kyoto",best:"Any"},
  {id:"r18",n:"Kyo Unawa Unagi",dt:null,t:"",dur:"60 min",cost:"$$$",tr:"Central",addr:"Nakagyo, Kyoto",note:"Hitsumabushi. 10% reserve fee. ★4.5",lat:35.0043,lng:135.7636,ic:"🐟",s:"unsched",city:"Kyoto",best:"Any"},
  {id:"r19",n:"Nishiki Market KAI",dt:null,t:"",dur:"15 min",cost:"$",tr:"Inside Nishiki",addr:"Nakagyo, Kyoto",note:"Furikake shop. Free samples.",lat:35.0049,lng:135.766,ic:"🛒",s:"unsched",city:"Kyoto",best:"5/8"},
  {id:"r20",n:"Mensho Takamatsu",dt:null,t:"",dur:"45 min",cost:"$$",tr:"Central",addr:"Nakagyo, Kyoto",note:"Tsukemen. Elite noodles. ★4.2",lat:35.0063,lng:135.7608,ic:"🍜",s:"unsched",city:"Kyoto",best:"Any"},
  {id:"r21",n:"Wajoryomen Sugari",dt:null,t:"",dur:"45 min",cost:"$$",tr:"Hidden entrance",addr:"Nakagyo, Kyoto",note:"Wagyu ramen. 30-45 min wait. ★4.0",lat:35.0043,lng:135.7573,ic:"🍜",s:"unsched",city:"Kyoto",best:"Any"},
  {id:"r22",n:"Tiger Gyoza",dt:null,t:"",dur:"45 min",cost:"$$",tr:"Kawaramachi",addr:"Nakagyo, Kyoto",note:"Closed Tue. ★3.8",lat:35.0043,lng:135.7683,ic:"🥟",s:"unsched",city:"Kyoto",best:"Any"},
  {id:"r23",n:"Sukiyaki Kimura",dt:null,t:"",dur:"60 min",cost:"$$",tr:"Kawaramachi",addr:"Nakagyo, Kyoto",note:"DIY sukiyaki. Closed Mon. ★3.9",lat:35.0045,lng:135.7667,ic:"🥩",s:"unsched",city:"Kyoto",best:"Any"},
];

export const MAP_STYLES = [
  {elementType:"geometry",stylers:[{color:"#12121f"}]},
  {elementType:"labels.text.stroke",stylers:[{color:"#12121f"}]},
  {elementType:"labels.text.fill",stylers:[{color:"#6b7280"}]},
  {featureType:"road",elementType:"geometry",stylers:[{color:"#1e1e30"}]},
  {featureType:"water",elementType:"geometry",stylers:[{color:"#0a1628"}]},
  {featureType:"poi.park",elementType:"geometry",stylers:[{color:"#152015"}]},
  {featureType:"poi",elementType:"labels",stylers:[{visibility:"off"}]},
  {featureType:"transit",stylers:[{visibility:"off"}]},
];
