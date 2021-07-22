import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8082/api/admin/'

class AdminService {
    exportExcel(data) {
        console.log(authHeader())
        console.log(data)
        return axios.post(API_URL + 'export', data, { headers: authHeader(), responseType: 'blob' });
    }
    // User
    updateUser(user) {

        return axios.put(API_URL + 'update', user, { headers: authHeader() });
    }
    deleteUser(id) {

        return axios.delete(API_URL + 'delete/' + id, { headers: authHeader() });
    }
    createUser(user) {
        return axios.post(API_URL + 'create', user, { headers: authHeader() })
    }
    // Section
    updateSection(section) {
        return axios.put(API_URL + 'section/update', section, { headers: authHeader() });
    }
    createSection(section) {
        return axios.post(API_URL + 'section/create', section, { headers: authHeader() })
    }
    deleteSection(id) {
        return axios.delete(API_URL + 'section/delete/' + id, { headers: authHeader() })
    }
}

export default new AdminService();