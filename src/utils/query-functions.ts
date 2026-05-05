import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function get(url:string) {
        const res = await axios.get(`${API_BASE_URL}/api${url}`, {withCredentials: true});
        return res;
}

async function post(url:string, data: any) {
        const res = await axios.post(`${API_BASE_URL}/api${url}`, data, {withCredentials: true});
        return res;
}

async function put(url:string, data: any) {
        const res = await axios.put(`${API_BASE_URL}/api${url}`, data, {withCredentials: true});
        return res;
}

// queries
const createUser = async (userData: {name: string, email: string, password: string}) => {
        return await post('/auth/register', userData);
}

const loginUser = async (userData: {email: string, password: string}) => {
        return await post('/auth/login', userData);
}

const getMe = async () => {
        return await get('/auth/me');
}

const postLogout = async () => {
        return await post('/auth/logout', {});
}


export {
    createUser,
    loginUser,
    getMe,
    postLogout,
}