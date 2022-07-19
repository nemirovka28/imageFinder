import './sass/index.scss'
import { onScroll, onToTopBtn } from './js/scroll.js';
import NewsApiService from './js/news-service.js'
// import SimpleLightbox from "simplelightbox/dist/simple-lightbox.esm.js";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

Notify.init ({
    position: 'center-top',
    distance: '80px',
    timeout: 2000,
    cssAnimationStyle: 'from-top',
    showOnlyTheLastOne: true,
});
let simpleLightbox;
const refs = {
    searchForm: document.querySelector('.search-form'),
    container: document.querySelector('.gallery'),
};
const newsApiService = new NewsApiService();
refs.searchForm.addEventListener('submit', onSearch);

  onScroll();
  onToTopBtn();

function onSearch (e) {
    e.preventDefault();
    const VALUE = e.currentTarget.elements.query.value;
    if(VALUE.length === 0){
        return Notify.warning('Sorry, there are no images matching your search query. Please try again.');
    } ;
 
        newsApiService.query = VALUE;
        clearArticlesContainer();
        fetchArticles(); 
};
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
};
function appendArticlesMarkup(articles) {
    const totalHits = articles.totalHits;
    Notify.success(`Hooray! We found ${totalHits} images.` );
    renderContent(articles)
};
function renderContent (articles){
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
    simpleLightBox = new SimpleLightbox('.gallery a').refresh();
};
window.addEventListener('scroll', () => {
    if(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight-400){
       return newsApiService.fetchArticles().then(renderNextContent)
    } 
});
function renderNextContent (articles){
    simpleLightBox.destroy();
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
    simpleLightBox = new SimpleLightbox('.gallery a').refresh();
};
function clearArticlesContainer() {
    refs.container.innerHTML = '';
};
