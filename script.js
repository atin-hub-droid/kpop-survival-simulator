/* RISE: K-POP SURVIVAL SIMULATOR - Client-side Engine
   - Full realism AI generation (100 trainees, ~20% foreign)
   - Player creation, stats panel, episode flow, missions, voting, ranking, eliminations
   - Save/Load via localStorage
   - Drop into your GitHub Pages site as /script.js
*/

/* ------------------ CONFIG ------------------ */
const TOTAL_TRAINEES = 100;           // total including player
const FOREIGN_PERCENT = 0.20;         // ~20% foreign
const DEBUT_SIZE = 9;                 // size of final debut group
const ELIM_PER_EPISODE = 10;          // how many dropped each elimination episode
const MAX_EPISODES = 10;              // overall episodes cap
const STORAGE_KEY = "rise_sim_save_v1";

/* ------------------ UTILITIES ------------------ */
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function clamp(v, a=0, b=100) { return Math.max(a, Math.min(b, v)); }
function uid(prefix="id") { return prefix + Math.random().toString(36).slice(2,9); }

/* ------------------ NAME POOLS (sample realistic names) ------------------ */
const NAME_POOLS = {
  korea: ["Jinwoo","Minjae","Seojun","Jihwan","Hyun","Daesung","Mingyu","Sion","Raon","Minsoo","Jiho","Sungjin"],
  japan: ["Yuto","Haruto","Riku","Kaito","Ren","Sota","Yuma","Takumi","Kazuki","Daiki"],
  china: ["Wang Rui","Li Wei","Zhang Lin","Chen Yu","Liu Hao","Xu Feng","Hao Jun"],
  philippines: ["Frostbite","Miguel","Juan","Luis","Rico","Dante","Mark","Ethan","Carlos"],
  usa: ["Jayden","Michael","Ethan","Aiden","Noah","Liam","Lucas","Chris","Dmitri"],
  thailand: ["Nattapong","Kong","Tan","Phuwadon","Pawin","Chai"],
  vietnam: ["Minh","An","Bao","Khanh","Huy","Duc"]
};

/* ------------------ PERSONALITY & TAGS ------------------ */
const PERSONALITY_TAGS = [
  "hardworking", "mysterious", "charismatic", "playful", "quiet-ace", "dark-horse",
  "producer-lean", "dance-prodigy", "vocal-prodigy", "variety-star", "visual-prince"
];

/* ------------------ TRAINEE MODEL ------------------ */
function createTrainee(opts = {}) {
  const {
    seedName, nationality="Korea", age=randInt(15,22), isPlayer=false
  } = opts;

  let name;
  if (seedName) name = seedName;
  else {
    const pool = NAME_POOLS[nationality.toLowerCase()] || [].concat(...Object.values(NAME_POOLS));
    name = pick(pool) + (randInt(1,999));
  }

  // Base profile and stat distribution influenced by a personality tag
  const tag = pick(PERSONALITY_TAGS);
  // Stats baseline random
  let vocal = randInt(40,90);
  let dance = randInt(40,90);
  let rap = randInt(30,85);
  let visual = randInt(40,95);
  let stagePresence = randInt(40,90);
  let popularity = randInt(20,60);
  let stamina = randInt(50,95);

  // Personality bias
  if (tag.includes("vocal")) vocal = clamp(vocal + randInt(5,15));
  if (tag.includes("dance") || tag.includes("prod")) dance = clamp(dance + randInt(5,15));
  if (tag.includes("visual")) visual = clamp(visual + randInt(5,20));
  if (tag.includes("charismatic") || tag.includes("variety")) stagePresence = clamp(stagePresence + randInt(5,15));
  if (tag.includes("dark-horse")) { popularity = clamp(popularity - randInt(0,10)); vocal = clamp(vocal + randInt(0,5)); }

  return {
    id: uid("t"),
    name,
    nationality,
    age,
    tag,
    vocal,
    dance,
    rap,
    visual,
    stagePresence,
    popularity,
    stamina,
    isPlayer: !!isPlayer,
    eliminated: false,
    notes: `${tag} trainee`,
    // For relationships:
    rivalId: null,
    allies: []
  };
}

/* ------------------ GLOBAL GAME STATE ------------------ */
let GAME = {
  player: null,
  trainees: [],    // includes player object inside
  episode: 0,
  history: [],
  settings: {
    total: TOTAL_TRAINEES,
    debutSize: DEBUT_SIZE
  }
};

