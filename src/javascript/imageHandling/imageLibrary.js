const path = require("path");
const fs = require("fs");
const Foto = require("../domain/foto");

class ImageLibrary {
    constructor() {
        if (ImageLibrary.instance) {
            return ImageLibrary.instance;
        }

        this.uniqueTags = new Set();
        this.backUpList = [];
        this.images = [];

        this.directoryPath = path.join(__dirname,"..","..","..", "images", "outputImages");
        this.loadImages(this.directoryPath);

        ImageLibrary.instance = this;
    }

    isImageFile(filePath) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
        const ext = path.extname(filePath).toLowerCase();
        return imageExtensions.includes(ext);
    }

    loadImages(directoryPath, parentTags = []) {
        try {
            if (fs.existsSync(directoryPath) && fs.lstatSync(directoryPath).isDirectory()) {
                const files = fs.readdirSync(directoryPath);
                for (const file of files) {
                    const filePath = path.join(directoryPath, file);
                    const fileStat = fs.lstatSync(filePath);

                    if (fileStat.isDirectory()) {
                        const newTags = [...parentTags, file];
                        this.loadImages(filePath, newTags);
                    } else if (fileStat.isFile() && this.isImageFile(filePath)) {
                        const foto = new Foto(filePath, "placeholder", file, parentTags.map(tag => tag.toLowerCase()));
                        this.backUpList.push(foto);
                        this.images.push(foto);
                        parentTags.forEach(tag => this.uniqueTags.add(tag.toLowerCase()));
                    }
                }
            } else {
                console.error("Directory does not exist or is not a directory:", directoryPath);
            }
        } catch (error) {
            console.error("Error loading images:", error);
        }

        // sort method doesn't work on a set
        const sortedUniqueTags = Array.from(this.uniqueTags).sort();
        this.uniqueTags.clear();

        sortedUniqueTags.forEach(tag => this.uniqueTags.add(tag));
    }

    getAmountOfImages() {
        return this.images.length;
    }

    getImages() {
        return [...this.images];
    }

    filterImages(tags) {
        this.images = this.backUpList.filter(image =>
            tags.every(filter => image.tags.includes(filter))
        );
    }

    getUniqueTags() {
        return Array.from(this.uniqueTags);
    }

    restoreDefault() {
        this.images = [...this.backUpList];
    }

    reloadImagesFromDirectory() {
        this.backUpList = []
        this.images = []
        this.uniqueTags = new Set()
        this.loadImages(this.directoryPath)
    }
}

const library = new ImageLibrary();
// Object.freeze(library);

module.exports = library;