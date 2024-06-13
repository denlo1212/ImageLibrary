class AppState {
    constructor() {
        if (!AppState.instance) {
            this.state = {
                currentPage: 1,
                isDialogOpen: false,
                imagesPerPage: 0,
                selectionMode: false,
            };
            AppState.instance = this;
        }

        return AppState.instance;
    }

    getState() {

        return { ...this.state };
    }

    setCurrentPage(page) {
        this.state.currentPage = page;
        console.log('New currentPage:', this.state.currentPage);
    }

    setIsDialogOpen(isOpen) {
        this.state.isDialogOpen = isOpen;
        console.log('New isDialogOpen:', this.state.isDialogOpen);
    }

    setImagesPerPage(count) {
        this.state.imagesPerPage = count;
        console.log('New imagesPerPage:', this.state.imagesPerPage);
    }

    setSelectionMode(mode) {
        this.state.selectionMode = mode;
        console.log('New selectionMode:', this.state.selectionMode);
    }

}

const instance = new AppState();
Object.freeze(instance);
module.exports = instance;
