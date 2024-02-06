const axios = require('axios');

const successDingTalkAxios = () => {

}

const failDingTalkAxios = () => {

}

async function requestUrlAxios(requestUrl) {
    return await axios.get(requestUrl).then(response => {
        return response.data;
    }).catch(reason => {
        console.error('Promise rejected with reason:', reason);
        return null;
    });
}

async function afterRequestUrlAxios(requestUrl) {
    await axios.get(requestUrl).then(response => {
        const data = response.data;
        console.log("axios.get request_url的值: " + JSON.stringify(data))
        process.env.AFTER_DATA = JSON.stringify(data);
        console.log("process.env.AFTER_DATA_AXIOS")
        console.log(process.env.AFTER_DATA)
    }).catch(reason => {
        console.error('Promise rejected with reason:', reason);
        return null;
    });
}


module.exports = {
    requestUrlAxios,
    afterRequestUrlAxios
};