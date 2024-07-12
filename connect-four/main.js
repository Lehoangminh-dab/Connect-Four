const TOTAL_ROWS = 6;
const TOTAL_COLUMNS = 7;
const UNTAKEN = 0;
const PLAYER_ONE = 1;
const PLAYER_TWO = 2;
const WINNING_LINE_LENGTH = 4;

let playerTurnDisplay;
let currentPlayerTurn;
let squares;

function loadGame() {
  loadPlayerTurnDisplay();
  loadGrid();
  loadEventListeners();
}

function loadGrid() {
  const grid = document.createElement('div');
  grid.classList.add('grid');

  const TOTAL_GRID_SQUARES = TOTAL_ROWS * TOTAL_COLUMNS;
  for (let i = 0; i < TOTAL_GRID_SQUARES; i++) {
    const gridSquare = document.createElement('div');
    gridSquare.classList.add('grid-square');
    grid.appendChild(gridSquare);
  }

  const gridContainer = document.createElement('div');
  gridContainer.classList.add('grid-container');
  gridContainer.appendChild(grid);
  document.body.appendChild(gridContainer);

  squares = Array.from(document.querySelectorAll('.grid-square'));
}

function loadPlayerTurnDisplay() {
  currentPlayerTurn = PLAYER_ONE;

  const playerTurnDisplayContainer = document.createElement('div');
  playerTurnDisplayContainer.classList.add('player-turn-display-container');

  playerTurnDisplay = document.createElement('h1');
  playerTurnDisplay.classList.add('player-turn-display');
  playerTurnDisplay.innerText = 'Current Player: ' + currentPlayerTurn;

  playerTurnDisplayContainer.appendChild(playerTurnDisplay);

  document.body.appendChild(playerTurnDisplayContainer);
}

function loadEventListeners() {
  squares.forEach(square => {
    square.addEventListener('click', handleSquareClick);
  });
}

function handleSquareClick() {
  if (checkIfSquareCanBeTaken(this)) {
    takeSquare(this);
    switchPlayerTurn();
    console.log('Square taken');
  } 
  else {
    showInvalidActionAlert();
  }

  if (checkIfGameWon()) {
    showPlayerWonDisplay();
    removeSquareEventListeners(this);
  }
}

function checkIfSquareCanBeTaken(square) {
  return checkIfSquareIsUntaken(square) && checkIfSquareIsAboveTakenSquare(square);
}

function checkIfSquareIsUntaken(square) {
  let squareBelongsToPlayerOne = square.classList.contains('player-one');
  let squareBelongsToPlayerTwo = square.classList.contains('player-two');

  return !squareBelongsToPlayerOne && !squareBelongsToPlayerTwo;
}

function checkIfSquareIsAboveTakenSquare(square) {
  if (checkIfSquareIsOnBottomRow(square)) {
    return true;
  }

  const squareBelowIndex = squares.indexOf(square) + TOTAL_COLUMNS;
  const squareBelow = squares[squareBelowIndex];
  if (!checkIfSquareIsUntaken(squareBelow)) {
    return true;
  }

  return false;
}

function checkIfSquareIsOnBottomRow(square) {
  const squareIndex = squares.indexOf(square);
  const bottomRowLowerLimit = (TOTAL_ROWS * TOTAL_COLUMNS) - TOTAL_COLUMNS;
  const bottomRowUpperLimit = TOTAL_ROWS * TOTAL_COLUMNS;
  return squareIndex >= bottomRowLowerLimit && squareIndex <= bottomRowUpperLimit;
}

function takeSquare(square) {
  switch(currentPlayerTurn) {
    case PLAYER_ONE:
      square.classList.add('player-one');
      break;
    case PLAYER_TWO:
      square.classList.add('player-two');
      break;
  }
}

function switchPlayerTurn() {
  switch(currentPlayerTurn) {
    case PLAYER_ONE:
      currentPlayerTurn = PLAYER_TWO;
      break;
    case PLAYER_TWO:
      currentPlayerTurn = PLAYER_ONE;
      break;
  }

  playerTurnDisplay.innerText = 'Current Player: ' + currentPlayerTurn;
}

