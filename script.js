// $(".search-button").on("click", function () {

//     $.ajax({
      
//         url: "http://www.omdbapi.com/?apikey=5809e0e0&s=" + $(".input-keyword").val(),
//         success: results => {
            
//             const movies = results.Search;
//             let cards = "";
//             movies.forEach(movie => {
                
//                 cards += showCards(movie);
    
//             });
    
//             $(".movies-container").html(cards);
    
//             $(".modal-detail-button").on("click", function () {
             
//                 $.ajax({
                   
//                     url: "http://www.omdbapi.com/?apikey=5809e0e0&i=" + $(this).data("imdbid"),
//                     success: detail => {
                      
//                         let movieDetails = showMovieDetails(detail);
                        
//                         $(".modal-body").html(movieDetails);
//                     }
    
//                 });
    
//             })
    
//         },
//         error: (e) => {
    
//             console.log(e.responseText);
//         }
    
//     });

// })


// fetch

// const searchButton = document.querySelector(".search-button");

// searchButton.addEventListener("click", function () {
    
//     const inputKeyword = document.querySelector(".input-keyword");
//     fetch(`http://www.omdbapi.com/?apikey=5809e0e0&s=${inputKeyword.value}`)
//         .then(result => result.json())
//         .then(result => {
             
//             const movies = result.Search;
//             let cards = "";
//             movies.forEach(movie => cards += showCards(movie));
//             const movieContainer = document.querySelector(".movies-container");
//             movieContainer.innerHTML = cards;
//             const modalDetailButtons = movieContainer.querySelectorAll(".modal-detail-button");
//             modalDetailButtons.forEach(modalDetailButton => {
               
//                 modalDetailButton.addEventListener("click", function () {
                    
//                     const imdbid = this.dataset.imdbid;
//                     fetch(`http://www.omdbapi.com/?apikey=5809e0e0&i=${imdbid}`)
//                         .then(detail => detail.json())
//                         .then(detail => {
//                             const movieDetail = showMovieDetails(detail);
//                             const modalBody = document.querySelector(".modal-body");
//                             modalBody.innerHTML = movieDetail;
//                         });

//                 })

//             })

//         });


// });

// Refactor

const searchButton = document.querySelector(".search-button");
searchButton.addEventListener("click", async function () {
 
    try {

        const inputKeyword = document.querySelector(".input-keyword");
        const movies = await getMovies(inputKeyword.value);
        updateUI(movies);
        
    } catch (error) {
        
        showError(error);
        

    }

})

// event binding

document.addEventListener("click", async function (e) {
    
    try {

        if (e.target.classList.contains("modal-detail-button")) {
        
            const imdbid = e.target.dataset.imdbid;
            const movieDetail = await getMovieDetail(imdbid);
            updateUIDetail(movieDetail);
        

        }
        
    } catch (error) {
      
        showError(error);

    }

});

function getMovieDetail(imdbid) {
     
    return fetch(`http://www.omdbapi.com/?apikey=5809e0e0&i=${imdbid}`)
        .then(detail => {
            
            if (!detail.ok) {
                
                throw new Error(detail.Error);

            }

            return detail.json();

        })
        .then(detail => {
           
            if (detail.Response === "False") {
                
                throw new Error(detail.Error);

            }

            return detail;

        });
}


function updateUIDetail(detail) {
  
    const movieDetail = showMovieDetails(detail);
    const modalBody = document.querySelector(".modal-body");
    modalBody.innerHTML = movieDetail;


}

function getMovies(keyword) {

    return fetch(`http://www.omdbapi.com/?apikey=5809e0e0&s=${keyword}`)
        .then(result => {
            
            if (!result.ok) {
              
                throw new Error(result.Error);
        
            }
    
            return result.json();

        })
        .then(result => {

            if (result.Response === "False") {
               
                throw new Error(result.Error);
            }
            
            return result.Search

        });  

}

function updateUI(movies) {
    
    let cards = "";
    movies.forEach(movie => cards += showCards(movie));
    const movieContainer = document.querySelector(".movies-container");
    movieContainer.innerHTML = cards;

}


function showCards(movie) {
    
   return  `<div class="col-md-4 my-5">
                <div class="card">
                <img src="${movie.Poster}" alt="${movie.Title} Picture" height="500px">
                <div class="card-body">
                    <h5 class="card-title">${movie.Title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${movie.Year}</h6>
                    <a href="#" class="btn btn-primary modal-detail-button" data-toggle="modal" data-target="#movieDetail" data-imdbid="${movie.imdbID}">Details</a>
                </div>
                </div> 
            </div>`

}

function showMovieDetails(detail) {
   
    return `<div class="container-fluid">
                <div class="row">
                <div class="col-md-5">
                    <img src="${detail.Poster}" alt="">
                </div>
                <div class="col-md">
                    <ul class="list-group">
                    <li class="list-group-item"><h3>${detail.Title}</h3></li>
                    <li class="list-group-item"><strong>Genre : </strong>${detail.Genre}</li>
                    <li class="list-group-item"><strong>Director : </strong>${detail.Director}</li>
                    <li class="list-group-item"><strong>Actors : </strong>${detail.Actors} </li>
                    <li class="list-group-item"><strong>Writer :</strong>${detail.Writer}</li>
                    <li class="list-group-item"><Strong>Plot</Strong> ${detail.Plot}</li>
                    </ul>
                </div>
                </div>
            </div>`

}

function showError(error) {
    
    const errorElement = `<div class="alert alert-danger ml-3" role="alert">
             ${error}
            </div>`
    const movieContainer = document.querySelector(".movies-container");
    movieContainer.innerHTML = errorElement;

}