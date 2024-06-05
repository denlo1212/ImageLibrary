const fs = require('fs');
const path = require('path');
const Foto = require("./domain/foto");

function isImageFile(filePath) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    const ext = path.extname(filePath).toLowerCase();
    return imageExtensions.includes(ext);
}

function loadImages(directoryPath) {
    const images = [];

    if (fs.existsSync(directoryPath) && fs.lstatSync(directoryPath).isDirectory()) {
        const files = fs.readdirSync(directoryPath);
        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            if (fs.lstatSync(filePath).isDirectory()) {
                images.push(...loadImages(filePath));
            } else if (fs.lstatSync(filePath).isFile() && isImageFile(filePath)) {
                images.push(new Foto(filePath, "placeholder", file, []));
            }
        }
    } else {
        console.error("Directory does not exist or is not a directory: " + directoryPath);
    }

    return images;
}

function saveImages(sourceDirectoryPath, destinationDirectoryPath) {
    if (fs.existsSync(sourceDirectoryPath) && fs.lstatSync(sourceDirectoryPath).isDirectory()) {
        const files = fs.readdirSync(sourceDirectoryPath);
        for (const file of files) {
            const filePath = path.join(sourceDirectoryPath, file);
            if (fs.lstatSync(filePath).isDirectory()) {
                saveImages(filePath, destinationDirectoryPath);
            } else if (fs.lstatSync(filePath).isFile() && isImageFile(filePath)) {
                try {
                    fs.copyFileSync(filePath, path.join(destinationDirectoryPath, file));
                    console.log("Image saved successfully:", file);
                } catch (error) {
                    console.error("Error saving image:", error.message);
                }
            }
        }
    } else {
        console.error("Directory does not exist or is not a directory:", sourceDirectoryPath);
    }
}

module.exports = { loadImages, saveImages };
