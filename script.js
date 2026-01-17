        // 1. PARTICLES (Adaptativo)
        const canvas = document.getElementById('particles'); 
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        const particlesArray = [];
        
        class Particle {
            constructor() { 
                this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; 
                this.size = Math.random() * 2 + 1; this.speedX = Math.random() * 1.5 - 0.75; this.speedY = Math.random() * 1.5 - 0.75; 
            }
            update() { 
                this.x += this.speedX; this.y += this.speedY; 
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1; if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() { 
                ctx.fillStyle = document.body.classList.contains('light-mode') ? '#2563eb' : '#00ff88'; 
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); 
            }
        }
        
        function initParticles() { 
            particlesArray.length = 0; let count = (window.innerWidth * window.innerHeight) / 9000; 
            for (let i = 0; i < count; i++) particlesArray.push(new Particle()); 
        }
        
        function animateParticles() { 
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update(); particlesArray[i].draw();
                for (let j = i; j < particlesArray.length; j++) {
                    const dx = particlesArray[i].x - particlesArray[j].x; const dy = particlesArray[i].y - particlesArray[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 150) { 
                        ctx.beginPath(); 
                        let color = document.body.classList.contains('light-mode') ? '37, 99, 235' : '0, 255, 136';
                        ctx.strokeStyle = `rgba(${color}, ${1 - distance/150})`; 
                        ctx.lineWidth = 1;
                        ctx.moveTo(particlesArray[i].x, particlesArray[i].y); ctx.lineTo(particlesArray[j].x, particlesArray[j].y); ctx.stroke();
                    }
                }
            } 
            requestAnimationFrame(animateParticles); 
        }
        initParticles(); animateParticles();
        window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; initParticles(); });

        // 2. SCROLL PROGRESS
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            document.getElementById('scroll-progress-bar').style.width = scrolled + "%";
            document.getElementById('scroll-percent-text').innerText = Math.round(scrolled) + "%";
            document.querySelector('.scroll-top').style.opacity = winScroll > 300 ? '1' : '0';
            document.querySelector('.scroll-top').style.pointerEvents = winScroll > 300 ? 'auto' : 'none';
        });

        // 3. TYPEWRITER (HERO)
        class TypeWriter {
            constructor(txtElement, words, wait = 3000) {
                this.txtElement = txtElement; this.words = words; this.txt = '';
                this.wordIndex = 0; this.wait = parseInt(wait, 10); this.type(); this.isDeleting = false;
            }
            type() {
                const current = this.wordIndex % this.words.length; const fullTxt = this.words[current];
                if(this.isDeleting) { this.txt = fullTxt.substring(0, this.txt.length - 1); } 
                else { this.txt = fullTxt.substring(0, this.txt.length + 1); }
                this.txtElement.innerHTML = this.txt;
                let typeSpeed = 100;
                if(this.isDeleting) { typeSpeed /= 2; }
                if(!this.isDeleting && this.txt === fullTxt) { typeSpeed = this.wait; this.isDeleting = true; } 
                else if(this.isDeleting && this.txt === '') { this.isDeleting = false; this.wordIndex++; typeSpeed = 500; }
                setTimeout(() => this.type(), typeSpeed);
            }
        }
        document.addEventListener('DOMContentLoaded', () => {
            const txtElement = document.querySelector('.txt-type');
            const words = JSON.parse(txtElement.getAttribute('data-words'));
            new TypeWriter(txtElement, words, 2000);
        });

        // 4. STORYTELLER (SOBRE MIM) - RESTAURADO E ATUALIZADO
        const bioPart1 = document.getElementById('bio-part-1');
        const bioPart2 = document.getElementById('bio-part-2');
        
        // Texto Exato que você pediu
        const text1 = "Me chamo Diogo e estou em busca de um estágio para aplicar e expandir meus conhecimentos, contribuindo para projetos reais e inovadores.";
        const text2 = "Atualmente, estou cursando o 5º período de Análise e Desenvolvimento de Sistemas e busco uma oportunidade de estágio como desenvolvedor web. Meu objetivo é aprimorar minhas habilidades técnicas, colaborar em equipe e contribuir para o desenvolvimento de soluções web eficientes e criativas.";
        
        let startedBio = false;

        const observerAbout = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !startedBio) {
                    startedBio = true;
                    typeText(bioPart1, text1, 0, () => {
                        bioPart1.classList.remove('typing-cursor');
                        bioPart2.classList.add('typing-cursor');
                        typeText(bioPart2, text2, 0, () => {
                            bioPart2.classList.remove('typing-cursor');
                        });
                    });
                }
            });
        }, { threshold: 0.5 });
        
        observerAbout.observe(document.querySelector('#about'));

        function typeText(element, text, index, callback) {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                setTimeout(() => typeText(element, text, index + 1, callback), 20); // Velocidade da digitação
            } else if (callback) {
                callback();
            }
        }
