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
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');


async function fetchMovieDetails(movieId) {
const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c';
const MOVIE_URL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`;
const VIDEO_URL = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`;

try {

  const movieRes = await fetch(MOVIE_URL);
  const movieData = await movieRes.json();
  populateMovieDetails(movieData);

  const videoRes = await fetch(VIDEO_URL);
  const videoData = await videoRes.json();
  populateTrailer(videoData.results);
} catch (error) {
  console.error('Error fetching data:', error);
}
}

function populateMovieDetails(movie) {
document.getElementById('movie-poster').src = `https://image.tmdb.org/t/p/w1280${movie.poster_path}`;
document.getElementById('movie-name').textContent = movie.title;
document.querySelector('.genre').textContent = movie.genres.map(genre => genre.name).join(', ');
document.querySelector('.duration').textContent = `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`;
document.querySelector('.age-rating').textContent = movie.adult ? 'R' : 'PG-13';
document.querySelector('.description').textContent = movie.overview;
}

function populateTrailer(videos) {
const trailerSection = document.getElementById('trailer-section');
const trailerVideo = document.getElementById('trailer-video');


const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube');

if (trailer) {
  trailerVideo.src = `https://www.youtube.com/embed/${trailer.key}`;
} else {
  trailerSection.innerHTML = '<h3>No trailer available</h3>';
}
}

if (movieId) {
fetchMovieDetails(movieId);
} else {

window.location.href = 'index.html';
}