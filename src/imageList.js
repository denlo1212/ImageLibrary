const {loadImages} = require("./imageHandler");

function renderImage(image, index) {
    const imageTemplate = document.querySelector('#image-template');
    const imageTemplateClone = imageTemplate.content.cloneNode(true);
    const imageContent = imageTemplateClone.querySelector(".image-container");
    imageContent.querySelector("#image").setAttribute("src", `${image.path}`);
    imageContent.setAttribute("data-index", index); // Add index as a custom attribute
    imageContent.addEventListener("click", event => {
        showDialog(image, index);
    });

    return imageTemplateClone;
}

function showDialog(image, index){

    const dialog = document.querySelector(".image-dialog");
    dialog.querySelector("#image-within-dialog").setAttribute("src", `${image.path}`)
    dialog.querySelector("#image-within-dialog").setAttribute("data-index", index)
    dialog.showModal()
}

function render() {
    const imageContainer = document.querySelector(".gallery");
    imageContainer.innerHTML = '';

    const images = loadImages("D:\\SchoolProjects\\FunProjects\\ImageLibrary\\images\\outputImages");

    images.forEach((image, index) => { // Pass the index to renderImage
        const imageElement = renderImage(image, index);
        imageContainer.appendChild(imageElement);
    });
}

render();
