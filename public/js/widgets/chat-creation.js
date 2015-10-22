import config from 'js/config.js';
import EventEmitter from 'js/utils/event-emitter.js';
import * as layout from 'js/views/chat-creation.js';

export default class ChatCreationWidget extends EventEmitter {
    constructor (parent) {
        super();

        this.parent = parent;

        this.element = layout.build(this);
    }

    createChat (chatName) {
        this.sendAction('createChat', chatName);
    }
}