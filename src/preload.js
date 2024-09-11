const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("add-images-btn").addEventListener("click", function() {
        ipcRenderer.send('open-file-dialog');
    });
});
