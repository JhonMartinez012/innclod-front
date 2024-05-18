import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/"

export default{
    login(email, password){
        const oCredenciales={
            email: email,
            password: password
        }
        return axios.post(BASE_URL+"auth/login", oCredenciales)
    }
}