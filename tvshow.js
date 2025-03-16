const API_URL = 'https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/tv?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=';
const GENRE_API_URL = 'https://api.themoviedb.org/3/genre/tv/list?api_key=3fd2be6f0c70a2a598f084ddfb75487c';

const tvShown = document.getElementById('tvShown');
const form = document.getElementById('form');
const search = document.getElementById('search');

let genreMap = {};

// Fetch genres and create a genre map
async function fetchGenres() {
    const res = await fetch(GENRE_API_URL);
    const data = await res.json();
    data.genres.forEach(genre => {
        genreMap[genre.id] = genre.name;
    });
}

// Fetch and display TV shows
async function getTVShows(url) {
    const res = await fetch(url);
    const data = await res.json();
    showTVShows(data.results);
}

function showTVShows(tvShows) {
    tvShown.innerHTML = '';

    const tvShowsGrid = document.createElement('div');
    tvShowsGrid.classList.add('movies-grid');

    tvShows.forEach((show) => {
        const { name, poster_path, vote_average, first_air_date, genre_ids } = show;

        // Map genre_ids to genre names
        const genres = genre_ids.map(id => genreMap[id]).join(', ');

        const tvShowEl = document.createElement('div');
        tvShowEl.classList.add('movie-card');

        tvShowEl.innerHTML = `
            <div class="card-head">
                <img src="${IMG_PATH}${poster_path}" alt="${name}" class="card-img" />
                <div class="card-overlay"></div>
                <div class="bookmark">
                    <i class="fa-solid fa-bookmark"></i>
                </div>
                <div class="rating">
                    <i class="fa-solid fa-star"></i>
                    <span>${vote_average.toFixed(1)}</span>
                </div>
                <div class="play">
                    <ion-icon name="play-circle"></ion-icon>
                </div>
            </div>
            <div class="card-body">
                <h3 class="card-title">${name}</h3>
                <div class="card-info">
                    <span class="genre">${genres}</span>
                    <span class="year">${first_air_date.split("-")[0]}</span>
                </div>
            </div>
        `;
        tvShowsGrid.appendChild(tvShowEl);
    });

    tvShown.appendChild(tvShowsGrid);
}

// Search functionality
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value;

    if (searchTerm && searchTerm !== '') {
        getTVShows(SEARCH_API + searchTerm);
        search.value = '';
    } else {
        window.location.reload();
    }
});

// Initialize
fetchGenres().then(() => getTVShows(API_URL));