import a from "axios"

const axios = a.create({ baseURL: 'https://server.testudotracker.com/api' })

axios.interceptors.request.use((config) => {
    config.url += '/'
    return config
})

export default axios