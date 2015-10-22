const template = '' +
    '<button class="chat-moderation-btn">Sign in</button>' +
    '<form class="chat-moderation-login">' +
        '<input name="login" placeholder="Login">' +
        '<input name="password" placeholder="Password" type="password">' +
        '<input name="submit" type="submit" value="Became Grammar Nazi!">' +
    '</form>'
;

/**
 *
 * @param {ModerationWidget} widget
 * @returns {HTMLElement}
 */
export function build (widget) {
    var documentFragment = document.createRange().createContextualFragment(template);

    var element = document.createElement('div');
    element.className = 'chat-moderation';
    element.appendChild(documentFragment);

    bindListeners(element, widget);

    return element;
}

/**
 *
 * @param element
 * @param {ModerationWidget} widget
 */
function bindListeners (element, widget) {
    let elShowBtn  = element.querySelector('.chat-moderation-btn');
    let elForm     = element.querySelector('form.chat-moderation-login');
    let elLogin    = element.querySelector('input[name="login"]');
    let elPassword = element.querySelector('input[name="password"]');

    if (elForm) {
        elForm.style.display = 'none';

        elShowBtn.addEventListener('click', function (event) {
            event.preventDefault();

            elForm.style.display = '';
            setTimeout(function () {
                elLogin.focus();
            }, 0);
        });

        elForm.addEventListener('submit', function (event) {
            event.preventDefault();

            widget.login(elLogin.value, elPassword.value);

            var elError = element.querySelector('.error');

            if (elError) {
                elError.parentNode.removeChild(elError);
            }
        });
    }
}
