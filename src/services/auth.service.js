import axios from 'axios';

const API_URL = 'http://localhost:8082/api/auth/';

class AuthService{
    login(user){
        return axios
            .post(API_URL+ 'signin',{
                username: user.username,
                password: user.password
            })
            .then(response => {
                console.log(response.data);
                if(response.data.token){

                    console.log(response.data.token+" tesst");
                    localStorage.setItem('user',JSON.stringify(response.data));
                }

                return response.data;
            });
    }
    logout(){
        localStorage.removeItem('user');

    }

    register(user){
        console.log(user);
        return axios.post(API_URL + 'signup',{
            username: user.username,
            password: user.password,
            fullName: user.fullName,
            dateOfBirth: user.dateOfBirth,
            address: user.address,
            description: user.description,
        });
    }
}

export default new AuthService();