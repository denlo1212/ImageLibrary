const path = require("path");
const fs = require("fs");
const Foto = require("./domain/foto");
const SortType = require("./domain/sortType");
const SortOrder = require("./domain/sortOrder");

class ImageLibrary {

    constructor() {

        if (ImageLibrary.instance) {
            return ImageLibrary.instance;
        }

        this.uniqueTags = new Set();
        this.backUpList = new Map();
        this.images = new Map();
        this.selectedImages = new Map();

        this.directoryPath = path.join(__dirname, "..", "..", "images", "outputImages");
        // this.directoryPath = path.resolve('D:\\homework');
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
                        const {createdAt, modifiedAt} = this.getFileDatesSync(filePath);
                        const fileName = path.basename(file, path.extname(file));
                        const foto = new Foto(filePath, fileName, file, parentTags.map(tag => tag.toLowerCase()),new Date(createdAt),new Date(modifiedAt));
                        const index = this.backUpList.size;
                        this.backUpList.set(index, foto);
                        this.images.set(index, foto);
                        parentTags.forEach(tag => this.uniqueTags.add(tag.toLowerCase()));
                    }
                }
            } else {
                console.error("Directory does not exist or is not a directory:", directoryPath);
            }
        } catch (error) {
            console.error("Error loading images:", error);
        }

        const sortedUniqueTags = Array.from(this.uniqueTags).sort();
        this.uniqueTags.clear();
        sortedUniqueTags.forEach(tag => this.uniqueTags.add(tag));

        // this.backUpList.forEach((value, key) =>
        //     console.log(value.name))

    }

    getFileDatesSync(filePath) {
        try {
            const stats = fs.statSync(filePath);
            return {
                createdAt: stats.birthtime.toISOString(),
                modifiedAt: stats.mtime.toISOString()
            };
        } catch (err) {
            console.error('Error getting file dates:', err);
            return {
                createdAt: null,
                modifiedAt: null
            };
        }
    }

    getAmountOfImages() {
        return this.images.size;
    }

    getImages() {
        return Array.from(this.images.values());
    }

    getImagesMap() {
        return new Map(this.images);
    }

    filterImages(tags) {
        this.selectedImages = new Map();
        this.images.clear();
        this.backUpList.forEach((image, index) => {
            if (tags.every(filter => image.tags.includes(filter))) {
                this.images.set(index, image);
            }
        });
    }

    getUniqueTags() {
        return Array.from(this.uniqueTags);
    }

    addTag(tag) {
        const normalizedTag = tag.toLowerCase(); // Ensure tag is in lowercase for consistency

        if (!this.uniqueTags.has(normalizedTag)) {
            this.uniqueTags.add(normalizedTag);

            // Sort unique tags and reassign to maintain sorted order
            const sortedUniqueTags = Array.from(this.uniqueTags).sort();
            this.uniqueTags.clear();
            sortedUniqueTags.forEach(tag => this.uniqueTags.add(tag));

            // Create directory for the new tag
            const tagDirectory = path.join(this.directoryPath, normalizedTag);

            if (!fs.existsSync(tagDirectory)) {
                fs.mkdirSync(tagDirectory);
                console.log(`Created directory for tag '${normalizedTag}' at ${tagDirectory}`);
            } else {
                console.log(`Directory for tag '${normalizedTag}' already exists at ${tagDirectory}`);
            }
        } else {
            console.log(`Tag '${normalizedTag}' already exists.`);
        }
    }

    restoreDefault() {
        this.selectedImages = new Map();
        this.images.clear();
        this.backUpList.forEach((image, index) => {
            this.images.set(index, image);
        });
    }

    reloadImagesFromDirectory() {
        this.backUpList = new Map();
        this.images = new Map();
        this.uniqueTags = new Set();
        this.selectedImages = new Map();
        this.loadImages(this.directoryPath);
    }

    addSelectedImage(index) {
        if (this.images.has(index)) {
            this.selectedImages.set(index, this.images.get(index));
        }
    }

    removeSelectedImage(index) {
        this.selectedImages.delete(index);
    }

    getSelectedImagesMap() {
        return new Map(this.selectedImages);
    }

    getSelectedImages() {
        return Array.from(this.selectedImages.values());
    }

    resetSelectedList() {
        this.selectedImages = new Map();
    }

    updateImageTags(tagsToRemove, tagsToAdd) {
        const baseDir = path.join(__dirname, '..', '..', '..', 'images', 'outputImages');

        this.selectedImages.forEach((foto, index) => {
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

            if (this.backUpList.has(index)) {
                this.backUpList.set(index, foto);
            } else {
                console.error(`Index ${index} out of range in backupList`);
            }

            this.resetSelectedList();
        });
    }

    moveImageFile(foto, newPath) {
        const oldPath = foto.path;

        if (fs.existsSync(oldPath)) {
            fs.mkdirSync(path.dirname(newPath), {recursive: true});
            fs.copyFileSync(oldPath, newPath);
            fs.unlinkSync(oldPath);

            console.log(`Moved image from ${oldPath} to ${newPath}`);
        } else {
            console.error(`Image file not found at ${oldPath}`);
        }
    }

    deleteSelectedImages() {
        for (const index of this.selectedImages.keys()) {
            const image = this.backUpList.get(index);
            if (image) {
                fs.unlinkSync(image.path);
                this.backUpList.delete(index);
            } else {
                console.log(`Image at index ${index} does not exist.`);
            }
        }
        this.selectedImages = new Map();
    }

    sortFunction(type, order) {
        return (a, b) => {
            let comparison = 0;

            if (type === SortType.CREATED) {
                comparison = a[1].created - b[1].created;
            } else if (type === SortType.MODIFIED) {
                comparison = a[1].modified - b[1].modified;
            } else if (type === SortType.ALPHABETICAL) {
                const nameA = a[1].name ? a[1].name.toString() : '';
                const nameB = b[1].name ? b[1].name.toString() : '';
                comparison = nameA.localeCompare(nameB);
            } else {
                throw new Error(`Unsupported sort type: ${type}`);
            }

            return order === SortOrder.ASC ? comparison : -comparison;
        };
    }

    sortImages(type, order) {
        if (!Object.values(SortOrder).includes(order)) {
            throw new Error(`Unsupported sort order: ${order}`);
        }

        if (!Object.values(SortType).includes(type)) {
            throw new Error(`Unsupported sort type: ${type}`);
        }


        const entriesArray = Array.from(this.images.entries());
        const sortFn = this.sortFunction(type, order);
        entriesArray.sort(sortFn);

        this.images = new Map(entriesArray);
    }

}

const library = new ImageLibrary();

module.exports = library;
