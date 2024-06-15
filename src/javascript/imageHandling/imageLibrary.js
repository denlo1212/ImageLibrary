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
        this.selectedImages = new Map();

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
                // let isEmpty = true;

                for (const file of files) {
                    const filePath = path.join(directoryPath, file);
                    const fileStat = fs.lstatSync(filePath);

                    if (fileStat.isDirectory()) {
                        const newTags = [...parentTags, file];
                        this.loadImages(filePath, newTags);
                        // isEmpty = false;
                    } else if (fileStat.isFile() && this.isImageFile(filePath)) {
                        const foto = new Foto(filePath, "placeholder", file, parentTags.map(tag => tag.toLowerCase()));
                        this.backUpList.push(foto);
                        this.images.push(foto);
                        parentTags.forEach(tag => this.uniqueTags.add(tag.toLowerCase()));
                        // isEmpty = false;
                    }
                }

                // if (isEmpty) {
                //     fs.rmdirSync(directoryPath); // Delete the directory if it's empty
                //     console.log(`Deleted empty directory: ${directoryPath}`);
                // }
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
        this.selectedImages = new Set();
        this.images = this.backUpList.filter(image =>
            tags.every(filter => image.tags.includes(filter))
        );
    }

    getUniqueTags() {
        return Array.from(this.uniqueTags);
    }

    restoreDefault() {
        this.selectedImages = new Set();
        this.images = [...this.backUpList];
    }

    reloadImagesFromDirectory() {
        this.backUpList = []
        this.images = []
        this.uniqueTags = new Set();
        this.selectedImages = new Map();
        this.loadImages(this.directoryPath)
    }

    addSelectedImage(index) {
        this.selectedImages.set(index, this.images[index]);
    }

    removeSelectedImage(index) {
        this.selectedImages.delete(index);
    }

    getSelectedImagesMap() {
        return new Map(this.selectedImages);
    }

    getSelectedImages() {
        return [...this.selectedImages.values()]

    }

    resetSelectedList() {
        this.selectedImages = new Map();
    }

    updateImageTags(tagsToRemove, tagsToAdd) {
        const selectedImages = this.selectedImages;
        const baseDir = path.join(__dirname, '..', '..', '..', 'images', 'outputImages');

        selectedImages.forEach((foto, index) => {

            tagsToAdd.forEach(tag => {
                if (!foto.tags.includes(tag)) {
                    foto.tags.push(tag);
                }
            });

            foto.tags = foto.tags.filter(tag => !tagsToRemove.includes(tag));

            const dirStructure = foto.tags.join(path.sep);
            const newPath = path.join(baseDir, dirStructure, path.basename(foto.path));


            this.moveImageFile(foto, newPath);

            foto.path = newPath;

            if (index < this.backUpList.length) {
                this.backUpList[index] = foto;
            } else {
                console.error(`Index ${index} out of range in backupList`);
            }

            this.resetSelectedList();
        });
    }
    moveImageFile(foto, newPath) {
        const oldPath = foto.path;

        if (fs.existsSync(oldPath)) {
            fs.mkdirSync(path.dirname(newPath), { recursive: true });
            fs.copyFileSync(oldPath, newPath);
            fs.unlinkSync(oldPath);

            console.log(`Moved image from ${oldPath} to ${newPath}`);
        } else {
            console.error(`Image file not found at ${oldPath}`);
        }
    }



}

const library = new ImageLibrary();

module.exports = library;
