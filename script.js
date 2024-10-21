// Modal Functions
function openModal(gameId) {
  const contents = document.querySelectorAll('.game-content');
  const hubContainer = document.querySelector('.hub-container');

  // Hide the hub
  hubContainer.style.display = 'none';

  // Hide all other game sections and show the selected one
  contents.forEach(content => content.style.display = 'none');
  document.getElementById(gameId).style.display = 'block';

  // Start the appropriate game
  if (gameId === 'oddoneout') {
      initializeGame(); // Initialize Odd One Out game
  } else if (gameId === 'letter-recall') {
      startGame(); // Initialize Letter Recall Game
  } else if (gameId === 'chain-play') {
      // Chain Play doesn't need initialization, just display
  }
}

function closeGame() {
  const contents = document.querySelectorAll('.game-content');
  const hubContainer = document.querySelector('.hub-container');

  // Show the hub again
  hubContainer.style.display = 'block';
  contents.forEach(content => content.style.display = 'none');
}

// Odd One Out Game
const grid = document.getElementById('grid');
const restartBtn = document.getElementById('restart');
const levelDisplay = document.getElementById('level');
const gridSize = 16;
let oddIndex;
let currentLevel = 1;

function initializeGame() {
  grid.innerHTML = '';
  levelDisplay.textContent = currentLevel;

  oddIndex = Math.floor(Math.random() * gridSize);

  const colors = generateColors(currentLevel);

  for (let i = 0; i < gridSize; i++) {
      const div = document.createElement('div');
      div.classList.add('grid-item');

      if (i === oddIndex) {
          div.classList.add('odd');
          div.style.backgroundColor = colors.odd;
      } else {
          div.style.backgroundColor = colors.normal;
      }

      div.addEventListener('click', () => {
          if (i === oddIndex) {
              alert('Correct! You found the odd one.');
              currentLevel++;
              if (currentLevel <= 10) {
                  initializeGame();
              } else {
                  alert('Congratulations! You beat all the levels! Would you like to retry or play a different game?');
                  resetGame();
              }
          } else {
              alert('Try again!');
          }
      });

      grid.appendChild(div);
  }
}

function generateColors(level) {
  const baseColorValue = 80 + (level - 1) * 15;
  const oddColorValue = baseColorValue + 10;

  return {
      odd: `rgb(${oddColorValue}, ${oddColorValue}, ${oddColorValue})`,
      normal: `rgb(${baseColorValue}, ${baseColorValue}, ${baseColorValue})`
  };
}

restartBtn.addEventListener('click', resetGame);

function resetGame() {
  currentLevel = 1;
  initializeGame();
}

// Letter Recall Game Logic
let letterSequence = [];
let userInput = '';
let currentLevel2 = 1; 
let maxLevel = 5; 
let attempts = 2;
let difficulty = 'easy';
let startingLetters = 2; 
let timer = 15; 
let timerInterval;
const letterDisplay = document.getElementById('letter-display');
const userInputField = document.getElementById('user-input');
const messageDisplay = document.getElementById('message');
const restartButton = document.getElementById('restart-btn');
const difficultyButtons = document.getElementById('difficulty-buttons');
const currentLevelDisplay = document.getElementById('current-level');
const timerDisplay = document.getElementById('timer');
const hintDisplay = document.getElementById('hint');

function generateLetterSequence(length) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  letterSequence = [];
  for (let i = 0; i < length; i++) {
      letterSequence.push(letters.charAt(Math.floor(Math.random() * letters.length)));
  }
}

function startGame() {
  attempts = 2;
  generateLetterSequence(currentLevel2 + startingLetters - 1);
  displayLetters();
  updateHint();
  startTimer();
}

function displayLetters() {
  letterDisplay.textContent = letterSequence.join(' ');
  letterDisplay.style.opacity = '1';
  userInputField.disabled = true;
  userInputField.style.opacity = '0';
  userInputField.style.display = 'none';

  setTimeout(() => {
      letterDisplay.style.opacity = '0';
      userInputField.disabled = false;
      userInputField.style.opacity = '1';
      userInputField.style.display = 'block';
      userInputField.focus();
  }, 3000);
}

