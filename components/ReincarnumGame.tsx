"use client";

import { useEffect, useState } from "react";

type Choice={name:string;w:number;p:number;i:number};
type Level={title:string;era:string;goal:string;assets:string[];choices:Choice[];bg:string};
const LEVELS:Level[]=[
{title:"Перший шанс",era:"I · НАРОДЖЕННЯ ПЕРЕВАГИ",goal:"Знайди стартові активи й заклади перевагу раніше за інших.",assets:["Інстинкт","Рідкісний ресурс","Перша угода"],choices:[{name:"Накопичення",w:30,p:0,i:0},{name:"Особиста сила",w:0,p:25,i:0},{name:"Корисні зв’язки",w:0,p:0,i:20}],bg:"radial-gradient(circle at 50% 55%,#8d6c25 0 4%,transparent 18%),radial-gradient(circle at 50% 70%,#1f684e,transparent 45%),linear-gradient(#081513,#020504)"},
{title:"Капітал",era:"II · ЗАТОПЛЕНИЙ АРХІВ",goal:"Перетвори знання на власність і стабільний дохід.",assets:["Схема торгівлі","Таємний маршрут","Борг родини"],choices:[{name:"Торгова мережа",w:45,p:0,i:5},{name:"Ексклюзивне знання",w:20,p:18,i:0},{name:"Коло боржників",w:0,p:0,i:32}],bg:"radial-gradient(circle at 55% 55%,#38bed0 0 3%,transparent 18%),linear-gradient(160deg,#07222d,#06110f 55%,#020506)"},
{title:"Влада",era:"III · ЗАБУТИЙ ШПИЛЬ",goal:"Отримай важелі, які інші не можуть ігнорувати.",assets:["Авторитет","Силовий ресурс","Право рішення"],choices:[{name:"Особиста гвардія",w:0,p:40,i:0},{name:"Посада",w:12,p:0,i:30},{name:"Контроль ресурсу",w:30,p:20,i:0}],bg:"radial-gradient(circle at 50% 45%,#e4863d 0 4%,transparent 22%),linear-gradient(145deg,#32170e,#0f1110 48%,#030506)"},
{title:"Монополія",era:"IV · МІСТО МАЙБУТНЬОГО",goal:"Створи технологічну перевагу, яку складно повторити.",assets:["Алгоритм","Енергомережа","Патент"],choices:[{name:"Техномонополія",w:58,p:0,i:12},{name:"Автономна мережа",w:22,p:35,i:0},{name:"Платформа",w:20,p:0,i:38}],bg:"radial-gradient(circle at 50% 45%,#53d6ff 0 3%,transparent 20%),linear-gradient(150deg,#07182b,#07130f 62%,#020405)"},
{title:"Масштаб",era:"V · ПАЛАТА ВІЗЕРУНКІВ",goal:"Навчися переносити цінність через межі одного життя.",assets:["Капітал","Навичка","Репутація"],choices:[{name:"Династичний капітал",w:72,p:0,i:0},{name:"Ядро здібностей",w:0,p:50,i:0},{name:"Ім’я, що відкриває двері",w:12,p:0,i:48}],bg:"radial-gradient(circle at 50% 50%,#b783ff 0 4%,transparent 24%),linear-gradient(145deg,#25113b,#09140f 60%,#020405)"},
{title:"Вершина",era:"VI · ОСОБИСТА МЕТА",goal:"Закріпи багатство, могутність і вплив як основу своєї свободи.",assets:["Скарбниця","Абсолютний важіль","Незалежність"],choices:[{name:"Незліченне багатство",w:120,p:0,i:0},{name:"Неперевершена могутність",w:0,p:90,i:0},{name:"Невидимий вплив",w:30,p:0,i:85}],bg:"radial-gradient(circle at 50% 42%,#f2d887 0 3%,transparent 24%),radial-gradient(circle at 50% 70%,#2a7f5b,transparent 38%),linear-gradient(#15140d,#020504)"}
];

type Save={unlocked:number;done:number[];wealth:number;power:number;influence:number;traits:string[]};
const initial:Save={unlocked:1,done:[],wealth:0,power:0,influence:0,traits:[]};
const KEY="reincarnum-v4";

