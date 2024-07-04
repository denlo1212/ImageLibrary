const fs = require("fs");
const path = require("path");

const intervalFilePath = path.join(__dirname, '..' ,'..' , 'files','interval.txt');
const themeFilePath = path.join(__dirname, '..' ,'..' , 'files','theme.txt');

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

    // Function to apply the theme
    function applyTheme(theme) {
        if (html.classList.length > 0) {
            html.classList.remove(html.classList.item(0));
        }
        html.classList.add(theme);
    }

    fs.readFile(themeFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading theme file:', err);
        } else {
            const savedTheme = data.trim();
            applyTheme(savedTheme);
            const radio = document.getElementById(savedTheme);
            if (radio) {
                radio.checked = true;
            }
        }
    });

    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            const selectedTheme = this.id;
            applyTheme(selectedTheme);
            // Save the selected theme to themeFilePath
            fs.writeFile(themeFilePath, selectedTheme, (err) => {
                if (err) {
                    console.error('Error saving theme:', err);
                }
            });
        });
    });

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
