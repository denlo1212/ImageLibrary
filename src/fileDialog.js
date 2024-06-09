const { BrowserWindow, dialog } = require('electron');
const ProgressBar = require('electron-progressbar');
const ImageSaver = require("./javascript/imageHandling/imageSaver");
const library = require("./javascript/imageHandling/imageLibrary");

async function openFileDialog() {
    const mainWindow = BrowserWindow.getFocusedWindow();
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory', 'multiSelections']
    });

    if (!result.canceled && result.filePaths.length > 0) {
        const destinationDirectoryPath = "D:\\SchoolProjects\\FunProjects\\ImageLibrary\\images\\outputImages";
        const totalDirectories = result.filePaths.length;
        let processedDirectories = 0;

        const progressBar = new ProgressBar({
            text: 'Saving images...',
            details: "initializing",
            browserWindow: {
                parent: mainWindow,
                modal: true,
            },
            maxValue: totalDirectories,
        });

        for (const directoryPath of result.filePaths) {
            try {
                await ImageSaver.saveImages(directoryPath, destinationDirectoryPath);
                processedDirectories += 1;
                if (processedDirectories === totalDirectories) {
                    progressBar.close();
                    library.reloadImagesFromDirectory();
                }
            } catch (error) {
                console.error('Error processing directory:', directoryPath, error);
                progressBar.close();
                break;
            }
        }
    } else {
        console.log('No directory selected');
    }
}

module.exports = { openFileDialog };
