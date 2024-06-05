const loadImages = require("./imageHandler");

function renderImage(image) {
    console.log(image.path)

    const imageTemplate = document.querySelector('#image-template');

    const imageTemplateClone = imageTemplate.content.cloneNode(true);
    const imageContent = imageTemplateClone.querySelector(".image-container");
    imageContent.querySelector("#image").setAttribute("src", `${image.path}`)
    // imageContent.querySelector("image").setAttribute();
    imageContent.addEventListener("click", event => {
        showDialog(image)
    })

    return imageTemplateClone
}

function showDialog(image){

    const dialog = document.querySelector("dialog");
    dialog.querySelector("#imageDialog").setAttribute("src", `${image.path}`)
    dialog.showModal()
}

function render() {
    const imageContainer = document.querySelector(".gallery");
    imageContainer.innerHTML = '';

    const images = loadImages("D:\\SchoolProjects\\FunProjects\\ImageLibrary\\images\\inputImages")

    images.forEach(image => {
        const imageElement = renderImage(image);
        imageContainer.appendChild(imageElement);
    });
}

render();