export default function ReincarnumGame(){
 const [started,setStarted]=useState(false),[idx,setIdx]=useState(0),[picked,setPicked]=useState<number[]>([]),[modal,setModal]=useState(false),[journal,setJournal]=useState(false),[save,setSave]=useState<Save>(initial);
 const L=LEVELS[idx];
 useEffect(()=>{try{const v=localStorage.getItem(KEY);if(v)setSave({...initial,...JSON.parse(v)})}catch{}},[]);
 useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify(save))}catch{}},[save]);
 useEffect(()=>setPicked([]),[idx]);
 const collect=(n:number)=>setPicked(v=>v.includes(n)?v:[...v,n]);
 const choose=(c:Choice)=>{const done=[...new Set([...save.done,idx+1])];setSave(s=>({...s,done,unlocked:Math.max(s.unlocked,Math.min(6,idx+2)),wealth:s.wealth+c.w,power:s.power+c.p,influence:s.influence+c.i,traits:[...s.traits,c.name]}));setModal(false);if(idx<5)setTimeout(()=>setIdx(v=>v+1),350)};
 const reset=()=>{setSave(initial);setIdx(0);setPicked([]);localStorage.removeItem(KEY)};
 if(!started)return <main className="start"><div className="halo"/><section><div className="sigil">✦</div><small>ШІСТЬ ЖИТТІВ · ОДНА ОСОБИСТА МЕТА</small><h1>REINCARNUM</h1><p>Ти не рятуєш світ і не руйнуєш систему. Ти живеш усередині неї та використовуєш кожне втілення, щоб накопичити багатство, могутність і вплив.</p><button onClick={()=>setStarted(true)}>ПОЧАТИ СХОДЖЕННЯ</button>{save.unlocked>1&&<button className="secondary" onClick={()=>{setIdx(save.unlocked-1);setStarted(true)}}>ПРОДОВЖИТИ · РІВЕНЬ {save.unlocked}</button>}</section></main>;
 return <main className="game" style={{background:L.bg}}>
  <div className="shade"/><header><div className="brand">✦ <b>REINCARNUM</b></div><div className="stats"><span>◆ {save.wealth}<small>БАГАТСТВО</small></span><span>▲ {save.power}<small>МОГУТНІСТЬ</small></span><span>◎ {save.influence}<small>ВПЛИВ</small></span></div><button className="menu" onClick={()=>setJournal(true)}>☰</button></header>
  <aside className="story"><small>{L.era}</small><h2>{L.title}</h2><p>{L.goal}</p></aside>
  <aside className="objective"><small>АКТИВИ РІВНЯ</small><b>{picked.length}/3</b><div className="bar"><i style={{width:`${picked.length/3*100}%`}}/></div><p>{picked.length===3?"Усе готово. Обери найвигідніший напрям.":"Збери три активи, щоб перейти до рішення."}</p></aside>
  <div className="orbs">{L.assets.map((a,n)=><button key={a} className={`orb o${n+1} ${picked.includes(n)?"done":""}`} onClick={()=>collect(n)}><strong>{picked.includes(n)?"✓":["Ⅰ","Ⅱ","Ⅲ"][n]}</strong><small>{a}</small></button>)}</div>
  <button className={`node ${picked.length===3?"ready":""}`} onClick={()=>picked.length===3&&setModal(true)}><span>◉</span><b>{picked.length===3?"ВИКОРИСТАТИ МОЖЛИВІСТЬ":"ВУЗОЛ МОЖЛИВОСТЕЙ"}</b><small>{picked.length===3?"Обери перевагу":"Спочатку збери активи"}</small></button>
  <nav>{LEVELS.map((x,n)=><button key={x.title} disabled={n+1>save.unlocked} className={`${n===idx?"active":""} ${save.done.includes(n+1)?"complete":""}`} onClick={()=>setIdx(n)}>{save.done.includes(n+1)?"✓":n+1}<small>{x.title}</small></button>)}</nav>
  {modal&&<div className="overlay"><section className="modal"><small>{idx===5?"ФІНАЛЬНИЙ ВИБІР":"ОБЕРИ ВИГОДУ"}</small><h2>{idx===5?"Якою буде твоя вершина?":"Закріпити перевагу"}</h2><div className="choices">{L.choices.map(c=><button key={c.name} onClick={()=>choose(c)}><strong>{c.name}</strong><span>◆ +{c.w} · ▲ +{c.p} · ◎ +{c.i}</span></button>)}</div><button className="link" onClick={()=>setModal(false)}>Повернутися</button></section></div>}
  {journal&&<div className="overlay"><section className="modal journal"><button className="close" onClick={()=>setJournal(false)}>×</button><small>ЖУРНАЛ СХОДЖЕННЯ</small><h2>Портфель життів</h2><div className="journalStats"><b>◆ {save.wealth}</b><b>▲ {save.power}</b><b>◎ {save.influence}</b></div><p>{save.traits.length?save.traits.join(" · "):"Переваг ще немає."}</p><button onClick={reset}>ПОЧАТИ ЗАНОВО</button></section></div>}
 </main>
}
