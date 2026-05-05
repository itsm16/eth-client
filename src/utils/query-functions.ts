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

// async function put(url:string, data: any) {
//         const res = await axios.put(`${API_BASE_URL}/api${url}`, data, {withCredentials: true});
//         return res;
// }

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

const getUsers = async () => {
        return await get(`/auth/users`);
}

const postLogout = async () => {
        return await post('/auth/logout', {});
}

// projects
const getUserProjects = async (userId: number) =>{
        return await get(`/projects/user/${userId}`);
}

// tasks
const getProjectTasks = async (projectId: number) =>{
        return await get(`/projects/${projectId}/tasks`);
}

const createTask = async (taskData: {projectId: string, title: string, description: string, assignedTo: string}) =>{
        return await post(`/projects/${taskData.projectId}/tasks`, taskData);
}

const updateTaskStatus = async (projectId: string, taskId: string, status: string) => {
    return await axios.patch(`${API_BASE_URL}/api/projects/${projectId}/tasks/${taskId}/status`, {status}, {withCredentials: true});
}

// admin project management
const getAllProjects = async () => {
    return await get('/projects');
}

const createProject = async (projectData: {name: string}) => {
    return await post('/projects', projectData);
}

const deleteProject = async (projectId: string) => {
    return await axios.delete(`${API_BASE_URL}/api/projects/${projectId}`, {withCredentials: true});
}

// member management
const assignMember = async (projectId: string, userId: number) => {
    return await post(`/projects/${projectId}/members`, {userId});
}

const removeMember = async (projectId: string, userId: string) => {
    return await axios.delete(`${API_BASE_URL}/api/projects/${projectId}/members/${userId}`, {withCredentials: true});
}

const getProjectMembers = async () => {
    return await get('/projects/members');
}

export {
    createUser,
    loginUser,
    getMe,
    getUsers,
    postLogout,
    getUserProjects,
    getProjectTasks,
    createTask,
    updateTaskStatus,
    getAllProjects,
    createProject,
    deleteProject,
    assignMember,
    removeMember,
    getProjectMembers,
}
