document.addEventListener("DOMContentLoaded", () => {
    // Toggle dropdown menu
    const profileContainer = document.querySelector(".profile-container");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    if (profileContainer && dropdownMenu) {
        profileContainer.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent the click from propagating to the document
            dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", () => {
            dropdownMenu.style.display = "none";
        });
    }

    // Logout functionality
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("user"); // Clear user data
            window.location.href = "home.html"; // Redirect to home.html after logout
        });
    }

    // Redirect to index1.html if the user is already logged in
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        window.location.href = "index1.html"; // Redirect to the main website
    }

    // Dark Mode Handling
    let darkmode = localStorage.getItem("darkmode");
    const darkmodeToggle = document.querySelector(".toggle-ball");
    const items = document.querySelectorAll(
        ".container, .movie-list-title, .menu-list-item a, .card-head, .navbar-container, .sidebar, .sidebar-icon, .toggle, .toggle-ball, .arrow, .movie-info, .movie-title, .sidebar-settings, .link-movies"
    );
    const enableDarkmode = () => {
        document.body.classList.add("darkmode");
        items.forEach((item) => item.classList.add("active"));
        localStorage.setItem("darkmode", "enabled");
    };
    const disableDarkmode = () => {
        document.body.classList.remove("darkmode");
        items.forEach((item) => item.classList.remove("active"));
        localStorage.setItem("darkmode", "disabled");
    };
    if (darkmode === "enabled") enableDarkmode();
    darkmodeToggle.addEventListener("click", () => {
        darkmode = localStorage.getItem("darkmode");
        if (darkmode !== "enabled") {
            enableDarkmode();
        } else {
            disableDarkmode();
        }
    });

    // API Configuration
    const API_KEY = "772faacae36b66d82aeeb0b4cd204121";
    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w1280"; // Use a larger image size for the featured section
    const MOVIE_API_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
    const TV_SHOW_API_URL = `https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
    const GENRE_API_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;
    const TRENDING_API_URL = `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`; // Fetch trending movies or TV shows

    // DOM Elements
    const moviesGrid = document.querySelector(".movies-grid");
    const manualSlider1 = document.querySelector(".manual-slider-1");
    const manualSlider2 = document.querySelector(".manual-slider-2");
    const featuredContent = document.querySelector(".featured-content");

    let genreMap = {};

    // Fetch Genres
    async function fetchGenres() {
        try {
            const res = await fetch(GENRE_API_URL);
            const data = await res.json();
            data.genres.forEach((genre) => {
                genreMap[genre.id] = genre.name;
            });
        } catch (error) {
            console.error("Error fetching genres:", error);
        }
    }

    // Fetch Featured Content (Trending Movie or TV Show)
    async function fetchFeaturedContent() {
        try {
            const res = await fetch(TRENDING_API_URL);
            const data = await res.json();
            const trendingItem = data.results[0]; // Get the first trending item

            // Update the featured section
            featuredContent.style.background = `
                linear-gradient(to bottom, rgba(0, 0, 0, 0), #151515),
                url('${IMAGE_BASE_URL}${trendingItem.backdrop_path}') no-repeat center center/cover
            `;
            featuredContent.querySelector(".featured-title").textContent = trendingItem.title || trendingItem.name;
            featuredContent.querySelector(".featured-text").textContent = trendingItem.overview;
            featuredContent.querySelector(".featured-button").addEventListener("click", () => {
                window.location.href = `detail.html?id=${trendingItem.id}&type=${trendingItem.media_type}`;
            });
        } catch (error) {
            console.error("Error fetching featured content:", error);
        }
    }

    // Fetch Top 12 Movies
    async function fetchTopMovies() {
        try {
            const res = await fetch(MOVIE_API_URL);
            const data = await res.json();
            const top12Movies = data.results.slice(0, 12); // Get top 12 movies
            displayMovies(top12Movies, manualSlider1);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    }

    // Fetch Top 12 TV Shows
    async function fetchTopTVShows() {
        try {
            const res = await fetch(TV_SHOW_API_URL);
            const data = await res.json();
            const top12TVShows = data.results.slice(0, 12); // Get top 12 TV shows
            displayMovies(top12TVShows, manualSlider2);
        } catch (error) {
            console.error("Error fetching TV shows:", error);
        }
    }

    // Display Movies or TV Shows
    function displayMovies(items, container) {
        container.innerHTML = ""; // Clear existing content
        items.forEach((item) => {
            const genres = item.genre_ids.map((id) => genreMap[id]).join(", ");
            const releaseDate = item.release_date || item.first_air_date;
            const title = item.title || item.name;

            const itemCard = document.createElement("div");
            itemCard.classList.add("movie-card");
            itemCard.innerHTML = `
                <div class="card-head">
                    <img src="${IMAGE_BASE_URL}${item.poster_path}" alt="${title}" class="card-img" />
                    <div class="card-overlay"></div>
                    <div class="bookmark">
                        <i class="fa-solid fa-bookmark"></i>
                    </div>
                    <div class="rating">
                        <i class="fa-solid fa-star"></i>
                        <span>${item.vote_average.toFixed(1)}</span>
                    </div>
                    <div class="play">
                        <i class="fa-solid fa-play"></i>
                    </div>
                </div>
                <div class="card-body">
                    <h3 class="card-title">${title}</h3>
                    <div class="card-info">
                        <span class="genre">${genres}</span>
                        <span class="year">${releaseDate.split("-")[0]}</span>
                    </div>
                    <a href="detail.html?id=${item.id}&type=${item.title ? 'movie' : 'tv'}" class="view-details">View Details</a>
                </div>
            `;
            container.appendChild(itemCard);
        });
    }

    // Initialize
    fetchGenres().then(() => {
        fetchFeaturedContent(); // Fetch and display featured content
        fetchTopMovies(); // Fetch and display top 12 movies
        fetchTopTVShows(); // Fetch and display top 12 TV shows
    });
});