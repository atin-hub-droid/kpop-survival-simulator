// ==========================
// K-POP MALE IDOL SURVIVAL SIMULATOR
// Full Script.js
// ==========================

// --------------------------
// Global Variables
// --------------------------
const TOTAL_CONTESTANTS = 111;
const EPISODES = 12;
let episode = 1;
let scenarioIndex = 0;
let eliminated = false;
let npcs = [];
let episodeScenarios = [];
let player = {
    name: "You",
    nationality: "Korean",
    age: randomInt(15,21),
    singing: 50,
    dancing: 50,
    rapping: 50,
    visual: 50,
    popularity: 50,
    route: "",
    friendList: [],
    rivalList: []
};
const nationalities = ['Korean','Japanese','Chinese','Thai','Filipino','American','Brazilian','Vietnamese'];
const koreanNames = ['Jinwoo','Minho','Taeyang','Seokjin','Jiwon','Donghyun','Sangmin','Hyunwoo','Jiho','Yunho'];
const foreignNames = ['Alex','Leo','Ryan','Ethan','Kai','Lucas','Noah','Max','Jayden','Carter'];

// --------------------------
// Utility Functions
// --------------------------
function randomInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function shuffleArray(array){ return array.sort(()=>Math.random()-0.5); }

// --------------------------
// Generate NPCs
// --------------------------
function generateNPCs(){
    for(let i=1;i<TOTAL_CONTESTANTS;i++){
        let nationality = nationalities[randomInt(0,nationalities.length-1)];
        let npc = {
            name: `Player ${i} (${nationality})`,
            nationality: nationality,
            age: randomInt(15,21),
            singing: randomInt(30,80),
            dancing: randomInt(30,80),
            rapping: randomInt(30,80),
            visual: randomInt(30,80),
            popularity: randomInt(20,80),
            friendship: randomInt(0,100),
            rivalry: randomInt(0,100)
        };
        npcs.push(npc);
    }
}

// --------------------------
// Scenario Pool (100 Scenarios Sample)
// --------------------------
let scenarios = [];
for(let i=1;i<=100;i++){
    scenarios.push({
        text: `Scenario ${i}: A challenge appears! What do you do?`,
        img: `https://picsum.photos/seed/${i}/500/300`,
        choices: [
            {text:"Focus on singing", effect:{singing:randomInt(2,5),popularity:randomInt(1,3)}},
            {text:"Focus on dancing", effect:{dancing:randomInt(2,5),popularity:randomInt(1,3)}},
            {text:"Focus on rap", effect:{rapping:randomInt(2,5),popularity:randomInt(1,3)}},
            {text:"Work on visuals", effect:{visual:randomInt(2,5),popularity:randomInt(1,3)}}
        ]
    });
}

// --------------------------
// Start Game
// --------------------------
function startGame(){
    document.getElementById('intro').style.display = 'none';
    generateNPCs();
    document.getElementById('playerSetup').style.display = 'block';
}

// --------------------------
// Confirm Player Stats
// --------------------------
function confirmStats(){
    player.singing += parseInt(document.getElementById('inputSinging').value);
    player.dancing += parseInt(document.getElementById('inputDancing').value);
    player.rapping += parseInt(document.getElementById('inputRapping').value);
    player.visual += parseInt(document.getElementById('inputVisual').value);
    document.getElementById('playerSetup').style.display = 'none';
    document.getElementById('stats').style.display = 'block';
    startEpisode();
}

// --------------------------
// Episode Start
// --------------------------
function startEpisode(){
    scenarioIndex = 0;
    episodeScenarios = shuffleArray(scenarios).slice(0,10); // 10 scenarios per episode
    showScenario();
}

// --------------------------
// Show Scenario
// --------------------------
function showScenario(){
    let sc = episodeScenarios[scenarioIndex];
    document.getElementById('scenario').style.display='block';
    document.getElementById('scenarioText').innerText = sc.text;
    document.getElementById('scenarioImg').src = sc.img;
    let choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML='';
    sc.choices.forEach(c=>{
        let btn = document.createElement('button');
        btn.innerText = c.text;
        btn.onclick = ()=>makeChoice(c.effect);
        choicesDiv.appendChild(btn);
    });
}

