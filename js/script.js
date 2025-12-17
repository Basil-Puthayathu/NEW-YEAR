// ***************************************************************
// *** UPDATED IMAGE PATH: 'image/her.jpg' ***
const PUZZLE_IMAGE_URL = 'image/her.jpg'; 
// ***************************************************************
const TILE_COUNT = 9;
let pieces = [];
let attempts = 0;
let selectedTile = null;

// --- 1. Star Animation Logic (Increased Size) ---
const canvas = document.getElementById('star-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let stars = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Star {
    constructor() {
        this.reset(true);
    }
    reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -10;
        this.size = Math.random() * 3 + 2; // Increased size: 2 to 5
        this.speed = Math.random() * 0.1 + 0.05; // Slower, more gentle fall
        this.opacity = Math.random() * 0.6 + 0.4;
        this.twinkleSpeed = Math.random() * 0.05;
    }
    update() {
        this.y += this.speed;
        // Subtle horizontal drift for a dynamic look
        this.x += Math.sin(Date.now() * this.twinkleSpeed / 2) * 0.1;
        this.opacity = (Math.sin(Date.now() * this.twinkleSpeed) * 0.2) + 0.5; // Twinkle effect
        if (this.y > height) this.reset();
    }
    draw() {
        ctx.fillStyle = `rgba(255, 215, 0, ${this.opacity})`; // Goldish
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Reduced number for larger stars to prevent clutter
for(let i=0; i<40; i++) stars.push(new Star()); 

function animateStars() {
    ctx.clearRect(0, 0, width, height);
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    requestAnimationFrame(animateStars);
}
animateStars();


// --- 2. Typing Animation Function ---
function typeWriter(elementId, text, speed) {
    let i = 0;
    const element = document.getElementById(elementId);
    element.innerText = ''; // Clear existing text
    element.style.whiteSpace = 'nowrap';
    element.style.borderRight = '3px solid #555'; // Start cursor

    function type() {
        if (i < text.length) {
            element.innerText += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            element.style.borderRight = 'none'; // Remove cursor
            element.style.whiteSpace = 'normal'; // Allow wrapping after typing
        }
    }
    type();
}

// --- 3. Page Navigation ---
function nextSlide(slideNumber) {
    // Intro Animation (Year transition) only on moving from slide 1 to 2
    if (slideNumber === 2) {
        document.getElementById('year-animator').style.transform = 'translateY(-50%)'; // 5 -> 6 rise up
    }

    // Hide all slides
    document.querySelectorAll('.slide').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none'; 
    });
    
    // Show new slide
    const newSlide = document.getElementById('slide' + slideNumber);
    newSlide.style.display = 'flex';
    
    setTimeout(() => {
        newSlide.classList.add('active');
        // Special logic for specific slides
        if (slideNumber === 2) {
            // Trigger typing animation for Slide 2 paragraphs
            const p1 = document.getElementById('p1').innerText;
            const p2 = document.getElementById('p2').innerText;
            
            // Clear the static text first
            document.getElementById('p1').innerText = '';
            document.getElementById('p2').innerText = '';

            // Sequence the typing animations
            typeWriter('p1', p1, 50);
            setTimeout(() => {
                typeWriter('p2', p2, 50);
            }, p1.length * 50 + 500); // Start p2 after p1 is done + 0.5s pause
        }
        if (slideNumber === 3) {
            initPuzzleGame();
        }
    }, 10);
}


// --- 4. Puzzle Game Logic (Slide 3) ---
function initPuzzleGame() {
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = '';
    pieces = Array.from({ length: TILE_COUNT }, (_, i) => i); // [0, 1, 2, ..., 8]
    
    // Randomize the pieces (Fisher-Yates shuffle)
    for (let i = pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }

    attempts = 0;
    document.getElementById('attempts').innerText = attempts;

    for (let i = 0; i < TILE_COUNT; i++) {
        const tile = document.createElement('div');
        tile.classList.add('puzzle-tile');
        tile.dataset.current = pieces[i];
        tile.dataset.correct = i; // The correct position index
        tile.id = `tile-${i}`;
        
        // Calculate the background position
        const correctPos = pieces[i]; // The piece number
        const row = Math.floor(correctPos / 3);
        const col = correctPos % 3;
        
        tile.style.backgroundImage = `url(${PUZZLE_IMAGE_URL})`;
        tile.style.backgroundPosition = `${col * 50}% ${row * 50}%`;
        
        tile.addEventListener('click', handleTileClick);
        gameArea.appendChild(tile);
    }
}

