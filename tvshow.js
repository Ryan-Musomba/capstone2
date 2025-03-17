document.addEventListener("DOMContentLoaded", () => {
    const darkmode = localStorage.getItem("darkmode");

    if (darkmode === "enabled") {
        document.body.classList.remove("darkmode");
        document.body.classList.add("lightmode");
    } else {
        document.body.classList.add("darkmode");
        document.body.classList.remove("lightmode");
      
    }

    const API_URL = 'https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1';
    const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
    const SEARCH_API = 'https://api.themoviedb.org/3/search/tv?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=';
    const GENRE_API_URL = 'https://api.themoviedb.org/3/genre/tv/list?api_key=3fd2be6f0c70a2a598f084ddfb75487c';

    const tvShown = document.getElementById('tvShown');
    const form = document.getElementById('form');
    const search = document.getElementById('search');
    const genreFilter = document.getElementById('genre-filter');

    let genreMap = {};
    let allTVShows = [];

 
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

    async function getTVShows() {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            allTVShows = data.results;
            showTVShows(allTVShows); 
        } catch (error) {
            console.error('Error fetching TV shows:', error);
        }
    }


    async function getTVShowsByGenre(genreId) {
        try {
            const res = await fetch(`https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&with_genres=${genreId}&page=1`);
            const data = await res.json();
            showTVShows(data.results); 
        } catch (error) {
            console.error('Error fetching TV shows by genre:', error);
        }
    }


    function showTVShows(tvShows) {
        tvShown.innerHTML = '';

        const tvShowsGrid = document.createElement('div');
        tvShowsGrid.classList.add('movies-grid');

        tvShows.forEach((show) => {
            const { id, name, poster_path, vote_average, first_air_date, genre_ids } = show;

            const genres = genre_ids.map(id => genreMap[id]).join(', ');

            const tvShowEl = document.createElement('div');
            tvShowEl.classList.add('movie-card');

            tvShowEl.innerHTML = `
                <div class="card-head">
                    <img src="${poster_path ? IMG_PATH + poster_path : 'fallback-image-url'}" alt="${name}" class="card-img" />
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
                    <h3 class="card-title">${name}</h3>
                    <div class="card-info">
                        <span class="genre">${genres}</span>
                        <span class="year">${first_air_date.split("-")[0]}</span>
                    </div>
                    <a href="details1.html?id=${id}" class="view-details">View Details</a>
                </div>
            `;
            tvShowsGrid.appendChild(tvShowEl);
        });

        tvShown.appendChild(tvShowsGrid);
    }

    genreFilter.addEventListener('change', () => {
        const selectedGenreId = genreFilter.value;
        if (selectedGenreId === 'all') {
            showTVShows(allTVShows); 
        } else {
            getTVShowsByGenre(selectedGenreId); 
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = search.value;

        if (searchTerm && searchTerm !== '') {
            fetch(SEARCH_API + searchTerm)
                .then(res => res.json())
                .then(data => showTVShows(data.results))
                .catch(error => console.error('Error searching TV shows:', error));
            search.value = '';
        } else {
            window.location.reload();
        }
    });


    fetchGenres().then(() => getTVShows());
});