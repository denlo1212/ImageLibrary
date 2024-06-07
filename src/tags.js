const libraryTags = require("./imageLibrary");

let activeTags = [];

function renderTags() {
    const filterForm = document.querySelector("#filterForm");
    filterForm.innerHTML = '';

    const uniqueTags = libraryTags.getUniqueTags();

    uniqueTags.forEach(tag => {
        const label = document.createElement("label");
        label.innerHTML = tag;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = tag;

        if (activeTags.includes(tag)) {
            checkbox.checked = true;
        }

        checkbox.addEventListener("change", (event) => filterImages(event, libraryTags));

        label.appendChild(checkbox);
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

    global.currentPage = 1;
    window.render();
}

function init() {
    document.addEventListener("DOMContentLoaded", () => {
        renderTags();

        const dropdownBtn = document.querySelector(".dropdown-btn");
        const dropdownContent = document.querySelector(".dropdown-content");

        dropdownBtn.addEventListener("click", () => {
            dropdownContent.classList.toggle("show");
        });

        window.onclick = (event) => {
            if (!event.target.matches('.dropdown-btn')) {
                if (dropdownContent.classList.contains('show')) {
                    dropdownContent.classList.remove('show');
                }
            }
        };
    });
}

init();
