const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

let slideshowInterval = null;
const intervalFilePath = path.join(__dirname, '..' ,'..' , 'files','interval.txt');

function showModal(images, index) {
    const modal = document.getElementById("image-dialog");
    const imageElement = modal.querySelector("#image-within-dialog");
    console.log('image index: '+ index)
    console.log(images[index])

    imageElement.setAttribute("src", images[index].path);
    imageElement.setAttribute("data-index", index);

    modal.classList.add("show");
    startRandomSlideShow(images)
    // startSlideshow(images);
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
            return;
        } else {
            let indices = [...Array(images.length).keys()]; // Create an array of image indices
            indices = shuffleArray(indices); // Shuffle the array of indices
            let currentIndex = 0;

            slideshowInterval = setInterval(() => {
                if (currentIndex >= indices.length) {
                    console.log(currentIndex)
                    indices = shuffleArray(indices); // Reshuffle indices when all images have been displayed
                    currentIndex = 0;
                }

                const nextIndex = indices[currentIndex];
                const nextImage = images[nextIndex];
                updateModalImage(nextImage, nextIndex);
                currentIndex++;
            }, data * 1000);
        }
    });
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
