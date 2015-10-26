import config from 'js/config.js';

let layoutElement;

export function build () {
    if (!layoutElement) {
        layoutElement = document.createElement('div');
        layoutElement.id = config.widgetIDPrefix + 'root';

        document.body.appendChild(layoutElement);

        var openBtn = document.createElement('button');
        openBtn.id = config.widgetIDPrefix + 'chats-button';
        openBtn.className = 'chats-button';
        openBtn.innerText = 'Chats widget';

        layoutElement.appendChild(openBtn);

        bindListeners(layoutElement);
    }

    return layoutElement;
}

export function getElement () {
    return layoutElement;
}

/**
 *
 * @param element
 */
function bindListeners (element) {
    let elShowBtn = element.querySelector('.chats-button');

    if (elShowBtn) {
        elShowBtn.addEventListener('click', function (event) {
            event.preventDefault();

            if (element.classList.contains('widget-visible')) {
                element.classList.remove('widget-visible');
                elShowBtn.innerText = 'Show widget';
            } else {
                element.classList.add('widget-visible');
                elShowBtn.innerText = 'Hide widget';
            }
        });
    }
}