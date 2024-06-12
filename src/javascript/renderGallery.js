const {renderPagination} = require("./pagination");
const libraryList = require("./imageHandling/imageLibrary");
const {selectImages, toggle} = require('./imageSelector');
const appStateRender = require('./domain/appState');  // Importing the AppState instance

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
            console.log("check")
            checkBox.checked = true;
            darkLayer.style.display = "block"
        }
    }

    imageContainer.appendChild(ImageElement);
    imageContainer.appendChild(checkBox);
    imageContainer.appendChild(darkLayer);

    imageContainer.addEventListener("click", event => {
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
    appStateRender.updateState({isDialogOpen: true});
    const modal = document.getElementById("image-dialog");
    const imageElement = modal.querySelector("#image-within-dialog");

    imageElement.setAttribute("src", image.path);
    imageElement.setAttribute("data-index", index);

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
    appStateRender.updateState({isDialogOpen: false});
}

function eventListeners() {
    document.addEventListener("keydown", function (event) {
        const state = appStateRender.getState();
        if (!state.isDialogOpen) {
            const totalPages = Math.ceil(libraryList.getAmountOfImages() / state.imagesPerPage);
            if (event.key === "ArrowLeft" && state.currentPage > 1) {
                event.preventDefault();
                appStateRender.updateState({currentPage: state.currentPage - 1});
                render();
            } else if (event.key === "ArrowRight" && state.currentPage < totalPages) {
                event.preventDefault();
                appStateRender.updateState({currentPage: state.currentPage + 1});
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
    appStateRender.updateState({imagesPerPage: count});
}

function render() {
    const state = appStateRender.getState();
    const imageContainer = document.querySelector(".gallery");
    imageContainer.innerHTML = '';

    const startIndex = (state.currentPage - 1) * state.imagesPerPage;
    const endIndex = Math.min(startIndex + state.imagesPerPage, libraryList.getAmountOfImages());
    const imagesToRender = libraryList.getImages().slice(startIndex, endIndex);

    imagesToRender.forEach((image, index) => {
        const imageElement = renderImage(image, index + startIndex);
        imageContainer.appendChild(imageElement);
    });

    const totalPages = Math.ceil(libraryList.getAmountOfImages() / state.imagesPerPage);
    renderPagination(totalPages, state.currentPage, updatePage);
}

function updatePage(newPage) {
    appStateRender.updateState({currentPage: newPage});
    render();
}

function init() {
    calculateImagesPerPage();
    eventListeners();
    render();
}

init();

window.render = render;
