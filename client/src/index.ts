import './ui.interface';
import { getElemId } from './utils';

getElemId<HTMLButtonElement>('play-btn').onclick = function () {
    const username = getElemId<HTMLInputElement>('username-input').value;
    console.log("Will respawn as: " + username);
};
