const libraryTags = require("./imageHandling/imageLibrary");
const appStateTags = require('./domain/appState');

let activeTags = [];

function renderTags() {
    const filterForm = document.querySelector("#filterForm");
    filterForm.innerHTML = '';

    const uniqueTags = libraryTags.getUniqueTags();

    uniqueTags.forEach(tag => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = tag;

        const label = document.createElement("label");
        label.innerHTML = tag;

        if (activeTags.includes(tag)) {
            checkbox.checked = true;
        }
        const starIcon = document.createElement("span");
        starIcon.className = "favorite-star";
        starIcon.innerText = "☆"; // Display star icon as empty

        checkbox.addEventListener("change", (event) => filterImages(event, libraryTags));
        starIcon.addEventListener("click", (event) => toggleFavorite(event, tag));

        label.insertBefore(starIcon, label.firstChild);
        label.insertBefore(checkbox, label.firstChild);

        filterForm.appendChild(label);
    });
}

function filterImages(event, libraryTags) {
    const checkbox = event.target;
    const tagText = checkbox.value;

    if (checkbox.checked) {
        activeTags.push(tagText);
    } else {
        activeTags = activeTags.filter(tag => tag !== tagText);
    }

    if (activeTags.length === 0) {
        libraryTags.restoreDefault();
    } else {
        libraryTags.filterImages(activeTags);
    }
    appStateTags.setCurrentPage(1)
    window.render();
}

function toggleFavorite(event, tag) {
    const starIcon = event.target;
    const tagIndex = activeTags.indexOf(tag);

    if (tagIndex !== -1) {
        activeTags.splice(tagIndex, 1);
        starIcon.innerText = "☆";
    } else {
        activeTags.push(tag);
        starIcon.innerText = "★";
    }
}

function init() {
    document.addEventListener("DOMContentLoaded", () => {
        renderTags();

        const dropdownBtn = document.querySelector(".dropdown-btn");
        const dropdownContent = document.querySelector(".dropdown-content");

        dropdownBtn.addEventListener("click", () => {
            dropdownContent.classList.toggle("show");
        });
    });
}

init();