function showInvalidActionAlert() {
  alert('Invalid Action!');
}

function checkIfGameWon() {
  return checkHorizontalLines() ||
  checkVerticalLines() ||
  checkLeftToRightDiagonalLines() ||
  checkRightToLeftDiagonalLines();
}

function checkHorizontalLines() {
  const lastRowStartIndex = TOTAL_COLUMNS * (TOTAL_ROWS - 1);
  for (let rowStartIndex = 0; rowStartIndex <= lastRowStartIndex; rowStartIndex += TOTAL_COLUMNS) {
    const lineStartIndex = rowStartIndex;
    const indexDifference = 1;
    const lineEndIndex = lineStartIndex + (indexDifference * (TOTAL_COLUMNS - 1));

    if (checkLine(lineStartIndex, lineEndIndex, indexDifference)) {
      return true;
    }
  }

  return false;
}

function checkVerticalLines() {
  const lastColumnStartIndex = TOTAL_COLUMNS - 1;
  for (let columnStartIndex = 0; columnStartIndex <= lastColumnStartIndex; columnStartIndex += 1) {
    const lineStartIndex = columnStartIndex;
    const indexDifference = TOTAL_COLUMNS;
    const lineEndIndex = lineStartIndex + (indexDifference * (TOTAL_ROWS - 1));

    if (checkLine(lineStartIndex, lineEndIndex, indexDifference)) {
      return true;
    }
  }

  return false;
}

function checkLeftToRightDiagonalLines() {
  return checkLeftToRightDiagonalBottomRoots() ||
  checkLeftToRightDiagonalLeftRoots();
}

function checkLeftToRightDiagonalBottomRoots() {
  const minBottomDiagonalRootIndex = TOTAL_COLUMNS * (TOTAL_ROWS - 1);
  const maxBottomDiagonalRootIndex = minBottomDiagonalRootIndex + TOTAL_COLUMNS - WINNING_LINE_LENGTH;

  for (let diagonalRootIndex = minBottomDiagonalRootIndex; diagonalRootIndex <= maxBottomDiagonalRootIndex; diagonalRootIndex += 1) {
    const lineEndIndex = diagonalRootIndex;
    const indexDifference = TOTAL_COLUMNS - 1;
    const lineStartIndex = getLeftToRightDiagonalLineStartIndex(lineEndIndex);

    if (checkLine(lineEndIndex, lineStartIndex, indexDifference)) {
      return true;
    }
  }

  return false;
}

function checkLeftToRightDiagonalLeftRoots() {
  // Exclude the first WINNING_LINE_LENGTH - 1 rows because
  // none of those rows' roots will produce a line with WINNING_LINE_LENGTH.
  const minLeftDiagonalRootIndex = (WINNING_LINE_LENGTH - 1) * TOTAL_COLUMNS; 

  // Exclude the bottom row as it is already checked.
  const maxLeftDiagonalRootIndex = TOTAL_COLUMNS * (TOTAL_ROWS - 2); 

  for (let diagonalRootIndex = minLeftDiagonalRootIndex; diagonalRootIndex <= maxLeftDiagonalRootIndex; diagonalRootIndex += TOTAL_COLUMNS) {
    const lineEndIndex = diagonalRootIndex;
    const indexDifference = TOTAL_COLUMNS - 1;
    const lineStartIndex = getLeftToRightDiagonalLineStartIndex(lineEndIndex);
    if (checkLine(lineStartIndex, lineEndIndex, indexDifference)) {
      return true;
    }
  }

  return false;
}

function getLeftToRightDiagonalLineStartIndex(lineEndIndex) {
  const indexDifference = 1 - TOTAL_COLUMNS;
  const startRow = Math.floor(lineEndIndex / TOTAL_COLUMNS) + 1;
  const startColumn = lineEndIndex + 8 - 7 * startRow;
  const diagonalLength = Math.min((TOTAL_COLUMNS - startColumn + 1), startRow);
  const lineStartIndex = lineEndIndex + (diagonalLength - 1) * indexDifference;
  
  return lineStartIndex;
}

function checkRightToLeftDiagonalLines() {
  return checkRightToLeftDiagonalBottomRoots() ||
  checkRightToLeftDiagonalRightRoots();
}

