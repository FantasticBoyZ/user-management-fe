import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8082/api/usermanagement/'

class UserService {
    getPublicContent() {
        return axios.get(API_URL + 'all', { headers: authHeader() });

    }
    getUserBoard() {
        return axios.get(API_URL + 'user', { headers: authHeader() });

    }
    getUserSearch(params) {
        console.log(params)
        return axios.get(API_URL + 'user/search', { headers: authHeader(), params: params });

    }
    getSearchAdvance(params) {
        return axios.get(API_URL + 'user/advancedsearch', { headers: authHeader(), params: params });

    }

    getAdminBoard() {
        return axios.get(API_URL + 'user', { headers: authHeader() });
    }
}

export default new UserService();