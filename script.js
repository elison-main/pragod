// Mobile Menu Toggle
const menuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('nav ul');

menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        // Fecha o menu mobile se estiver aberto
        navMenu.classList.remove('show');

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80, // Ajusta pelo altura do header fixo
                behavior: 'smooth'
            });
        }
    });
});

// Form Submission (Contato)
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Obrigado pela sua mensagem! Entraremos em contato em breve.');
        this.reset();
    });
}

// Newsletter Form Submission
const newsletterForm = document.querySelector('.footer-col:last-child form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Obrigado por se inscrever na nossa newsletter!');
        this.reset();
    });
}

// **NOVA LÓGICA DE ANIMAÇÃO PARA CONTADORES (NUMÉRICOS E DE TEXTO)**
const statsSection = document.getElementById('stats');
let countersAnimated = false; // Flag para garantir que a animação só ocorra uma vez

// Função para animar contadores numéricos
const animateNumericCounter = (counterElement) => {
    const target = +counterElement.getAttribute('data-target');
    const speed = 200; // Duração da animação em iterações
    let count = 0; // Inicia a contagem de 0

    const updateCount = () => {
        const increment = target / speed;
        if (count < target) {
            count = Math.ceil(count + increment);
            counterElement.innerText = count;
            // Recursão com setTimeout para criar o efeito de animação
            setTimeout(updateCount, 1); // Rápido para a animação parecer suave
        } else {
            counterElement.innerText = target; // Garante que o número final seja exato
        }
    };
    updateCount();
};

// Função para animar o contador de texto
const animateTextCounter = (element, targetText) => {
    // Caracteres aleatórios para a transição
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{};':\"|,.<>/?`~";
    let interval = null;
    let iteration = 0;
    const speed = 70; // Velocidade da troca de caracteres (ms por iteração)

    const updateText = () => {
        let animatedText = targetText.split('') // Divide a palavra alvo em um array de letras
            .map((char, index) => {
                // Se o índice atual já for menor que a iteração, mostra a letra final
                if (index < iteration) {
                    return targetText[index];
                }
                // Caso contrário, mostra um caractere aleatório
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join(''); // Junta as letras de volta em uma string

        element.innerText = animatedText; // Atualiza o texto no HTML

        // Se ainda não revelou todas as letras, avança a iteração
        if (iteration < targetText.length) {
            iteration += 1;
        } else {
            clearInterval(interval); // Para a animação quando todas as letras forem reveladas
            element.innerText = targetText; // Garante que o texto final seja exato
        }
    };

    interval = setInterval(updateText, speed); // Inicia o intervalo de animação
};


// Intersection Observer para disparar as animações ao rolar a página
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
            // Anima os contadores numéricos
            document.querySelectorAll('.counter:not(.text-animate)').forEach(counter => {
                animateNumericCounter(counter);
            });

            // Anima o contador de texto
            document.querySelectorAll('.counter.text-animate').forEach(textCounter => {
                const targetText = textCounter.getAttribute('data-text-target');
                animateTextCounter(textCounter, targetText);
            });

            countersAnimated = true; // Marca que as animações já foram disparadas
            observer.unobserve(entry.target); // Para de observar a seção
        }
    });
}, { threshold: 0.5 }); // Dispara quando 50% da seção está visível

if (statsSection) {
    observer.observe(statsSection);
}


// Carrossel de Imagens (Mantido o código anterior)
const setupImageCarousel = (carouselSelector) => {
    const carousel = document.querySelector(carouselSelector);
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = carousel.querySelector('.carousel-button.next');
    const prevButton = carousel.querySelector('.carousel-button.prev');

    let currentIndex = 0;
    const slidesPerView = 3;

    const updateCarousel = () => {
        const containerWidth = carousel.querySelector('.carousel-track-container').offsetWidth;
        const slideWidth = containerWidth / slidesPerView;

        slides.forEach(slide => {
            slide.style.width = `${slideWidth}px`;
        });

        const offset = -currentIndex * slideWidth;
        track.style.transform = `translateX(${offset}px)`;

        prevButton.style.display = currentIndex === 0 ? 'none' : 'block';
        nextButton.style.display = currentIndex >= (slides.length - slidesPerView) ? 'none' : 'block';
    };

    nextButton.addEventListener('click', () => {
        if (currentIndex < slides.length - slidesPerView) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = slides.length - slidesPerView;
        }
        updateCarousel();
    });

    window.addEventListener('resize', updateCarousel);
    updateCarousel();
};

setupImageCarousel('.image-carousel');


// Lógica do Modal de Vídeo (Para vídeos do YouTube)
const videoModal = document.getElementById('videoModal');
const closeButton = document.querySelector('.close-button');
const youtubePlayer = document.getElementById('youtubePlayer');
const youtubeVideoItems = document.querySelectorAll('.media-item.youtube-video');

youtubeVideoItems.forEach(item => {
    item.addEventListener('click', () => {
        const videoId = item.getAttribute('data-video-id');
        youtubePlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        videoModal.classList.add('show-modal');
    });
});

closeButton.addEventListener('click', () => {
    videoModal.classList.remove('show-modal');
    youtubePlayer.src = '';
});

window.addEventListener('click', (event) => {
    if (event.target == videoModal) {
        videoModal.classList.remove('show-modal');
        youtubePlayer.src = '';
    }
});