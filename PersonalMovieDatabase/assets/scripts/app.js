const addMovieModal = document.getElementById('add-modal');
const startAddMovieBtn = document.querySelector('header button');
const backdrop = document.getElementById('backdrop');
const cancleAddMovieBtn = addMovieModal.querySelector('.btn--passive')
const confirmAddMovieBtn = cancleAddMovieBtn.nextElementSibling;
const userInputs = addMovieModal.querySelectorAll('input');
const entryTextSection = document.getElementById('entry-text');
const deleteMovieModal  = document.getElementById('delete-modal');

const movies = [];

const toggleBackdrop = () => {
    backdrop.classList.toggle('visible');
};

const updateUI = () => {
   if (movies.length === 0) {
    entryTextSection.style.display = 'block';
   } else {
       entryTextSection.style.display = 'none';
   }
};


const cancelMovieDeletion = () => {
    toggleBackdrop();
    deleteMovieModal.classList.remove('visible');
};


const deleteMovieHandler = (movieId) => {
    let movieIndex = 0;
    for(const movie of movies) {
        if (movie.id === movieId) {
            break;
        }
        movieIndex++;
    }
    movies.splice(movieIndex, 1);
    const listRoot = document.getElementById('movie-list');
    listRoot.children[movieIndex].remove();
    //listRoot.removeChild(listRoot.children[movieIndex]);
    cancelMovieDeletion();
    updateUI();
};


const startDeleteMovieHandler  = (movieId) => {
    deleteMovieModal.classList.add('visible');
    toggleBackdrop();
    const cancleDeletionMovieBtn = deleteMovieModal.querySelector('.btn--passive')
    let confirmDeletionMovieBtn = cancleDeletionMovieBtn.nextElementSibling;

    confirmDeletionMovieBtn.replaceWith(confirmDeletionMovieBtn.cloneNode(true));
    confirmDeletionMovieBtn = cancleDeletionMovieBtn.nextElementSibling;

    cancleDeletionMovieBtn.addEventListener('click', cancelMovieDeletion );
    confirmDeletionMovieBtn.addEventListener('click', deleteMovieHandler.bind(null, movieId) );
};

const renderNewMovieElement = ( id, title, imgUrl, rating) => {
    const newMovieEl = document.createElement('li');
    newMovieEl.className = 'movie-element';
    newMovieEl.innerHTML = `
    <div class="movie-element__img">
        <img src="${imgUrl}" alt="${title}">
    </div>
    <div class="movie-element__info">
        <h2>${title}</h2>
        <p>${rating}/5 stars</p>
    </div>
    `;

    const listRoot = document.getElementById('movie-list');
    newMovieEl.addEventListener('click', startDeleteMovieHandler.bind(null, id))
    listRoot.append(newMovieEl);
};

const closeMovieModal = () => {
    addMovieModal.classList.remove('visible');
};

const showMovieModal = () => {
    addMovieModal.classList.add('visible');
    toggleBackdrop();
};

const clearMovieInput = () => {
    for(const usrInput of userInputs) {
        usrInput.value = '';
    }
};

const cancelAddMovieHandler = () => {
    closeMovieModal();
    toggleBackdrop();
    clearMovieInput();
};

const addMovieHandler = () => {
    const titleValue = userInputs[0].value;
    const imgUrlValue = userInputs[1].value;
    const ratingValue = userInputs[2].value;
    console.log(titleValue)

    if(
        titleValue.trim() === '' ||
        imgUrlValue.trim() === '' ||
        ratingValue.trim() === '' ||
        ratingValue < 1 || ratingValue > 5
        ) {
        alert('please enter valid values( rating between 1 and 5).');
    }

    const newMovie = {
        id: Math.random().toString(),
        title: titleValue,
        image: imgUrlValue,
        rating: ratingValue
    };

    movies.push(newMovie);
    closeMovieModal();
    clearMovieInput();
    toggleBackdrop();
    renderNewMovieElement(newMovie.id, newMovie.title, newMovie.imgUrl, newMovie.rating);
    updateUI();

};

const backdropClickHandler = () => {
    closeMovieModal();
    cancelMovieDeletion();
    clearMovieInput();
};


startAddMovieBtn.addEventListener('click', showMovieModal);
backdrop.addEventListener('click', backdropClickHandler );
cancleAddMovieBtn.addEventListener('click', cancelAddMovieHandler);
confirmAddMovieBtn.addEventListener('click', addMovieHandler)