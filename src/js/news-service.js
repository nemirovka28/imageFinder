const API_KEY = '28648350-baa268bcab647ae58184a3328';
const BASE_URL = 'https://pixabay.com/api/?image_type=photo&orientation=horizontal&';

export default class NewsApiService {
    constructor() {
      this.searchQuery = '';
      this.page = 1;
    }
    
    fetchArticles() {
      const url = `${BASE_URL}q=${this.searchQuery}&page=${this.page}&per_page=20&key=${API_KEY}`;
      console.log(url)
      return fetch(url)
        .then(response => response.json())
        .then((data) => {
          this.page += 1;
          console.log(this.page)
          return data;
        })
    }
    get query() {
      return this.searchQuery;
    }
  
    set query(newQuery) {
      this.searchQuery = newQuery;
    }
  }