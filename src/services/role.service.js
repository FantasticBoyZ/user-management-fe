import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8082/api/usermanagement/'

class RoleService{
    getAllRoles(){
        return axios.get( API_URL + 'role',{headers: authHeader()});
    }
}

export default new RoleService();