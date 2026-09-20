const nav = document.querySelector('.site-nav');
const navLinks = [...document.querySelectorAll('.nav-link')];
const pageSections = navLinks.map((link) => document.querySelector(link.getAttribute('href')));
const compactNavHeight = 64;

navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        const targetPosition = target.id === 'home'
            ? 0
            : window.scrollY + target.getBoundingClientRect().top - compactNavHeight;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        window.scrollTo({
            top: targetPosition,
            behavior: reduceMotion ? 'auto' : 'smooth',
        });
    });
});

const setActiveSection = () => {
    const atPageBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    let activeIndex = 0;

    if (atPageBottom) {
        activeIndex = navLinks.length - 1;
    } else {
        const readingLine = nav.getBoundingClientRect().bottom + 2;
        pageSections.forEach((section, index) => {
            if (section && section.getBoundingClientRect().top <= readingLine) activeIndex = index;
        });
    }

    navLinks.forEach((link, index) => {
        const isActive = index === activeIndex;
        link.classList.toggle('is-active', isActive);
        if (isActive) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });
};

const updateNavigation = () => {
    const isCompact = window.scrollY > 24;
    nav.classList.toggle('is-compact', isCompact);
    setActiveSection();
};

let scrollFrame;
window.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
        updateNavigation();
        scrollFrame = null;
    });
}, { passive: true });
window.addEventListener('resize', setActiveSection);
updateNavigation();

const track = document.querySelector('.carousel-track');
const slides = [...document.querySelectorAll('.slide')];
const dots = [...document.querySelectorAll('.carousel-dot')];
const previousButton = document.querySelector('.carousel-prev');
const nextButton = document.querySelector('.carousel-next');
let currentSlide = 0;

const showSlide = (index) => {
    currentSlide = (index + slides.length) % slides.length;
    track.classList.remove('is-slide-0', 'is-slide-1', 'is-slide-2');
    track.classList.add(`is-slide-${currentSlide}`);
    slides.forEach((slide, slideIndex) => slide.setAttribute('aria-hidden', String(slideIndex !== currentSlide)));
    dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === currentSlide;
        dot.classList.toggle('is-active', isActive);
        if (isActive) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
    });
};

previousButton.addEventListener('click', () => showSlide(currentSlide - 1));
nextButton.addEventListener('click', () => showSlide(currentSlide + 1));
dots.forEach((dot, index) => dot.addEventListener('click', () => showSlide(index)));
showSlide(0);

const modal = document.querySelector('#story-modal');
const storyCards = document.querySelectorAll('.story-card');
const closeModalButtons = modal.querySelectorAll('[data-close-modal]');
const modalCloseButton = modal.querySelector('.modal-close');
const modalImage = modal.querySelector('.modal-image');
const modalKicker = modal.querySelector('#modal-kicker');
const modalTitle = modal.querySelector('#modal-title');
const modalBody = modal.querySelector('#modal-body');
const modalMeta = modal.querySelector('#modal-meta');
let modalTrigger;

const openModal = (storyCard) => {
    modalTrigger = storyCard;
    modalImage.src = storyCard.dataset.storyImage;
    modalImage.alt = storyCard.dataset.storyAlt;
    modalKicker.textContent = storyCard.dataset.storyKicker;
    modalTitle.textContent = storyCard.dataset.storyTitle;
    modalBody.textContent = storyCard.dataset.storyBody;
    modalMeta.textContent = storyCard.dataset.storyMeta;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    modalCloseButton.focus();
};

const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    if (modalTrigger) modalTrigger.focus();
};

storyCards.forEach((card) => card.addEventListener('click', () => openModal(card)));
closeModalButtons.forEach((button) => button.addEventListener('click', closeModal));
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closeModal();
    if (event.key === 'Tab' && !modal.hidden) {
        event.preventDefault();
        modalCloseButton.focus();
    }
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    revealItems.forEach((item) => revealObserver.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
}
