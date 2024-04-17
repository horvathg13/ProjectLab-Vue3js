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
            return response.data
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

    static getProjectParticipants(projectId){
        return this.post(`/api/getprojectparticipants/${projectId}`).then(response=>{
            return response.data
        })
    }

    static getProjects(sortData, filterData){
        return this.post("/api/getprojects", {sortData:sortData, filterData:filterData}).then(response=>{
            return response.data
        })
    }

    static createProject(name, manager, date, projectId){
        return this.post("/api/createproject",{project_name:name, manager_id:manager, date:date, project_id:projectId}).then(response=>{
            return response.data
        })
    }

    static getManagers(){
        return this.post("/api/getManagers").then((response)=>{return response.data})
    }
    static getEmployees(){
        return this.post("/api/getEmployees").then(response=> {
            return response.data
        })
    }
    static createProjectParticipants(participants, projectData, remove){
        return this.post("/api/createparticipants",{participants: participants, project: projectData, remove:remove}).then((response)=>{
            return response.data
        })
    }
    static sendMessage(message, projectId, taskId ){
        return this.post('/api/send-message', {message:message, projectId:projectId, taskId:taskId}).then(response=>{
            return response.data
        })
    }

    static getMessages(projectId, taskId, participants){
        return this.post('/api/get-messages/',{projectId:projectId, taskId:taskId ? taskId : null,participants:participants}).then((response)=>{
            return response.data
        })
    }
    static getButtons(projectId){
        return this.post(`/api/get-buttons/${projectId}`).then((response)=> {
            return response.data
        });
    }
    static getStatus(projectId, taskId){
        return this.post(`/api/get-status/${projectId}/${taskId}`).then((response)=>{
            return response.data
        })
    }
    static setStatus(projectId, taskId, StatusId, priorityId){
        return this.post('/api/set-status', {projectId: projectId, taskId: taskId, StatusId: StatusId, priorityId:priorityId})
    }
    static setFavoriteProject(project){
        return this.post('/api/add-favorite-project', {project: project}).then((response)=>{
            return response.data
        })
    }
    static removeFromFavoriteProject(project){
        return this.post('/api/remove-favorite-project', {project: project}).then((response)=>{
            return response.data
        })
    }
    static leaveProject(projectId){
        return this.post('/api/leave-project', {projectId: projectId}).then((response)=>{
            return response.data
        })
    }
}

export default ServiceClient