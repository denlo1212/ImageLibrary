const { ipcRenderer } = require('electron');

let slideshowInterval = null;

function showModal(image, index, images) {
    const modal = document.getElementById("image-dialog");
    const imageElement = modal.querySelector("#image-within-dialog");

    imageElement.setAttribute("src", image.path);
    imageElement.setAttribute("data-index", index);

    modal.classList.add("show");
    startSlideshow(images);
}

function startSlideshow(images) {
    slideshowInterval = setInterval(() => {
        const imageElement = document.querySelector("#image-within-dialog");
        let currentIndex = parseInt(imageElement.getAttribute("data-index"));
        let nextIndex = (currentIndex + 1) % images.length;
        const nextImage = images[nextIndex];
        updateModalImage(nextImage, nextIndex);
    }, 10000);
}

// function stopSlideshow() {
//     clearInterval(slideshowInterval);
// }

function updateModalImage(image, index) {
    const modal = document.getElementById("image-dialog");
    const imageElement = modal.querySelector("#image-within-dialog");
    imageElement.setAttribute("src", image.path);
    imageElement.setAttribute("data-index", index);
}

document.addEventListener('DOMContentLoaded', function () {
    ipcRenderer.on('image-data', (event, images) => {
        showModal(images[0], 0, images);
    });
});
