// === Game Data ===
const hosts = ["IVE's Won Young", "Cha Eun Woo"];
const judges = {
    rap: "G-Dragon",
    dance: "EXO Kai",
    vocal: ["EXO Baekhyun", "Chen"]
};
const companies = ["SM Entertainment", "YG Entertainment", "JYP Entertainment", "HYBE", "Cube Entertainment", "Pledis", "Starship", "RBW"];
const maxStat = 100;

// Player stats
const player = {
    name: "You",
    nationality: "Korean",
    age: Math.floor(Math.random() * 7) + 15, // 15-21
    singing: 50 + Math.floor(Math.random()*6), // 10% customization
    dancing: 50 + Math.floor(Math.random()*6),
    rapping: 50 + Math.floor(Math.random()*6),
    visual: 50 + Math.floor(Math.random()*6),
    position: "",
    groupName: "",
    route: "",
    alive: true
};

// Generate 111 contestants
const contestants = [];
function generateContestants() {
    for (let i = 1; i <= 111; i++) {
        const nationality = Math.random() < 0.2 ? "Foreign" : "Korean";
        contestants.push({
            name: `Player ${i}`,
            nationality: nationality,
            singing: Math.floor(Math.random() * 60) + 20,
            dancing: Math.floor(Math.random() * 60) + 20,
            rapping: Math.floor(Math.random() * 60) + 20,
            visual: Math.floor(Math.random() * 60) + 20,
            stagePresence: ["S","A","B","C","D"][Math.floor(Math.random()*5)],
            status: "active",
            friend: null,
            rival: null
        });
    }
    contestants.push(player); // add player to contestants
}

// Display player stats
function updateStatsUI() {
    document.getElementById("singing").innerText = player.singing;
    document.getElementById("dancing").innerText = player.dancing;
    document.getElementById("rapping").innerText = player.rapping;
    document.getElementById("visual").innerText = player.visual;
}

// === Game Flow ===
let round = 1;

function showIntro() {
    const narration = document.getElementById("narration");
    narration.innerHTML = `
        <p>Welcome to <strong>K-Pop Idol Survival Show</strong> hosted by ${hosts.join(" & ")}!</p>
        <p>Mentors: ${judges.rap} (Rap), ${judges.dance} (Dance), ${judges.vocal.join(" & ")} (Vocal)</p>
        <p>111 contestants have joined the competition, including you! Ages 15-21, 20% foreign trainees.</p>
        <p>Your goal: survive challenges, impress judges and fans, and debut in the final group!</p>
        <button onclick="nextRound()">Start Round 1</button>
    `;
}

// === Training & Performance System ===
function nextRound() {
    if(!player.alive){
        showElimination();
        return;
    }
    const narration = document.getElementById("narration");
    narration.innerHTML = `<p>Round ${round}: Choose your action for training:</p>
    <button onclick="train('singing')">Train Singing</button>
    <button onclick="train('dancing')">Train Dancing</button>
    <button onclick="train('rapping')">Train Rapping</button>
    <button onclick="train('visual')">Train Visual</button>`;
}

function train(skill) {
    // Random gain or regression
    const change = Math.floor(Math.random() * 3) + 3; // 3-5
    const up = Math.random() < 0.7; // 70% chance to improve
    if(up){
        player[skill] = Math.min(player[skill] + change, maxStat);
        narrate(`You focused on ${skill} and gained +${change} points!`);
    } else {
        player[skill] = Math.max(player[skill] - change, 0);
        narrate(`Training mishap! Your ${skill} decreased by -${change}.`);
    }
    updateStatsUI();
    performanceRound();
}

// === Performance Round (5-choice) ===
function performanceRound(){
    const narration = document.getElementById("narration");
    narration.innerHTML = `<p>Performance Time! Choose how to perform (5 choices, 3 correct to avoid danger zone):</p>
        <button onclick="performanceChoice(1)">Option 1</button>
        <button onclick="performanceChoice(2)">Option 2</button>
        <button onclick="performanceChoice(3)">Option 3</button>
        <button onclick="performanceChoice(4)">Option 4</button>
        <button onclick="performanceChoice(5)">Option 5</button>`;
    player.performanceChoices = 0;
    player.correctChoices = 0;
}

function performanceChoice(choice){
    // Random correctness
    const correct = Math.random() < 0.6; // 60% chance choice is correct
    player.performanceChoices++;
    if(correct) player.correctChoices++;
    narrate(`You chose Option ${choice}: ${correct ? "Good!" : "Mistake..."}`);
    if(player.performanceChoices >= 5){
        // Evaluate
        if(player.correctChoices < 3){
            narrate(`Danger zone! Your stats may decrease next round.`);
            randomRegression();
        } else {
            narrate(`Great performance! Your stats improve slightly.`);
            randomImprovement();
        }
        round++;
        setTimeout(nextRound, 2000);
    }
}

// === Stat Random Improvement/Regression ===
function randomImprovement(){
    const skills = ["singing","dancing","rapping","visual"];
    const skill = skills[Math.floor(Math.random()*skills.length)];
    const inc = Math.floor(Math.random()*3)+3;
    player[skill] = Math.min(player[skill]+inc,maxStat);
    narrate(`Your ${skill} increased by +${inc} due to performance!`);
    updateStatsUI();
}

function randomRegression(){
    const skills = ["singing","dancing","rapping","visual"];
    const skill = skills[Math.floor(Math.random()*skills.length)];
    const dec = Math.floor(Math.random()*3)+3;
    player[skill] = Math.max(player[skill]-dec,0);
    narrate(`Your ${skill} decreased by -${dec} due to poor performance!`);
    updateStatsUI();
    if(Object.values(player).some(v => v < 30)){
        player.alive = false;
        showElimination();
    }
}

// === Elimination ===
function showElimination(){
    const narration = document.getElementById("narration");
    narration.innerHTML = `<p>You have been eliminated from the competition.</p>
        <p>Better luck next time!</p>`;
}

// === Utility function for narration ===
function narrate(message){
    const narration = document.getElementById("narration");
    narration.innerHTML += `<p>${message}</p>`;
}

// === Start Game ===
document.getElementById("startBtn").addEventListener("click", () => {
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stats").classList.remove("hidden");
    generateContestants();
    updateStatsUI();
    showIntro();
});
