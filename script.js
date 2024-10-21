let hasNavigatedToGameHub = false; // Track if user has navigated to game hub

// Function to show the game hub and hide the intro hub
function showGameHub() {
    const introHub = document.getElementById('intro-hub');
    const gameHub = document.getElementById('game-hub');

    // Hide intro hub, show game hub
    introHub.style.display = 'none';
    gameHub.style.display = 'block';
    hasNavigatedToGameHub = true; // Set flag to true after navigating to game hub
}

// Function to show the intro hub and hide the game hub
function showIntroHub() {
    const introHub = document.getElementById('intro-hub');
    const gameHub = document.getElementById('game-hub');

    // Hide game hub, show intro hub
    gameHub.style.display = 'none';
    introHub.style.display = 'block';
    hasNavigatedToGameHub = false; // Reset flag when user clicks the back button
}

// Function to close the game and return to the game hub
function closeGame() {
    const contents = document.querySelectorAll('.game-content');
    const gameHub = document.getElementById('game-hub');

    // Show the game hub again
    gameHub.style.display = 'block';
    contents.forEach(content => content.style.display = 'none');
}

function openModal(gameId) {
    const contents = document.querySelectorAll('.game-content');
    const hubContainer = document.querySelector('.hub-container');
    const gameHub = document.getElementById('game-hub');

    // Hide the hub
    hubContainer.style.display = 'none';
    gameHub.style.display = 'none'; // Ensure the game hub is hidden

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

// Chain Play Game Logic
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
    const input = document.getElementById('player-word');
    const word = input.value.trim().toLowerCase();

    if (!validateWord(word)) {
        document.getElementById('error').textContent = "Invalid word!";
        return;
    }

    chain.push(word);
    playerScore++;
    updateScores();

    document.getElementById('player-word').value = '';
    aiTurn();
}

function validateWord(word) {
    return wordList.includes(word) && (!currentWord || word[0] === currentWord.slice(-1));
}

function aiTurn() {
    const candidates = wordList.filter(word => !chain.includes(word) && (!currentWord || word[0] === currentWord.slice(-1)));

    if (candidates.length === 0) {
        document.getElementById('error').textContent = "AI can't think of a word!";
        return;
    }

    currentWord = candidates[Math.floor(Math.random() * candidates.length)];
    chain.push(currentWord);
    aiScore++;
    updateScores();
}

function updateScores() {
    document.getElementById('score').textContent = `Player: ${playerScore} AI: ${aiScore}`;
}
