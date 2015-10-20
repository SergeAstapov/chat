import ajaxTransport from 'js/utils/ajax-transport.js';
import socketTransport from 'js/utils/socket-transport.js';

export default {
    getChatConnection (chatId) {
        return socketTransport.create('');
    },

    getChatDetails (chatId) {
        return ajaxTransport.GET('chats/' + chatId);
    },

    inviteUserToChat (chatId, nickname) {
        return ajaxTransport.POST('chats/' + chatId + '/users', nickname);
    }
}