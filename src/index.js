import './sass/index.scss'
import NewsApiService from './js/news-service.js'
import SimpleLightbox from "simplelightbox/dist/simple-lightbox.esm.js";
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

Notify.init ({
    position: 'center-top',
    distance: '80px',
    timeout: 2000,
    cssAnimationStyle: 'from-top',
    showOnlyTheLastOne: true,
});

const refs = {
    searchForm: document.querySelector('.search-form'),
    container:document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', onSearch);
const newsApiService = new NewsApiService();

function onSearch (e) {
    e.preventDefault();
    const VALUE = e.currentTarget.elements.query.value;
    if(VALUE.length === 0){
        Notify.warning('Sorry, there are no images matching your search query. Please try again.');
    }
        newsApiService.query = VALUE;
        newsApiService.resetPage();
        clearArticlesContainer();
        fetchArticles(); 
}
function fetchArticles() {
    newsApiService.fetchArticles().then(appendArticlesMarkup);
}
window.addEventListener('scroll', () => {
    if(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight){
        newsApiService.fetchArticles().then(renderContent)
    }
})
function appendArticlesMarkup(articles) {
    const totalHits = articles.totalHits;
    Notify.success(`Hooray! We found ${totalHits} images.` );
    renderContent(articles)
}
function renderContent (articles){
    const item = articles.hits;
    const content = item.map( item => {
        return `
        <li>
        <a href="${item.largeImageURL}">
        <div class="img-div">
        <img class="img-scale" src="${item.webformatURL}" alt="${item.tags}" title="${item.tags}" />
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
    new SimpleLightbox(".gallery a", {
        captionsData: "alt",
        captionDelay: 250,
        spinner:true,
        uniqueImages:true,
      })
}
function clearArticlesContainer() {
    refs.container.innerHTML = '';
}
