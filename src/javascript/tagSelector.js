const libraryTag = require("./imageHandling/imageLibrary");

function openPopupMenu() {
    const popupMenu = document.getElementById('popup-menu');
    popupMenu.style.display = 'block';
    global.isDialogOpen = true;
    loadTags();
}

function closePopupMenu() {
    const popupMenu = document.getElementById('popup-menu');
    popupMenu.style.display = 'none';
    global.isDialogOpen = false;
}

function loadTags() {
    const tagList = libraryTag.getUniqueTags();
    const addList = document.querySelector("#tag-add-list");
    const removeList = document.querySelector("#tag-remove-list");

    addList.innerHTML = '';
    removeList.innerHTML = '';

    tagList.forEach(tag => {
        const addTagContainer = document.createElement('div');
        addTagContainer.classList.add('tag-container');

        const removeTagContainer = document.createElement('div');
        removeTagContainer.classList.add('tag-container');

        const addCheckbox = document.createElement('input');
        addCheckbox.type = 'checkbox';
        addCheckbox.id = 'add-' + tag;

        const addLabel = document.createElement('label');
        addLabel.htmlFor = 'add-' + tag;
        addLabel.appendChild(document.createTextNode(tag));

        const removeCheckbox = document.createElement('input');
        removeCheckbox.type = 'checkbox';
        removeCheckbox.id = 'remove-' + tag;

        const removeLabel = document.createElement('label');
        removeLabel.htmlFor = 'remove-' + tag;
        removeLabel.appendChild(document.createTextNode(tag));


        addTagContainer.appendChild(addCheckbox);
        addTagContainer.appendChild(addLabel);

        removeTagContainer.appendChild(removeCheckbox);
        removeTagContainer.appendChild(removeLabel);

        addList.appendChild(addTagContainer);
        removeList.appendChild(removeTagContainer);
    });
}


function initializeEventListeners() {
    const popupMenu = document.getElementById('popup-menu');

    var button = document.querySelector(".tags-button");

    button.addEventListener("click", function () {
        openPopupMenu();
    });


    popupMenu.addEventListener("click", function (event) {
        if (event.target === popupMenu) {
            closePopupMenu();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closePopupMenu();
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    initializeEventListeners();
});

