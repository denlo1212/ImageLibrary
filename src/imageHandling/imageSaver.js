const fs = require('fs');
const path = require('path');

class ImageSaver {
    static isImageFile(filePath) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
        const ext = path.extname(filePath).toLowerCase();
        return imageExtensions.includes(ext);
    }

    static saveImages(sourceFilePath, destinationDirectoryPath) {
        const sourceDirectoryName = path.basename(sourceFilePath);
        const destinationPath = path.join(destinationDirectoryPath, sourceDirectoryName);

        if (fs.existsSync(sourceFilePath) && this.isDirectoryNotEmpty(sourceFilePath)) {
            if (!fs.existsSync(destinationPath)) {
                fs.mkdirSync(destinationPath, { recursive: true });
            }

            if (fs.lstatSync(sourceFilePath).isDirectory()) {
                const files = fs.readdirSync(sourceFilePath);
                for (const file of files) {
                    const filePath = path.join(sourceFilePath, file);
                    const destFilePath = path.join(destinationPath, file);
                    if (fs.lstatSync(filePath).isDirectory()) {
                        this.saveImages(filePath, destFilePath);
                    } else if (fs.lstatSync(filePath).isFile() && this.isImageFile(filePath)) {
                        try {
                            fs.copyFileSync(filePath, destFilePath);
                        } catch (error) {
                            console.error("Error saving image:", error.message);
                        }
                    }
                }
            } else if (fs.lstatSync(sourceFilePath).isFile() && this.isImageFile(sourceFilePath)) {
                const destFilePath = path.join(destinationPath, path.basename(sourceFilePath));
                try {
                    fs.copyFileSync(sourceFilePath, destFilePath);
                } catch (error) {
                    console.error("Error saving image:", error.message);
                }
            }
        } else {
            console.error("Source does not exist or is empty:", sourceFilePath);
        }
    }

     static isDirectoryNotEmpty(directoryPath) {
        try {
            const files = fs.readdirSync(directoryPath);
            console.log(files.length > 0)
            return files.length > 0;
        } catch (error) {
            console.error("Error checking directory:", error.message);
            return false;
        }
    }


}

module.exports = ImageSaver;
