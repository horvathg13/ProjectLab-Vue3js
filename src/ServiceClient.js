import axios from 'axios'
import {store} from "./VuexStore"

class ServiceClient {

    static get(url, config = {}) {
        return axios.get(import.meta.env.VITE_SERVICE_URL+url, {
            ...config,
            headers: {
                ...config.headers,
                Authorization: 'Bearer ' +  window.localStorage.getItem('token') || '',
            }
        }).catch(error=>{
            if(error?.response?.data?.message === "Token has expired"){
                localStorage.removeItem("token");
                store.commit("deleteUserData");
                store.commit("deleteUserRole");

            }
            throw error
        })
    }

    static post(url, data = undefined, config = {}) {
        return axios.post(import.meta.env.VITE_SERVICE_URL+url, data, {
            ...config,
            headers: {
                ...config.headers,
                Authorization: 'Bearer ' +  window.localStorage.getItem('token') || '',
            }
        }).catch(error=>{
            if(error?.response?.data?.message === "Token has expired"){
                localStorage.removeItem("token");
                store.commit("deleteUserData");
                store.commit("deleteUserRole");

            }
            throw error
        })
    }

    static delete(url, config = {}) {
        return axios.delete(import.meta.env.VITE_SERVICE_URL+url, {
            ...config,
            headers: {
                ...config.headers,
                Authorization: 'Bearer ' +  window.localStorage.getItem('token') || '',
            }
        }).catch(error=>{
            if(error?.response?.data?.message === "Token has expired"){
                localStorage.removeItem("token");
                store.commit("deleteUserData");
                store.commit("deleteUserRole");

            }
            throw error
        })
    }
}

export default ServiceClient