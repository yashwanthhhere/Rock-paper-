const cells = Array.from(document.querySelectorAll(".cell"));
const statusText = document.querySelector("#game-status");
const scoreXText = document.querySelector("#score-x");
const scoreOText = document.querySelector("#score-o");
const scoreDrawText = document.querySelector("#score-draw");
const playerXCard = document.querySelector("#player-x-card");
const playerOCard = document.querySelector("#player-o-card");
const newRoundButton = document.querySelector("#new-round");
const resetScoresButton = document.querySelector("#reset-scores");
const winnerDialog = document.querySelector("#winner-dialog");
const winnerSymbol = document.querySelector("#winner-symbol");
const winnerMessage = document.querySelector("#winner-message");
const dialogNewRoundButton = document.querySelector("#dialog-new-round");

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let board = Array(9).fill("");
let currentPlayer = "X";
let roundOver = false;
let nextRoundTimeout;
const scores = { X: 0, O: 0, draws: 0 };

function updateTurnIndicator() {
  playerXCard.classList.toggle("is-active", !roundOver && currentPlayer === "X");
  playerOCard.classList.toggle("is-active", !roundOver && currentPlayer === "O");
}

function updateScores() {
  scoreXText.textContent = scores.X;
  scoreOText.textContent = scores.O;
  scoreDrawText.textContent = scores.draws;
}

function finishRound(winnerLine) {
  if (winnerLine) {
    roundOver = true;
    scores[currentPlayer] += 1;
    statusText.textContent = `Congratulations, Player ${currentPlayer}!`;
    winnerSymbol.textContent = currentPlayer === "X" ? "×" : "○";
    winnerSymbol.classList.toggle("mark-o", currentPlayer === "O");
    winnerMessage.textContent = `Player ${currentPlayer}, that's a brilliant three in a row!`;
    winnerDialog.showModal();
    winnerLine.forEach((index) => cells[index].classList.add("is-winning"));
  } else if (board.every((mark) => mark !== "")) {
    roundOver = true;
    scores.draws += 1;
    statusText.textContent = "It's a draw! Next round starting…";
  }

  if (roundOver) {
    cells.forEach((cell) => {
      cell.disabled = true;
    });
    updateScores();
    updateTurnIndicator();
    nextRoundTimeout = setTimeout(startNewRound, 3500);
  }
}

function playCell(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.cell);

  if (roundOver || board[index] !== "") {
    return;
  }

  board[index] = currentPlayer;
  cell.textContent = currentPlayer === "X" ? "×" : "○";
  cell.classList.add(currentPlayer === "X" ? "mark-x" : "mark-o");
  cell.setAttribute("aria-label", `${cell.getAttribute("aria-label")}, Player ${currentPlayer}`);
  cell.disabled = true;

  const winnerLine = winningLines.find((line) =>
    line.every((lineIndex) => board[lineIndex] === currentPlayer),
  );

  if (winnerLine || board.every((mark) => mark !== "")) {
    finishRound(winnerLine);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  updateTurnIndicator();
}

function startNewRound() {
  clearTimeout(nextRoundTimeout);
  if (winnerDialog.open) {
    winnerDialog.close();
  }
  board = Array(9).fill("");
  currentPlayer = "X";
  roundOver = false;
  statusText.textContent = "Player X's turn";

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 3) + 1;
    const column = (index % 3) + 1;
    cell.textContent = "";
    cell.disabled = false;
    cell.classList.remove("mark-x", "mark-o", "is-winning");
    cell.setAttribute("aria-label", `Row ${row}, column ${column}`);
  });

  updateTurnIndicator();
}

function resetScores() {
  scores.X = 0;
  scores.O = 0;
  scores.draws = 0;
  updateScores();
  startNewRound();
}

cells.forEach((cell) => cell.addEventListener("click", playCell));
newRoundButton.addEventListener("click", startNewRound);
dialogNewRoundButton.addEventListener("click", startNewRound);
resetScoresButton.addEventListener("click", resetScores);

updateTurnIndicator();
