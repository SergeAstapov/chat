const LSPrefix = 'test-chat.';

export function readValue (key) {
    return new Promise(function (resolve, reject) {
        try {
            let value = localStorage.getItem(LSPrefix + key);

            if (value) {
                resolve(JSON.parse(value));
            } else {
                resolve();
            }
        } catch (e) {
            reject();
        }
    });
}

export function storeValue (key, value) {
    return new Promise(function (resolve, reject) {
        try {
            localStorage.setItem(LSPrefix + key, JSON.stringify(value));

            resolve();
        } catch (e) {
            reject();
        }
    });
}