/* ------------------ SAVE / LOAD ------------------ */
function saveGame() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(GAME));
  showMessage("Game saved.");
}
function loadGame() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return false;
  try {
    GAME = JSON.parse(data);
    showMessage("Game loaded from local storage.");
    renderMainMenu();
    return true;
  } catch (e) {
    console.error(e);
    showMessage("Failed to load saved game.");
    return false;
  }
}
function clearSave() {
  localStorage.removeItem(STORAGE_KEY);
  showMessage("Save cleared.");
}

/* ------------------ UI HELPERS ------------------ */
const container = document.getElementById("game-container");
function showMessage(msg, delay=1800) {
  const el = document.createElement("div");
  el.className = "sys-msg";
  el.innerText = msg;
  container.prepend(el);
  setTimeout(()=> el.remove(), delay);
}
function renderStatsPanel() {
  // Show player stats and top leaderboard snapshot
  const player = GAME.player;
  const top5 = getRanking().slice(0,6);
  let html = `<div class="panel"><h3>Your Trainee</h3>`;
  if (!player) {
    html += `<p>No player yet.</p></div>`;
  } else {
    html += `<p><strong>${player.name}</strong> (${player.nationality}, ${player.age})</p>`;
    html += `<div class="stats-grid">
      <div>Vocal: ${player.vocal}</div>
      <div>Dance: ${player.dance}</div>
      <div>Rap: ${player.rap}</div>
      <div>Visual: ${player.visual}</div>
      <div>Stage: ${player.stagePresence}</div>
      <div>Pop: ${player.popularity}</div>
      </div>`;
    html += `</div>`;
  }
  html += `<div class="panel"><h3>Top Trainees</h3><ol>`;
  for (const t of top5) {
    html += `<li>${t.name} (${t.nationality}) — Pop:${t.popularity} | Vocal:${t.vocal}</li>`;
  }
  html += `</ol></div>`;
  return html;
}

/* ------------------ INITIAL UI / START ------------------ */
function renderMainMenu() {
  container.innerHTML = `
    <header><h2>RISE: K-POP SURVIVAL SIMULATOR</h2></header>
    <div class="main-grid">
      ${renderStatsPanel()}
      <div class="panel">
        <h3>Menu</h3>
        <div><button onclick="startNewGame()">Start New Game</button>
        <button onclick="continueGame()">Continue</button>
        <button onclick="saveGame()">Save</button>
        <button onclick="clearSave()">Clear Save</button></div>
        <hr/>
        <p>Episode: ${GAME.episode} / ${MAX_EPISODES}</p>
        <div id="main-actions"></div>
      </div>
    </div>
    <div style="margin-top:12px;">
      <small>Tip: Use Save to keep progress in this browser.</small>
    </div>
  `;
  if (GAME.player) {
    document.getElementById("main-actions").innerHTML = `
      <button onclick="startEpisode()">Start Episode ${GAME.episode + 1}</button>
      <button onclick="showTrainees()">View Trainees</button>
    `;
  } else {
    document.getElementById("main-actions").innerHTML = `
      <p>Create a player to begin.</p>
    `;
  }
}

/* ------------------ GAME SETUP: Generate 100 AIs ------------------ */
function generateAISet(playerSeed) {
  const trainees = [];
  // Decide how many foreign among non-player trainees
  const total = GAME.settings.total;
  const foreignCount = Math.round((total - 1) * FOREIGN_PERCENT);

  // Basic nationality distribution pool
  const nationalityPools = [
    {code:"korea", weight: 60},
    {code:"japan", weight: 10},
    {code:"china", weight: 8},
    {code:"philippines", weight: 4},
    {code:"usa", weight: 6},
    {code:"thailand", weight: 4},
    {code:"vietnam", weight: 3},
    {code:"other", weight:5}
  ];

  function chooseNationality(isForeign=false) {
    if (!isForeign) return "korea"; // bias a lot to korea for realism
    // choose among foreign pools
    const flat = ["japan","china","philippines","usa","thailand","vietnam"];
    return pick(flat);
  }

  // Create player
  if (playerSeed) {
    const player = createTrainee({
      seedName: playerSeed.name,
      nationality: playerSeed.nationality,
      age: playerSeed.age,
      isPlayer:true
    });
    player.isPlayer = true;
    player.notes = "You";
    trainees.push(player);
    GAME.player = player;
  }

  // build list of AIs
  let created = trainees.length;
  // first create foreign ones
  for (let i=0;i<foreignCount;i++) {
    const nat = chooseNationality(true);
    trainees.push(createTrainee({nationality: nat}));
    created++;
  }
  // fill remaining with typically Korean trainees
  while (created < total) {
    trainees.push(createTrainee({nationality: "korea"}));
    created++;
  }

  // Shuffle trainees
  for (let i = trainees.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [trainees[i], trainees[j]] = [trainees[j], trainees[i]];
  }

  // Assign rivalry and allies randomly (simple)
  for (const t of trainees) {
    let r;
    do { r = pick(trainees); } while (r.id === t.id);
    t.rivalId = r.id;
    t.allies = [ pick(trainees).id, pick(trainees).id ];
  }

  GAME.trainees = trainees;
}

