import axios from "axios";

const instance = axios.create({
    baseURL: REACT_APP_API_URL,
    headers: {
        Authorization: window.localStorage.getItem("token"),
    },
});

instance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem("token");
    return config;
});

export default instance;
