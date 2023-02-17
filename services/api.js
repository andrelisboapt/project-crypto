const axios = require('axios')

class ApiService {
    constructor(){
        this.api=  axios.create({
            baseURL: 'https://api.coingecko.com/api/v3/search/'
        })
    }
};

