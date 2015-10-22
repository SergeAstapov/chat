import config from 'js/config.js';

/**
 *
 * @param {ChatWidget} chatWidget
 * @returns {HTMLElement}
 */
export function build (chatWidget) {
    var element = document.createElement('div');
    element.id = config.widgetIDPrefix + 'chats-list';
    element.className = 'chats-list';

    return element;
}
