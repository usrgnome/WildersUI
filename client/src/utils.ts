// utility functions

export function getElemId<T extends HTMLElement>(
    id: string,
    throws: boolean = false,
): T {
    const elem = document.getElementById(id) as T;
    if (throws && !elem) throw new Error('Could not find element: ' + id);
    return elem;
}

export function getElemClass<T extends HTMLElement>(
    className: string,
    throws: boolean = false,
): T[] {
    const elems = [];
    const query = document.getElementsByClassName(className);

    for (let i = 0; i < query.length; i++) elems.push(query[i]);

    if (throws && elems.length === 0)
        throw new Error('Could not find element: ' + className);
    return elems;
}

export const assert = (cond: boolean, message = 'Failed to assert!') => {
    if (!cond) throw new Error(message);
};

export function expToLevel(xp: number) {
    return Math.floor(xp / 10);
}

export function levelToExp(level: number) {
    return level * 10;
}

export function expToPercentage(exp: number) {
    const level = expToLevel(exp);
    const nextLevel = level + 1;

    const xpToCurrentlevel = levelToExp(level);
    const remainderXp = exp - xpToCurrentlevel;
    return remainderXp / (levelToExp(nextLevel) - levelToExp(level));
}
