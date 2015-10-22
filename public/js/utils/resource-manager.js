import ajaxTransport from 'js/utils/ajax-transport.js';
import socketTransport from 'js/utils/socket-transport.js';

export default {
    getChatConnection () {
        return socketTransport.create('');
    },

    getChatDetails (chatId) {
        return ajaxTransport.GET('chats/' + chatId);
    },

    inviteUserToChat (chatId, nickname) {
        return ajaxTransport.POST('chats/' + chatId + '/users', nickname);
    },

    login (login, password) {
        return ajaxTransport.POST('users/login', {login, password});
    },

    moderateMessage (messageId, chatId) {
        return ajaxTransport.PUT('chats/' + chatId + '/moderate', {messageId});
    }
}