function checkRightToLeftDiagonalBottomRoots() {
  const minBottomDiagonalRootIndex = TOTAL_COLUMNS * (TOTAL_ROWS - 1) + (WINNING_LINE_LENGTH - 1);
  const maxBottomDiagonalRootIndex = TOTAL_COLUMNS * (TOTAL_ROWS) - 1;

  for (let diagonalRootIndex = minBottomDiagonalRootIndex; diagonalRootIndex <= maxBottomDiagonalRootIndex; diagonalRootIndex += 1) {
    const lineEndIndex = diagonalRootIndex;
    const indexDifference = TOTAL_COLUMNS + 1;
    const lineStartIndex = getRightToLeftDiagonalLineStartIndex(lineEndIndex);

    if (checkLine(lineEndIndex, lineStartIndex, indexDifference)) {
      return true;
    }
  }

  return false;
}

function checkRightToLeftDiagonalRightRoots() {
  const minBottomDiagonalRootIndex = TOTAL_COLUMNS * WINNING_LINE_LENGTH - 1;
  const maxBottomDiagonalRootIndex = TOTAL_COLUMNS * (TOTAL_ROWS - 1) - 1;

  for (let diagonalRootIndex = minBottomDiagonalRootIndex; diagonalRootIndex <= maxBottomDiagonalRootIndex; diagonalRootIndex += TOTAL_COLUMNS) {
    const lineEndIndex = diagonalRootIndex;
    const indexDifference = TOTAL_COLUMNS + 1;
    const lineStartIndex = getRightToLeftDiagonalLineStartIndex(lineEndIndex);

    if (checkLine(lineEndIndex, lineStartIndex, indexDifference)) {
      return true;
    }
  }

  return false;
}

function getRightToLeftDiagonalLineStartIndex(lineEndIndex) {
  const indexDifference = -TOTAL_COLUMNS - 1;
  const startRow = Math.floor(lineEndIndex / TOTAL_COLUMNS) + 1;
  const startColumn = lineEndIndex + 8 - 7 * startRow;
  const diagonalLength = Math.min(startRow, startColumn);
  const lineStartIndex = lineEndIndex + (diagonalLength - 1) * indexDifference;
  
  return lineStartIndex;
}

function checkLine(lineStartIndex, lineEndIndex, indexDifference) {
  // If lineStartIndex is higher than lineEndIndex, the loop will not run.
  if (lineStartIndex > lineEndIndex) {
    const temp = lineStartIndex;
    lineStartIndex = lineEndIndex;
    lineEndIndex = temp;
  }

  // If indexDifference is negative, the loop will run until the index is out of bounds.
  if (indexDifference < 0) {
    indexDifference *= -1;
  }

  for (let startSquareIndex = lineStartIndex; startSquareIndex <= lineEndIndex - (3 * indexDifference); startSquareIndex += indexDifference) {
    const startSquare = squares[startSquareIndex]
    const startSquareOwner = getOwner(startSquare);
    if (startSquareOwner == UNTAKEN) continue;

    for (let endSquareIndex = startSquareIndex + indexDifference; endSquareIndex <= lineEndIndex; endSquareIndex += indexDifference) {
      const endSquare = squares[endSquareIndex]
      const endSquareOwner = getOwner(endSquare);
      if (endSquareOwner == UNTAKEN) break;
      if (endSquareOwner != startSquareOwner) break;
  
      const lineLength = ((endSquareIndex - startSquareIndex) / indexDifference) + 1;
      
      if (lineLength >= 4) {
        return true;
      }
    }
  }

  return false;
}


function getOwner(square) {
  switch (true) {
    case square.classList.contains('player-one'):
      return PLAYER_ONE;
    case square.classList.contains('player-two'):
      return PLAYER_TWO;
  }

  return UNTAKEN;
}

function showPlayerWonDisplay() {
  switchPlayerTurn();
  playerTurnDisplay.innerText = 'Player ' + currentPlayerTurn + ' Won!';
}

function removeSquareEventListeners(square) {
  console.log('TEST: square event listeners removed.')
}

document.addEventListener('DOMContentLoaded', loadGame);