 // Apply dark or light mode based on localStorage
 document.addEventListener("DOMContentLoaded", () => {
    const darkmode = localStorage.getItem("darkmode");

    if (darkmode === "enabled") {
        document.body.classList.remove("darkmode");
        document.body.classList.add("lightmode");
    } else {
        document.body.classList.add("darkmode");
        document.body.classList.remove("lightmode");
      
    }
});

const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c'; // Replace with your TMDb API key
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';

// Get the TV show ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const tvShowId = urlParams.get('id');

// Fetch TV show details and videos
async function fetchTVShowDetails(tvShowId) {
    const TV_SHOW_URL = `https://api.themoviedb.org/3/tv/${tvShowId}?api_key=${API_KEY}`;
    const VIDEO_URL = `https://api.themoviedb.org/3/tv/${tvShowId}/videos?api_key=${API_KEY}`;

    try {
        // Fetch TV show details
        const tvShowRes = await fetch(TV_SHOW_URL);
        const tvShowData = await tvShowRes.json();
        populateTVShowDetails(tvShowData);

        // Fetch TV show videos (trailers)
        const videoRes = await fetch(VIDEO_URL);
        const videoData = await videoRes.json();
        populateTrailer(videoData.results);
    } catch (error) {
        console.error('Error fetching TV show details:', error);
    }
}

// Populate the TV show details on the page
function populateTVShowDetails(tvShow) {
    document.getElementById("tvshow-poster").src = `${IMG_PATH}${tvShow.poster_path}`;
    document.getElementById("tvshow-name").textContent = tvShow.name;
    document.querySelector(".genre").textContent = tvShow.genres
        .map(genre => genre.name)
        .join(", ");
    document.querySelector(".seasons").textContent = `${tvShow.number_of_seasons} Seasons`;
    document.querySelector(".age-rating").textContent = tvShow.adult ? "R" : "PG-13";
    document.querySelector(".description").textContent = tvShow.overview;
}

// Populate the trailer section with the first available trailer
function populateTrailer(videos) {
    const trailerSection = document.getElementById("trailer-section");
    const trailerVideo = document.getElementById("trailer-video");

    // Find the first trailer (usually of type "Trailer")
    const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube');

    if (trailer) {
        trailerVideo.src = `https://www.youtube.com/embed/${trailer.key}`;
    } else {
        trailerSection.innerHTML = '<h3>No trailer available</h3>';
    }
}

// Fetch and display TV show details and trailer
if (tvShowId) {
    fetchTVShowDetails(tvShowId);
} else {
    // Redirect back to the main page if no TV show ID is provided
    window.location.href = "index.html";
}