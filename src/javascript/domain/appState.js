class AppState {
    constructor() {
        if (AppState.instance) {
            return AppState.instance;
        }

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

    getState() {
        return this.state;
    }

    updateState(updates) {
        Object.assign(this.state, updates);
    }
}

const instance = new AppState();

module.exports = instance;
