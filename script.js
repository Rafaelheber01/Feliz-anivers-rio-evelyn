// Elementos
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const mainScreen = document.getElementById('main-screen');
const startBtn = document.getElementById('start-btn');
const balloonsContainer = document.getElementById('balloons-container');
const scoreDisplay = document.getElementById('score');
const audioControl = document.getElementById('audio-control');
const audioToggle = document.getElementById('audio-toggle');
const backgroundMusic = document.getElementById('background-music');
const photoModal = document.getElementById('photo-modal');
const modalImg = document.getElementById('img-expanded');
const captionText = document.getElementById('caption');
const mainPhotoCard = document.getElementById('main-photo-card');
const closeModal = document.querySelector('.close-modal');
const heartsContainer = document.getElementById('hearts-container');

let score = 0;
const targetScore = 10;
let gameActive = false;
let musicPlaying = false;

// Cores dos balões
const balloonColors = ['🎈', '🎉', '🎊', '🎁', '💝', '🌟', '✨', '💖'];

// Iniciar celebração
startBtn.addEventListener('click', () => {
    // Tocar música na primeira interação para desbloquear áudio no navegador
    playMusic();

    // Mostrar a tela do jogo antes de scrollar
    gameScreen.classList.add('active');

    // Scroll suave para os balões
    gameScreen.scrollIntoView({ behavior: 'smooth' });

    startGame();
});


// Iniciar jogo
function startGame() {
    gameActive = true;
    score = 0;
    updateScore();
    spawnBalloons();
}

// Criar balões
function spawnBalloons() {
    if (!gameActive) return;

    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.textContent = balloonColors[Math.floor(Math.random() * balloonColors.length)];

    // Posição aleatória
    const leftPosition = Math.random() * (window.innerWidth - 80);
    balloon.style.left = leftPosition + 'px';

    // Deriva aleatória
    const drift = (Math.random() - 0.5) * 100;
    balloon.style.setProperty('--drift', drift + 'px');

    balloonsContainer.appendChild(balloon);

    // Evento de clique/toque
    balloon.addEventListener('click', () => popBalloon(balloon));

    // Remover balão após animação
    setTimeout(() => {
        if (balloon.parentNode) {
            balloon.remove();
        }
    }, 4000);

    // Criar novo balão
    if (gameActive) {
        const delay = Math.random() * 800 + 400;
        setTimeout(spawnBalloons, delay);
    }
}

// Estourar balão
function popBalloon(balloon) {
    if (!gameActive || balloon.classList.contains('pop')) return;

    balloon.classList.add('pop');
    score++;
    updateScore();

    // Efeito sonoro (vibração no mobile)
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }

    setTimeout(() => balloon.remove(), 300);

    // Verificar vitória
    if (score >= targetScore) {
        winGame();
    }
}

// Atualizar pontuação
function updateScore() {
    scoreDisplay.textContent = `${score}/${targetScore}`;
}

// Ganhar o jogo
function winGame() {
    gameActive = false;

    // Limpar balões restantes
    balloonsContainer.innerHTML = '';

    // Criar confete
    createConfetti();

    // Transição para tela principal
    setTimeout(() => {
        gameScreen.classList.remove('active');
        mainScreen.classList.add('active');
        audioControl.classList.remove('hidden');

        // Tentar tocar música automaticamente
        playMusic();

        // Iniciar corações flutuantes
        setInterval(createFloatingHeart, 500);

        // Iniciar observador de scroll
        setupScrollReveal();
    }, 2000);
}

// Modal de Foto
if (mainPhotoCard) {
    mainPhotoCard.addEventListener('click', function () {
        photoModal.style.display = "block";
        const img = this.querySelector('img');
        modalImg.src = img.src;
        captionText.innerHTML = "Nosso amor é infinito ❤️";
    });
}

closeModal.addEventListener('click', () => {
    photoModal.style.display = "none";
});

window.addEventListener('click', (event) => {
    if (event.target == photoModal) {
        photoModal.style.display = "none";
    }
});

// Corações Flutuantes
function createFloatingHeart() {
    if (!mainScreen.classList.contains('active')) return;

    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';

    const size = Math.random() * 20 + 10;
    heart.style.fontSize = size + 'px';

    const duration = Math.random() * 3 + 3;
    heart.style.animationDuration = duration + 's';

    heartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

// Scroll Reveal
function setupScrollReveal() {
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

// Criar confete
function createConfetti() {
    const confettiCount = 50;
    const colors = ['#FF1493', '#FFD700', '#00f2fe', '#43e97b', '#f5576c'];

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.zIndex = '9999';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';

        document.body.appendChild(confetti);

        const duration = Math.random() * 3 + 2;
        const drift = (Math.random() - 0.5) * 200;

        confetti.animate([
            {
                transform: 'translateY(0) translateX(0) rotate(0deg)',
                opacity: 1
            },
            {
                transform: `translateY(${window.innerHeight + 20}px) translateX(${drift}px) rotate(${Math.random() * 720}deg)`,
                opacity: 0
            }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        setTimeout(() => confetti.remove(), duration * 1000);
    }
}

// Controle de áudio
audioToggle.addEventListener('click', () => {
    if (musicPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
});

function playMusic() {
    backgroundMusic.play().then(() => {
        musicPlaying = true;
        audioToggle.querySelector('.audio-icon').textContent = '🔊';
    }).catch(err => {
        console.log('Autoplay bloqueado. Usuário precisa interagir primeiro.');
        musicPlaying = false;
        audioToggle.querySelector('.audio-icon').textContent = '🔇';
    });
}

function pauseMusic() {
    backgroundMusic.pause();
    musicPlaying = false;
    audioToggle.querySelector('.audio-icon').textContent = '🔇';
}

// Animação de scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Prevenir zoom em double-tap (iOS)
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Adicionar efeito de parallax nas estrelas (opcional)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const stars = document.querySelectorAll('.stars');
    stars.forEach(star => {
        star.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
});

console.log('🎉 Site carregado! Feliz aniversário, Evelyn! 🎂');
