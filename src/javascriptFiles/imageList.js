const Foto = require("../domain/foto.js");


// const sourcePath = "D:/testMap"



const json = [{
    "path": "D:\\testMap\\IMG_1364.JPG",
    "metadata": "Placeholder metadata",
    "name": "IMG_1364.JPG",
    "tags": []
},
    {
        "path": "D:\\testMap\\IMG_1366.JPG",
        "metadata": "Placeholder metadata",
        "name": "IMG_1366.JPG",
        "tags": []
    },
    {
        "path": "D:\\testMap\\IMG_1368.JPG",
        "metadata": "Placeholder metadata",
        "name": "IMG_1368.JPG",
        "tags": []
    },
    {
        "path": "D:\\testMap\\input\\IMG_1364.JPG",
        "metadata": "Placeholder metadata",
        "name": "IMG_1364.JPG",
        "tags": []
    },
    {
        "path": "D:\\testMap\\input\\IMG_1366.JPG",
        "metadata": "Placeholder metadata",
        "name": "IMG_1366.JPG",
        "tags": []
    },
    {
        "path": "D:\\testMap\\input\\IMG_1368.JPG",
        "metadata": "Placeholder metadata",
        "name": "IMG_1368.JPG",
        "tags": []
    },
    {
        "path": "D:\\testMap\\input\\sup\\IMG_1331.PNG",
        "metadata": "Placeholder metadata",
        "name": "IMG_1331.PNG",
        "tags": []
    },
    {
        "path": "D:\\testMap\\input\\test.jpg",
        "metadata": "Placeholder metadata",
        "name": "test.jpg",
        "tags": []
    },
    {
        "path": "D:\\testMap\\output\\IMG_1364.JPG",
        "metadata": "Placeholder metadata",
        "name": "IMG_1364.JPG",
        "tags": []
    },
    {
        "path": "D:\\testMap\\output\\IMG_1366.JPG",
        "metadata": "Placeholder metadata",
        "name": "IMG_1366.JPG",
        "tags": []
    },
    {
        "path": "D:\\testMap\\output\\IMG_1368.JPG",
        "metadata": "Placeholder metadata",
        "name": "IMG_1368.JPG",
        "tags": []
    },
    {
        "path": "D:\\testMap\\output\\test.jpg",
        "metadata": "Placeholder metadata",
        "name": "test.jpg",
        "tags": []
    },
    {
        "path": "D:\\testMap\\test.jpg",
        "metadata": "Placeholder metadata",
        "name": "test.jpg",
        "tags": []
    }]





function renderImage(image) {

    const imageTemplate = document.querySelector('#image-template');

    const imageTemplateClone = imageTemplate.content.cloneNode(true);
    const imageContent = imageTemplateClone.querySelector(".image-container");

    console.log(image.path)
    imageContent.querySelector("#image").setAttribute("src", `${image.path}`)


    imageContent.querySelector("image");
    imageContent.addEventListener("click", event => {
        console.log("press")
        showDialog(image)
    })

    return imageTemplateClone
}

function showDialog(image){

    const dialog = document.querySelector("dialog");
    dialog.querySelector("#imageDialog").setAttribute("src", `${image.path}`)
    dialog.showModal()
}

function render(){
    const imageContainer = document.querySelector(".gallery");
    imageContainer.innerHTML = ''

    let images = [];
    json.forEach(imageData =>{
        images.push(new Foto(imageData.path,imageData.metadata,imageData.name,imageData.tags))
    })

    images.forEach(image => {
        const imageElement = renderImage(image);
        imageContainer.appendChild(imageElement);
    })
}

render();
