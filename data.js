/* The Jungle Throwdown 26 — datos de los WODs
   Fuente: posts de Instagram @the_jungle_throwdown y mini-briefings en vídeo.
   Todo el contenido vive aquí; app.js solo lo pinta. */

const CATS = [
  { id: "scaled", label: "Scaled", color: "#ff2fa4" },
  { id: "inter", label: "Intermedio", short: "Inter", color: "#ffd400" },
  { id: "rx", label: "RX", color: "#ed1c24" },
  { id: "master", label: "Master", color: "#ff7a00" }
];

/* Pesos de WOD 3 por categoría: [barra, mancuernas] de R1 a R4 */
const SANGUIJUELA_LOADS = {
  scaled: [["40/25", "2×15/10"], ["48/30", "2×17,5/12,5"], ["55/35", "2×22,5/15"], ["60/40", "2×25/17,5"]],
  inter:  [["50/35", "2×20/12,5"], ["60/40", "2×22,5/15"], ["70/45", "2×25/17,5"], ["80/50", "2×27,5/20"]],
  rx:     [["60/40", "2×22,5/15"], ["70/45", "2×25/17,5"], ["80/50", "2×27,5/20"], ["85/55", "2×30/22,5"]],
  master: [["50/35", "2×20/12,5"], ["60/40", "2×22,5/15"], ["70/45", "2×25/17,5"], ["80/50", "2×27,5/20"]]
};

/* WOD 4: devil press y thrusters por ronda; puntos de gimnásticos por ronda */
const TARANTULA = {
  scaled: {
    dp: [4, 4, 4],
    thr: [[21, 35, 25], [15, 43, 30], [9, 50, 35]],
    gym: [
      [["Knee to tummy", 1], ["Pull up", 2], ["T2B", 4]],
      [["Pull up", 1], ["T2B", 3], ["C2B", 6]],
      [["T2B", 1], ["C2B", 4], ["C2B @3", 8]]
    ]
  },
  inter: {
    dp: [4, 4, 4],
    thr: [[21, 43, 30], [15, 50, 35], [9, 60, 40]],
    gym: [
      [["T2B", 1], ["Pull up", 2], ["C2B", 4]],
      [["Pull up", 1], ["C2B", 3], ["BMU", 6]],
      [["C2B", 1], ["BMU", 4], ["RMU + BMU", 8]]
    ]
  },
  rx: {
    dp: [6, 8, 10],
    thr: [[21, 43, 30], [15, 50, 35], [9, 60, 40]],
    gym: [
      [["T2B", 1], ["C2B", 2], ["BMU", 5]],
      [["C2B", 1], ["BMU", 3], ["RMU + BMU", 7]],
      [["BMU", 1], ["RMU + BMU", 4], ["RMU + pullover", 9]]
    ]
  },
  master: {
    dp: [5, 5, 5],
    thr: [[21, 43, 30], [15, 50, 35], [9, 60, 40]],
    gym: [
      [["T2B", 1], ["C2B", 2], ["BMU", 4]],
      [["C2B", 1], ["BMU", 3], ["RMU + BMU", 6]],
      [["BMU", 1], ["RMU + BMU", 4], ["RMU + pullover", 8]]
    ]
  }
};

/* WOD 2: material por categoría (peso ♂/♀) */
const AJOLOTE_GEAR = {
  scaled: { barra: "40/25", kb: "1×24/16", db: "2×15/10" },
  inter:  { barra: "50/35", kb: "2×24/16", db: "2×22,5/15" },
  rx:     { barra: "60/40", kb: "2×24/16", db: "2×22,5/15" },
  master: { barra: "50/35", kb: "2×24/16", db: "2×22,5/15" }
};

/* WOD 5: esquema de reps */
const BUEY_SCHEME = [4, 6, 8, 10, 8, 6, 4];

