// ======== Game Variables ========
let player = {};
let npcs = [];
let episode = 1;
let scenarioIndex = 0;
let timer = 10;
let timerInterval;
let scenarios = [];
let totalEpisodes = 10;
let totalScenarios = 200; // full scenario pool

// Player routes
let routes = ["Instant Fan Favorite","Dark Horse","Common Trainee","Fallen Idol"];

// Sample NPC nationalities and traits
const nationalities = ["Korean","Japanese","Chinese","Thai","Filipino","American","Vietnamese"];
const npcTraits = ["friendly","rival","fan favorite","hardworking","diva"];

// ======== Scenario Generation ========
let scenarioPool = [];
// Auto-generate 200+ scenarios (placeholder, expand with real content)
for(let i=1;i<=totalScenarios;i++){
  scenarioPool.push({
    text: `Scenario ${i}: Make a choice affecting your stats or fan votes.`,
    stat: ["singing","dancing","rap","visual","votes"][Math.floor(Math.random()*5)],
    options: [
      {text:"+3 choice", effect:3},
      {text:"+4 choice", effect:4},
      {text:"-3 choice", effect:-3},
      {text:"+0 choice", effect:0}
    ]
  });
}

// ======== Functions ========

function customForeign() {
  let nationality = prompt("Enter your nationality:");
  startGame(nationality);
}

function startGame(type) {
  document.getElementById("intro").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  // Initialize player
  player = {
    name: "You",
    nationality: type,
    age: Math.floor(Math.random()*7)+15,
    singing: Math.floor(Math.random()*10)+10,
    dancing: Math.floor(Math.random()*10)+10,
    rap: Math.floor(Math.random()*10)+10,
    visual: Math.floor(Math.random()*10)+10,
    votes: 50,
    rank: 111
  };

  initializeNPCs();
  generateScenarios();
  updateStats();
  startScenario();
}

// Generate 111 NPCs
function initializeNPCs() {
  npcs = [];
  for (let i=1;i<=111;i++) {
    let nationality = nationalities[Math.floor(Math.random()*nationalities.length)];
    let trait = npcTraits[Math.floor(Math.random()*npcTraits.length)];
    npcs.push({
      name: "Player " + i,
      nationality: nationality,
      trait: trait,
      singing: Math.floor(Math.random()*70)+30,
      dancing: Math.floor(Math.random()*70)+30,
      rap: Math.floor(Math.random()*70)+30,
      visual: Math.floor(Math.random()*70)+30,
      votes: Math.floor(Math.random()*50),
      team: "",
      rank: 111
    });
  }
}

// Generate scenarios per episode
function generateScenarios() {
  scenarios = [];
  let pool = [...scenarioPool];
  while(scenarios.length<20){
    let idx = Math.floor(Math.random()*pool.length);
    scenarios.push(pool[idx]);
    pool.splice(idx,1);
  }
}

function updateStats() {
  document.getElementById("playerStats").innerText = 
    `Singing: ${player.singing} | Dancing: ${player.dancing} | Rap: ${player.rap} | Visual: ${player.visual} | Votes: ${player.votes}`;
  document.getElementById("episodeInfo").innerText = `Episode ${episode} / ${totalEpisodes}`;
}

// ======== Scenario Functions ========
function startScenario() {
  scenarioIndex = 0;
  showScenario();
}

function showScenario() {
  if (scenarioIndex >= scenarios.length) {
    endEpisode();
    return;
  }
  let sc = scenarios[scenarioIndex];
  document.getElementById("scenarioText").innerText = sc.text;
  let optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  sc.options.forEach((opt,i)=>{
    let btn = document.createElement("button");
    btn.innerText = opt.text;
    btn.onclick = ()=>selectOption(i);
    optionsDiv.appendChild(btn);
  });
  timer = 10;
  document.getElementById("timer").innerText = timer;
  timerInterval = setInterval(countdown,1000);
}

function countdown() {
  timer--;
  document.getElementById("timer").innerText = timer;
  if(timer<=0){
    clearInterval(timerInterval);
    autoPick();
  }
}

function autoPick() {
  let sc = scenarios[scenarioIndex];
  let effect = sc.options[3].effect; // default regression if no choice
  applyEffect(sc.stat,effect);
  scenarioIndex++;
  showScenario();
}

function selectOption(index) {
  clearInterval(timerInterval);
  let sc = scenarios[scenarioIndex];
  let effect = sc.options[index].effect;
  applyEffect(sc.stat,effect);
  scenarioIndex++;
  showScenario();
}

function applyEffect(stat,value) {
  if(stat=="singing") player.singing += value;
  else if(stat=="dancing") player.dancing += value;
  else if(stat=="rap") player.rap += value;
  else if(stat=="visual") player.visual += value;
  else player.votes += value;
  if(player.singing<0) player.singing=0;
  if(player.dancing<0) player.dancing=0;
  if(player.rap<0) player.rap=0;
  if(player.visual<0) player.visual=0;
  if(player.votes<0) player.votes=0;
  updateStats();
}

// ======== Episode & Elimination ========
function endEpisode() {
  // Dynamic elimination logic based on episode
  let eliminationThreshold;
  if(episode===1) eliminationThreshold = 30; // Example: first episode mentor-only
  else eliminationThreshold = 40;

  if(player.singing<eliminationThreshold || player.dancing<eliminationThreshold ||
     player.rap<eliminationThreshold || player.visual<eliminationThreshold){
    endGame("You were eliminated this episode!");
  } else if(episode>=totalEpisodes){
    calculateDebut();
  } else {
    episode++;
    generateScenarios();
    startScenario();
  }
}

// ======== Debut Outcome ========
function calculateDebut() {
  let positions = [];
  if(player.singing>=86) positions.push("Main Vocalist");
  else if(player.singing>=70) positions.push("Lead Vocalist");

  if(player.dancing>=86) positions.push("Main Dancer");
  else if(player.dancing>=70) positions.push("Lead Dancer");

  if(player.rap>=86) positions.push("Main Rapper");
  else if(player.rap>=70) positions.push("Lead Rapper");

  let role = "";
  if(player.visual>=90) role+="Visual, ";
  if(player.rank===1) role+="Center, ";
  if(player.age===Math.min(...npcs.map(n=>n.age))) role+="Maknae, ";
  if(player.age===Math.max(...npcs.map(n=>n.age))) role+="Eldest, ";
  role = role.slice(0,-2);

  endGame(`Congrats! You debuted as ${positions.join(", ")}${role?(", "+role):""}`);
}

function endGame(message) {
  document.getElementById("game").classList.add("hidden");
  document.getElementById("endScreen").classList.remove("hidden");
  document.getElementById("endMessage").innerText = message;
}

function restartGame() {
  document.getElementById("endScreen").classList.add("hidden");
  document.getElementById("intro").classList.remove("hidden");
          }
