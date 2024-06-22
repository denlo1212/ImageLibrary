const library = require("../imageHandling/imageLibrary");
let slideshowInterval = null;

function showModal(image, index) {
    const modal = document.getElementById("image-dialog");
    const imageElement = modal.querySelector("#image-within-dialog");

    imageElement.setAttribute("src", image.path);
    imageElement.setAttribute("data-index", index);

    modal.classList.add("show");
    startSlideshow();

}

function startSlideshow() {
    const images = library.getImages();
    slideshowInterval = setInterval(() => {
        const imageElement = document.querySelector("#image-within-dialog");
        let currentIndex = parseInt(imageElement.getAttribute("data-index"));
        let nextIndex = (currentIndex + 1) % images.length;
        const nextImage = images[nextIndex];
        updateModalImage(nextImage, nextIndex);
    }, 1000);
}

function stopSlideshow() {
    clearInterval(slideshowInterval);
}

function updateModalImage(image, index) {
    const modal = document.getElementById("image-dialog");
    const imageElement = modal.querySelector("#image-within-dialog");
    imageElement.setAttribute("src", image.path);
    imageElement.setAttribute("data-index", index);
}


document.addEventListener('DOMContentLoaded', function () {
    const images = library.getImages();
    showModal(images[0], 0);
});




