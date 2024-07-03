const deleteLibrary = require("../imageHandling/imageLibrary");
document.addEventListener("DOMContentLoaded", function() {
    const deleteButton = document.querySelector('.delete-button');
    deleteButton.addEventListener('click', function (){
        deleteLibrary.deleteSelectedImages()
        window.render()
    });
});



