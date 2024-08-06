const librarySorter = require("../imageHandling/imageLibrary");
const SortType = require("../imageHandling/domain/sortType");
const SortOrder = require("../imageHandling/domain/sortOrder");

document.addEventListener("DOMContentLoaded", function () {
    let sortOptions = document.getElementById('sortOptions');
    let orderOptions = document.getElementById('orderOptions');

    let defaultSortOption = document.createElement("option");
    defaultSortOption.value = "";
    defaultSortOption.textContent = "Select sort type";
    defaultSortOption.disabled = true;
    defaultSortOption.selected = true;
    sortOptions.appendChild(defaultSortOption);

    Object.values(SortType).forEach(type => {
        let option = document.createElement("option");
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        sortOptions.appendChild(option);
    });

    let defaultOrderOption = document.createElement("option");
    defaultOrderOption.value = "";
    defaultOrderOption.textContent = "Select sort order";
    defaultOrderOption.disabled = true;
    defaultOrderOption.selected = true;
    orderOptions.appendChild(defaultOrderOption);

    Object.values(SortOrder).forEach(order => {
        let option = document.createElement("option");
        option.value = order;
        option.textContent = order.charAt(0).toUpperCase() + order.slice(1);
        orderOptions.appendChild(option);
    });

    function updateSorting() {
        const sortType = sortOptions.value;
        const sortOrder = orderOptions.value;

        if (sortType && sortOrder) {
            librarySorter.sortImages(sortType, sortOrder);
            render();
            console.log(`Sorting by: ${sortType}, Order: ${sortOrder}`);
        }
    }

    sortOptions.addEventListener('change', updateSorting);
    orderOptions.addEventListener('change', updateSorting);
});
