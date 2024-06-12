const librarySelect = require("./imageHandling/imageLibrary");
const appState = require('./domain/appState');  // Importing the AppState instance
let selectedImages = [];

document.addEventListener("DOMContentLoaded", () => {
    const toggleSelectBtn = document.querySelector(".toggle-select-button");
    const gallery = document.querySelector(".gallery");
    const actionsContainer = document.querySelector(".actions-container");

    const state = appState.getState();
    let selectionMode = state.selectionMode;

    toggleSelectBtn.addEventListener("click", () => {
        selectionMode = !selectionMode;
        appState.updateState({ selectionMode });
        toggleSelectionMode(selectionMode);
    });

    function toggleSelectionMode(enable) {
        const imageContainers = gallery.querySelectorAll(".image-container");
        imageContainers.forEach(container => {
            const checkbox = container.querySelector(".image-checkbox");
            const darkLayer = container.querySelector(".dark-layer")
            if (enable) {
                checkbox.style.display = "block";
                actionsContainer.style.display = "block";
            } else {
                librarySelect.resetSelectedList()
                checkbox.style.display = "none";
                checkbox.checked = false;
                darkLayer.style.display = "none"
                actionsContainer.style.display = "none";
            }
        });
    }
});

function selectImagesBetween(startIndex, endIndex) {
    const state = appState.getState();
    const currentPage = state.currentPage;
    const imagesPerPage = state.imagesPerPage;

    const startIndexModified = startIndex + 1 - ((currentPage - 1) * imagesPerPage);
    const endIndexModified = endIndex + 1 - ((currentPage - 1) * imagesPerPage);

    const imageContainers = document.querySelectorAll('.image-container');
    const firstCheckBox = imageContainers[startIndexModified].querySelector('.image-checkbox');
    const firstDarkLayer = imageContainers[startIndexModified].querySelector('.dark-layer');
    const isChecked = firstCheckBox.checked;

    imageContainers.forEach((container, index) => {
        if (index >= startIndexModified && index < endIndexModified) {
            const darkLayer = container.querySelector('.dark-layer');
            const checkBox = container.querySelector('.image-checkbox');

            if (isChecked) {
                unselect(darkLayer, checkBox, startIndex + index);
            } else {
                select(darkLayer, checkBox, startIndex + index);
            }
        }
    });
}

function select(darkLayer, checkBox, originalIndex) {
    librarySelect.addSelectedImage(originalIndex);
    checkBox.checked = true;
    darkLayer.style.display = 'block';
}

function unselect(darkLayer, checkBox, originalIndex) {
    librarySelect.removeSelectedImage(originalIndex);
    checkBox.checked = false;
    darkLayer.style.display = 'none';
}

function toggleSelection(darkLayer, checkBox, index) {
    if (checkBox.checked) {
        librarySelect.removeSelectedImage(index);
        checkBox.checked = false;
        darkLayer.style.display = 'none';
    } else {
        librarySelect.addSelectedImage(index);
        checkBox.checked = true;
        darkLayer.style.display = 'block';
    }
}


module.exports = {
    selectImages: selectImagesBetween,
    toggle: toggleSelection
};
