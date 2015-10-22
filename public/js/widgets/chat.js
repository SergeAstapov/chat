import config from 'js/config.js';
import EventEmitter from 'js/utils/event-emitter.js';
import * as layout from 'js/views/chat.js';
import MessageWidget from 'js/widgets/message.js';

export default class ChatWidget extends EventEmitter {
    constructor (parent, chatId) {
        super();

        this.parent = parent;
        this.chatId = chatId;

        this.element = layout.build(this);
    }

    updateMessages (messages) {
        messages.forEach(message => {
            this._appendMessage(message);
        });

        this._fixScroll();
    }

    sendMessage (msgText) {
        this.sendAction('sendMessage', msgText);
    }

    newMessage (message) {
        this._appendMessage(message);

        setTimeout(() => this._fixScroll(), 1);
    }

    _appendMessage (message) {
        let elMessages = this.element.querySelector('.chat-messages');
        let msgWidget = new MessageWidget(message, this);

        elMessages.appendChild(msgWidget.element);
    }

    _fixScroll () {
        let elMessages = this.element.querySelector('.chat-messages');

        let isScrolledTop = elMessages.scrollTop == 0 ||
            elMessages.scrollTop < (elMessages.scrollHeight - elMessages.clientHeight);

        if (isScrolledTop) {
            elMessages.scrollTop = this.element.scrollHeight;
        }
    }
}