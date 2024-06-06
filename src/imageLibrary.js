const path = require("path");
const fs = require("fs");
const Foto = require("./domain/foto");
const ImageLibrary = (function () {
    let instance;

    function createInstance() {
        return new class {
            constructor() {
                this.uniqueTags = new Set();
                this.images = [];
                this.loadImages("C:\\Users\\denlo\\OneDrive\\Afbeeldingen\\foto's\\Camera-album")
            }

            isImageFile(filePath) {
                const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
                const ext = path.extname(filePath).toLowerCase();
                return imageExtensions.includes(ext);
            }

            loadImages(directoryPath, parentTags = []) {
                if (fs.existsSync(directoryPath) && fs.lstatSync(directoryPath).isDirectory()) {
                    const files = fs.readdirSync(directoryPath);
                    for (const file of files) {
                        const filePath = path.join(directoryPath, file);
                        if (fs.lstatSync(filePath).isDirectory()) {
                            const newTags = [...parentTags, file];
                            this.loadImages(filePath, newTags);
                        } else if (fs.lstatSync(filePath).isFile() && this.isImageFile(filePath)) {
                            const foto = new Foto(filePath, "placeholder", file, parentTags);
                            this.images.push(foto);
                            parentTags.forEach(tag => this.uniqueTags.add(tag));
                        }
                    }
                } else {
                    console.error("Directory does not exist or is not a directory: " + directoryPath);
                }
            }

            getAmountOfImages() {
                return this.images.length;
            }

            getImages() {
                return [...this.images];
            }

            filterImages(tags) {
                return this.images.filter(image => {
                    return tags.every(filter => image.tags.includes(filter));
                });
            }

            getUniqueTags() {
                return Array.from([...this.uniqueTags]);
            }
        }
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();


module.exports = ImageLibrary;
