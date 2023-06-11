import axios from 'axios'

class ServiceClient {

    static get(url, config = {}) {
        return axios.get(url, {
            ...config,
            headers: {
                ...config.headers,
                Authorization: 'Bearer ' +  window.localStorage.getItem('token') || '',
            }
        })
    }

    static post(url, data = undefined, config = {}) {
        return axios.post(url, data, {
            ...config,
            headers: {
                ...config.headers,
                Authorization: 'Bearer ' +  window.localStorage.getItem('token') || '',
            }
        })
    }

    static delete(url, config = {}) {
        return axios.delete(url, {
            ...config,
            headers: {
                ...config.headers,
                Authorization: 'Bearer ' +  window.localStorage.getItem('token') || '',
            }
        })
    }
}

export default ServiceClient