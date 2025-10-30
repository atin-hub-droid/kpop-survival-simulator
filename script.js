// === Game Data ===
const hosts = ["IVE's Won Young", "Cha Eun Woo"];
const judges = { rap:"G-Dragon", dance:"EXO Kai", vocal:["EXO Baekhyun","Chen"] };
const companies = ["SM Entertainment", "YG Entertainment", "JYP Entertainment", "HYBE", "Cube Entertainment", "Pledis", "Starship", "RBW"];
const maxStat = 100;
let round = 0;

//// Player stats
let player = {
    singing: Math.floor(Math.random()*50)+25,
    dancing: Math.floor(Math.random()*50)+25,
    rapping: Math.floor(Math.random()*50)+25,
    visual: Math.floor(Math.random()*50)+25,
    age: Math.floor(Math.random()*7)+15,
    nationality: "Korean",
    episode: 0,
    question: 0,
    danger: 0
};

const totalEpisodes = 12;
const questionsPerEpisode = 10;

// Update stats display
function updateStats() {
    document.getElementById("singing").innerText = player.singing;
    document.getElementById("dancing").innerText = player.dancing;
    document.getElementById("rapping").innerText = player.rapping;
    document.getElementById("visual").innerText = player.visual;
}

// Scenario pools
const scenarios = [
    { text: "Mentor critiques your singing.", options: ["Focus on vocals", "Practice dance"], effects: [{singing:+3,visual:0},{dancing:+2,singing:-1}] },
    { text: "Rival challenges you to a rap battle.", options: ["Accept challenge", "Avoid challenge"], effects: [{rapping:+3,visual:-1},{visual:+1,rapping:-1}] },
    { text: "Fans request your dance video.", options: ["Perform energetically","Stay safe"], effects: [{dancing:+3,singing:-1},{visual:+1,dancing:0}] },
    { text: "Mentors evaluate stage presence.", options: ["Be confident","Be cautious"], effects: [{visual:+2,dancing:+1},{visual:0,singing:+1}] },
    { text: "Group project assignment.", options: ["Lead project","Follow quietly"], effects: [{visual:+1, singing:+2},{visual:-1,dancing:+2}] },
    { text: "Media interview time.", options: ["Be funny","Be serious"], effects: [{visual:+1,singing:0},{visual:0,dancing:+1}] },
    { text: "Dance challenge.", options: ["Go all out","Focus on precision"], effects: [{dancing:+3,visual:-1},{dancing:+2,singing:+1}] },
    { text: "Rap evaluation by G-Dragon.", options: ["Freestyle","Stick to lyrics"], effects: [{rapping:+3,visual:-1},{rapping:+2,singing:+1}] },
    { text: "Vocal evaluation by Baekhyun.", options: ["High notes","Smooth tone"], effects: [{singing:+3,dancing:-1},{singing:+2,visual:+1}] },
    { text: "Fans vote for your visuals.", options: ["Smile brightly","Keep cool"], effects: [{visual:+3, singing:-1},{visual:+2,dancing:0}] }
];

// Random scenario generator
function getRandomScenario() {
    return scenarios[Math.floor(Math.random()*scenarios.length)];
}

// Check for elimination
function checkElimination() {
    if(player.singing<30 || player.dancing<30 || player.rapping<30 || player.visual<30 || player.danger>=3){
        document.getElementById("narration").innerText = "You were eliminated due to low performance!";
        document.getElementById("choices").innerHTML = "";
        document.getElementById("startButton").innerText = "Try Again";
        return true;
    }
    return false;
}

// Render choices for each question
function renderChoices() {
    let container = document.getElementById("choices");
    container.innerHTML = "";
    let scenario = getRandomScenario();
    
    // 10% chance danger zone
    if(Math.random()<0.1){
        player.danger++;
        document.getElementById("narration").innerText = `Danger zone triggered! Your stats drop.\nEpisode ${player.episode+1} Question ${player.question+1}: ${scenario.text}`;
        player.singing-=2; if(player.singing<0)player.singing=0;
        player.dancing-=2; if(player.dancing<0)player.dancing=0;
        updateStats();
    } else {
        document.getElementById("narration").innerText = `Episode ${player.episode+1} Question ${player.question+1}: ${scenario.text}`;
    }

    scenario.options.forEach((opt,i)=>{
        let btn = document.createElement("button");
        btn.className = "choice";
        btn.innerText = opt;
        btn.onclick = ()=> {
            let effect = scenario.effects[i];
            for(let key in effect){
                player[key] += effect[key];
                if(player[key]<0) player[key]=0;
            }
            updateStats();
            if(!checkElimination()) nextQuestion();
        };
        container.appendChild(btn);
    });
}