function handleTileClick(event) {
    const tile = event.currentTarget;

    if (selectedTile === null) {
        // Select the first tile
        selectedTile = tile;
        tile.style.border = '2px solid red';
    } else if (selectedTile === tile) {
        // Deselect the tile
        selectedTile.style.border = '1px solid rgba(255, 255, 255, 0.5)';
        selectedTile = null;
    } else {
        // Swap the tiles and check win condition
        swapTiles(selectedTile, tile);
        
        // Deselect both tiles
        selectedTile.style.border = '1px solid rgba(255, 255, 255, 0.5)';
        tile.style.border = '1px solid rgba(255, 255, 255, 0.5)';
        selectedTile = null;

        attempts++;
        document.getElementById('attempts').innerText = attempts;
    }
}

function swapTiles(t1, t2) {
    // Get current piece number strings
    const piece1 = t1.dataset.current;
    const piece2 = t2.dataset.current;

    // Swap piece number data attributes
    t1.dataset.current = piece2;
    t2.dataset.current = piece1;

    // Recalculate and apply new background styles
    t1.style.backgroundPosition = getBackgroundPosition(piece2);
    t2.style.backgroundPosition = getBackgroundPosition(piece1);
}

function getBackgroundPosition(pieceIndex) {
    const correctPos = parseInt(pieceIndex);
    const row = Math.floor(correctPos / 3);
    const col = correctPos % 3;
    return `${col * 50}% ${row * 50}%`;
}

function checkWin() {
    const tiles = document.querySelectorAll('.puzzle-tile');
    let isWin = true;
    
    tiles.forEach(tile => {
        // Check if the current piece number matches the tile's correct position index
        if (tile.dataset.current !== tile.dataset.correct) {
            isWin = false;
        }
    });

    if (isWin) {
        showModal('win');
    } else {
        showModal('fail');
    }
}

function showModal(type) {
    const modal = document.getElementById('game-modal');
    const header = document.getElementById('modal-header');
    const text = document.getElementById('modal-text');
    const button = document.getElementById('modal-button');

    if (type === 'win') {
        header.innerText = "You're a Genius! 🎉";
        text.innerText = "You are intelligent, creative, and beautiful! Now enjoy your New Year's wish!";
        button.innerText = "Claim Your Wish";
        button.onclick = () => {
            modal.style.display = 'none';
            createConfetti(100);
            setTimeout(() => nextSlide(4), 500);
        };
    } else { // fail
        header.innerText = "Not Quite! 😉";
        text.innerText = "I know you were just teasing me and holding back! You get another chance to prove your genius.";
        button.innerText = "Try Again";
        button.onclick = () => {
            modal.style.display = 'none';
            // User keeps playing on the current board
        };
    }
    modal.style.display = 'flex';
}


// --- 5. Handling Response & Email ---
function handleResponse(answer) {
    nextSlide(5);
    const header = document.getElementById('final-header');
    const msg = document.getElementById('final-message');

    if (answer === 'yes') {
        header.innerText = "Yay! ❤️";
        msg.innerText = "I'm so glad you liked it. Happy New Year!";
        createConfetti(100);
        sendEmail("Successful");
    } else {
        header.innerText = "Thank You";
        msg.innerText = "Thank you for spending time on this wish. I only have my time to spend for you, and I will try to do my best next time.";
        sendEmail("Try Next Time");
    }
}

function createConfetti(count) {
    for(let i=0; i<count; i++) {
        const conf = document.createElement('div');
        conf.classList.add('confetti');
        conf.style.left = Math.random() * 100 + 'vw';
        conf.style.animationDuration = Math.random() * 3 + 2 + 's';
        conf.style.backgroundColor = Math.random() > 0.5 ? '#ff2a4d' : '#FFD700';
        document.body.appendChild(conf);
        
        // Cleanup after animation
        setTimeout(() => conf.remove(), 5000);
    }
}

function sendEmail(statusMessage) {
    const templateParams = {
        to_email: 'basilputhaythuu@gmail.com', // Replace with receiver's email if needed
        message: statusMessage
    };

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(function(response) {
           console.log('SUCCESS!', response.status, response.text);
        }, function(error) {
           console.log('FAILED...', error);
           console.error('EmailJS failed. Did you replace YOUR_SERVICE_ID and YOUR_TEMPLATE_ID?', error);
        });
}

// Ensure functions are globally available by attaching to window if necessary
window.nextSlide = nextSlide;
window.checkWin = checkWin;
window.handleResponse = handleResponse;