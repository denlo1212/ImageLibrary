const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { extname } = require('path');
const Foto = require("./domain/foto");
const { readFile } = require('fs').promises;

function loadImages(directoryPath) {
    const images = [];
    const isImageFile = async (file) => {
        try {
            const buffer = await readFile(file);
            return isImageBuffer(buffer);
        } catch (error) {
            return false;
        }
    };

    const isImageBuffer = (buffer) => {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
        const header = buffer.toString('hex', 0, 4);
        const ext = extname(header).toLowerCase();
        return imageExtensions.includes(ext);
    };

    if (fs.existsSync(directoryPath) && fs.lstatSync(directoryPath).isDirectory()) {
        const files = fs.readdirSync(directoryPath);
        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            if (fs.lstatSync(filePath).isDirectory()) {
                images.push(... loadImages(filePath));
            } else if (fs.lstatSync(filePath).isFile() && isImageFile(filePath)) {
                images.push(new Foto(filePath,"placeholder",file,[]))
            }
        }
    } else {
        console.error("Directory does not exist or is not a directory: " + directoryPath);
    }

    return images;
}

function saveImages(sourceDirectoryPath, destinationDirectoryPath, formatName) {
    if (fs.existsSync(sourceDirectoryPath) && fs.lstatSync(sourceDirectoryPath).isDirectory()) {
        const files = fs.readdirSync(sourceDirectoryPath);
        for (const file of files) {
            const filePath = path.join(sourceDirectoryPath, file);
            if (fs.lstatSync(filePath).isDirectory()) {
                saveImages(filePath, destinationDirectoryPath, formatName);
            } else if (fs.lstatSync(filePath).isFile() && isImageFile(filePath)) {
                try {
                    const image = sharp(filePath);
                    image.toFile(path.join(destinationDirectoryPath, file), (err, info) => {
                        if (err) {
                            console.error("Error saving image:", err.message);
                        } else {
                            console.log("Image saved successfully to:", info.path);
                        }
                    });
                } catch (error) {
                    console.error("Error processing image:", error.message);
                }
            }
        }
    } else {
        console.error("Directory does not exist or is not a directory:", sourceDirectoryPath);
    }
}

module.exports = loadImages, saveImages;

