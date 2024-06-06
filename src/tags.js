const ImageLibraryTags = require("./imageLibrary");
const {render : renderFilterdImages} = require("./imageList")

let currentLastTagPosition = 0;

function renderTags() {
    const library = ImageLibraryTags.getInstance();
    const container = document.querySelector(".tags-container");
    container.innerHTML = '';

    const uniqueTags = library.getUniqueTags();

    let startTag = currentLastTagPosition + 1;
    let endTag = currentLastTagPosition + 6;

    startTag = Math.max(0, startTag);
    endTag = Math.min(uniqueTags.length - 1, endTag);

    const prevArrow = createTag("&#10094;");
    prevArrow.addEventListener("click", () => changeTagPosition(-1));
    container.appendChild(prevArrow);

    for (let i = startTag; i <= endTag; i++) {
        const tag = createTag(uniqueTags[i]);
        tag.addEventListener("click", (event) => handleTagClick(event, library)); // Add event listener
        container.appendChild(tag);
    }

    const nextArrow = createTag("&#10095;");
    nextArrow.addEventListener("click", () => changeTagPosition(1));
    container.appendChild(nextArrow);
}


function handleTagClick(event, library) {
    const clickedTag = event.currentTarget;

    if (clickedTag.classList.contains("highlighted")) {
        clickedTag.classList.remove("highlighted");
        library.restoreDefault()
        global.currentPage = 1;
        renderFilterdImages()
    } else {
        clickedTag.classList.add("highlighted");
        library.filterImages([clickedTag.text])
        renderFilterdImages()
    }

}


function createTag(text) {
    const tag = document.createElement("a");
    tag.innerHTML = text;
    return tag;
}

function changeTagPosition(direction) {
    const library = ImageLibraryTags.getInstance();
    const uniqueTags = library.getUniqueTags();

    currentLastTagPosition += direction * 6;

    if (currentLastTagPosition < 0) {
        currentLastTagPosition = 0;
    } else if (currentLastTagPosition > uniqueTags.length - 6) {
        currentLastTagPosition = uniqueTags.length - 6;
    }

    renderTags();
}

function init() {
    document.addEventListener("DOMContentLoaded", () => {
        renderTags();
    });
}

init();