/* ------------------ RANKING / VOTING / ELIM ------------------ */
function getRanking() {
  // ranking by popularity + weighted skill
  return GAME.trainees
    .filter(t => !t.eliminated)
    .sort((a,b) => {
      const aScore = a.popularity + 0.4*a.vocal + 0.35*a.dance + 0.2*a.stagePresence;
      const bScore = b.popularity + 0.4*b.vocal + 0.35*b.dance + 0.2*b.stagePresence;
      return bScore - aScore;
    });
}

function simulateVotingAndUpdatePopularity() {
  // Simulate global viewer votes that change popularity a bit
  for (const t of GAME.trainees) {
    if (t.eliminated) continue;
    // Base random bump influenced by stagePresence and visual
    const bump = Math.round((t.stagePresence*0.02) + (t.visual*0.01) + (Math.random()*5 - 2));
    t.popularity = clamp(t.popularity + bump);
  }
}

/* ------------------ EPISODE FLOW ------------------ */
function startNewGame() {
  // ask player for details
  container.innerHTML = `
    <h3>Create Your Trainee</h3>
    <label>Name: <input id="pl_name" placeholder="Your name"></label><br/>
    <label>Age: <input id="pl_age" type="number" value="18" min="15" max="28"></label><br/>
    <label>Nationality: <input id="pl_nat" placeholder="e.g. Filipino"></label><br/>
    <label>Company (optional): <input id="pl_comp" placeholder="Independent"></label><br/><br/>
    <button onclick="submitCreatePlayer()">Create & Generate Competition</button>
    <button onclick="renderMainMenu()">Cancel</button>
  `;
}

function submitCreatePlayer() {
  const name = document.getElementById("pl_name").value.trim();
  const age = parseInt(document.getElementById("pl_age").value,10) || 18;
  const nat = document.getElementById("pl_nat").value.trim() || "Korea";
  if (!name) { alert("Enter a name."); return; }

  // Reset game state
  GAME = { player: null, trainees: [], episode: 0, history: [], settings: GAME.settings };
  generateAISet({ name, nationality: nat, age });
  GAME.episode = 0;

  showMessage("Competition generated with " + GAME.trainees.length + " trainees.");
  renderMainMenu();
  saveGame();
}

function continueGame() {
  if (!GAME.player) {
    // try load from storage
    const ok = loadGame();
    if (!ok) {
      showMessage("No saved game found. Start a new one.");
    }
  } else {
    renderMainMenu();
  }
}

function startEpisode() {
  if (GAME.episode >= MAX_EPISODES) {
    showMessage("Max episodes reached.");
    return;
  }
  GAME.episode++;
  renderEpisodeIntro();
}

/* Episode intro and mission selection */
function renderEpisodeIntro() {
  const ep = GAME.episode;
  const html = `
    <div class="panel"><h3>Episode ${ep}</h3>
      <p>Welcome to Episode ${ep}. Missions will test your skills. Choose your focus for this episode:</p>
      <button onclick="chooseMission('vocal')">Vocal Mission</button>
      <button onclick="chooseMission('dance')">Dance Mission</button>
      <button onclick="chooseMission('variety')">Variety/Presence Mission</button>
      <button onclick="chooseMission('allround')">All-round Mission</button>
    </div>
  `;
  container.innerHTML = html + renderStatsPanel();
}

