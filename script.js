const choices = ["rock", "paper", "scissors"];
const recentPlayerChoices = [];
const counterMoves = {
    rock: "paper",
    paper: "scissors",
    scissors: "rock"
};
const winningChoices = {
    rock: "scissors",
    paper: "rock",
    scissors: "paper"
};
const choiceEmojis = {
    rock: "🪨",
    paper: "📄",
    scissors: "✂️"
};
const scores = { player: 0, computer: 0 };

const elements = {
    choiceButtons: document.querySelectorAll("[data-choice]"),
    resetButton: document.querySelector("[data-reset]"),
    playerChoice: document.getElementById("playerChoice"),
    computerChoice: document.getElementById("computerChoice"),
    playerScore: document.getElementById("playerScore"),
    computerScore: document.getElementById("computerScore"),
    result: document.getElementById("result")
};

function getComputerChoice() {
    if (recentPlayerChoices.length === 0) {
        return choices[Math.floor(Math.random() * choices.length)];
    }

    const choiceCounts = { rock: 0, paper: 0, scissors: 0 };
    recentPlayerChoices.forEach(choice => {
        choiceCounts[choice] += 1;
    });

    const mostUsedCount = Math.max(...Object.values(choiceCounts));
    const mostUsedChoices = choices.filter(
        choice => choiceCounts[choice] === mostUsedCount
    );
    const predictedChoice = mostUsedChoices[
        Math.floor(Math.random() * mostUsedChoices.length)
    ];

    return counterMoves[predictedChoice];
}

function getRoundOutcome(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return { type: "draw", message: "🤝 It's a Draw!" };
    }

    if (winningChoices[playerChoice] === computerChoice) {
        return { type: "win", message: "🎉 You Win!" };
    }

    return { type: "loss", message: "💻 Computer Wins!" };
}

function updateDisplay(playerChoice, computerChoice, outcome) {
    elements.playerChoice.textContent = `${choiceEmojis[playerChoice]} ${playerChoice}`;
    elements.computerChoice.textContent = `${choiceEmojis[computerChoice]} ${computerChoice}`;
    elements.playerScore.textContent = scores.player;
    elements.computerScore.textContent = scores.computer;
    elements.result.textContent = outcome.message;
    elements.result.dataset.outcome = outcome.type;
}

function playRound(playerChoice) {
    const computerChoice = getComputerChoice();
    recentPlayerChoices.push(playerChoice);

    if (recentPlayerChoices.length > 5) {
        recentPlayerChoices.shift();
    }

    const outcome = getRoundOutcome(playerChoice, computerChoice);

    if (outcome.type === "win") {
        scores.player += 1;
    } else if (outcome.type === "loss") {
        scores.computer += 1;
    }

    updateDisplay(playerChoice, computerChoice, outcome);
}

function resetGame() {
    scores.player = 0;
    scores.computer = 0;
    recentPlayerChoices.length = 0;

    elements.playerScore.textContent = "0";
    elements.computerScore.textContent = "0";
    elements.playerChoice.textContent = "-";
    elements.computerChoice.textContent = "-";
    elements.result.textContent = "Choose your move!";
    delete elements.result.dataset.outcome;
}

elements.choiceButtons.forEach(button => {
    button.addEventListener("click", () => {
        playRound(button.dataset.choice);
    });
});

elements.resetButton.addEventListener("click", resetGame);