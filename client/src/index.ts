import { getElemClass, getElemId } from './utils';

const user = { username: 'someUserName', exp: 5 };

function expToLevel(xp: number) {
    return Math.floor(xp / 10);
}

function levelToExp(level: number) {
    return level * 10;
}

function expToPercentage(exp) {
    const level = expToLevel(exp);
    const nextLevel = level + 1;

    const xpToCurrentlevel = levelToExp(level);
    const remainderXp = exp - xpToCurrentlevel;
    return remainderXp / (levelToExp(nextLevel) - levelToExp(level));
}

export function showProfileButtons() {
    getElemId<HTMLDivElement>('profile-header', true).style.display = 'block';
    getElemId<HTMLDivElement>('profile-header-username', true).innerText =
        user.username;
    getElemId<HTMLDivElement>('profile-header-xp-bar', true).style.width =
        Math.floor(100 * expToPercentage(user.exp)) + '%';
    getElemId<HTMLDivElement>('profile-header-account-level', true).innerText =
        expToLevel(user.exp) + '';
}

export function openAuthPopup() {
    getElemId<HTMLDivElement>('auth-popup').style.display = 'block';
}

export function closeAuthPopup() {
    getElemId<HTMLDivElement>('auth-popup').style.display = 'none';
}

export function showProfilePopup() {
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

const loginErrors = { emailError: '', passwordError: '' };
const registerErrors = { emailError: '', usernameError: '', passwordError: '' };

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
};

export function setIsSignedUp(isSignedUp: boolean) {
    if (isSignedUp) {
        showProfileButtons();
        hideRegisterButtons();
    } else {
        hideProfileButtons();
        showRegisterButtons();
    }
}

user.username = "<script>alert('hi');</script>";
setIsSignedUp(true);
