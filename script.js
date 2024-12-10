document.addEventListener("DOMContentLoaded", function () {
  // элементы
  const main = document.getElementsByClassName("main")[0];
  const movieTitle = document.getElementsByClassName("movieTitle")[0];
  const similarMovieTitle = document.getElementsByClassName("movieTitle")[1];
  const movie = document.getElementsByClassName("movie")[0];

  // кнопки
  const themeBtn = document.getElementById("themeChange");
  const searchBtn = document.getElementById("searchBtn");

  // слушатели событий
  if (themeBtn) {
    themeBtn.addEventListener("click", themeChange);
  }
  if (searchBtn) {
    searchBtn.addEventListener("click", findMovie);
  }

  
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      findMovie();
    }
  });

  // смена темы
  function themeChange() {
    const body = document.querySelector("body");
    body.classList.toggle("dark");
  }

  // поиск фильма
  async function findMovie() {
    let search = document.getElementsByName("search")[0].value;
    let loader = document.getElementsByClassName("loader")[0];
    loader.style.display = "block";
    let data = { apikey: "2e338ed8", t: search };
    let result = await sendRequest("http://www.omdbapi.com/", "GET", data);
    loader.style.display = "none";

    if (result.Response === "False") {
      movie.style.display = "none";
      main.style.display = "block";
      movieTitle.style.display = "block";
      movieTitle.innerHTML = ` ${result.Error}`;
    } else {
      console.log(result);
      showMovie(result);
    }
  }

  function showMovie(movie) {
    main.style.display = "block";
    movieTitle.style.display = "block";
    document.getElementsByClassName("movie")[0].style.display = "flex";
    document.getElementById(
      "movieImg"
    ).style.backgroundImage = `url(${movie.Poster})`;
    movieTitle.innerHTML = `${movie.Title}`;
    const movieDesc = document.getElementsByClassName("movieDescription")[0];
    movieDesc.innerHTML = "";
    let params = [
      "imdbRating",
      "Year",
      "Genre",
      "Actors",
      "Country",
      "Language",
      "Director",
      "Writer",
    ];
    params.forEach((key) => {
      let descDiv = document.createElement("div");
      descDiv.classList.add("desc");

      let titleElement = document.createElement("span");
      titleElement.classList.add("title");
      titleElement.textContent = key;

      let subtitleElement = document.createElement("span");
      subtitleElement.classList.add("subtitle");
      subtitleElement.textContent = movie[key];

      descDiv.appendChild(titleElement);
      descDiv.appendChild(subtitleElement);

      movieDesc.appendChild(descDiv);
    });
  }

  async function findsimilarMovies() {
    const search = document.getElementsByClassName("search")[0].value;
    const similarMovieTitle = document.getElementsByClassName("movieTitle")[1];
    const data = { apikey: "2e338ed8", s: search };
    const result = await sendRequest("http://www.omdbapi.com/", "GET", data);
    console.log(result.Search);
    if (result.Response == "False") {
    } else {
      similarMovieTitle.style.display = "block";
      similarMovieTitle.innerHTML = `найдено похожих фильмов: ${result.totalResults}`;
      console.log(result.Search);
      showSimilarMovies(result.Search);
    }
  }

  function showSimilarMovies(movies) {
    const similarMovies = document.getElementsByClassName("similarMovie")[0];
    similarMovies.innerHTML = "";
    similarMovies.style.display = "grid";
    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      if (movie.Poster != "N/A") {
        let similarMovie = `
      <div class="similarMovieCard" style="background-image: url('${movie.Poster}');"'>
      <div class="saved" onclick="addSaved()"
      data-imdbID="${movie.imdbID}" data-title="${movie.Title}" data-poster="${movie.Poster}">

      </div>
      <div class="similarMovieTitle" >
       ${movie.Title} 
      </div>
     </div>`;
        similarMovies.innerHTML += similarMovie;
      }
    }
  }

  async function sendRequest(url, method, data) {
    if (method == "POST") {
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      response = await response.json();
      return response;
    } else if (method == "GET") {
      url = url + "?" + new URLSearchParams(data);
      let response = await fetch(url, {
        method: "GET",
      });
      response = await response.json();
      return response;
    }
  }
});

function addSaved(event){
  const target = event.currentTarget;

  //extract movie data from the element's attributes
  const movieData ={
    title:target.getAttribute("data-title"),
    poster:target.getAttribute("data-poster"),
    imdbID:target.getAttribute("data-imdbID"),
  };


  //get the existing favorites list or initialize it as an empty array
  const favs = JSON.parse(localStorage.getItem("favs")) ;

  //check if the movie is already in the favorites
  const movieIndex = favs.findIndex(
    (movie)=> movie.imdbID == movieData.imdbID
  );
  if(movieIndex > -1){
    //if the movie exists, remove it
    target.classList.remove()
    favs.splice(movieIndex, 1);
    console.log(favs);
    
  }else{
    favs.push(movieIndex);
  }
  //save the updated favorites list back to localStorage
    localStorage.setItem("favs", JSON.stringify(favs));
}

const favorites = JSON.parse(localStorage.getItem("favs"))
const favCards = document.getElementsByClassName("favoritesCards")[0]
console.log(favorites);

favorites.forEach((elem)=>{
  const card = document.createElement("div");
  const cardTitle = document.createElement("div");
  cardTitle.classList.add("favoritTitle")
  cardTitle.innerHTML=elem.title
  card.classList.add("favoritesCard")
  card.style.backgroundImage=`url(${elem.poster})`
  card.appendChild(cardTitle)
  favCards.appendChild(card);
});



// console.log(Boolean(0));
// console.log(Boolean(""));
// console.log(Boolean(undefined));
// console.log(Boolean(null));
// console.log(Boolean(NaN));

