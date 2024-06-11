const librarySelect = require("./imageHandling/imageLibrary");
let selectedImages = [];

document.addEventListener("DOMContentLoaded", () => {
    const toggleSelectBtn = document.querySelector(".toggle-select-button");
    const gallery = document.querySelector(".gallery");
    const actionsContainer = document.querySelector(".actions-container");

    let selectionMode = false;

    toggleSelectBtn.addEventListener("click", () => {
        selectionMode = !selectionMode;
        toggleSelectionMode(selectionMode);
    });

    function toggleSelectionMode(enable) {
        const imageContainers = gallery.querySelectorAll(".image-container");
        imageContainers.forEach(container => {
            const checkbox = container.querySelector(".image-checkbox");
            if (enable) {
                checkbox.style.display = "block";
                actionsContainer.style.display = "block";
            } else {
                checkbox.style.display = "none";
                checkbox.checked = false;
                actionsContainer.style.display = "none";
            }
        });
    }
});

function selectImagesBetween(startIndex, endIndex) {

    const startIndexModified = startIndex + 1 - ((global.currentPage - 1)   * global.imagesPerPage);
    const endIndexModified = endIndex + 1 - ((global.currentPage - 1) * global.imagesPerPage);

    const imageContainers = document.querySelectorAll('.image-container');
    const firstCheckBox = imageContainers[startIndexModified].querySelector('.image-checkbox');
    const firstDarkLayer = imageContainers[startIndexModified].querySelector('.dark-layer');
    const isChecked = firstCheckBox.checked;

    imageContainers.forEach((container, index) => {

        if (index >= startIndexModified && index <= endIndexModified) {
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
    librarySelect.addSelectedImage(originalIndex )
    checkBox.checked = true;
    darkLayer.style.display = 'block';
}

function unselect(darkLayer, checkBox, originalIndex) {
    librarySelect.removeSelectedImage(originalIndex)
    checkBox.checked = false;
    darkLayer.style.display = 'none';
}

function toggleSelection(darkLayer, checkBox, index) {
    if (checkBox.checked) {
        librarySelect.removeSelectedImage(index)
        checkBox.checked = false;
        darkLayer.style.display = 'none';
    } else {
        librarySelect.addSelectedImage(index)
        checkBox.checked = true;
        darkLayer.style.display = 'block';
    }
}

function saveSelectedImages() {
    const imageContainers = document.querySelectorAll('.image-container');
    selectedImages = [];
    imageContainers.forEach(container => {
        const checkBox = container.querySelector('.image-checkbox');
        if (checkBox.checked) {
            selectedImages.push(container.getAttribute('data-index'));
        }
    });
    console.table(selectedImages);
}

function deleteSelectedImages() {
    const imageContainers = document.querySelectorAll('.image-container');
    imageContainers.forEach(container => {
        const checkBox = container.querySelector('.image-checkbox');
        if (checkBox.checked) {
            container.remove();
        }
    });
    selectedImages = [];
    console.log('Selected images deleted');
}

module.exports = {
    selectImages: selectImagesBetween,
    toggle: toggleSelection,
    save: saveSelectedImages
};
