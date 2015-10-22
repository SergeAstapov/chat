import config from 'js/config.js';
import EventEmitter from 'js/utils/event-emitter.js';
import * as layout from 'js/views/chats-list.js';
import ChatCreationWidget from 'js/widgets/chat-creation.js';

export default class ChatWidget extends EventEmitter {
    constructor (parent) {
        super();

        this.parent = parent;

        this.element = layout.build(this);
        this.parent.parent.element.appendChild(this.element);

        let msgWidget = new ChatCreationWidget(this);
        this.element.appendChild(msgWidget.element);
    }

    createChat (chatName) {
        this.sendAction('createChat', chatName);
    }

    makeChatsInactive () {

    }
}