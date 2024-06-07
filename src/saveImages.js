const path = require('path');
const ImageSaver = require("./imageHandling/imageSaver");

const addImagesButton = document.getElementById("add-images-btn");
const loadImagesButton = document.getElementById("load-images-btn");

addImagesButton.addEventListener("click", popupDialog);
loadImagesButton.addEventListener("click", () => {
    let sourceDirectoryPath = document.getElementById("image-path").value;
    sourceDirectoryPath = path.normalize(sourceDirectoryPath);
    saveImagesFromDirectory(sourceDirectoryPath);
});

function popupDialog() {
    const dialog = document.querySelector(".button-dialog");
    dialog.showModal();
}

function saveImagesFromDirectory(sourceDirectoryPath) {
    const destinationDirectoryPath = "D:\\SchoolProjects\\FunProjects\\ImageLibrary\\images\\outputImages";
    if (sourceDirectoryPath.startsWith('"') && sourceDirectoryPath.endsWith('"')) {
        sourceDirectoryPath = sourceDirectoryPath.slice(1, -1);
    }

    new ImageSaver.saveImages(sourceDirectoryPath, destinationDirectoryPath);
    location.reload()
}
