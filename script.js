document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ANIMAÇÃO DE CHUVA DE PÉTALAS (CANVAS) ---
    const canvas = document.getElementById('petalCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let petals = [];
    const petalColors = ['#FFD1DC', '#FFB7C5', '#DB7093', '#FFFFFF'];

    class Petal {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 5 + 5;
            this.speedY = Math.random() * 1 + 0.5;
            this.speedX = Math.random() * 2 - 1;
            this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 2 - 1;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y * 0.01); // Movimento ondulatório
            this.rotation += this.rotationSpeed;
            if (this.y > canvas.height) {
                this.y = -10;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            // Desenha uma forma de pétala simples
            ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function initPetals() {
        petals = [];
        for (let i = 0; i < 50; i++) { // Quantidade de pétalas
            petals.push(new Petal());
        }
    }

    function animatePetals() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });
        requestAnimationFrame(animatePetals);
    }

    initPetals();
    animatePetals();
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });


    // --- 2. SCROLL ANIMATIONS (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Se for contador de estatísticas, anima números
                if (entry.target.classList.contains('stats-container')) {
                    animateNumbers();
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up, .stats-container').forEach(el => {
        observer.observe(el);
    });


    // --- 3. ANIMAÇÃO DE NÚMEROS (STATS) ---
    function animateNumbers() {
        const numbers = document.querySelectorAll('.stat-number');
        numbers.forEach(num => {
            const target = +num.getAttribute('data-target');
            const increment = target / 50; // Velocidade
            
            const updateCount = () => {
                const count = +num.innerText;
                if (count < target) {
                    num.innerText = Math.ceil(count + increment);
                    setTimeout(updateCount, 30);
                } else {
                    num.innerText = target + (num.parentElement.innerText.includes('%') ? '' : '+');
                }
            };
            updateCount();
        });
    }


    // --- 4. CHECKLIST DE SUSTENTABILIDADE ---
    const checkboxes = document.querySelectorAll('.sust-check');
    const progressBar = document.getElementById('progressBar');
    const scoreVal = document.getElementById('scoreVal');

    checkboxes.forEach(box => {
        box.addEventListener('change', () => {
            let total = checkboxes.length;
            let checked = document.querySelectorAll('.sust-check:checked').length;
            let percentage = (checked / total) * 100;
            
            progressBar.style.width = percentage + '%';
            scoreVal.innerText = Math.round(percentage);
            
            // Efeito visual ao marcar
            if(box.checked) {
                box.parentElement.style.backgroundColor = "#e8f5e9";
            } else {
                box.parentElement.style.backgroundColor = "transparent";
            }
        });
    });


    // --- 5. QUIZ LÓGICA ---
    const questions = [
        { q: "Qual tecnologia ajuda a poupar água no campo?", options: ["Mangueira furada", "Irrigação Inteligente", "Balde de água"], correct: 1 },
        { q: "O que significa Agroecologia?", options: ["Plantar só veneno", "Usar agrotóxicos fortes", "Produzir respeitando a natureza"], correct: 2 },
        { q: "Por que a Reforma Agrária é importante?", options: ["Para todos terem terra para produzir", "Para vender terras caras", "Para abandonar o campo"], correct: 0 }
    ];

    let qIndex = 0;
    let score = 0;
    const qText = document.getElementById('question-text');
    const qOpts = document.getElementById('options-container');
    const qCurrent = document.getElementById('q-current');
    const feedback = document.getElementById('feedback-msg');

    function loadQuiz() {
        if (qIndex >= questions.length) {
            document.getElementById('quiz-ui').style.display = 'none';
            document.getElementById('quiz-result').style.display = 'block';
            document.getElementById('final-score').innerText = score;
            return;
        }

        const data = questions[qIndex];
        qCurrent.innerText = qIndex + 1;
        qText.innerText = data.q;
        qOpts.innerHTML = '';
        feedback.innerText = '';

        data.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt;
            btn.onclick = () => checkQuiz(idx, data.correct);
            qOpts.appendChild(btn);
        });
    }

    function checkQuiz(selected, correct) {
        if (selected === correct) {
            score++;
            feedback.innerHTML = '<span style="color: green;">Correto! Você é incrível! 🌸</span>';
        } else {
            feedback.innerHTML = '<span style="color: var(--cor-rosa-escuro);">Ops... Tente lembrar do conteúdo! 💭</span>';
        }
        
        qIndex++;
        setTimeout(loadQuiz, 1200);
    }

    loadQuiz();
    window.restartQuiz = () => {
        qIndex = 0;
        score = 0;
        document.getElementById('quiz-ui').style.display = 'block';
        document.getElementById('quiz-result').style.display = 'none';
        loadQuiz();
    };


    // --- 6. SCROLL TO TOP & NAV HIGHLIGHT ---
    window.scrollToSection = (id) => {
        document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    };

    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) backToTopBtn.style.display = 'block';
        else backToTopBtn.style.display = 'none';
    });

    backToTopBtn.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

});

// Função global para as Tabs (precisa estar fora do DOMContentLoaded para ser acessível pelo HTML inline onclick)
window.openTab = (evt, tabName) => {
    const tabContent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
        tabContent[i].classList.remove("active");
    }

    const tabLinks = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
};