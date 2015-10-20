import config from 'js/config.js';
import App from 'js/app.js';

const template = '' +
    '<div class="chat-messages"></div>' +
    '<div class="chat-nickname">' +
        '<span class="el-label">Nickname:</span> ' +
        '<span class="el-value"></span>' +
    '</div>' +
    '<form class="chat-form">' +
        '<textarea placeholder="Enter message"></textarea>' +
        '<input type="submit" value="Send message">' +
    '</form>'
;

/**
 *
 * @param {ChatWidget} chatWidget
 * @returns {HTMLElement}
 */
export function build (chatWidget) {
    var documentFragment = document.createRange().createContextualFragment(template);

    var element = document.createElement('div');
    element.id = config.widgetIDPrefix + 'chat-' + chatWidget.chat.id;
    element.className = 'chat-window';
    element.appendChild(documentFragment);

    chatWidget.parent.element.appendChild(element);

    fillContent(element, chatWidget);
    bindListeners(element, chatWidget);

    return element;
}

function fillContent (element) {
    let elNickname = element.querySelector('.chat-nickname .el-value');

    if (elNickname) {
        elNickname.textContent = App.session.nickname;
    }
}

/**
 *
 * @param element
 * @param {ChatWidget} widget
 */
function bindListeners (element, widget) {
    let elForm = element.querySelector('form.chat-form');
    let elInput = element.querySelector('form.chat-form textarea');

    if (elForm) {
        elForm.addEventListener('submit', function (event) {
            event.preventDefault();

            widget.sendMessage(elInput.value);

            elInput.value = '';
        });
    }
}
