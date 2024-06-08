const libraryTags = require("./imageHandling/imageLibrary");

let activeTags = [];

function renderTags() {
    const filterForm = document.querySelector("#filterForm");
    filterForm.innerHTML = '';

    const uniqueTags = libraryTags.getUniqueTags();
    let count = 0;
    const dropdownContent = document.querySelector(".dropdown-content");
    dropdownContent.classList.toggle("show");

    while(!needsPageScroll() && count < uniqueTags.length) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = uniqueTags[count];

        const label = document.createElement("label");
        label.innerHTML = uniqueTags[count];

        if (activeTags.includes(uniqueTags[count])) {
            checkbox.checked = true;
        }

        checkbox.addEventListener("change", (event) => filterImages(event, libraryTags));

        label.appendChild(checkbox);
        filterForm.appendChild(label);
        count++
    }

    dropdownContent.classList.toggle("show");
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

function needsPageScroll() {
    return document.body.scrollHeight > window.innerHeight;
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


// const libraryTags = require("./imageHandling/imageLibrary");
//
// let activeTags = [];
//
// function renderTags() {
//     const filterForm = document.querySelector("#filterForm");
//     filterForm.innerHTML = '';
//
//     const uniqueTags = libraryTags.getUniqueTags();
//
//     uniqueTags.forEach(tag => {
//         const checkbox = document.createElement("input");
//         checkbox.type = "checkbox";
//         checkbox.value = tag;
//
//         const label = document.createElement("label");
//         label.innerHTML = tag;
//
//         if (activeTags.includes(tag)) {
//             checkbox.checked = true;
//         }
//
//         checkbox.addEventListener("change", (event) => filterImages(event, libraryTags));
//
//         label.appendChild(checkbox);
//         filterForm.appendChild(label);
//     });
// }
//
//
// function filterImages(event, libraryTags) {
//     const checkbox = event.target;
//     const tagText = checkbox.value;
//
//     if (checkbox.checked) {
//         activeTags.push(tagText);
//     } else {
//         activeTags = activeTags.filter(tag => tag !== tagText);
//     }
//
//     if (activeTags.length === 0) {
//         libraryTags.restoreDefault();
//     } else {
//         libraryTags.filterImages(activeTags);
//     }
//
//     global.currentPage = 1;
//     window.render();
// }
//
// function init() {
//     document.addEventListener("DOMContentLoaded", () => {
//         renderTags();
//
//         const dropdownBtn = document.querySelector(".dropdown-btn");
//         const dropdownContent = document.querySelector(".dropdown-content");
//
//         dropdownBtn.addEventListener("click", () => {
//             dropdownContent.classList.toggle("show");
//         });
//
//     });
// }
//
// init();
