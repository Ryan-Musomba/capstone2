document.addEventListener("DOMContentLoaded", () => {
    // Slider Functionality
    document.querySelectorAll('.slider-container').forEach(container => {
      const slider = container.querySelector('.manual-slider-1') || container.querySelector('.manual-slider-2');
      const prevBtn = container.querySelector('.prev-btn');
      const nextBtn = container.querySelector('.next-btn');
  
      prevBtn.addEventListener('click', () => {
        slider.scrollBy({ left: -300, behavior: 'smooth' });
      });
  
      nextBtn.addEventListener('click', () => {
        slider.scrollBy({ left: 300, behavior: 'smooth' });
      });
    });
  
    // Profile Dropdown
    const profileContainer = document.querySelector(".profile-container");
    const dropdownMenu = document.querySelector(".dropdown-menu");
  
    if (profileContainer && dropdownMenu) {
      profileContainer.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
      });
  
      document.addEventListener("click", () => {
        dropdownMenu.style.display = "none";
      });
    }
  
    // Logout Functionality
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("user");
        window.location.href = "home.html";
      });
    }
  
    // Dark Mode Handling
    let darkmode = localStorage.getItem("darkmode");
    const darkmodeToggle = document.querySelector(".toggle-ball");
    const items = document.querySelectorAll(
      ".container, .movie-list-title, .menu-list-item a,.card-body, .card-head, .navbar-container, .sidebar, .sidebar-icon, .toggle, .toggle-ball, .arrow, .movie-info, .movie-title, .sidebar-settings, .link-movies"
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
  
    // API Integration
    const API_KEY = "772faacae36b66d82aeeb0b4cd204121";
    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w1280";
    const MOVIE_API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=release_date.desc&page=1`;
    const TV_SHOW_API_URL = `https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
    const GENRE_API_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;
    const TRENDING_API_URL = `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`;
  
    const manualSlider1 = document.querySelector(".manual-slider-1");
    const manualSlider2 = document.querySelector(".manual-slider-2");
    const featuredContent = document.querySelector(".featured-content");
  
    let genreMap = {};
  
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
  
    async function fetchFeaturedContent() {
      try {
        const res = await fetch(TRENDING_API_URL);
        const data = await res.json();
        const trendingItem = data.results[0];
  
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
  
    async function fetchTopMovies() {
      try {
        const res = await fetch(MOVIE_API_URL);
        const data = await res.json();
        const top12Movies = data.results.slice(0, 12);
        displayMovies(top12Movies, manualSlider1);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
  
    async function fetchTopTVShows() {
      try {
        const res = await fetch(TV_SHOW_API_URL);
        const data = await res.json();
        const top12TVShows = data.results.slice(0, 12);
        displayMovies(top12TVShows, manualSlider2);
      } catch (error) {
        console.error("Error fetching TV shows:", error);
      }
    }
  
    function displayMovies(items, container) {
      container.innerHTML = "";
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
      fetchFeaturedContent();
      fetchTopMovies();
      fetchTopTVShows();
    });
  });