const API_KEY = '28648350-baa268bcab647ae58184a3328';
const BASE_URL = 'https://pixabay.com/api/?image_type=photo&orientation=horizontal&';
// https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=что_искать&page=номер_страницы&per_page=12&key=твой_ключ
// const options = {
//   headers: {
//     Authorization: API_KEY,
//   },
// };
export default class NewsApiService {
    constructor() {
      this.searchQuery = '';
      this.page = 1;
    }

    fetchArticles() {
      const url = `${BASE_URL}q=${this.searchQuery}&page=${this.page}per_page=12&&key=${API_KEY}`;
  
      return fetch(url)
        .then(response => response.json())
        .then((data) => {
          this.incrementPage();
          return data;
        });
    }
  
    incrementPage() {
      this.page += 1;
    }
  
    resetPage() {
      this.page = 1;
    }
  
    get query() {
      return this.searchQuery;
    }
  
    set query(newQuery) {
      this.searchQuery = newQuery;
    }
  }