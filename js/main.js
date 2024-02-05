/**********************************************************************************
 *  BTI425 – Assignment 2
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 * 
 *  Name: Nishnath Bandari  Student ID: 105202220   Date: February 4, 2024
 * 
 *  Cyclic link: https://dark-pink-badger-sock.cyclic.app/
 **********************************************************************************/
document.addEventListener('DOMContentLoaded', function () {
    let page = 1;
    const perPage = 10;

    function loadMovieData(title = null) {
        const paginationElement = document.querySelector('.pagination');
        const moviesTableBody = document.querySelector('#moviesTable tbody');
        const currentPageElement = document.getElementById('current-page');

        const url = title
            ? `/api/movies?page=${page}&perPage=${perPage}&title=${title}`
            : `/api/movies?page=${page}&perPage=${perPage}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (title) {
                    page = 1;
                    paginationElement.classList.add('d-none');
                } else {
                    paginationElement.classList.remove('d-none');
                }

                moviesTableBody.innerHTML = '';

                currentPageElement.textContent = page;

                data.forEach(movie => {
                    const row = `
                        <tr data-id="${movie._id}">
                            <td>${movie.year}</td>
                            <td>${movie.title}</td>
                            <td>${movie.plot || 'N/A'}</td>
                            <td>${movie.rated || 'N/A'}</td>
                            <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60).toString().padStart(2, '0')}</td>
                        </tr>`;
                    moviesTableBody.innerHTML += row;
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }
    loadMovieData();

    document.getElementById('previous-page').addEventListener('click', function () {
        if (page > 1) {
            page--;
            loadMovieData();
        }
    });

    document.getElementById('next-page').addEventListener('click', function () {
        page++;
        loadMovieData();
    });

    document.getElementById('searchForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        loadMovieData(title);
    });

    document.getElementById('clearForm').addEventListener('click', function () {
        document.getElementById('title').value = '';
        loadMovieData();
    });

    document.getElementById('moviesTable').addEventListener('click', function (event) {
        if (event.target.tagName === 'TD') {
            const movieId = event.target.parentNode.getAttribute('data-id');

            fetch(`/api/movies/${movieId}`)
                .then(response => response.json())
                .then(movie => {
                    document.querySelector('#detailsModal .modal-title').textContent = movie.title;

                    const modalBody = document.querySelector('#detailsModal .modal-body');
                    modalBody.innerHTML = `
                        <img class="img-fluid w-100" src="${movie.poster || 'https://via.placeholder.com/300'}"><br><br>
                        <strong>Directed By:</strong> ${movie.directors.join(', ')}<br><br>
                        <p>${movie.fullplot}</p>
                        <strong>Cast:</strong> ${movie.cast.join(', ') || 'N/A'}<br><br>
                        <strong>Awards:</strong> ${movie.awards.text}<br>
                        <strong>IMDB Rating:</strong> ${movie.imdb.rating} (${movie.imdb.votes} votes)`;

                    const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
                    detailsModal.show();
                })
                .catch(error => console.error('Error fetching movie details:', error));
        }
    });
});
