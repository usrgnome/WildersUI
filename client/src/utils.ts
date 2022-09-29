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

export function hasAny(array1: RegExp[], array2: string[]) {
    for (let i = 0; i < array1.length; i++)
        for (let u = 0; u < array2.length; u++)
            if (array2[u].match(array1[i])) return array2[u];
    return '';
}

export const assert = (cond: boolean, message = 'Failed to assert!') => {
    if (!cond) throw new Error(message);
};
