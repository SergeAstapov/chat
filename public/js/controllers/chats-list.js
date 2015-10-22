/**
 * @file Application Domain logic
 */
import App from 'js/app.js';
import * as localDB from 'js/utils/local-db.js';
import resourceManager from 'js/utils/resource-manager.js';
import ChatController from 'js/controllers/chat.js';
import ChatsListWidget from 'js/widgets/chats-list.js';

export default class ChatsListController {
    constructor () {
        this.chats = {};

        this.element = App.element;
        this.widget = new ChatsListWidget(this);

        this.connection = resourceManager.getChatConnection();

        this.connection.on('connect', this.attachConnectionListeners.bind(this));

        this.connection.on('connect', () => {
            this._createChatInstance('main');
        });

        //this.getUserChats()
        //    .then(chatsIds => {
        //        chatsIds.forEach(chatId => {
        //            this.chats[chatId] = new ChatController(this, this.connection, chatId);
        //        });
        //    })
        //;
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

    attachConnectionListeners () {
        this.connection.on('disconnect', () => {
            this.widget.makeChatsInactive();
        });

        this.connection.on('new message', data => {
            console.log('new message', data);
            try {
                this.chats[data.chatId].newMessage(data);
            } catch (e) {
                console.log('new message: can not append message to chat ' + data.chatId + ': ', e);
            }
        });

        this.connection.on('new chat', data => {
            try {
                this._createChatInstance(data.chatId);
            } catch (e) {
                console.log('new chat: can not be created ' + data.chatId + ': ', e, 'data:', data);
            }
        });
    }

    /**
     * Invoked from UI widget.
     *
     * @param {string} chatName
     */
    createChat (chatName) {
        this.connection.emit('create chat', {
            chatId: chatName,
            users: [App.session.nickname]
        });
    }

    /**
     * In voked from backend.
     *
     * @param {string} chatName
     */
    newChat (chatName) {
        this.connection.emit('createChat', {
            chatId: chatName,
            users: [App.session.nickname]
        });
    }

    _createChatInstance (chatId) {

        if (this.chats[chatId]) {
            console.warn('Chat ' + chatId + ' is already created.');
        } else {
            this.chats[chatId] = new ChatController(this, this.connection, chatId);

            this.connection.emit('join chat', {
                chatId: chatId,
                nickname: App.session.nickname
            });
        }
    }
}
