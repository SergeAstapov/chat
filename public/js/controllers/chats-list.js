/**
 * @file Application Domain logic
 */
import App from 'js/app.js';
import localDB from 'js/utils/local-db.js';
import resourceManager from 'js/utils/resource-manager.js';
import ChatController from 'js/controllers/chat.js';

export default class ChatsListController {
    constructor () {
        this.chats = [];

        this.chats.push(new ChatController('main'));
    }

    getUserChats () {
        return localDB.readValue('joinedChats')
            .then(chats => {
                if (!chats || !Array.isArray(chats)) {
                    chats = ['main'];
                }

                return chats;
            })
        ;
    }
}
