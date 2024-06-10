const { renderPagination } = require("./pagination");
const libraryList = require("./imageHandling/imageLibrary");
const { selectImages, toggle } = require('./imageSelector');

global.currentPage = 1;
global.isDialogOpen = false;

let imagesPerPage = 0;
let lastClickedIndex = null;

function renderImage(image, index) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';

    const ImageElement = document.createElement('img');
    ImageElement.id = image.name;
    ImageElement.setAttribute("src", image.path);
    ImageElement.alt = `${image.metadata}`;
    ImageElement.setAttribute('data-index', index);

    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.style.display = 'none';
    checkBox.setAttribute('class', 'image-checkbox');

    const darkLayer = document.createElement('div');
    darkLayer.className = 'dark-layer';
    darkLayer.style.display = 'none';

    imageContainer.appendChild(ImageElement);
    imageContainer.appendChild(checkBox);
    imageContainer.appendChild(darkLayer);

    imageContainer.addEventListener("click", event => {
        if(checkBox.style.display === 'block'){
            if(event.shiftKey && lastClickedIndex !== null){
                selectImages(lastClickedIndex, index ,darkLayer, checkBox);
            }
            else{
                toggle(darkLayer, checkBox);
            }
        }
        else{
            showModal(image, index);
        }


        lastClickedIndex = index;

    });

    return imageContainer;
}



function showModal(image, index) {
    global.isDialogOpen = true;
    const modal = document.getElementById("image-dialog");
    const imageElement = modal.querySelector("#image-within-dialog");

    // Set image source and index
    imageElement.setAttribute("src", image.path);
    imageElement.setAttribute("data-index", index);

    // Show the modal
    modal.classList.add("show");

    document.body.style.overflow = "hidden";

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeModal();
        }
    });
}



function closeModal() {
    const modal = document.getElementById("image-dialog");
    modal.classList.remove("show");
    document.body.style.overflow = "";
    global.isDialogOpen = false;
}

function eventListeners() {
    document.addEventListener("keydown", function(event) {
        if (!global.isDialogOpen) {
            const totalPages = Math.ceil(libraryList.getAmountOfImages() / imagesPerPage);
            if (event.key === "ArrowLeft" && global.currentPage > 1) {
                event.preventDefault();
                global.currentPage--;
                render();
            } else if (event.key === "ArrowRight" && global.currentPage < totalPages) {
                event.preventDefault();
                global.currentPage++;
                render();
            }
        }
    });
}

function needsPageScroll() {
    return document.body.scrollHeight > window.innerHeight;
}

function calculateImagesPerPage() {
    const imageContainer = document.querySelector(".gallery");
    imageContainer.innerHTML = '';

    let count = 0;
    while (!needsPageScroll() && count < libraryList.getAmountOfImages()) {
        const imageElement = renderImage(libraryList.getImages()[count], count);
        imageContainer.appendChild(imageElement);
        count++;
    }

    // Remove extra image to prevent scrolling
    if (needsPageScroll() && count > 0) {
        imageContainer.removeChild(imageContainer.lastChild);
        count--;
    }

    // Minimum value for the amount of images per page
    if (count < 10) {
        count = 10;
    }
    imagesPerPage = count;
}

function render() {
    const imageContainer = document.querySelector(".gallery");
    imageContainer.innerHTML = '';

    const startIndex = (global.currentPage - 1) * imagesPerPage;
    const endIndex = Math.min(startIndex + imagesPerPage, libraryList.getAmountOfImages());
    const imagesToRender = libraryList.getImages().slice(startIndex, endIndex);

    console.table(imagesToRender);

    imagesToRender.forEach((image, index) => {
        const imageElement = renderImage(image, index);
        imageContainer.appendChild(imageElement);
    });

    const totalPages = Math.ceil(libraryList.getAmountOfImages() / imagesPerPage);
    renderPagination(totalPages, global.currentPage, updatePage);
}

function updatePage(newPage) {
    global.currentPage = newPage;
    render();
}

function init() {
    calculateImagesPerPage();
    eventListeners();
    render();
}

init();

// module.exports = render
window.render = render;
