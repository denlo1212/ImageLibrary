const { renderPagination } = require("./pagination");
const ImageLibraryList = require("./imageLibrary");

global.currentPage = 1;

let imagesPerPage = 0;
let isDialogOpen = false;
const library = ImageLibraryList.getInstance();

function renderImage(image, index) {

    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';

    const ImageElement = document.createElement('img');
    ImageElement.id = image.name;
    ImageElement.setAttribute("src",image.path)
    ImageElement.alt = `${image.metadata}`;
    ImageElement.setAttribute('data-index', index);

    imageContainer.appendChild(ImageElement);

    imageContainer.addEventListener("click", event => {
        showDialog(image, index);
    });


    return imageContainer;
}

function showDialog(image, index) {
    const dialog = document.querySelector(".image-dialog");
    dialog.addEventListener("close", function() {
        isDialogOpen = false;
    });

    dialog.querySelector("#image-within-dialog").setAttribute("src", `${image.path}`);
    dialog.querySelector("#image-within-dialog").setAttribute("data-index", index);
    dialog.showModal();
    isDialogOpen = true;
}

document.addEventListener("keydown", function(event) {
    console.log(isDialogOpen)
    if (!isDialogOpen) {
        const totalPages = Math.ceil(library.getAmountOfImages()/ imagesPerPage);
        if (event.key === "ArrowLeft" && global.currentPage > 1) {
            event.preventDefault();
            global.currentPage--;
            render();
        } else if (event.key === "ArrowRight" && global.currentPage < totalPages) {
            console.log("press")
            event.preventDefault();
            global.currentPage++;
            render();
        }
    }
});

function needsPageScroll() {
    return document.body.scrollHeight > window.innerHeight;
}

function calculateImagesPerPage() {
    const imageContainer = document.querySelector(".gallery");
    imageContainer.innerHTML = '';

    let count = 0;
    while (!needsPageScroll() && count < library.getAmountOfImages()) {
        const imageElement = renderImage(library.getImages()[count], count);
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
    const endIndex = Math.min(startIndex + imagesPerPage, library.getAmountOfImages());
    const imagesToRender = library.getImages().slice(startIndex, endIndex);


    imagesToRender.forEach((image, index) => {
        const imageElement = renderImage(image, index);
        imageContainer.appendChild(imageElement);
    });

    const totalPages = Math.ceil(library.getAmountOfImages() / imagesPerPage);
    renderPagination(totalPages, global.currentPage, updatePage);
}

function updatePage(newPage) {
    global.currentPage = newPage;
    render();
}

function init() {
    calculateImagesPerPage();
    render();
}

init();

module.exports = {render};
