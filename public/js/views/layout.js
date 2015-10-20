import config from 'js/config.js';

let layoutElement;

export function build () {
    if (!layoutElement) {
        layoutElement = document.createElement('div');
        layoutElement.id = config.widgetIDPrefix + 'root';

        document.body.appendChild(layoutElement);
    }

    return layoutElement;
}

export function getElement () {
    return layoutElement;
}