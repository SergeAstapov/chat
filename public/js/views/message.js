import config from 'js/config.js';

const template = '' +
    '<span class="chat-message-datetime"></span>' +
    '<span class="chat-message-nickname"></span>: ' +
    '<span class="chat-message-text"></span>'
;

/**
 *
 * @param {MessageWidget} messageWidget
 * @returns {HTMLElement}
 */
export function build (messageWidget) {
    var documentFragment = document.createRange().createContextualFragment(template);

    var element = document.createElement('div');
    element.id = config.widgetIDPrefix + 'chat-' + messageWidget.message.id;
    element.className = 'chat-message';
    element.appendChild(documentFragment);

    if (messageWidget.message.type == 'server') {
        element.className += ' chat-server-message';
    }

    fillContent(element, messageWidget);
    bindListeners(element, messageWidget);

    return element;
}

function fillContent (element, messageWidget) {
    let message = messageWidget.message;
    let elNickname = element.querySelector('.chat-message-nickname');
    let elText     = element.querySelector('.chat-message-text');
    let elDateTime = element.querySelector('.chat-message-datetime');

    if (elNickname) {
        elNickname.textContent = message.nickname;
    }

    if (elText) {
        elText.textContent = message.message;
    }

    if (elDateTime) {
        elDateTime.textContent = formatDate(message.date);
    }
}

function bindListeners () {

}

function formatDate (date) {
    if (!date) {
        return '';
    }

    if (typeof date != 'object' || typeof date.getTime != 'function') {
        date = new Date(date);
    }
    var dateStr = '';

    if (!dateIsToday(date)) {
        dateStr += [
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate()
        ].join('-') + ' ';
    }

    dateStr += [
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
    ].join(':');

    return dateStr;
}

function dateIsToday (date) {
    var today = new Date();

    return date.getDate() == today.getDate() &&
        date.getMonth() == today.getMonth() &&
        date.getYear() == today.getYear();
}