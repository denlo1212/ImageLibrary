class AppState {
    constructor() {

        if (!AppState.instance) {
            this.state = {
                currentPage: 1,
                isDialogOpen: false,
                imagesPerPage: 0,
                selectionMode: false,
                lastClickedIndex: null,
                currentImageIndex: 0,
            };
            AppState.instance = this;
        }

        return AppState.instance;
    }

    getState() {
        return { ...this.state };
    }

    updateState(updates) {
        Object.assign(this.state, updates);
    }

    setCurrentPage(page) {
        this.state.currentPage = page;
    }

    setIsDialogOpen(isOpen) {
        this.state.isDialogOpen = isOpen;
    }

    setImagesPerPage(count) {
        this.state.imagesPerPage = count;
    }

    setSelectionMode(mode) {
        this.state.selectionMode = mode;
    }

    setLastClickedIndex(index) {
        this.state.lastClickedIndex = index;
    }

    setCurrentImageIndex(index) {
        this.state.currentImageIndex = index;
    }
}

const instance = new AppState();

module.exports = instance;