// Move to next question/episode
function nextQuestion() {
    player.question++;
    if(player.question>=questionsPerEpisode){
        player.question=0;
        player.episode++;
        if(player.episode>=totalEpisodes){
            showFinale();
            return;
        }
    }
    renderChoices();
}

// Final debut/failure
function showFinale() {
    document.getElementById("choices").innerHTML="";
    let totalScore = player.singing+player.dancing+player.rapping+player.visual;
    let fanVote = Math.floor(Math.random()*50 + totalScore*0.5);
    let onlineVote = Math.floor(Math.random()*30 + totalScore*0.3);
    let liveVote = Math.floor(Math.random()*20 + totalScore*0.2);
    let finalScore = fanVote + onlineVote + liveVote;

    if(finalScore<120){
        document.getElementById("narration").innerText = "Unfortunately, you did not debut in the final group.";
    } else {
        let positions = [];
        if(player.singing>=70) positions.push("Lead/Main Vocal");
        if(player.dancing>=70) positions.push("Lead/Main Dancer");
        if(player.rapping>=70) positions.push("Lead/Main Rapper");
        if(player.visual>=90) positions.push("Visual");
        if(player.visual>=70) positions.push("Face of the Group");
        document.getElementById("narration").innerText = `Congratulations! You debuted as: ${positions.join(", ") || "supporting member"}!`;
    }

    document.getElementById("startButton").innerText = "Play Again";
}

// Start/restart game
document.getElementById("startButton").onclick = ()=>{
    player.episode=0;
    player.question=0;
    player.danger=0;
    player.singing=Math.floor(Math.random()*50)+25;
    player.dancing=Math.floor(Math.random()*50)+25;
    player.rapping=Math.floor(Math.random()*50)+25;
    player.visual=Math.floor(Math.random()*50)+25;
    updateStats();
    renderChoices();
};

updateStats();
}

// Update stats display
function updateStatsUI(){
    document.getElementById("singing").innerText = player.singing;
    document.getElementById("dancing").innerText = player.dancing;
    document.getElementById("rapping").innerText = player.rapping;
    document.getElementById("visual").innerText = player.visual;
}

// Narration utility
function narrate(msg, delay=0){
    setTimeout(()=>{
        const narration = document.getElementById("narration");
        narration.innerHTML += `<p>${msg}</p>`;
        narration.scrollTop = narration.scrollHeight;
    }, delay);
}

// === Rounds Data ===
const rounds = [
    { theme:"Introduction Stage", judge:"Hosts", skill:"visual", description:"Icebreaker, first impression, charisma and stage presence" },
    { theme:"Rap Challenge", judge:"G-Dragon", skill:"rapping", description:"Test rap skills, flow, and creativity" },
    { theme:"Dance Battle", judge:"EXO Kai", skill:"dancing", description:"Evaluate synchronization, flexibility, and performance" },
    { theme:"Vocal Evaluation", judge:"Baekhyun & Chen", skill:"singing", description:"Test pitch, range, and emotive performance" },
    { theme:"Final Group Performance", judge:"All Judges", skill:"overall", description:"Overall performance, teamwork, and leadership" }
];

