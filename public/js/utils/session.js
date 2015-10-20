import * as localDB from 'js/utils/local-db.js';
import {generateNickname} from 'js/utils/utils.js';

export default class Session {
    constructor () {
        this.nickname = '';

        localDB.readValue('nickname').then(nickname => {
            if (nickname) {
                this.nickname = nickname
            } else {
                this.nickname = generateNickname();

                localDB.storeValue('nickname', this.nickname);
            }
        });

    }
}