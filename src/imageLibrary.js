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
                this.filteredImages = [];
                this.loadImages("D:\\homework")
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
                            this.filteredImages.push(foto)
                            parentTags.forEach(tag => this.uniqueTags.add(tag));
                        }
                    }
                } else {
                    console.error("Directory does not exist or is not a directory: " + directoryPath);
                }
            }

            getAmountOfImages() {
                return this.filteredImages.length;
            }

            getImages() {
                return [...this.filteredImages];
            }

            filterImages(tags) {
                this.filteredImages = [];
                this.filteredImages = this.images.filter(image =>
                    tags.every(filter => image.tags.includes(filter))
                );
            }


            getUniqueTags() {
                return Array.from([...this.uniqueTags]);
            }

            restoreDefault(){
                this.filteredImages = [];
                this.filteredImages = this.images
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
