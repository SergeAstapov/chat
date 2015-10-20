import config from 'js/config.js';
import EventEmitter from 'js/utils/event-emitter.js';
import * as layout from 'js/views/chat.js';
import MessageWidget from 'js/widgets/message.js';

export default class ChatWidget extends EventEmitter {
    constructor (chat, parent) {
        super();

        this.parent = parent;
        this.chat = chat;

        this.element = layout.build(this);

        if (chat.messages && chat.messages.length) {
            setTimeout(() => {
                chat.messages.forEach(message => {
                    this._appendMessage(message);
                });

                this._fixScroll();
            }, 0);
        }
    }

    sendMessage (msgText) {
        this.sendAction('sendMessage', msgText);
    }

    newMessage (message) {
        this._appendMessage(message);
        this._fixScroll();
    }

    _appendMessage (message) {
        let elMessages = this.element.querySelector('.chat-messages');
        let msgWidget = new MessageWidget(message, this);

        elMessages.appendChild(msgWidget.element);
    }

    _fixScroll () {
        let elMessages = this.element.querySelector('.chat-messages');

        let isScrolledTop = elMessages.scrollTop == 0 ||
            elMessages.scrollTop < (this.element.scrollHeight - this.element.clientHeight);

        if (isScrolledTop) {
            elMessages.scrollTop = this.element.scrollHeight;
        }
    }

    makeInactive () {

    }
}