import { getServers, isDev } from './auth.service';
import './ui.interface';
import { getElemId } from './utils';

interface IServerStatus {
    name: string;
    region: string;
    subdomain: string;
    players: number;
}

async function loadGame() {
    // fetch server data from the api
    let serverData: IServerStatus[] = [];
    if (!isDev) serverData = await getServers();

    // store the selected server index
    let selectedServerIndex = 0;

    function populateServers(serversStatus: IServerStatus[]) {
        for (let i = 0; i < serversStatus.length; i++) {
            const status = serversStatus[i];

            const optElem = document.createElement('option');
            optElem.innerText = `${status.name} ${status.region} - ${status.players}`;
            getElemId<HTMLSelectElement>('server-select').appendChild(optElem);
        }
    }
    // for each server, append it to the dropdown list
    populateServers(serverData);

    // now listen for clicks on this server select thing
    getElemId<HTMLSelectElement>('server-select', true).onchange = function (
        e,
    ) {
        const selectedIndex = (e.target as HTMLSelectElement).selectedIndex;
        // handle some out of bound error
        selectedServerIndex = Math.max(
            Math.min(selectedIndex, serverData.length - 1),
            0,
        );
    };

    // add event listener to the play button
    getElemId<HTMLButtonElement>('play-btn', true).onclick = function () {
        const username = getElemId<HTMLInputElement>('name-input').value;

        if (isDev) {
            console.log(
                'Will respawn as: ' + username,
                'on the a localhost SERVER',
            );
        } else {
            const selectedServerInfo = serverData[selectedServerIndex];
            console.log(
                'Will respawn as: ' + username,
                'on server',
                selectedServerInfo,
            );
        }
    };
}

loadGame();
