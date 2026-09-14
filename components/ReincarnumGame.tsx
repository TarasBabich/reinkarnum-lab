"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { coverArt, level1Art, level2Art, level3Art, level4Art, level5Art, level6Art } from "@/art/levelArt";

type StatKey = "wealth" | "power" | "influence";
type Reward = { wealth: number; power: number; influence: number };
type Node = { x: number; y: number; title: string; detail: string; reward: Reward; icon: string };
type Choice = { title: string; text: string; reward: Reward; icon: string };
type Level = {
  id: number; title: string; subtitle: string; art: string; accent: string; goal: string;
  intro: string; mechanic: string; nodes: Node[]; choices: Choice[];
};

type Snapshot = { level: number; wealth: number; power: number; influence: number };
type SaveData = { unlocked: number; completed: number[]; wealth: number; power: number; influence: number; legacy: string[]; history: Snapshot[] };
const ZERO: Reward = { wealth: 0, power: 0, influence: 0 };
const STORAGE = "reincarnum-v5-art-journey";


const LEVELS: Level[] = [
  {
    id: 1, title: "Розколоті простори", subtitle: "Світове дерево", art: level1Art, accent: "#f2cf78",
    goal: "Пройти гілку реальності й винести з неї першу особисту перевагу.",
    intro: "Перед тобою світ можливостей. Обирай ті, що дають найбільшу особисту перевагу, знижують твої витрати й підвищують ціну доступу для інших.",
    mechanic: "Рухайся вздовж нижньої платформи та активуй три золоті вузли.",
    nodes: [
      { x: 30, y: 66, title: "Золота сфера", detail: "Ти знаходиш ресурс, якого інші ще не помітили.", reward: { wealth: 12, power: 0, influence: 0 }, icon: "◆" },
      { x: 55, y: 55, title: "Високий перехід", detail: "Ти вчишся проходити шлях швидше й ризикувати точніше.", reward: { wealth: 0, power: 9, influence: 0 }, icon: "▲" },
      { x: 84, y: 37, title: "Брама життя", detail: "Перший контакт відкриває тобі дорогу, недоступну більшості.", reward: { wealth: 0, power: 0, influence: 8 }, icon: "◎" },
    ],
    choices: [
      { title: "Зберегти капітал", text: "Перетвори знахідки на стартовий фонд наступного життя.", reward: { wealth: 24, power: 0, influence: 0 }, icon: "◆" },
      { title: "Загартувати себе", text: "Зроби власні здібності головною перевагою.", reward: { wealth: 0, power: 18, influence: 0 }, icon: "▲" },
      { title: "Створити зв'язки", text: "Нехай інші відкривають для тебе двері.", reward: { wealth: 0, power: 0, influence: 16 }, icon: "◎" },
    ],
  },
  {
    id: 2, title: "Затонулий архів", subtitle: "Знання як актив", art: level2Art, accent: "#66e0ff",
    goal: "Знайти знання, яке можна перетворити на власність, дохід і перевагу.",
    intro: "Архів зберігає дані, маршрути, борги й секрети. Ти шукаєш знання, яке дає кращі рішення, унікальний доступ і довгострокову вигоду.",
    mechanic: "Досліди три затоплені секції. Кожна відкриває новий тип цінної інформації.",
    nodes: [
      { x: 23, y: 58, title: "Карта маршрутів", detail: "Старі торгові шляхи знову стають прибутковими.", reward: { wealth: 18, power: 0, influence: 2 }, icon: "⌁" },
      { x: 53, y: 49, title: "Заборонений каталог", detail: "Ти забираєш знання, яке дозволяє створити недоступний іншим продукт.", reward: { wealth: 10, power: 12, influence: 0 }, icon: "✧" },
      { x: 81, y: 45, title: "Книга боргів", detail: "Імена й обіцянки стають важелями.", reward: { wealth: 0, power: 0, influence: 16 }, icon: "§" },
    ],
    choices: [
      { title: "Торгова мережа", text: "Монетизуй маршрути та інформацію.", reward: { wealth: 36, power: 0, influence: 6 }, icon: "◇" },
      { title: "Ексклюзивний секрет", text: "Залиш найцінніше знання лише собі.", reward: { wealth: 16, power: 22, influence: 0 }, icon: "◈" },
      { title: "Мережа боржників", text: "Перетвори інформацію на довготривалий вплив.", reward: { wealth: 0, power: 0, influence: 30 }, icon: "◎" },
    ],
  },
  {
    id: 3, title: "Забутий шпиль", subtitle: "Сходження", art: level3Art, accent: "#ffbf72",
    goal: "Піднятися вище, ніж дозволяє стартова позиція, і закріпити важіль влади.",
    intro: "Шпиль має рівні доступу. Накопичуй ресурси, статус і компетентність, щоб підніматися вище й отримувати важелі, недоступні більшості.",
    mechanic: "Пройди три щаблі шпиля зліва направо: ресурс → право доступу → контроль позиції.",
    nodes: [
      { x: 31, y: 64, title: "Нижній щабель", detail: "Ти купуєш час і спорядження, щоб не залежати від випадку.", reward: { wealth: 8, power: 8, influence: 0 }, icon: "Ⅰ" },
      { x: 57, y: 50, title: "Середня брама", detail: "Ти отримуєш формальне право проходити туди, де інші чекають дозволу.", reward: { wealth: 0, power: 8, influence: 12 }, icon: "Ⅱ" },
      { x: 81, y: 39, title: "Верхній майданчик", detail: "Тепер частина рішень проходить через тебе.", reward: { wealth: 6, power: 12, influence: 12 }, icon: "Ⅲ" },
    ],
    choices: [
      { title: "Особиста сила", text: "Зроби себе важко усуваною фігурою.", reward: { wealth: 0, power: 34, influence: 0 }, icon: "▲" },
      { title: "Висока посада", text: "Займи місце, де твоє слово має вагу.", reward: { wealth: 8, power: 0, influence: 30 }, icon: "♜" },
      { title: "Контроль ресурсу", text: "Володій тим, без чого іншим важко діяти.", reward: { wealth: 26, power: 18, influence: 0 }, icon: "⬢" },
    ],
  },
  {
    id: 4, title: "Місто завтрашнього дня", subtitle: "Технологічна перевага", art: level4Art, accent: "#52d9ff",
    goal: "Перетворити технології міста на автономний прибуток���q�^