const fsRandom = require('fs');
const pathRandom = require('path');
const randomImagePath = pathRandom.join(__dirname, '..', '..', 'files', 'randomImage.txt');

function randomImage() {
    return new Promise((resolve) => {
        fsRandom.readFile(randomImagePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading randomImage file:', err);
                resolve(false);
            } else {
                resolve(data.trim() === 'true');
            }
        });
    });
}

function writeRandomImageState(state) {
    fsRandom.writeFile(randomImagePath, state ? 'true' : 'false', 'utf8', (err) => {
        if (err) {
            console.error('Error writing to randomImage file:', err);
        }
    });
}

document.addEventListener('DOMContentLoaded', async function () {
    const checkBox = document.querySelector("#toggle-switch");

    if (await randomImage()) {
        checkBox.checked = true;
    }

    checkBox.addEventListener('change', function () {
        writeRandomImageState(checkBox.checked);
    });
});
