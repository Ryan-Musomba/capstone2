document.addEventListener("DOMContentLoaded", () => {
    const darkmode = localStorage.getItem("darkmode");

    // Apply dark or light mode based on preference
    if (darkmode === "enabled") {
        document.body.classList.remove("darkmode");
        document.body.classList.add("lightmode");
       
    } else {
        document.body.classList.add("darkmode");
        document.body.classList.remove("lightmode");
    }

    const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1';
    const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
    const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=';
    const GENRE_API_URL = 'https://api.themoviedb.org/3/genre/movie/list?api_key=3fd2be6f0c70a2a598f084ddfb75487c';

    const movieshown = document.getElementById('movieshown');
    const form = document.getElementById('form');
    const search = document.getElementById('search');
    const genreFilter = document.getElementById('genre-filter');

    let genreMap = {};
    let allMovies = [];


    async function fetchGenres() {
        try {
            const res = await fetch(GENRE_API_URL);
            const data = await res.json();
            data.genres.forEach(genre => {
                genreMap[genre.id] = genre.name;
                const option = document.createElement('option');
                option.value = genre.id;
                option.textContent = genre.name;
                genreFilter.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching genres:', error);
        }
    }

  
    async function getAllMovies() {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            allMovies = data.results;
            showMovies(allMovies); 
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    }

    // Fetch movies by genre
    async function getMoviesByGenre(genreId) {
        try {
            const res = await fetch(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&with_genres=${genreId}&page=1`);
            const data = await res.json();
            showMovies(data.results); 
        } catch (error) {
            console.error('Error fetching movies by genre:', error);
        }
    }

    // Fetch movies by search term
    async function getMovies(url) {
        try {
            const res = await fetch(url);
            const data = await res.json();
            showMovies(data.results); 
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    }

    // Display movies in a grid
    function showMovies(movies) {
        movieshown.innerHTML = '';

        const moviesGrid = document.createElement('div');
        moviesGrid.classList.add('movies-grid');

        movies.forEach((movie) => {
            const { title, poster_path, vote_average, overview, release_date, genre_ids, id } = movie;

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
                        <i class="fa-solid fa-play"></i>
                    </div>
                </div>
                <div class="card-body">
                    <h3 class="card-title">${title}</h3>
                    <div class="card-info">
                        <span class="genre">${genres}</span>
                        <span class="year">${release_date.split("-")[0]}</span>
                    </div>
                    <a href="detail.html?id=${id}" class="view-details">View Details</a>
                </div>
            `;

            moviesGrid.appendChild(movieEl);
        });

        movieshown.appendChild(moviesGrid);
    }

    // Filter movies by genre
    genreFilter.addEventListener('change', () => {
        const selectedGenreId = genreFilter.value;
        if (selectedGenreId === 'all') {
            showMovies(allMovies);
        } else {
            getMoviesByGenre(selectedGenreId); 
        }
    });

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

    fetchGenres().then(() => getAllMovies());
});