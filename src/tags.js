const libraryTags = require("./imageLibrary");

let currentFirstTagPosition = 0;
let activeTags = [];

function renderTags() {
    const container = document.querySelector(".tags-container");
    container.innerHTML = '';

    const uniqueTags = libraryTags.getUniqueTags();

    let startTag = currentFirstTagPosition;
    let endTag = currentFirstTagPosition + 4;

    startTag = Math.max(0, startTag);
    endTag = Math.min(uniqueTags.length - 1, endTag);

    const prevArrow = createTag("&#10094;");
    prevArrow.addEventListener("click", () => changeTagPosition(-1));
    container.appendChild(prevArrow);

    for (let i = startTag; i <= endTag; i++) {
        const tag = createTag(uniqueTags[i]);
        if (activeTags.includes(uniqueTags[i])) {
            tag.classList.add("highlighted");
        }
        tag.addEventListener("click", (event) => filterImages(event, libraryTags)); // Add event listener
        container.appendChild(tag);
    }

    const nextArrow = createTag("&#10095;");
    nextArrow.addEventListener("click", () => changeTagPosition(1));
    container.appendChild(nextArrow);
}

function filterImages(event, libraryTags) {
    const clickedTag = event.currentTarget;
    const tagText = clickedTag.innerHTML;

    if (clickedTag.classList.contains("highlighted")) {
        clickedTag.classList.remove("highlighted");
        activeTags = activeTags.filter(tag => tag !== tagText); // Remove tag from activeTags
    } else {
        clickedTag.classList.add("highlighted");
        activeTags.push(tagText); // Add tag to activeTags
    }

    if (activeTags.length === 0) {
        libraryTags.restoreDefault();
    } else {
        libraryTags.filterImages(activeTags);
    }

    global.currentPage = 1;
    window.render();
}

function createTag(text) {
    const tag = document.createElement("a");
    tag.innerHTML = text;
    return tag;
}

function changeTagPosition(direction) {
    const uniqueTags = libraryTags.getUniqueTags();

    currentFirstTagPosition += direction * 6;

    if (currentFirstTagPosition < 0) {
        currentFirstTagPosition = 0;
    } else if (currentFirstTagPosition > uniqueTags.length - 6) {
        currentFirstTagPosition = uniqueTags.length - 6;
    }

    renderTags();
}

function init() {
    document.addEventListener("DOMContentLoaded", () => {
        renderTags();
    });
}

init();