// 5. INFINITE TYPEWRITER (CONTACT SECTION)
        const scrollTextElement = document.querySelector('.scroll-type-text');
        
        // LISTA DE FRASES PARA ALTERNAR
        const contactPhrases = [
            "Tem um projeto em mente?", 
            "Vamos tirar sua ideia do papel?", 
            "Precisa de um site moderno?",
            "Vamos criar algo incrível?",
            "Quero participar do projeto!"
        ];
        
        let contactPhraseIndex = 0;
        let contactCharIndex = 0;
        let isContactDeleting = false;
        let contactStarted = false;

        function typeContactLoop() {
            const currentPhrase = contactPhrases[contactPhraseIndex % contactPhrases.length];
            // Velocidade: apaga mais rápido (50ms) do que escreve (100ms)
            const typeSpeed = isContactDeleting ? 50 : 100; 

            if (isContactDeleting) {
                // Apagando
                scrollTextElement.textContent = currentPhrase.substring(0, contactCharIndex - 1);
                contactCharIndex--;
            } else {
                // Escrevendo
                scrollTextElement.textContent = currentPhrase.substring(0, contactCharIndex + 1);
                contactCharIndex++;
            }

            let nextSpeed = typeSpeed;

            // Lógica de Troca
            if (!isContactDeleting && contactCharIndex === currentPhrase.length) {
                // Terminou de escrever: Espera 2 segundos antes de apagar
                nextSpeed = 2000;
                isContactDeleting = true;
            } else if (isContactDeleting && contactCharIndex === 0) {
                // Terminou de apagar: Passa para a próxima frase
                isContactDeleting = false;
                contactPhraseIndex++;
                nextSpeed = 500; // Espera meio segundo antes de começar a próxima
            }

            setTimeout(typeContactLoop, nextSpeed);
        }

        // Inicia apenas quando a seção aparece na tela
        const observerContact = new IntersectionObserver((entries) => {
            entries.forEach(entry => { 
                if (entry.isIntersecting && !contactStarted) { 
                    contactStarted = true; 
                    typeContactLoop(); 
                } 
            });
        }, { threshold: 0.5 });
        
        observerContact.observe(document.querySelector('#contact'));

        // 6. MOUSE & MENU
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        window.addEventListener('mousemove', (e) => {
            cursorDot.style.left = `${e.clientX}px`; cursorDot.style.top = `${e.clientY}px`;
            cursorOutline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 500, fill: "forwards" });
        });
        
        const menuBtn = document.querySelector('.menu-btn'); const navLinks = document.querySelector('.nav-links');
        menuBtn.addEventListener('click', () => { navLinks.classList.toggle('active'); });
     function toggleTheme() { 
            // 1. Troca o tema do site
            document.body.classList.toggle('light-mode'); 
            
            // 2. Troca o ícone do botão (INVERTIDO)
            const icon = document.querySelector('.theme-switch i');
            
            if (document.body.classList.contains('light-mode')) {
                // Estamos no MODO CLARO -> Mostrar LUA (para voltar ao escuro)
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                // Estamos no MODO ESCURO -> Mostrar SOL (para ir ao claro)
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }

        // 7. ANIMATIONS
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if(entry.isIntersecting) { const bars = entry.target.querySelectorAll('.progress-fill'); bars.forEach(bar => bar.style.width = bar.getAttribute('data-width')); } });
        });
        document.querySelectorAll('#skills').forEach(section => observer.observe(section));

        // 8. HACKER EFFECT
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&";
        const logo = document.getElementById("hacker-text");
        logo.onmouseover = event => {
            let iteration = 0;
            const interval = setInterval(() => {
                event.target.innerText = event.target.innerText.split("").map((letter, index) => {
                    if(index < iteration) return event.target.dataset.value[index];
                    return letters[Math.floor(Math.random() * 26)];
                }).join("");
                if(iteration >= event.target.dataset.value.length) clearInterval(interval);
                iteration += 1 / 3;
            }, 30);
        }
        logo.dataset.value = "<Diogo Lobo/>"; 
  


   // 9. FORMULÁRIO AJAX COM VALIDAÇÃO DE EMAIL
        const contactForm = document.getElementById('contact-form');
        const formBtn = document.getElementById('form-button');

        // Função simples e eficiente de validação de email (Regex)
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Impede recarregar
            
            const originalBtnText = "ENVIAR MENSAGEM <i class='fas fa-paper-plane'></i>";
            const emailInput = contactForm.querySelector('input[name="email"]');

            // --- VALIDAÇÃO EXTRA DE EMAIL ---
            if (!validateEmail(emailInput.value)) {
                // Se o email for inválido, avisa no botão e PARA TUDO
                formBtn.innerHTML = 'EMAIL INVÁLIDO <i class="fas fa-exclamation-triangle"></i>';
                formBtn.style.backgroundColor = '#ff4444'; // Vermelho alerta
                formBtn.style.color = '#fff';
                
                // Volta o botão ao normal depois de 3 segundos
                setTimeout(() => {
                    formBtn.innerHTML = originalBtnText;
                    formBtn.style.backgroundColor = ''; 
                    formBtn.style.color = '';
                }, 3000);
                return; // O "return" aqui impede que o código continue e envie o formulário
            }

            // Se passou na validação, continua o envio...
            formBtn.innerHTML = 'ENVIANDO... <i class="fas fa-spinner fa-spin"></i>';
            formBtn.style.opacity = '0.7';
            formBtn.disabled = true;

            const formData = new FormData(contactForm);
            
            // Seu e-mail já está configurado no HTML (action), então usamos ele aqui se precisar ou deixamos a URL do action
            // Como você colocou o email no HTML, podemos pegar a URL direto de lá para ficar dinâmico:
            const actionURL = contactForm.getAttribute('action');
            
            fetch(actionURL, {
                method: "POST",
                body: formData
            })
            .then(response => {
                if(response.ok) {
                    // Sucesso
                    formBtn.innerHTML = 'MENSAGEM ENVIADA! <i class="fas fa-check"></i>';
                    formBtn.style.backgroundColor = '#00ff88'; // Verde Neon
                    formBtn.style.color = '#000';
                    contactForm.reset();
                } else {
                    throw new Error('Falha no envio');
                }
            })
            .catch(error => {
                // Erro de rede ou servidor
                console.error('Erro:', error);
                formBtn.innerHTML = 'ERRO AO ENVIAR <i class="fas fa-times"></i>';
                formBtn.style.backgroundColor = 'red';
            })
            .finally(() => {
                // Reseta o botão após 3 segundos (tanto no sucesso quanto no erro)
                setTimeout(() => {
                    formBtn.innerHTML = originalBtnText;
                    formBtn.style.backgroundColor = ''; 
                    formBtn.style.color = '';
                    formBtn.style.opacity = '1';
                    formBtn.disabled = false;
                }, 3000);
            });
        });





        // 10. MODAL DE PROJETOS
        const modal = document.getElementById("projectModal");
        const modalImg = document.getElementById("img01");
        const captionText = document.getElementById("caption");
        const closeBtn = document.getElementsByClassName("close-modal")[0];
        
        // Seleciona todos os cards de projeto
        const triggers = document.querySelectorAll('.project-trigger');

        triggers.forEach(card => {
            card.addEventListener('click', function() {
                modal.style.display = "flex"; // Mostra o modal
                
                // Pega a imagem definida no data-image do HTML
                // Se não tiver imagem definida, usa uma padrão ou placeholder
                const imageSrc = this.getAttribute('data-image');
                const title = this.getAttribute('data-title');
                
                if(imageSrc) {
                    modalImg.src = imageSrc;
                } else {
                    modalImg.src = "https://via.placeholder.com/800x600?text=Projeto+Sem+Print"; // Fallback
                }
                
                captionText.innerHTML = title || "Detalhes do Projeto";
            });
        });

        // Fechar ao clicar no X
        closeBtn.onclick = function() {
            modal.style.display = "none";
        }

        // Fechar ao clicar fora da imagem
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
