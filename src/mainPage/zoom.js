function setupZoom(imageElement) {
    let zoomLevel = 100;

    const updateZoom = () => {
        imageElement.style.transform = `scale(${zoomLevel / 100})`;
    };

    imageElement.addEventListener("wheel", (event) => {
        event.preventDefault();
        const zoomDelta = event.deltaY > 0 ? -20 : 20;
        zoomLevel += zoomDelta; // Adjust zoom level
        zoomLevel = Math.max(100, Math.min(1000, zoomLevel));
        updateZoom();
    });

    updateZoom(); // Apply initial zoom level
}

function setupDragAndModal(modalElement) {
    let isDragging = false;
    let startX, startY, startScrollLeft, startScrollTop;

    modalElement.addEventListener("mousedown", (event) => {
        event.preventDefault();
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        startScrollLeft = modalElement.scrollLeft;
        startScrollTop = modalElement.scrollTop;
    });

    modalElement.addEventListener("mousemove", (event) => {
        if (isDragging) {
            event.preventDefault();
            const deltaX = event.clientX - startX;
            const deltaY = event.clientY - startY;
            modalElement.scrollLeft = startScrollLeft - deltaX;
            modalElement.scrollTop = startScrollTop - deltaY;
        }
    });

    const stopDragging = () => {
        isDragging = false;
    };

    modalElement.addEventListener("mouseup", stopDragging);
    modalElement.addEventListener("mouseleave", stopDragging);
}

module.exports = { setupZoom, setupDragAndModal };
