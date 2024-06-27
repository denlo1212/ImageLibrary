

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('settings-button').addEventListener('click', function(event) {
        event.preventDefault();
        const menu = document.getElementById('settings-menu');
        if (menu.style.display === 'none' || menu.style.display === '') {
            menu.style.display = 'block';
        } else {
            menu.style.display = 'none';
        }
    });

    var html = document.getElementsByTagName('html');
    var radios = document.getElementsByName('themes');

    for (i = 0; i < radios.length; i++) {
        radios[i].addEventListener('change', function() {
            html[0].classList.remove(html[0].classList.item(0));
            html[0].classList.add(this.id);
        });
    }

    // document.getElementById('save-settings').addEventListener('click', function() {
    //     const darkMode = document.getElementById('dark-mode').checked;
    //     const notifications = document.getElementById('notifications').checked;
    //
    //     console.log('Dark Mode:', darkMode);
    //     console.log('Notifications:', notifications);
    //
    //     alert('Settings saved!');
    //     document.getElementById('settings-menu').style.display = 'none';
    // });

})