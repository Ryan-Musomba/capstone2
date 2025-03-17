
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

const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c'; 
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';

const urlParams = new URLSearchParams(window.location.search);
const tvShowId = urlParams.get('id');


async function fetchTVShowDetails(tvShowId) {
    const TV_SHOW_URL = `https://api.themoviedb.org/3/tv/${tvShowId}?api_key=${API_KEY}`;
    const VIDEO_URL = `https://api.themoviedb.org/3/tv/${tvShowId}/videos?api_key=${API_KEY}`;

    try {
     
        const tvShowRes = await fetch(TV_SHOW_URL);
        const tvShowData = await tvShowRes.json();
        populateTVShowDetails(tvShowData);

       
        const videoRes = await fetch(VIDEO_URL);
        const videoData = await videoRes.json();
        populateTrailer(videoData.results);
    } catch (error) {
        console.error('Error fetching TV show details:', error);
    }
}

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

function populateTrailer(videos) {
    const trailerSection = document.getElementById("trailer-section");
    const trailerVideo = document.getElementById("trailer-video");

    const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube');

    if (trailer) {
        trailerVideo.src = `https://www.youtube.com/embed/${trailer.key}`;
    } else {
        trailerSection.innerHTML = '<h3>No trailer available</h3>';
    }
}

if (tvShowId) {
    fetchTVShowDetails(tvShowId);
} else {
  
    window.location.href = "index.html";
}