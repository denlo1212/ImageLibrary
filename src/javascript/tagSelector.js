const libraryTag = require("./imageHandling/imageLibrary");
const appStateTag = require('./domain/appState');

function openPopupMenu() {
    const popupMenu = document.getElementById('popup-menu');
    popupMenu.style.display = 'block';
    const button = document.querySelector("#change-tags-button");
    appStateTag.setIsDialogOpen(true);

    button.addEventListener("click", () => {
        const { tagsToRemove, tagsToAdd } = getSelectedTags();
        libraryTag.updateImageTags(tagsToRemove, tagsToAdd)
        closePopupMenu()
        appStateTag.setCurrentPage(1)
        render()
    });

    loadTags();
}


function closePopupMenu() {
    const popupMenu = document.getElementById('popup-menu');
    popupMenu.style.display = 'none';
    appStateTag.setIsDialogOpen(false)
}

function loadTags() {
    const tagList = libraryTag.getUniqueTags();
    const addList = document.querySelector("#tag-add-list");
    const removeList = document.querySelector("#tag-remove-list");

    addList.innerHTML = '';
    removeList.innerHTML = '';

    const selectedImagesTags = new Set();

    const selectedImages = libraryTag.getSelectedImages();
    selectedImages.map(image => {
        image.tags.forEach(tag => {
            selectedImagesTags.add(tag);
        });
    });

    const selectedImagesCountSpan = document.getElementById('selected-images-count');
    selectedImagesCountSpan.textContent = selectedImages.length;

    tagList.forEach(tag => {
        const addTagContainer = document.createElement('div');
        addTagContainer.classList.add('tag-container');

        const addCheckbox = document.createElement('input');
        addCheckbox.type = 'checkbox';
        addCheckbox.id = 'add-' + tag;

        const addLabel = document.createElement('label');
        addLabel.htmlFor = 'add-' + tag;
        addLabel.appendChild(document.createTextNode(tag));

        addTagContainer.appendChild(addCheckbox);
        addTagContainer.appendChild(addLabel);

        addList.appendChild(addTagContainer);
    });

    selectedImagesTags.forEach(tag => {
        const removeTagContainer = document.createElement('div');
        removeTagContainer.classList.add('tag-container');

        const removeCheckbox = document.createElement('input');
        removeCheckbox.type = 'checkbox';
        removeCheckbox.id = 'remove-' + tag;

        const removeLabel = document.createElement('label');
        removeLabel.htmlFor = 'remove-' + tag;
        removeLabel.appendChild(document.createTextNode(tag));

        removeTagContainer.appendChild(removeCheckbox);
        removeTagContainer.appendChild(removeLabel);

        removeList.appendChild(removeTagContainer);
    })
}

function getSelectedTags() {
    const addList = document.querySelectorAll("#tag-add-list input[type='checkbox']");
    const removeList = document.querySelectorAll("#tag-remove-list input[type='checkbox']");

    const tagsToAdd = [];
    const tagsToRemove = [];

    addList.forEach(checkbox => {
        if (checkbox.checked) {
            tagsToAdd.push(checkbox.id.replace('add-', ''));
        }
    });

    removeList.forEach(checkbox => {
        if (checkbox.checked) {
            tagsToRemove.push(checkbox.id.replace('remove-', ''));
        }
    });

    return { tagsToRemove, tagsToAdd };
}

function initializeEventListeners() {
    const button = document.querySelector(".tags-button");

    button.addEventListener("click", function (event) {
        event.stopPropagation();
        openPopupMenu();
    });


    document.addEventListener("keydown", function (event) {
        const state = appStateTag.getState();
        if (state.selectionMode) {
            if (event.key === "Escape") {
                closePopupMenu();
            }
        }

    });
}



document.addEventListener("DOMContentLoaded", function () {
    initializeEventListeners();
});
