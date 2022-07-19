export { onScroll, onToTopBtn };
const toTopBtn = document.querySelector('.btn__top')
      toTopBtn.addEventListener('click', onToTopBtn);
window.addEventListener('scroll', onScroll);

function onScroll() {
    const scrolled = window.pageYOffset;
    const coords = document.documentElement.clientHeight;
  
    if (scrolled > coords) {
        toTopBtn.classList.add('btn__top--visible');
    }
    if (scrolled < coords) {
      toTopBtn.classList.remove('btn__top--visible');
    }
  };
function onToTopBtn() {
    if (window.pageYOffset > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };