import {
    getUserData,
    requestNewToken,
    sendSignin,
    sendSignout,
    sendSignup,
} from './auth.service';
import { expToLevel, expToPercentage, getElemId } from './utils';

const user = {
    username: 'someUserName',
    exp: 5,
    currency: 0,
    items: [],
    id: 0,
};

const loginErrors = { emailError: '', passwordError: '' };
const registerErrors = { emailError: '', usernameError: '', passwordError: '' };

export async function showProfileButtons() {
    getUserData()
        .then((res) => {
            const { data } = res;
            user.username = data.username;
            user.currency = data.currency;
            user.id = data.id;
            user.exp = data.exp;

            getElemId<HTMLDivElement>('profile-header', true).style.display =
                'block';
            getElemId<HTMLDivElement>(
                'profile-header-username',
                true,
            ).innerText = user.username;
            getElemId<HTMLDivElement>(
                'profile-header-xp-bar',
                true,
            ).style.width = Math.floor(100 * expToPercentage(user.exp)) + '%';
            getElemId<HTMLDivElement>(
                'profile-header-account-level',
                true,
            ).innerText = expToLevel(user.exp) + '';
        })
        .catch((err) => console.warn(err));
}

export function openAuthPopup() {
    getElemId<HTMLDivElement>('auth-popup').style.display = 'block';
}

export function closeAuthPopup() {
    getElemId<HTMLDivElement>('auth-popup').style.display = 'none';
}

export function showProfilePopup() {
    getElemId<HTMLDivElement>('profile-username', true).innerText =
        user.username;
    getElemId<HTMLDivElement>('profile-currency', true).innerText =
        user.currency + '';
    getElemId<HTMLDivElement>('profile-exp', true).innerText = 0 + '';
    getElemId<HTMLDivElement>('profile-id', true).innerText = user.id + '';
    getElemId<HTMLDivElement>('profile-popup', true).style.display = 'block';
}

export function closeProfilePopup() {
    getElemId<HTMLDivElement>('profile-popup').style.display = 'none';
}

export function hideProfileButtons() {
    getElemId<HTMLDivElement>('profile-header', true).style.display = 'none';
}

export function showRegisterButtons() {
    getElemId<HTMLDivElement>('register-links', true).style.display = 'block';
}

export function hideRegisterButtons() {
    getElemId<HTMLDivElement>('register-links', true).style.display = 'none';
}

function resetAllErrors() {
    loginErrors.emailError = '';
    loginErrors.passwordError = '';
    registerErrors.usernameError = '';
    registerErrors.passwordError = '';
    registerErrors.emailError = '';
}

export function showLoginForm() {
    openAuthPopup();
    getElemId<HTMLDivElement>('login-form', true).style.display = 'block';

    // login errors
    if (loginErrors.emailError) {
        getElemId<HTMLDivElement>('lgn-email-error', true).style.display =
            'block';
        getElemId<HTMLDivElement>('lgn-email-error', true).innerText =
            loginErrors.emailError;
    } else {
        getElemId<HTMLDivElement>('lgn-email-error', true).style.display =
            'none';
    }

    // password errors
    if (loginErrors.passwordError) {
        getElemId<HTMLDivElement>('lgn-password-error', true).style.display =
            'block';
        getElemId<HTMLDivElement>('lgn-password-error', true).innerText =
            loginErrors.passwordError;
    } else {
        getElemId<HTMLDivElement>('lgn-password-error', true).style.display =
            'none';
    }

    resetAllErrors();
}

export function hideLoginForm() {
    getElemId<HTMLDivElement>('login-form', true).style.display = 'none';
}

export function showRegisterForm() {
    openAuthPopup();
    getElemId<HTMLDivElement>('register-form', true).style.display = 'block';

    // username errors
    if (registerErrors.usernameError) {
        getElemId<HTMLDivElement>('reg-username-error', true).style.display =
            'block';
        getElemId<HTMLDivElement>('reg-username-error', true).innerText =
            registerErrors.usernameError;
    } else {
        getElemId<HTMLDivElement>('reg-username-error', true).style.display =
            'none';
    }

    // email errors
    if (registerErrors.emailError) {
        getElemId<HTMLDivElement>('reg-email-error', true).style.display =
            'block';
        getElemId<HTMLDivElement>('reg-email-error', true).innerText =
            registerErrors.emailError;
    } else {
        getElemId<HTMLDivElement>('reg-email-error', true).style.display =
            'none';
    }

    // password errors
    if (registerErrors.passwordError) {
        getElemId<HTMLDivElement>('reg-password-error', true).style.display =
            'block';
        getElemId<HTMLDivElement>('reg-password-error', true).innerText =
            registerErrors.passwordError;
    } else {
        getElemId<HTMLDivElement>('reg-password-error', true).style.display =
            'none';
    }

    resetAllErrors();
}

export function hideRegisterForm() {
    getElemId<HTMLDivElement>('register-form', true).style.display = 'none';
}

getElemId<HTMLElement>('profile-header-open-profile-btn', true).onclick =
    function () {
        showProfilePopup();
    };

getElemId<HTMLElement>('lgn-popup-close-btn', true).onclick = function () {
    closeAuthPopup();
};

getElemId<HTMLElement>('profile-popup-close-btn', true).onclick = function () {
    closeProfilePopup();
};

getElemId<HTMLElement>('goto-signup-form', true).onclick = function (e) {
    e.preventDefault();
    hideLoginForm();
    showRegisterForm();
};

getElemId<HTMLElement>('goto-login-form', true).onclick = function (e) {
    e.preventDefault();
    hideRegisterForm();
    showLoginForm();
};

getElemId<HTMLElement>('login-btn', true).onclick = function (e) {
    hideRegisterForm();
    showLoginForm();
};

getElemId<HTMLElement>('register-btn', true).onclick = function (e) {
    hideLoginForm();
    showRegisterForm();
};

getElemId<HTMLElement>('logout-btn', true).onclick = function (e) {
    hideProfileButtons();
    showRegisterButtons();
    closeProfilePopup();
    sendSignout();
};

getElemId<HTMLElement>('submit-register-btn', true).onclick = function (e) {
    const username = getElemId<HTMLInputElement>('reg-username', true).value;
    const email = getElemId<HTMLInputElement>('reg-email', true).value;
    const password = getElemId<HTMLInputElement>('reg-password', true).value;

    sendSignup(username, email, password)
        .then((res) => {
            if (res.status === 400) {
                res.json().then((json) => {
                    const message = json.message;
                    let foundEmailIssue = false;
                    let foundPasswordIssue = false;
                    let foundUsernameIssue = false;
                    for (let i = 0; i < message.length; i++) {
                        const text = message[i];
                        if (!foundEmailIssue && text.match(/email/)) {
                            foundEmailIssue = true;
                            registerErrors.emailError = text;
                        } else if (
                            !foundUsernameIssue &&
                            text.match(/username/)
                        ) {
                            foundUsernameIssue = true;
                            registerErrors.usernameError = text;
                        } else if (
                            !foundPasswordIssue &&
                            text.match(/password/)
                        ) {
                            foundPasswordIssue = true;
                            registerErrors.passwordError = text;
                        }
                    }

                    if (!foundEmailIssue) registerErrors.emailError = '';
                    if (!foundPasswordIssue) registerErrors.passwordError = '';
                    if (!foundUsernameIssue) registerErrors.usernameError = '';
                    showRegisterForm();
                });
            } else if (res.status === 403) {
                registerErrors.emailError = '';
                registerErrors.passwordError = '';
                registerErrors.usernameError = 'username or email exists';
                showRegisterForm();
            } else if (res.status === 201) {
                registerErrors.emailError = '';
                registerErrors.passwordError = '';
                registerErrors.usernameError = '';
                closeAuthPopup();
                hideRegisterButtons();
                showProfileButtons();
            } else {
                console.log(res);
            }
        })
        .catch((err) => {
            console.log('err', err);
        });
};

getElemId<HTMLElement>('submit-signin-btn', true).onclick = function (e) {
    const email = getElemId<HTMLInputElement>('lgn-email', true).value;
    const password = getElemId<HTMLInputElement>('lgn-password', true).value;

    sendSignin(email, password)
        .then((res) => {
            if (res.status === 400) {
                res.json().then((json) => {
                    const message = json.message;
                    let foundEmailIssue = false;
                    let foundPasswordIssue = false;
                    for (let i = 0; i < message.length; i++) {
                        const text = message[i];
                        if (!foundEmailIssue && text.match(/email/)) {
                            foundEmailIssue = true;
                            loginErrors.emailError = text;
                        } else if (
                            !foundPasswordIssue &&
                            text.match(/password/)
                        ) {
                            foundPasswordIssue = true;
                            loginErrors.passwordError = text;
                        }
                    }

                    if (!foundEmailIssue) loginErrors.emailError = '';
                    if (!foundPasswordIssue) loginErrors.passwordError = '';
                    showLoginForm();
                });
            } else if (res.status === 403) {
                loginErrors.emailError = 'username or password incorrect!';
                loginErrors.passwordError = '';
                showLoginForm();
            } else if (res.status === 200) {
                loginErrors.emailError = '';
                loginErrors.passwordError = '';
                closeAuthPopup();
                hideRegisterButtons();
                showProfileButtons();
            } else {
                console.log(res);
            }
        })
        .catch((err) => {
            console.log('err', err);
        });
};

requestNewToken()
    .then((token) => {
        hideRegisterButtons();
        showProfileButtons();
    })
    .catch((err) => {
        console.warn(err);
    });
