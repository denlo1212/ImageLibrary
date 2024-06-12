const library = require("./imageHandling/imageLibrary");
const appStateSlide = require('./domain/AppState');  // Importing the AppState instance

const nextButton = document.querySelector(".next");
const prevButton = document.querySelector(".prev");

function plusSlides(n) {
    const state = appStateSlide.getState();
    const imageWithinDialog = document.getElementById("image-within-dialog");
    let currentImageIndex = parseInt(imageWithinDialog.getAttribute("data-index"));
    const startingIndex = (state.currentPage - 1) * state.imagesPerPage;
    const maxIndex = library.getAmountOfImages() - 1;

    currentImageIndex += n;
    console.log(currentImageIndex)

    if (currentImageIndex < 0) {
        currentImageIndex = 0; // Prevent going before index 0
    } else if (currentImageIndex > maxIndex) {
        currentImageIndex = maxIndex; // Prevent going beyond maxImages
    }

    if (currentImageIndex < startingIndex && state.currentPage > 1) {
        appStateSlide.updateState({ currentPage: state.currentPage - 1 });
        currentImageIndex = (state.currentPage - 1) * state.imagesPerPage + state.imagesPerPage - 1;
        window.render();
    } else if (currentImageIndex >= startingIndex + state.imagesPerPage && state.currentPage < Math.ceil(library.getImages().length / state.imagesPerPage)) {
        appStateSlide.updateState({ currentPage: state.currentPage + 1 });
        currentImageIndex = (state.currentPage - 1) * state.imagesPerPage;
        window.render();
    }

    imageWithinDialog.src = library.getImages()[currentImageIndex].path;
    imageWithinDialog.setAttribute("data-index", currentImageIndex);
}

document.addEventListener("keydown", function(event) {
    const state = appStateSlide.getState();
    console.log(state.isDialogOpen)
    if (state.isDialogOpen) {
        if (event.key === "ArrowLeft") {
            plusSlides(-1);
        } else if (event.key === "ArrowRight") {
            plusSlides(1);
        }
    }
});

nextButton.addEventListener("click", () => {
    plusSlides(1);
});

prevButton.addEventListener("click", () => {
    plusSlides(-1);
});
