import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { SearchService } from './SearchService';

const elements = {
  form: document.querySelector('.search-form'),
  cardList: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more-hidden'),
};

const gallery = new SimpleLightbox('.gallery a');
let quantityImg = 0;
let currentPage = 1;

elements.form.addEventListener('submit', handlSubmit);
elements.cardList.addEventListener('click', markupCardList);
elements.btnLoadMore.addEventListener('click', loadMoreBotton);

async function handlSubmit(evt) {
  evt.preventDefault();
  elements.cardList.innerHTML = '';
  elements.btnLoadMore.style.display = 'none';
  currentPage = 1;

  const searchQuery = evt.target.elements.searchQuery.value.trim();

  if (!searchQuery) {
    return Notify.failure('Enter your search details.');
  }

  localStorage.setItem('input-value', searchQuery);

  try {
    const data = await SearchService(currentPage, searchQuery);

    quantityImg += data.data.hits.length;

    elements.cardList.insertAdjacentHTML('beforeend', cardListMarkup(data.data.hits));

    if (data.data.totalHits !== 0) {
      Notify.info(`"We found ${data.data.totalHits} images."`);
    }

    if (data.data.totalHits > quantityImg) {
      elements.btnLoadMore.style.display = 'block';
    }

    const galleryElement = document.querySelector('.gallery');
    if (galleryElement) {
      const { height: cardHeight } = galleryElement.firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } finally {
    gallery.refresh();
  }
}

async function markupCardList(evt) {
  evt.preventDefault();
  gallery.next();
}

async function loadMoreBotton() {
  try {
    const inputValue = localStorage.getItem('input-value');
    currentPage += 1;
    const data = await SearchService(currentPage, inputValue);
    quantityImg += data.data.hits.length;
    const cardsCreate = cardListMarkup(data.data.hits);
    elements.cardList.insertAdjacentHTML('beforeend', cardsCreate);

    if (data.data.hits.length < 40) {
      elements.btnLoadMore.style.display = 'none';
      Notify.info("Sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    Notify.failure(error.message);
  } finally {
    gallery.refresh();
  }
}

function cardListMarkup(arr) {
  return arr
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<div class ="photo-card"> 
        <a class="gallery-link" href="${largeImageURL}"> 
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          <div class="info">
            <p class="info-likes">
              <b>Likes: <span class= "item-text">${likes} ❤️ </span></b>
            </p>
            <p class="info-views">
              <b>Views: <span class= "item-text">${views} 👀 </span></b>
            </p>
            <p class="info-comments">
              <b>Comments: <span class= "item-text">${comments} 💬 </span></b>
            </p>
            <p class="info-downloads">
              <b>Downloads: <span class= "item-text">${downloads} ⬆️ </span></b>
            </p>
          </div>
        </a>
      </div>`;
    })
    .join('');
}

export { Notify, SimpleLightbox, SearchService };
