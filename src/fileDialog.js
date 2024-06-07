const { BrowserWindow, dialog } = require('electron');
const ImageSaver = require("./imageHandling/imageSaver");

function openFileDialog() {
    const mainWindow = BrowserWindow.getFocusedWindow();
    dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory', 'multiSelections']
    }).then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
            const destinationDirectoryPath = "D:\\SchoolProjects\\FunProjects\\ImageLibrary\\images\\outputImages";

            result.filePaths.forEach(directoryPath => {
                ImageSaver.saveImages(directoryPath, destinationDirectoryPath);
            });
        } else {
            console.log('No directory selected');
        }
    }).catch(err => {
        console.error(err);
    });
}

module.exports = { openFileDialog };
