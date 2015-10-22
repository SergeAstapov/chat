/**
 * @file Application Domain logic
 */
import App from 'js/app.js';
import * as localDB from 'js/utils/local-db.js';
import resourceManager from 'js/utils/resource-manager.js';
import Chat from 'js/models/chat.js';
import ChatWidget from 'js/widgets/chat.js';

export default class ChatController {
    constructor (parent, connection, chatId) {
        this.parent = parent;
        this.element = parent.element;

        this.chatId = chatId;
        this.connection = connection;

        this.widget = new ChatWidget(this, chatId);

        resourceManager
            .getChatDetails(chatId)
            .then(chat => {
                this.chat = new Chat(chatId, chat.title, chat.users, chat.messages);

                this.widget.chat = chat;
                this.widget.updateMessages(chat.messages);
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

    sendMessage (msgText) {
        this.connection.emit('send message', {
            chatId: this.chatId,
            nickname: App.session.nickname,
            message: msgText
        });
    }

    newMessage (message) {
        this.widget.newMessage(message);
    }

    updateUsername (nickname) {
        App.session.nickname = nickname;

        localDB.storeValue('nickname', nickname);
    }
}