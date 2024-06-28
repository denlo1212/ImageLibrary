const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

let slideshowInterval = null;
const intervalFilePath = path.join(__dirname, '..' ,'..' , 'files','interval.txt');

function showModal(images, index) {
    const modal = document.getElementById("image-dialog");
    const imageElement = modal.querySelector("#image-within-dialog");

    imageElement.setAttribute("src", images[index].path);
    imageElement.setAttribute("data-index", index);

    modal.classList.add("show");
    startSlideshow(images);
}

function startSlideshow(images) {
    fs.readFile(intervalFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading interval file:', err);
            return;
        }
        else{
            slideshowInterval = setInterval(() => {
                const imageElement = document.querySelector("#image-within-dialog");
                let currentIndex = parseInt(imageElement.getAttribute("data-index"));
                let nextIndex = (currentIndex + 1) % images.length;
                const nextImage = images[nextIndex];
                updateModalImage(nextImage, nextIndex);
            }, data * 1000);
        }
    })

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
        showModal(images, 0, );
    });
});