function updateHint() {
  hintDisplay.textContent = `${letterSequence.length} ${'X'.repeat(letterSequence.length)}`;
}

function handleTyping() {
  const input = userInputField.value.trim().toUpperCase();
  const hint = letterSequence.map((letter, index) => (input[index] === letter ? letter : 'X')).join('');
  hintDisplay.textContent = `${letterSequence.length} ${hint}`;
}

function startTimer() {
  clearInterval(timerInterval);
  let timeLeft = timer;
  timerDisplay.textContent = `Time: ${timeLeft}s`;

  timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `Time: ${timeLeft}s`;

      if (timeLeft <= 0) {
          clearInterval(timerInterval);
          checkAnswer();
      }
  }, 1000);
}

function checkAnswer() {
  userInput = userInputField.value.trim().toUpperCase();
  userInputField.value = '';

  if (userInput === letterSequence.join('')) {
      messageDisplay.textContent = 'Correct! You remembered the sequence!';
      messageDisplay.style.color = '#4caf50';
      currentLevel2++;
      clearHint();

      if (currentLevel2 <= maxLevel) {
          currentLevelDisplay.textContent = `Level: ${currentLevel2}`;
          setTimeout(() => {
              messageDisplay.textContent = '';
              startGame();
          }, 2000);
      } else {
          messageDisplay.textContent += ' You completed all levels!';
          restartButton.textContent = 'Play Again';
          restartButton.style.display = 'block';
      }
  } else {
      attempts--;
      if (attempts > 0) {
          messageDisplay.textContent = `Incorrect! You have ${attempts} attempt(s) left.`;
          messageDisplay.style.color = '#f44336';
          userInputField.focus();
      } else {
          messageDisplay.textContent = `Incorrect! The correct sequence was: ${letterSequence.join(' ')}`;
          clearHint();
          restartButton.style.display = 'block';
      }
  }
}

function clearHint() {
  hintDisplay.textContent = '';
}

function setDifficulty(level) {
  difficulty = level;

  switch (level) {
      case 'easy':
          maxLevel = 5;
          startingLetters = 2;
          timer = 15;
          break;
      case 'medium':
          maxLevel = 10;
          startingLetters = 3;
          timer = 12;
          break;
      case 'hard':
          maxLevel = 15;
          startingLetters = 4;
          timer = 10;
          break;
  }

  difficultyButtons.style.display = 'none';
  currentLevelDisplay.textContent = `Level: 1`;
  startGame();
}

restartButton.addEventListener('click', () => {
  restartButton.style.display = 'none';
  messageDisplay.textContent = '';
  currentLevel2 = 1;
  clearHint();
  startGame();
});

userInputField.addEventListener('input', handleTyping);

userInputField.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
      checkAnswer();
  }
});

// Chain Play Game Logic (Your Game)
let wordList = [];
let chain = [];
let playerScore = 0;
let aiScore = 0;
let challengeCount = 0;
let currentWord;

Promise.all([
  fetch('words.txt').then(response => response.text()),
  fetch('word1.txt').then(response => response.text())
])
.then(texts => {
  wordList = texts.join('\n').split('\n').map(word => word.trim().toLowerCase());
  aiTurn();
});

document.getElementById('player-word').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
      playerTurn();
  }
});

function playerTurn() {
  const playerWord = document.getElementById('player-word').value.trim().toLowerCase();
  const lastAIWord = chain.length > 0 ? chain[chain.length - 1] : '';
  const lastLetter = lastAIWord ? lastAIWord.slice(-1).toLowerCase() : '';

  if (isValidWord(playerWord, lastLetter)) {
      chain.push(playerWord);
      updateChain();
      playerScore += calculateScore(playerWord);
      document.getElementById('player-score').textContent = playerScore;
      document.getElementById('player-word').value = '';
      challengeCount = 0;
      currentWord = playerWord;
      setTimeout(aiTurn, 1000);
      document.getElementById('message').textContent = '';
  } else {
      handleInvalidWord(lastLetter);
      document.getElementById('player-word').value = '';
  }
}

