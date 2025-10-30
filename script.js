// Global Variables
let episode = 1;
let scenarioIndex = 0;
let player = {
    singing: 50,
    dancing: 50,
    rapping: 50,
    visual: 50,
    popularity: 50,
    route: ''
};
let npcs = [];
let episodeScenarios = [];
const TOTAL_CONTESTANTS = 111;
const EPISODES = 12;

// Utility Functions
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// Generate NPCs
function generateNPCs() {
    const nationalities = ['Korean','Japanese','Chinese','Thai','Filipino','American','Brazilian','Vietnamese'];
    for(let i=1;i<=TOTAL_CONTESTANTS-1;i++){
        let npc = {
            name: `Player ${i}`,
            nationality: nationalities[randomInt(0,nationalities.length-1)],
            singing: randomInt(30,80),
            dancing: randomInt(30,80),
            rapping: randomInt(30,80),
            visual: randomInt(30,80),
            friendship: randomInt(0,100),
            rivalry: randomInt(0,100),
            popularity: randomInt(20,80)
        };
        npcs.push(npc);
    }
}

// Scenarios Pool (100 scenarios, only 5 sample shown, expand later)
let scenarios = [
    { text:"First group performance! How do you focus?", img:"https://i.imgur.com/z6Y0YzG.jpg", choices:[
        {text:"Intensive singing", effect:{singing:5}},
        {text:"Dance practice", effect:{dancing:5}},
        {text:"Rap session", effect:{rapping:5}},
        {text:"Visual prep", effect:{visual:5}}
    ]},
    { text:"Bond with another trainee?", img:"https://i.imgur.com/X6P1r5n.jpg", choices:[
        {text:"Player 1", effect:{singing:1,dancing:1}},
        {text:"Player 2", effect:{rapping:1,visual:1}},
        {text:"Player 3", effect:{}},
        {text:"Focus on yourself", effect:{singing:2,dancing:2}}
    ]},
    { text:"Mentor gives feedback on stage presence.", img:"https://i.imgur.com/3GJXQXg.jpg", choices:[
        {text:"Take notes seriously", effect:{singing:2,dancing:2,rapping:2}},
        {text:"Ignore mentor", effect:{singing:-2,dancing:-2}},
        {text:"Ask questions", effect:{visual:2}},
        {text:"Compliment mentor", effect:{popularity:5}}
    ]},
    { text:"Fans voted online for popularity challenge.", img:"https://i.imgur.com/5v5A3Zr.jpg", choices:[
        {text:"Do extra fan service", effect:{popularity:5}},
        {text:"Perform harder on stage", effect:{singing:3,dancing:3}},
        {text:"Make a viral content", effect:{popularity:3}},
        {text:"Ignore challenge", effect:{popularity:-3}}
    ]},
    { text:"Rival trainee challenges you to a dance-off.", img:"https://i.imgur.com/dP6E65V.jpg", choices:[
        {text:"Accept challenge", effect:{dancing:5}},
        {text:"Decline politely", effect:{popularity:-2}},
        {text:"Train secretly and surprise", effect:{dancing:7}},
        {text:"Focus on singing instead", effect:{singing:3}}
    ]}
];

// Start Game
function startGame() {
    document.getElementById('intro').style.display = 'none';
    generateNPCs();
    document.getElementById('playerSetup').style.display = 'block';
}

// Confirm Stats
function confirmStats(){
    player.singing += parseInt(document.getElementById('inputSinging').value);
    player.dancing += parseInt(document.getElementById('inputDancing').value);
    player.rapping += parseInt(document.getElementById('inputRapping').value);
    player.visual += parseInt(document.getElementById('inputVisual').value);
    document.getElementById('playerSetup').style.display = 'none';
    document.getElementById('stats').style.display = 'block';
    startEpisode();
}

// Start Episode
function startEpisode(){
    episodeScenarios = [];
    scenarioIndex=0;
    while(episodeScenarios.length<10){
        let sc = scenarios[randomInt(0,scenarios.length-1)];
        if(!episodeScenarios.includes(sc)) episodeScenarios.push(sc);
    }
    showScenario();
}

// Show Scenario
function showScenario(){
    let sc = episodeScenarios[scenarioIndex];
    document.getElementById('scenario').style.display='block';
    document.getElementById('scenarioText').innerText = sc.text;
    document.getElementById('scenarioImg').src = sc.img;
    let choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML='';
    sc.choices.forEach((c,i)=>{
        let btn = document.createElement('button');
        btn.innerText = c.text;
        btn.onclick = function(){makeChoice(c.effect)};
        choicesDiv.appendChild(btn);
    });
}

// Make Choice
function makeChoice(effect){
    for(let key in effect){
        player[key] += effect[key];
        if(player[key]>100) player[key]=100;
        if(player[key]<0) player[key]=0;
    }
    updateStats();
    scenarioIndex++;
    if(scenarioIndex>=episodeScenarios.length){
        endEpisode();
    }else showScenario();
}

// Update Stats
function updateStats(){
    document.getElementById('singing').innerText=player.singing;
    document.getElementById('dancing').innerText=player.dancing;
    document.getElementById('rapping').innerText=player.rapping;
    document.getElementById('visual').innerText=player.visual;
}

// End Episode
function endEpisode(){
    document.getElementById('scenario').style.display='none';
    document.getElementById('result').style.display='block';
    document.getElementById('resultText').innerText=`Episode ${episode} ended! Stats updated.`;
    episode++;
    if(episode>EPISODES) debutOutcome();
}

// Debut Outcome
function debutOutcome(){
    let positions=[];
    if(player.singing>=86) positions.push('Main Vocal');
    else if(player.singing>=70) positions.push('Lead Vocal');
    if(player.dancing>=86) positions.push('Main Dancer');
    else if(player.dancing>=70) positions.push('Lead Dancer');
    if(player.rapping>=86) positions.push('Main Rapper');
    else if(player.rapping>=70) positions.push('Lead Rapper');
    if(player.visual>=90) positions.push('Visual');
    // Center (rank 1) randomly simulated
    if(randomInt(0,100)<10) positions.push('Center');
    document.getElementById('resultText').innerText=`Congratulations! You debuted as ${positions.join(', ')}!`;
}

// Restart
function restartGame(){
    episode=1;
    scenarioIndex=0;
    player={singing:50,dancing:50,rapping:50,visual:50,popularity:50,route:''};
    npcs=[];
    document.getElementById('result').style.display='none';
    document.getElementById('stats').style.display='block';
    startEpisode();
}
