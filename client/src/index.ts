import './ui.interface';
import { getElemId } from './utils';

getElemId<HTMLButtonElement>('play-btn', true).onclick = function () {
    const username = getElemId<HTMLInputElement>('name-input').value;
    const selectedServerInfo = serverData[selectedServerIndex];
    console.log('Will respawn as: ' + username, "on server", selectedServerInfo);
};

interface IServerStatus {
    name: string;
    region: string;
    subdomain: string;
    players: number;
}

function populateServers(serversStatus: IServerStatus[]) {
    for (let i = 0; i < serversStatus.length; i++) {
        const status = serversStatus[i];

        const optElem = document.createElement('option');
        optElem.innerText = `${status.name} ${status.region} - ${status.players}`;
        getElemId<HTMLSelectElement>('server-select').appendChild(optElem);
    }
}

let selectedServerIndex = 0;

// normally this would be some sort of API response from the game...
const serverData = [
    {
        name: 'EU#1',
        region: 'Europe',
        subdomain: 'eu1',
        players: 100,
    },
    {
        name: 'AU#1',
        region: 'Aus',
        subdomain: 'au1',
        players: 10,
    },
];

populateServers(serverData);

// now listen for clicks on this thing
getElemId<HTMLSelectElement>('server-select', true).onchange = function (e) {
    const selectedIndex = (e.target as HTMLSelectElement).selectedIndex;
    // handle some out of bound error
    selectedServerIndex = Math.max(Math.min(selectedIndex, serverData.length - 1), 0);
};

/*

    <option region="SCA2">USA#2 California - 45</option>

*/
