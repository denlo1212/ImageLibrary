const ImageLibraryTags = require("./imageLibrary");

let currentLastTagPosition = 0

function init(){
    const library = ImageLibraryTags.getInstance();
    const container = document.querySelector(".tags-container")
    const uniqueTags = library.getUniqueTags()

    let startTag = currentLastTagPosition + 1
    let endTag = currentLastTagPosition + 6

    startTag = Math.max(1, startTag);
    endTag = Math.min(uniqueTags.length, endTag);

    container.appendChild(createTag())
    for (let i = startTag; i <= endTag; i++) {
        container.appendChild( createTag(uniqueTags[i]));
    }
}


function createTag(text){
        const tag = document.createElement("a");
        tag.textContent = `${text}`;
        return tag;
}

init()
