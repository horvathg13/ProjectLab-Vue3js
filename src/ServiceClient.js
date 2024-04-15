import axios from 'axios'
import {store} from "./VuexStore"

class ServiceClient {

    static get(url, config = {}) {
        return axios.get(import.meta.env.VITE_SERVICE_URL + url, {
            ...config,
            headers: {
                ...config.headers,
                Authorization: 'Bearer ' + window.localStorage.getItem('token') || '',
            }
        }).catch(error => {
            if (error?.response?.data?.message === "Token has expired") {
                localStorage.removeItem("token");
                store.commit("deleteUserData");
                store.commit("deleteUserRole");

            }
            throw error
        })
    }

    static post(url, data = undefined, config = {}) {
        return axios.post(import.meta.env.VITE_SERVICE_URL + url, data, {
            ...config,
            headers: {
                ...config.headers,
                Authorization: 'Bearer ' + window.localStorage.getItem('token') || '',
            }
        }).catch(error => {
            if (error?.response?.data?.message === "Token has expired") {
                localStorage.removeItem("token");
                store.commit("deleteUserData");
                store.commit("deleteUserRole");

            }
            throw error
        })
    }

    static delete(url, config = {}) {
        return axios.delete(import.meta.env.VITE_SERVICE_URL + url, {
            ...config,
            headers: {
                ...config.headers,
                Authorization: 'Bearer ' + window.localStorage.getItem('token') || '',
            }
        }).catch(error => {
            if (error?.response?.data?.message === "Token has expired") {
                localStorage.removeItem("token");
                store.commit("deleteUserData");
                store.commit("deleteUserRole");

            }
            throw error
        })
    }

    static login(email, password) {
        return this.post("/api/login", {email: email, password: password});
    }

    static register(name, email, password, c_password) {
        return this.post("/api/register", {
            name: name,
            email: email,
            password: password,
            confirm_password: c_password
        });
    }

    static getNotifications() {
        return this.post('/api/notifications').then(response => {
            store.commit("getNotifications", response.data);
        }).catch(error => {
            console.log(error);
        });
    }

    static getManagerNotifications() {
        return this.post('/api/get-manager-notification').then(response => {
            store.commit("getManagerNotifications", response.data);
        }).catch(error => {
            console.log(error);
        });
    }

    static getUserRoles() {
        return this.post('/api/getUserRole').then(response => {
            store.commit("setuserRole", response.data)
        }).catch(error => {
            console.log(error);
        });
    }

    static createUser(name,email){
        return this.post("/api/createuser",{name:name,email:email});
    }

    static getUsers(){
        return this.post("/api/getusers").then((response)=>{
            return response.data
        })
    }
    static getRoles(){
        return this.post("/api/getroles").then((response)=>{
            return response.data.roles
        })
    }

    static banUser(id){
        return this.post(`/api/ban-user/${id}`).then((response)=>{
               return this.getUsers()
        })
    }

    static passwordResetManual(id){
        return this.post(`/api/password-reset-manual/${id}`);
    }

    static userToRole(user_id, selectedRole, remove){
        return this.post('/api/user-to-role/',{user_id:user_id, selectedRole:selectedRole, remove:remove}).then(()=>{
            this.getUsers()
        })
    }
    static getUsersButton(){
        return this.post('/api/get-users-buttons').then(response => {
            if (response.status == 200){
                return response.data.admin.slice(0,3)
            }

        })
    }
    static accessAdmin() {
        return new Promise((resolve, reject) => {
            this.post('/api/getUserRole').then(response => {
                store.commit("setuserRole", response.data)
                const userRole = response.data
                const isAdmin = userRole.some(item => item.role === "Admin");
                if(isAdmin === true){
                    resolve(isAdmin);
                }else{
                    reject('Access Denied')
                }
            }).catch(error => {
                reject(error);
            });
        });
    }

    static findUserByToken(token){
        return this.get(`/api/findUser/${token}`).then(response=>{
            return response.data
        })
    }

    static resetPassword(email, password, c_password){
        return this.post("/api/resetpassword", {email:email, password:password, confirm_password:c_password}).then((response)=>{
            return response.data
        })
    }
}

export default ServiceClient