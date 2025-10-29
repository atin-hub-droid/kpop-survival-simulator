document.getElementById("startBtn").addEventListener("click", startGame);

const gameContainer = document.getElementById("game-container");

// Create player object
let player = {};

function startGame() {
    gameContainer.innerHTML = `
        <h2>Welcome Trainee</h2>
        <p>Enter your trainee details to begin your idol journey.</p>
        <label>Name:</label><br>
        <input type="text" id="playerName" placeholder="Enter your name"><br><br>
        <label>Age:</label><br>
        <input type="number" id="playerAge" min="15" max="28" value="18"><br><br>
        <label>Nationality:</label><br>
        <input type="text" id="playerNation" placeholder="e.g. Korean, Filipino, Japanese"><br><br>
        <button onclick="createPlayer()">Continue</button>
    `;
}

function createPlayer() {
    const name = document.getElementById("playerName").value;
    const age = document.getElement
