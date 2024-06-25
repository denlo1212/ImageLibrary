// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('slide-show-button').addEventListener('click', () => {
        ipcRenderer.send('open-second-window');
    });

    document.getElementById("add-images-btn").addEventListener("click", function() {
        ipcRenderer.send('open-file-dialog');
    });
});

