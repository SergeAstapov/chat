/**
 * @file Application Domain logic
 */
import App from 'js/app.js';
import * as localDB from 'js/utils/local-db.js';
import resourceManager from 'js/utils/resource-manager.js';
import Chat from 'js/models/chat.js';
import ChatWidget from 'js/widgets/chat.js';

export default class ChatController {
    constructor (chatId) {
        this.chatId = chatId;

        this.connection = resourceManager.getChatConnection(chatId);

        this.connection.on('connect', this.attachConnectionListeners.bind(this));

        resourceManager
            .getChatDetails(chatId)
            .then(chat => {
                this.chat = new Chat(chatId, chat.title, chat.users, chat.messages);

                this.element = App.element;
                this.widget = new ChatWidget(this.chat, this);
            })
        ;
    }

    inviteUser (nickname) {
        if (this.chat.hasUser(nickname)) {
            return Promise.resolve();
        }
        else {
            this.chat.addUser(nickname);

            return resourceManager.inviteUserToChat(this.connection, nickname);
        }
    }

    attachConnectionListeners () {
        this.connection.on('disconnect', () => {
            this.widget.makeInactive();
        });

        this.connection.on('new message', data => {
            this.widget.newMessage(data);
        });
    }

    sendMessage (msgText) {
        this.connection.emit('send message', {
            nickname: App.session.nickname,
            message: msgText
        });
    }

    updateUsername (nickname) {
        App.session.nickname = nickname;

        localDB.storeValue('nickname', nickname);
    }
}