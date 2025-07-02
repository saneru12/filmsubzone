const sheetURL = 'https://shore-luxuriant-jelly.glitch.me/movies';
let selectedLanguage = 'null';
let selectedGenre = 'null';
let selectedYear = 'null';
let searchKeyword = '';

function loadMovies() {
  // ✅ Sමොහොතක් රැදෙන්න
  document.getElementById('downloadLoader').style.display = 'block';

  function generateMovieId(title, year) {
    return `${title}-${year}`.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
  }

  const container = document.getElementById('movieList');
  container.innerHTML = `
    <div class="col-12 d-flex justify-content-center">
      <dotlottie-player 
        src="https://lottie.host/ddf15a75-9c01-4689-a871-2ce907ae0f7c/vIDwnXf6Vv.lottie" 
        background="transparent" 
        speed="1" 
        style="width: 300px; height: 300px;" 
        loop 
        autoplay>
      </dotlottie-player>
    </div>
  `;

  fetch(sheetURL)
    .then(res => res.json())
    .then(data => {
      const filtered = data.filter(movie => {
        const lang = (movie.language || '').trim().toLowerCase();
        const genres = Array.isArray(movie.genres)
          ? movie.genres.map(g => g.trim().toLowerCase())
          : [];
        const year = (movie.year || '').toString().trim();
        const title = (movie.title || '').toLowerCase();

        const langMatch = selectedLanguage === 'null' || selectedLanguage === 'all' || lang === selectedLanguage.toLowerCase();
        const genreMatch = selectedGenre === 'null' || genres.includes(selectedGenre.toLowerCase());
        const yearMatch = selectedYear === 'null' || year === selectedYear;
        const titleMatch = title.includes(searchKeyword);

        return langMatch && genreMatch && yearMatch && titleMatch;
      });

      const allMoviesButton = document.querySelector('[data-language="all"]');

      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="col-12">
            <p class="text-center text-muted">
              Click the <strong>All Movies</strong> button to view all available movies.
            </p>
          </div>`;
        if (allMoviesButton) allMoviesButton.classList.add('highlight-btn');
        
        // ✅ Hide the loading overlay
        document.getElementById('downloadLoader').style.display = 'none';
        return;
      }

      if (allMoviesButton) allMoviesButton.classList.remove('highlight-btn');

      container.innerHTML = '';
      filtered.forEach(movie => {
        const genreBadges = Array.isArray(movie.genres)
          ? movie.genres.map(g => `<span class="badge bg-secondary me-1">${g.trim()}</span>`).join(' ')
          : '';

        const movieId = generateMovieId(movie.title, movie.year);
        const moviePageURL = `movie.html?id=${movieId}`;

        const card = `
          <div class="col-md-3 col-sm-6 mb-4">
            <div class="card movie-card h-100">
              <a href="${moviePageURL}">
                <img src="${movie.poster}" class="card-img-top movie-poster" alt="Movie Poster">
              </a>
              <div class="card-body">
                <span class="badge bg-danger me-1">${movie.quality}</span>
                <span class="badge bg-primary">${movie.language}</span>
                ${genreBadges}
                <span class="badge badge-sub text-white mb-2 d-block mt-2">සින්හල උපසිරැසි සහිතව</span>
                
                <a href="${moviePageURL}" class="text-decoration-none">
                  <h6 class="movie-title">${movie.title} (${movie.year})</h6>
                </a>

                <a href="${movie.trailer}" class="btn btn-outline-primary btn-sm w-100 mt-2">Watch Trailer</a>
                <h5 class="badge bg-primary text-white mb-2">Download</h5>
                <a href="${movie.link1080}" onclick="showLoading()" class="btn btn-outline-primary btn-sm w-100 mt-2">1080p</a>
                <a href="${movie.link720}" onclick="showLoading()" class="btn btn-outline-primary btn-sm w-100 mt-2">720p</a>
                <a href="${movie.subtitle}" onclick="showLoading()" class="btn btn-outline-primary btn-sm w-100 mt-2">උපසිරැසි</a>


                <button onclick="shareMovie('${movie.title}', '${moviePageURL}')" class="btn btn-outline-success btn-sm w-100 mt-2">🔗 Share</button>
              </div>
            </div>
          </div>
        `;
        container.innerHTML += card;
      });

      // ✅ Hide the loading overlay
      document.getElementById('downloadLoader').style.display = 'none';
    })
    .catch(error => {
      container.innerHTML = `<div class="col-12"><p class="text-center text-danger">Error loading data. Reload the page</p></div>`;
      document.getElementById('downloadLoader').style.display = 'none'; // Hide on error
      console.error("Error fetching data:", error);
    });
}

function showLoading() {
  document.getElementById('downloadLoader').style.display = 'block';

  // Auto-hide after few seconds (in case download doesn't start instantly)
  setTimeout(() => {
    document.getElementById('downloadLoader').style.display = 'none';
  }, 50000); // 6 seconds
}


window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.language-filter').forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      selectedLanguage = this.getAttribute('data-language') || 'null';
      selectedGenre = 'null';
      selectedYear = 'null';
      searchKeyword = '';
      loadMovies();
    });
  });

  document.querySelectorAll('.genre-filter').forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      selectedGenre = this.getAttribute('data-genre') || 'null';
      loadMovies();
    });
  });

  document.querySelectorAll('.year-filter').forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      selectedYear = this.getAttribute('data-year') || 'null';
      loadMovies();
    });
  });

  document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const searchBtn = document.getElementById('searchBtn');
    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';

    searchKeyword = document.getElementById('searchInput').value.trim().toLowerCase();

    loadMovies();
    setTimeout(() => {
      searchBtn.disabled = false;
      searchBtn.textContent = 'Search';
    }, 500);
  });

  loadMovies();
});

function shareMovie(title, url) {
  if (navigator.share) {
    navigator.share({
      title: title,
      text: `Check out this movie: ${title}`,
      url: url
    }).catch(err => console.error("Share failed:", err));
  } else {
    navigator.clipboard.writeText(location.origin + '/' + url)
      .then(() => alert("Link copied to clipboard!"))
      .catch(() => alert("Could not copy link."));
  }
}

var myCarousel = document.querySelector('#carouselExampleCaptions');
var carousel = new bootstrap.Carousel(myCarousel, {
  interval: 3000,
  pause: false,
  ride: 'carousel',
  wrap: true
});
