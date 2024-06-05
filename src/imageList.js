const { loadImages } = require("./imageHandler");

let images = [];
let imagesPerPage = 0;
let currentPage = 1;
let isDialogOpen = false;

function needsPageScroll() {
    return document.body.scrollHeight > window.innerHeight;
}

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
    isDialogOpen = true
}

function renderPagination() {
    const paginationContainer = document.querySelector(".pagination");
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(images.length / imagesPerPage);

    const createPageLink = (pageNum, text, isActive) => {
        const pageLink = document.createElement("a");
        pageLink.href = "#";
        pageLink.textContent = text || pageNum;
        if (isActive) {
            pageLink.classList.add("active");
        }
        pageLink.addEventListener("click", (event) => {
            event.preventDefault();
            currentPage = pageNum;
            render();
        });
        return pageLink;
    };

    if (currentPage > 1) {
        const leftArrow = createPageLink(currentPage - 1, '←');
        paginationContainer.appendChild(leftArrow);
    }

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = createPageLink(i, null, i === currentPage);
        paginationContainer.appendChild(pageLink);
    }

    if (currentPage < totalPages) {
        const rightArrow = createPageLink(currentPage + 1, '→');
        paginationContainer.appendChild(rightArrow);
    }
}

document.addEventListener("keydown", function(event) {
    if(!isDialogOpen){
        const totalPages = Math.ceil(images.length / imagesPerPage);
        if (event.key === "ArrowLeft" && currentPage > 1) {
            event.preventDefault();
            currentPage--;
            render();
        } else if (event.key === "ArrowRight" && currentPage < totalPages) {
            event.preventDefault();
            currentPage++;
            render();
        }
    }
});

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

    // minimum value for the amount of images per page
    if (count < 10) {
        count = 10;
    }

    imagesPerPage = count;
}

function render() {
    const imageContainer = document.querySelector(".gallery");
    imageContainer.innerHTML = '';

    const startIndex = (currentPage - 1) * imagesPerPage;
    const endIndex = Math.min(startIndex + imagesPerPage, images.length);
    const imagesToRender = images.slice(startIndex, endIndex);

    imagesToRender.forEach((image, index) => {
        const imageElement = renderImage(image, index);
        imageContainer.appendChild(imageElement);
    });

    renderPagination();
}

function init() {
    images = loadImages("D:\\homework\\denlo's Bookmarks - pixiv");
    calculateImagesPerPage();
    render();
}

init();
