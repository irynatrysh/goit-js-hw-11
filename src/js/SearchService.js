import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '40305157-29c77b29b48ab694c9a8a21a8';

async function SearchService(currentPage, searchQuery) {
  const parameters = new URLSearchParams({
    key: API_KEY,
    image_type: `photo`,
    orientation: `horizontal`,
    safesearch: `true`,
    per_page: '40',
    q: searchQuery,
    page: currentPage,
  });

  return axios.get(`${BASE_URL}?${parameters}`);
}

export { SearchService };