const WODS = [
  /* ---------------------------------------------------------------- WOD 1 */
  {
    id: "caiman", num: 1, name: "El Caimán", tagline: "AMRAP 9'", youtube: "isoGtPZEKYU",
    poster(cat) {
      const worm = cat === "scaled" ? "Worm clean" : "Worm clean & jerk";
      return [
        { t: "small", text: "0 – 1': Load the bar" },
        { t: "big", text: "Then <b>AMRAP 9'</b>" },
        { t: "lines", items: [`7 ${worm}`, "7 Burpees over the worm @3", "5 Snatches @2"] },
        { t: "note", text: `Equipos con 2 ♀ harán 5 ${worm.toLowerCase()}` }
      ];
    },
    compare: [
      ["Worm", "7 clean", "7 clean & jerk", "7 clean & jerk", "7 clean & jerk"],
      ["Worm (equipos con 2 ♀)", "5 clean", "5 clean & jerk", "5 clean & jerk", "5 clean & jerk"],
      ["Burpees over the worm", "7 @3", "7 @3", "7 @3", "7 @3"],
      ["Snatches", "5 @2", "5 @2", "5 @2", "5 @2"],
      ["Peso de las barras", "Lo elige el equipo", "Lo elige el equipo", "Lo elige el equipo", "Lo elige el equipo"]
    ],
    briefing: [
      { h: "Cómo funciona", items: [
        "Salís desde la línea de salida. En el <b>minuto 0–1</b> montáis <b>dos barras</b>, una de chico y otra de chica, con el peso de los snatches de todo el WOD.",
        "<b>Antes de montarlas</b> le decís al juez el peso de cada barra. <b>Ya no se puede cambiar</b> durante el WOD.",
        { cats: ["scaled"], text: "Después, AMRAP 9': 7 <b>worm clean</b> (sin jerk), 7 burpees over the worm sincronizados los 3 y 5 snatches sincronizados de 2." },
        { cats: ["inter", "rx", "master"], text: "Después, AMRAP 9': 7 <b>worm clean & jerk</b>, 7 burpees over the worm sincronizados los 3 y 5 snatches sincronizados de 2." },
        "Burpee sincronizado: <b>pecho en el suelo</b> a la vez.",
        "Snatches con 2 chicos y 1 chica: los chicos se van relevando en su barra y <b>la chica hace todos</b> los suyos. Con 2 chicas y 1 chico, al revés: las chicas se relevan y <b>el chico hace todos</b>."
      ]},
      { h: "Puntuación", items: [
        "<b>Kilos totales levantados en los snatches</b>.",
        "<b>+2 kg por cada repetición</b> de worm y de burpee. Ejemplo: 4 rondas + 2 worm = 58 reps × 2 = <b>116 kg</b> extra.",
        "Desempate: más repeticiones totales de worm + burpees."
      ]},
      { h: "Jungle Joker", items: ["Se puede usar en este WOD. Sus reglas se explican en el briefing del viernes."] }
    ],
    tool: "caiman"
  },

  /* ---------------------------------------------------------------- WOD 2 */
  {
    id: "ajolote", num: 2, name: "El Ajolote", tagline: "For time · cap 11'", youtube: "fkUPtGzopjU",
    poster(cat) {
      const g = AJOLOTE_GEAR[cat];
      const gym = cat === "scaled" ? "(Share)" : "@2";
      const lunges = { scaled: 10, inter: 6, rx: 10, master: 8 }[cat];
      const finish = cat === "rx" ? "30 m Handstand walk"
        : cat === "master" ? "22,5 m Handstand walk"
        : "Sprint + 5 Burpee to wall target <small>(cada atleta)</small>";
      return [
        { t: "big", text: "<b>For time</b> (cap 11')" },
        { t: "lines", items: [
          "20 Front squat @3", `40 Toes to bar ${gym}`, "15 Shoulder to OVH @3", `30 HSPU ${gym}`,
          `${lunges} Lungesters @3`, "20 Wall climb ping pong", "5 Bear complex @3", finish
        ]},
        { t: "weights", text: `Bar: ${g.barra} · KB: ${g.kb} · DB: ${g.db}` }
      ];
    },
    compare: [
      ["Toes to bar", "40 share", "40 @2", "40 @2", "40 @2"],
      ["HSPU", "30 share", "30 @2", "30 @2", "30 @2"],
      ["Lungesters @3", "10", "6", "10", "8"],
      ["Final", "Sprint + 5 burpees c/u", "Sprint + 5 burpees c/u", "30 m handstand walk", "22,5 m handstand walk"],
      ["Barra", "40/25", "50/35", "60/40", "50/35"],
      ["Kettlebell", "1×24/16", "2×24/16", "2×24/16", "2×24/16"],
      ["Mancuernas", "2×15/10", "2×22,5/15", "2×22,5/15", "2×22,5/15"]
    ],
    briefing: [
      { h: "Material", items: [
        "En vuestra calle hay <b>una barra, 2 kettlebells y 2 mancuernas</b>, duplicado en peso de chico y de chica. Cada uno usa el peso de su género.",
        "Cada atleta elige su elemento, pero <b>los tres (barra, KB y DB) se usan a la vez</b>: uno con cada uno. Siempre mirando al público."
      ]},
      { h: "Cómo funciona", items: [
        "<b>Front squat, shoulder to overhead, lungesters y bear complex</b>: sincronizados los 3, cada uno con su elemento. El sincro es <b>arriba</b>.",
        { cats: ["inter", "rx", "master"], text: "<b>T2B y HSPU</b>: sincronizados de 2, con los relevos que queráis." },
        { cats: ["scaled"], text: "<b>T2B y HSPU</b>: individuales (share), con los relevos que queráis." },
        "<b>Wall climb ping pong</b>: uno sube y baja; el siguiente, que puede esperar tumbado, no sale hasta que el compañero toca el suelo con el pecho. Relevos libres, pero <b>nadie hace dos repeticiones seguidas</b>.",
        { cats: ["rx"], text: "<b>Final</b>: 30 m de handstand walk en tramos de <b>7,5 m unbroken</b> (4 tramos), repartidos como queráis." },
        { cats: ["master"], text: "<b>Final</b>: 22,5 m de handstand walk en tramos de <b>7,5 m unbroken</b> (3 tramos), repartidos como queráis." },
        { cats: ["scaled", "inter"], text: "<b>Final</b>: por relevos, cada atleta hace un sprint a la zona de maderas, <b>5 burpees tocando por encima de la marca</b>, vuelve y da el relevo." },
        "El WOD termina cuando <b>los 3 atletas</b> están de nuevo en la pastilla de salida."
      ]},
      { h: "¿Qué es un lungester?", items: [
        "Con el elemento en <b>front rack</b>: reverse lunge con una pierna y extender, reverse lunge con la otra y extender, y un <b>thruster</b>. Eso es <b>1 repetición</b>.",
        "Sincro: rodilla en el suelo en cada lunge y brazos extendidos arriba en el thruster."
      ]},
      { h: "Jungle Joker", items: ["Se puede usar en este WOD."] }
    ],
    tool: "ajolote"
  },

  /* ---------------------------------------------------------------- WOD 3 */
  {
    id: "sanguijuela", num: 3, name: "La Sanguijuela", tagline: "Work 2' · Rest 15\"", youtube: "g-QDkbYsm_w",
    poster(cat) {
      const L = SANGUIJUELA_LOADS[cat];
      const pts = [
        ["Single regular rope climb", "1 pt"],
        ["Single legless rope climb", "2 pts"],
        ["Synchro regular rope climb", "3 pts"]
      ];
      if (cat !== "scaled") pts.push(["Synchro legless rope climb", "4 pts"]);
      const blocks = [
        { t: "big", text: "<b>Work 2' – Rest 15\"</b>" },
        { t: "rounds", items: [
          ...L.map((l, i) => [`Round ${i + 1}`, `DT + RC ${l[0]} · DB ${l[1]}`]),
          ["Round 5", "Rest"],
          ["Round 6", "Choose your poison ☠️<br>7/5/3 Clean & jerk unbroken"]
        ]},
        { t: "h", text: "Points rope climb" },
        { t: "points", items: pts }
      ];
      if (cat !== "scaled") blocks.push({ t: "note", text: "Equipos con 2 ♀: legless ♂ + regular ♀ = 4 pts" });
      return blocks;
    },
    compare: [
      ...[0, 1, 2, 3].map(i => [`R${i + 1} barra · DB`, ...CATS.map(c => `${SANGUIJUELA_LOADS[c.id][i][0]} · ${SANGUIJUELA_LOADS[c.id][i][1]}`)]),
      ["Synchro legless (4 pts)", "No", "Sí", "Sí", "Sí"],
      ["Round 6", "7/5/3 C&J", "7/5/3 C&J", "7/5/3 C&J", "7/5/3 C&J"]
    ],
    briefing: [
      { h: "Rondas 1 a 4", items: [
        "Entran <b>2 equipos a pista cada 2'15\"</b> y se avanza de estación (pastilla) en estación.",
        "En cada ronda hacéis <b>1 DT</b>: 12 deadlift, 9 hang clean y 6 shoulder to overhead, con el peso de esa estación.",
        "<b>Dos atletas con barra</b> (siempre un chico y una chica) y <b>el tercero con 2 mancuernas</b> del peso de su género. Los del mismo género pueden intercambiarse barra y mancuernas.",
        "Todo <b>sincronizado los 3</b>, al final de cada movimiento (en el clean, al bloquear).",
        "Con el tiempo que sobra: <b>máximos puntos de rope climb</b>, con los relevos que queráis y mezclando opciones.",
        "Si no acabáis el DT, seguid sumando repeticiones: <b>cuentan para el desempate</b>. Al sonar la bocina se avanza igualmente."
      ]},
      { h: "Rope climb", items: [
        "Opción 1: un atleta sube con pinza → <b>1 punto</b>.",
        "Opción 2: un atleta sube legless → <b>2 puntos</b>.",
        "Opción 3: dos atletas sincronizados con pinza, uno en cada cuerda → <b>3 puntos</b>.",
        { cats: ["inter", "rx", "master"], text: "Opción 4: dos atletas sincronizados legless → <b>4 puntos</b>." },
        { cats: ["scaled"], text: "En Scaled <b>no existe la opción de 4 puntos</b>." },
        "Sincro válido: <b>coincidir al tocar arriba</b>. El que llega antes espera arriba (en legless, sin pinzar).",
        "Para bajar <b>siempre se puede pinzar</b>. Hay 2 cuerdas en cada calle."
      ]},
      { h: "Rondas 5 y 6", items: [
        "<b>Ronda 5</b> (2'): cargáis las dos barras, la de chico y la de chica.",
        "<b>Ronda 6, Choose your poison</b>: un atleta hace <b>7</b> clean & jerk unbroken, otro <b>5</b> y otro <b>3</b>, cada uno con el peso que elija.",
        "Orden obligado: el de 5 no empieza hasta que acaba el de 7, y luego el de 3. Solo hay 2 barras, así que seguramente tendréis que cambiar peso dentro de los 2'.",
        "Si alguien falla, puede bajar peso o puede hacer esas reps otro atleta, pero <b>todos tienen que hacer una opción</b>."
      ]},
      { h: "Puntuación", items: [
        "<b>WOD 3A</b>: puntos totales de rope climb. Desempate: repeticiones de DT.",
        "<b>WOD 3B</b>: kilos totales de la ronda 6 = peso × repeticiones de cada atleta.",
        "Los kilos de las chicas se multiplican por <b>1,4</b> antes de sumar.",
        "Quien no complete sus reps cuenta <b>0</b> (a los demás sí se les cuenta).",
        "Ejemplo: 100 kg × 7 = 700, 100 kg × 5 = 500, chica 100 kg × 3 × 1,4 = 420 → <b>1.620 kg</b>."
      ]},
      { h: "Jungle Joker", items: ["Solo vale para la <b>parte A</b> (rope climb), no para los clean & jerk."] }
    ],
    tool: "sanguijuela"
  },

  /* ---------------------------------------------------------------- WOD 4 */
  {
    id: "tarantula", num: 4, name: "La Tarántula", tagline: "3 × 3:15 · Rest 15\"", youtube: "v3n1unFwXKQ",
    poster(cat) {
      const T = TARANTULA[cat];
      const who = ["A", "B", "C"];
      const gymWho = ["Atl. A/B", "Atl. B/C", "All athletes"];
      const loader = ["Atl. C", "Atl. A", null];
      const blocks = [{ t: "big", text: "<b>3 rounds</b>: 3:15 work – 15\" rest" }];
      [0, 1, 2].forEach(r => {
        const [reps, m, f] = T.thr[r];
        const lines = [
          `Atl. ${who[r]}: ${T.dp[r]} Devil press + ${reps} Thrusters ${m}/${f}`,
          `${gymWho[r]}: max gym. points @2`
        ];
        if (loader[r]) lines.push(`${loader[r]}: load the bar → starts rotation`);
        blocks.push({ t: "h", text: `Round ${r + 1}` }, { t: "lines", small: true, items: lines });
      });
      blocks.push({ t: "h", text: "Gym points" }, {
        t: "rounds", items: T.gym.map((g, i) => [`R${i + 1}`, g.map(([n, p]) => `${n} = ${p}`).join(" · ")])
      });
      return blocks;
    },
    compare: [
      ["Devil press (R1-R2-R3)", ...CATS.map(c => TARANTULA[c.id].dp.join("-"))],
      ["Thrusters 21-15-9", ...CATS.map(c => TARANTULA[c.id].thr.map(t => `${t[1]}/${t[2]}`).join(" → "))],
      ...[0, 1, 2].map(r => [`Gym R${r + 1}`, ...CATS.map(c => TARANTULA[c.id].gym[r].map(([n, p]) => `${n} ${p}`).join(" · "))])
    ],
    briefing: [
      { h: "Antes de empezar", items: ["El equipo decide quién es el <b>atleta A</b>, el <b>B</b> y el <b>C</b>."] },
      { h: "Cómo funciona", items: [
        "3 rondas de <b>3:15</b> en formato AMRAP, con <b>15\"</b> de transición entre rondas.",
        "<b>Ronda 1</b>: suena la bocina y <b>A</b> hace el buy-in (devil press + thrusters). B y C esperan en la pastilla. Al acabar A, <b>A y B</b> van al rack a sumar puntos de gimnásticos. <b>C</b> carga la barra de la ronda 2 (con discos y cierres) y, al terminar, puede dar relevos en el rack.",
        "<b>Ronda 2</b>: <b>B</b> hace el buy-in; luego <b>B y C</b> a gimnásticos. <b>A</b> carga la barra de la ronda 3 y después releva.",
        "<b>Ronda 3</b>: <b>C</b> hace el buy-in más pesado. Como ya no hay barras que cargar, <b>los 3</b> van al rack con relevos libres.",
        "Regla: el buy-in lo hace cada ronda un atleta distinto, que empieza los gimnásticos con el que hará el siguiente buy-in."
      ]},
      { h: "Gimnásticos", items: [
        "Siempre <b>sincronizados de 2</b>.",
        "Podéis cambiar de movimiento y de pareja cuando queráis, pero <b>solo con los movimientos de esa ronda</b>.",
        "El objetivo es sumar el máximo de puntos."
      ]},
      { h: "Jungle Joker", items: ["Se puede usar en este WOD."] }
    ],
    tool: "tarantula"
  },

  /* ---------------------------------------------------------------- WOD 5 */
  {
    id: "buey", num: 5, name: "Buey solo bien se lame", tagline: "For time · cap 13'", youtube: "9xSDM943GvI",
    poster(cat) {
      const buyin = { scaled: 3, inter: 4, rx: 5, master: 4 }[cat];
      const du = { scaled: "20 DU or 50 simples", inter: "20 DU", rx: "25 DU (unbroken)", master: "25 DU (unbroken)" }[cat];
      const w = {
        scaled: "Bar: 40/25 · DB: 15/10 · KB: 24/16 · Worm hold",
        inter: "Bar: 50/35 · DB: 22,5/15 · KB: 32/24 · Worm hold",
        rx: "Bar: 60/40 · DB: 22,5/15 · KB: 32/24 · Worm hold",
        master: "Bar: 50/35 · DB: 22,5/15 · KB: 32/24 · Worm hold"
      }[cat];
      const moves = cat === "scaled"
        ? ["2 DB box step over", "KB swing", "Bar OVH squat", "1 Parallel bar traverses"]
        : ["2 DB box step over", "American KB swing", "Bar OVH squat", "Dips with parallel bar traverses"];
      return [
        { t: "big", text: "<b>For time</b> (cap 13')" },
        { t: "small", text: `<b>Buy-in</b> (once only): ${buyin} Worm thrusters` },
        { t: "small", text: `Every round starts with: ${du}` },
        { t: "big", text: "4-6-8-10-8-6-4 *" },
        { t: "lines", items: moves },
        { t: "note", text: "* Todos los movimientos han de ser unbroken; el atleta que rompa quedará eliminado" },
        { t: "weights", text: w }
      ];
    },
    compare: [
      ["Buy-in worm thrusters", "3", "4", "5", "4"],
      ["Comba cada ronda", "20 DU o 50 simples", "20 DU", "25 DU unbroken", "25 DU unbroken"],
      ["KB swing", "KB swing", "American", "American", "American"],
      ["Paralelas", "1 traverse", "Fondos + traverse", "Fondos + traverse", "Fondos + traverse"],
      ["Barra", "40/25", "50/35", "60/40", "50/35"],
      ["Mancuernas", "15/10", "22,5/15", "22,5/15", "22,5/15"],
      ["Kettlebell", "24/16", "32/24", "32/24", "32/24"]
    ],
    briefing: [
      { h: "Cómo funciona", items: [
        "El equipo carga el <b>worm</b> y hace el buy-in de worm thrusters (<b>solo una vez</b>).",
        "Después, <b>dos atletas aguantan el worm</b> sobre el hombro todo el WOD; no puede tocar el suelo. El tercero trabaja.",
        "Cada ronda empieza con la comba de vuestra categoría. Después, el atleta que queráis (el mismo u otro) hace las reps de los 4 ejercicios <b>en orden</b>.",
        "Relevos libres; los que no trabajan <b>siempre aguantan el worm</b>.",
        "Ejemplo: yo hago la comba y doy el relevo; mi compañero hace 4 box step over, 4 KB swing y 4 OHS, vuelve al worm y otro hace las 4 de paralelas, la comba siguiente y empieza las 6 de box step over…"
      ]},
      { h: "Unbroken = eliminado", items: [
        "Todas las series son <b>unbroken</b>: box step over sin soltar las mancuernas, KB sin soltar, OHS sin soltar y paralelas sin bajarse.",
        "Quien rompa (falla, no puede más o se equivoca) <b>queda eliminado</b>: a partir de ahí solo puede aguantar el worm.",
        "En la <b>comba no se elimina</b> aunque ponga unbroken.",
        "Si se eliminaran los 3, hasta el cap harán unos ejercicios de desempate que se explican el viernes."
      ]},
      { h: "Puntuación", items: [
        "Resultado: <b>tiempo</b>. Según la organización, el tiempo va justito.",
        "Si no acabáis: <b>repeticiones totales hechas unbroken</b> de los 4 ejercicios, incluidas las de la serie a medias si no se ha fallado.",
        "<b>No cuentan</b> la comba ni los thrusters del buy-in."
      ]},
      { h: "Jungle Joker", items: ["Es el último WOD: si no la habéis usado, <b>tiradla aquí</b>."] }
    ],
    tool: "buey"
  }
];
