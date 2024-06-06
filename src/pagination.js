
//note: updatePage is a function from imageList that triggers the render
function renderPagination(totalPages, currentPage, updatePage) {
    const paginationContainer = document.querySelector(".pagination");
    paginationContainer.innerHTML = '';



    if (currentPage > 1) {
        const leftArrow = createPageLink(currentPage - 1, '←',updatePage );
        paginationContainer.appendChild(leftArrow);
    }

    let startPage = currentPage - 2;
    let endPage = currentPage + 2;

    startPage = Math.max(1, startPage);
    endPage = Math.min(totalPages, endPage);

    for (let i = startPage; i <= endPage; i++) {
        const pageLink = createPageLink(i, null, updatePage, i === currentPage);
        paginationContainer.appendChild(pageLink);
    }

    if (currentPage < totalPages) {
        const rightArrow = createPageLink(currentPage + 1, '→', updatePage);
        paginationContainer.appendChild(rightArrow);
    }

    // Add input field
    const inputField = document.createElement("input");
    inputField.type = "number";
    inputField.min = 1;
    inputField.max = totalPages;
    inputField.value = currentPage;
    inputField.addEventListener("change", (event) => {
        let value = parseInt(event.target.value);
        value = Math.max(1, Math.min(totalPages, value));
        updatePage(value);
    });
    paginationContainer.appendChild(inputField);
}


function createPageLink(pageNum, text, updatePage,isActive){
        const pageLink = document.createElement("a");
        pageLink.href = "#";
        pageLink.textContent = text || pageNum;
        if (isActive) {
            pageLink.classList.add("active");
        }
        pageLink.addEventListener("click", (event) => {
            event.preventDefault();
            updatePage(pageNum);
        });
        return pageLink;

}



module.exports = { renderPagination };
