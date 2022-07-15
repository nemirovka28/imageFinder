import './sass/index.scss'
import NewsApiService from './js/news-service.js'
import SimpleLightbox from "simplelightbox/dist/simple-lightbox.esm.js";
import 'simplelightbox/dist/simple-lightbox.min.css';
const refs = {
    searchForm: document.querySelector('.search-form'),
    container:document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', onSearch);
const newsApiService = new NewsApiService();

function onSearch (e) {
    const VALUE = e.currentTarget.elements.query.value;
    e.preventDefault();
    newsApiService.query = VALUE;
    newsApiService.resetPage();
    clearArticlesContainer();
    fetchArticles();
}
function fetchArticles() {
    newsApiService.fetchArticles().then(articles => {
      appendArticlesMarkup(articles);
    });
  }
function appendArticlesMarkup(articles) {
    console.log(articles)
    const item = articles.hits;
    const content = item.map( item => {
        return `
        
        <li >
        <a href="${item.largeImageURL}">
        <img src="${item.webformatURL}" alt="${item.tags}" title="${item.tags}" />
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
        </a>
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