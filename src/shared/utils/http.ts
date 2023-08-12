import axios from 'axios';

const httpClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        Accept: 'application/json',
    },
});

httpClient.defaults.withCredentials = true;

// Add a request interceptor for adding access_token
// httpClient.interceptors.request.use(function (config) {
//     const token = localStorage.getItem('access_token');
//     config.headers.Authorization = token;

//     console.log(token);

//     return config;
// });

export { httpClient };
