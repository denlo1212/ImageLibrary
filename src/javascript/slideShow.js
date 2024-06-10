const library = require("./imageHandling/imageLibrary");

const nextButton = document.querySelector(".next");
const prevButton = document.querySelector(".prev");

let currentImageIndex = 0;

function plusSlides(n) {
    const imageWithinDialog = document.getElementById("image-within-dialog");
    currentImageIndex = parseInt(imageWithinDialog.getAttribute("data-index"));
    const startingIndex = (global.currentPage - 1) * global.imagesPerPage;
    const maxIndex = library.getAmountOfImages() - 1;

    currentImageIndex += n;

    if (currentImageIndex < 0) {
        currentImageIndex = 0; // Prevent going before index 0
    } else if (currentImageIndex > maxIndex) {
        currentImageIndex = maxIndex; // Prevent going beyond maxImages
    }

    if (currentImageIndex < startingIndex && global.currentPage > 1) {
        global.currentPage--;
        currentImageIndex = (global.currentPage - 1) * global.imagesPerPage + global.imagesPerPage - 1;
        window.render();
    } else if (currentImageIndex >= startingIndex + global.imagesPerPage && global.currentPage < Math.ceil(library.getImages().length / global.imagesPerPage)) {
        global.currentPage++;
        currentImageIndex = (global.currentPage - 1) * global.imagesPerPage;
        window.render();
    }

    imageWithinDialog.src = library.getImages()[currentImageIndex].path;
    imageWithinDialog.setAttribute("data-index", currentImageIndex);
}




document.addEventListener("keydown", function(event) {
    if (isDialogOpen) {
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
