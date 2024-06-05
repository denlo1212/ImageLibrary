const { saveImages } = require("./imageHandler");

const addImagesButton = document.getElementById("add-images-btn");
const loadImagesButton = document.getElementById("load-images-btn");

addImagesButton.addEventListener("click", popupDialog);
loadImagesButton.addEventListener("click", () => {
    const sourceDirectoryPath = String(document.getElementById("image-path").value);

    console.log(sourceDirectoryPath);
    saveImagesFromDirectory(sourceDirectoryPath);
});


function popupDialog() {
    const dialog = document.querySelector(".button-dialog");
    dialog.showModal();
}

function saveImagesFromDirectory(sourceDirectoryPath) {
    const destinationDirectoryPath = "D:\\SchoolProjects\\FunProjects\\ImageLibrary\\images\\outputImages";
    sourceDirectoryPath = "D:\\SchoolProjects\\FunProjects\\ImageLibrary\\images\\inputImages"
    console.log(sourceDirectoryPath)
    console.log(destinationDirectoryPath)
    saveImages(sourceDirectoryPath, destinationDirectoryPath);
    // location.reload();
}


