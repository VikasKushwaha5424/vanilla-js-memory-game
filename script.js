// ✨ DATA REPOSITORY - Matched exactly to your screenshots
const imageData = {
    // 1. Cats (All .jpg) 
    // You deleted 11.png, so now this list is perfect.
    cats: [
        'assets/Cats/1.jpg', 'assets/Cats/2.jpg', 'assets/Cats/3.jpg', 'assets/Cats/4.jpg',
        'assets/Cats/5.jpg', 'assets/Cats/6.jpg', 'assets/Cats/7.jpg', 'assets/Cats/8.jpg',
        'assets/Cats/9.jpg', 'assets/Cats/10.jpg', 'assets/Cats/11.jpg', 'assets/Cats/12.jpg',
        'assets/Cats/13.jpg', 'assets/Cats/14.jpg', 'assets/Cats/15.jpg', 'assets/Cats/16.jpg',
        'assets/Cats/17.jpg', 'assets/Cats/18.jpg'
    ],

    // 2. Dogs (All .jpg)
    dogs: [
        'assets/Dogs/1.jpg', 'assets/Dogs/2.jpg', 'assets/Dogs/3.jpg', 'assets/Dogs/4.jpg',
        'assets/Dogs/5.jpg', 'assets/Dogs/6.jpg', 'assets/Dogs/7.jpg', 'assets/Dogs/8.jpg',
        'assets/Dogs/9.jpg', 'assets/Dogs/10.jpg', 'assets/Dogs/11.jpg', 'assets/Dogs/12.jpg',
        'assets/Dogs/13.jpg', 'assets/Dogs/14.jpg', 'assets/Dogs/15.jpg', 'assets/Dogs/16.jpg',
        'assets/Dogs/17.jpg', 'assets/Dogs/18.jpg'
    ],

    // 3. Marvels (Mixed: 1-17 are .jpg, 18 is .png)
    // I kept #18 as .png because your screenshot showed it that way.
    marvels: [
        'assets/Marvels/1.jpg', 'assets/Marvels/2.jpg', 'assets/Marvels/3.jpg', 'assets/Marvels/4.jpg',
        'assets/Marvels/5.jpg', 'assets/Marvels/6.jpg', 'assets/Marvels/7.jpg', 'assets/Marvels/8.jpg',
        'assets/Marvels/9.jpg', 'assets/Marvels/10.jpg', 'assets/Marvels/11.jpg', 'assets/Marvels/12.jpg',
        'assets/Marvels/13.jpg', 'assets/Marvels/14.jpg', 'assets/Marvels/15.jpg', 'assets/Marvels/16.jpg',
        'assets/Marvels/17.jpg', 'assets/Marvels/18.png' 
    ],

    // 4. Space (All .png)
    space: [
        'assets/Space/1.png', 'assets/Space/2.png', 'assets/Space/3.png', 'assets/Space/4.png',
        'assets/Space/5.png', 'assets/Space/6.png', 'assets/Space/7.png', 'assets/Space/8.png',
        'assets/Space/9.png', 'assets/Space/10.png', 'assets/Space/11.png', 'assets/Space/12.png',
        'assets/Space/13.png', 'assets/Space/14.png', 'assets/Space/15.png', 'assets/Space/16.png',
        'assets/Space/17.png', 'assets/Space/18.png'
    ]
};

// ✨ SOUNDS SYSTEM (Folder name: Sound)
const sounds = {
    flip: new Audio('assets/Sound/flip.mp3'),
    match: new Audio('assets/Sound/match.mp3'),
    win: new Audio('assets/Sound/win.mp3')
};

sounds.flip.volume = 0.5;
sounds.match.volume = 0.5;
sounds.win.volume = 1.0;

let gameVariables = {
    firstCard: null,
    secondCard: null,
    lockBoard: false,
    moves: 0,
    matches: 0,
    time: 0,
    timerInterval: null,
    totalPairs: 0
};

// Helper to prevent crashes if audio files are missing
function playSound(type) {
    if (sounds[type]) {
        sounds[type].currentTime = 0; 
        sounds[type].play().catch(e => {
            // Only logs to console if there's an error, won't stop the game
            console.error('Audio error:', e);
        });
    }
}

