const library = require("./imageHandling/imageLibrary");
const appStateSlide = require('./domain/appState.js');

const nextButton = document.querySelector(".next");
const prevButton = document.querySelector(".prev");

function plusSlides(n) {
    const state = appStateSlide.getState();
    const imageWithinDialog = document.getElementById("image-within-dialog");
    let currentImageIndex = parseInt(imageWithinDialog.getAttribute("data-index"));
    const imagesMap = library.getImagesMap();
    const imagesArray = Array.from(imagesMap.entries());
    const startingIndex = (state.currentPage - 1) * state.imagesPerPage;
    const maxIndex = imagesArray.length - 1;

    // Find the current index in the array
    let currentIndexInArray = imagesArray.findIndex(([index]) => index === currentImageIndex);

    currentIndexInArray += n;

    if (currentIndexInArray < 0) {
        currentIndexInArray = 0; // Prevent going before index 0
    } else if (currentIndexInArray > maxIndex) {
        currentIndexInArray = maxIndex; // Prevent going beyond maxImages
    }

    currentImageIndex = imagesArray[currentIndexInArray][0]; // Update to the new image index

    if (currentIndexInArray < startingIndex && state.currentPage > 1) {
        appStateSlide.setCurrentPage(state.currentPage - 1);
        currentIndexInArray = (state.currentPage - 2) * state.imagesPerPage + state.imagesPerPage - 1;
        window.render();
    } else if (currentIndexInArray >= startingIndex + state.imagesPerPage && state.currentPage < Math.ceil(imagesArray.length / state.imagesPerPage)) {
        appStateSlide.setCurrentPage(state.currentPage + 1);
        currentIndexInArray = (state.currentPage) * state.imagesPerPage;
        window.render();
    }

    imageWithinDialog.src = imagesArray[currentIndexInArray][1].path; // Update the image source
    imageWithinDialog.setAttribute("data-index", imagesArray[currentIndexInArray][0]); // Set the new data index
}

document.addEventListener("keydown", function(event) {
    const state = appStateSlide.getState();
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
