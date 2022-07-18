import './sass/index.scss'
import NewsApiService from './js/news-service.js'
import SimpleLightbox from "simplelightbox/dist/simple-lightbox.esm.js";
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import simpleLightbox from 'simplelightbox';

Notify.init ({
    position: 'center-top',
    distance: '80px',
    timeout: 2000,
    cssAnimationStyle: 'from-top',
    showOnlyTheLastOne: true,
});

const refs = {
    searchForm: document.querySelector('.search-form'),
    container: document.querySelector('.gallery'),
    toTopBtn: document.querySelector('.btn__top'),
};
const newsApiService = new NewsApiService();
refs.searchForm.addEventListener('submit', onSearch);
refs.toTopBtn.addEventListener('click', onToTopBtn);
window.addEventListener('scroll', onScroll);
function onScroll() {
    const scrolled = window.pageYOffset;
    const coords = document.documentElement.clientHeight;
  
    if (scrolled > coords) {
        refs.toTopBtn.classList.add('btn__top--visible');
    }
    if (scrolled < coords) {
      refs.toTopBtn.classList.remove('btn__top--visible');
    }
  }

function onToTopBtn() {
    if (window.pageYOffset > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  onScroll();
  onToTopBtn() ;

function onSearch (e) {
    e.preventDefault();
    const VALUE = e.currentTarget.elements.query.value;
    if(VALUE.length === 0){
        return Notify.warning('Sorry, there are no images matching your search query. Please try again.');
    } ;
 
        newsApiService.query = VALUE;
        clearArticlesContainer();
        fetchArticles(); 
}

function fetchArticles() {
    newsApiService.fetchArticles().then(response => {
        if (response.hits.length === 0) {
            return Notify.warning('Sorry, there are no images matching your search query. Please try again.') 
        };
        appendArticlesMarkup(response);
    }).catch(error => {
        console.log(error)
        Notify.warning(`Sorry,error ${error}.Please try again.`) 
    })
    .finally(() => {
        refs.searchForm.reset();
    });
}
function appendArticlesMarkup(articles) {
    const totalHits = articles.totalHits;
    Notify.success(`Hooray! We found ${totalHits} images.` );
    renderContent(articles)
};
function renderContent (articles){
    console.log('Это рендер')
    const item = articles.hits;
    const content = item.map( item => {
        return `
        <li class = "gallery__item">
        <a href="${item.largeImageURL}">
        <div class="img-div">
        <img class="img-scale" loading="lazy" src="${item.webformatURL}" alt="${item.tags}" title="${item.tags}" />
        </div>
        </a>
        <div class="stats">
        <p class="stats-item">
        <i class="material-icons">thumb_up</i>
                    ${item.likes}
            </p>
        <p class="stats-item">
         <i class="material-icons">visibility</i>
                    ${item.views}
        </p>
         <p class="stats-item">
         <i class="material-icons">comment</i>
                     ${item.comments}
         </p>
         <p class="stats-item">
          <i class="material-icons">cloud_download</i>
                    ${item.downloads}
         </p>
        </div>
      
        </li>`}).join('')
    refs.container.insertAdjacentHTML('beforeend', content);
   let gallery = new SimpleLightbox(".gallery a", {
        captionsData: "alt",
        captionDelay: 250,
        spinner:true,
        uniqueImages:true,
      })
      gallery.on('closed.simplelightbox', function () {
        gallery.refresh();
      });
};
window.addEventListener('scroll', () => {
    if(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight-400){
       return newsApiService.fetchArticles().then(renderNextContent)
    } 
});
function renderNextContent (articles){
    console.log('Это некст рендер')
    const item = articles.hits;
    const content = item.map( item => {
        return `
        <li class = "gallery__item">
        <a href="${item.largeImageURL}">
        <div class="img-div">
        <img class="img-scale" loading="lazy" src="${item.webformatURL}" alt="${item.tags}" title="${item.tags}" />
        </div>
        </a>
        <div class="stats">
        <p class="stats-item">
        <i class="material-icons">thumb_up</i>
                    ${item.likes}
            </p>
        <p class="stats-item">
         <i class="material-icons">visibility</i>
                    ${item.views}
        </p>
         <p class="stats-item">
         <i class="material-icons">comment</i>
                     ${item.comments}
         </p>
         <p class="stats-item">
          <i class="material-icons">cloud_download</i>
                    ${item.downloads}
         </p>
        </div>
      
        </li>`}).join('')
    refs.container.insertAdjacentHTML('beforeend', content);
   let gallery = new SimpleLightbox(".gallery a", {
        captionsData: "alt",
        captionDelay: 250,
        spinner:true,
        uniqueImages:true,
      })
      gallery.on('closed.simplelightbox', function () {
        gallery.refresh();
      });
}
function clearArticlesContainer() {
    refs.container.innerHTML = '';
}
