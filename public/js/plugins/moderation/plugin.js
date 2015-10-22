import config from 'js/config.js';
import App from 'js/app.js';
import ModerationWidget from './widget.js';
import resourceManager from 'js/utils/resource-manager.js';

export default class ModerationPlugin {
    constructor () {
        this.widget = new ModerationWidget(this);

        App.chatsList.connection.on('moderate message', this.moderatedMessage.bind(this));
    }

    login (login, password) {
        resourceManager
            .login(login, password)
            .then(() => {
                App.session.isAdmin = true;

                this.widget.loginSuccessful();
            })
            .catch(error => {
                console.error(error);
                this.widget.showError(error.message);
            }) // Error handling
        ;
    }

    moderateMessage (messageId, chatId) {
        resourceManager.moderateMessage(messageId, chatId);
    }

    moderatedMessage (data) {
        this.widget.removeModeratedMessage(data.messageId);
    }
}
