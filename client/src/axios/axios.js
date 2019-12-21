import axios from 'axios';
const instance = axios.create({
    baseURL: 'http://localhost:5001/api/',
    headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.token
    }
});

// Alter defaults after instance has been created
//instance.defaults.headers.common['x-auth-token'] = localStorage.token;
console.log(localStorage.token);

export default instance;