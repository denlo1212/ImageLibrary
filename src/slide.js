const { render } = require("./imageList");

const nextButton = document.querySelector(".next");
const prevButton = document.querySelector(".prev");


let currentImageIndex = 0;

function plusSlides(n) {
    console.log(global.currentPage)
    const imageWithinDialog = document.getElementById("image-within-dialog");
    currentImageIndex = parseInt(imageWithinDialog.getAttribute("data-index"));
    const images = document.querySelectorAll(".gallery img");
    currentImageIndex += n;
    if (currentImageIndex < 0) {
        currentImageIndex = images.length - 1;
        if(global.currentPage !== 1){
            global.currentPage--
            render()

        }
    } else if (currentImageIndex >= images.length) {
        global.currentPage++
        currentImageIndex = 0;
        render()
    }

    imageWithinDialog.src = images[currentImageIndex].src;

    imageWithinDialog.setAttribute("data-index", currentImageIndex);
}

document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft") {
        plusSlides(-1);
    } else if (event.key === "ArrowRight") {
        plusSlides(1);
    }
});



nextButton.addEventListener("click", () => {
    plusSlides(1);
});

prevButton.addEventListener("click", () => {
    plusSlides(-1);
});