// Choices for each round
const roundChoices = [
    [
        {text:"Smile confidently and wave", correct:true, effect:{visual:3,votes:2}},
        {text:"Strike a dramatic pose", correct:true, effect:{visual:4,votes:3}},
        {text:"Stay quiet and shy", correct:false, effect:{visual:-2,votes:-1}},
        {text:"Do a funny gesture", correct:false, effect:{visual:-1,votes:0}},
        {text:"Try to impress randomly", correct:true, effect:{visual:2,votes:2}}
    ],
    [
        {text:"Rap with confidence", correct:true, effect:{rapping:4,votes:3}},
        {text:"Improvise lyrics", correct:true, effect:{rapping:3,votes:2}},
        {text:"Follow original lyrics", correct:true, effect:{rapping:2,votes:1}},
        {text:"Forget lyrics and panic", correct:false, effect:{rapping:-3,votes:-2}},
        {text:"Focus on gestures only", correct:false, effect:{rapping:-2,votes:-1}}
    ],
    [
        {text:"Show complex choreography", correct:true, effect:{dancing:4,votes:3}},
        {text:"Sync perfectly with music", correct:true, effect:{dancing:3,votes:2}},
        {text:"Add personal flair", correct:true, effect:{dancing:2,votes:1}},
        {text:"Miss steps frequently", correct:false, effect:{dancing:-3,votes:-2}},
        {text:"Look at audience too much", correct:false, effect:{dancing:-1,votes:-1}}
    ],
    [
        {text:"Hit all high notes perfectly", correct:true, effect:{singing:4,votes:3}},
        {text:"Add emotional feeling", correct:true, effect:{singing:3,votes:2}},
        {text:"Use microphone techniques", correct:true, effect:{singing:2,votes:1}},
        {text:"Forget lyrics mid-song", correct:false, effect:{singing:-3,votes:-2}},
        {text:"Sing too softly", correct:false, effect:{singing:-2,votes:-1}}
    ],
    [
        {text:"Lead the team confidently", correct:true, effect:{singing:2,dancing:2,rapping:2,votes:3}},
        {text:"Support teammates quietly", correct:true, effect:{singing:1,dancing:1,rapping:1,votes:2}},
        {text:"Focus only on own performance", correct:false, effect:{singing:-2,dancing:-2,rapping:-2,votes:-1}},
        {text:"Encourage friends and rivals", correct:true, effect:{votes:3}},
        {text:"Ignore stage instructions", correct:false, effect:{singing:-2,dancing:-2,rapping:-2,votes:-2}}
    ]
];

// === Interaction Event System ===
function interactionEvent(){
    // 50% chance to trigger an event
    if(Math.random()<0.5){
        const other = contestants[Math.floor(Math.random()*contestants.length)];
        if(other.name===player.name) return;
        const isFriend = Math.random()<0.5;
        if(isFriend){
            player.friends.push(other.name);
            narrate(`${other.name} encourages you! Singing +2, Votes +1`,500);
            player.singing = Math.min(player.singing+2,maxStat);
            player.votes +=1;
        } else {
            player.rivals.push(other.name);
            narrate(`${other.name} challenges you fiercely! Dancing -2, Votes -1`,500);
            player.dancing = Math.max(player.dancing-2,0);
            player.votes = Math.max(player.votes-1,0);
        }
        updateStatsUI();
    }
}

// === Next Round ===
function nextRound(){
    if(!player.alive){ showElimination(); return; }
    if(round>=rounds.length){ checkDebut(); return; }

    narrate(`<strong>Round ${round+1}: ${rounds[round].theme}</strong> - ${rounds[round].description}`,500);
    setTimeout(()=>interactionEvent(),1000);
    setTimeout(()=>showChoices(round),1500);
}

// === Show Choices ===
function showChoices(r){
    player.performanceChoices = 0;
    player.correctChoices = 0;
    const container = document.getElementById("narration");
    roundChoices[r].forEach((choice,i)=>{
        container.innerHTML += `<button onclick="selectChoice(${r},${i})">${choice.text}</button>`;
    });
}

// === Handle Choice Selection ===
function selectChoice(r,i){
    const choice = roundChoices[r][i];
    player.performanceChoices++;
    if(choice.correct) player.correctChoices++;
    for(let stat in choice.effect){
        player[stat] = Math.min(Math.max(player[stat]+choice.effect[stat],0),maxStat);
    }
    updateStatsUI();
    narrate(`You chose: ${choice.text} - ${choice.correct?"Excellent!":"Mistake..."}`,500);

    if(player.performanceChoices>=5