function chooseMission(type) {
  // Simulate mission: your player choice affects their stat improvements and team assignment
  const player = GAME.player;
  const msg = { vocal: "Vocal Focus", dance: "Dance Focus", variety: "Presence Focus", allround: "All-round" }[type];
  // Player training outcome influenced by current stats
  let journal = `You chose: ${msg}. `;

  // small stat changes
  if (type === "vocal") {
    const gain = randInt(2,6) + Math.floor(player.vocal/50);
    player.vocal = clamp(player.vocal + gain);
    player.stamina = clamp(player.stamina - randInt(0,3));
    journal += `Vocal +${gain}.`;
  } else if (type === "dance") {
    const gain = randInt(2,6) + Math.floor(player.stamina/40);
    player.dance = clamp(player.dance + gain);
    player.stamina = clamp(player.stamina - randInt(1,5));
    journal += `Dance +${gain}.`;
  } else if (type === "variety") {
    const gain = randInt(2,5);
    player.stagePresence = clamp(player.stagePresence + gain);
    player.popularity = clamp(player.popularity + Math.round(gain/2));
    journal += `StagePresence +${gain}, Popularity +${Math.round(gain/2)}.`;
  } else {
    const g1 = randInt(1,4), g2 = randInt(1,4);
    player.vocal = clamp(player.vocal + g1);
    player.dance = clamp(player.dance + g2);
    journal += `Vocal +${g1}, Dance +${g2}.`;
  }

  // Simulate AI training progress (random small improvements)
  for (const t of GAME.trainees) {
    if (t.eliminated) continue;
    const r = randInt(0,2);
    if (r===0) t.vocal = clamp(t.vocal + randInt(0,2));
    if (r===1) t.dance = clamp(t.dance + randInt(0,2));
    t.popularity = clamp(t.popularity + Math.round((t.stagePresence - 50)/50) + randInt(-1,2));
  }

  // Chance for rival interference
  maybeRivalEvent();

  // After training - do a short team stage simulation and voting
  container.innerHTML = `<div class="panel"><h3>Episode ${GAME.episode} Report</h3><p>${journal}</p>
    <p>Now your team performs on stage for the live voting simulation.</p>
    <button onclick="runStageSimulation()">Run Stage Simulation</button></div>` + renderStatsPanel();
}

/* Rival interference lightly affects popularity or stamina */
function maybeRivalEvent() {
  // pick rival
  const player = GAME.player;
  const rival = pick(GAME.trainees.filter(t => t.id !== player.id));
  if (Math.random() < 0.25) {
    // rival small sabotage attempt
    const impact = randInt(-6,2);
    player.popularity = clamp(player.popularity + impact);
    GAME.history.push({type:"rival", text:`${rival.name} caused a small scandal affecting your popularity (${impact}).`});
  }
}

/* Stage simulation and voting */
function runStageSimulation() {
  // Evaluate each trainee's stage performance score (weighted)
  for (const t of GAME.trainees) {
    if (t.eliminated) continue;
    // stageScore = weighted sum + noise
    const score = Math.round(
      0.35 * t.vocal +
      0.30 * t.dance +
      0.15 * t.stagePresence +
      0.10 * t.visual +
      0.10 * t.popularity
    ) + randInt(-5,8);
    // convert to a popularity change
    const popChange = Math.round((score - 70) / 10) + randInt(-2,3);
    t.popularity = clamp(t.popularity + popChange);
    // stamina dips
    t.stamina = clamp(t.stamina - randInt(1,6));
    // small improv for winners
    if (score > 95) {
      t.vocal = clamp(t.vocal + 1);
      t.dance = clamp(t.dance + 1);
    }
  }

  // Simulate global voting
  simulateVotingAndUpdatePopularity();

  // Recompute ranking and display results
  const ranking = getRanking();
  let html = `<div class="panel"><h3>Episode ${GAME.episode} Results</h3>`;
  html += `<p>Top 10 Trainees This Episode:</p><ol>`;
  for (let i=0;i<10;i++) {
    const r = ranking[i];
    html += `<li>${r.name} (${r.nationality}) — Pop:${r.popularity} | V:${r.vocal} D:${r.dance}</li>`;
  }
  html += `</ol>`;
  html += `<button onclick="resolveEliminations()">Proceed to Elimination</button>`;
  html += `</div>`;
  container.innerHTML = html + renderStatsPanel();
}

/* Elimination logic */
function resolveEliminations() {
  // Eliminate bottom ELIM_PER_EPISODE trainees by ranking
  const ranking = getRanking();
  const toEliminate = ranking.slice(-ELIM_PER_EPISODE);
  for (const t of toEliminate) {
    t.eliminated = true;
  }
  GAME.history.push({type:"elim", text:`Episode ${GAME.episode}: Eliminated ${toEliminate.length} trainees.`});
  showEliminationScreen(toEliminate);
}

