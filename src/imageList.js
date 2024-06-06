const { loadImages } = require("./imageHandler");
const { renderPagination } = require("./pagination");

let images = [];
let imagesPerPage = 0;
let isDialogOpen = false;

global.currentPage = 1;



function renderImage(image, index) {
    const imageTemplate = document.querySelector('#image-template');
    const imageTemplateClone = imageTemplate.content.cloneNode(true);
    const imageContent = imageTemplateClone.querySelector(".image-container");
    imageContent.querySelector("#image").setAttribute("src", `${image.path}`);
    imageContent.setAttribute("data-index", index);
    imageContent.addEventListener("click", event => {
        showDialog(image, index);
    });

    return imageTemplateClone;
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
    if (!isDialogOpen) {
        const totalPages = Math.ceil(images.length / imagesPerPage);
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

function needsPageScroll() {
    return document.body.scrollHeight > window.innerHeight;
}

function calculateImagesPerPage() {
    const imageContainer = document.querySelector(".gallery");
    imageContainer.innerHTML = '';

    let count = 0;
    while (!needsPageScroll() && count < images.length) {
        const imageElement = renderImage(images[count], count);
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
    const endIndex = Math.min(startIndex + imagesPerPage, images.length);
    const imagesToRender = images.slice(startIndex, endIndex);

    imagesToRender.forEach((image, index) => {
        console.log(image.tags)
        const imageElement = renderImage(image, index);
        imageContainer.appendChild(imageElement);
    });

    const totalPages = Math.ceil(images.length / imagesPerPage);
    console.log(totalPages)
    renderPagination(totalPages, global.currentPage, updatePage);
}

function updatePage(newPage) {
    global.currentPage = newPage;
    render();
}

function init() {
    images = loadImages("D:\\homework");
    calculateImagesPerPage();
    render();
}

init();

module.exports = {render};
