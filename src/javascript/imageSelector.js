

document.addEventListener("DOMContentLoaded", () => {
    const toggleSelectBtn = document.querySelector(".toggle-select-button");
    const gallery = document.querySelector(".gallery");

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
            } else {
                checkbox.style.display = "none";
                checkbox.checked = false;
            }
        });
    }

});


function selectImagesBetween(startIndex, endIndex) {
    const startIndexValue = Math.min(startIndex, endIndex);
    const endIndexValue = Math.max(startIndex, endIndex);

    const imageContainers = document.querySelectorAll('.image-container');
    const firstCheckBox = imageContainers[startIndexValue].querySelector('.image-checkbox');
    const firstDarkLayer = imageContainers[startIndexValue].querySelector('.dark-layer');
    const isChecked = firstCheckBox.checked;

    imageContainers.forEach((container, index) => {
        if (index >= startIndexValue && index < endIndexValue) {
            const darkLayer = container.querySelector('.dark-layer');
            const checkBox = container.querySelector('.image-checkbox');


            if (isChecked) {
                unselect(darkLayer, checkBox);
            } else {
                console.log("idk")
                select(darkLayer, checkBox);
            }
        }
    });
}

function select(darkLayer,checkBox){
    checkBox.checked = true;
    darkLayer.style.display = 'block';
}

function unselect(darkLayer,checkBox){
    checkBox.checked = false;
    darkLayer.style.display = 'none';
}

function toggleSelection(darkLayer, checkBox) {
    if (checkBox.checked) {
        checkBox.checked = false;
        darkLayer.style.display = 'none';
    } else {
        checkBox.checked = true;
        darkLayer.style.display = 'block';
    }
}

function saveSelectedImages(){
    const imageContainers = document.querySelectorAll('.image-container');
    // imageContainers.forEach((container) => {
    //     container.querySelector()
    //
    // }
}



module.exports = {
    selectImages: selectImagesBetween,
    toggle: toggleSelection
};
