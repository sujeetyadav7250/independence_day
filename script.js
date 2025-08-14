// Independence Day Surprise JavaScript

// Global variables
let fireworksInterval;
let flagHoisted = false;
let currentQuestion = 0;

// Quiz questions
const quizQuestions = [
    {
        question: "When did India gain independence?",
        options: ["1947", "1950", "1945", "1942"],
        correct: "1947"
    },
    {
        question: "Who was the first Prime Minister of India?",
        options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Sardar Patel", "Subhash Chandra Bose"],
        correct: "Jawaharlal Nehru"
    },
    {
        question: "What is the national animal of India?",
        options: ["Lion", "Tiger", "Elephant", "Peacock"],
        correct: "Tiger"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Show loading screen
    setTimeout(() => {
        hideLoadingScreen();
        showMainContainer();
    }, 3000);

    // Event listeners
    document.getElementById('start-surprise').addEventListener('click', startSurprise);
    document.getElementById('hoist-flag').addEventListener('click', hoistFlag);
    document.getElementById('play-anthem').addEventListener('click', playNationalAnthem);
    document.getElementById('share-message').addEventListener('click', shareMessage);
    document.getElementById('close-surprise').addEventListener('click', closeSurprise);
    document.querySelector('.close').addEventListener('click', closeSurprise);

    // Initialize quiz
    initializeQuiz();
}

// Loading screen functions
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
}

function showMainContainer() {
    const mainContainer = document.getElementById('main-container');
    mainContainer.classList.remove('hidden');
}

// Surprise sequence
function startSurprise() {
    const heroSection = document.querySelector('.hero');
    const interactiveSection = document.getElementById('interactive-section');
    
    // Smooth transition
    heroSection.style.transform = 'translateY(-100vh)';
    setTimeout(() => {
        heroSection.style.display = 'none';
        interactiveSection.classList.remove('hidden');
        startFireworks();
        showSurpriseModal();
    }, 1000);
}

// Flag hoisting animation
function hoistFlag() {
    if (!flagHoisted) {
        const flag = document.getElementById('hoisted-flag');
        flag.classList.add('hoisted');
        flagHoisted = true;
        
        // Change button text
        document.getElementById('hoist-flag').textContent = 'Flag Hoisted!';
        document.getElementById('hoist-flag').disabled = true;
        
        // Play celebration sound
        playCelebrationSound();
    }
}

// National anthem functionality
function playNationalAnthem() {
    const anthem = document.getElementById('national-anthem');
    const playButton = document.getElementById('play-anthem');
    
    if (anthem.paused) {
        anthem.play();
        playButton.style.background = '#4CAF50';
    } else {
        anthem.pause();
        playButton.style.background = '#000080';
    }
}

// Quiz functionality
function initializeQuiz() {
    loadQuestion(currentQuestion);
    
    document.querySelectorAll('.option').forEach(button => {
        button.addEventListener('click', function() {
            checkAnswer(this.dataset.answer);
        });
    });
}

function loadQuestion(questionIndex) {
    if (questionIndex < quizQuestions.length) {
        const question = quizQuestions[questionIndex];
        document.getElementById('question').textContent = question.question;
        
        const options = document.querySelectorAll('.option');
        question.options.forEach((option, index) => {
            options[index].textContent = option;
            options[index].dataset.answer = option;
            options[index].classList.remove('correct', 'incorrect');
        });
    }
}

function checkAnswer(selectedAnswer) {
    const correctAnswer = quizQuestions[currentQuestion].correct;
    const options = document.querySelectorAll('.option');
    
    options.forEach(option => {
        if (option.dataset.answer === correctAnswer) {
            option.classList.add('correct');
        } else if (option.dataset.answer === selectedAnswer && selectedAnswer !== correctAnswer) {
            option.classList.add('incorrect');
        }
    });
    
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < quizQuestions.length) {
            loadQuestion(currentQuestion);
        } else {
            document.getElementById('quiz-container').innerHTML = 
                '<p style="color: #000080; font-weight: bold;">Quiz Completed! Jai Hind! 🇮🇳</p>';
        }
    }, 1500);
}

// Message sharing
function shareMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    
    if (message) {
        const messagesDisplay = document.getElementById('messages-display');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'shared-message';
        messageDiv.innerHTML = `
            <p>${message}</p>
            <small>${new Date().toLocaleString()}</small>
        `;
        messagesDisplay.appendChild(messageDiv);
        messageInput.value = '';
        
        // Add some style to shared messages
        messageDiv.style.cssText = `
            background: linear-gradient(45deg, #ff9933, #138808);
            color: white;
            padding: 10px;
            margin: 10px 0;
            border-radius: 10px;
            animation: slideIn 0.5s ease;
        `;
    }
}

// Fireworks animation
function startFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const fireworks = [];
    
    class Firework {
        constructor(x, y, targetX, targetY) {
            this.x = x;
            this.y = y;
            this.targetX = targetX;
            this.targetY = targetY;
            this.speed = 2;
            this.angle = Math.atan2(targetY - y, targetX - x);
            this.particles = [];
            this.exploded = false;
        }
        
        update() {
            if (!this.exploded) {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;
                
                if (Math.abs(this.y - this.targetY) < 5) {
                    this.explode();
                }
            }
            
            this.particles.forEach(particle => {
                particle.update();
            });
        }
        
        explode() {
            this.exploded = true;
            for (let i = 0; i < 20; i++) {
                this.particles.push(new Particle(this.x, this.y));
            }
        }
        
        draw() {
            if (!this.exploded) {
                ctx.fillStyle = '#ff9933';
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            
            this.particles.forEach(particle => {
                particle.draw();
            });
        }
    }
    
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.speed = Math.random() * 3 + 1;
            this.angle = Math.random() * Math.PI * 2;
            this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
            this.alpha = 1;
            this.decay = Math.random() * 0.02 + 0.01;
        }
        
        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.alpha -= this.decay;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (Math.random() < 0.1) {
            fireworks.push(new Firework(
                Math.random() * canvas.width,
                canvas.height,
                Math.random() * canvas.width,
                Math.random() * canvas.height * 0.5
            ));
        }
        
        fireworks.forEach((firework, index) => {
            firework.update();
            firework.draw();
            
            if (firework.exploded && firework.particles.every(p => p.alpha <= 0)) {
                fireworks.splice(index, 1);
            }
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Surprise modal
function showSurpriseModal() {
    setTimeout(() => {
        const modal = document.getElementById('surprise-modal');
        modal.classList.remove('hidden');
        createConfetti();
    }, 2000);
}

function closeSurprise() {
    const modal = document.getElementById('surprise-modal');
    modal.classList.add('hidden');
}

function createConfetti() {
    const confettiContainer = document.querySelector('.surprise-animation');
    const colors = ['#ff9933', '#ffffff', '#138808', '#000080'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            animation: confetti-fall ${Math.random() * 3 + 2}s linear infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        confettiContainer.appendChild(confetti);
    }
}

// Utility functions
function playCelebrationSound() {
    // Create audio context for celebration sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Responsive handling
window.addEventListener('resize', () => {
    const canvas = document.getElementById('fireworks-canvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

// Add some CSS animations via JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});
