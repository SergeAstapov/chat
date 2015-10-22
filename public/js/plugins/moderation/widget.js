import config from 'js/config.js';
import App from 'js/app.js';
import EventEmitter from 'js/utils/event-emitter.js';
import * as layout from './view.js';

export default class ModerationWidget extends EventEmitter {
    constructor (plugin) {
        super();

        this.parent = plugin;
        this.element = layout.build(this);

        App.element.appendChild(this.element);

        live(App.element, 'click', 'chat-message-remove', this.moderateMessage.bind(this));
    }

    login (login, password) {
        if (login && password) {
            this.sendAction('login', login, password);
        }
    }

    loginSuccessful () {
        App.chatsList.widget.element.classList.add('admin');

        this.element.style.display = 'none';

        this.element.querySelector('input[name="login"]').value = '';
        this.element.querySelector('input[name="password"]').value = '';
    }

    showError (error) {
        this.element.insertAdjacentHTML('beforeend', '<div class="error">' + error + '</div>');
    }

    moderateMessage (elMessage) {
        var messageId = elMessage.parentNode.dataset.id;
        var chatId = elMessage.parentNode.parentNode.parentNode.dataset.id;

        this.parent.moderateMessage(messageId, chatId);
    }

    removeModeratedMessage (messageId) {
        var elMsgs = App.element.querySelectorAll('[data-id="' + messageId + '"]');

        if (elMsgs && elMsgs.length) {
            for (let elMsg of elMsgs) {
                elMsg.parentNode.removeChild(elMsg);
            }
        }
    }
}

function live (rootElement, eventType, elementClass, cb) {
    rootElement.addEventListener(eventType, function (event) {
        var el = event.target;
        var found;

        while (el && !(found = (el.classList.contains(elementClass) ? el : null))) {
            el = el.parentElement;

            if (el == rootElement) {
                break;
            }
        }

        if (found) {
            cb(found, event);
        }
    });
}