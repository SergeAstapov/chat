import config from 'js/config.js';
import App from 'js/app.js';

const template = '' +
    '<button class="chat-creation-btn">Create new chat</button>' +
    '<form class="chat-creation-form">' +
        '<input name="chatName" placeholder="Chat title">' +
        '<input name="submit" type="submit" value="Create!">' +
    '</form>'
;

/**
 *
 * @param {ChatCreationWidget} chatWidget
 * @returns {HTMLElement}
 */
export function build (chatWidget) {
    var documentFragment = document.createRange().createContextualFragment(template);

    var element = document.createElement('div');
    element.id = config.widgetIDPrefix + 'chat-creation';
    element.className = 'chat-creation';
    element.appendChild(documentFragment);

    chatWidget.parent.element.appendChild(element);

    bindListeners(element, chatWidget);

    return element;
}

/**
 *
 * @param element
 * @param {ChatCreationWidget} widget
 */
function bindListeners (element, widget) {
    let elShowBtn = element.querySelector('.chat-creation-btn');
    let elForm = element.querySelector('form.chat-creation-form');
    let elInput = element.querySelector('form.chat-creation-form input[name="chatName"]');

    if (elForm) {
        elForm.style.display = 'none';

        var focusEvent = document.createEvent('HTMLEvents');
        focusEvent.initEvent('focus', true, true);

        elShowBtn.addEventListener('click', function (event) {
            event.preventDefault();

            elForm.style.display = '';
            setTimeout(function () {
                elInput.dispatchEvent(focusEvent);
            }, 0);
        });

        elForm.addEventListener('submit', function (event) {
            event.preventDefault();

            widget.createChat(elInput.value);

            elForm.style.display = 'none';
        });
    }
}
