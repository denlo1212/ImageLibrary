const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

let slideshowInterval = null;
const intervalFilePath = path.join(__dirname, '..', '..', 'files', 'interval.txt');
const randomImagePath = path.join(__dirname, '..', '..', 'files', 'randomImage.txt');

function randomImage() {
    return new Promise((resolve, reject) => {
        fs.readFile(randomImagePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading randomImage file:', err);
                resolve(false);
            } else {
                resolve(data.trim() === 'true');
            }
        });
    });
}

async function showModal(images, index) {
    const modal = document.getElementById("image-dialog");
    const imageElement = modal.querySelector("#image-within-dialog");

    const shouldStartRandomSlideshow = await randomImage();
    if (shouldStartRandomSlideshow) {
        const randomIndex = Math.floor(Math.random() * images.length);
        imageElement.setAttribute("src", images[randomIndex].path);
        imageElement.setAttribute("data-index", randomIndex);
        startRandomSlideShow(images);
    } else {
        imageElement.setAttribute("src", images[index].path);
        imageElement.setAttribute("data-index", index);
        startSlideshow(images);
    }

    modal.classList.add("show");
}

function startSlideshow(images) {
    fs.readFile(intervalFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading interval file:', err);
        } else {
            const interval = parseInt(data, 10) * 1000; // Convert to milliseconds
            slideshowInterval = setInterval(() => {
                const imageElement = document.querySelector("#image-within-dialog");
                let currentIndex = parseInt(imageElement.getAttribute("data-index"));
                let nextIndex = (currentIndex + 1) % images.length;
                const nextImage = images[nextIndex];
                updateModalImage(nextImage, nextIndex);
            }, interval);
        }
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startRandomSlideShow(images) {
    fs.readFile(intervalFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading interval file:', err);
            return false;
        } else {
            let indices = [...Array(images.length).keys()]; // Create an array of image indices
            indices = shuffleArray(indices); // Shuffle the array of indices
            let currentIndex = 0;
            const interval = parseInt(data, 10) * 1000; // Convert to milliseconds

            slideshowInterval = setInterval(() => {
                if (currentIndex >= indices.length) {
                    indices = shuffleArray(indices); // Reshuffle indices when all images have been displayed
                    currentIndex = 0;
                }

                const nextIndex = indices[currentIndex];
                const nextImage = images[nextIndex];
                updateModalImage(nextImage, nextIndex);
                currentIndex++;
            }, interval);
        }
    });
}

function updateModalImage(image, index) {
    const modal = document.getElementById("image-dialog");
    const imageElement = modal.querySelector("#image-within-dialog");
    imageElement.setAttribute("src", image.path);
    imageElement.setAttribute("data-index", index);
}

document.addEventListener('DOMContentLoaded', function () {
    ipcRenderer.on('image-data', async (event, images) => {
        await showModal(images, 0);
    });
});

// function stopSlideshow() {
//     clearInterval(slideshowInterval);
// }
