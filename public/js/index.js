import ChatsList from 'js/controllers/chats-list.js';
import App from 'js/app.js';
import Session from 'js/utils/session.js';
import * as layout from 'js/views/layout.js';

export default function () {
    App.session = new Session();
    App.element = layout.build();
    App.chatsList = new ChatsList();
};