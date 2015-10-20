export default class EventEmitter {
    sendAction (action, ...args) {
        if (typeof this.parent[action] == 'function') {
            this.parent[action].apply(this.parent, args);
        } else {
            console.warn('Nothing handled action "sendAction" sent by', this);
        }
    }
}