// === Game Data ===
const hosts = ["IVE's Won Young", "Cha Eun Woo"];
const judges = { rap:"G-Dragon", dance:"EXO Kai", vocal:["EXO Baekhyun","Chen"] };
const companies = ["SM Entertainment", "YG Entertainment", "JYP Entertainment", "HYBE", "Cube Entertainment", "Pledis", "Starship", "RBW"];
const maxStat = 100;
let round = 0;

// Player object
const player = {
    name:"You",
    nationality:"Korean",
    age: Math.floor(Math.random()*7)+15,
    singing: 50 + Math.floor(Math.random()*6),
    dancing: 50 + Math.floor(Math.random()*6),
    rapping: 50 + Math.floor(Math.random()*6),
    visual: 50 + Math.floor(Math.random()*6),
    position:"",
    groupName:"",
    route:"",
    alive:true,
    votes:0,
    friends:[],
    rivals:[]
};

// === Contestant Name Generator ===
const koreanFirst = ["Ji", "Min", "Seo", "Hyun", "Jae", "Hae", "Soo", "Yoon"];
const koreanLast = ["Kim","Lee","Park","Choi","Jung","Kang","Cho","Yoo"];
const foreignFirst = ["Liam","Noah","Emma","Olivia","Lucas","Mia","Ethan","Ava"];
const foreignLast = ["Smith","Johnson","Brown","Garcia","Martinez","Lee","Wilson","Taylor"];

function randomKoreanName(){ return koreanLast[Math.floor(Math.random()*koreanLast.length)]+" "+koreanFirst[Math.floor(Math.random()*koreanFirst.length)]; }
function randomForeignName(){ return foreignFirst[Math.floor(Math.random()*foreignFirst.length)]+" "+foreignLast[Math.floor(Math.random()*foreignLast.length)]; }

// Contestants array
const contestants = [];
function generateContestants(){
    for(let i=1;i<=111;i++){
        let nationality = Math.random()<0.2?"Foreign":"Korean";
        let name = nationality==="Korean"?randomKoreanName():randomForeignName();
        contestants.push({
            name:name,
            nationality:nationality,
            singing: Math.floor(Math.random()*60)+20,
            dancing: Math.floor(Math.random()*60)+20,
            rapping: Math.floor(Math.random()*60)+20,
            visual: Math.floor(Math.random()*60)+20,
            stagePresence:["S","A","B","C","D"][Math.floor(Math.random()*5)],
            status:"active",
            friends:[],
            rivals:[],
            votes:0
        });
    }
    contestants.push(player);
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