function showEliminationScreen(elims) {
  let html = `<div class="panel"><h3>Elimination Results - Episode ${GAME.episode}</h3>`;
  html += `<p>${elims.length} trainees were eliminated:</p><ul>`;
  for (const e of elims) {
    html += `<li>${e.name} (${e.nationality}) — Final Pop:${e.popularity}</li>`;
  }
  html += `</ul>`;
  // Check for final debut condition
  const remaining = GAME.trainees.filter(t => !t.eliminated);
  if (remaining.length <= GAME.settings.debutSize) {
    html += `<p>Remaining trainees equal to debut size. The final group is formed.</p>`;
    html += `<button onclick="finalizeDebut()">See Final Debut</button>`;
  } else {
    html += `<p>${remaining.length} trainees remain.</p>`;
    html += `<button onclick="postElimSummary()">Continue</button>`;
  }
  html += `</div>`;
  container.innerHTML = html + renderStatsPanel();
  saveGame();
}

function postElimSummary() {
  // small rewards for survivors: slight popularity bump
  for (const t of GAME.trainees) {
    if (!t.eliminated) {
      t.popularity = clamp(t.popularity + randInt(0,3));
    }
  }
  showMessage(`Episode ${GAME.episode} complete.`);
  renderMainMenu();
}

/* Finalize debut when remaining == debut size */
function finalizeDebut() {
  const final = getRanking().slice(0, GAME.settings.debutSize);
  let html = `<div class="panel"><h3>FINAL DEBUT GROUP</h3><ol>`;
  for (const f of final) {
    html += `<li>${f.name} (${f.nationality}) — Pop:${f.popularity} | V:${f.vocal}</li>`;
  }
  html += `</ol><p>Congratulations!</p></div>`;
  container.innerHTML = html;
  GAME.history.push({type:"final", text:"Debut group selected."});
  clearSave();
}

/* ------------------ AUX VIEWS ------------------ */
function showTrainees() {
  const list = GAME.trainees;
  let html = `<div class="panel"><h3>All Trainees (${list.length})</h3><table class="trainee-table"><thead><tr><th></th><th>Name</th><th>Nat</th><th>V</th><th>D</th><th>R</th><th>Stage</th><th>Pop</th><th>Notes</th></tr></thead><tbody>`;
  for (const t of list) {
    html += `<tr class="${t.eliminated ? "elim-row" : ""}">
      <td>${t.isPlayer ? "<strong>You</strong>":""}</td>
      <td>${t.name}</td>
      <td>${t.nationality}</td>
      <td>${t.vocal}</td>
      <td>${t.dance}</td>
      <td>${t.rap}</td>
      <td>${t.stagePresence}</td>
      <td>${t.popularity}</td>
      <td>${t.notes}</td>
    </tr>`;
  }
  html += `</tbody></table><button onclick="renderMainMenu()">Back</button></div>`;
  container.innerHTML = html;
}

/* ------------------ Initialize (hook to Start btn) ------------------ */
document.getElementById("startBtn").addEventListener("click", ()=> {
  // load from storage if available
  const ok = loadGame();
  if (!ok) {
    renderMainMenu();
  } else {
    // if loaded, just show main menu
    renderMainMenu();
  }
});

/* ------------------ Basic Styles Injection (so you don't have to edit CSS) ------------------ */
(function injectStyles(){
  const css = `
    .panel{ background:#121217; border:1px solid #333; padding:12px; margin:8px; border-radius:8px; color:#e9eefb; text-align:left;}
    .main-grid{ display:grid; grid-template-columns: 320px 1fr; gap:12px; align-items:start;}
    .panel h3{ color:#8fb0ff; margin-top:0;}
    .stats-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:6px; margin-top:8px; }
    .trainee-table{ width:100%; border-collapse:collapse; color:#e9eefb;}
    .trainee-table th, .trainee-table td{ border:1px solid #222; padding:6px; font-size:12px;}
    .elim-row{ opacity:0.45; text-decoration:line-through;}
    .sys-msg{ background:rgba(255,255,255,0.04); border-left:4px solid #6f9cff; padding:8px; margin-bottom:8px; border-radius:4px;}
    button{ background:linear-gradient(90deg,#5e7cff,#8d5fff); color:white; border:none; padding:8px 12px; margin:4px; border-radius:6px; cursor:pointer;}
  `;
  const s = document.createElement("style");
  s.innerHTML = css;
  document.head.appendChild(s);
})();
