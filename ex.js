const sheetURL = 'https://script.google.com/macros/s/AKfycbx_sI2rvw2sWjANExxHziSwIOMIc88WjwXwwsJbspPL4ZmhA5E9-LvJhtaZcS4pIo8/exec';
let selectedLanguage = 'null';
let selectedGenre = 'null';
let selectedYear = 'null';
let searchKeyword = '';

function loadMovies() {
  function generateMovieId(title, year) {
    return `${title}-${year}`.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
  }
  
  const container = document.getElementById('movieList');
  //loding
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
        const genres = movie.genres ? movie.genres.split(',').map(g => g.trim().toLowerCase()) : [];
        const year = (movie.year || '').toString().trim();
        const title = (movie.title || '').toLowerCase();

        const langMatch = selectedLanguage === 'null' || selectedLanguage === 'all' || lang === selectedLanguage.toLowerCase();
        const genreMatch = selectedGenre === 'null' || genres.includes(selectedGenre.toLowerCase());
        const yearMatch = selectedYear === 'null' || year === selectedYear;
        const titleMatch = title.includes(searchKeyword);

        return langMatch && genreMatch && yearMatch && titleMatch;
      });

      const allMoviesButton = document.querySelector('[data-language="all"]'); // Select the "All Movie" button

      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="col-12">
            <p class="text-center text-muted">
              Click the <strong>All Movies</strong> button to view all available movies.
            </p>
          </div>`;

        // Highlight the 'All Movies' button if no movies are found
        if (allMoviesButton) {
          allMoviesButton.classList.add('highlight-btn');
        }

        return;
      }

      // Remove highlight from the 'All Movies' button if movies are found
      if (allMoviesButton) {
        allMoviesButton.classList.remove('highlight-btn');
      }

      container.innerHTML = '';
      filtered.forEach(movie => {
        const genreBadges = movie.genres
          ? movie.genres.split(',').map(g => `<span class="badge bg-secondary me-1">${g.trim()}</span>`).join(' ')
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
                <a href="${movie.subtitle}" class="btn btn-outline-primary btn-sm w-100 mt-2">උපසිරැසි</a>
                <a href="${movie.link1080}" class="btn btn-outline-primary btn-sm w-100 mt-2">1080p</a>
                <a href="${movie.link720}" class="btn btn-outline-primary btn-sm w-100 mt-2">720p</a>
      
                <button onclick="shareMovie('${movie.title}', '${moviePageURL}')" class="btn btn-outline-success btn-sm w-100 mt-2">🔗 Share</button>
              </div>
            </div>
          </div>
        `;
        container.innerHTML += card;
      });      
    })
    .catch(error => {
      container.innerHTML = `<div class="col-12"><p class="text-center text-danger">Error loading data.Relode the page</p></div>`;
      console.error("Error fetching data:", error);
    });
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