import axios from 'axios';

let authToken = '';

const isDev = /(localhost|127\.0\.0\.1)/.test(location.host);
const baseUrl = isDev ? '' : 'https://account.wilders.io/';

const axiosApiInstance = axios.create();

// Response interceptor for API calls
axiosApiInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async function (error) {
        const originalRequest = error.config;
        if (
            (error.response.status === 403 || error.response.status === 401) &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            const access_token = await requestNewToken();
            authToken = access_token;
            axios.defaults.headers.common['Authorization'] =
                'Bearer ' + access_token;
            return axiosApiInstance(originalRequest);
        }
        return Promise.reject(error);
    },
);

// Request interceptor for API calls
axiosApiInstance.interceptors.request.use(
    async (config) => {
        const token = authToken;
        config.headers = {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        return config;
    },
    (error) => {
        Promise.reject(error);
    },
);

export function getUserData() {
    return axiosApiInstance.get(baseUrl + '/auth/profile', {});
}

export async function sendSignin(email: string, password: string) {
    return fetch(baseUrl + '/auth/local/signin', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });
}

export async function sendSignup(
    username: string,
    email: string,
    password: string,
) {
    return await fetch(baseUrl + '/auth/local/signup', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            email,
            password,
        }),
    });
}

export async function sendSignout() {
    return await fetch(baseUrl + '/auth/logout', {
        method: 'POST',
        credentials: 'include',
    });
}

export function getTokenPayload(token: string) {
    const peices = token.split('.');
    const b64 = peices[1];
    const payload = JSON.parse(atob(b64));
    return payload as { username: string };
}

export async function requestNewToken(): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const res = await fetch(baseUrl + '/auth/refresh', {
            method: 'GET',
            credentials: 'include',
        });

        if (res.status === 200) {
            res.json().then((json) => {
                const { token } = json as { token: string };
                authToken = token;
                resolve(token);
            });
        } else {
            reject('Could not get token!');
        }
    });
}
