const {renderPagination} = require("./pagination");
const libraryList = require("../imageHandling/imageLibrary");
const {selectImages, toggle} = require('./imageSelector');
const appStateRender = require('../imageHandling/domain/appState.js');
const {setupZoom, setupDragAndModal} = require("./zoom");

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
    checkBox.setAttribute('class', 'image-checkbox');

    const darkLayer = document.createElement('div');
    darkLayer.className = 'dark-layer';
    darkLayer.style.display = "none"

    const state = appStateRender.getState();
    if (!(state.selectionMode)) {
        checkBox.style.display = "none";
    }

    else{
        if (libraryList.getSelectedImagesMap().has(index)) {
            checkBox.checked = true;
            darkLayer.style.display = "block"
        }
    }

    imageContainer.appendChild(ImageElement);
    imageContainer.appendChild(checkBox);
    imageContainer.appendChild(darkLayer);

    imageContainer.addEventListener("click", event => {
        const state = appStateRender.getState();
        if (state.selectionMode) {
            if (event.shiftKey && lastClickedIndex !== null) {
                selectImages(lastClickedIndex, index, darkLayer, checkBox);
            } else {
                toggle(darkLayer, checkBox, index);
            }
        } else {
            showModal(image, index);
        }

        lastClickedIndex = index;
    });

    return imageContainer;
}


function showModal(image, index) {
    appStateRender.setIsDialogOpen(true);
    const modal = document.getElementById("image-dialog");
    const imageElement = modal.querySelector("#image-within-dialog");

    // Setup initial image and index
    imageElement.setAttribute("src", image.path);
    imageElement.setAttribute("data-index", index);

    // Show modal
    modal.classList.add("show");

    // Close modal on overlay click (if not in selection mode)
    modal.addEventListener("click", function (event) {
        const state = appStateRender.getState();
        if (!state.selectionMode && event.target === modal) {
            closeModal();
        }
    });

    // Close modal on Escape key press (if not in selection mode)
    document.addEventListener("keydown", function (event) {
        const state = appStateRender.getState();
        if (!state.selectionMode && event.key === "Escape") {
            closeModal();
        }
    });

    setupZoom(imageElement);
    setupDragAndModal(modal);
}



function closeModal() {
    const modal = document.getElementById("image-dialog");
    modal.classList.remove("show");
    document.body.style.overflow = "";
    appStateRender.setIsDialogOpen(false);
}

function eventListeners() {
    document.addEventListener("keydown", function (event) {
        const state = appStateRender.getState();
        if (!state.isDialogOpen) {
            const totalPages = Math.ceil(libraryList.getAmountOfImages() / state.imagesPerPage);
            if (event.key === "ArrowLeft" && state.currentPage > 1) {
                event.preventDefault();
                appStateRender.setCurrentPage(state.currentPage - 1)
                render();
            } else if (event.key === "ArrowRight" && state.currentPage < totalPages) {
                event.preventDefault();
                appStateRender.setCurrentPage(state.currentPage + 1)
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
    appStateRender.setImagesPerPage(count)
}

function render() {
    const state = appStateRender.getState();
    const imageContainer = document.querySelector(".gallery");
    imageContainer.innerHTML = '';

    const startIndex = (state.currentPage - 1) * state.imagesPerPage;
    const endIndex = Math.min(startIndex + state.imagesPerPage, libraryList.getAmountOfImages());

    const imagesMap = libraryList.getImagesMap();
    const imagesArray = Array.from(imagesMap.entries());

    const imagesToRender = imagesArray.slice(startIndex, endIndex);

    imagesToRender.forEach(([index, image]) => {
        const imageElement = renderImage(image, index);
        imageContainer.appendChild(imageElement);
    });

    const totalPages = Math.ceil(libraryList.getAmountOfImages() / state.imagesPerPage);
    renderPagination(totalPages, state.currentPage, updatePage);
}


function updatePage(newPage) {
    appStateRender.setCurrentPage(newPage)
    render();
}

function init() {
    calculateImagesPerPage();
    eventListeners();
    render();
}

init();

window.render = render;
