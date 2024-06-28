const fs = require("fs");
const path = require("path");

const intervalFilePath = path.join(__dirname, '..' ,'..' , 'files','interval.txt');

document.addEventListener('DOMContentLoaded', () => {
    // Toggle settings menu visibility
    document.getElementById('settings-button').addEventListener('click', function(event) {
        event.preventDefault();
        const menu = document.getElementById('settings-menu');
        if (menu.style.display === 'none' || menu.style.display === '') {
            menu.style.display = 'block';
        } else {
            menu.style.display = 'none';
        }
    });

    // Theme switcher logic
    const html = document.getElementsByTagName('html')[0];
    const radios = document.getElementsByName('themes');

    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            html.classList.remove(html.classList.item(0));
            html.classList.add(this.id);
        });
    });

    // Modal and form handling
    const displaySettingsLink = document.getElementById('display-settings-link');
    const settingsModal = document.getElementById('settings-modal');
    const settingsForm = document.getElementById('settings-form');
    const backButton = document.getElementById('back-button');

    displaySettingsLink.addEventListener('click', (event) => {
        event.preventDefault();
        settingsModal.classList.add('show');
    });

    backButton.addEventListener('click', () => {
        settingsModal.classList.remove('show');
    });

    settingsForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const interval = document.getElementById('interval').value;
        fs.writeFile(intervalFilePath, interval, (err) => {
            if (err) {
                console.error('Error saving interval:', err);
                return;
            }
            alert('Interval saved successfully!');
            settingsModal.classList.remove('show');
        });
    });
});