function handleInvalidWord(lastLetter) {
  challengeCount++;

  if (challengeCount < 2) {
      suggestNewWord(lastLetter);
  } else {
      document.getElementById('message').textContent = 'You have exhausted your chances.';
      endGame('Game over! You failed to enter a valid word.');
  }
}

function suggestNewWord(lastLetter) {
  const availableSuggestions = wordList.filter(word => word[0] === lastLetter && !chain.includes(word));
  
  if (availableSuggestions.length > 0) {
      const suggestedWord = availableSuggestions[Math.floor(Math.random() * availableSuggestions.length)];
      document.getElementById('message').textContent = `Try to use: '${suggestedWord.toUpperCase()}'`;
      currentWord = suggestedWord;
  } else {
      document.getElementById('message').textContent = 'No suggestions available.';
  }
}

function aiTurn() {
  if (chain.length === 0) {
      const firstWord = wordList[Math.floor(Math.random() * wordList.length)];
      chain.push(firstWord);
      updateChain();
      aiScore += calculateScore(firstWord);
      document.getElementById('ai-score-value').textContent = aiScore;
      currentWord = firstWord;
  } else {
      const lastPlayerWord = chain[chain.length - 1];
      const lastLetter = lastPlayerWord.slice(-1).toLowerCase();
      const aiWord = findAIWord(lastLetter);

      if (aiWord) {
          chain.push(aiWord);
          updateChain();
          aiScore += calculateScore(aiWord);
          document.getElementById('ai-score-value').textContent = aiScore;
          currentWord = aiWord;
      } else {
          endGame('AI couldn\'t find a word. You win!');
      }
  }

  document.getElementById('message').textContent = `Your word must start with '${currentWord.slice(-1).toUpperCase()}'.`;
}

function isValidWord(word, lastLetter) {
  const startsCorrectly = word[0] === lastLetter;
  const notUsed = chain.indexOf(word) === -1;
  const validInList = wordList.includes(word);

  return startsCorrectly && notUsed && validInList;
}

function findAIWord(lastLetter) {
  const availableWords = wordList.filter(word => word[0] === lastLetter && !chain.includes(word));
  return availableWords.length > 0 ? availableWords[Math.floor(Math.random() * availableWords.length)] : null;
}

function calculateScore(word) {
  let score = word.length;
  const rareLetters = ['q', 'x', 'z'];
  for (let letter of rareLetters) {
      if (word.includes(letter)) {
          score += 5;
      }
  }
  return score;
}

function updateChain() {
  document.getElementById('word-chain').textContent = 'Chain: ' + chain.join(' -> ');
}

function endGame(message) {
  document.getElementById('message').textContent = message;
  document.getElementById('player-word').disabled = true;
  document.getElementById('submit-btn').disabled = true;
}
document.addEventListener('DOMContentLoaded', () => {
  // Example event listener for mobile and desktop interaction
  const gameButton = document.querySelector('.game-btn');
  gameButton.addEventListener('click', handleGameClick);
  gameButton.addEventListener('touchstart', handleGameClick); // Add support for touch
});

function handleGameClick() {
  // Start your game logic
  console.log('Game started');
}

// Game Initialization (you already have most of this code, so just ensure touch events are supported)
document.getElementById('grid').addEventListener('touchstart', function(e) {
  // Handle touch interaction for game logic
  console.log('Grid item touched', e.target);
});
document.addEventListener('DOMContentLoaded', () => {
  const gameButton = document.querySelector('.game-btn');
  gameButton.addEventListener('click', handleGameClick);
  gameButton.addEventListener('touchstart', handleGameClick); // Support touch for mobile

  document.getElementById('grid').addEventListener('touchstart', function(e) {
    console.log('Grid item touched', e.target); // Handle touch for grid
  });
});


