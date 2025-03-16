const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=';
const GENRE_API_URL = 'https://api.themoviedb.org/3/genre/tv/list?api_key=3fd2be6f0c70a2a598f084ddfb75487c';

const movieshown = document.getElementById('movieshown');
const form = document.getElementById('form');
const search = document.getElementById('search');

let genreMap = {};

async function fetchGenres() {
    try {
        const res = await fetch(GENRE_API_URL);
        const data = await res.json();
        data.genres.forEach(genre => {
            genreMap[genre.id] = genre.name;
        });
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

async function getMovies(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        showMovies(data.results);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

function showMovies(movies) {
    movieshown.innerHTML = '';

    const moviesGrid = document.createElement('div');
    moviesGrid.classList.add('movies-grid');

    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview, release_date, genre_ids } = movie;

        const genres = genre_ids.map(id => genreMap[id]).join(', ');

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie-card');

        movieEl.innerHTML = `
            <div class="card-head">
                <img src="${IMG_PATH}${poster_path}" alt="${title}" class="card-img" />
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
                <h3 class="card-title">${title}</h3>
                <div class="card-info">
                    <span class="genre">${genres}</span>
                    <span class="year">${release_date.split("-")[0]}</span>
                </div>
            </div>
        `;
        moviesGrid.appendChild(movieEl);
    });

    movieshown.appendChild(moviesGrid);
}

// Search functionality
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value;

    if (searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm);
        search.value = '';
    } else {
        window.location.reload();
    }
});

// Initialize the app
fetchGenres().then(() => getMovies(API_URL));