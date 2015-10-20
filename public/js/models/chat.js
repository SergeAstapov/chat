import resourceManager from 'js/utils/resource-manager.js';

export default class Chat {
    constructor (id, title, users, messages) {
        this.id = id;
        this.title = title;
        this.users = users;
        this.messages = messages;
    }

    hasUser (nickname) {
        return this.users.indexOf(nickname) > -1;
    }

    addUser (nickname) {
        this.users.push(nickname);

        return this;
    }
}