import config from 'js/config.js';

/**
 *
 * @param {ChatsListWidget} chatsListWidget
 * @returns {HTMLElement}
 */
export function build (chatsListWidget) {
    var element = document.createElement('div');
    element.id = config.widgetIDPrefix + 'chats-list';
    element.className = 'chats-list';

    return element;
}