function startGame() {
    resetStats();

    const category = document.getElementById('categorySelect').value;
    const gridValue = document.getElementById('gridSelect').value;
    const [rows, cols] = gridValue.split(',').map(Number);

    const board = document.getElementById('gameBoard');
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    board.innerHTML = '';

    const totalCards = rows * cols;
    const pairsNeeded = totalCards / 2;
    gameVariables.totalPairs = pairsNeeded;

    // Safety Check: If category fails, default to 'cats'
    let selectedImages = imageData[category] ? [...imageData[category]] : [...imageData['cats']];
    
    // 1. Shuffle the full deck of 18 images
    selectedImages.sort(() => Math.random() - 0.5);
    
    // 2. Slice only the number of pairs we need (e.g., 6 for Easy, 18 for Hard)
    let gameImages = selectedImages.slice(0, pairsNeeded);
    
    // 3. Duplicate to create pairs
    let deck = [...gameImages, ...gameImages];
    
    // 4. Shuffle the final playing deck
    deck.sort(() => Math.random() - 0.5);

    deck.forEach(imgUrl => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = imgUrl;
        
        card.innerHTML = `
            <div class="card-face card-front"><i class="fas fa-star"></i></div>
            <div class="card-face card-back">
                <img src="${imgUrl}" onerror="this.src='https://placehold.co/300x300?text=Error'">
            </div>
        `;
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
}

function flipCard() {
    if (gameVariables.lockBoard) return;
    if (this === gameVariables.firstCard) return;
    if (this.classList.contains('matched')) return;

    playSound('flip');

    if (gameVariables.time === 0 && gameVariables.moves === 0 && !gameVariables.timerInterval) {
        startTimer();
    }

    this.classList.add('flipped');

    if (!gameVariables.firstCard) {
        gameVariables.firstCard = this;
        return;
    }

    gameVariables.secondCard = this;
    gameVariables.moves++;
    document.getElementById('moves').textContent = gameVariables.moves;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = gameVariables.firstCard.dataset.image === gameVariables.secondCard.dataset.image;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    playSound('match');

    gameVariables.firstCard.classList.add('matched');
    gameVariables.secondCard.classList.add('matched');
    gameVariables.matches++;
    resetBoard();

    if (gameVariables.matches === gameVariables.totalPairs) {
        endGame();
    }
}

function unflipCards() {
    gameVariables.lockBoard = true;
    setTimeout(() => {
        gameVariables.firstCard.classList.remove('flipped');
        gameVariables.secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [gameVariables.firstCard, gameVariables.secondCard] = [null, null];
    gameVariables.lockBoard = false;
}

function resetStats() {
    clearInterval(gameVariables.timerInterval);
    gameVariables.moves = 0;
    gameVariables.matches = 0;
    gameVariables.time = 0;
    gameVariables.timerInterval = null;
    document.getElementById('moves').textContent = '0';
    document.getElementById('time').textContent = '0:00';
    [gameVariables.firstCard, gameVariables.secondCard, gameVariables.lockBoard] = [null, null, false];
}

function startTimer() {
    gameVariables.timerInterval = setInterval(() => {
        gameVariables.time++;
        const m = Math.floor(gameVariables.time / 60);
        const s = gameVariables.time % 60;
        document.getElementById('time').textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
    }, 1000);
}

function endGame() {
    clearInterval(gameVariables.timerInterval);
    
    setTimeout(() => {
        playSound('win');
    }, 300);

    document.getElementById('finalMoves').textContent = gameVariables.moves;
    document.getElementById('finalTime').textContent = document.getElementById('time').textContent;
    document.getElementById('winModal').classList.add('show');
}

function closeModal() {
    document.getElementById('winModal').classList.remove('show');
    startGame();
}

function toggleTheme() {
    if (document.body.getAttribute('data-theme') === 'dark') {
        document.body.removeAttribute('data-theme');
    } else {
        document.body.setAttribute('data-theme', 'dark');
    }
}

// Start Game
startGame();