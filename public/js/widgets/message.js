import EventEmitter from 'js/utils/event-emitter.js';
import * as layout from 'js/views/message.js';

export default class MessageWidget extends EventEmitter {
    constructor (message, parent) {
        super();

        this.parent = parent;
        this.message = message;

        this.element = layout.build(this);
    }
}