// --------------------------
// Make Choice
// --------------------------
function makeChoice(effect){
    // Apply player effect
    for(let key in effect){
        player[key] += effect[key];
        if(player[key]>100) player[key]=100;
        if(player[key]<0) player[key]=0;
    }

    // NPC interaction
    let npc = npcs[randomInt(0,npcs.length-1)];
    let interaction = randomInt(0,100);
    if(interaction<npc.friendship){
        // Friendship triggered
        player.singing +=1; player.popularity +=2;
        player.friendList.push(npc.name);
    } else if(interaction<npc.friendship+npc.rivalry){
        // Rivalry triggered
        player.dancing -=2; player.popularity -=2;
        player.rivalList.push(npc.name);
    }

    updateStats();
    scenarioIndex++;
    if(scenarioIndex>=episodeScenarios.length){
        endEpisode();
    }else showScenario();
}

// --------------------------
// Update Stats
// --------------------------
function updateStats(){
    document.getElementById('singing').innerText=player.singing;
    document.getElementById('dancing').innerText=player.dancing;
    document.getElementById('rapping').innerText=player.rapping;
    document.getElementById('visual').innerText=player.visual;
}

// --------------------------
// End Episode
// --------------------------
function endEpisode(){
    document.getElementById('scenario').style.display='none';
    document.getElementById('result').style.display='block';

    // Fan vote simulation
    let fanVote = player.popularity + randomInt(-10,10);
    let onlineVote = randomInt(20,80);
    let liveAudience = randomInt(20,80);
    let performance = (player.singing+player.dancing+player.rapping+player.visual)/4;

    let totalScore = performance*0.8 + fanVote*0.1 + onlineVote*0.05 + liveAudience*0.05;

    // Elimination check at specific episodes
    let eliminateThisEpisode = [3,5,7,9,12].includes(episode);
    if(eliminateThisEpisode && totalScore<50){
        eliminated = true;
        document.getElementById('resultText').innerText=`Episode ${episode}: Danger! You were eliminated.`;
        return;
    }

    document.getElementById('resultText').innerText=`Episode ${episode} finished! Your total score: ${Math.round(totalScore)}`;
    episode++;
    if(episode>EPISODES) debutOutcome();
}

// --------------------------
// Debut Outcome
// --------------------------
function debutOutcome(){
    let positions = [];
    if(player.singing>=86) positions.push('Main Vocal');
    else if(player.singing>=70) positions.push('Lead Vocal');
    if(player.dancing>=86) positions.push('Main Dancer');
    else if(player.dancing>=70) positions.push('Lead Dancer');
    if(player.rapping>=86) positions.push('Main Rapper');
    else if(player.rapping>=70) positions.push('Lead Rapper');
    if(player.visual>=90) positions.push('Visual');

    // Center (top rank simulated)
    if(randomInt(0,100)<10) positions.push('Center');

    // Maknae if youngest
    let allAges = npcs.map(n=>n.age); allAges.push(player.age);
    if(player.age===Math.min(...allAges)) positions.push('Maknae');

    // Face of the group FOTG based on popularity
    if(player.popularity>80) positions.push('Face of the Group');

    // Generate debut group name
    let groupName = generateGroupName();
    document.getElementById('resultText').innerText=
        `Congratulations! You debuted in ${groupName} as ${positions.join(', ')}!`;
}

// --------------------------
// Restart Game
// --------------------------
function restartGame(){
    episode=1;
    scenarioIndex=0;
    eliminated=false;
    npcs=[];
    player={name:"You",nationality:"Korean",age:randomInt(15,21),singing:50,dancing:50,rapping:50,visual:50,popularity:50,route:"",friendList:[],rivalList:[]};
    document.getElementById('result').style.display='none';
    document.getElementById('stats').style.display='block';
    startEpisode();
}

// --------------------------
// Debut Group Name Generator
// --------------------------
function generateGroupName(){
    let prefixes = ['Nova','Aero','Astro','Vivid','Pulse','Eclipse','Strive','Zenith'];
    let suffixes = ['Boys','Crew','Stars','Unit','Legends','Wave','Line','X'];
    return prefixes[randomInt(0,prefixes.length-1)] + ' ' + suffixes[randomInt(0,suffixes.length-1)];
}
