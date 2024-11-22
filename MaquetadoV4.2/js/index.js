const inputQuantity = document.querySelector('.input-quantity');
const btnIncrement = document.querySelector('#increment');
const btnDecrement = document.querySelector('#decrement');

let valueByDefault = parseInt(inputQuantity.value);

// Funciones Click

btnIncrement.addEventListener('click', () => {
	valueByDefault += 1;
	inputQuantity.value = valueByDefault;
});

btnDecrement.addEventListener('click', () => {
	if (valueByDefault === 1) {
		return;
	}
	valueByDefault -= 1;
	inputQuantity.value = valueByDefault;
});

// Toggle
// Constantes Toggle Titles
const toggleDescription = document.querySelector(
	'.title-description'
);
const toggleAdditionalInformation = document.querySelector(
	'.title-additional-information'
);
const toggleReviews = document.querySelector('.title-reviews');

// Constantes Contenido Texto
const contentDescription = document.querySelector(
	'.text-description'
);
const contentAdditionalInformation = document.querySelector(
	'.text-additional-information'
);
const contentReviews = document.querySelector('.text-reviews');

// Funciones Toggle
toggleDescription.addEventListener('click', () => {
	contentDescription.classList.toggle('hidden');
});

toggleAdditionalInformation.addEventListener('click', () => {
	contentAdditionalInformation.classList.toggle('hidden');
});

toggleReviews.addEventListener('click', () => {
	contentReviews.classList.toggle('hidden');
});
document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('reviewForm');
    const userReviewsContainer = document.querySelector('.user-reviews');

    // Cargar las reseñas guardadas
    loadReviews();

    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const userName = document.getElementById('userName').value.trim();
        const userReview = document.getElementById('userReview').value.trim();

        if (userName && userReview) {
            // Crear un nuevo elemento de reseña
            const reviewElement = createReviewElement(userName, userReview);

            // Añadir la reseña a la lista
            userReviewsContainer.appendChild(reviewElement);

            // Guardar la reseña en el almacenamiento local
            saveReview(userName, userReview);

            // Limpiar el formulario
            reviewForm.reset();
        }
    });

    function createReviewElement(name, review) {
        const reviewDiv = document.createElement('div');
        reviewDiv.classList.add('user-review');

        const reviewName = document.createElement('h5');
        reviewName.textContent = name;

        const reviewText = document.createElement('p');
        reviewText.textContent = review;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('btn-delete-review');

        // Añadir evento de clic para eliminar la reseña
        deleteButton.addEventListener('click', () => {
            deleteReview(reviewDiv, name, review);
        });

        reviewDiv.appendChild(reviewName);
        reviewDiv.appendChild(reviewText);
        reviewDiv.appendChild(deleteButton);

        return reviewDiv;
    }

    function saveReview(name, review) {
        const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        reviews.push({ name, review });
        localStorage.setItem('reviews', JSON.stringify(reviews));
    }

    function loadReviews() {
        const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        reviews.forEach(review => {
            const reviewElement = createReviewElement(review.name, review.review);
            userReviewsContainer.appendChild(reviewElement);
        });
    }

    function deleteReview(reviewElement, name, review) {
        // Eliminar el elemento de reseña del DOM
        reviewElement.remove();

        // Actualizar las reseñas en el almacenamiento local
        const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        const updatedReviews = reviews.filter(
            (item) => item.name !== name || item.review !== review
        );
        localStorage.setItem('reviews', JSON.stringify(updatedReviews));
    }
});
