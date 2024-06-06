const fs = require('fs');
const path = require('path');

class ImageSaver {
    static isImageFile(filePath) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
        const ext = path.extname(filePath).toLowerCase();
        return imageExtensions.includes(ext);
    }

    static saveImages(sourceDirectoryPath, destinationDirectoryPath) {
        if (fs.existsSync(sourceDirectoryPath) && fs.lstatSync(sourceDirectoryPath).isDirectory()) {
            if (!fs.existsSync(destinationDirectoryPath)) {
                fs.mkdirSync(destinationDirectoryPath, { recursive: true });
            }

            const files = fs.readdirSync(sourceDirectoryPath);
            for (const file of files) {
                const filePath = path.join(sourceDirectoryPath, file);
                if (fs.lstatSync(filePath).isDirectory()) {
                    this.saveImages(filePath, path.join(destinationDirectoryPath, path.basename(filePath)));
                } else if (fs.lstatSync(filePath).isFile() && this.isImageFile(filePath)) {
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
}

module.exports = ImageSaver
