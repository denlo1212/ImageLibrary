const fs = require('fs').promises;
const path = require('path');

class ImageSaver {
    static isImageFile(filePath) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
        const ext = path.extname(filePath).toLowerCase();
        return imageExtensions.includes(ext);
    }

    static async saveImages(sourceFilePath, destinationDirectoryPath) {

        const sourceDirectoryName = path.basename(sourceFilePath);
        const destinationPath = path.join(destinationDirectoryPath, sourceDirectoryName);

        try {
            const stat = await fs.lstat(sourceFilePath);
            if (stat.isDirectory() && await this.isDirectoryNotEmpty(sourceFilePath)) {
                await fs.mkdir(destinationPath, { recursive: true });

                const files = await fs.readdir(sourceFilePath);
                for (const file of files) {
                    const filePath = path.join(sourceFilePath, file);
                    const destFilePath = path.join(destinationPath, file);
                    const fileStat = await fs.lstat(filePath);

                    if (fileStat.isDirectory()) {
                        await this.saveImages(filePath, destinationPath);
                    } else if (fileStat.isFile() && this.isImageFile(filePath)) {
                        try {
                            await fs.copyFile(filePath, destFilePath);
                        } catch (error) {
                            console.error("Error saving image:", error.message);
                        }
                    }
                }
            } else if (stat.isFile() && this.isImageFile(sourceFilePath)) {
                const destFilePath = path.join(destinationPath, path.basename(sourceFilePath));
                try {
                    await fs.copyFile(sourceFilePath, destFilePath);
                } catch (error) {
                    console.error("Error saving image:", error.message);
                }
            } else {
                console.error("Source does not exist or is empty:", sourceFilePath);
            }
        } catch (error) {
            console.error("Error processing directory:", error.message);
        }
    }

    static async isDirectoryNotEmpty(directoryPath) {
        try {
            const files = await fs.readdir(directoryPath);
            return files.length > 0;
        } catch (error) {
            console.error("Error checking directory:", error.message);
            return false;
        }
    }
}

module.exports = ImageSaver;
